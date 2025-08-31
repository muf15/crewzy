import React from 'react';
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../Navbar/Navbar';
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
  Activity,
  MapPin,
  Navigation
} from 'lucide-react';
import AIAdmin from '../AIBOT/AIAdmin.jsx';
// Import the map components
import { Map, Marker } from 'pigeon-maps';
import { useAuth } from '../../context/AuthContext';

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

// Geolocation utility functions
const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  });
};

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance; // in kilometers
};

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
  const { user, token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [revisitDate, setRevisitDate] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    async function fetchTasks() {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/task`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await res.json();
        if (res.ok) {
          setTasks(data.tasks || []);
        } else {
          setError(data.error || 'Failed to fetch tasks');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    }
    if (user && token) fetchTasks();
  }, [user, token]);

  const openTaskModal = (task) => {
    setSelectedTask(task);
    setShowCompleteModal(true);
    setRevisitDate("");
  };

  const handleComplete = async () => {
    setModalLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/task/${selectedTask._id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'completed' })
      });
      if (res.ok) {
        setTasks((prev) => prev.map(t => t._id === selectedTask._id ? { ...t, status: 'completed' } : t));
        setShowCompleteModal(false);
      } else {
        setError('Failed to update task');
      }
    } finally {
      setModalLoading(false);
    }
  };

  const handleRevisit = async () => {
    if (!revisitDate) return;
    setModalLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/task/${selectedTask._id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'revisit', revisitDate })
      });
      if (res.ok) {
        setTasks((prev) => prev.map(t => t._id === selectedTask._id ? { ...t, status: 'revisit', revisitDate } : t));
        setShowCompleteModal(false);
      } else {
        setError('Failed to update task');
      }
    } finally {
      setModalLoading(false);
    }
  };

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



      {loading ? (
        <div className="p-6 text-center text-[#4786FA]">Loading tasks...</div>
      ) : error ? (
        <div className="p-6 text-center text-red-600">{error}</div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {tasks.map((t, index) => (
              <motion.div 
                key={t._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => openTaskModal(t)}
                className="cursor-pointer rounded-2xl border-2 border-gray-300 bg-[#F4F7FF] p-5 hover:shadow-md transition-all duration-300 shadow-lg"
                style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(71, 134, 250, 0.05)' }}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-black mb-1">{t.task}</h3>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#4786FA] opacity-70">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {t.name}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Due: {new Date(t.expectedDate).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            t.status === 'completed' ? 'text-green-600 bg-green-50' :
                            t.status === 'inprogress' ? 'text-blue-600 bg-blue-50' :
                            t.status === 'assigned' ? 'text-yellow-600 bg-yellow-50' :
                            t.status === 'revisit' ? 'text-orange-600 bg-orange-50' :
                            'text-gray-600 bg-gray-50'
                          }`}>
                            {t.status}
                          </span>
                          {t.coordinates && t.coordinates.length === 2 && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                Location: {t.fullAddress}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Task Location Map (if task has coordinates) */}
                    {t.coordinates && t.coordinates.length === 2 && (
                      <div className="mt-3 rounded-xl overflow-hidden border border-[#E2E9F9]">
                        <div className="h-32">
                          <Map 
                            height={128} 
                            defaultCenter={[t.coordinates[1], t.coordinates[0]]} 
                            center={[t.coordinates[1], t.coordinates[0]]} 
                            defaultZoom={13}
                          >
                            <Marker 
                              width={30} 
                              anchor={[t.coordinates[1], t.coordinates[0]]} 
                              color="#4786FA" 
                            />
                          </Map>
                        </div>
                        <div className="p-2 bg-[#F2F5FC] text-xs text-[#4786FA] text-center">
                          Location: {t.fullAddress}
                        </div>
                      </div>
                    )}
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
      )}
      <AnimatePresence>
        {showCompleteModal && selectedTask && (
          <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div className="bg-white rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-black mb-4">Task Completion</h3>
              <p className="text-sm text-[#4786FA] mb-4">Have you completed this task?</p>
              <div className="flex gap-3 mb-4">
                <button
                  onClick={handleComplete}
                  disabled={modalLoading}
                  className="flex-1 rounded-xl bg-gradient-to-r from-[#4786FA] to-[#D1DFFA] px-4 py-2 text-sm font-bold text-white hover:shadow-lg transition-all duration-300"
                >
                  Yes
                </button>
                <button
                  onClick={() => setRevisitDate("")}
                  disabled={modalLoading}
                  className="flex-1 rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-[#4786FA] hover:bg-[#F4F7FF] transition-all duration-300"
                >
                  Revisit
                </button>
              </div>
              {revisitDate !== "" && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#4786FA] mb-2">Revisit Date & Time</label>
                  <input
                    type="datetime-local"
                    value={revisitDate}
                    onChange={e => setRevisitDate(e.target.value)}
                    className="w-full rounded-md border border-[#E2E9F9] px-3 py-2 text-sm outline-none focus:border-[#4786FA]"
                  />
                  <button
                    onClick={handleRevisit}
                    disabled={modalLoading || !revisitDate}
                    className="mt-3 w-full rounded-xl bg-gradient-to-r from-[#4786FA] to-[#D1DFFA] px-4 py-2 text-sm font-bold text-white hover:shadow-lg transition-all duration-300"
                  >
                    Confirm Revisit
                  </button>
                </div>
              )}
              <button
                onClick={() => { setShowCompleteModal(false); setSelectedTask(null); setRevisitDate(""); }}
                className="mt-3 w-full rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-[#4786FA] hover:bg-[#F4F7FF] transition-all duration-300"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}

export default function HybridEmployeeAdminPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
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
    </div>
  )
}