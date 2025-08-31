
import { useCallback, useEffect, useMemo, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
import TaskForm from "../Admin_ui/task-form"
import TaskList from "../Admin_ui/task-list"
import TaskMap from "../Admin_ui/task-map"

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

  const onPickLocation = useCallback((loc) => {
    setSelectedLocation(loc)
  }, [])

  const onUseMyLocation = useCallback(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setSelectedLocation(loc)
        setFocused({ location: loc })
      },
      () => {
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
                  Markers show existing tasks; orange marker indicates the new task location.
                </p>
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
