import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, Users, DollarSign, Home, TrendingUp, Eye, X } from 'lucide-react'
import Swal from 'sweetalert2'
import api from '../api/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import SimplePropertyForm from '../components/SimplePropertyForm.jsx'

export default function OwnerDashboard() {
  const { user } = useAuth()
  const [list, setList] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState(null)
  const [stats, setStats] = useState({
    totalProperties: 0,
    occupiedProperties: 0,
    totalRent: 0,
    pendingApplications: 0
  })

  const load = async () => {
    try {
      const { data } = await api.get(`/properties/owner/${user.id}`)
      setList(data.properties)
      
      // Calculate stats
      const totalProperties = data.properties.length
      const occupiedProperties = data.properties.filter(p => p.status === 'occupied').length
      const totalRent = data.properties.reduce((sum, p) => sum + (parseFloat(p.rent) || 0), 0)
      
      setStats({
        totalProperties,
        occupiedProperties,
        totalRent,
        pendingApplications: 0 // Will be fetched separately
      })
    } catch (error) {
      console.error('Error loading properties:', error)
    }
  }

  const loadApplications = async () => {
    try {
      const { data } = await api.get('/property-applications/owner')
      const pendingApplications = data.filter(app => app.status === 'pending').length
      setStats(prev => ({ ...prev, pendingApplications }))
    } catch (error) {
      console.error('Error loading applications:', error)
    }
  }

  useEffect(() => { 
    if (user) {
      load()
      loadApplications()
    }
  }, [user])

  const handleCreateProperty = async (propertyData, isFormData = false) => {
    try {
      const config = isFormData ? {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      } : {};
      
      await api.post('/properties', propertyData, config);
      setShowCreateForm(false);
      Swal.fire({
        icon: 'success',
        title: 'Property Created!',
        text: 'Your property has been added successfully.',
        timer: 2000,
        showConfirmButton: false
      });
      load();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Failed to create property'
      });
    }
  }

  const handleEditProperty = async (propertyData, isFormData = false) => {
    try {
      if (isFormData) {
        // Handle image upload separately for existing properties
        await api.put(`/properties/${editingProperty.id}/image`, propertyData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await api.put(`/properties/${editingProperty.id}/details`, propertyData);
      }
      
      setEditingProperty(null);
      Swal.fire({
        icon: 'success',
        title: 'Property Updated!',
        text: 'Property details have been saved.',
        timer: 2000,
        showConfirmButton: false
      });
      load();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Failed to update property'
      });
    }
  }

  const save = async (p) => {
    try {
      await api.put(`/properties/${p.id}`, { title:p.title, address:p.address, rent: Number(p.rent||0) })
      Swal.fire({
        icon: 'success',
        title: 'Property Updated!',
        text: 'Property details have been saved.',
        timer: 2000,
        showConfirmButton: false
      })
      load()
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.error || 'Failed to update property'
      })
    }
  }

  const remove = async (id) => {
    const result = await Swal.fire({
      title: 'Delete Property',
      text: 'Are you sure you want to delete this property?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
      try {
        await api.delete(`/properties/${id}`)
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Property has been deleted.',
          timer: 2000,
          showConfirmButton: false
        })
        load()
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.error || 'Failed to delete property'
        })
      }
    }
  }

  const assignTenant = async (id, tenant_id) => {
    await api.put(`/properties/assign-tenant/${id}`, { tenant_id: tenant_id? Number(tenant_id) : null })
    load()
  }

  const toggleRent = async (id, paid) => {
    await api.put(`/properties/rent-status/${id}`, { paid: !paid })
    load()
  }

  if (showCreateForm) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Add New Property</h2>
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <SimplePropertyForm onSubmit={handleCreateProperty} />
        </div>
      </div>
    )
  }

  if (editingProperty) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Edit Property</h2>
            <button
              onClick={() => setEditingProperty(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <SimplePropertyForm 
            onSubmit={handleEditProperty} 
            initialData={editingProperty}
            submitLabel="Update Property"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Owner Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Properties</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Occupied</p>
                <p className="text-2xl font-bold text-gray-900">{stats.occupiedProperties}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Monthly Rent</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRent.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Property
          </button>
          
          <Link
            to="/applications"
            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Applications
          </Link>
        </div>
      </div>

      {/* Properties List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">My Properties</h2>
        </div>
        
        {list.length === 0 ? (
          <div className="text-center py-12">
            <Home className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No properties</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding your first property.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rent
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {list.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden">
                            {property.image_path ? (
                              <img
                                src={`http://localhost:4000${property.image_path}`}
                                alt={property.title}
                                className="h-12 w-12 object-cover rounded-lg"
                              />
                            ) : (
                              <Home className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{property.title}</div>
                          <div className="text-sm text-gray-500">{property.address}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {property.bedrooms} bed • {property.bathrooms} bath
                      </div>
                      <div className="text-sm text-gray-500">
                        {property.property_type}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        property.status === 'available' 
                          ? 'bg-green-100 text-green-800'
                          : property.status === 'occupied'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ${property.rent}/month
                      </div>
                      {property.rent_paid !== null && (
                        <div className="text-sm text-gray-500">
                          Rent: {property.rent_paid ? 'Paid' : 'Unpaid'}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingProperty(property)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => remove(property.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
