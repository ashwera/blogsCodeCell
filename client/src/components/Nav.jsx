import React from 'react'
import { NavLink } from 'react-router-dom'
import './Nav.css'

const Nav = () => {
  return (
    <header className="top-nav">
      <div className="brand">codecell blogs</div>
      <nav className="nav-tabs">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          .home
        </NavLink>
        <NavLink to="/blogs" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          .blogs
        </NavLink>
        <NavLink to="/login" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          .submit
        </NavLink>
      </nav>
    </header>
  )
}

export default Nav
