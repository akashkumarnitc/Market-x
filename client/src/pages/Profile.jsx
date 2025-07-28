import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import axiosInstance from '../api/axiosInstance'

function Profile() {
  const [user, setUser] = useState(null)
  const [form, setForm] = useState({ phone: '' })
  const [profilePic, setProfilePic] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  useEffect(() => {
    // Fetch user info on mount
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get('/user/check')
        setUser(res.data.user)
        setForm({
          phone: res.data.user.phoneNumber || ''
        })
        setPreview(res.data.user.profilePic || null)
      } catch (err) {
        setMessage('Failed to load user info')
        setMessageType('error')
      }
    }
    fetchUser()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setProfilePic(file)
    if (file) {
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setMessageType('')
    try {
      const data = new FormData()
      data.append('phoneNumber', form.phone)
      if (profilePic) {
        data.append('file', profilePic)
      }
      const res = await axiosInstance.put('/user/update-profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setMessage('Profile updated successfully!')
      setMessageType('success')
      setUser(res.data.user)
      setPreview(res.data.user.profilePic) // update preview to new profilePic from server
      setProfilePic(null)
      // Reset preview if no new profilePic was uploaded
      if (!res.data.user.profilePic) setPreview(null)
    } catch (err) {
      setMessage('Failed to update profile')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg border border-blue-300">
        <h1 className=" font-semibold text-black mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Profile Settings
        </h1>
        <div className='flex justify-center'>
          <img 
          className="w-30 h-30 rounded-full object-cover border" 
          src={user?.profilePic || "/src/assets/profile1.jpeg"} 
          alt="user"
          style={{ width: 120, height: 120 }} 
          />
        </div>
        <p className="text-gray-600 mb-4">Update your phone number and profile picture here.</p>
        {user ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={user.fullName}
                disabled
                className="mt-1 block w-full border border-gray-200 rounded-md p-2 bg-gray-100 text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="mt-1 block w-full border border-gray-200 rounded-md p-2 bg-gray-100 text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-500"
              />
              {preview && (
                <div className="flex justify-center">
                  <img
                    src={preview}
                    alt="Profile Preview"
                    className="my-2 rounded object-cover border"
                    style={{ width: 120, height: 120 }}
                  />
                </div>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            {message && (
              <p className={`text-center text-sm mt-2 ${messageType === "success" ? "text-green-600" : "text-red-500"}`}>
                {message}
              </p>
            )}
          </form>
        ) : (
          <div className="text-center text-gray-500">Loading...</div>
        )}
      </div>
    </Layout>
  )
}

export default Profile