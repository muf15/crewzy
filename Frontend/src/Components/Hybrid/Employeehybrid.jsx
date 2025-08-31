import React from 'react';
import { Link } from "react-router-dom"
import { useState } from "react"
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Home, 
  Coffee, 
  Plus,
  ChevronRight,
  User,
  Target,
  TrendingUp,
  Activity
} from 'lucide-react';
import AIAdmin from '../AIBOT/AIAdmin.jsx';

const StatusBadge = ({ status }) => {
  const map = {
    Present: "bg-[#E3EAFE] text-[#4786FA] border-[#D1DFFA]",
    Absent: "bg-red-50 text-red-700 border-red-200",
    Leave: "bg-amber-50 text-amber-700 border-amber-200",
    "Work From Home": "bg-[#F4F7FF] text-[#4786FA] border-[#E2E9F9]",
    Pending: "bg-[#F2F5FC] text-[#4786FA] border-[#E2E9F9]",
    "In Progress": "bg-[#D1E1FB] text-[#4786FA] border-[#D1DFFA]",
    Done: "bg-green-50 text-green-700 border-green-200",
  }
  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-300 ${map[status] || "bg-[#F2F5FC] text-[#4786FA] border-[#E2E9F9]"}`}
    >
      {status}
    </motion.span>
  )
}

const ProgressBar = ({ value }) => {
  const v = Math.max(0, Math.min(100, value || 0))
  return (
    <div className="w-full h-3 rounded-full bg-[#F4F7FF] border border-[#E2E9F9] overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${v}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="h-full rounded-full bg-gradient-to-r from-[#4786FA] to-[#D1DFFA] transition-all duration-500" 
      />
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
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-3xl border-2 border-gray-300 bg-[#E3EAFE] p-6 md:p-8 shadow-2xl hover:shadow-3xl transition-all duration-300"
      style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(71, 134, 250, 0.1)' }}
    >
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-[#4786FA] p-3 rounded-2xl">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-black">Attendance Tracker</h2>
            <p className="text-sm text-[#4786FA] opacity-70">{month}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => markToday("Present")}
            className="rounded-xl border-2 border-gray-300 bg-[#FFFFFF] px-4 py-2 text-sm font-semibold text-[#4786FA] hover:bg-[#F4F7FF] transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
            style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(71, 134, 250, 0.05)' }}
          >
            <CheckCircle className="w-4 h-4" />
            Present
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => markToday("Work From Home")}
            className="rounded-xl border-2 border-gray-300 bg-[#FFFFFF] px-4 py-2 text-sm font-semibold text-[#4786FA] hover:bg-[#F4F7FF] transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
            style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(71, 134, 250, 0.05)' }}
          >
            <Home className="w-4 h-4" />
            WFH
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => markToday("Leave")}
            className="rounded-xl border-2 border-gray-300 bg-[#FFFFFF] px-4 py-2 text-sm font-semibold text-[#4786FA] hover:bg-[#F4F7FF] transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
            style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(71, 134, 250, 0.05)' }}
          >
            <Coffee className="w-4 h-4" />
            Leave
          </motion.button>
        </div>
      </header>

      <div className="overflow-x-auto rounded-2xl border-2 border-gray-300 bg-[#FFFFFF] shadow-lg" style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(71, 134, 250, 0.05)' }}>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-[#F4F7FF] to-[#E3EAFE] text-[#4786FA] font-semibold">
              <th className="py-4 px-6 text-left">Date</th>
              <th className="py-4 px-6 text-left">Check In</th>
              <th className="py-4 px-6 text-left">Check Out</th>
              <th className="py-4 px-6 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <motion.tr 
                key={i} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="border-t border-[#E2E9F9] hover:bg-[#F4F7FF] transition-colors duration-200"
              >
                <td className="py-4 px-6 font-semibold text-[#4786FA]">{r.date}</td>
                <td className="py-4 px-6 text-[#4786FA] opacity-80">{r.checkIn}</td>
                <td className="py-4 px-6 text-[#4786FA] opacity-80">{r.checkOut}</td>
                <td className="py-4 px-6">
                  <StatusBadge status={r.status} />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-[#4786FA] opacity-60">
          🎯 Demo data - Connect to your data source for persistence
        </p>
        <Link to="/admin-dashboard" className="text-sm font-semibold text-[#4786FA] hover:text-[#D1DFFA] transition-colors duration-300 flex items-center gap-1">
          Dashboard <ChevronRight className="w-4 h-4" />
        </Link>
      </footer>
    </motion.section>
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

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'text-red-600 bg-red-50'
      case 'Medium': return 'text-[#4786FA] bg-[#E3EAFE]'
      case 'Low': return 'text-green-600 bg-green-50'
      default: return 'text-[#4786FA] bg-[#F2F5FC]'
    }
  }

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="rounded-3xl border-2 border-gray-300 bg-[#E3EAFE] p-6 md:p-8 shadow-2xl hover:shadow-3xl transition-all duration-300"
      style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(71, 134, 250, 0.1)' }}
    >
      <header className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-[#4786FA] p-3 rounded-2xl">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-black">Task Manager</h2>
            <p className="text-sm text-[#4786FA] opacity-70">{tasks.length} active tasks</p>
          </div>
        </div>
        <div className="bg-[#E3EAFE] rounded-full px-4 py-2">
          <span className="text-sm font-bold text-[#4786FA]">{tasks.filter(t => t.status === 'Done').length}/{tasks.length}</span>
        </div>
      </header>

      <div className="mb-6 grid gap-3 lg:grid-cols-6">
        <motion.input
          whileFocus={{ scale: 1.02 }}
          className="lg:col-span-3 rounded-xl border-2 border-[#E2E9F9] bg-[#FEFEFE] px-4 py-3 text-sm outline-none placeholder:text-[#4786FA] placeholder:opacity-50 focus:border-[#4786FA] focus:bg-[#FFFFFF] transition-all duration-300"
          placeholder="✨ Enter task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <motion.input
          whileFocus={{ scale: 1.02 }}
          className="lg:col-span-2 rounded-xl border-2 border-[#E2E9F9] bg-[#FEFEFE] px-4 py-3 text-sm outline-none placeholder:text-[#4786FA] placeholder:opacity-50 focus:border-[#4786FA] focus:bg-[#FFFFFF] transition-all duration-300"
          placeholder="📅 Due date..."
          value={due}
          onChange={(e) => setDue(e.target.value)}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addTask}
          className="rounded-xl bg-gradient-to-r from-[#4786FA] to-[#D1DFFA] px-6 py-3 text-sm font-bold text-white hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg border-2 border-gray-300"
          style={{ boxShadow: '0 10px 25px -5px rgba(71, 134, 250, 0.3), 0 0 0 1px rgba(71, 134, 250, 0.1)' }}
        >
          <Plus className="w-4 h-4" />
          Add Task
        </motion.button>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {tasks.map((t, index) => (
            <motion.div 
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl border-2 border-gray-300 bg-[#F4F7FF] p-5 hover:shadow-md transition-all duration-300 shadow-lg"
              style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(71, 134, 250, 0.05)' }}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-black mb-1">{t.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#4786FA] opacity-70">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {t.assignee}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Due: {t.due}
                        </span>
                        <span>•</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(t.priority)}`}>
                          {t.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 min-w-0 lg:min-w-80">
                  <div className="flex-1 w-full sm:w-32">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-3 h-3 text-[#4786FA]" />
                      <span className="text-xs font-medium text-[#4786FA]">{t.progress}%</span>
                    </div>
                    <ProgressBar value={t.progress} />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <StatusBadge status={t.status} />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleDone(t.id)}
                      className="rounded-xl border-2 border-gray-300 bg-[#FFFFFF] px-3 py-2 text-xs font-semibold text-[#4786FA] hover:bg-[#F4F7FF] transition-all duration-300 flex items-center gap-1 shadow-md"
                      style={{ boxShadow: '0 5px 15px -3px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(71, 134, 250, 0.05)' }}
                    >
                      {t.status === "Done" ? <XCircle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                      {t.status === "Done" ? "Reopen" : "Complete"}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.section>
  )
}

