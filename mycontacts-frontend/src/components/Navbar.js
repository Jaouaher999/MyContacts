import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        backgroundColor: "#0f172a",
        color: "#e5e7eb",
        boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div>
        <Link
          to="/"
          style={{
            color: "#0f172a",
            backgroundColor: "#93c5fd",
            textDecoration: "none",
            fontWeight: 600,
            padding: "8px 12px",
            borderRadius: 8,
          }}
        >
          Home
        </Link>
      </div>
      
      <div style={{ fontWeight: 700, color: "#ffffff", letterSpacing: 0.3 }}>
        My Contacts
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Link
          to="/profile"
          style={{
            color: "#0f172a",
            textDecoration: "none",
            fontWeight: 600,
            padding: "6px 10px",
            borderRadius: 8,
            backgroundColor: "#93c5fd",
          }}
        >
          Profile
        </Link>
      </div>
    </nav>
  );
}

export { Navbar };
