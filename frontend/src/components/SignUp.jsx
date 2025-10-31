import React, { useState } from 'react';
import axios from 'axios';
import { UserPlus } from 'lucide-react';
import { BUTTONCLASSES, MESSAGE_ERROR, MESSAGE_SUCCESS, Inputwrapper, FIELDS } from "../assets/dummy";

const API_URL = "http://localhost:4000";
const INITIAL_FORM = { name: "", email: "", password: "" };

const SignUp = ({ onSwitchMode }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const { data } = await axios.post(`${API_URL}/api/user/register`, formData);
      console.log("Signup successful", data);
      setMessage({ text: "Registration successful! You can now log in.", type: "success" });
      setFormData(INITIAL_FORM);
    } catch (err) {
      console.error("SignUp Error:", err);
      setMessage({
        text: err.response?.data?.message || "An error occurred. Please try again later.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-[#001F3F] shadow-lg border border-purple-900 rounded-xl p-8">
      <div className="mb-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-fuchsia-600 to-purple-800 rounded-full mx-auto flex items-center justify-center mb-4">
          <UserPlus className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">Create Account</h2>
        <p className="text-gray-300 text-sm mt-1">Join TaskFlow to manage your tasks</p>
      </div>

      {message.text && (
        <div className={message.type === "success" ? MESSAGE_SUCCESS : MESSAGE_ERROR}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {FIELDS.map(({ name, type, placeholder, icon: Icon }) => (
          <div key={name} className={Inputwrapper}>
            <Icon className="text-purple-300 w-5 h-5 mr-2" />
            <input
              type={type}
              placeholder={placeholder}
              value={formData[name]}
              onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
              className="w-full focus:outline-none text-sm text-white placeholder-gray-400 bg-[#001F3F]"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className={`${BUTTONCLASSES} bg-purple-700 hover:bg-purple-800 text-white`}
          disabled={loading}
        >
          {loading ? "Signing Up..." : (
            <>
              <UserPlus className="w-4 h-4 mr-1" /> Sign Up
            </>
          )}
        </button>
      </form>

      <p className="text-center text-sm text-gray-300 mt-6">
        Already have an account?{" "}
        <button
          onClick={onSwitchMode}
          className="text-purple-300 hover:text-purple-400 hover:underline font-medium transition-colors"
        >
          Login
        </button>
      </p>
    </div>
  );
};

export default SignUp;
