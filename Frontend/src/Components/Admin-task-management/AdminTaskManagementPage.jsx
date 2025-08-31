
import { useCallback, useEffect, useMemo, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import TaskForm from "../Admin_ui/task-form"
import TaskList from "../Admin_ui/task-list"
import TaskMap from "../Admin_ui/task-map"
import { getAddressFromCoordinates } from "../../utils/locationUtils"

export default function AdminTaskManagementPage() {
  const { user, token, isLoading } = useAuth()
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [focused, setFocused] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Check if user is admin
  useEffect(() => {
    if (!isLoading) {
      if (!user || user.role !== 'admin') {
        navigate('/login')
        return
      }
    }
  }, [user, navigate, isLoading])

  // Fetch tasks from backend
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/task`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }
      
      const data = await response.json()
      setTasks(data.tasks || [])
    } catch (error) {
      console.error('Error fetching tasks:', error)
      setError('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }, [token])

  // Load tasks on component mount
  useEffect(() => {
    if (!isLoading && user?.role === 'admin' && token) {
      fetchTasks()
    }
  }, [user, token, fetchTasks, isLoading])

  const addTask = useCallback(async (taskData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/task/assign`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create task')
      }

      const data = await response.json()
      const newTask = data.task
      
      setTasks((prev) => [newTask, ...prev])
      setSelectedLocation(null)
      setFocused(newTask)
      
      return { success: true, task: newTask }
    } catch (error) {
      console.error('Error creating task:', error)
      return { success: false, error: error.message }
    }
  }, [token])

  const deleteTask = useCallback(async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/task/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete task')
      }

      setTasks((prev) => prev.filter((t) => t._id !== id))
      setFocused(null)
    } catch (error) {
      console.error('Error deleting task:', error)
      setError('Failed to delete task')
    }
  }, [token])

  const onPickLocation = useCallback(async (loc) => {
    try {
      // First set the basic location immediately for UI responsiveness
      const basicLocation = {
        lat: loc.lat,
        lng: loc.lng,
        coordinates: [loc.lng, loc.lat], // Backend expects [longitude, latitude]
        fullAddress: `Loading address for: ${loc.lat.toFixed(6)}, ${loc.lng.toFixed(6)}`,
        pincode: "",
        eLoc: ""
      }
      setSelectedLocation(basicLocation)
      setFocused({ coordinates: [loc.lng, loc.lat] })

      // Then fetch complete address details including eLoc
      const addressData = await getAddressFromCoordinates(loc.lat, loc.lng)
      
      // Update with complete address information
      const completeLocation = {
        lat: loc.lat,
        lng: loc.lng,
        coordinates: addressData.coordinates, // Already in backend format [lng, lat]
        fullAddress: addressData.fullAddress,
        pincode: addressData.pincode,
        eLoc: addressData.eLoc
      }
      setSelectedLocation(completeLocation)
      
    } catch (error) {
      console.error("Error fetching address details:", error)
      // Keep the basic location if address fetch fails
      const fallbackLocation = {
        lat: loc.lat,
        lng: loc.lng,
        coordinates: [loc.lng, loc.lat],
        fullAddress: `Map Location: ${loc.lat.toFixed(6)}, ${loc.lng.toFixed(6)}`,
        pincode: "",
        eLoc: ""
      }
      setSelectedLocation(fallbackLocation)
    }
  }, [])

  const onUseMyLocation = useCallback(async () => {
    if (!navigator.geolocation) return
    
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          // First set basic location for immediate UI feedback
          const basicLoc = { 
            lat: pos.coords.latitude, 
            lng: pos.coords.longitude,
            coordinates: [pos.coords.longitude, pos.coords.latitude], // Backend format
            fullAddress: `Loading current location: ${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`,
            pincode: "",
            eLoc: ""
          }
          setSelectedLocation(basicLoc)
          setFocused({ coordinates: [pos.coords.longitude, pos.coords.latitude] })

          // Then fetch complete address details
          const addressData = await getAddressFromCoordinates(pos.coords.latitude, pos.coords.longitude)
          
          const completeLoc = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            coordinates: addressData.coordinates, // Already in backend format
            fullAddress: addressData.fullAddress,
            pincode: addressData.pincode,
            eLoc: addressData.eLoc
          }
          setSelectedLocation(completeLoc)
          
        } catch (error) {
          console.error("Error fetching current location address:", error)
          // Keep basic location if address fetch fails
          const fallbackLoc = { 
            lat: pos.coords.latitude, 
            lng: pos.coords.longitude,
            coordinates: [pos.coords.longitude, pos.coords.latitude],
            fullAddress: `Current Location: ${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}`,
            pincode: "",
            eLoc: ""
          }
          setSelectedLocation(fallbackLoc)
        }
      },
      (error) => {
        console.error("Geolocation error:", error)
        // ignore errors silently for now
      },
    )
  }, [])

  const header = useMemo(
    () => (
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1f2a44]">Admin Task Management</h1>
          <p className="text-sm text-[#4b587c]">
            Add tasks for employees with precise locations, dates, and categories.
          </p>
        </div>
        <div className="hidden gap-2 md:flex">
          <a
            href="/admin-dashboard"
            className="rounded-md border border-[#E2E9F9] bg-white px-3 py-2 text-sm text-[#1f2a44] hover:bg-[#F4F7FF]"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    ),
    [],
  )

  if (isLoading) {
    return (
      <main className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
        <div className="rounded-2xl bg-[#E3EAFE] p-4 md:p-6">
          <div className="rounded-xl border border-[#E2E9F9] bg-white p-4 md:p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1f2a44] mx-auto"></div>
                <p className="mt-4 text-[#4b587c]">Checking authentication...</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
        <div className="rounded-2xl bg-[#E3EAFE] p-4 md:p-6">
          <div className="rounded-xl border border-[#E2E9F9] bg-white p-4 md:p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1f2a44] mx-auto"></div>
                <p className="mt-4 text-[#4b587c]">Loading tasks...</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <div className="rounded-2xl bg-[#E3EAFE] p-4 md:p-6">
        <div className="rounded-xl border border-[#E2E9F9] bg-white p-4 md:p-6">
          {header}

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Layout: form + map */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <TaskForm onAdd={addTask} selectedLocation={selectedLocation} onUseMyLocation={onUseMyLocation} />
            <div className="space-y-3">
              <div className="rounded-xl border border-[#E2E9F9] bg-[#F4F7FF] p-3">
                <h3 className="text-sm font-semibold text-[#1f2a44]">Map Preview</h3>
                <p className="text-xs text-[#4b587c]">
                  Click on the map to select task location. Orange marker indicates the selected location.
                </p>
                {selectedLocation && (
                  <div className="mt-2 p-2 bg-white rounded border border-[#E2E9F9]">
                    <p className="text-xs font-medium text-[#1f2a44]">Selected Location:</p>
                    <p className="text-xs text-[#4b587c]">
                      Lat: {selectedLocation.lat?.toFixed(6)}, Lng: {selectedLocation.lng?.toFixed(6)}
                    </p>
                    <p className="text-xs text-[#4b587c]">
                      Backend Format: [{selectedLocation.coordinates?.[0]?.toFixed(6)}, {selectedLocation.coordinates?.[1]?.toFixed(6)}]
                    </p>
                  </div>
                )}
              </div>
              <TaskMap tasks={tasks} tempLocation={selectedLocation} onPickLocation={onPickLocation} focus={focused} />
            </div>
          </div>

          {/* Task list */}
          <div className="mt-6">
            <TaskList tasks={tasks} onFocusTask={(t) => setFocused(t)} onDeleteTask={deleteTask} />
          </div>
        </div>
      </div>
    </main>
  )
}
