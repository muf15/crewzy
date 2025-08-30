import React from 'react';

import {Link} from "react-router-dom"
import { useState } from "react"

const StatusBadge = ({ status }) => {
  const map = {
    Present: "bg-emerald-100 text-emerald-700",
    Absent: "bg-rose-100 text-rose-700",
    Leave: "bg-amber-100 text-amber-700",
    "Work From Home": "bg-blue-100 text-blue-700",
    Pending: "bg-amber-100 text-amber-700",
    "In Progress": "bg-blue-100 text-blue-700",
    Done: "bg-emerald-100 text-emerald-700",
  }
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${map[status] || "bg-slate-100 text-slate-700"}`}
    >
      {status}
    </span>
  )
}

const ProgressBar = ({ value }) => {
  const v = Math.max(0, Math.min(100, value || 0))
  return (
    <div className="w-full h-2 rounded bg-slate-100">
      <div className="h-2 rounded bg-blue-600 transition-all" style={{ width: `${v}%` }} />
    </div>
  )
}

function AttendanceCard() {
  const [month] = useState("April 2025")
  const [rows, setRows] = useState([
    { date: "Apr 01", checkIn: "09:02", checkOut: "17:32", status: "Present" },
    { date: "Apr 02", checkIn: "—", checkOut: "—", status: "Absent" },
    { date: "Apr 03", checkIn: "09:11", checkOut: "18:01", status: "Work From Home" },
    { date: "Apr 04", checkIn: "09:00", checkOut: "17:10", status: "Present" },
  ])

  const markToday = (status) => {
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit" }).replace(",", "")
    setRows((r) => {
      const idx = r.findIndex((x) => x.date === today)
      const updated = {
        date: today,
        checkIn: status === "Present" ? "09:00" : "—",
        checkOut: status === "Present" ? "17:00" : "—",
        status,
      }
      if (idx >= 0) {
        const copy = [...r]
        copy[idx] = updated
        return copy
      }
      return [updated, ...r]
    })
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 md:p-6">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Attendance</h2>
          <p className="text-xs text-slate-500">{month}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => markToday("Present")}
            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Mark Present
          </button>
          <button
            onClick={() => markToday("Work From Home")}
            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Mark WFH
          </button>
          <button
            onClick={() => markToday("Leave")}
            className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Mark Leave
          </button>
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Check In</th>
              <th className="py-2 pr-4">Check Out</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-slate-100">
                <td className="py-2 pr-4 font-medium text-slate-900">{r.date}</td>
                <td className="py-2 pr-4">{r.checkIn}</td>
                <td className="py-2 pr-4">{r.checkOut}</td>
                <td className="py-2">
                  <StatusBadge status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="mt-4 flex items-center justify-between">
        <p className="text-xs text-slate-500">
          Note: This is demo data. Connect to your data source to persist attendance.
        </p>
        <Link href="/dashboard" className="text-xs font-medium text-blue-600 hover:underline">
          Back to Dashboard
        </Link>
      </footer>
    </section>
  )
}

function TaskListCard() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Prepare weekly status report",
      assignee: "You",
      due: "Apr 09",
      progress: 40,
      status: "In Progress",
      priority: "Medium",
    },
    {
      id: 2,
      title: "Review PR #142",
      assignee: "You",
      due: "Apr 10",
      progress: 10,
      status: "Pending",
      priority: "High",
    },
    {
      id: 3,
      title: "Client onboarding checklist",
      assignee: "You",
      due: "Apr 12",
      progress: 90,
      status: "In Progress",
      priority: "Low",
    },
  ])
  const [title, setTitle] = useState("")
  const [due, setDue] = useState("")

  const addTask = () => {
    const t = title.trim()
    if (!t) return
    setTasks((prev) => [
      {
        id: Date.now(),
        title: t,
        assignee: "You",
        due: due || "TBD",
        progress: 0,
        status: "Pending",
        priority: "Medium",
      },
      ...prev,
    ])
    setTitle("")
    setDue("")
  }

  const toggleDone = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "Done" ? "Pending" : "Done", progress: t.status === "Done" ? 0 : 100 }
          : t,
      ),
    )
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 md:p-6">
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">Assigned Tasks</h2>
        <span className="text-xs text-slate-500">{tasks.length} total</span>
      </header>

      <div className="mb-4 grid gap-2 md:grid-cols-6">
        <input
          className="md:col-span-3 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="md:col-span-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500"
          placeholder="Due (e.g. Apr 12)"
          value={due}
          onChange={(e) => setDue(e.target.value)}
        />
        <button
          onClick={addTask}
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Add Task
        </button>
      </div>

      <div className="space-y-3">
        {tasks.map((t) => (
          <div key={t.id} className="rounded-lg border border-slate-200 p-3">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-medium text-slate-900">{t.title}</p>
                <p className="text-xs text-slate-500">
                  Assignee: {t.assignee} • Due: {t.due} • Priority: {t.priority}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-40">
                  <ProgressBar value={t.progress} />
                </div>
                <StatusBadge status={t.status} />
                <button
                  onClick={() => toggleDone(t.id)}
                  className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  {t.status === "Done" ? "Mark Pending" : "Mark Done"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function HybridEmployeeAdminPage() {
  return (
    <main className="mx-auto max-w-7xl p-4 md:p-6">
      {/* Header bar */}
      <div className="mb-4 flex flex-col items-start justify-between gap-3 md:mb-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-balance text-xl font-semibold text-slate-900 md:text-2xl">Hybrid Employee Admin</h1>
          <p className="text-pretty text-sm text-slate-500">
            Track attendance and manage assigned tasks for hybrid employees.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            href="/dashboard"
          >
            Overview
          </Link>
          <Link
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            href="/hybrid-employee-admin"
          >
            This Page
          </Link>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <AttendanceCard />
        <TaskListCard />
      </div>
    </main>
  )
}
