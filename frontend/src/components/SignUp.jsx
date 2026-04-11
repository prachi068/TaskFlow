import React, { useState } from "react";
import axios from "axios";
import { UserPlus, CheckCircle2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import {
  BUTTONCLASSES,
  MESSAGE_ERROR,
  MESSAGE_SUCCESS,
  Inputwrapper,
  FIELDS,
} from "../assets/dummy";

const API_URL = import.meta.env.VITE_API_URL;
const INITIAL_FORM = { name: "", email: "", password: "" };

const SignUp = ({ onSubmit, onSwitchMode }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const { data } = await axios.post(`${API_URL}/api/user/register`, formData);

      console.log("✅ Signup successful:", data);
      toast.success("🎉 Registration successful!");

      // ✅ Store token and user info locally
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      const user = {
        email: data.user?.email || formData.email,
        name: data.user?.name || formData.name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          data.user?.name || formData.name
        )}&background=random`,
      };

      localStorage.setItem("currentUser", JSON.stringify(user));

      // ✅ Trigger onSubmit callback to update app state
      if (onSubmit) {
        onSubmit({ ...user, token: data.token });
      }

      setFormData(INITIAL_FORM);
      setShowPopup(true);

      // ✅ Wait a moment and then redirect to dashboard
      setTimeout(() => {
        setShowPopup(false);
        navigate("/"); // ✅ Go to dashboard ("/")
      }, 2000);

    } catch (err) {
      console.error("❌ SignUp Error:", err);
      toast.error(
        err.response?.data?.message || "Registration failed. Try again."
      );
      setMessage({
        text:
          err.response?.data?.message ||
          "An error occurred. Please try again later.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-400 to-gray-600 font-[Times_New_Roman] font-medium">
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />

      <div className="max-w-md w-full bg-[#0B1736] shadow-lg rounded-2xl p-10">
        <div className="mb-6 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-4">
            <UserPlus className="w-9 h-9 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="text-gray-300 text-base mt-1">
            Join TaskFlow to manage your tasks
          </p>
        </div>

        {message.text && (
          <div
            className={
              message.type === "success" ? MESSAGE_SUCCESS : MESSAGE_ERROR
            }
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {FIELDS.map(({ name, type, placeholder, icon: Icon }) => (
            <div key={name} className={`${Inputwrapper} bg-transparent`}>
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
            </div>
          ))}

          <button
            type="submit"
            className={`${BUTTONCLASSES} bg-gradient-to-r from-fuchsia-500 to-purple-700 hover:from-fuchsia-600 hover:to-purple-800 text-white`}
            disabled={loading}
          >
            {loading ? (
              "Signing Up..."
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-1" /> Sign Up
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-300 mt-6">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-purple-400 hover:text-purple-500 hover:underline font-medium transition-colors"
          >
            Login
          </button>
        </p>
      </div>

      {/* ✅ Success Popup */}
      {showPopup && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center w-[300px]">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800">
              🎉 Registration Successful
            </h3>
            <p className="text-gray-600 mt-1">Redirecting to dashboard...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
