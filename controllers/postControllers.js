const Post = require('../models/postModel')
const User = require('../models/userModel')
const path = require('path')
const fs = require('fs')
const {v4: uuid} = require('uuid')
const HttpError = require('../models/errorModel')




//-----------------CREATE POST--------------------
const createPost = async (req, res, next) => {
    try {
        let {title, category, description} = req.body;
        if(!title || !category || !description || !req.files) {
            return next(new HttpError("Fill in all the fields and choose thumbnail", 422))
        }

        const {thumbnail} = req.files;
        //chceck file size
        if(thumbnail.size > 2000000) {
            return next(new HttpError("Thumbnail is too big. File should be less than 2mb", 422))
        }

        let fileName = thumbnail.name;
        let splittedFilename = fileName.split('.')
        let newFileName = splittedFilename[0] + uuid() + '.' + splittedFilename[splittedFilename.length - 1]
        thumbnail.mv(path.join(__dirname, '..', '/uploads', newFileName), async (err) => {
            if(err) {
                return next(new HttpError(err))
            } else {
                const newPost = await Post.create({title, category, description, thumbnail: newFileName, creator: req.user.id})
                if(!newPost) {
                    return next(new HttpError("Post couldn't be create", 422))
                }
                
                //find user and increase post count
                const currentUser = await User.findById(req.user.id);
                const userPostCount = currentUser.posts + 1;
                await User.findByIdAndUpdate(req.user.id, {posts: userPostCount})

                res.status(201).json(newPost)
            }
        })
    } catch (error) {
        return next(new HttpError(error))
    }
}









//-----------------GET ALL POSTS--------------------
//GET: api/posts
//UNPROTECTED
const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find()
        res.status(201).json(posts)
    } catch (error) {
       return next(new HttpError(error)) 
    }
}








//-----------------GET SINGLE POST--------------------
// POST : api/posts/:id
// UNPROTECTED
const getPost = async (req, res, next) => {
    try {
       const postId = req.params.id;
       const post = await Post.findById(postId);
       if(!post) {
            return next(new HttpError("Post not found.", 404))
       } 
       res.status(200).json(post)
    } catch (error) {
        return next(new HttpError(error))
    }
}











//-----------------GET POSTS BY CATEGORY--------------------
// GET : api/posts/categories/:category
// UNPROTECTED
const getCatPosts = async (req, res, next) => {
    try {
        const {category} = req.params;
        const catPosts = await Post.find({category}).sort({createdAt: -1})
        res.status(200).json(catPosts)
    } catch (error) {
        return next(new HttpError(error))
    }
}









//-----------------GET AUTHORS POSTS--------------------
// GET : api/posts/users/:id
// UNPROTECTED
const getUserPost = async (req, res, next) => {
    try {
        const {id} = req.params;
        const posts = await Post.find({creator: id}).sort({createdAt: -1})
        res.status(200).json(posts)
    } catch (error) {
        return next(new HttpError(error))
    }
}









//-----------------EDIT POST--------------------
// PATCH: api/posts/:id
// PROTECTED
const editPost = async (req, res, next) => {
   try {
        let fileName;
        let newFileName;
        let updatedPost;
        const postId = req.params.id;
        let {title, category, description} = req.body;
    
        // ReactQuill has a paragraph opening and closing tag with a break tag in between so there are 11 characters in there already.
        if(!title || !category || description.length < 12) {
            return next(new HttpError("Fill in all the fields", 422))
        }

        // get old post from db
        const oldPost = await Post.findById(postId);
        if(req.user.id == oldPost.creator) {
        if(!req.files) {
            updatedPost = await Post.findByIdAndUpdate(postId, {title, category, description}, {new: true})
        } else {
            
            // delete old thumbnail from upload
            fs.unlink(path.join(__dirname, '..', 'uploads', oldPost.thumbnail), async (err) => {
                if(err) {
                    return next(new HttpError(err))
                }
            })

            //upload new thumbnail
            const {thumbnail} = req.files;
            //check file size
            if(thumbnail.size > 2000000) {
                return next(new HttpError("Thumbnail too big. Should be less than 2mb"))
            }

            fileName = thumbnail.name;
            let splittedFileName = fileName.split('.')
            newFileName = splittedFileName[0] + uuid() + '.' + splittedFileName[splittedFileName.length - 1]
            thumbnail.mv(path.join(__dirname, '..', 'uploads', newFileName), async (err) => {
                if(err) {
                    return next(new HttpError(err))
                }
            })

            updatedPost = await Post.findByIdAndUpdate(postId, {title, category, description, thumbnail: newFileName}, {new: true})
        }
    }
        if(!updatedPost) {
            return next(new HttpError("Couldn't update the post", 400))
        }

        res.status(200).json(updatedPost)
   } catch (error) {
        return next(new HttpError(error))
   }
}









//----------------DELETE POST--------------------
// DELETE : api/posts/:id
// PROTECTED
const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id;
        if(!postId) {
            return next(new HttpError("Post unavailable", 400))
        }

        const post = await Post.findById(postId);
        const fileName = post?.thumbnail;

        if(req.user.id == post.creator) {
            //delete thumbnail from uploads folder
            fs.unlink(path.join(__dirname, '..', 'uploads', fileName), async (err) => {
                if(err) {
                    return next(new HttpError(err))
                } else {
                    await Post.findByIdAndDelete(postId);
                    //find user and reduce post count by 1
                    const currentUser = await User.findById(req.user.id);
                    const userPostCount = currentUser?.posts - 1;
                    await User.findByIdAndUpdate(req.user.id, {posts: userPostCount})

                    res.json(`Post ${postId} deleted successfully.`)

                }
            })
        } else {
            return next(new HttpError("Post couldn't be deleted", 403))
        }
    } catch (error) {
        return next(new HttpError(error))
    }
}




module.exports = {createPost, getPosts, getPost, getCatPosts, getUserPost, editPost, deletePost}