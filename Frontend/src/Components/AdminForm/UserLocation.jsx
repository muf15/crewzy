import React, { useState, useEffect } from "react";

function UserLocation() {
  const [location, setLocation] = useState({ lat: null, lon: null });
  const [error, setError] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(position);
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">User Location</h2>
      {error && <p className="text-red-500">Error: {error}</p>}
      {location.lat && location.lon ? (
        <p>
          Latitude: {location.lat}, Longitude: {location.lon}
        </p>
      ) : (
        <p>Fetching location...</p>
      )}
    </div>
  );
}

export default UserLocation;
