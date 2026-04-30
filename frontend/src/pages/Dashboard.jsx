import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/records/stats")
      .then(res => {

        // Merge duplicate languages
        const merged = {};

        res.data.forEach(item => {
          const lang = item.language.trim().toLowerCase();

          if (merged[lang]) {
            merged[lang] += item.count;
          } else {
            merged[lang] = item.count;
          }
        });

        // Convert to chart format
        const finalData = Object.keys(merged).map(key => ({
          language: key,
          count: merged[key]
        }));

        setData(finalData);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container">
      <h2>📊 Language Distribution</h2>

      <div className="chart-box">
        {data.length === 0 ? (
          <p>No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="language" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default Dashboard;