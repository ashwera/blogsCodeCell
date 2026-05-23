import React from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import BlogList from '../components/BlogList'

const Blogs = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const focusSearch = searchParams.get('focus') === 'search'

  return <BlogList onBack={() => navigate('/')} focusSearch={focusSearch} />
}

export default Blogs
