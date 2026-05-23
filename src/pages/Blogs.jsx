import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import BlogList from '../components/BlogList'

const Blogs = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const focusSearch = searchParams.get('focus') === 'search'

  return (
    <div className="blogs-page">
      <BlogList onBack={() => navigate('/')} focusSearch={focusSearch} />
    </div>
  )
}

export default Blogs
