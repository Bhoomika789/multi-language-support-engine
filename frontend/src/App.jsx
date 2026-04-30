import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "./index.css";
import Dashboard from "./pages/Dashboard";

const BASE_URL = "http://localhost:8080/api";

function MainApp() {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [data, setData] = useState([]);
  const [stats, setStats] = useState({ total: 0, english: 0 });

  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [editId, setEditId] = useState(null);

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const API = `${BASE_URL}/records`;

  // ===== LOGIN =====
  const handleLogin = async () => {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const result = await res.json();

      if (result.token) {
        localStorage.setItem("token", result.token);
        setToken(result.token);
      } else {
        alert("Invalid credentials");
      }
    } catch {
      alert("Login failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // ===== FETCH =====
  const fetchAll = async () => {
    try {
      setLoading(true);

      const res = await fetch(API, {
        headers: { Authorization: "Bearer " + token }
      });

      const result = await res.json();
      setData(result);

      // stats
      const total = result.length;
      const english = result.filter(r => r.language?.toLowerCase() === "english").length;

      setStats({ total, english });

    } catch {
      alert("Error loading data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAll();
  }, [token]);

  // ===== CRUD =====
  const handleAdd = async () => {
    if (!title.trim() || !language.trim()) return alert("Fill all fields");

    await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({
        title,
        language: language.toLowerCase()
      })
    });

    setTitle("");
    setLanguage("");
    fetchAll();
  };

  const handleDelete = async (id) => {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token }
    });

    fetchAll();
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setTitle(item.title);
    setLanguage(item.language);
  };

  const handleUpdate = async () => {
    await fetch(`${API}/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({
        title,
        language: language.toLowerCase()
      })
    });

    setEditId(null);
    setTitle("");
    setLanguage("");
    fetchAll();
  };

  // ===== FILE =====
  const handleUpload = async () => {
    if (!file) return alert("Select file");

    const formData = new FormData();
    formData.append("file", file);

    await fetch(`${API}/upload`, {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
      body: formData
    });

    fetchAll();
  };

  const handleExport = async () => {
    const res = await fetch(`${API}/export`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "records.csv";
    a.click();
  };

  const chartData = [
    { name: "Total", value: stats.total },
    { name: "English", value: stats.english }
  ];

  // ===== LOGIN UI =====
  if (!token) {
    return (
      <div className="center-box">
        <h2>Login</h2>
        <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  // ===== MAIN UI =====
  return (
    <div className="container">

      <h1>Multi-Language Engine</h1>

      <div className="top-buttons">
        <button onClick={() => navigate("/dashboard")}>Dashboard</button>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {loading && <p className="loading">Loading...</p>}

      <div className="card">
        <h3>Total: {stats.total}</h3>
        <h3>English: {stats.english}</h3>

        <div className="chart-box">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="form">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
          <input value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="Language" />
          <button onClick={editId ? handleUpdate : handleAdd}>
            {editId ? "Update" : "Add"}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="form">
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <button onClick={handleUpload}>Upload</button>
          <button onClick={handleExport}>Download CSV</button>
        </div>
      </div>

      <div className="card">
        {data.length === 0 ? (
          <p className="list-empty">No records found</p>
        ) : (
          data.map(item => (
            <div key={item.id} className="list-item">
              <span>{item.title} - {item.language}</span>

              <div className="btn-group">
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}