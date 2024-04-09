import React, {useContext} from 'react'
import Login from './Login'
import { UserContext } from '../context/userContext'

const Home = () => {
  const {setCurrentUser} = useContext(UserContext)

  setCurrentUser(null);
  return (
    <Login/>
  )
}

export default Home