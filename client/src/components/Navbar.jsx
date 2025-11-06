import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold">Property Manager</Link>
        <div className="space-x-3">
          {user?.role === 'admin' && <Link className="text-sm" to="/admin">Admin</Link>}
          {user?.role === 'owner' && <Link className="text-sm" to="/owner">Owner</Link>}
          {user?.role === 'tenant' && <Link className="text-sm" to="/tenant">Tenant</Link>}
          {user ? (
            <button onClick={handleLogout} className="text-sm bg-gray-800 text-white px-3 py-1 rounded">Logout</button>
          ) : (
            <Link className="text-sm" to="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  )
}
