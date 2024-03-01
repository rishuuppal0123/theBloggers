import React, { useContext, useEffect, useState } from 'react'
import PostItem from '../components/PostItem'
import axios from 'axios'
import Loader from '../components/Loader'
import { useParams } from 'react-router-dom'
import { UserContext } from '../context/userContext'

const AuthorPosts = () => {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] =useState(false)

  const {id} = useParams()
  const {currentUser} = useContext(UserContext)
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/users/${id}`)
        setPosts(response?.data)

      } catch (err) {
        console.log(err)
      }

      setIsLoading(false)
    }

    fetchPosts();
  }, [id])

  if(isLoading) {
    return <Loader/>
  }

  return (
    <section className='posts'>
        {posts.length > 0 ? <div className="container posts__container">
          {/* <div className="container author__info">
            <h4>{currentUser.name}</h4>
          </div> */}
            {
                posts.map(({_id: id, thumbnail, category, title, description, creator, createdAt}) => <PostItem key={id} postId={id} thumbnail={thumbnail} category = {category} title = {title} desc = {description} authorId = {creator} createdAt = {createdAt}/>)
            }
        </div>  : <h2 className='center'>No posts found! 😢 </h2>}
    </section>
  )
}

export default AuthorPosts