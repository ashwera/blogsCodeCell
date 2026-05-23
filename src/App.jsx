import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext'
import Nav from './components/Nav'
import Home from './pages/Home'
import Blogs from './pages/Blogs'
import BlogDetail from './pages/BlogDetail'
import AdminPage from './pages/admin/AdminPage'
import { Moon, Sun } from 'lucide-react'
import './App.css'

const ThemeToggle = () => {
  const [isLight, setIsLight] = useState(
    () => localStorage.getItem('cc_theme') === 'light',
  )

  useEffect(() => {
    if (isLight) {
      document.body.classList.add('light')
      localStorage.setItem('cc_theme', 'light')
    } else {
      document.body.classList.remove('light')
      localStorage.setItem('cc_theme', 'dark')
    }
  }, [isLight])

  return (
    <button
      onClick={() => setIsLight(!isLight)}
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 50,
        background: 'var(--hover-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '50%',
        width: '3rem',
        height: '3rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: 'var(--text-color)',
      }}
      aria-label="Toggle Theme"
    >
      {isLight ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  )
}

const PublicLayout = () => (
  <>
    <Nav />
    <main className="app-main">
      <Outlet />
    </main>
  </>
)

function App() {
  return (
    <AuthProvider>
      <ThemeToggle />
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/blogs" element={<Blogs />} />
          </Route>

          {/* Blog detail has its own scroll-reactive header */}
          <Route path="/blogs/:id" element={<BlogDetail />} />

          {/* Admin — handles its own auth state internally */}
          <Route path="/admin" element={<AdminPage />} />

          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
