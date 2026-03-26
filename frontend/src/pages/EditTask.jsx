import "../styles/form.css";
import { useState, useEffect } from "react";
import { useNavigate, useParams , useLocation } from "react-router-dom";

export default function EditTask() {
    const Base_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const location = useLocation();
  const taskData = location.state;
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "High",
    status: "Todo"
  });
  useEffect(() => {
  if (taskData) {
    setForm({
      title: taskData.title || "",
      description: taskData.description || "",
      dueDate: taskData.dueDate || "",
      priority: taskData.priority || "High",
      status: taskData.status || "Todo"
    });
  }
}, [taskData]);

  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.description || !form.dueDate) {
      return setError("All fields are required");
    }

    try {
      setLoading(true);

      const res = await fetch(`${Base_URL}/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        throw new Error("Failed to update task");
      }

      navigate("/dashboard");

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrapper">
      <form className="form-card" onSubmit={submit}>
        <h2>Edit Task</h2>
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
          value={form.dueDate?.split("T")[0]}
          onChange={(e) =>
            setForm({ ...form, dueDate: e.target.value })
          }
        />

        {/* Priority */}
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

        {/* Status */}
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

        <button disabled={loading}>
          {loading ? "Updating..." : "Update Task"}
        </button>
      </form>
    </div>
  );
}