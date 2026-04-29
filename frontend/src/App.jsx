import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import "./index.css";

function App() {

  // 🔐 AUTH
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // DATA
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({ total: 0, english: 0 });

  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [editId, setEditId] = useState(null);

  const [search, setSearch] = useState("");
  const [aiResponse, setAiResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState(null);

  const API = "http://localhost:8080/api/records";

  // ======================
  // 🔐 LOGIN
  // ======================
  const handleLogin = () => {
    fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          alert("Invalid credentials ❌");
        }
      })
      .catch(() => alert("Login failed ❌"));
  };

  // ======================
  // 🔐 LOGOUT
  // ======================
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // ======================
  // 📥 FETCH DATA
  // ======================
  const fetchData = () => {
    fetch(API, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then(res => res.json())
      .then(setData);
  };

  const fetchStats = () => {
    fetch(`${API}/stats`, {
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then(res => res.json())
      .then(setStats);
  };

  useEffect(() => {
    if (token) {
      fetchData();
      fetchStats();
    }
  }, [token]);

  // ======================
  // 🔍 SEARCH
  // ======================
  useEffect(() => {
    const delay = setTimeout(() => {
      if (!search) {
        fetchData();
        return;
      }

      fetch(`${API}/search?q=${search}`, {
        headers: {
          Authorization: "Bearer " + token
        }
      })
        .then(res => res.json())
        .then(setData);

    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  // ======================
  // ➕ ADD
  // ======================
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

  // ======================
  // ❌ DELETE
  // ======================
  const handleDelete = (id) => {
    fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token
      }
    }).then(() => {
      fetchData();
      fetchStats();
    });
  };

  // ======================
  // ✏️ EDIT
  // ======================
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

  // ======================
  // 🤖 AI
  // ======================
  const handleAI = async () => {
    setLoading(true);

    const res = await fetch(`${API}/ai/describe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, language })
    });

    const data = await res.json();
    setAiResponse(data);
    setLoading(false);
  };

  // ======================
  // 📂 UPLOAD
  // ======================
  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API}/upload`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token
      },
      body: formData
    });

    alert(await res.text());
    fetchData();
  };

  // ======================
  // 📥 EXPORT (FIXED)
  // ======================
  const handleExport = async () => {
    try {
      const response = await fetch(`${API}/export`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        alert("Export failed ❌");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "records.csv";
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      alert("Error ❌");
    }
  };

  const chartData = [
    { name: "Total", value: stats.total },
    { name: "English", value: stats.english }
  ];

  // ======================
  // 🔐 LOGIN UI
  // ======================
  if (!token) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>🔐 Login</h2>
        <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
        <br />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
        <br />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  // ======================
  // MAIN UI
  // ======================
  return (
    <div className="container">

      <h1>🌍 Multi-Language Engine</h1>
      <button onClick={handleLogout}>Logout</button>

      <div className="cards">
        <div className="card">
          <h3>Total</h3>
          <p>{stats.total}</p>
        </div>
        <div className="card">
          <h3>English</h3>
          <p>{stats.english}</p>
        </div>
      </div>

      <BarChart width={400} height={300} data={chartData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#4F46E5" />
      </BarChart>

      <input
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="form">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <input value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="Language" />

        <button onClick={editId ? handleUpdate : handleAdd}>
          {editId ? "Update" : "Add"}
        </button>

        <button onClick={handleAI} disabled={!title || !language || loading}>
          {loading ? "Generating..." : "AI"}
        </button>
      </div>

      {aiResponse && (
        <div className="card">
          <p>{aiResponse.description}</p>
        </div>
      )}

      <h3>Upload CSV</h3>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>

      <h3>Export</h3>
      <button onClick={handleExport}>Download CSV</button>

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

export default App;