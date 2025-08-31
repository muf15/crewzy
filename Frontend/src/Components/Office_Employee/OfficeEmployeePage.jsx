import React from 'react';
import { useEffect, useMemo, useState } from "react"
import {Link} from "react-router-dom"
import Navbar from '../Navbar/Navbar';
// Using a lightweight React map that needs no API key
import { Map, Marker, ZoomControl } from "pigeon-maps"

// Simple helpers
function todayKey() {
  const d = new Date()
  return d.toISOString().slice(0, 10) // YYYY-MM-DD
}

function readAttendance() {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem("crewzy_attendance")
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeAttendance(data) {
  if (typeof window === "undefined") return
  localStorage.setItem("crewzy_attendance", JSON.stringify(data))
}

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
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
}

// Mock API functions for tasks
const tasksAPI = {
  // Get tasks for a specific date
  getTasks: async (date) => {
    // Simulate API call delay
    return new Promise((resolve) => {
      setTimeout(() => {
        // Hardcoded tasks data
        const hardcodedTasks = [
          {
            id: 1,
            name: "Client Meeting",
            description: "Weekly sync with client team to discuss project progress",
            category: "meeting",
            allocatedTime: 60,
            location: { lat: 40.7128, lng: -74.0060 },
            completed: false,
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            name: "Code Review",
            description: "Review pull requests from development team",
            category: "review",
            allocatedTime: 90,
            location: { lat: 40.7138, lng: -74.0070 },
            completed: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 3,
            name: "Documentation Update",
            description: "Update project documentation with latest changes",
            category: "documentation",
            allocatedTime: 45,
            location: null,
            completed: false,
            createdAt: new Date().toISOString()
          }
        ];
        resolve(hardcodedTasks);
      }, 500);
    });
  },

  // Update task completion status
  updateTask: async (taskId, completed) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Task ${taskId} marked as ${completed ? 'completed' : 'incomplete'}`);
        resolve({ success: true });
      }, 200);
    });
  },

  // Get task categories
  getCategories: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 'meeting', name: 'Meeting', color: '#4786FA' },
          { id: 'documentation', name: 'Documentation', color: '#10B981' },
          { id: 'development', name: 'Development', color: '#8B5CF6' },
          { id: 'review', name: 'Review', color: '#F59E0B' },
          { id: 'training', name: 'Training', color: '#EC4899' },
          { id: 'support', name: 'Support', color: '#6366F1' }
        ]);
      }, 50);
    });
  }
};

export default function OfficeEmployeePage() {
  const [records, setRecords] = useState({});
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loc, setLoc] = useState(null);
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [error, setError] = useState("");
  const [loadingTasks, setLoadingTasks] = useState(true);

  // Load stored attendance and tasks
  useEffect(() => {
    setRecords(readAttendance());
    loadTasks();
    loadCategories();
  }, []);

  const today = todayKey();
  const todays = records[today] || {};

  // Calculate distance if both check-in and check-out exist
  const distance = useMemo(() => {
    if (todays?.checkIn?.coords && todays?.checkOut?.coords) {
      const { lat: lat1, lng: lng1 } = todays.checkIn.coords;
      const { lat: lat2, lng: lng2 } = todays.checkOut.coords;
      return calculateDistance(lat1, lng1, lat2, lng2).toFixed(2);
    }
    return null;
  }, [todays]);

  const center = useMemo(() => {
    if (todays?.checkOut?.coords) return [todays.checkOut.coords.lat, todays.checkOut.coords.lng];
    if (todays?.checkIn?.coords) return [todays.checkIn.coords.lat, todays.checkIn.coords.lng];
    if (loc) return [loc.lat, loc.lng];
    // Default center if no location yet (NYC-ish)
    return [40.73, -73.93];
  }, [loc, todays]);

  async function loadTasks() {
    setLoadingTasks(true);
    try {
      const tasksData = await tasksAPI.getTasks(today);
      setTasks(tasksData);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoadingTasks(false);
    }
  }

  async function loadCategories() {
    try {
      const categoriesData = await tasksAPI.getCategories();
      setCategories(categoriesData);
    } catch (err) {
      console.error("Failed to load categories");
    }
  }

  async function handleToggleTask(taskId) {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        const updated = !task.completed;
        await tasksAPI.updateTask(taskId, updated);
        
        // Update local state
        setTasks(tasks.map(t => 
          t.id === taskId ? { ...t, completed: updated } : t
        ));
      }
    } catch (err) {
      setError("Failed to update task");
    }
  }

  function requestLocation(cb) {
    setLoadingLoc(true);
    setError("");
    if (!("geolocation" in navigator)) {
      setError("Geolocation is not supported on this device.");
      setLoadingLoc(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLoc(coords);
        setLoadingLoc(false);
        cb(coords);
      },
      (err) => {
        setError(err.message || "Unable to get your location.");
        setLoadingLoc(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  function handleCheckIn() {
    if (todays?.checkIn) return;
    requestLocation((coords) => {
      const next = { ...records };
      next[today] = {
        ...(next[today] || {}),
        checkIn: { at: new Date().toISOString(), coords },
      };
      setRecords(next);
      writeAttendance(next);
    });
  }

  function handleCheckOut() {
    if (!todays?.checkIn || todays?.checkOut) return;
    requestLocation((coords) => {
      const next = { ...records };
      next[today] = {
        ...(next[today] || {}),
        checkOut: { at: new Date().toISOString(), coords },
      };
      setRecords(next);
      writeAttendance(next);
    });
  }

  // Build a small history list (7 most recent)
  const history = useMemo(() => {
    return Object.entries(records)
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .slice(0, 7)
      .map(([day, rec]) => {
        // Calculate distance for each day
        let dayDistance = null;
        if (rec.checkIn?.coords && rec.checkOut?.coords) {
          const { lat: lat1, lng: lng1 } = rec.checkIn.coords;
          const { lat: lat2, lng: lng2 } = rec.checkOut.coords;
          dayDistance = calculateDistance(lat1, lng1, lat2, lng2).toFixed(2);
        }
        
        return { day, ...rec, distance: dayDistance };
      });
  }, [records]);

  const status = todays?.checkOut ? "Checked out" : todays?.checkIn ? "Checked in" : "Not checked in yet";

  return (
    <div className="min-h-screen">
      <Navbar />
      <main
        className="min-h-[calc(100vh-64px)] p-4 md:p-6 lg:p-8"
        style={{ backgroundColor: "#F4F7FF" /* Very Light Blue */ }}
      >
      <div className="mx-auto w-full max-w-6xl space-y-6">
        {/* Header */}
        <header
          className="rounded-xl p-5 md:p-6 flex items-center justify-between"
          style={{ backgroundColor: "#E3EAFE" /* Light Blue */ }}
        >
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-[#0F172A] text-balance">Office Employee</h1>
            <p className="text-sm md:text-base text-[#334155] opacity-80">
              Manage attendance with precise location. Check in and out, then review your map and history.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/dashboard" className="text-sm font-medium underline" style={{ color: "#4786FA" /* Accent */ }}>
              Back to Dashboard
            </Link>
          </div>
        </header>

        {/* Actions + Status */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Status Card */}
          <div className="rounded-xl p-5 md:p-6" style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E9F9" }}>
            <div className="flex items-center justify-between">
              <h2 className="text-base md:text-lg font-semibold text-[#0F172A]">Attendance</h2>
              <span
                className="text-xs md:text-sm px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor:
                    status === "Checked out" ? "#E2E9F9" : status === "Checked in" ? "#D1E1FB" : "#F2F5FC",
                  color: "#0F172A",
                  border: "1px solid #D1DFFA",
                }}
                aria-live="polite"
              >
                {status}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <button
                onClick={handleCheckIn}
                disabled={!!todays?.checkIn || loadingLoc}
                className="w-full rounded-lg px-4 py-2.5 text-white font-medium transition-opacity disabled:opacity-60"
                style={{ backgroundColor: "#4786FA" }}
                aria-disabled={!!todays?.checkIn || loadingLoc}
              >
                {todays?.checkIn ? "Checked In" : loadingLoc ? "Getting location…" : "Check In"}
              </button>
              <button
                onClick={handleCheckOut}
                disabled={!todays?.checkIn || !!todays?.checkOut || loadingLoc}
                className="w-full rounded-lg px-4 py-2.5 text-[#0F172A] font-medium border transition-opacity disabled:opacity-60"
                style={{ backgroundColor: "#FFFFFE", borderColor: "#D1DFFA" }}
                aria-disabled={!todays?.checkIn || !!todays?.checkOut || loadingLoc}
              >
                {todays?.checkOut ? "Checked Out" : loadingLoc ? "Getting location…" : "Check Out"}
              </button>
              <p className="text-xs text-[#334155]">Your location is only stored locally on this device.</p>
              {error ? (
                <p className="text-xs text-red-600" role="alert">
                  {error}
                </p>
              ) : null}
            </div>

            {/* Today Details */}
            <div className="mt-5 rounded-lg p-4" style={{ backgroundColor: "#F2F5FC" }}>
              <h3 className="text-sm font-medium text-[#0F172A]">Today</h3>
              <dl className="mt-2 grid grid-cols-2 gap-3 text-sm text-[#0F172A]">
                <div>
                  <dt className="opacity-70">Check In</dt>
                  <dd className="font-semibold">
                    {todays?.checkIn ? new Date(todays.checkIn.at).toLocaleTimeString() : "—"}
                  </dd>
                </div>
                <div>
                  <dt className="opacity-70">Check Out</dt>
                  <dd className="font-semibold">
                    {todays?.checkOut ? new Date(todays.checkOut.at).toLocaleTimeString() : "—"}
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="opacity-70">Coordinates</dt>
                  <dd className="font-semibold">
                    {todays?.checkIn?.coords
                      ? `${todays.checkIn.coords.lat.toFixed(5)}, ${todays.checkIn.coords.lng.toFixed(5)}`
                      : "—"}
                    {todays?.checkOut?.coords
                      ? ` → ${todays.checkOut.coords.lat.toFixed(5)}, ${todays.checkOut.coords.lng.toFixed(5)}`
                      : ""}
                  </dd>
                </div>
                {distance && (
                  <div className="col-span-2">
                    <dt className="opacity-70">Distance</dt>
                    <dd className="font-semibold">
                      {distance} km
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Map Card */}
          <div
            className="rounded-xl p-0 lg:col-span-2 overflow-hidden flex flex-col"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E9F9" }}
          >
            <div className="flex items-center justify-between px-5 py-4" style={{ backgroundColor: "#D1DFFA" }}>
              <h2 className="text-sm md:text-base font-semibold text-[#0F172A]">Your Location Map</h2>
              <span className="text-xs text-[#0F172A] opacity-75">
                {center[0].toFixed(4)}, {center[1].toFixed(4)}
              </span>
            </div>
            <div className="relative h-[320px] md:h-[420px]">
              <Map height={0} defaultCenter={center} center={center} defaultZoom={15} minZoom={2} maxZoom={18}>
                <ZoomControl />
                {todays?.checkIn?.coords ? (
                  <Marker width={40} anchor={[todays.checkIn.coords.lat, todays.checkIn.coords.lng]} color="#4786FA" />
                ) : null}
                {todays?.checkOut?.coords ? (
                  <Marker
                    width={40}
                    anchor={[todays.checkOut.coords.lat, todays.checkOut.coords.lng]}
                    color="#0EA5E9"
                  />
                ) : null}
                {loc && !todays?.checkOut ? <Marker width={32} anchor={[loc.lat, loc.lng]} color="#22C55E" /> : null}
              </Map>
            </div>
            <div
              className="px-5 py-4 bg-white grid grid-cols-1 md:grid-cols-3 gap-3"
              style={{ backgroundColor: "#FEFEFE" }}
            >
              <div className="rounded-md p-3" style={{ backgroundColor: "#F2F5FC" }}>
                <p className="text-xs text-[#334155]">Legend</p>
                <ul className="mt-1 text-sm text-[#0F172A]">
                  <li>Blue: Check In</li>
                  <li>Sky: Check Out</li>
                  <li>Green: Current (not checked out)</li>
                </ul>
              </div>
              <div className="rounded-md p-3" style={{ backgroundColor: "#F2F5FC" }}>
                <p className="text-xs text-[#334155]">Tip</p>
                <p className="text-sm text-[#0F172A]">Allow location services for precise check-ins.</p>
              </div>
              <div className="rounded-md p-3" style={{ backgroundColor: "#F2F5FC" }}>
                <p className="text-xs text-[#334155]">Privacy</p>
                <p className="text-sm text-[#0F172A]">Data stays in your browser; no server is used.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Daily Tasks Section */}
        <section
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E9F9" }}
        >
          <div className="px-5 py-4" style={{ backgroundColor: "#D1E1FB" }}>
            <h2 className="text-sm md:text-base font-semibold text-[#0F172A]">Daily Tasks</h2>
          </div>
          <div className="p-5">
            {loadingTasks ? (
              <p className="text-sm text-[#334155] text-center py-4">Loading tasks...</p>
            ) : tasks.length === 0 ? (
              <p className="text-sm text-[#334155] text-center py-4">No tasks assigned for today.</p>
            ) : (
              <div className="space-y-3">
                {tasks.map((task) => {
                  const category = categories.find(c => c.id === task.category) || {}
                  return (
                    <div key={task.id} className="flex items-start justify-between p-3 rounded-lg" style={{ backgroundColor: "#F2F5FC" }}>
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <span 
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: category.color || "#4786FA" }}
                          ></span>
                          <span className={task.completed ? "line-through text-[#64748B] font-medium" : "text-[#0F172A] font-medium"}>
                            {task.name}
                          </span>
                        </div>
                        <div className="text-xs text-[#334155] ml-5">
                          {task.allocatedTime && (
                            <span className="mr-3">⏱️ {task.allocatedTime} min</span>
                          )}
                          {task.location && (
                            <span>📍 {task.location.lat.toFixed(4)}, {task.location.lng.toFixed(4)}</span>
                          )}
                          {task.category && (
                            <span className="ml-3">🏷️ {category.name}</span>
                          )}
                        </div>
                        {task.description && (
                          <p className="text-xs text-[#334155] mt-2 ml-5">{task.description}</p>
                        )}
                        
                        {/* Task Location Map */}
                        {task.location && (
                          <div className="mt-3 rounded-lg overflow-hidden" style={{ border: "1px solid #E2E9F9", height: "150px" }}>
                            <Map 
                              height={150} 
                              defaultCenter={[task.location.lat, task.location.lng]} 
                              center={[task.location.lat, task.location.lng]} 
                              defaultZoom={15}
                            >
                              <Marker 
                                width={30} 
                                anchor={[task.location.lat, task.location.lng]} 
                                color={category.color || "#4786FA"} 
                              />
                            </Map>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() => handleToggleTask(task.id)}
                          className="h-4 w-4"
                          style={{ accentColor: "#4786FA" }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* History Table */}
        <section
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2E9F9" }}
        >
          <div className="px-5 py-4" style={{ backgroundColor: "#D1E1FB" }}>
            <h2 className="text-sm md:text-base font-semibold text-[#0F172A]">Recent Attendance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-[#334155]" style={{ backgroundColor: "#F2F5FC" }}>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Check In</th>
                  <th className="px-5 py-3 font-medium">Check Out</th>
                  <th className="px-5 py-3 font-medium">Distance (km)</th>
                  <th className="px-5 py-3 font-medium">Check In Coords</th>
                  <th className="px-5 py-3 font-medium">Check Out Coords</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td className="px-5 py-4 text-[#334155]" colSpan={6}>
                      No attendance records yet.
                    </td>
                  </tr>
                ) : (
                  history.map((h) => (
                    <tr key={h.day} className="border-t" style={{ borderColor: "#E2E9F9" }}>
                      <td className="px-5 py-3 text-[#0F172A]">{h.day}</td>
                      <td className="px-5 py-3 text-[#0F172A]">
                        {h.checkIn ? new Date(h.checkIn.at).toLocaleTimeString() : "—"}
                      </td>
                      <td className="px-5 py-3 text-[#0F172A]">
                        {h.checkOut ? new Date(h.checkOut.at).toLocaleTimeString() : "—"}
                      </td>
                      <td className="px-5 py-3 text-[#0F172A]">
                        {h.distance || "—"}
                      </td>
                      <td className="px-5 py-3 text-[#0F172A]">
                        {h.checkIn?.coords
                          ? `${h.checkIn.coords.lat.toFixed(4)}, ${h.checkIn.coords.lng.toFixed(4)}`
                          : "—"}
                      </td>
                      <td className="px-5 py-3 text-[#0F172A]">
                        {h.checkOut?.coords
                          ? `${h.checkOut.coords.lat.toFixed(4)}, ${h.checkOut.coords.lng.toFixed(4)}`
                          : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer link for accessibility on small screens */}
        <div className="flex md:hidden justify-end">
          <Link href="/dashboard" className="text-sm font-medium underline" style={{ color: "#4786FA" }}>
            Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
    </div>
  );
}