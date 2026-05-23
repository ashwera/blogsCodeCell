import React from 'react'
import { useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'

const Home = () => {
  const navigate = useNavigate()

  return <Hero onBrowse={() => navigate('/blogs')} />
}

export default Home
