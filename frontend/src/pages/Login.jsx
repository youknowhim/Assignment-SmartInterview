import "../styles/auth.css";
import { useState } from "react";
import { useNavigate , Link } from "react-router-dom";

export default function Login() {
  const Base_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return setError("All fields are required");
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${Base_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: form.email.toLowerCase(),
          password: form.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        return setError(data.message || "Invalid credentials");
      }

      // Save token
      localStorage.setItem("token", data.token);

      // Navigate to dashboard
      navigate("/dashboard");

    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={submit}>
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />



        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;New User? <Link to="/register">Register</Link>
      </p>
      </form>
    </div>
  );
}