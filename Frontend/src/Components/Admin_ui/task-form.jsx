"use client"

import { useState } from "react"
import { getCurrentLocation, getAddressFromCoordinates } from "../../utils/locationUtils"

export default function TaskForm({ onAdd, selectedLocation, onUseMyLocation }) {
  const [formData, setFormData] = useState({
    name: "",
    contactNo: "",
    fullAddress: "",
    pincode: "",
    eLoc: "",
    coordinates: [],
    task: "",
    expectedDate: ""
  })
  const [locationLoading, setLocationLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitLoading, setSubmitLoading] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleUseCurrentLocation = async () => {
    try {
      setLocationLoading(true)
      setErrors(prev => ({ ...prev, location: "" }))
      
      const position = await getCurrentLocation()
      const addressData = await getAddressFromCoordinates(
        position.latitude, 
        position.longitude
      )
      
      setFormData(prev => ({
        ...prev,
        fullAddress: addressData.fullAddress,
        pincode: addressData.pincode,
        eLoc: addressData.eLoc,
        coordinates: addressData.coordinates
      }))
      
      // Call the parent's onUseMyLocation to update map
      onUseMyLocation()
      
    } catch (error) {
      console.error("Location error:", error)
      setErrors(prev => ({ ...prev, location: error.message }))
    } finally {
      setLocationLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }
    
    if (!formData.contactNo.trim()) {
      newErrors.contactNo = "Contact number is required"
    } else if (!/^[0-9+()\-.\s]{10,}$/.test(formData.contactNo.trim())) {
      newErrors.contactNo = "Please enter a valid contact number"
    }
    
    if (!formData.task.trim()) {
      newErrors.task = "Task description is required"
    }
    
    if (!formData.expectedDate) {
      newErrors.expectedDate = "Expected date is required"
    }
    
    if (!formData.fullAddress.trim()) {
      newErrors.fullAddress = "Address is required"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setSubmitLoading(true)
    
    // Prepare task data for backend
    const taskData = {
      name: formData.name.trim(),
      contactNo: formData.contactNo.trim(),
      fullAddress: formData.fullAddress.trim(),
      pincode: formData.pincode || "",
      eLoc: formData.eLoc || "",
      coordinates: formData.coordinates.length > 0 ? formData.coordinates : [],
      task: formData.task.trim(),
      expectedDate: formData.expectedDate
    }
    
    const result = await onAdd(taskData)
    
    if (result.success) {
      // Reset form on success
      setFormData({
        name: "",
        contactNo: "",
        fullAddress: "",
        pincode: "",
        eLoc: "",
        coordinates: [],
        task: "",
        expectedDate: ""
      })
    } else {
      setErrors(prev => ({ ...prev, submit: result.error }))
    }
    
    setSubmitLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-xl border border-[#E2E9F9] bg-[#F4F7FF] p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-[#1f2a44]">Create Task</h2>
        <p className="text-sm text-[#4b587c]">Assign a new task with location and deadlines</p>

        {errors.submit && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{errors.submit}</p>
          </div>
        )}

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#1f2a44]">Customer Name *</label>
            <input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`h-10 rounded-md border bg-white px-3 text-sm outline-none focus:border-[#4786FA] ${
                errors.name ? 'border-red-300' : 'border-[#E2E9F9]'
              }`}
              placeholder="Enter customer name"
              required
            />
            {errors.name && <span className="text-xs text-red-600">{errors.name}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#1f2a44]">Contact Number *</label>
            <input
              value={formData.contactNo}
              onChange={(e) => handleInputChange('contactNo', e.target.value)}
              className={`h-10 rounded-md border bg-white px-3 text-sm outline-none focus:border-[#4786FA] ${
                errors.contactNo ? 'border-red-300' : 'border-[#E2E9F9]'
              }`}
              placeholder="+91 9876543210"
              required
            />
            {errors.contactNo && <span className="text-xs text-red-600">{errors.contactNo}</span>}
          </div>

          <div className="md:col-span-2 flex flex-col gap-1">
            <label className="text-sm font-medium text-[#1f2a44]">Task Description *</label>
            <textarea
              value={formData.task}
              onChange={(e) => handleInputChange('task', e.target.value)}
              className={`min-h-20 rounded-md border bg-white px-3 py-2 text-sm outline-none focus:border-[#4786FA] ${
                errors.task ? 'border-red-300' : 'border-[#E2E9F9]'
              }`}
              placeholder="Describe the task in detail..."
              required
            />
            {errors.task && <span className="text-xs text-red-600">{errors.task}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#1f2a44]">Expected Completion Date *</label>
            <input
              type="date"
              value={formData.expectedDate}
              onChange={(e) => handleInputChange('expectedDate', e.target.value)}
              className={`h-10 rounded-md border bg-white px-3 text-sm outline-none focus:border-[#4786FA] ${
                errors.expectedDate ? 'border-red-300' : 'border-[#E2E9F9]'
              }`}
              required
            />
            {errors.expectedDate && <span className="text-xs text-red-600">{errors.expectedDate}</span>}
          </div>
        </div>

        {/* Location Section */}
        <div className="mt-4 rounded-md border border-[#E2E9F9] bg-white p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-[#1f2a44]">Task Location *</p>
              <p className="text-xs text-[#4b587c]">
                Use current location to automatically fill address details.
              </p>
            </div>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={locationLoading}
              className="rounded-md bg-[#4786FA] px-3 py-2 text-xs font-medium text-white hover:opacity-95 disabled:opacity-50"
            >
              {locationLoading ? "Getting location..." : "Use current location"}
            </button>
          </div>
          
          {errors.location && (
            <div className="mt-2 text-xs text-red-600">{errors.location}</div>
          )}
        </div>

        {/* Address Fields */}
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="md:col-span-2 flex flex-col gap-1">
            <label className="text-sm font-medium text-[#1f2a44]">Full Address *</label>
            <textarea
              value={formData.fullAddress}
              onChange={(e) => handleInputChange('fullAddress', e.target.value)}
              className={`min-h-16 rounded-md border bg-white px-3 py-2 text-sm outline-none focus:border-[#4786FA] ${
                errors.fullAddress ? 'border-red-300' : 'border-[#E2E9F9]'
              }`}
              placeholder="Enter complete address or use current location"
              required
            />
            {errors.fullAddress && <span className="text-xs text-red-600">{errors.fullAddress}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#1f2a44]">Pincode</label>
            <input
              value={formData.pincode}
              onChange={(e) => handleInputChange('pincode', e.target.value)}
              className="h-10 rounded-md border border-[#E2E9F9] bg-white px-3 text-sm outline-none focus:border-[#4786FA]"
              placeholder="Auto-filled from location"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#1f2a44]">eLoc (Mappls Code)</label>
            <input
              value={formData.eLoc}
              onChange={(e) => handleInputChange('eLoc', e.target.value)}
              className="h-10 rounded-md border border-[#E2E9F9] bg-white px-3 text-sm outline-none focus:border-[#4786FA]"
              placeholder="Auto-filled from location"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              setFormData({
                name: "",
                contactNo: "",
                fullAddress: "",
                pincode: "",
                eLoc: "",
                coordinates: [],
                task: "",
                expectedDate: ""
              })
              setErrors({})
            }}
            className="rounded-md border border-[#E2E9F9] bg-white px-4 py-2 text-sm text-[#1f2a44] hover:bg-[#D1DFFA]"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={submitLoading}
            className="rounded-md bg-[#4786FA] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:opacity-50"
          >
            {submitLoading ? "Creating Task..." : "Create Task"}
          </button>
        </div>
      </div>
    </form>
  )
}
