import { useMemo, useState } from "react"
import { Map, Marker } from "pigeon-maps"

const palette = {
  bg: "#F4F7FF", // Very Light Blue
  panel: "#FFFFFF", // White
  soft: "#D1DFFA", // Soft Blue
  faint: "#F2F5FC", // Faint Blue
  accent: "#4786FA", // Bright Blue
  heading: "#0F172A", // neutral foreground
  muted: "#334155", // neutral
}

export default function Travel() {
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(null)

  // Form fields
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [transport, setTransport] = useState("Flight")
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [reason, setReason] = useState("")
  const [coords, setCoords] = useState(null) // {lat, lng}

  const mapCenter = useMemo(() => {
    if (coords) return [coords.lat, coords.lng]
    return [20.5937, 78.9629] // default center (India)
  }, [coords])

  const onUseMyLocation = () => {
    if (!navigator.geolocation) {
      setMessage({ type: "error", text: "Geolocation not supported in this browser." })
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setCoords({ lat: latitude, lng: longitude })
        setMessage({ type: "info", text: "Current location captured." })
      },
      (err) => {
        setMessage({ type: "error", text: `Unable to get location: ${err.message}` })
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  const onMapClick = ({ latLng }) => {
    const [lat, lng] = latLng
    setCoords({ lat, lng })
    setMessage({ type: "info", text: "Marker placed on map." })
  }

  async function onSubmit(e) {
    e.preventDefault()
    setMessage(null)

    if (!coords) {
      setMessage({ type: "error", text: "Please pick a location (use my location or click on the map)." })
      return
    }
    if (!title || !amount) {
      setMessage({ type: "error", text: "Please fill at least a title and amount." })
      return
    }

    const payload = {
      date,
      title,
      amount: Number(amount),
      currency,
      transport,
      origin,
      destination,
      reason,
      location: coords,
      createdAt: new Date().toISOString(),
    }

    try {
      setSubmitting(true)
      const res = await fetch("/api/tarvel-expense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to submit")
      setMessage({ type: "success", text: `Submitted. Ref #${data.id}` })
      // reset minimal fields but keep date/currency/transport
      setTitle("")
      setAmount("")
      setOrigin("")
      setDestination("")
      setReason("")
    } catch (err) {
      setMessage({ type: "error", text: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="p-4 md:p-6" style={{ background: palette.bg }}>
      <div className="max-w-6xl mx-auto">
        <header className="mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-balance" style={{ color: palette.heading }}>
            Travel Expense
          </h1>
          <p className="text-sm md:text-base mt-1" style={{ color: palette.muted }}>
            Submit your work travel expenses with a pinned location and clear description.
          </p>
        </header>

        {message && (
          <div
            className={`mb-4 rounded-md border p-3 text-sm ${
              message.type === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : message.type === "error"
                  ? "border-red-200 bg-red-50 text-red-800"
                  : "border-blue-200 bg-blue-50 text-blue-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Form */}
          <div className="rounded-xl border shadow-sm" style={{ background: palette.panel, borderColor: palette.soft }}>
            <div className="border-b px-4 py-3" style={{ background: palette.faint, borderColor: palette.soft }}>
              <h2 className="text-base md:text-lg font-medium" style={{ color: palette.heading }}>
                Expense Details
              </h2>
            </div>
            <form onSubmit={onSubmit} className="p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium" style={{ color: palette.muted }}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-10 rounded-md border px-3 outline-none"
                    style={{ borderColor: palette.soft, background: "#FEFEFE" }}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium" style={{ color: palette.muted }}>
                    Amount
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="h-10 flex-1 rounded-md border px-3 outline-none"
                      style={{ borderColor: palette.soft, background: "#FEFEFE" }}
                      required
                    />
                    {/* <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="h-10 w-28 rounded-md border px-2 outline-none"
                      style={{ borderColor: palette.soft, background: "#FFFFFE" }}
                    >
                      <option>USD</option>
                      <option>EUR</option>
                      <option>INR</option>
                      <option>GBP</option>
                    </select> */}
                  </div>
                </div>

                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-sm font-medium" style={{ color: palette.muted }}>
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Client meeting travel to Delhi"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-10 rounded-md border px-3 outline-none"
                    style={{ borderColor: palette.soft, background: "#FEFEFE" }}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium" style={{ color: palette.muted }}>
                    Transport
                  </label>
                  <select
                    value={transport}
                    onChange={(e) => setTransport(e.target.value)}
                    className="h-10 rounded-md border px-2 outline-none"
                    style={{ borderColor: palette.soft, background: "#FFFFFE" }}
                  >
                    <option>Flight</option>
                    <option>Train</option>
                    <option>Bus</option>
                    <option>Car</option>
                    <option>Taxi</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium" style={{ color: palette.muted }}>
                    Origin
                  </label>
                  <input
                    type="text"
                    placeholder="From (city / office)"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="h-10 rounded-md border px-3 outline-none"
                    style={{ borderColor: palette.soft, background: "#FEFEFE" }}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium" style={{ color: palette.muted }}>
                    Destination
                  </label>
                  <input
                    type="text"
                    placeholder="To (city / client location)"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="h-10 rounded-md border px-3 outline-none"
                    style={{ borderColor: palette.soft, background: "#FEFEFE" }}
                  />
                </div>

                <div className="md:col-span-2 flex flex-col gap-1.5">
                  <label className="text-sm font-medium" style={{ color: palette.muted }}>
                    Why did you travel for work?
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Describe meetings, purpose, outcomes, or any relevant details."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="rounded-md border px-3 py-2 outline-none"
                    style={{ borderColor: palette.soft, background: "#FEFEFE" }}
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onUseMyLocation}
                  className="h-10 rounded-md px-3 text-sm font-medium text-white"
                  style={{ background: palette.accent }}
                >
                  Use my location
                </button>
                <button
                  type="button"
                  onClick={() => setCoords(null)}
                  className="h-10 rounded-md border px-3 text-sm font-medium"
                  style={{ borderColor: palette.soft, background: palette.faint, color: palette.muted }}
                >
                  Clear location
                </button>
                <div className="ml-auto text-xs text-right" style={{ color: palette.muted }}>
                  {coords ? (
                    <div>
                      <span className="font-medium">Selected:</span> {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
                    </div>
                  ) : (
                    "No location selected"
                  )}
                </div>
              </div>

              <div className="mt-5">
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-11 w-full rounded-md text-sm font-semibold text-white transition-opacity md:w-auto md:px-5"
                  style={{ background: palette.accent, opacity: submitting ? 0.7 : 1 }}
                >
                  {submitting ? "Submitting..." : "Submit Expense"}
                </button>
              </div>
            </form>
          </div>

          {/* Map */}
          <div
            className="rounded-xl border shadow-sm overflow-hidden"
            style={{ background: palette.panel, borderColor: palette.soft }}
          >
            <div className="border-b px-4 py-3" style={{ background: palette.faint, borderColor: palette.soft }}>
              <h2 className="text-base md:text-lg font-medium" style={{ color: palette.heading }}>
                Location
              </h2>
              <p className="text-xs mt-1" style={{ color: palette.muted }}>
                Click on the map to place a marker, or use your current location.
              </p>
            </div>
            <div className="p-3">
              <div className="rounded-lg overflow-hidden border" style={{ borderColor: palette.soft }}>
                <Map height={340} defaultCenter={mapCenter} center={mapCenter} defaultZoom={12} onClick={onMapClick}>
                  {coords && <Marker width={38} anchor={[coords.lat, coords.lng]} />}
                </Map>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}