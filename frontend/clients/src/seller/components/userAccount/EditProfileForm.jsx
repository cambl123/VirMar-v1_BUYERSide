import React, { useState } from "react";

function EditProfileForm({ seller, onCancel, onSave }) {
  const [formData, setFormData] = useState({
    name: seller.name || "",
    email: seller.email || "",
    phone: seller.phone || "",
    bio: seller.bio || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
  };

  return (
    <div style={{ padding: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h3>Edit Profile</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "0.8rem" }}>
          <label>
            Name: <br />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.5rem" }}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: "0.8rem" }}>
          <label>
            Email: <br />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.5rem" }}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: "0.8rem" }}>
          <label>
            Phone: <br />
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: "0.8rem" }}>
          <label>
            Bio: <br />
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              style={{ width: "100%", padding: "0.5rem", minHeight: "80px" }}
            />
          </label>
        </div>
        <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "0.5rem 1rem",
              marginRight: "0.5rem",
              backgroundColor: "#eee",
              border: "1px solid #aaa",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditProfileForm;
