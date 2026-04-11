import React, { useCallback, useMemo, useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import { TrendingUp, Clock, Circle } from 'lucide-react';

const Layout = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Backend API base URL (Render)
  const API_URL = "https://smart-task-management-system.onrender.com";

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No auth token found');

      // ✅ Use deployed API endpoint
      const { data } = await axios.get(`${API_URL}/api/tasks/gp`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const arr = Array.isArray(data)
        ? data
        : Array.isArray(data?.tasks)
        ? data.tasks
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setTasks(arr);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message ?? err.message ?? 'Could not load tasks');
      if (err.response?.status === 401) onLogout();
    } finally {
      setLoading(false);
    }
  }, [onLogout, API_URL]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const stats = useMemo(() => {
    const completedTasks = tasks.filter(
      (t) =>
        t.completed === true ||
        t.completed === 1 ||
        (typeof t.completed === 'string' && t.completed.toLowerCase() === 'yes')
    ).length;
    const totalCount = tasks.length;
    const pendingCount = totalCount - completedTasks;
    const completionPercentage = totalCount
      ? Math.round((completedTasks / totalCount) * 100)
      : 0;

    return {
      totalCount,
      completedTasks,
      pendingCount,
      completionPercentage,
    };
  }, [tasks]);

  const StatCard = ({ title, value, icon }) => (
    <div className="p-3 sm:p-4 rounded-xl bg-gray-800 text-white shadow-md hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gray-600 text-black group-hover:bg-gray-500">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xl sm:text-2xl font-bold">{value}</p>
          <p className="text-sm opacity-90">{title}</p>
        </div>
      </div>
    </div>
  );

  if (loading)
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700" />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
        <div className="bg-red-100 text-red-700 p-4 rounded-xl border border-red-200 max-w-md">
          <p className="font-medium mb-2">Error loading tasks</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchTasks}
            className="mt-4 py-2 px-4 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-500 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-200">
      <Navbar user={user} onLogout={onLogout} />
      <Sidebar user={user} tasks={tasks} />

      <div className="ml-0 xl:ml-64 md:ml-16 pt-16 p-4 transition-all duration-300">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left: Main content */}
          <div className="xl:col-span-2 space-y-4">
            <Outlet context={{ tasks, refreshTasks: fetchTasks }} />
          </div>

          {/* Right: Stats + Recent Activity */}
          <div className="xl:col-span-1 space-y-6">
            {/* Stats */}
            <div className="bg-gray-300 p-5 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold text-black flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-black" />
                Task Statistics
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  title="Total Tasks"
                  value={stats.totalCount}
                  icon={<Circle className="w-5 h-5 text-black" />}
                />
                <StatCard
                  title="Completed"
                  value={stats.completedTasks}
                  icon={<Circle className="w-5 h-5 text-black" />}
                />
                <StatCard
                  title="Pending"
                  value={stats.pendingCount}
                  icon={<Circle className="w-5 h-5 text-black" />}
                />
                <StatCard
                  title="Completion Rate"
                  value={`${stats.completionPercentage}%`}
                  icon={<Circle className="w-5 h-5 text-black" />}
                />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-300 text-black rounded-xl p-5 shadow-md">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-black" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {tasks.slice(0, 3).map((task) => (
                  <div
                    key={task._id || task.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-200"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{task.title}</p>
                      <p className="text-xs opacity-80">
                        {task.createdAt
                          ? new Date(task.createdAt).toLocaleDateString()
                          : 'No date'}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full shrink-0 ml-2 ${
                        task.completed
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {task.completed ? 'Done' : 'Pending'}
                    </span>
                  </div>
                ))}

                {tasks.length === 0 && (
                  <div className="text-center py-6">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-sm opacity-90">No recent activity</p>
                    <p className="text-xs opacity-70">Tasks will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
