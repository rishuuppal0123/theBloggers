import React from 'react'
import { Link } from 'react-router-dom'
import {FaTwitter} from 'react-icons/fa'
import {FaFacebook} from 'react-icons/fa'
import {FaInstagram} from 'react-icons/fa'


const Footer = () => {
  return (
    <footer>
      <ul className="footer__categories">
        <li><Link to="/posts/categories/Agriculture">Agriculture</Link></li>
        <li><Link to="/posts/categories/Business">Business</Link></li>
        <li><Link to="/posts/categories/Education">Education</Link></li>
        <li><Link to="/posts/categories/Entertainment">Entertainment</Link></li>
        <li><Link to="/posts/categories/Art">Art</Link></li>
        <li><Link to="/posts/categories/Investment">Investment</Link></li>
        <li><Link to="/posts/categories/Weather">Weather</Link></li>
        <li><Link to="/posts/categories/Uncategorized">Uncategorized</Link></li>
      </ul>
      <div className="footer__copyright"> 
      {/* // flex flex-col justify-between pt-5 pb-10 border-t border-gray-800 sm:flex-row */}
        <div className='footer__icons'>
          {/* flex items-center mt-4 space-x-4 sm:mt-0 */}
            <a href="https://twitter.com/rishuuppal28" ><FaTwitter className='icon'/></a>
            <a href="https://instagram.com/rishu_uppal28" ><FaInstagram className='icon'/></a>
            <a href="https://www.facebook.com/rishav.uppal.581/" ><FaFacebook className='icon'/></a>            
        </div>
        <small>© Copyright 2024 | All rights reserved.</small>
      </div>
    </footer>
  )
}

export default Footer