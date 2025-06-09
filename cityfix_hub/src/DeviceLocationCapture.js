import React, { useState, useEffect } from "react";

/**
 * DeviceLocationCapture - Prompts user for browser/device geolocation
 * and returns { lat, lng } on success.
 * Handles permissions, errors, and user feedback.
 *
 * Props:
 *   onLocation(locationObj) - called with {lat, lng} on success
 *   onError(errorMsg)       - called on error (optional)
 *   buttonLabel             - optional custom button label
 *   style                   - optional object for root style overrides
 *   className               - optional string for root div
 *
 * PUBLIC_INTERFACE
 */
function DeviceLocationCapture({
  onLocation,
  onError,
  buttonLabel = "Get My Location",
  style,
  className = ""
}) {
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState("");
  const [permissionState, setPermissionState] = useState("prompt"); // "granted" | "denied" | "prompt" | "unknown"

  // On mount: Check permission state and subscribe to changes
  useEffect(() => {
    let permStatus;
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: "geolocation" })
        .then(status => {
          setPermissionState(status.state);
          permStatus = status;
          status.onchange = () => setPermissionState(status.state);
        })
        .catch(() => setPermissionState("unknown"));
    }
    return () => {
      // Remove listener if necessary (for future-proofing)
      if (permStatus && permStatus.onchange) {
        permStatus.onchange = null;
      }
    };
  }, []);

  // Start location process
  async function handleGetLocation() {
    setError("");
    setLoading(true);
    setCoords(null);

    // Secure context only
    const isSecure =
      (typeof window.isSecureContext === "boolean" && window.isSecureContext) ||
      window.location.protocol === "https:" ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";
    if (!isSecure) {
      const msg =
        "Geolocation not available: Site must be loaded over HTTPS or localhost.";
      setError(msg);
      setLoading(false);
      if (onError) onError(msg);
      return;
    }

    if (!navigator.geolocation) {
      const msg = "This browser does not support geolocation.";
      setError(msg);
      setLoading(false);
      if (onError) onError(msg);
      return;
    }

    // Optionally check Permissions API status immediately before request (to block denied)
    if (navigator.permissions && navigator.permissions.query) {
      try {
        const status = await navigator.permissions.query({ name: "geolocation" });
        setPermissionState(status.state);
        status.onchange = () => setPermissionState(status.state);
        if (status.state === "denied") {
          const msg = "Location permission denied in browser. Please allow location access for this site.";
          setError(msg);
          setLoading(false);
          if (onError) onError(msg);
          return;
        }
      } catch {
        setPermissionState("unknown");
      }
    }

    // Request geolocation now
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setCoords(loc);
        setLoading(false);
        setError("");
        setPermissionState("granted");
        if (onLocation) onLocation(loc);
      },
      (err) => {
        let msg = "Could not get location.";
        if (err.code === 1) {
          msg = "Permission denied. Please allow location access in your browser.";
          setPermissionState("denied");
        } else if (err.code === 2) {
          msg = "Location unavailable on this device.";
        } else if (err.code === 3) {
          msg = "Location request timed out. Try again.";
        } else if (err.message) {
          msg = err.message;
        }
        setError(msg);
        setLoading(false);
        if (onError) onError(msg);
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );
  }

  // Describe permission state for accessibility
  let helperMessage = "";
  if (loading) {
    helperMessage = "Getting location...";
  } else if (coords) {
    helperMessage = `Location: ${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`;
  } else if (error) {
    helperMessage = error;
  } else if (permissionState === "denied") {
    helperMessage =
      "Location permission denied. Please allow browser access for this site.";
  } else if (permissionState === "prompt") {
    helperMessage = "Press the button to allow location access.";
  }

  return (
    <div
      className={className}
      style={{
        background: "#181d28",
        borderRadius: 8,
        padding: 14,
        color: "#fff",
        minWidth: 220,
        maxWidth: 350,
        ...style,
      }}
    >
      <button
        type="button"
        className="btn"
        style={{
          background: "#3480f7",
          color: "#fff",
          fontWeight: 500,
          fontSize: 16,
          borderRadius: 5,
          padding: "11px 20px",
          cursor: loading ? "wait" : "pointer",
          opacity: loading ? 0.7 : 1,
        }}
        onClick={handleGetLocation}
        disabled={loading}
        aria-busy={loading}
        aria-label="Get your current location using the browser"
      >
        {loading ? "Locating..." : buttonLabel}
      </button>
      <div
        style={{
          marginTop: 10,
          fontSize: 14,
          minHeight: 23,
          color: error
            ? "#fe6464"
            : coords
            ? "#3afa72"
            : permissionState === "denied"
            ? "#ffe94a"
            : "#cce4ff",
        }}
        aria-live="polite"
      >
        {coords ? (
          <>
            <span role="img" aria-label="Success">
              📍
            </span>{" "}
            <b>
              {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
            </b>
          </>
        ) : (
          helperMessage
        )}
      </div>
    </div>
  );
}

export default DeviceLocationCapture;
