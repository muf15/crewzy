import express from "express";

const router = express.Router();

// OAuth token cache
let mappls_token = null;
let mappls_token_expiry = 0;

// Function to get OAuth2 token from Mappls
async function getMappls_Token() {
  // If token is still valid, reuse it
  if (mappls_token && Date.now() < mappls_token_expiry) {
    return mappls_token;
  }

  const clientId = process.env.MAPPLS_CLIENT_ID;
  const clientSecret = process.env.MAPPLS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Mappls OAuth credentials not configured");
  }

  const url = "https://outpost.mappls.com/api/security/oauth/token";
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
  });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OAuth failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    mappls_token = data.access_token;
    // Refresh 1 minute before expiry
    mappls_token_expiry = Date.now() + (data.expires_in || 3600) * 1000 - 60000;

    console.log("Mappls OAuth token obtained successfully");
    return mappls_token;
  } catch (error) {
    console.error("Failed to get Mappls OAuth token:", error);
    throw error;
  }
}

router.get("/reverse-geocode", async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res
        .status(400)
        .json({ error: "Latitude and longitude are required" });
    }

    // Get OAuth token
    const token = await getMappls_Token();

    // Try reverse geocoding with OAuth - use the correct parameter format
    // For reverse geocoding, we need to use lat,lng format in address parameter
    const reverseGeocodeUrl = `https://atlas.mappls.com/api/places/geocode?address=${lat},${lng}`;

    console.log(
      "Calling Mappls OAuth API for reverse geocoding:",
      reverseGeocodeUrl
    );

    let response = await fetch(reverseGeocodeUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Mappls OAuth API error:", errorText);

      // Try alternative reverse geocoding endpoint
      console.log("Trying alternative reverse geocoding endpoint...");

      const altUrl = `https://atlas.mappls.com/api/places/reverse-geocode/json?lat=${lat}&lng=${lng}`;
      console.log("Alternative URL:", altUrl);

      const altResponse = await fetch(altUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!altResponse.ok) {
        throw new Error(`Mappls API error: ${response.status} - ${errorText}`);
      }

      response = altResponse;
    }

    const data = await response.json();
    console.log("Mappls OAuth API response:", JSON.stringify(data, null, 2));

    // Transform the response to match expected format
    let results = [];

    // Check different response structures
    if (data.copResults) {
      if (Array.isArray(data.copResults) && data.copResults.length > 0) {
        // Multiple results case
        results = data.copResults.map((result) => ({
          houseNumber: result.houseNumber || "",
          houseName: result.houseName || "",
          poi: result.poi || "",
          street: result.street || "",
          subSubLocality: result.subSubLocality || "",
          subLocality: result.subLocality || "",
          locality: result.locality || "",
          village: result.village || "",
          district: result.district || "",
          subDistrict: result.subDistrict || "",
          city: result.city || "",
          state: result.state || "",
          pincode: result.pincode || "",
          eLoc: result.eLoc || "",
          lat: result.latitude || lat,
          lng: result.longitude || lng,
          formatted_address:
            result.formattedAddress ||
            result.address ||
            `${result.locality || ""}, ${result.city || ""}, ${
              result.state || ""
            }`.trim(),
        }));
      } else if (typeof data.copResults === "object") {
        // Single result - use the data directly, don't fetch eLoc details as it might be inaccurate
        const result = data.copResults;
        console.log(
          "Using OAuth result directly with confidence score:",
          result.confidenceScore
        );

        // Only use OAuth result if confidence is reasonable, otherwise fall back
        if (result.confidenceScore && result.confidenceScore > 0.5) {
          results = [
            {
              houseNumber: result.houseNumber || "",
              houseName: result.houseName || "",
              poi: result.poi || "",
              street: result.street || "",
              subSubLocality: result.subSubLocality || "",
              subLocality: result.subLocality || "",
              locality: result.locality || "",
              village: result.village || "",
              district: result.district || "",
              subDistrict: result.subDistrict || "",
              city: result.city || "",
              state: result.state || "",
              pincode: result.pincode || "",
              eLoc: result.eLoc || "",
              lat: result.latitude || lat,
              lng: result.longitude || lng,
              formatted_address:
                result.formattedAddress ||
                result.address ||
                `${result.locality || ""}, ${result.city || ""}, ${
                  result.state || ""
                }`.trim(),
            },
          ];
        } else {
          console.log(
            "OAuth confidence too low, will use fallback API for better accuracy"
          );
        }
      }
    }

    // If OAuth didn't return results, fallback to previous working API
    if (results.length === 0) {
      console.log("OAuth returned no results, trying fallback API...");

      try {
        const fallbackUrl = `https://apis.mappls.com/advancedmaps/v1/${process.env.MAPPLS_API_KEY}/rev_geocode?lat=${lat}&lng=${lng}`;
        console.log("Trying fallback API:", fallbackUrl);

        const fallbackResponse = await fetch(fallbackUrl);

        if (fallbackResponse.ok) {
          const fallbackData = await fallbackResponse.json();
          console.log(
            "Fallback API response:",
            JSON.stringify(fallbackData, null, 2)
          );

          if (fallbackData.results && fallbackData.results.length > 0) {
            results = fallbackData.results.map((result) => ({
              ...result,
              eLoc: result.eLoc || "", // Keep eLoc if available
              formatted_address:
                result.formatted_address ||
                `${result.locality || ""}, ${result.city || ""}, ${
                  result.state || ""
                }`.trim(),
            }));

            // Try to get eLoc for the main result if not present
            if (results[0] && !results[0].eLoc && token) {
              try {
                console.log("Trying to get eLoc for fallback result...");
                const forwardGeocodeUrl = `https://atlas.mappls.com/api/places/geocode?address=${encodeURIComponent(
                  results[0].formatted_address
                )}`;

                const forwardResponse = await fetch(forwardGeocodeUrl, {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                  },
                });

                if (forwardResponse.ok) {
                  const forwardData = await forwardResponse.json();
                  console.log(
                    "Forward geocode response for eLoc:",
                    JSON.stringify(forwardData, null, 2)
                  );

                  if (forwardData.copResults && forwardData.copResults.eLoc) {
                    results[0].eLoc = forwardData.copResults.eLoc;
                    console.log(
                      "Found eLoc from forward geocoding:",
                      forwardData.copResults.eLoc
                    );
                  }
                }
              } catch (elocError) {
                console.error(
                  "Error getting eLoc for fallback result:",
                  elocError
                );
              }
            }
          }
        }
      } catch (fallbackError) {
        console.error("Fallback API also failed:", fallbackError);
      }
    }

    // Return in expected format
    res.json({
      responseCode: 200,
      version: "oauth",
      results: results,
    });
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
