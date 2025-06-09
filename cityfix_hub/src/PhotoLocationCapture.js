import React, { useState, useRef } from "react";

/**
 * PUBLIC_INTERFACE
 * PhotoLocationCapture
 * Lets user select a photo (by upload or camera), then:
 *   1) Captures device geolocation programmatically.
 *   2) Reverse-geocodes coordinates (OpenStreetMap Nominatim) to human-readable address.
 *   3) Auto-fills address field/state and gives robust feedback/status/errors at each stage.
 *   4) Calls `onReady({ photoFile, photoPreviewUrl, location, address })` when all is available.
 *
 * Props:
 *   onReady: ({ photoFile, photoPreviewUrl, location, address }) => void
 */
function PhotoLocationCapture({ onReady }) {
  // --- State ---
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState("");
  const [location, setLocation] = useState(null); // {lat, lng}
  const [address, setAddress] = useState(""); // human-readable
  const [locationPending, setLocationPending] = useState(false);
  const [locationStatus, setLocationStatus] = useState(""); // user-facing status string
  const [geoError, setGeoError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const lastSubmittedLocation = useRef(null);

  // --- Utility: Geolocation capture with permission & HTTPS context handling ---
  function requestGeo() {
    return new Promise((resolve, reject) => {
      if (!window.navigator.geolocation) {
        reject("Geolocation not supported in your browser.");
        return;
      }
      // Only allow in secure contexts
      const isSecure =
        (typeof window.isSecureContext === "boolean" && window.isSecureContext) ||
        window.location.protocol === "https:" ||
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1";
      if (!isSecure) {
        reject("Geolocation only works over HTTPS or localhost.");
        return;
      }
      setLocationStatus("Requesting device location…");
      window.navigator.geolocation.getCurrentPosition(
        pos => {
          resolve({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        err => {
          let msg;
          switch (err.code) {
            case 1: msg = "Permission denied. Please allow location in your browser."; break;
            case 2: msg = "Location unavailable. Try again or enable GPS."; break;
            case 3: msg = "Location request timed out."; break;
            default: msg = err.message || "Could not get your location.";
          }
          reject(msg);
        },
        {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 0
        }
      );
    });
  }

  // --- Reverse geocode with OSM Nominatim for address ---
  async function fetchAddress(lat, lng) {
    setIsFetchingAddress(true);
    setAddress("");
    setAddressError("");
    try {
      // Nominatim open API, use best practices. Limit for heavy use!
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=en`;
      const resp = await fetch(url, {
        headers: {
          "User-Agent": "CityFixHub/1.0 (+https://cityfix-hub.local)",
          "Referer": window?.location?.origin ?? undefined,
        }
      });
      if (!resp.ok) throw new Error("Failed to fetch address (API error).");
      const data = await resp.json();
      if (data.display_name) {
        setAddress(data.display_name);
        setAddressError("");
        setIsFetchingAddress(false);
        return data.display_name;
      } else {
        throw new Error("No address found for these coordinates.");
      }
    } catch (err) {
      setAddressError("Could not auto-capture address. Please enter manually.");
      setIsFetchingAddress(false);
      setAddress("");
      return "";
    }
  }

  // --- Orchestrate location & geocoding after photo selection ---
  async function beginLocationAndAddress() {
    setGeoError("");
    setLocation(null);
    setAddress("");
    setAddressError("");
    setLocationStatus("Capturing your location… Please allow access.");
    setLocationPending(true);

    try {
      const geo = await requestGeo();
      setLocation(geo);
      setLocationPending(false);
      setLocationStatus("");
      setAddress("");
      setIsFetchingAddress(true);
      // Use reverse geocoding
      const addressText = await fetchAddress(geo.lat, geo.lng);
      setIsFetchingAddress(false);

      // Callback if all succeeded
      if (onReady) {
        onReady({
          photoFile,
          photoPreviewUrl,
          location: geo,
          address: addressText
        });
      }
    } catch (errMsg) {
      setGeoError(errMsg || "Could not capture your location.");
      setLocation(null);
      setLocationStatus("");
      setLocationPending(false);
    }
  }

  // --- Handle photo input (auto-start location capture) ---
  function handlePhotoChange(e) {
    setGeoError("");
    setAddressError("");
    setAddress("");
    const file = e.target.files[0];
    if (!file) {
      setPhotoFile(null);
      setPhotoPreviewUrl("");
      setLocation(null);
      setAddress("");
      setLocationStatus("");
      setLocationPending(false);
      setIsFetchingAddress(false);
      return;
    }
    setPhotoFile(file);
    setPhotoPreviewUrl(URL.createObjectURL(file));
    // Auto-trigger location & address capture after photo selection
    beginLocationAndAddress();
  }

  function handleReset() {
    setPhotoFile(null);
    setPhotoPreviewUrl("");
    setLocation(null);
    setAddress("");
    setGeoError("");
    setAddressError("");
    setLocationStatus("");
    setLocationPending(false);
    setIsFetchingAddress(false);
  }

  function handleRetry() {
    setGeoError("");
    setAddressError("");
    setLocationStatus("Capturing your location… Please allow access.");
    setLocationPending(true);
    setIsFetchingAddress(false);
    beginLocationAndAddress();
  }

  // --- UI rendering with clear status feedback and robust error handling ---
  return (
    <div
      className="photo-location-capture"
      style={{
        background: "#191e2e",
        padding: 20,
        borderRadius: 10,
        boxShadow: "0 1.5px 8px #0003",
        maxWidth: 370,
        color: "#fff",
        margin: "0 auto",
      }}
    >
      <label style={{ fontWeight: 600, fontSize: 16, marginBottom: 3 }}>
        Upload Photo
      </label>
      <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
        <input
          type="file"
          accept="image/*"
          style={{
            color: "#fff",
            width: 156,
            background: "#11192e",
            borderRadius: 6,
          }}
          onChange={handlePhotoChange}
          disabled={locationPending || isFetchingAddress}
          capture="environment"
        />
        {photoPreviewUrl && (
          // eslint-disable-next-line
          <img
            src={photoPreviewUrl}
            alt="Preview"
            style={{
              width: 46,
              height: 46,
              objectFit: "cover",
              border: "1.5px solid #333",
              borderRadius: 6,
              marginLeft: 8,
            }}
          />
        )}
        {photoFile && (
          <button
            type="button"
            className="btn"
            style={{
              padding: "2px 10px",
              fontSize: 13,
              background: "#ff4466",
              color: "#fff",
              marginLeft: 6,
              fontWeight: 500,
            }}
            onClick={handleReset}
            aria-label="Remove photo"
          >
            Remove
          </button>
        )}
      </div>

      {/* Status: Location & Address Feedback */}
      {photoFile && (
        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 7 }}>
          {locationPending ? (
            <div
              style={{
                background: "#121b36",
                border: "1.5px dashed #7ef2cf",
                borderRadius: 6,
                padding: "12px 9px",
                minHeight: 40,
                fontWeight: 600,
                color: "#aaffec",
                fontSize: 14.2,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
              aria-live="polite"
            >
              <span role="img" aria-label="progress" style={{ fontSize: 20 }}>⏳</span>
              {locationStatus || "Capturing your location… Please allow access."}
            </div>
          ) : geoError ? (
            <div
              style={{
                background: "#29011a",
                border: "1.5px solid #ff4476",
                borderRadius: 6,
                color: "#fe6464",
                fontWeight: 600,
                padding: "11px 9px",
                minHeight: 24,
                fontSize: 13.5,
                display: "flex",
                alignItems: "center"
              }}
              aria-live="polite"
            >
              ❌ {geoError}
              <button
                className="btn"
                type="button"
                style={{
                  background: "#7ee",
                  color: "#222",
                  marginLeft: 11,
                  padding: "2px 10px",
                  fontSize: 12.2,
                  borderRadius: 4,
                  cursor: "pointer",
                  fontWeight: 600,
                  border: "none",
                }}
                onClick={handleRetry}
                aria-label="Retry location"
              >
                Retry
              </button>
            </div>
          ) : (location && !isFetchingAddress) ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                minHeight: 36,
              }}
              aria-live="polite"
            >
              <div
                style={{
                  background: "#071e16",
                  border: "1.5px solid #00ffa2",
                  borderRadius: 6,
                  color: "#3afa72",
                  fontWeight: 600,
                  padding: "11px 9px",
                  fontSize: 13.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 2
                }}
              >
                <span role="img" aria-label="location">📍</span>
                Captured:{" "}
                <b>
                  {location.lat?.toFixed(6)}, {location.lng?.toFixed(6)}
                </b>
              </div>
              {address && (
                <div
                  style={{
                    background: "#143c2a",
                    color: "#c3ffe2",
                    borderRadius: 5,
                    fontSize: 14.2,
                    fontWeight: 500,
                    padding: "8px 10px 8px 8px",
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                  }}
                >
                  <span role="img" aria-label="address" style={{ fontSize: 16 }}>🏠</span>
                  <span>{address}</span>
                </div>
              )}
              {addressError && (
                <span style={{ color: "#ff5555", fontSize: 13, marginTop: 2 }}>
                  {addressError}
                </span>
              )}
            </div>
          ) : isFetchingAddress ? (
            <div
              style={{
                background: "#121b36",
                border: "1.5px dashed #7ef2cf",
                borderRadius: 6,
                padding: "10px 9px",
                minHeight: 34,
                fontWeight: 500,
                color: "#aaffec",
                fontSize: 14.2,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
              aria-live="polite"
            >
              <span role="img" aria-label="progress" style={{ fontSize: 18 }}>
                📡
              </span>
              Looking up address…
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default PhotoLocationCapture;
