const Task = require("../models/Task");

// CREATE
exports.createTask = async (req, res) => {
  const task = await Task.create({
    ...req.body,
    user: req.user.id
  });

  res.status(201).json(task);
};

// GET ALL + FILTER
exports.getTasks = async (req, res) => {
  const {
    status,
    priority,
    search,
    page = 1,
    limit = 6,
    sortBy = "createdAt",
    order = "desc"
  } = req.query;

  let query = { user: req.user.id };

  if (status) query.status = status;
  if (priority) query.priority = priority;

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  const skip = (page - 1) * limit;

  // Priority custom sorting
  let sortOption = {};

  if (sortBy === "priority") {
    // Custom order: High > Medium > Low
    sortOption = {
      priority: order === "asc" ? 1 : -1
    };
  } else {
    sortOption = {
      [sortBy]: order === "asc" ? 1 : -1
    };
  }

  const total = await Task.countDocuments(query);

  const tasks = await Task.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(Number(limit));

  res.json({
    tasks,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit)
  });
};

// UPDATE
exports.updateTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(task);
};

// DELETE
exports.deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
};

// ANALYTICS
exports.getAnalytics = async (req, res) => {
  const tasks = await Task.find({ user: req.user.id });

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "Completed).length;
  const pending = total - completed;

  res.json({
    total,
    completed,
    pending,
    completionRate: total ? (completed / total) * 100 : 0
  });
};
