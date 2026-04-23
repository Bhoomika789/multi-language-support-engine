import { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/records")
      .then(res => res.json())
      .then(data => {
        console.log("API DATA:", data);
        setData(data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Multi-Language Support Engine</h1>
      <h2>Day 3 Integration 🚀</h2>

      {data.map((item, index) => (
        <p key={index}>
          {item.title} - {item.language}
        </p>
      ))}
    </div>
  );
}

export default App;