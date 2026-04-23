import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");

  // GET data
  const fetchData = () => {
    fetch("http://localhost:8080/api/records")
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // POST data
  const handleSubmit = () => {
    const newData = { title, language };

    fetch("http://localhost:8080/api/records", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newData)
    })
      .then(res => res.json())
      .then(() => {
        fetchData(); // refresh list
        setTitle("");
        setLanguage("");
      })
      .catch(err => console.error(err));
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Multi-Language Support Engine</h1>
      <h2>Day 4 — Add Records 🚀</h2>

      {/* FORM */}
      <div>
        <input
          type="text"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br /><br />
        <input
          type="text"
          placeholder="Enter Language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        />
        <br /><br />
        <button onClick={handleSubmit}>Add Record</button>
      </div>

      <hr />

      {/* DATA LIST */}
      {data.map((item, index) => (
        <p key={index}>
          {item.title} - {item.language}
        </p>
      ))}
    </div>
  );
}

export default App;