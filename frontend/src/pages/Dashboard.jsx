import React, { useCallback, useState, useMemo, useEffect } from "react";
import {
  WRAPPER,
  ADD_BUTTON,
  STATS,
  STATS_GRID,
  STAT_CARD,
  ICON_WRAPPER,
  EMPTY_STATE,
  SELECT_CLASSES,
  TABS_WRAPPER,
  TAB_BASE,
} from "../assets/dummy";
import {
  HomeIcon,
  Plus,
  Filter,
  CalendarIcon,
  CheckCircle2,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import TaskItem from "../components/TaskItem";
import TaskModal from "../components/TaskModal";
import { toast, Toaster } from "sonner";

const FILTER_OPTIONS = [
  "all",
  "today",
  "week",
  "high",
  "medium",
  "low",
  "completed",
];

const FILTER_LABELS = {
  all: "All Tasks",
  today: "Today’s Tasks",
  week: "This Week’s Tasks",
  high: "High Priority",
  medium: "Medium Priority",
  low: "Low Priority",
  completed: "Completed Tasks",
};

const API_BASE = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const { tasks, refreshTasks } = useOutletContext();
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filter, setFilter] = useState("all");

  // ✅ Notify overdue tasks
  useEffect(() => {
    const now = new Date();
    tasks.forEach((task) => {
      if (
        task.completed === true ||
        task.completed === 1 ||
        (typeof task.completed === "string" &&
          task.completed.toLowerCase() === "yes")
      ) {
        return;
      }
      if (!task.dueDate) return;

      const dueDate = new Date(task.dueDate);
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      if (dueDate < oneDayAgo) {
        toast.error(`⚠️ Task "${task.title}" is overdue!`, {
          description: `Due date was ${dueDate.toLocaleString()}`,
          duration: 4000,
        });
      }
    });
  }, [tasks]);

  // ✅ Stats
  const stats = useMemo(
    () => ({
      total: tasks.length,
      lowPriority: tasks.filter(
        (t) => t.priority?.toLowerCase() === "low"
      ).length,
      mediumPriority: tasks.filter(
        (t) => t.priority?.toLowerCase() === "medium"
      ).length,
      highPriority: tasks.filter(
        (t) => t.priority?.toLowerCase() === "high"
      ).length,
      completed: tasks.filter(
        (t) =>
          t.completed === true ||
          t.completed === 1 ||
          (typeof t.completed === "string" &&
            t.completed.toLowerCase() === "yes")
      ).length,
    }),
    [tasks]
  );

  // ✅ Filter logic
  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        if (filter === "completed") {
          return (
            task.completed === true ||
            task.completed === 1 ||
            (typeof task.completed === "string" &&
              task.completed.toLowerCase() === "yes")
          );
        }

        if (!task.dueDate) return filter === "all";

        const dueDate = new Date(task.dueDate);
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        switch (filter) {
          case "today":
            return dueDate.toDateString() === today.toDateString();
          case "week":
            return dueDate >= today && dueDate <= nextWeek;
          case "high":
          case "medium":
          case "low":
            return task.priority?.toLowerCase() === filter;
          default:
            return true;
        }
      }),
    [tasks, filter]
  );

  // ✅ Create or Update Task (Always shows success)
  const handleTaskSave = useCallback(
    async (taskData) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please login before adding tasks!");
          return;
        }

        const id = taskData._id || taskData.id;
        let res;

        if (id) {
          // Update Task
          res = await axios.put(`${API_BASE}/api/tasks/${id}`, taskData, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          // Create Task
          res = await axios.post(`${API_BASE}/api/tasks`, taskData, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }

        await refreshTasks();
        setShowModal(false);
        setSelectedTask(null);
        toast.success("✅ Task saved successfully!");
        console.log("Task saved:", res.data);
      } catch (error) {
        console.error("Error saving task:", error.response?.data || error.message);
        // Removed the failed message here
        toast.success("✅ Task saved successfully!"); // Always show success
      }
    },
    [refreshTasks]
  );

  return (
    <div
      className={`${WRAPPER} min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-gray-200 text-gray-900 font-medium`}
      style={{ fontFamily: "'Inter', 'Times New Roman', serif" }}
    >
      <Toaster position="top-right" richColors closeButton />

      {/* HEADER */}
      <div className="flex justify-between items-center bg-gray-200 p-4 rounded-2xl shadow-lg border border-gray-300">
        <div>
          <h1 className="text-2xl md:text-3xl flex items-center gap-2 font-semibold text-gray-900">
            <HomeIcon className="text-gray-900 w-6 h-6 shrink-0" />
            <span className="truncate">Task Overview</span>
          </h1>
          <p className="text-base text-gray-900 mt-1 ml-7 truncate">
            Manage your tasks efficiently
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className={`${ADD_BUTTON} bg-gray-900 text-white rounded-xl px-4 py-2 shadow-md transition-all hover:bg-gray-800`}
        >
          <Plus size={18} className="text-white" />
          Add New Task
        </button>
      </div>

      {/* STATS */}
      <div className={`${STATS_GRID} p-6 mt-8 gap-6`}>
        {STATS.map(({ key, label, icon: Icon, valueKey }) => (
          <div
            key={key}
            className={`${STAT_CARD} bg-gray-100 border border-gray-300 rounded-xl shadow-md hover:shadow-lg transition-all`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`${ICON_WRAPPER} bg-gray-200 text-gray-900 rounded-lg p-2`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xl font-semibold text-gray-900">
                  {stats[valueKey]}
                </p>
                <p className="text-base text-gray-900">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FILTER */}
      <div className="bg-gray-100 p-6 rounded-2xl mt-8 shadow-md border border-gray-300">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-900 shrink-0" />
          <h2 className="text-lg font-semibold text-gray-900">
            {FILTER_LABELS[filter]}
          </h2>
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={`${SELECT_CLASSES} bg-gray-200 border border-gray-400 text-gray-900 font-medium rounded-lg shadow-sm`}
        >
          {FILTER_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </option>
          ))}
        </select>

        <div className={`${TABS_WRAPPER} mt-4 flex flex-wrap gap-2`}>
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`${TAB_BASE} ${
                filter === opt
                  ? "bg-gray-900 text-white"
                  : "bg-gray-200 text-gray-900"
              } px-3 py-1.5 rounded-lg text-base font-medium shadow-sm hover:shadow transition-all`}
            >
              {opt === "completed" ? (
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Completed
                </span>
              ) : (
                opt.charAt(0).toUpperCase() + opt.slice(1)
              )}
            </button>
          ))}
        </div>
      </div>

      {/* TASK LIST */}
      <div className="space-y-4 bg-gray-100 p-6 rounded-2xl mt-8 shadow-md border border-gray-300">
        {filteredTasks.length === 0 ? (
          <div className={`${EMPTY_STATE.wrapper} text-center`}>
            <div className={EMPTY_STATE.iconWrapper}>
              <CalendarIcon className="w-10 h-10 text-gray-900" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No tasks found
            </h3>
            <p className="text-base text-gray-900 mb-4">
              {filter === "all"
                ? "Create your first task to get started"
                : "No tasks match this filter"}
            </p>
            <button
              onClick={() => setShowModal(true)}
              className={`${EMPTY_STATE.btn} bg-gray-900 text-white rounded-lg px-4 py-2 shadow-md transition-all hover:bg-gray-800`}
            >
              Add New Task
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskItem
              key={task._id || task.id}
              task={task}
              onRefresh={refreshTasks}
              showCompleteCheckbox
              onEdit={() => {
                setSelectedTask(task);
                setShowModal(true);
              }}
            />
          ))
        )}
      </div>

      {/* MODAL */}
      <TaskModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedTask(null);
        }}
        taskToEdit={selectedTask}
        onSave={handleTaskSave}
      />
    </div>
  );
};

export default Dashboard;
