const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true
    },

    description: {
      type: String,
      required: [true, "Description is required"]
    },

    status: {
      type: String,
      enum: ["Todo", "In Progress", "Completed"],
      default: "Todo"
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true
    },

    dueDate: {
      type: Date
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

// Indexes

// For filtering
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, priority: 1 });

// // For sorting
// taskSchema.index({ user: 1, dueDate: 1 });

// For search (fast text search)
taskSchema.index({ title: "text" });

module.exports = mongoose.model("Task", taskSchema);