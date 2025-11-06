import { useEffect, useState } from 'react'
import api from '../api/axios.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function OwnerDashboard() {
  const { user } = useAuth()
  const [list, setList] = useState([])
  const [form, setForm] = useState({ title:'', address:'', rent:'' })

  const load = async () => {
    const { data } = await api.get(`/properties/owner/${user.id}`)
    setList(data.properties)
  }

  useEffect(() => { if (user) load() }, [user])

  const create = async (e) => {
    e.preventDefault()
    await api.post('/properties', { ...form, rent: Number(form.rent||0) })
    setForm({ title:'', address:'', rent:'' })
    load()
  }

  const save = async (p) => {
    await api.put(`/properties/${p.id}`, { title:p.title, address:p.address, rent: Number(p.rent||0) })
    load()
  }

  const remove = async (id) => {
    await api.delete(`/properties/${id}`)
    load()
  }

  const assignTenant = async (id, tenant_id) => {
    await api.put(`/properties/assign-tenant/${id}`, { tenant_id: tenant_id? Number(tenant_id) : null })
    load()
  }

  const toggleRent = async (id, paid) => {
    await api.put(`/properties/rent-status/${id}`, { paid: !paid })
    load()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Owner Dashboard</h1>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-medium mb-3">Add Property</h2>
        <form onSubmit={create} className="grid grid-cols-3 gap-3">
          <input placeholder="Title" className="border rounded px-3 py-2" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} />
          <input placeholder="Address" className="border rounded px-3 py-2" value={form.address} onChange={(e)=>setForm({...form,address:e.target.value})} />
          <input placeholder="Rent" className="border rounded px-3 py-2" value={form.rent} onChange={(e)=>setForm({...form,rent:e.target.value})} />
          <button className="bg-gray-900 text-white rounded px-4 py-2">Create</button>
        </form>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-medium mb-3">My Properties</h2>
        <div className="space-y-4">
          {list.map(p => (
            <div key={p.id} className="border rounded p-3">
              <div className="grid grid-cols-4 gap-2 items-center">
                <input className="border rounded px-2 py-1" value={p.title||''} onChange={(e)=>setList(list.map(x=>x.id===p.id?{...x,title:e.target.value}:x))} />
                <input className="border rounded px-2 py-1" value={p.address||''} onChange={(e)=>setList(list.map(x=>x.id===p.id?{...x,address:e.target.value}:x))} />
                <input className="border rounded px-2 py-1" value={p.rent||''} onChange={(e)=>setList(list.map(x=>x.id===p.id?{...x,rent:e.target.value}:x))} />
                <div className="flex gap-2 justify-end">
                  <button onClick={()=>save(p)} className="px-3 py-1 rounded bg-blue-600 text-white">Save</button>
                  <button onClick={()=>remove(p.id)} className="px-3 py-1 rounded bg-red-600 text-white">Delete</button>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3 text-sm">
                <div>Tenant ID:</div>
                <input className="border rounded px-2 py-1 w-24" defaultValue={p.tenant_id||''} onBlur={(e)=>assignTenant(p.id, e.target.value)} />
                <div className="ml-auto flex items-center gap-2">
                  <span>Rent Paid:</span>
                  <button onClick={()=>toggleRent(p.id, p.rent_paid)} className={`px-2 py-1 rounded ${p.rent_paid?'bg-green-600':'bg-gray-400'} text-white`}>
                    {p.rent_paid? 'Paid':'Unpaid'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
