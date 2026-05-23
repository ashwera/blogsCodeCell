import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import './Nav.css'

const Nav = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  if (!user) {
    return null
  }

  return (
    <header className="top-nav">
      <button className="admin-link" onClick={() => navigate('/admin')}>
        .admin
      </button>
      <button className="signout-link" onClick={handleLogout}>
        .sign out
      </button>
    </header>
  )
}

export default Nav
