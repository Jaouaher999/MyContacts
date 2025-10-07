import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [error, setError] = useState("");
  const [editingContact, setEditingContact] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [createFormData, setCreateFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });
  const navigate = useNavigate();

  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchContacts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/contacts`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await res.json();
        if (!res.ok) {
          throw new Error(result?.message || "Failed to fetch contacts");
        }
        const list = Array.isArray(result?.data) ? result.data : [];
        setContacts(list);
      } catch (err) {
        setError(err.message || "Something went wrong");
      }
    };

    fetchContacts();
  }, [navigate]);

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/contacts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete contact");

      setContacts((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    setFormData({
      firstName: contact.firstName,
      lastName: contact.lastName,
      phone: contact.phone,
    });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(createFormData),
      });
      const result = await res.json();
      if (!res.ok)
        throw new Error(result?.message || "Failed to create contact");

      setContacts((prev) => [result.data, ...prev]);
      setShowCreateModal(false);
      setCreateFormData({ firstName: "", lastName: "", phone: "" });
    } catch (err) {
      setError(err.message || "Error creating contact");
    }
  };

  const handleCancelEdit = () => {
    setEditingContact(null);
    setFormData({ firstName: "", lastName: "", phone: "" });
  };

  const handleCancelCreate = () => {
    setShowCreateModal(false);
    setCreateFormData({ firstName: "", lastName: "", phone: "" });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/api/contacts/${editingContact._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await res.json();
      if (!res.ok)
        throw new Error(result?.message || "Failed to update contact");

      setContacts((prev) =>
        prev.map((c) => (c._id === editingContact._id ? result.data : c))
      );
      setEditingContact(null);
    } catch (err) {
      setError(err.message || "Error updating contact");
    }
  };

  if (!contacts) {
    return (
      <div style={{ textAlign: "center", marginTop: "3rem" }}>Loading...</div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 0,
          marginBottom: 16,
        }}
      >
        <h2 style={{ margin: 0 }}>Contacts</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{
            borderRadius: 8,
            padding: "8px 12px",
            color: "#0f172a",
            background: "#86efac",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Create Contact
        </button>
      </div>
      {contacts.length === 0 ? (
        <div>No contacts found.</div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {contacts.map((c) => (
            <li
              key={c._id}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: 12,
                marginBottom: 10,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontWeight: 600 }}>
                {c.firstName} {c.lastName}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div style={{ color: "#334155", marginRight: 16 }}>
                  {c.phone}
                </div>
                <button
                  onClick={() => handleEdit(c)}
                  style={{
                    margin: 6,
                    borderRadius: 8,
                    padding: 8,
                    color: "#0f172a",
                    background: "#93c5fd",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Update
                </button>
                <button
                  onClick={() => {
                    handleDelete(c._id);
                  }}
                  style={{
                    margin: 6,
                    borderRadius: 8,
                    padding: 8,
                    color: "#0f172a",
                    background: "#F54927",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {editingContact && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 16,
              borderRadius: 10,
              width: "100%",
              maxWidth: 380,
            }}
          >
            <h3 style={{ display: "flex", justifyContent: "center" }}>
              Update Contact
            </h3>
            <form onSubmit={handleUpdate}>
              <div style={{ marginBottom: 12 }}>
                <label
                  style={{ display: "block", marginBottom: 4, fontWeight: 500 }}
                >
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  style={{
                    display: "block",
                    width: 360,
                    marginBottom: 0,
                    padding: 8,
                  }}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label
                  style={{ display: "block", marginBottom: 4, fontWeight: 500 }}
                >
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  style={{
                    display: "block",
                    width: 360,
                    marginBottom: 0,
                    padding: 8,
                  }}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label
                  style={{ display: "block", marginBottom: 4, fontWeight: 500 }}
                >
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  style={{
                    display: "block",
                    width: 360,
                    marginBottom: 0,
                    padding: 8,
                  }}
                />
              </div>
              {error && (
                <p
                  style={{
                    marginTop: 12,
                    textAlign: "center",
                    color: "#dc2626",
                  }}
                >
                  {error}
                </p>
              )}
              <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                <button
                  type="submit"
                  style={{
                    background: "#16a34a",
                    color: "#fff",
                    border: "none",
                    padding: 12,
                    borderRadius: 5,
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  style={{
                    background: "#F54927",
                    color: "#fff",
                    border: "none",
                    padding: 12,
                    borderRadius: 5,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showCreateModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 16,
              borderRadius: 10,
              width: "100%",
              maxWidth: 380,
            }}
          >
            <h3 style={{ display: "flex", justifyContent: "center" }}>
              Create Contact
            </h3>
            <form onSubmit={handleCreate}>
              <div style={{ marginBottom: 12 }}>
                <label
                  style={{ display: "block", marginBottom: 4, fontWeight: 500 }}
                >
                  First Name
                </label>
                <input
                  type="text"
                  value={createFormData.firstName}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      firstName: e.target.value,
                    })
                  }
                  style={{
                    display: "block",
                    width: 360,
                    marginBottom: 0,
                    padding: 8,
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label
                  style={{ display: "block", marginBottom: 4, fontWeight: 500 }}
                >
                  Last Name
                </label>
                <input
                  type="text"
                  value={createFormData.lastName}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      lastName: e.target.value,
                    })
                  }
                  style={{
                    display: "block",
                    width: 360,
                    marginBottom: 0,
                    padding: 8,
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label
                  style={{ display: "block", marginBottom: 4, fontWeight: 500 }}
                >
                  Phone Number
                </label>
                <input
                  type="text"
                  value={createFormData.phone}
                  onChange={(e) =>
                    setCreateFormData({
                      ...createFormData,
                      phone: e.target.value,
                    })
                  }
                  style={{
                    display: "block",
                    width: 360,
                    marginBottom: 0,
                    padding: 8,
                  }}
                  required
                />
              </div>

              {error && (
                <p
                  style={{
                    marginTop: 12,
                    textAlign: "center",
                    color: "#dc2626",
                  }}
                >
                  {error}
                </p>
              )}
              <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                <button
                  type="submit"
                  style={{
                    background: "#16a34a",
                    color: "#fff",
                    border: "none",
                    padding: 12,
                    borderRadius: 5,
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCancelCreate}
                  style={{
                    background: "#F54927",
                    color: "#fff",
                    border: "none",
                    padding: 12,
                    borderRadius: 5,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export { Contacts };
