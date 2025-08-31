
import { useCallback, useEffect, useMemo, useState } from "react"
import TaskForm from "../Admin_ui/task-form"
import TaskList from "../Admin_ui/task-list"
import TaskMap from "../Admin_ui/task-map"

export default function AdminTaskManagementPage() {
  const [tasks, setTasks] = useState([])
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [focused, setFocused] = useState(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem("crewzy_admin_tasks")
      if (raw) setTasks(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem("crewzy_admin_tasks", JSON.stringify(tasks))
    } catch {}
  }, [tasks])

  const addTask = useCallback((task) => {
    setTasks((prev) => [task, ...prev])
    setSelectedLocation(null)
    setFocused(task)
  }, [])

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
    setFocused(null)
  }, [])

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
            href="/dashboard"
            className="rounded-md border border-[#E2E9F9] bg-white px-3 py-2 text-sm text-[#1f2a44] hover:bg-[#F4F7FF]"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    ),
    [],
  )

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-4 md:p-6">
      <div className="rounded-2xl bg-[#E3EAFE] p-4 md:p-6">
        <div className="rounded-xl border border-[#E2E9F9] bg-white p-4 md:p-6">
          {header}

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
