import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.message || "Register failed");
      }

      const data = result?.data || {};
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      navigate("/");
    } catch (err) {
      setError(err.message || "An error occurred");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#0f172a",
          color: "#e5e7eb",
          padding: 24,
          borderRadius: 12,
          width: "100%",
          maxWidth: 380,
          boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
        }}
      >
        <h2
          style={{
            color: "#ffffff",
            margin: 0,
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          Register
        </h2>
        <div style={{ marginBottom: 12 }}>
          <label
            style={{ display: "block", marginBottom: 6, color: "#e2e8f0" }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 10,
              boxSizing: "border-box",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              backgroundColor: "#ffffff",
            }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label
            style={{ display: "block", marginBottom: 6, color: "#e2e8f0" }}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: 10,
              boxSizing: "border-box",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              backgroundColor: "#ffffff",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: 10,
            boxSizing: "border-box",
            display: "block",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Sign up
        </button>
        <div style={{ marginTop: 12, textAlign: "center", color: "#cbd5e1" }}>
          Already have an account ?{" "}
          <a
            href="/login"
            style={{
              color: "#93c5fd",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Sign in
          </a>
        </div>
        {error && (
          <p style={{ color: "#fecaca", marginTop: 12, textAlign: "center" }}>
            {error}
          </p>
        )}
      </form>
    </div>
  );
}

export { Register };
