import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import {
  BACK_BUTTON,
  FULL_BUTTON,
  INPUT_WRAPPER,
  personalFields,
  securityFields,
  DANGER_BTN,
} from "../assets/dummy";
import {
  ChevronLeft,
  Save,
  UserCircle,
  Shield,
  LogOut as Logout,
  Settings,
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ✅ Use backend API URL, not frontend
const API_URL = "https://smart-task-management-system.onrender.com";

const Profile = ({ setCurrentUser, onLogout }) => {
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get(`${API_URL}/api/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        if (data.success)
          setProfile({ name: data.user.name, email: data.user.email });
        else toast.error(data.message);
      })
      .catch(() => toast.error("UNABLE TO LOAD PROFILE."));
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `${API_URL}/api/user/profile`,
        { name: profile.name, email: profile.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setCurrentUser((prev) => ({
          ...prev,
          name: profile.name,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            profile.name
          )}&background=random`,
        }));
        toast.success("Profile Updated");
      } else toast.error(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Profile update failed");
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm)
      return toast.error("Passwords do not match");
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `${API_URL}/api/user/password`,
        { currentPassword: passwords.current, newPassword: passwords.new },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success("Password Changed");
        setPasswords({ current: "", new: "", confirm: "" });
      } else toast.error(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Password change failed");
    }
  };

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    onLogout?.(); // call parent if provided
    toast.success("Logged out successfully");
    setTimeout(() => navigate("/login"), 1000); // redirect after toast
  };

  return (
    <div className="min-h-screen bg-blue">
      <ToastContainer position="top-center" autoClose={5173} />
      <div className="max-w-4xl mx-auto p-6">
        <button onClick={() => navigate(-1)} className={BACK_BUTTON}>
          <ChevronLeft className="w-5 h-5 mr-1 text-yellow-400" />
          Back to Dashboard
        </button>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center text-white text-2xl font-bold shadow-md">
            {profile.name ? profile.name[0].toUpperCase() : "U"}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              Account Settings
              <button
                onClick={() => navigate("/profile")}
                className="p-2 rounded-full hover:bg-gray-200 transition"
                title="Open Settings"
              >
                <Settings className="w-5 h-5 text-yellow-400" />
              </button>
            </h1>
            <p className="text-gray-700 text-sm">
              Manage your profile and security settings
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Personal Info */}
          <section className="bg-[#0a0a3f] p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <UserCircle className="text-yellow-400 w-5 h-5" />
              <h2 className="text-xl font-semibold text-white">
                Personal Information
              </h2>
            </div>

            <form onSubmit={saveProfile} className="space-y-4">
              {personalFields.map(({ name, type, placeholder, icon: Icon }) => (
                <div key={name} className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-yellow-400" />
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={profile[name] || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, [name]: e.target.value })
                    }
                    className="border p-2 rounded w-full bg-white"
                  />
                </div>
              ))}
              <button className={FULL_BUTTON}>
                <Save className="w-4 h-4 mr-2 text-yellow-400" />
                Save Changes
              </button>
            </form>
          </section>

          {/* Security */}
          <section className="bg-[#0a0a3f] p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="text-yellow-400 w-5 h-5" />
              <h2 className="text-xl font-semibold text-white">Security</h2>
            </div>

            <form onSubmit={changePassword} className="space-y-4">
              {securityFields.map(({ name, placeholder, icon: Icon }) => {
                const IconComp = Icon || Lock;
                return (
                  <div key={name} className={INPUT_WRAPPER}>
                    <IconComp className="text-yellow-400 w-5 h-5 mr-2" />
                    <input
                      type="password"
                      placeholder={placeholder}
                      value={passwords[name]}
                      onChange={(e) =>
                        setPasswords({ ...passwords, [name]: e.target.value })
                      }
                      className="w-full focus:outline-none text-sm bg-white p-2 rounded"
                      required
                    />
                  </div>
                );
              })}
              <button className={FULL_BUTTON}>
                <Shield className="w-4 h-4 mr-2 text-yellow-400" />
                Change Password
              </button>

              {/* Danger Zone */}
              <div className="mt-8 pt-6 border-t border-purple-100">
                <h3 className="text-red-500 font-semibold mb-4 flex items-center gap-2">
                  <Logout className="w-4 h-4 text-yellow-400" />
                  Danger Zone
                </h3>
                <button className={DANGER_BTN} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
