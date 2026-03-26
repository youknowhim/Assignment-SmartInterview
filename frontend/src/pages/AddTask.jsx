import "../styles/form.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddTask() {
  const Base_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "High",
    status: "Todo"
  });

  const submit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.dueDate) {
      return setError("All fields are required");
      
    }

    try {
      const res = await fetch(`${Base_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error("Failed to add task");

      navigate("/dashboard");

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="form-wrapper">
      
      <form className="form-card" onSubmit={submit}>
        
        <h2>Add Task</h2>

        {error && <p className="error">{error}</p>}

        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <input
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          type="date"
          value={form.dueDate}
          onChange={(e) =>
            setForm({ ...form, dueDate: e.target.value })
          }
        />

        <select
          value={form.priority}
          onChange={(e) =>
            setForm({ ...form, priority: e.target.value })
          }
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <select
          value={form.status}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value })
          }
        >
          <option>Todo</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        <button>Add Task</button>
      </form>
    </div>
  );
}