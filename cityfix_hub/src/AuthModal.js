import React, { useState } from "react";
import UserSignUp from "./UserSignUp";

// PUBLIC_INTERFACE
function SignInForm({ onSuccess }) {
  const [fields, setFields] = useState({ identifier: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Validate fields
  function validate(values) {
    const errs = {};
    // Email or phone
    if (!values.identifier.trim()) {
      errs.identifier = "Email or phone is required.";
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(values.identifier.trim()) &&
      !/^((\+91[\s\-]?)?[6-9]\d{9})$/.test(values.identifier.trim())
    ) {
      errs.identifier = "Enter a valid email or Indian phone number.";
    }
    // Password
    if (!values.password) {
      errs.password = "Password is required.";
    }
    return errs;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const vErrs = validate(fields);
    setErrors(vErrs);
    if (Object.keys(vErrs).length) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      if (onSuccess) onSuccess(); // mock login success
    }, 600);
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 15,
        marginTop: 10,
      }}
      noValidate
      autoComplete="off"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <label htmlFor="signin-identifier" style={{ fontWeight: 500 }}>
          Email or Phone <span style={{ color: "var(--accent)" }}>*</span>
        </label>
        <input
          id="signin-identifier"
          name="identifier"
          type="text"
          value={fields.identifier}
          onChange={handleChange}
          placeholder="Email or phone"
          required
          style={inputStyle(errors.identifier)}
          autoComplete="username"
        />
        {errors.identifier && <ErrorText>{errors.identifier}</ErrorText>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <label htmlFor="signin-password" style={{ fontWeight: 500 }}>
          Password <span style={{ color: "var(--accent)" }}>*</span>
        </label>
        <input
          id="signin-password"
          name="password"
          type="password"
          value={fields.password}
          onChange={handleChange}
          required
          placeholder="Enter your password"
          style={inputStyle(errors.password)}
          autoComplete="current-password"
        />
        {errors.password && <ErrorText>{errors.password}</ErrorText>}
      </div>
      {errors.submit && <ErrorText style={{ marginTop: 8 }}>{errors.submit}</ErrorText>}
      <button
        type="submit"
        className="btn btn-large"
        style={{
          background: "var(--secondary)",
          color: "#fff",
          fontWeight: 700,
          fontSize: 18,
          padding: "12px 0",
          borderRadius: 7,
          marginTop: 7,
          cursor: submitting ? "wait" : "pointer",
          opacity: submitting ? 0.7 : 1,
        }}
        disabled={submitting}
      >
        {submitting ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}

function inputStyle(error) {
  return {
    background: "#181d27",
    color: "#fff",
    border: error
      ? "1.5px solid #ff8888"
      : "1.5px solid var(--secondary)",
    padding: "8px 11px",
    borderRadius: 6,
    fontSize: 15,
    fontWeight: 400,
    boxSizing: "border-box",
    outline: error ? "2px solid #ff2222" : undefined,
    width: "100%",
  };
}

// ErrorText - styled inline error label
function ErrorText(props) {
  return (
    <span
      style={{
        color: "#ff5555",
        fontSize: 13,
        fontWeight: 500,
        marginTop: 1,
        minHeight: 15,
        letterSpacing: 0.1,
      }}
      {...props}
    >
      {props.children}
    </span>
  );
}

// PUBLIC_INTERFACE
function AuthModal({ open, onClose, onAuthSuccess }) {
  const [tab, setTab] = useState("signin");
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
          width: "100%",
          maxWidth: 430,
          background: "#181b2a",
          borderRadius: 12,
          boxShadow: "0 6px 40px #0548",
          padding: "2.1rem 1.1rem 1.1rem 1.1rem",
        }}
        className="login-modal-inner"
        onClick={e => e.stopPropagation()}
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
        {/* Tab selectors */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 0,
          marginBottom: 14,
          marginTop: 6,
          userSelect: "none"
        }}>
          <button
            type="button"
            style={{
              fontWeight: 700,
              color: tab === "signin" ? "var(--secondary)" : "#fff",
              background: tab === "signin" ? "#fff" : "transparent",
              border: "none",
              borderRadius: "6px 0 0 6px",
              padding: "9px 28px",
              fontSize: 18,
              cursor: tab === "signin" ? "default" : "pointer",
              borderBottom: tab === "signin" ? "3px solid var(--accent)" : "none"
            }}
            disabled={tab === "signin"}
            onClick={() => setTab("signin")}
          >
            Sign In
          </button>
          <button
            type="button"
            style={{
              fontWeight: 700,
              color: tab === "signup" ? "var(--secondary)" : "#fff",
              background: tab === "signup" ? "#fff" : "transparent",
              border: "none",
              borderRadius: "0 6px 6px 0",
              padding: "9px 28px",
              fontSize: 18,
              cursor: tab === "signup" ? "default" : "pointer",
              borderBottom: tab === "signup" ? "3px solid var(--accent)" : "none"
            }}
            disabled={tab === "signup"}
            onClick={() => setTab("signup")}
          >
            Sign Up
          </button>
        </div>
        {/* Forms */}
        <div>
          {tab === "signin" ? (
            <SignInForm onSuccess={onAuthSuccess || onClose} />
          ) : (
            <UserSignUp
              onSuccess={onAuthSuccess || onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
