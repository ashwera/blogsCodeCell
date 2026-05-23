import React from 'react'
import { useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="home-page">
      <Hero onBrowse={() => navigate('/blogs')} />
    </div>
  )
}

export default Home
