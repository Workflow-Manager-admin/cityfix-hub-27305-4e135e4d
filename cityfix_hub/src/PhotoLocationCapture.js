import React, { useState } from "react";

/**
 * PhotoLocationCapture
 * - Lets user select a photo (by upload or camera)
 * - Immediately after photo selection, triggers geolocation capture
 * - Shows "Capturing your location… Please allow access." while waiting for location permission/result
 * - Once both are acquired, keeps {photoFile, photoPreview, location} in state for further use
 *
 * Usage:
 *     <PhotoLocationCapture 
 *         onReady={({ photoFile, photoPreviewUrl, location }) => { ... }}
 *     />
 * 
 * Props:
 *   onReady: (object) => void    // called when both photo and location are available
 */
/**
 * PUBLIC_INTERFACE
 * PhotoLocationCapture
 * Lets user select a photo (by upload or camera), then immediately triggers browser geolocation with user prompt,
 * showing robust feedback/status. When both are acquired, delivers {photoFile, photoPreviewUrl, location} to parent.
 */
function PhotoLocationCapture({ onReady }) {
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState("");
  const [location, setLocation] = useState(null); // {lat, lng}
  const [locationStatus, setLocationStatus] = useState("");
  const [locationPending, setLocationPending] = useState(false);
  const [error, setError] = useState("");

  // Helper: Request geolocation programmatically (returns promise)
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
      window.navigator.geolocation.getCurrentPosition(
        position => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        err => {
          let msg = "Could not get your location.";
          if (err.code === 1) msg = "Permission denied. Please allow location in your browser.";
          else if (err.code === 2) msg = "Location unavailable. Try again or enable GPS.";
          else if (err.code === 3) msg = "Location request timed out.";
          else if (err.message) msg = err.message;
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

  async function beginLocationCapture() {
    setError("");
    setLocation(null);
    setLocationStatus("Capturing your location… Please allow access.");
    setLocationPending(true);

    try {
      const geo = await requestGeo();
      setLocation(geo);
      setLocationPending(false);
      setLocationStatus("");
      if (onReady) {
        onReady({ photoFile, photoPreviewUrl, location: geo });
      }
    } catch (errMsg) {
      setError(errMsg || "Could not capture your location.");
      setLocation(null);
      setLocationStatus("");
      setLocationPending(false);
    }
  }

  function handlePhotoChange(e) {
    setError("");
    const file = e.target.files[0];
    if (!file) {
      setPhotoFile(null);
      setPhotoPreviewUrl("");
      setLocation(null);
      setLocationStatus("");
      setLocationPending(false);
      return;
    }
    setPhotoFile(file);
    setPhotoPreviewUrl(URL.createObjectURL(file));
    // Auto-trigger location capture after photo selection
    beginLocationCapture();
  }

  function handleReset() {
    setPhotoFile(null);
    setPhotoPreviewUrl("");
    setLocation(null);
    setLocationStatus("");
    setLocationPending(false);
    setError("");
  }

  function handleRetry() {
    setError("");
    setLocationStatus("Capturing your location… Please allow access.");
    setLocationPending(true);
    beginLocationCapture();
  }

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
          style={{ color: "#fff", width: 156, background: "#11192e", borderRadius: 6 }}
          onChange={handlePhotoChange}
          disabled={locationPending}
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

      {/* Show location status */}
      {photoFile && (
        <div style={{ marginTop: 18 }}>
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
              <span role="img" aria-label="progress" style={{ fontSize: 20 }}>
                ⏳
              </span>
              {locationStatus || "Capturing your location… Please allow access."}
            </div>
          ) : location ? (
            <div
              style={{
                background: "#071e16",
                border: "1.5px solid #00ffa2",
                borderRadius: 6,
                color: "#3afa72",
                fontWeight: 600,
                padding: "11px 9px",
                minHeight: 38,
                fontSize: 13.5,
                marginBottom: 2,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
              aria-live="polite"
            >
              <span role="img" aria-label="location">📍</span>
              Captured:{" "}
              <b>
                {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </b>
            </div>
          ) : error ? (
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
              }}
              aria-live="polite"
            >
              ❌ {error}
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
          ) : null}
        </div>
      )}
    </div>
  );
}

export default PhotoLocationCapture;
