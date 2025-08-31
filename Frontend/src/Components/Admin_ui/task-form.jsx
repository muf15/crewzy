"use client"

import { useState } from "react"

const categories = ["Installation", "Maintenance", "Delivery", "Inspection", "Support", "Other"]

export default function TaskForm({ onAdd, selectedLocation, onUseMyLocation }) {
  const [taskName, setTaskName] = useState("")
  const [employeeName, setEmployeeName] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [contactNumber, setContactNumber] = useState("")
  const [category, setCategory] = useState(categories[0])
  const [scheduledDate, setScheduledDate] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")
  const [expectedDate, setExpectedDate] = useState("")
  const [notes, setNotes] = useState("")

  function reset() {
    setTaskName("")
    setEmployeeName("")
    setCustomerName("")
    setContactNumber("")
    setCategory(categories[0])
    setScheduledDate("")
    setScheduledTime("")
    setExpectedDate("")
    setNotes("")
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!taskName.trim()) return
    if (!employeeName.trim()) return
    if (!selectedLocation) return
    const phone = contactNumber.trim()
    if (!/^[0-9+()\-.\s]{7,}$/.test(phone)) return

    onAdd({
      id: Date.now().toString(),
      taskName: taskName.trim(),
      employeeName: employeeName.trim(),
      customerName: customerName.trim(),
      contactNumber: phone,
      category,
      scheduledDate,
      scheduledTime,
      expectedDate,
      location: selectedLocation,
      notes: notes.trim(),
      createdAt: new Date().toISOString(),
      status: "Scheduled",
    })
    reset()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-xl border border-[#E2E9F9] bg-[#F4F7FF] p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-[#1f2a44]">Create Task</h2>
        <p className="text-sm text-[#4b587c]">Assign a new task with location and deadlines</p>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#1f2a44]">Task Name</label>
            <input
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="h-10 rounded-md border border-[#E2E9F9] bg-white px-3 text-sm outline-none focus:border-[#4786FA]"
              placeholder="e.g., AC Installation"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#1f2a44]">Assign To (Employee)</label>
            <input
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              className="h-10 rounded-md border border-[#E2E9F9] bg-white px-3 text-sm outline-none focus:border-[#4786FA]"
              placeholder="Employee name"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#1f2a44]">Customer Name</label>
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="h-10 rounded-md border border-[#E2E9F9] bg-white px-3 text-sm outline-none focus:border-[#4786FA]"
              placeholder="Customer name"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#1f2a44]">Contact Number</label>
            <input
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="h-10 rounded-md border border-[#E2E9F9] bg-white px-3 text-sm outline-none focus:border-[#4786FA]"
              placeholder="+1 555 123 4567"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#1f2a44]">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-10 rounded-md border border-[#E2E9F9] bg-white px-3 text-sm outline-none focus:border-[#4786FA]"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#1f2a44]">Scheduled Date</label>
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="h-10 rounded-md border border-[#E2E9F9] bg-white px-3 text-sm outline-none focus:border-[#4786FA]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#1f2a44]">Scheduled Time</label>
            <input
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="h-10 rounded-md border border-[#E2E9F9] bg-white px-3 text-sm outline-none focus:border-[#4786FA]"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-[#1f2a44]">Expected Completion Date</label>
            <input
              type="date"
              value={expectedDate}
              onChange={(e) => setExpectedDate(e.target.value)}
              className="h-10 rounded-md border border-[#E2E9F9] bg-white px-3 text-sm outline-none focus:border-[#4786FA]"
            />
          </div>
        </div>

        <div className="mt-4 rounded-md border border-[#E2E9F9] bg-white p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-[#1f2a44]">Task Location</p>
              <p className="text-xs text-[#4b587c]">
                Click on the map to pick a location or use your current location.
              </p>
            </div>
            <button
              type="button"
              onClick={onUseMyLocation}
              className="rounded-md bg-[#4786FA] px-3 py-2 text-xs font-medium text-white hover:opacity-95"
            >
              Use my location
            </button>
          </div>
          <div className="mt-2 text-xs text-[#1f2a44]">
            {selectedLocation
              ? `Selected: ${selectedLocation.lat.toFixed(5)}, ${selectedLocation.lng.toFixed(5)}`
              : "No location selected"}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-md border border-[#E2E9F9] bg-white px-4 py-2 text-sm text-[#1f2a44] hover:bg-[#D1DFFA]"
          >
            Reset
          </button>
          <button
            type="submit"
            className="rounded-md bg-[#4786FA] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
          >
            Add Task
          </button>
        </div>
      </div>
    </form>
  )
}
