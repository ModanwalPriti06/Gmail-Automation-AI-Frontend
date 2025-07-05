import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("test@mcp.com");
  const [password, setPassword] = useState("password123");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      console.log('res',res)
      localStorage.setItem("token", res.data.token);
      navigate("/mail");
    } catch (err) {
        console.log(err)
      alert("Login failed");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-20 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Login to MCP</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
