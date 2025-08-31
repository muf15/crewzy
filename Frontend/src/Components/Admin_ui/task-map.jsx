"use client"

import { Map, Marker, ZoomControl } from "pigeon-maps"
import { useEffect, useState } from "react"

export default function TaskMap({ tasks, tempLocation, onPickLocation, focus }) {
  const [center, setCenter] = useState([20.5937, 78.9629]) // default: India center
  const [zoom, setZoom] = useState(5)

  useEffect(() => {
    if (focus?.coordinates && focus.coordinates.length === 2) {
      // Backend stores coordinates as [longitude, latitude] for MongoDB
      setCenter([focus.coordinates[1], focus.coordinates[0]])
      setZoom(13)
    } else if (focus?.location) {
      // Legacy format support
      setCenter([focus.location.lat, focus.location.lng])
      setZoom(13)
    }
  }, [focus])

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-xl border border-[#E2E9F9] bg-white">
      <Map
        height={420}
        center={center}
        zoom={zoom}
        onBoundsChanged={({ center, zoom }) => {
          setCenter(center)
          setZoom(zoom)
        }}
        onClick={({ latLng }) => {
          onPickLocation({ lat: latLng[0], lng: latLng[1] })
        }}
      >
        <ZoomControl />
        {tasks.map((t) => {
          // Handle both new coordinate format and legacy location format
          let lat, lng
          if (t.coordinates && t.coordinates.length === 2) {
            // Backend coordinates are [longitude, latitude]
            lng = t.coordinates[0]
            lat = t.coordinates[1]
          } else if (t.location) {
            // Legacy format
            lat = t.location.lat
            lng = t.location.lng
          } else {
            return null // Skip if no valid location data
          }

          return (
            <Marker
              key={t._id || t.id}
              width={36}
              anchor={[lat, lng]}
              color="#4786FA"
              onClick={() => {
                setCenter([lat, lng])
                setZoom(14)
              }}
            />
          )
        })}
        {tempLocation ? <Marker width={38} anchor={[tempLocation.lat, tempLocation.lng]} color="#FA8747" /> : null}
      </Map>
      <div className="pointer-events-none absolute left-3 top-3 rounded-md bg-[#F4F7FF]/90 px-2 py-1 text-xs text-[#1f2a44]">
        Click on the map to set task location
      </div>
    </div>
  )
}
