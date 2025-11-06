import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import OwnerDashboard from './pages/OwnerDashboard.jsx'
import TenantDashboard from './pages/TenantDashboard.jsx'
import PropertySearch from './pages/PropertySearch.jsx'
import PropertyApplications from './pages/PropertyApplications.jsx'
import PropertyDetails from './pages/PropertyDetails.jsx'
import NotFound from './pages/NotFound.jsx'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Shared Routes */}
          <Route path="/search" element={<ProtectedRoute><PropertySearch /></ProtectedRoute>} />
          <Route path="/property/:id" element={<ProtectedRoute><PropertyDetails /></ProtectedRoute>} />
          <Route path="/applications" element={<ProtectedRoute><PropertyApplications /></ProtectedRoute>} />

          {/* Role-based Routes */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/owner" element={<ProtectedRoute role="owner"><OwnerDashboard /></ProtectedRoute>} />
          <Route path="/tenant" element={<ProtectedRoute role="tenant"><TenantDashboard /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
