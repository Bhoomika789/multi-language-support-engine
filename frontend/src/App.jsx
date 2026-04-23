import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const fetchData = () => {
    fetch("http://localhost:8080/api/records")
      .then(res => res.json())
      .then(data => setData(data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = () => {
    fetch("http://localhost:8080/api/records", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, language })
    }).then(() => {
      fetchData();
      setTitle("");
      setLanguage("");
    });
  };

  const handleDelete = (index) => {
    fetch(`http://localhost:8080/api/records/${index}`, {
      method: "DELETE"
    }).then(() => fetchData());
  };

  const handleEdit = (index, item) => {
    setEditIndex(index);
    setTitle(item.title);
    setLanguage(item.language);
  };

  const handleUpdate = () => {
    fetch(`http://localhost:8080/api/records/${editIndex}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, language })
    }).then(() => {
      setEditIndex(null);
      setTitle("");
      setLanguage("");
      fetchData();
    });
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Multi-Language Support Engine</h1>
      <h2>Day 5 — Full CRUD 🚀</h2>

      <input
        placeholder="Enter Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Enter Language"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      />
      <br /><br />

      <button onClick={editIndex !== null ? handleUpdate : handleAdd}>
        {editIndex !== null ? "Update Record" : "Add Record"}
      </button>

      <hr />

      {data.map((item, index) => (
        <div key={index}>
          <p>{item.title} - {item.language}</p>

          <button onClick={() => handleEdit(index, item)}>Edit</button>
          <button onClick={() => handleDelete(index)}>Delete</button>

          <br /><br />
        </div>
      ))}
    </div>
  );
}

export default App;