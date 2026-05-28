import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext'
import Nav from './components/Nav'
import Home from './pages/Home'
import Blogs from './pages/Blogs'
import BlogDetail from './pages/BlogDetail'
import WritePage from './pages/Write'
import AdminPage from './pages/admin/AdminPage'
import './App.css'

const DarkModeOnly = () => {
  useEffect(() => {
    document.body.classList.remove('light')
    localStorage.setItem('cc_theme', 'dark')
  }, [])

  return null
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
      <DarkModeOnly />
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/write" element={<WritePage />} />
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
