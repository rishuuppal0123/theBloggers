import React from 'react'
import LoadingGif from '../images/loading.gif'

const Loader = () => {
  return (
    <div className="loader">
        <div className="loader__image">
            <img src={LoadingGif} alt="loader"/>
        </div>
    </div>
  )
}

export default Loader