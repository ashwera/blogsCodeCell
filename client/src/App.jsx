import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider } from './lib/AuthContext'
import Nav from './components/Nav'
import Home from './pages/Home'
import Blogs from './pages/Blogs'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Requests from './pages/admin/Requests'
import BlogDetail from './pages/BlogDetail'
import PortalLogin from './pages/portal/PortalLogin'
import PortalLayout from './pages/portal/PortalLayout'
import PortalSubmit from './pages/portal/PortalSubmit'
import PortalSubmissions from './pages/portal/PortalSubmissions'
import './App.css'

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
      <BrowserRouter>
        <Routes>
          {/* Public site */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blogs/:id" element={<BlogDetail />} />
          </Route>

          {/* Auth */}
          <Route path="/login" element={<PortalLogin />} />

          {/* Contributor portal */}
          <Route path="/portal" element={<PortalLayout />}>
            <Route index element={<PortalSubmit />} />
            <Route path="submissions" element={<PortalSubmissions />} />
          </Route>

          {/* Admin */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="requests" element={<Requests />} />
          </Route>

          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
