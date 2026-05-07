import React, { useEffect, useState } from "react";
import API from "./services/api";
import Login from "./Login";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
 Legend,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [records, setRecords] = useState([]);

  const [selectedFile, setSelectedFile] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("NEW");

  const [search, setSearch] = useState("");

  const [editId, setEditId] = useState(null);

  const [editData, setEditData] = useState({
    title: "",
    description: "",
    status: "NEW",
  });

  const [page, setPage] = useState(0);

  const [totalPages, setTotalPages] = useState(1);

  // =========================
  // COUNTS
  // =========================

  const newCount = records.filter(
    (r) => r.status === "NEW"
  ).length;

  const progressCount = records.filter(
    (r) => r.status === "IN_PROGRESS"
  ).length;

  const completedCount = records.filter(
    (r) => r.status === "COMPLETED"
  ).length;

  const chartData = [
    {
      name: "NEW",
      value: newCount,
    },
    {
      name: "IN_PROGRESS",
      value: progressCount,
    },
    {
      name: "COMPLETED",
      value: completedCount,
    },
  ];

  const COLORS = ["#3b82f6", "#f59e0b", "#10b981"];

  // =========================
  // LOGOUT
  // =========================

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  // =========================
  // FETCH DATA
  // =========================

  const fetchData = () => {
    API.get(`/api/records/paged?page=${page}&size=20`)
      .then((res) => {
        setRecords(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch((err) => {
        console.error(err);

        if (err.response?.status === 403) {
          logout();
        }
      });
  };

  // =========================
  // SEARCH
  // =========================

  const searchRecords = (query) => {

    if (!query) {
      fetchData();
      return;
    }

    API.get(`/api/records/search?q=${query}`)
      .then((res) => {
        setRecords(res.data);
        setTotalPages(1);
      })
      .catch((err) => {
        console.error(err);
        alert("Search failed");
      });
  };

  // =========================
  // LOGIN CHECK
  // =========================

  useEffect(() => {

    if (localStorage.getItem("token")) {
      setIsLoggedIn(true);
    }

  }, []);

  // =========================
  // FETCH AFTER LOGIN
  // =========================

  useEffect(() => {

    if (isLoggedIn) {
      fetchData();
    }

  }, [page, isLoggedIn]);

  // =========================
  // LOGIN SCREEN
  // =========================

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  // =========================
  // ADD RECORD
  // =========================

  const addRecord = async () => {

    if (!title.trim() || !description.trim()) {
      alert("Please enter title and description");
      return;
    }

    try {

      await API.post("/api/records", {
        title,
        description,
        status,
      });

      alert("Record added successfully");

      setTitle("");
      setDescription("");
      setStatus("NEW");

      setPage(0);

      fetchData();

    } catch (error) {

      console.error(error);

      alert("Add failed");
    }
  };

  // =========================
  // DELETE
  // =========================

  const deleteRecord = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this record?"
    );

    if (!confirmDelete) return;

    try {

      await API.delete(`/api/records/${id}`);

      alert("Record deleted successfully");

      fetchData();

    } catch (error) {

      console.error(error);

      alert("Delete failed");
    }
  };

  // =========================
  // EXPORT CSV
  // =========================

  const exportCSV = () => {

    window.open(
      "http://localhost:8080/api/records/export",
      "_blank"
    );
  };

  // =========================
  // FILE UPLOAD
  // =========================

  const uploadFile = async () => {

    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    try {

      const formData = new FormData();

      formData.append("file", selectedFile);

      const response = await fetch(
        "http://localhost:8080/api/files/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.text();

      alert(result);

    } catch (error) {

      console.error(error);

      alert("Upload failed");
    }
  };

  // =========================
  // EDIT
  // =========================

  const startEdit = (record) => {

    setEditId(record.id);

    setEditData(record);
  };

  const saveEdit = () => {

    API.put(`/api/records/${editId}`, editData)
      .then(() => {

        setEditId(null);

        fetchData();
      });
  };

  // =========================
  // UI
  // =========================

  return (

    <div className="min-h-screen bg-gray-100 p-4">

      {/* HEADER */}

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">

        <div className="flex flex-col sm:flex-row items-center gap-4">

          <h1 className="text-4xl font-bold">
            📋 Records Manager
          </h1>

          <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow">
            Total Records: {records.length}
          </div>
        </div>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
        >
          Logout
        </button>
      </div>

      {/* DASHBOARD */}

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        <div className="bg-blue-500 text-white p-4 rounded shadow text-center">
          <h2 className="text-xl font-bold">
            Total Records
          </h2>

          <p className="text-3xl mt-2">
            {records.length}
          </p>
        </div>

        <div className="bg-green-500 text-white p-4 rounded shadow text-center">
          <h2 className="text-xl font-bold">
            NEW
          </h2>

          <p className="text-3xl mt-2">
            {newCount}
          </p>
        </div>

        <div className="bg-yellow-500 text-white p-4 rounded shadow text-center">
          <h2 className="text-xl font-bold">
            IN_PROGRESS
          </h2>

          <p className="text-3xl mt-2">
            {progressCount}
          </p>
        </div>

        <div className="bg-purple-500 text-white p-4 rounded shadow text-center">
          <h2 className="text-xl font-bold">
            COMPLETED
          </h2>

          <p className="text-3xl mt-2">
            {completedCount}
          </p>
        </div>
      </div>

      {/* FORM */}

      <div className="max-w-7xl mx-auto bg-white p-4 rounded shadow mb-6">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">

          <input
            className="border p-2 rounded"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="border p-2 rounded"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            className="border p-2 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>NEW</option>
            <option>IN_PROGRESS</option>
            <option>DONE</option>
          </select>

          <input
            className="border p-2 rounded"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              searchRecords(e.target.value);
            }}
          />
        </div>

        {/* BUTTONS */}

        <div className="flex flex-wrap gap-3 mt-4">

          <button
            onClick={addRecord}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>

          <button
            onClick={exportCSV}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Export CSV
          </button>

          <input
            type="file"
            onChange={(e) =>
              setSelectedFile(e.target.files[0])
            }
            className="border p-2 rounded bg-white"
          />

          <button
            onClick={uploadFile}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
          >
            Upload
          </button>
        </div>
      </div>

      {/* TABLE */}

      <div className="max-w-7xl mx-auto overflow-x-auto">

        <table className="w-full bg-white shadow rounded min-w-[700px]">

          <thead className="bg-gray-200">

            <tr>

              <th className="p-3">ID</th>
              <th className="p-3">Title</th>
              <th className="p-3">Description</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>

            </tr>
          </thead>

          <tbody>

            {records.length === 0 ? (

              <tr>

                <td
                  colSpan="5"
                  className="text-center p-4"
                >
                  No records found
                </td>

              </tr>

            ) : (

              records.map((r) => (

                <tr
                  key={r.id}
                  className="border-t text-center"
                >

                  <td className="p-2">
                    {r.id}
                  </td>

                  <td className="p-2">

                    {editId === r.id ? (

                      <input
                        className="border p-1 rounded"
                        value={editData.title}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            title: e.target.value,
                          })
                        }
                      />

                    ) : (
                      r.title
                    )}
                  </td>

                  <td className="p-2">

                    {editId === r.id ? (

                      <input
                        className="border p-1 rounded"
                        value={editData.description}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            description: e.target.value,
                          })
                        }
                      />

                    ) : (
                      r.description
                    )}
                  </td>

                  <td className="p-2">

                    {editId === r.id ? (

                      <select
                        className="border p-1 rounded"
                        value={editData.status}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            status: e.target.value,
                          })
                        }
                      >
                        <option>NEW</option>
                        <option>IN_PROGRESS</option>
                        <option>DONE</option>
                      </select>

                    ) : (
                      r.status
                    )}
                  </td>

                  <td className="p-2">

                    <div className="flex justify-center gap-2">

                      {editId === r.id ? (

                        <button
                          onClick={saveEdit}
                          className="bg-blue-500 text-white px-3 py-1 rounded"
                        >
                          Save
                        </button>

                      ) : (

                        <button
                          onClick={() => startEdit(r)}
                          className="bg-yellow-500 px-3 py-1 rounded"
                        >
                          Edit
                        </button>
                      )}

                      <button
                        onClick={() => deleteRecord(r.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}

      <div className="mt-6 flex justify-center items-center gap-4">

        <button
          onClick={() =>
            setPage((p) => Math.max(p - 1, 0))
          }
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Prev
        </button>

        <span className="font-semibold">

          Page {page + 1} / {totalPages}

        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Next
        </button>
      </div>

      {/* FOOTER */}

      <footer className="text-center mt-10 text-gray-600">

        <p>
          © 2026 Records Management System |
          Java Full Stack Project
        </p>

      </footer>

      {/* ANALYTICS */}

      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow mt-8">

        <h2 className="text-2xl font-bold mb-4 text-center">
          Records Analytics
        </h2>

        <div style={{ width: "100%", height: 350 }}>

          <ResponsiveContainer>

            <PieChart>

              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                dataKey="value"
                label
              >

                {chartData.map((entry, index) => (

                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default App;