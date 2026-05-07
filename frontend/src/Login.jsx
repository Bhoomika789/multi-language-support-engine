import React, { useState } from "react";
import API from "./services/api";   // ✅ IMPORTANT

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    if (!username || !password) {
      alert("Enter username & password");
      return;
    }

    API.post("/auth/login", { username, password })
      .then((res) => {
        console.log("LOGIN SUCCESS:", res.data);

        localStorage.setItem("token", res.data.token);

        onLogin(); // ✅ correct (no reload)
      })
      .catch((err) => {
        console.error(err);
        alert("Invalid credentials");
      });
  };

  const register = () => {
    if (!username || !password) {
      alert("Enter username & password");
      return;
    }

    API.post("/auth/register", { username, password })
      .then(() => alert("Registered! Now login"))
      .catch((err) => {
        console.error(err);
        alert("Registration failed");
      });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-100">
      <h2 className="text-2xl font-bold">🔐 Login</h2>

      <input
        className="border p-2 rounded w-64"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        className="border p-2 rounded w-64"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="flex gap-3">
        <button
          onClick={login}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Login
        </button>

        <button
          onClick={register}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Register
        </button>
      </div>
    </div>
  );
}