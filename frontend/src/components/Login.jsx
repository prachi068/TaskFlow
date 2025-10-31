import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import { BUTTONCLASSES, INPUTWRAPPER } from "../assets/dummy";
import { useNavigate, useLocation } from "react-router-dom";
import { LogIn, Eye, EyeOff, Lock, Mail, Bell, CheckCircle2 } from "lucide-react";
import axios from "axios";

const INITIAL_FORM = { email: "", password: "" };

const Login = ({ onSubmit, onSwitchMode }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // ✅ Popup state

  const navigate = useNavigate();
  const location = useLocation();
  const url = "http://localhost:4000";

  // ✅ Show reminder popup when visiting login
  useEffect(() => {
    toast.info("🔔 Don’t forget to complete your pending tasks!", {
      position: "top-right",
      autoClose: 5000,
      theme: "dark",
      icon: <Bell className="text-yellow-400" />,
    });
  }, []);

  // ✅ Clear form when navigating to /login
  useEffect(() => {
    if (location.pathname === "/login") {
      setFormData(INITIAL_FORM);
      setShowPassword(false);
      setRememberMe(false);
    }
  }, [location.pathname]);

  // ✅ Restore session if token exists
  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    const userId =
      localStorage.getItem("userId") || sessionStorage.getItem("userId");

    if (token) {
      (async () => {
        try {
          const { data } = await axios.get(`${url}/api/user/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (data.success) {
            onSubmit?.({ token, userId, ...data.user });

            if (location.pathname !== "/") {
              toast.success("✅ Session restored. Redirecting...");
              navigate("/");
            }
          } else {
            localStorage.clear();
            sessionStorage.clear();
          }
        } catch {
          localStorage.clear();
          sessionStorage.clear();
        }
      })();
    }
  }, [navigate, onSubmit, location.pathname]);

  // ✅ Handle Login with popup
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(`${url}/api/user/login`, formData);

      if (!data.token) {
        toast.error("❌ Invalid Credentials");
        throw new Error(data.message || "Login failed");
      }

      // Save token depending on Remember Me
      if (rememberMe) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id);
      } else {
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("userId", data.user.id);
      }

      setFormData(INITIAL_FORM); 
      onSubmit?.({ token: data.token, userId: data.user.id, ...data.user });

      // ✅ Show popup box
      setShowPopup(true);

      // Close popup and redirect after 2 seconds
      setTimeout(() => {
        setShowPopup(false);
        navigate("/");
      }, 2000);
    } catch (err) {
      toast.error("❌ Invalid Credentials");
      console.error("Login failed:", err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchMode = () => {
    toast.dismiss();
    onSwitchMode?.();
  };

  const fields = [
    { name: "email", type: "email", placeholder: "Email", icon: Mail },
    {
      name: "password",
      type: showPassword ? "text" : "password",
      placeholder: "Password",
      icon: Lock,
      isPassword: true,
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div className="max-w-lg w-full shadow-lg border border-purple-200 rounded-xl p-10 bg-[#050518] font-[Times_New_Roman] font-medium">
        {/* ✅ Toast Notification Container */}
        <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

        <div className="mb-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-4">
            <LogIn className="w-9 h-9 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="text-gray-300 text-base mt-1">
            Sign in to continue to Taskflow
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {fields.map(({ name, type, placeholder, icon: Icon, isPassword }) => (
            <div key={name} className={`${INPUTWRAPPER} bg-transparent`}>
              <Icon className="text-purple-400 w-5 h-5 mr-2" />
              <input
                type={type}
                placeholder={placeholder}
                value={formData[name]}
                onChange={(e) =>
                  setFormData({ ...formData, [name]: e.target.value })
                }
                className="w-full focus:outline-none text-lg bg-transparent text-white placeholder:text-lg placeholder:text-gray-300"
                required
              />
              {isPassword && (
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="ml-2 text-gray-400 hover:text-purple-400 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
          ))}

          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="h-4 w-4 text-purple-500 focus:ring-purple-400 border-gray-300 rounded"
            />
            <label
              htmlFor="rememberMe"
              className="ml-2 block text-sm text-gray-200"
            >
              Remember Me
            </label>
          </div>

          <button type="submit" className={BUTTONCLASSES} disabled={loading}>
            {loading ? "Logging in..." : (
              <>
                <LogIn className="w-4 h-4" /> Login
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-300 mt-6">
          Don't have an account?{" "}
          <button
            type="button"
            className="text-purple-400 hover:text-purple-500 hover:underline font-medium transition-colors"
            onClick={handleSwitchMode}
          >
            SignUp
          </button>
        </p>
      </div>

      {/* ✅ Success Popup Modal */}
      {showPopup && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center w-[300px]">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800">✅ Credentials are valid</h3>
            <p className="text-gray-600 mt-1">Redirecting to dashboard...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
