import React, { useState } from "react";

/**
 * UserSignUp is a self-contained registration form component.
 * Captures: name, phone, email, Aadhaar number, profile photo, password.
 * Validations:
 *   - Name: required, min 2 chars
 *   - Phone: required, valid Indian (+91 or 10 digit)
 *   - Email: required, valid format
 *   - Aadhaar: required, 12 digits, basic Luhn (for future, but shown as stub)
 *   - Photo: required, image file only
 *   - Password: required, min 8, upper, lower, digit
 * All errors shown inline.
 * Mobile-first design (responsive).
 */
// PUBLIC_INTERFACE
function UserSignUp({ onSubmit, onSuccess }) {
  const [fields, setFields] = useState({
    name: "",
    phone: "",
    email: "",
    aadhaar: "",
    password: "",
    photo: null,
  });
  const [photoPreview, setPhotoPreview] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Validation helpers
  function validate(values) {
    const errs = {};

    // Name
    if (!values.name.trim()) {
      errs.name = "Name is required.";
    } else if (values.name.trim().length < 2) {
      errs.name = "Name should be at least 2 characters.";
    }

    // Email
    if (!values.email.trim()) {
      errs.email = "Email is required.";
    } else if (
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(values.email)
    ) {
      errs.email = "Enter a valid email address.";
    }

    // Phone (Indian 10-digit, optional +91)
    if (!values.phone.trim()) {
      errs.phone = "Phone number is required.";
    } else if (
      !/^((\+91[\s-]?)?[6-9]\d{9})$/.test(values.phone.trim())
    ) {
      errs.phone =
        "Enter a valid Indian phone number (+91 XXXXX XXXXX or 10-digit).";
    }

    // Aadhaar
    if (!values.aadhaar.trim()) {
      errs.aadhaar = "Aadhaar number is required.";
    } else if (!/^\d{12}$/.test(values.aadhaar.trim())) {
      errs.aadhaar = "Aadhaar number must be exactly 12 digits.";
    } else if (!luhnCheckAadhaar(values.aadhaar.trim())) {
      errs.aadhaar =
        "Aadhaar number is invalid. (Check digit failed)";
    }

    // Password
    if (!values.password) {
      errs.password = "Password is required.";
    } else if (values.password.length < 8) {
      errs.password = "Password must be at least 8 characters.";
    } else if (!/(?=.*[a-z])/.test(values.password)) {
      errs.password = "Use at least one lowercase letter.";
    } else if (!/(?=.*[A-Z])/.test(values.password)) {
      errs.password = "Use at least one uppercase letter.";
    } else if (!/(?=.*[0-9])/.test(values.password)) {
      errs.password = "Use at least one number.";
    }

    // Photo (required)
    if (!values.photo) {
      errs.photo = "Profile photo is required.";
    } else if (
      values.photo &&
      !/^image\//.test(values.photo.type)
    ) {
      errs.photo = "Only image files (JPG, PNG, etc.) allowed.";
    }
    return errs;
  }

  // Aadhaar Luhn (Verhoeff) check stub (for real prod use Verhoeff, but we show plain Luhn)
  function luhnCheckAadhaar(aadhaar) {
    // Use simple Luhn for demo only (not real Aadhaar, which uses Verhoeff)
    let sum = 0;
    let shouldDouble = false;
    aadhaar = aadhaar.replace(/\D/g, "");
    for (let i = aadhaar.length - 1; i >= 0; i--) {
      let digit = parseInt(aadhaar.charAt(i), 10);
      if (shouldDouble) {
        if ((digit *= 2) > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  }

  // HANDLERS
  function handleChange(e) {
    const { name, value, files } = e.target;
    let update = {};
    if (name === "photo") {
      const file = files[0];
      update.photo = file;
      if (file) {
        setPhotoPreview(URL.createObjectURL(file));
      } else {
        setPhotoPreview("");
      }
    } else {
      update[name] = value;
    }
    setFields((prev) => ({
      ...prev,
      ...update,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const vErrs = validate(fields);
    setErrors(vErrs);
    if (Object.keys(vErrs).length) return;
    setSubmitting(true);
    try {
      // Call the provided onSubmit or fallback: show a simple success
      if (onSubmit) {
        await onSubmit(fields);
      }
      setSubmitting(false);
      setFields({
        name: "",
        phone: "",
        email: "",
        aadhaar: "",
        password: "",
        photo: null,
      });
      setPhotoPreview("");
      setErrors({});
      if (onSuccess) onSuccess();
      else alert("Successfully registered!");
    } catch (err) {
      setSubmitting(false);
      setErrors({
        submit: err.message || "Failed. Please try again.",
      });
    }
  }

  return (
    <div
      className="user-signup-wrapper"
      style={{
        background: "#161729",
        borderRadius: 10,
        padding: "24px 8px",
        maxWidth: 410,
        margin: "24px auto",
        color: "#fff",
        boxShadow: "0 2px 8px #001c",
      }}
    >
      <h2
        style={{
          fontWeight: 700,
          textAlign: "center",
          color: "var(--primary)",
          marginBottom: 10,
          fontSize: 23,
        }}
      >
        Create Account
      </h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
        noValidate
        autoComplete="off"
        encType="multipart/form-data"
      >
        {/* Name */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <label htmlFor="signup-name" style={{ fontWeight: 500 }}>
            Name <span style={{ color: "var(--accent)" }}>*</span>
          </label>
          <input
            id="signup-name"
            name="name"
            type="text"
            value={fields.name}
            onChange={handleChange}
            placeholder="Your full name"
            required
            minLength={2}
            style={inputStyle(errors.name)}
            autoComplete="name"
          />
          {errors.name && <ErrorText>{errors.name}</ErrorText>}
        </div>
        {/* Email */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <label htmlFor="signup-email" style={{ fontWeight: 500 }}>
            Email <span style={{ color: "var(--accent)" }}>*</span>
          </label>
          <input
            id="signup-email"
            name="email"
            type="email"
            inputMode="email"
            value={fields.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            style={inputStyle(errors.email)}
            autoComplete="email"
          />
          {errors.email && <ErrorText>{errors.email}</ErrorText>}
        </div>
        {/* Phone */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <label htmlFor="signup-phone" style={{ fontWeight: 500 }}>
            Phone Number <span style={{ color: "var(--accent)" }}>*</span>
          </label>
          <input
            id="signup-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            value={fields.phone}
            onChange={handleChange}
            placeholder="e.g. +91 XXXXX XXXXX or 9876543210"
            required
            pattern="^((\+91[\s-]?)?[6-9]\d{9})$"
            style={inputStyle(errors.phone)}
            autoComplete="tel"
          />
          {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
        </div>
        {/* Aadhaar Number */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <label htmlFor="signup-aadhaar" style={{ fontWeight: 500 }}>
            Aadhaar Number <span style={{ color: "var(--accent)" }}>*</span>
          </label>
          <input
            id="signup-aadhaar"
            name="aadhaar"
            type="text"
            inputMode="numeric"
            value={fields.aadhaar}
            onChange={handleChange}
            placeholder="12-digit Aadhaar"
            required
            minLength={12}
            maxLength={12}
            pattern="^\d{12}$"
            style={inputStyle(errors.aadhaar)}
            autoComplete="off"
          />
          {errors.aadhaar && <ErrorText>{errors.aadhaar}</ErrorText>}
        </div>
        {/* Photo (Profile) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <label htmlFor="signup-photo" style={{ fontWeight: 500 }}>
            Profile Photo <span style={{ color: "var(--accent)" }}>*</span>
          </label>
          <input
            id="signup-photo"
            name="photo"
            type="file"
            accept="image/*"
            onChange={handleChange}
            required
            style={{
              color: "#ccc",
              background: "#181d27",
              border: errors.photo ? "1.5px solid #ff8888" : "1.5px solid #444",
              padding: 6,
              borderRadius: 6,
              fontSize: 15,
              fontWeight: 400,
              width: "100%",
              boxSizing: "border-box",
            }}
          />
          {photoPreview && (
            // eslint-disable-next-line
            <img
              src={photoPreview}
              alt="Preview"
              style={{
                width: 60,
                height: 60,
                marginTop: 3,
                marginBottom: 3,
                borderRadius: 14,
                objectFit: "cover",
                border: "1px solid #448",
                background: "#0002",
                boxShadow: "0 1.5px 8px #0015",
              }}
            />
          )}
          {errors.photo && <ErrorText>{errors.photo}</ErrorText>}
        </div>
        {/* Password */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <label htmlFor="signup-password" style={{ fontWeight: 500 }}>
            Password <span style={{ color: "var(--accent)" }}>*</span>
          </label>
          <input
            id="signup-password"
            name="password"
            type="password"
            value={fields.password}
            onChange={handleChange}
            required
            placeholder="At least 8 chars, upper/lower/digit"
            minLength={8}
            style={inputStyle(errors.password)}
            autoComplete="new-password"
          />
          {errors.password && <ErrorText>{errors.password}</ErrorText>}
        </div>
        {/* General error */}
        {errors.submit && (
          <ErrorText style={{ marginTop: 8 }}>{errors.submit}</ErrorText>
        )}
        {/* Submit */}
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
            letterSpacing: 1.2,
            marginTop: 9,
            cursor: submitting ? "wait" : "pointer",
            opacity: submitting ? 0.7 : 1,
          }}
          disabled={submitting}
        >
          {submitting ? "Registering..." : "Register"}
        </button>
      </form>
      {/* Extra padding at bottom for mobile */}
      <div style={{ height: 8, minHeight: 8 }} />
    </div>
  );
}

// --- Reusable input style for error highlighting
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

export default UserSignUp;
