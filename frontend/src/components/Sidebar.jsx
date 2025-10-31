import React, { useState, useEffect } from "react";
import {
  PRODUCTIVITY_CARD,
  SIDEBAR_CLASSES,
  LINK_CLASSES,
  menuItems,
} from "../assets/dummy";
import { Menu, Sparkles, X } from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ user, tasks }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter((t) => t.completed).length || 0;
  const productivity =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const username = user?.name || "User";
  const initial = username.charAt(0).toUpperCase();

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileOpen]);

  // Render Menu Items
  const renderMenuItem = (isMobile = false) => {
    return (
      <ul className="space-y-2">
        {menuItems.map(({ text, path, icon: Icon }) => (
          <li key={text}>
            <NavLink
              to={path}
              className={({ isActive }) =>
                [
                  LINK_CLASSES.base,
                  isActive ? "bg-[#001F3F] text-gray-300" : "text-gray-700",
                  isMobile ? "justify-start" : "lg:justify-start",
                ].join(" ")
              }
              onClick={() => setMobileOpen(false)}
            >
              <Icon className="w-5 h-5" />
              <span
                className={`${
                  isMobile ? "block" : "hidden lg:block"
                } ml-2 text-base font-[Times_New_Roman]`}
              >
                {text}
              </span>
            </NavLink>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`${SIDEBAR_CLASSES.desktop} bg-blue-400`}>
        {/* Top user section */}
        <div className="p-5 border-b border-purple-100 lg:block hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#001F3F] 
              flex items-center justify-center text-gray-300 font-bold shadow-md">
              {initial}
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#001F3F] font-[Times_New_Roman]">
                Hey, {username}
              </h2>
              <p className="text-sm text-gray-600 font-medium flex items-center gap-1 font-[Times_New_Roman]">
                <Sparkles className="w-3 h-3 text-yellow-400" /> Let’s crush some tasks!
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6 overflow-y-auto flex-1">
          {/* Productivity card */}
          <div className="bg-[#001F3F] rounded-lg p-4 shadow-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-gray-300 font-[Times_New_Roman] font-medium">
                PRODUCTIVITY
              </h3>
              <span className="text-gray-900 bg-yellow-500 px-2 py-1 rounded-md font-[Times_New_Roman]">
                {productivity}%
              </span>
            </div>
            <div className="w-full bg-gray-500 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full"
                style={{ width: `${productivity}%` }}
              />
            </div>
          </div>

          {renderMenuItem()}
        </div>
      </div>

      {/* Mobile Button */}
      {!mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          className={SIDEBAR_CLASSES.mobileButton}
        >
          <Menu className="w-5 h-5 text-[#001F3F]" />
        </button>
      )}

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40">
          <div
            className={SIDEBAR_CLASSES.mobileDrawerBackdrop}
            onClick={() => setMobileOpen(false)}
          />
          <div
            className={`${SIDEBAR_CLASSES.mobileDrawer} bg-blue-400`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#001F3F] 
                  flex items-center justify-center text-gray-300 font-bold shadow-md">
                  {initial}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-[#001F3F] font-[Times_New_Roman]">
                    Hey, {username}
                  </h2>
                  <p className="text-sm text-gray-600 font-medium flex items-center gap-1 font-[Times_New_Roman]">
                    <Sparkles className="w-3 h-3 text-yellow-400" /> Let’s crush some tasks!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-[#001F3F] hover:text-yellow-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {renderMenuItem(true)}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
