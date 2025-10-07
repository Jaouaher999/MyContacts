import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/auth/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch profile");
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);
  
  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "3rem", color: "red" }}>
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "3rem" }}>Loading...</div>
    );
  }

  return (
    <div
      style={{
        height: "85vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ffffff",
      }}
    >
      <div
        style={{
          maxWidth: 380,
          width: "100%",
          padding: 24,
          borderRadius: 12,
          boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
          backgroundColor:"#0f172a",
          color: "#e5e7eb"
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 16, color: "#ffffff", margin: 0 }}>
          My Profile
        </h2>

        <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
          <strong>Email:</strong>
          <p style={{ marginLeft: 16}}>{user.email}</p>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          style={{
            boxSizing: "border-box",
            display: "block",
            width: "100%",
            padding: 10,
            backgroundColor: "#dc2626",
            color: "#ffffff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export { Profile };
