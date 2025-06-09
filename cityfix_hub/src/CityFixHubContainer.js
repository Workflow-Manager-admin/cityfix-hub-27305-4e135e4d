import React, { useState, useEffect, useRef } from "react";
import "./App.css";

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

// Report Card
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
      <div style={{ width: "100%", minHeight: 130, background: "#222", borderRadius: 6, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {photo ? (
          // eslint-disable-next-line
          <img
            src={photo}
            alt="Issue"
            style={{height: 130, width: "auto", maxWidth: "100%", objectFit: "cover"}}
          />
        ) : (
          <span style={{ color: "#444", fontSize: 80 }}>📷</span>
        )}
      </div>
      <div style={{ fontWeight: 600, color: "var(--primary)" }}>{type}</div>
      <div style={{ color: "var(--text-secondary)", fontSize: 15 }}>{description || <span style={{color:'#555'}}>No description</span>}</div>
      <div style={{ color: "#b2f3b2", fontSize: 13 }}>
        <span role="img" aria-label="location">📍</span>
        {location?.lat && location?.lng
          ? ` ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`
          : " Location N/A"}
      </div>
      <div style={{ marginTop: 2, fontSize: 13, color: "#aaa"}}>
        <span>Status: </span>
        <b style={{
          color:
            status === "Fixed"
              ? "var(--accent)"
              : status === "In Progress"
              ? "#ffe400"
              : "#7fdbff",
        }}>
          {status}
        </b>
      </div>
      {createdAt && (
        <span style={{color:'#888', fontSize:12, marginTop:-7}}>
          {new Date(createdAt).toLocaleString()}
        </span>
      )}
      {isAdmin && (
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          {STATUS_OPTIONS.map((opt) =>
            opt !== status ? (
              <button
                key={opt}
                className="btn"
                style={{
                  fontSize: 13,
                  padding: "6px 12px",
                  background: opt === "Fixed"
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

// PUBLIC_INTERFACE
function CityFixHubContainer() {
  // State for form
  const [type, setType] = useState(""); // issue type
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoURL, setPhotoURL] = useState(""); // for UI preview
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [locationStatus, setLocationStatus] = useState(""); // for feedback

  // State for UI/toasts and issues
  const [toast, setToast] = useState(null);
  const [toastType, setToastType] = useState("success");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reports, setReports] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); // For demo, could be hooked up to auth
  
  // Mock: Load some issues initially (would be replaced with API call)
  useEffect(() => {
    // Placeholder for API
    setReports([
      {
        id: "101",
        type: "Pothole",
        description: "A big pothole on Main St.",
        photo: "",
        location: {lat: 40.7128, lng: -74.0060},
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

  // Handle file select & preview
  const fileInputRef = useRef();
  function handlePhotoChange(e) {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) {
      setPhotoURL(URL.createObjectURL(file));
    } else {
      setPhotoURL("");
    }
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

  return (
    <div className="app cityfix-hub-app" style={{background:"#101426", minHeight:"100vh"}}>
      <nav
        className="navbar"
        style={{
          background: "var(--secondary)",
          borderBottom: "2px solid #222",
          color: "var(--primary)",
        }}
      >
        <div className="container" style={{display:"flex", alignItems:"center", minHeight: 56}}>
          <div className="logo" style={{fontSize: "1.32rem", letterSpacing: 0.8, color:"#fff"}}>
            <span
              className="logo-symbol"
              style={{
                color: "var(--accent)",
                fontSize: 25,
                fontWeight: 800,
                marginRight: 7,
              }}
              aria-label="CityFixHub"
            >
              ♻️
            </span>{" "}
            CityFix Hub
          </div>
          <button
            className="btn"
            style={{
              background: isAdmin ? "var(--accent)" : "var(--primary)",
              color: isAdmin ? "#222" : "var(--secondary)",
              marginLeft: "auto",
              fontWeight: 600,
            }}
            onClick={() => setIsAdmin((x) => !x)}
          >
            {isAdmin ? "Switch to User" : "Switch to Admin"}
          </button>
        </div>
      </nav>

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
        <div className="container" style={{maxWidth: 960}}>
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
            <h2 id="report-title" style={{ fontWeight: 700, fontSize: 22, margin: 0, color:'var(--primary)' }}>
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
                  Issue Type <span style={{color:"var(--accent)"}}>*</span>
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
                  Description <span style={{color:"var(--accent)"}}>*</span>
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
              {/* Photo Upload */}
              <div>
                <label htmlFor="photo-upload" style={{ fontWeight: 500 }}>
                  Photo (optional)
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                  <input
                    id="photo-upload"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    style={{ color: "#fff", fontWeight: 400, width: 180 }}
                  />
                  {photoURL && (
                    // eslint-disable-next-line
                    <img
                      src={photoURL}
                      alt="Preview"
                      style={{ width: 52, height: 52, objectFit: "cover", borderRadius: 7, border: "1px solid #444" }}
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
              </div>
              {/* Location capture field */}
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <label style={{ fontWeight: 500 }}>
                  Location <span style={{color:"var(--accent)"}}>*</span>
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button
                    type="button"
                    className="btn"
                    style={{ fontSize: 15, background: "var(--secondary)" }}
                    onClick={handleGetLocation}
                  >
                    {location.lat && location.lng
                      ? "Update Location"
                      : "Capture Location"}
                  </button>
                  <span
                    style={{
                      color: locationStatus === "Captured!" ? "var(--accent)" : locationStatus === "Failed" ? "#ff5555" : "#fff",
                      fontSize: 13,
                    }}
                  >
                    {/* If captured, display lat/lng */}
                    {location.lat && location.lng ?
                       `📍 ${location.lat.toFixed(3)}, ${location.lng.toFixed(3)}`
                       : locationStatus || "Not set"}
                  </span>
                </div>
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
            <h3 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 12px 0", color:'var(--primary)' }}>
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
