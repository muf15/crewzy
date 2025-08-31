// Get user's current location using browser geolocation API
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      reject(
        new Error(
          "Geolocation is not supported by this browser. Please enter the address manually."
        )
      );
      return;
    }

    // Options for geolocation
    const options = {
      enableHighAccuracy: true,
      timeout: 10000, // 10 seconds timeout
      maximumAge: 60000, // Cache for 1 minute
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("Location obtained:", { latitude, longitude });
        resolve({ latitude, longitude });
      },
      (error) => {
        console.error("Geolocation error:", error);

        let errorMessage;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location access denied. Please enable location permissions and try again.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage =
              "Location information is unavailable. Please check your internet connection and try again.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again.";
            break;
          default:
            errorMessage =
              "An unknown error occurred while retrieving location. Please enter the address manually.";
            break;
        }

        reject(new Error(errorMessage));
      },
      options
    );
  });
};

// Get address from coordinates using backend proxy to Mappls API
export const getAddressFromCoordinates = async (latitude, longitude) => {
  try {
    console.log("Fetching address for coordinates:", { latitude, longitude });

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const url = `${API_BASE_URL}/location/reverse-geocode?lat=${latitude}&lng=${longitude}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Backend API error: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Backend API response:", data);

    // Extract address information and try to find eLoc from Mappls response
    let fullAddress = "";
    let pincode = "";
    let eLoc = "";

    if (data && data.results && data.results.length > 0) {
      const result = data.results[0];

      // Extract eLoc (6-digit Mappls code) - check multiple possible fields
      eLoc =
        result.eLoc ||
        result.eloc ||
        result.code ||
        result.placeid ||
        result.place_id ||
        result.mapplsPin ||
        result.mappls_pin ||
        "";

      // Look for pincode in various possible fields
      pincode =
        result.pincode ||
        result.pin ||
        result.postal_code ||
        result.postcode ||
        result.zipcode ||
        "";

      console.log("All available fields in result:", Object.keys(result));
      console.log("Found eLoc (6-digit code):", eLoc);
      console.log("Found pincode:", pincode);

      // Build full address - use formatted_address if available, otherwise build from components
      if (result.formatted_address) {
        fullAddress = result.formatted_address;
      } else {
        const addressComponents = [
          result.house_number,
          result.house_name,
          result.poi,
          result.street,
          result.subSubLocality,
          result.subLocality,
          result.locality,
          result.village,
          result.subDistrict,
          result.district,
          result.city,
          result.state,
        ].filter((component) => component && component.trim() !== "");

        fullAddress = addressComponents.join(", ");
      }
    } else {
      throw new Error(
        "No address found for the given coordinates. Please enter the address manually."
      );
    }

    return {
      fullAddress,
      pincode,
      eLoc, // 6-digit Mappls code
      coordinates: [longitude, latitude], // [longitude, latitude] format for MongoDB
    };
  } catch (error) {
    console.error("Address fetch error:", error);
    throw new Error(`Failed to fetch address: ${error.message}`);
  }
};