export default function HybridEmployeeAdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F7FF] via-[#FEFEFE] to-[#E3EAFE]">
      <main className="mx-auto max-w-7xl p-4 md:p-6 lg:p-8">
        {/* Header bar */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-r from-[#4786FA] to-[#D1DFFA] p-4 rounded-3xl">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-black">
                Hybrid Employee Dashboard
              </h1>
              <p className="text-base text-[#4786FA] opacity-80 mt-1">
                Track attendance, manage tasks, and boost productivity seamlessly
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                className="rounded-2xl border-2 border-[#E2E9F9] bg-[#FFFFFF] px-6 py-3 text-sm font-semibold text-[#4786FA] hover:bg-[#F4F7FF] transition-all duration-300 flex items-center gap-2"
                to="/admin-dashboard"
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                className="rounded-2xl bg-gradient-to-r from-[#4786FA] to-[#D1DFFA] px-6 py-3 text-sm font-semibold text-white hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                to="/hybrid-employee-admin"
              >
                <Target className="w-4 h-4" />
                Current Page
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Content grid */}
        <div className="grid gap-8 xl:grid-cols-2">
          <AttendanceCard />
          <TaskListCard />
        </div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-[#4786FA] opacity-60">
            ✨ Designed with precision • Built for productivity • Powered by innovation
          </p>
        </motion.div>
      </main>

      {/* AI Chat Assistant */}
      <AIAdmin />
    </div>
  )
}