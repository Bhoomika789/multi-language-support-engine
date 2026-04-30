import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "./index.css";
import Dashboard from "./pages/Dashboard";

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

  const API = "http://localhost:8080/api/records";

  // ================= LOGIN =================
  const handleLogin = () => {
    fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else alert("Invalid credentials ❌");
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // ================= FETCH =================
  const fetchData = () => {
    fetch(API, {
      headers: { Authorization: "Bearer " + token }
    })
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  };

  const fetchStats = () => {
    fetch(`${API}/stats`, {
      headers: { Authorization: "Bearer " + token }
    })
      .then(res => res.json())
      .then(data => {
        let total = 0;
        let english = 0;

        data.forEach(item => {
          total += item.count;

          if (item.language.toLowerCase() === "english") {
            english += item.count;
          }
        });

        console.log("STATS 👉", total, english);

        setStats({ total, english });
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (token) {
      fetchData();
      fetchStats();
    }
  }, [token]);

  // ================= CRUD =================
  const handleAdd = () => {
    fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ title, language })
    }).then(() => {
      fetchData();
      fetchStats();
      setTitle("");
      setLanguage("");
    });
  };

  const handleDelete = (id) => {
    fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token }
    }).then(() => {
      fetchData();
      fetchStats();
    });
  };

  const handleEdit = (item) => {
    setEditId(item.id);
    setTitle(item.title);
    setLanguage(item.language);
  };

  const handleUpdate = () => {
    fetch(`${API}/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({ title, language })
    }).then(() => {
      setEditId(null);
      setTitle("");
      setLanguage("");
      fetchData();
      fetchStats();
    });
  };

  // ================= FILE =================
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    await fetch(`${API}/upload`, {
      method: "POST",
      headers: { Authorization: "Bearer " + token },
      body: formData
    });

    fetchData();
  };

  const handleExport = async () => {
    const response = await fetch(`${API}/export`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "records.csv";
    a.click();
  };

  // ================= CHART FIX =================
  const chartData =
    stats.total > 0
      ? [
          { name: "Total", value: stats.total },
          { name: "English", value: stats.english }
        ]
      : [];

  // ================= LOGIN UI =================
  if (!token) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>🔐 Login</h2>
        <input placeholder="Username" onChange={e => setUsername(e.target.value)} /><br /><br />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} /><br /><br />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>

      <h1>🌍 Multi-Language Engine</h1>

      <button onClick={() => navigate("/dashboard")}>📊 Dashboard</button>
      <button onClick={handleLogout}>Logout</button>

      {/* KPI */}
      <h3>Total: {stats.total}</h3>
      <h3>English: {stats.english}</h3>

      {/* CHART FIXED */}
      <div style={{ width: "100%", height: 300 }}>
        {chartData.length === 0 ? (
          <p>📊 Loading chart...</p>
        ) : (
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* FORM */}
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <input value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="Language" />

      <button onClick={editId ? handleUpdate : handleAdd}>
        {editId ? "Update" : "Add"}
      </button>

      {/* FILE */}
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
      <button onClick={handleExport}>Download CSV</button>

      {/* DATA */}
      {data.map(item => (
        <div key={item.id}>
          {item.title} - {item.language}
          <button onClick={() => handleEdit(item)}>Edit</button>
          <button onClick={() => handleDelete(item.id)}>Delete</button>
        </div>
      ))}

    </div>
  );
}

// ================= ROUTER =================
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