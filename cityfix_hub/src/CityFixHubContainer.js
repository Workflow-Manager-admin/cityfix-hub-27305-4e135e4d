import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import UserSignUp from "./UserSignUp";

/*
  Color theme:
    --primary:   #ffffff (text, nav text, card background)
    --secondary: #0000ff (nav bar, button accent, borders)
    --accent:    #00ff00 (success, floating elements)
  Uses dark background, modern flat design.
*/

const ISSUE_TYPES = [
  "Pothole",
  "Illegal Waste Dump",
  "Broken Streetlight",
  "Blocked Drain",
  "Vandalism",
  "Illegal Parking",
  "Water Leakage",
  "Other",
];

const STATUS_OPTIONS = ["Reported", "In Progress", "Fixed"];

// Simple Toast/Banner for feedback
function Toast({ message, type = "success", onClose }) {
  if (!message) return null;
  return (
    <div
      className={`cityfix-toast ${type}`}
      style={{
        position: "fixed",
        top: 80,
        right: 16,
        padding: "12px 24px",
        borderRadius: 6,
        background: type === "error" ? "#222" : "var(--accent)",
        color: "#fff",
        fontWeight: 600,
        zIndex: 1000,
        minWidth: 220,
        boxShadow: "0 2px 8px #0008",
        border: type === "error" ? "1.5px solid #ff0000" : "none",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
      role="alert"
    >
      <span>
        {type === "error" ? "⚠️ " : "✔️ "}
        {message}
      </span>
      <button
        onClick={onClose}
        style={{
          marginLeft: "auto",
          background: "none",
          border: "none",
          color: "#fff",
          cursor: "pointer",
          fontSize: 16,
        }}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}

/**
 * MapThumbnail shows a static OSM iframe for lat/lng or falls back to a link if blocked.
 * - Can be used in form or report grid cards.
 * PUBLIC_INTERFACE
 */
function MapThumbnail({ lat, lng, width = "100%", height = 120, borderRadius = 6, border = "#223", style = {}, linkOnly = false }) {
  const [error, setError] = useState(false);
  if (!lat || !lng) return null;

  const osmUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=18/${lat}/${lng}`;
  const embedSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.004},${lat - 0.003},${lng + 0.004},${lat + 0.003}&layer=mapnik&marker=${lat},${lng}`;
  // Try iframe; if fails, fallback to just clickable OPEN MAP link
  if (error || linkOnly) {
    return (
      <div style={{ width, minHeight: 45, margin: "2px 0" }}>
        <a href={osmUrl} target="_blank" rel="noopener noreferrer"
           style={{ color: "#7fffd4", textDecoration: "underline", fontSize: 13.2 }}>
           🌍 Open Map ({lat.toFixed(5)},{lng.toFixed(5)})
        </a>
      </div>
    );
  }
  return (
    <div style={{ width, maxWidth: 340, minHeight: height, borderRadius: borderRadius, border: `1.5px solid ${border}`, margin: "2px 0", ...style, overflow: "hidden", background: "#151b37" }}>
      <iframe
        title="Map Thumbnail"
        width="100%"
        height={height}
        frameBorder="0"
        style={{ borderRadius, display: "block", width: "100%", pointerEvents: "auto" }}
        src={embedSrc}
        aria-label="Location map preview"
        allowFullScreen
        loading="lazy"
        onError={() => setError(true)}
      />
      <div style={{ textAlign: "right", fontSize: 11, color: "#aaa", padding: "1px 4px 2px 0" }}>
        <a href={osmUrl} tabIndex={-1} rel="noopener noreferrer" target="_blank" style={{ color: "#6ce6dc" }}>
          View Larger (OSM)
        </a>{" "}
        |{" "}
        <a
          href={`https://maps.google.com/?q=${lat},${lng}`}
          tabIndex={-1}
          rel="noopener noreferrer"
          target="_blank"
          style={{ color: "#aaffec" }}
        >
          Google Maps
        </a>
      </div>
    </div>
  );
}

/* Updated Report Card: shows location beneath the photo with an embedded map and clickable coords */
function ReportCard({ report, isAdmin, onStatusChange }) {
  const {
    id,
    photo,
    type,
    description,
    location,
    status,
    createdAt,
  } = report;

  // Only show valid map for proper coordinates
  const hasCoords = location?.lat && location?.lng;

  // Google Maps direct link fallback
  const gmapsUrl = hasCoords
    ? `https://maps.google.com/?q=${location.lat},${location.lng}`
    : null;

  return (
    <div
      className="cityfix-card"
      style={{
        background: "#181d28",
        borderRadius: 12,
        padding: 16,
        color: "#fff",
        minWidth: 250,
        boxShadow: "0 1.5px 8px #0006",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          minHeight: 130,
          background: "#222",
          borderRadius: 6,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 0,
        }}
      >
        {photo ? (
          // eslint-disable-next-line
          <img
            src={photo}
            alt="Issue"
            style={{
              height: 130,
              width: "auto",
              maxWidth: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <span style={{ color: "#444", fontSize: 80 }}>📷</span>
        )}
      </div>
      {/* Location badge with clickable coordinates and map */}
      <div style={{ width: "100%", margin: "2px 0 2px 0" }}>
        <div
          style={{
            background: "#131834",
            border: "1px solid #223",
            borderRadius: 5,
            color: "#aae4c7",
            fontSize: 13.2,
            padding: "6px 9px 5px 5px",
            letterSpacing: 0.1,
            fontFamily: "monospace",
            display: "flex",
            alignItems: "center",
            gap: 6,
            overflowX: "auto",
            wordBreak: "break-word",
            flexWrap: "wrap"
          }}
          aria-label={`Latitude and longitude for this issue${hasCoords ? `: ${location.lat}, ${location.lng}` : ""}`}
        >
          <span role="img" aria-label="location" style={{ fontSize: 15 }}>
            📍
          </span>
          {hasCoords ? (
            <>
              <a
                href={gmapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#7fffd4", textDecoration: "underline", marginRight: 7, wordBreak: "keep-all", display: "inline-block" }}
                title="Open location in Google Maps"
              >
                <span>
                  Lat: <b style={{ color: "#7fffd4", marginRight: 2 }}>{location.lat.toFixed(6)}</b>
                  | Lng: <b style={{ color: "#7fffd4", marginRight: 4 }}>{location.lng.toFixed(6)}</b>
                </span>
              </a>
              <a
                href={`https://www.openstreetmap.org/?mlat=${location.lat}&mlon=${location.lng}#map=18/${location.lat}/${location.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={-1}
                style={{
                  color: "#aaffec",
                  textDecoration: "underline",
                  fontSize: 11,
                  marginLeft: 5,
                  marginRight: 2,
                }}
                title="Open location in OpenStreetMap"
              >
                OSM
              </a>
            </>
          ) : (
            <span style={{ color: "#ff9999" }}>Location N/A</span>
          )}
        </div>
        {hasCoords &&
          <div style={{ maxWidth: 340, margin: "2px auto 1px auto" }}>
            <MapThumbnail lat={location.lat} lng={location.lng} width="100%" height={90} borderRadius={5} />
          </div>
        }
      </div>
      <div style={{ fontWeight: 600, color: "var(--primary)" }}>{type}</div>
      <div style={{ color: "var(--text-secondary)", fontSize: 15 }}>
        {description || <span style={{ color: "#555" }}>No description</span>}
      </div>
      <div style={{ marginTop: 2, fontSize: 13, color: "#aaa" }}>
        <span>Status: </span>
        <b
          style={{
            color:
              status === "Fixed"
                ? "var(--accent)"
                : status === "In Progress"
                  ? "#ffe400"
                  : "#7fdbff",
          }}
        >
          {status}
        </b>
      </div>
      {createdAt && (
        <span style={{ color: "#888", fontSize: 12, marginTop: -7 }}>
          {new Date(createdAt).toLocaleString()}
        </span>
      )}
      {isAdmin && (
        <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
          {STATUS_OPTIONS.map((opt) =>
            opt !== status ? (
              <button
                key={opt}
                className="btn"
                style={{
                  fontSize: 13,
                  padding: "6px 12px",
                  background:
                    opt === "Fixed"
                      ? "var(--accent)"
                      : opt === "In Progress"
                        ? "var(--secondary)"
                        : "#7fdbff",
                  color: "#222",
                }}
                onClick={() => onStatusChange && onStatusChange(id, opt)}
              >
                Mark {opt}
              </button>
            ) : null
          )}
        </div>
      )}
    </div>
  );
}

// Camera component for live capture (fallback-aware)
function CameraCapture({ onCapture, fallbackToInput, onFallback, previewSrc, disabled }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState("");

  // Try to start camera
  async function startCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      onFallback();
      return;
    }
    try {
      setError("");
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      setError("Could not access camera: " + err.message);
      setIsCapturing(false);
      onFallback();
    }
  }

  // Take snapshot from video
  const handleSnap = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth > 0 ? video.videoWidth : 320;
    canvas.height = video.videoHeight > 0 ? video.videoHeight : 240;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    // Convert to a blob and then create File object for preview and submit
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
        onCapture(file, URL.createObjectURL(blob));
        stopCamera();
      }
    }, "image/jpeg", 0.93);
  };

  // Stop camera and cleanup
  const stopCamera = () => {
    setIsCapturing(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => () => stopCamera(), []);

  if (fallbackToInput) return null;

  if (!isCapturing) {
    return (
      <button
        className="btn"
        style={{ fontSize: 15, background: "var(--secondary)", color: "#fff", fontWeight: 500 }}
        type="button"
        disabled={disabled}
        aria-label="Open camera to take photo"
        onClick={startCamera}
      >
        📷 Take Photo
      </button>
    );
  }

  // Show live video preview and "Snap" button
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 9, marginTop: 6,
    }}>
      {error && <span style={{ color: "#ff5555", fontSize: 13 }}>{error}</span>}
      <video
        ref={videoRef}
        style={{
          borderRadius: 8,
          width: 210,
          height: 160,
          background: "#080b1d",
          objectFit: "cover",
          border: "1.5px solid #222"
        }}
        autoPlay
        muted
        playsInline
      />
      <div style={{ display: "flex", gap: 9 }}>
        <button
          type="button"
          className="btn"
          style={{
            padding: "7px 15px",
            background: "var(--accent)",
            color: "#222",
            fontWeight: 600,
          }}
          onClick={handleSnap}
        >
          Snap
        </button>
        <button
          type="button"
          className="btn"
          style={{
            padding: "7px 15px",
            background: "#999",
            color: "#222",
            fontWeight: 600,
          }}
          onClick={() => {
            stopCamera();
            onFallback();
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/**
 * Simple modal overlay for login (used with UserSignUp form)
 */
function LoginModal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(20,28,54,0.93)",
        zIndex: 3000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity .25s",
        animation: "fadein .2s",
      }}
      aria-modal="true"
      tabIndex={-1}
      role="dialog"
      onClick={onClose}
    >
      <div
        style={{
          position: "relative",
          maxWidth: 440,
          width: "95vw",
          background: "#181b2a",
          borderRadius: 12,
          boxShadow: "0 6px 40px #0548  ",
          padding: "2.4rem 1.1rem 1.1rem 1.1rem",
        }}
        className="login-modal-inner"
        onClick={e => e.stopPropagation()} // Prevent clicks in content from closing modal
      >
        <button
          aria-label="Close login"
          style={{
            position: "absolute",
            top: 8, right: 10,
            background: "none",
            border: "none",
            color: "#fff",
            fontSize: 25,
            fontWeight: "bold",
            opacity: 0.77,
            cursor: "pointer",
            zIndex: 2
          }}
          onClick={onClose}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function CityFixHubContainer() {
  // State for login/signup (modal)
  const [loginOpen, setLoginOpen] = useState(false);

  // Form state
  const [type, setType] = useState(""); // Issue type
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState(""); // for UI preview
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [locationStatus, setLocationStatus] = useState(""); // for feedback

  // UI/toast/report state
  const [toast, setToast] = useState(null);
  const [toastType, setToastType] = useState("success");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reports, setReports] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); // For demo, could be hooked up to auth

  // Camera integration state
  const [cameraFallback, setCameraFallback] = useState(false); // fallback if getUserMedia unavailable
  const [cameraSupported, setCameraSupported] = useState(false);

  // File input ref for fallback and reset
  const fileInputRef = useRef();

  // Detect camera (getUserMedia) support on mount
  useEffect(() => {
    if (
      navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === "function"
    ) {
      setCameraSupported(true);
    } else {
      setCameraSupported(false);
      setCameraFallback(true);
    }
  }, []);

  // Load demo reports (placeholder for actual API)
  useEffect(() => {
    setReports([
      {
        id: "101",
        type: "Pothole",
        description: "A big pothole on Main St.",
        photo: "",
        location: { lat: 40.7128, lng: -74.0060 },
        status: "Reported",
        createdAt: Date.now() - 3600000,
      },
      {
        id: "102",
        type: "Illegal Waste Dump",
        description: "Improper garbage dumped near park.",
        photo: "",
        location: { lat: 40.7115, lng: -74.0055 },
        status: "In Progress",
        createdAt: Date.now() - 7200000,
      },
      {
        id: "103",
        type: "Vandalism",
        description: "Spray paint on community center wall.",
        photo: "",
        location: { lat: 40.7101, lng: -74.0040 },
        status: "Fixed",
        createdAt: Date.now() - 9600000,
      },
    ]);
  }, []);

  // Toast close after 3s
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3300);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // PUBLIC_INTERFACE
  function handlePhotoChange(e) {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) {
      setPhotoURL(URL.createObjectURL(file));
    } else {
      setPhotoURL("");
    }
  }

  function handlePhotoCapture(file, url) {
    setPhoto(file);
    setPhotoURL(url);
    setCameraFallback(true); // auto-exit camera mode on capture
    // reset fileInput if switching from file to camera
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // Geolocation (browser API)
  function handleGetLocation() {
    if (!("geolocation" in navigator)) {
      setLocationStatus("Geolocation unsupported");
      setToast("Geolocation not supported in this browser.");
      setToastType("error");
      return;
    }
    setLocationStatus("Loading...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationStatus("Captured!");
      },
      (err) => {
        setLocationStatus("Failed");
        setToast("Could not get location (" + err.message + ")", "error");
        setToastType("error");
      }
    );
  }

  // Auto geotag on form mount for convenience (optional: comment out if undesired)
  useEffect(() => {
    if ("geolocation" in navigator && !location.lat && !location.lng) {
      // Wait ~500ms for UI to settle for a less jarring prompt
      const t = setTimeout(() => handleGetLocation(), 600);
      return () => clearTimeout(t);
    }
  }, []); // Only once

  // PUBLIC_INTERFACE
  async function handleSubmit(e) {
    e.preventDefault();
    if (!type || !description || !location.lat || !location.lng) {
      setToast("Fill all fields and capture location.", "error");
      setToastType("error");
      return;
    }
    setIsSubmitting(true);
    // Upload image to Cloudinary (placeholder logic - integrate later)
    let uploadedPhotoUrl = "";
    if (photo) {
      // TODO: Replace with actual Cloudinary upload/API call
      uploadedPhotoUrl = photoURL;
    }
    // Save report to server (placeholder - replace with Axios POST)
    const fakeId = (100 + Math.floor(Math.random() * 100000)).toString();
    const newReport = {
      id: fakeId,
      type,
      description,
      photo: uploadedPhotoUrl,
      location,
      status: "Reported",
      createdAt: Date.now(),
    };
    setReports((prev) => [newReport, ...prev]);
    setToast("Issue reported successfully!");
    setToastType("success");
    setIsSubmitting(false);

    // Reset form
    setType("");
    setDescription("");
    setPhoto(null);
    setPhotoURL("");
    setLocation({ lat: null, lng: null });
    setLocationStatus("");
    setCameraFallback(!cameraSupported);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // Handler for admin status update
  function handleStatusChange(reportId, newStatus) {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? { ...r, status: newStatus }
          : r
      )
    );
    setToast("Status updated!");
    setToastType("success");
  }

  // Render
  return (
    <div className="app cityfix-hub-app" style={{ background: "#101426", minHeight: "100vh" }}>
      <nav
        className="navbar"
        style={{
          background: "var(--secondary)",
          borderBottom: "2px solid #222",
          color: "var(--primary)",
        }}
      >
        <div 
          className="container"
          style={{
            display: "flex",
            alignItems: "center",
            minHeight: 56,
            justifyContent: "space-between",
            position: "relative",
            width: "100%"
          }}
        >
          {/* Centered bold site name */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              pointerEvents: "none",
              zIndex: 1,
            }}
          >
            <span
              className="logo"
              style={{
                fontWeight: 800,
                fontSize: "1.45rem",
                color: "#fff",
                letterSpacing: 0.9,
                display: "flex",
                alignItems: "center",
                gap: 8,
                pointerEvents: "auto",
              }}
            >
              <span
                className="logo-symbol"
                style={{
                  color: "var(--accent)",
                  fontSize: 26,
                  fontWeight: 900,
                  marginRight: 7,
                }}
                aria-label="CityFixHub"
              >
                ♻️
              </span>
              CityFix Hub
            </span>
          </div>
          {/* "Login" button on top right, "Switch to Admin/User" as demo */}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", zIndex: 2 }}>
            <button
              className="btn"
              style={{
                background: "#fff",
                color: "var(--secondary)",
                fontWeight: 600,
                marginRight: "16px",
                padding: "8px 18px",
                borderRadius: 5,
                fontSize: 15.5,
                display: "inline-block",
                minWidth: 83,
              }}
              onClick={() => setLoginOpen(true)}
            >
              Login
            </button>
            <button
              className="btn"
              style={{
                background: isAdmin ? "var(--accent)" : "var(--primary)",
                color: isAdmin ? "#222" : "var(--secondary)",
                fontWeight: 600,
              }}
              onClick={() => setIsAdmin((x) => !x)}
            >
              {isAdmin ? "Switch to User" : "Switch to Admin"}
            </button>
          </div>
        </div>
      </nav>

      {/* Login Modal: Show UserSignUp only if loginOpen */}
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)}>
        <UserSignUp
          onSuccess={() => {
            setLoginOpen(false);
            setToast("Registration successful!");
            setToastType("success");
          }}
        />
      </LoginModal>

      {/* Toast/banner */}
      <Toast message={toast} type={toastType} onClose={() => setToast(null)} />

      <main
        style={{
          paddingTop: 90,
          paddingBottom: 24,
          minHeight: "100vh",
          background: "#101426",
        }}
      >
        <div className="container" style={{ maxWidth: 960 }}>
          {/* Report Issue Form */}
          <section
            style={{
              margin: "0 0 24px 0",
              background: "#161729",
              borderRadius: 10,
              padding: "24px 20px",
              boxShadow: "0 1.5px 8px #0004",
              color: "#fff",
            }}
            aria-labelledby="report-title"
          >
            <h2 id="report-title" style={{ fontWeight: 700, fontSize: 22, margin: 0, color: 'var(--primary)' }}>
              Report an Issue
            </h2>
            <form
              onSubmit={handleSubmit}
              style={{
                marginTop: 18,
                display: "flex",
                flexDirection: "column",
                gap: 18,
              }}
              autoComplete="off"
            >
              {/* Type dropdown */}
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <label htmlFor="issue-type" style={{ fontWeight: 500 }}>
                  Issue Type <span style={{ color: "var(--accent)" }}>*</span>
                </label>
                <select
                  id="issue-type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                  style={{
                    background: "#151b37",
                    color: "#fff",
                    border: "1.5px solid var(--secondary)",
                    borderRadius: 6,
                    padding: "7.5px 12px",
                    fontSize: 16,
                    fontWeight: 500,
                  }}
                >
                  <option value="">Select type</option>
                  {ISSUE_TYPES.map((option, idx) =>
                    <option value={option} key={idx}>{option}</option>
                  )}
                </select>
              </div>

              {/* Description */}
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <label htmlFor="desc" style={{ fontWeight: 500 }}>
                  Description <span style={{ color: "var(--accent)" }}>*</span>
                </label>
                <textarea
                  id="desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  minLength={4}
                  required
                  placeholder="Describe the problem..."
                  rows={2}
                  style={{
                    background: "#151b37",
                    color: "#fff",
                    border: "1.5px solid var(--secondary)",
                    borderRadius: 6,
                    padding: 10,
                    fontSize: 15,
                    resize: "vertical",
                  }}
                />
              </div>
              {/* Photo Upload or Live Camera */}
              <div>
                <label htmlFor="photo-upload" style={{ fontWeight: 500 }}>
                  Photo (optional)
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 13, flexWrap: "wrap" }}>
                  {/* Camera preferred (mobile-friendly): Only show BOTH file and camera Fallback, not both live! */}
                  {cameraSupported && !cameraFallback && (
                    <CameraCapture
                      onCapture={handlePhotoCapture}
                      fallbackToInput={cameraFallback}
                      onFallback={() => setCameraFallback(true)}
                      previewSrc={photoURL}
                      disabled={!!photo}
                    />
                  )}
                  {/* If fallback to file input */}
                  {(!cameraSupported || cameraFallback) && (
                    <React.Fragment>
                      <input
                        id="photo-upload"
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        style={{ color: "#fff", fontWeight: 400, width: 180 }}
                        capture="environment"
                        // ^ for mobile, hints to use rear camera (supported on most mobile browsers)
                      />
                      <button
                        type="button"
                        className="btn"
                        style={{ fontSize: 13, background: "#555", color: "#fff", marginLeft: 7, padding: "4px 9px" }}
                        onClick={() => {
                          setCameraFallback(false);
                          setPhoto(null);
                          setPhotoURL("");
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        disabled={!cameraSupported}
                        aria-label="Switch to live camera"
                        title={
                          cameraSupported
                            ? "Switch to live camera"
                            : "Live camera not supported in this browser"
                        }
                      >
                        {cameraSupported ? "Use Camera" : "Camera unavailable"}
                      </button>
                    </React.Fragment>
                  )}
                  {!!photoURL && (
                    // eslint-disable-next-line
                    <img
                      src={photoURL}
                      alt="Preview"
                      style={{ width: 52, height: 52, objectFit: "cover", borderRadius: 7, border: "1px solid #444", marginLeft: 7 }}
                    />
                  )}
                  {photo && (
                    <button
                      className="btn"
                      style={{
                        padding: "4px 12px",
                        background: "#ff4466",
                        color: "#fff",
                        marginLeft: 6,
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                      type="button"
                      onClick={() => {
                        setPhoto(null); setPhotoURL(""); if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
                {/* Fallback UI - explain missing support */}
                {!cameraSupported && (
                  <span style={{ fontSize: 13, color: "#ff5555", marginTop: 4, display: "block" }}>
                    Live camera capture is not supported in this browser. You can use file upload.
                  </span>
                )}
              </div>
              {/* Location capture field */}
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <label style={{ fontWeight: 500 }}>
                  Location <span style={{ color: "var(--accent)" }}>*</span>
                </label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 15,
                    flexWrap: "wrap",
                    flexDirection: "row",
                  }}
                >
                  <div style={{display:"flex", flexDirection:"column", gap:2}}>
                  <button
                    type="button"
                    className="btn"
                    style={{
                      fontSize: 15,
                      background: "var(--secondary)",
                      minWidth: 136,
                    }}
                    onClick={handleGetLocation}
                  >
                    {location.lat && location.lng
                      ? "Update Location"
                      : "Capture Location"}
                  </button>
                  {/* Location preview block, now clickable and next to map */}
                  <span
                    style={{
                      color:
                        locationStatus === "Captured!"
                          ? "var(--accent)"
                          : locationStatus === "Failed"
                          ? "#ff5555"
                          : "#fff",
                      fontSize: 13,
                      fontFamily: "monospace",
                      background: "#111622",
                      border: "1.3px solid #224",
                      padding: "4.5px 8px",
                      borderRadius: 6,
                      minWidth: 120,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      letterSpacing: 0.2,
                      marginTop: 2,
                    }}
                  >
                    <span role="img" aria-label="Location">📍</span>
                    {location.lat && location.lng ? (
                      <>
                        <a
                          href={`https://maps.google.com/?q=${location.lat},${location.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#7fffd4", textDecoration: "underline", marginRight: 7 }}
                          title="Open location in Google Maps"
                        >
                          <span>
                            {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                          </span>
                        </a>
                        <a
                          href={`https://www.openstreetmap.org/?mlat=${location.lat}&mlon=${location.lng}#map=17/${location.lat}/${location.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#aaffec", textDecoration: "underline", fontSize: 11 }}
                          title="Open location in OpenStreetMap"
                        >
                          OSM
                        </a>
                      </>
                    ) : locationStatus ? (
                      locationStatus
                    ) : (
                      "Not set"
                    )}
                  </span>
                  </div>
                  {/* Show thumbnail map if location */}
                  {(location.lat && location.lng) && (
                    <div style={{ minWidth:120, maxWidth: 180, flex:1 }}>
                      <MapThumbnail lat={location.lat} lng={location.lng} width="100%" height={65} borderRadius={6} style={{marginTop:0}} />
                    </div>
                  )}
                </div>
                {/* Accessible text fallback for manual entry (unsupported) */}
                {locationStatus === "Geolocation unsupported" && (
                  <span style={{ fontSize: 13, color: "#ff5555" }}>
                    Location autofill is not supported by your device/browser. Please enter location manually.
                  </span>
                )}
              </div>
              {/* Submit Button */}
              <div>
                <button
                  className="btn btn-large"
                  style={{
                    background: "var(--secondary)",
                    color: "#fff",
                    fontWeight: 600,
                    width: 180,
                    fontSize: 17,
                  }}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Reporting..." : "Report Issue"}
                </button>
              </div>
            </form>
          </section>

          {/* Report List */}
          <section>
            <h3 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 12px 0", color: 'var(--primary)' }}>
              Recent Reports
            </h3>
            {reports.length === 0 ? (
              <div style={{ color: "#666", padding: "1.5rem" }}>
                No issues reported yet!
              </div>
            ) : (
              <div
                className="cityfix-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: 20,
                }}
              >
                {reports.map((rep) =>
                  <ReportCard
                    key={rep.id}
                    report={rep}
                    isAdmin={isAdmin}
                    onStatusChange={handleStatusChange}
                  />
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default CityFixHubContainer;
