import { useEffect, useState } from 'react'
import api from '../api/axios.js'

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'owner', phone:'' })
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    const { data } = await api.get('/admin/users')
    setUsers(data.users)
    setLoading(false)
  }

  useEffect(() => { fetchUsers() }, [])

  const submit = async (e) => {
    e.preventDefault()
    await api.post('/admin/create-user', form)
    setForm({ name:'', email:'', password:'', role:'owner', phone:'' })
    fetchUsers()
  }

  const remove = async (id) => {
    await api.delete(`/admin/user/${id}`)
    fetchUsers()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-medium mb-3">Add User</h2>
        <form onSubmit={submit} className="grid grid-cols-2 gap-3">
          <input placeholder="Name" className="border rounded px-3 py-2" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} />
          <input placeholder="Email" className="border rounded px-3 py-2" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} />
          <input placeholder="Password" type="password" className="border rounded px-3 py-2" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})} />
          <select className="border rounded px-3 py-2" value={form.role} onChange={(e)=>setForm({...form,role:e.target.value})}>
            <option value="owner">owner</option>
            <option value="tenant">tenant</option>
            <option value="admin">admin</option>
          </select>
          <input placeholder="Phone" className="border rounded px-3 py-2" value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})} />
          <button className="bg-gray-900 text-white rounded px-4 py-2">Create</button>
        </form>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-medium mb-3">Users</h2>
        {loading ? 'Loading...' : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Phone</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b">
                    <td className="py-2">{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>{u.phone || '-'}</td>
                    <td>
                      <button onClick={()=>remove(u.id)} className="text-red-600">Delete</button>
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
