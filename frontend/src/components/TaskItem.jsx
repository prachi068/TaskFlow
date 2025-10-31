import React, { useState, useEffect } from "react";
import {
  getPriorityBadgeColor,
  MENU_OPTIONS,
} from "../assets/dummy";
import {
  CheckCircle2,
  MoreVertical,
  Clock,
  Calendar,
} from "lucide-react";
import axios from "axios";
import { format } from "date-fns";
import TaskModal from "./TaskModal";

const API_BASE = "http://localhost:4000/api/tasks/";

const TaskItem = ({ task, onRefresh, onLogout, showCompleteCheckbox = true }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // ✅ keep completion status synced
  useEffect(() => {
    setIsCompleted(
      [true, 1, "yes"].includes(
        typeof task.completed === "string"
          ? task.completed.toLowerCase()
          : task.completed
      )
    );
  }, [task.completed]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No auth token found");
      return {};
    }
    return { Authorization: `Bearer ${token}` };
  };

  const handleComplete = async () => {
    const newStatus = isCompleted ? "No" : "Yes";
    try {
      await axios.put(
        `${API_BASE}${task._id}/gp`,
        { completed: newStatus },
        { headers: getAuthHeaders() }
      );
      setIsCompleted(!isCompleted);
      onRefresh?.();
    } catch (err) {
      if (err.response?.status === 401) onLogout?.();
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE}${task._id}/gp`, {
        headers: getAuthHeaders(),
      });
      onRefresh?.();
    } catch (err) {
      if (err.response?.status === 401) onLogout?.();
    }
  };

  const handleSave = async (updatedTask) => {
    try {
      const { title, description, priority, dueDate, completed } = updatedTask;
      const payload = { title, description, priority, dueDate, completed };

      await axios.put(`${API_BASE}${task._id}/gp`, payload, {
        headers: getAuthHeaders(),
      });
      setShowEditModal(false);
      onRefresh?.();
    } catch (err) {
      if (err.response?.status === 401) onLogout?.();
    }
  };

  const handleAction = (action) => {
    setShowMenu(false);
    if (action === "edit") setShowEditModal(true);
    if (action === "delete") handleDelete();
  };

  return (
    <>
      <div
        className={`relative flex flex-col p-4 rounded-2xl border 
          bg-gradient-to-br from-[#0a192f] to-[#112d4e] 
          shadow-lg shadow-blue-800/30 hover:shadow-purple-700/40 
          hover:scale-[1.02] transition-all duration-300`}
      >
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex gap-3 items-start">
            {showCompleteCheckbox && (
              <button
                onClick={handleComplete}
                className="mt-1 transition-transform hover:scale-110"
                title={isCompleted ? "Mark as Pending" : "Mark as Completed"}
              >
                <CheckCircle2
                  size={20}
                  className={`${
                    isCompleted
                      ? "text-green-500 drop-shadow-md"
                      : "text-blue-400 hover:text-purple-400"
                  }`}
                />
              </button>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                <h3
                  className={`font-semibold text-lg break-words ${
                    isCompleted
                      ? "text-gray-400 line-through"
                      : "text-white"
                  }`}
                >
                  {task.title || "Untitled Task"}
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${getPriorityBadgeColor(
                    task.priority
                  )}`}
                >
                  {task.priority || "Normal"}
                </span>
              </div>
              {task.description && (
                <p className="text-sm text-gray-300 break-words">
                  {task.description}
                </p>
              )}
            </div>
          </div>

          {/* Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-blue-900/30 rounded-lg transition"
            >
              <MoreVertical className="w-5 h-5 text-blue-400" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-40 rounded-xl bg-[#112d4e] border border-blue-700/40 shadow-lg shadow-black/40 z-20 overflow-hidden">
                {MENU_OPTIONS.map((opt) => (
                  <button
                    key={opt.action}
                    onClick={() => handleAction(opt.action)}
                    className="w-full px-4 py-2 text-left text-sm flex items-center gap-2 text-gray-200 hover:bg-purple-600/40 transition-colors"
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dates */}
        <div className="flex flex-col items-end gap-1 mt-4 text-xs text-gray-300">
          {task.createdAt && (
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              {format(new Date(task.createdAt), "MMM dd, yyyy")}
            </div>
          )}
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              {format(new Date(task.dueDate), "MMM dd, yyyy")}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <TaskModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        taskToEdit={task}
        onSave={handleSave}
      />
    </>
  );
};

export default TaskItem;
