import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import './Nav.css'

const Nav = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className="top-nav">
      <button
        className="brand brand-btn"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        codecell blogs
      </button>
      <nav className="nav-tabs">
        <NavLink
          to="/"
          end
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          .home
        </NavLink>
        <NavLink
          to="/blogs"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          .blogs
        </NavLink>
        <NavLink
          to="/admin"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          .admin
        </NavLink>
        {user && (
          <button className="nav-link" onClick={handleLogout}>
            .sign out
          </button>
        )}
      </nav>
    </header>
  )
}

export default Nav
