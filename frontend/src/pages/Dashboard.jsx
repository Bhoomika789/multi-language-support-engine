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

const API = "http://localhost:8080/api/records/stats";

function Dashboard() {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const res = await axios.get(API);

        const merged = {};
        let total = 0;
        let english = 0;

        res.data.forEach(item => {
          const lang = item.language?.trim().toLowerCase();
          const count = item.count || 0;

          total += count;

          if (lang === "english") {
            english += count;
          }

          merged[lang] = (merged[lang] || 0) + count;
        });

        // Summary
        setSummary([
          { name: "Total", value: total },
          { name: "English", value: english }
        ]);

        // Language distribution
        const finalData = Object.keys(merged)
          .map(key => ({
            language: key,
            count: merged[key]
          }))
          .sort((a, b) => b.count - a.count);

        setData(finalData);

      } catch {
        alert("Failed to load stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container">

      <h1>Analytics Dashboard</h1>

      {loading && <p className="loading">Loading...</p>}

      {/* ===== SUMMARY ===== */}
      <div className="card">
        <h2>Summary</h2>
        <div className="chart-box">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={summary}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===== LANGUAGE DISTRIBUTION ===== */}
      <div className="card">
        <h2>Language Distribution</h2>

        {data.length === 0 ? (
          <p className="list-empty">No data available</p>
        ) : (
          <div className="chart-box">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="language"
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                />

                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

    </div>
  );
}

export default Dashboard;