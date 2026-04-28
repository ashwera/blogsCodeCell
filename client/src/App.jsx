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
import { Moon, Sun } from 'lucide-react'

const ThemeToggle = () => {
  const [isLight, setIsLight] = React.useState(
    () => localStorage.getItem('cc_theme') === 'light'
  );

  React.useEffect(() => {
    if (isLight) {
      document.body.classList.add('light');
      localStorage.setItem('cc_theme', 'light');
    } else {
      document.body.classList.remove('light');
      localStorage.setItem('cc_theme', 'dark');
    }
  }, [isLight]);

  return (
    <button 
      onClick={() => setIsLight(!isLight)}
      style={{
        position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 50,
        background: 'var(--hover-bg)', border: '1px solid var(--border-color)',
        borderRadius: '50%', width: '3rem', height: '3rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: 'var(--text-color)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}
      aria-label="Toggle Theme"
    >
      {isLight ? <Moon size={20} /> : <Sun size={20} />}
    </button>
  );
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
          {/* Public site */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/blogs" element={<Blogs />} />
          </Route>
          {/* Blog detail isolated so its custom header is preserved separately from Nav */}
          <Route path="/blogs/:id" element={<BlogDetail />} />

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
