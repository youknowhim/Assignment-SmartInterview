import "../styles/dashboard.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const Base_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(
  localStorage.getItem("theme") === "dark"
);

  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [analytics, setAnalytics] = useState({
  total: 0,
  completed: 0,
  pending: 0,
  completionRate: 0
});

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load Tasks
  const loadTasks = async () => {
  try {
    setLoading(true);
    setError("");

    const params = new URLSearchParams();

    if (debouncedSearch) params.set("search", debouncedSearch);
    if (status) params.append("status", status);
    if (priority) params.append("priority", priority);

    params.append("page", page);
    params.append("limit", 6);
    params.append("sortBy", sortBy);
    params.append("order", order);

    const res = await fetch(`${Base_URL}/api/tasks?${params}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Failed to fetch tasks");

  const data = await res.json();

let tasksData = data.tasks || [];

// Custom priority sort
if (sortBy === "priority") {
  const orderMap = { High: 3, Medium: 2, Low: 1 };

  tasksData = tasksData.sort((a, b) =>
    order === "asc"
      ? orderMap[a.priority] - orderMap[b.priority]
      : orderMap[b.priority] - orderMap[a.priority]
  );
}

setTasks(tasksData);
    setTotalPages(data.totalPages || 1);

  } catch (err) {
    setError(err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};
//   dark mode toggle


  // Debounced
useEffect(() => {
  const delay = setTimeout(() => {
    setDebouncedSearch(search);
  }, 2000); // 

  return () => clearTimeout(delay);
}, [search]);
  
  // Reset page when filters change
useEffect(() => {
  loadTasks();
}, [debouncedSearch, page, status, priority, sortBy, order]);
  useEffect(() => {
  loadAnalytics();
}, []);

  

  // Delete Task
const deleteTask = async (id) => {
  await fetch(`${Base_URL}/api/tasks/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });

  await loadTasks();
  await loadAnalytics();
};
const toggleStatus = async (task) => {
  const newStatus =
    task.status === "Completed" ? "Todo" : "Completed";

  // 1. Update DB
  await fetch(`${Base_URL}/api/tasks/${task._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status: newStatus })
  });

  // 2. Fetch updated tasks (ensures DB write finished)
  await loadTasks();

  // 3. THEN fetch analytics (guaranteed fresh data)
  await loadAnalytics();
};
  const loadAnalytics = async () => {
  try {
    const res = await fetch(`${Base_URL}/api/tasks/analytics`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Failed to fetch analytics");

    const data = await res.json();

    // force fresh object reference (important for re-render)
    setAnalytics({
      total: data.total || 0,
      completed: data.completed || 0,
      pending: data.pending || 0,
      completionRate: data.completionRate || 0
    });

  } catch (err) {
    console.error("Analytics error:", err);
  }
};
  // Logout
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className={`dashboard ${darkMode ? "dark" : ""}`}>
        <div className="analytics">
  <div className="card-analytics">
    <h4>Total Tasks</h4>
    <p>{analytics.total}</p>
  </div>

  <div className="card-analytics">
    <h4>Completed</h4>
    <p>{analytics.completed}</p>
  </div>

  <div className="card-analytics">
    <h4>Pending</h4>
    <p>{analytics.pending}</p>
  </div>

  <div className="card-analytics">
    <h4>Completion %</h4>
    <p>{analytics.completionRate.toFixed(0)}%</p>
  </div>
</div>

   

      {/* Header */}
      <header className="dashboard-header">
        <h2>Task Dashboard</h2>

        <div>
          <button onClick={() => navigate("/add-task")}>
            + Add Task
          </button>
          <button onClick={logout}>Logout</button>
          <button class = "theme" onClick={() => {
           setDarkMode(!darkMode);
           localStorage.setItem("theme", !darkMode ? "dark" : "light");
          }}>
          {darkMode ? "☀ Light" : "🌙 Dark"}
  </button>
        </div>
      </header>

      {/* Filters */}
      <div className="filters">

  {/* Existing filters */}

  <select onChange={(e) => setSortBy(e.target.value)}>
    <option value="createdAt">Sort by Created At</option>
    <option value="dueDate">Sort by Due Date</option>
    <option value="priority">Sort by Priority</option>
  </select>

  <select onChange={(e) => setOrder(e.target.value)}>
    <option value="desc">Descending</option>
    <option value="asc">Ascending</option>
  </select>

</div>
      <div className="filters">
        <input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          <option>Todo</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="">All</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>

      {/* Loading */}
      {loading && <p className="info">Loading tasks...</p>}

      {/* Error */}
      {error && <p className="error">{error}</p>}

      {/* Task List */}
      <div className="grid">
        {!loading && tasks.length === 0 && (
          <p className="info">No tasks found</p>
        )}

        {tasks.map((t) => (
          <div className="card" key={t._id}>
            <h3>{t.title}</h3>
            <p><b>Description:</b> {t.description}</p>
            <label>
  <input
    type="checkbox"
    checked={t.status === "Completed"}
    onChange={() => toggleStatus(t)}
  />
  &nbsp;Mark as Completed
</label>

            <p><b>Status:</b> {t.status}</p>
            <p><b>Priority:</b> {t.priority}</p>

            <p>
              <b>Due:</b>{" "}
              {t.dueDate
                ? new Date(t.dueDate).toLocaleDateString()
                : "N/A"}
            </p>

            <div className="actions">
              <button onClick={() => navigate(`/edit-task/${t._id}`, { state: t })}>
                Edit
              </button>

              <button onClick={() => deleteTask(t._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          ⬅ Prev
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next ➡
        </button>
      </div>

    </div>
  );
}
