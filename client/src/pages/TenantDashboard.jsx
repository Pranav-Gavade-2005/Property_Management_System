import { useEffect, useState } from 'react'
import api from '../api/axios.js'

export default function TenantDashboard() {
  const [property, setProperty] = useState(null)
  const [profile, setProfile] = useState({ name:'', phone:'' })

  const load = async () => {
    const { data } = await api.get('/tenant/property')
    setProperty(data.property)
  }

  useEffect(() => { load() }, [])

  const saveProfile = async (e) => {
    e.preventDefault()
    const { data } = await api.put('/tenant/profile', profile)
    setProfile({ name: data.user.name || '', phone: data.user.phone || '' })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Tenant Dashboard</h1>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-medium mb-2">My Property</h2>
        {property ? (
          <div className="text-sm space-y-1">
            <div><b>Title:</b> {property.title}</div>
            <div><b>Address:</b> {property.address}</div>
            <div><b>Rent:</b> {property.rent}</div>
            <div><b>Rent Paid:</b> {property.rent_paid ? 'Yes' : 'No'}</div>
          </div>
        ) : (
          <div className="text-sm">No property assigned.</div>
        )}
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-medium mb-2">Edit Profile</h2>
        <form onSubmit={saveProfile} className="grid grid-cols-2 gap-3">
          <input placeholder="Name" className="border rounded px-3 py-2" value={profile.name} onChange={(e)=>setProfile({...profile,name:e.target.value})} />
          <input placeholder="Phone" className="border rounded px-3 py-2" value={profile.phone} onChange={(e)=>setProfile({...profile,phone:e.target.value})} />
          <button className="bg-gray-900 text-white rounded px-4 py-2">Save</button>
        </form>
      </div>
    </div>
  )
}
