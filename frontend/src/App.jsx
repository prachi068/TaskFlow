import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate, Outlet, Navigate } from "react-router-dom";

import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import PendingPage from "./pages/PendingPage";
import CompletePage from "./pages/CompletePage";
import Profile from "./components/Profile";

const App = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = localStorage.getItem("currentUser");
    return stored ? JSON.parse(stored) : null;
  });

  // keep localStorage in sync with state
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  // login / signup submit handler
  const handleAuthSubmit = (data) => {
    const user = {
      email: data.email,
      name: data.name || "User",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        data.name || "User"
      )}&background=random`,
    };

    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    setCurrentUser(user);
    navigate("/", { replace: true });
  };

  // logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser"); // ✅ ensure cleared
    setCurrentUser(null);
    navigate("/login", { replace: true });
  };

  // wrapper for protected routes
  const ProtectedLayout = () => (
    <Layout user={currentUser} onLogout={handleLogout}>
      <Outlet />
    </Layout>
  );

  return (
    // 🌈 Gradient background instead of plain green
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-black-100">
      <Routes>
        {/* Login */}
        <Route
          path="/login"
          element={
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
              <Login
                onSubmit={handleAuthSubmit}
                onSwitchMode={() => navigate("/signup")}
              />
            </div>
          }
        />

        {/* Signup */}
        <Route
          path="/signup"
          element={
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
              <SignUp
                onSubmit={handleAuthSubmit}
                onSwitchMode={() => navigate("/login")}
              />
            </div>
          }
        />

        {/* Protected Routes */}
        <Route
          element={
            currentUser ? (
              <ProtectedLayout />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/pending" element={<PendingPage />} />
          <Route path="/complete" element={<CompletePage />} />
          <Route
            path="/profile"
            element={
              <Profile
                user={currentUser}
                setCurrentUser={setCurrentUser}
                onLogout={handleLogout}
              />
            }
          />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
