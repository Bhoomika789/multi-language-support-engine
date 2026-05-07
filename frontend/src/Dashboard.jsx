import React, { useEffect, useState } from "react";
import API from "./services/api";

export default function Dashboard({ onLogout }) {
  const [records, setRecords] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("NEW");

  // 🔹 Load data
  const loadRecords = () => {
    API.get("/api/records")
      .then((res) => setRecords(res.data))
      .catch((err) => {
        console.error(err);
        alert("Failed to load records");
      });
  };

  useEffect(() => {
    loadRecords();
  }, []);

  // 🔹 ADD RECORD
  const addRecord = () => {
    if (!title || !description) {
      alert("Enter all fields");
      return;
    }

    API.post("/api/records", {
      title,
      description,
      status,
    })
      .then(() => {
        setTitle("");
        setDescription("");
        setStatus("NEW");
        loadRecords(); // 🔥 refresh table
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to add record");
      });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Records Manager</h2>

      {/* INPUT */}
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option>NEW</option>
        <option>IN_PROGRESS</option>
        <option>DONE</option>
      </select>

      <button onClick={addRecord}>Add</button>

      <hr />

      {/* TABLE */}
      {records.length === 0 ? (
        <p>No records found</p>
      ) : (
        records.map((r) => (
          <div key={r.id}>
            {r.title} - {r.description} ({r.status})
          </div>
        ))
      )}

      <br />

      <button
        onClick={() => {
          localStorage.removeItem("token");
          onLogout();
        }}
      >
        Logout
      </button>
    </div>
  );
}