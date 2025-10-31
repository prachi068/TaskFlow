import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, Settings, Zap } from "lucide-react";

const Navbar = ({ user = {}, onLogout }) => {
  const menuref = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuref.current && !menuref.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMenuToggle = () => setMenuOpen((prev) => !prev);

  const handleLogoutClick = () => {
    setMenuOpen(false);
    onLogout();
  };

  return (
    <header className="sticky top-0 z-50 bg-blue-950 shadow-md border-b border-blue-900 font-sans">
      <div className="flex items-center justify-between px-4 py-3 md:px-6 max-w-7xl mx-auto">
        {/* LOGO */}
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-blue-950 shadow-lg group-hover:shadow-blue-700/50 group-hover:scale-105 transition-all duration-300 border border-blue-800">
            <Zap className="w-6 h-6 text-yellow-400" />
          </div>
          <span className="text-2xl font-extrabold text-white tracking-wide">
            TaskFlow
          </span>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <button
            className="p-2 text-yellow-400 hover:text-yellow-300 transition-colors duration-300 hover:bg-blue-900 rounded-full"
            onClick={() => navigate("/profile")}
          >
            <Settings className="w-5 h-5 text-yellow-400" />
          </button>

          {/* User Dropdown */}
          <div ref={menuref} className="relative">
            <button
              onClick={handleMenuToggle}
              className="flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer hover:bg-blue-900 transition-colors duration-300 border border-blue-800"
            >
              <div className="relative">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Avatar"
                    className="w-9 h-9 rounded-full shadow-sm"
                  />
                ) : (
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-950 text-white font-bold shadow-md border border-blue-800">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-blue-950 animate-pulse" />
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-bold text-white">{user?.name}</p>
                <p className="text-xs font-medium text-gray-300">
                  {user?.email}
                </p>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-yellow-400 transition-transform duration-300 ${
                  menuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {menuOpen && (
              <ul className="absolute top-14 right-0 w-56 bg-blue-950 rounded-2xl shadow-xl border border-blue-900 z-50 overflow-hidden animate-fadeIn">
                <li className="p-2">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/profile");
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-blue-900 text-sm text-white font-semibold transition-colors flex items-center gap-2"
                    role="menuitem"
                  >
                    <Settings className="w-4 h-4 text-yellow-400" />
                    Profile Setting
                  </button>
                </li>

                <li className="p-2">
                  <button
                    onClick={handleLogoutClick}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-red-800 text-red-400 font-semibold"
                  >
                    <LogOut className="w-4 h-4 text-yellow-400" />
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
