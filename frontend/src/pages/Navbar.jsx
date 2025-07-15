import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useUserStore from "../store/userStore";
import {
  FiLogOut,
  FiUser,
  FiHome,
  FiMessageSquare,
  FiCompass,
  FiMenu,
  FiX,
} from "react-icons/fi";

const Navbar = () => {
  const { user, logout } = useUserStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (path) => pathname === path;

  const navClass = (path) =>
    `flex items-center space-x-1 transition-all duration-200 ${
      isActive(path)
        ? "text-white font-medium"
        : "text-white/70 hover:text-white"
    }`;

  return (
    <nav className="w-full px-6 py-3 bg-white/5 backdrop-blur-lg shadow-sm border-b border-white/10 fixed top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <span className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 font-bold">
            SocialNet
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {user ? (
            <>
              <Link to="/" className={navClass("/")}>
                <FiHome className="text-lg" />
                <span>Home</span>
              </Link>
              <Link to="/profile" className={navClass("/profile")}>
                <FiUser className="text-lg" />
                <span>Profile</span>
              </Link>
              <div className="flex items-center space-x-4 ml-4">
                <span className="flex items-center space-x-1 text-white/90">
                  <FiUser className="text-lg" />
                  <span className="font-medium">{user.username}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white hover:shadow-lg transition-all duration-200"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive("/login")
                    ? "bg-white/10 text-white font-medium"
                    : "text-white/80 hover:bg-white/5 hover:text-white"
                }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive("/register")
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 text-white/90 hover:shadow-lg"
                }`}
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white text-2xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="md:hidden bg-[#1a1a2e] border-t border-white/10 px-4 py-4">
          <div className="flex flex-col space-y-4">
            {user ? (
              <>
                <Link
                  to="/"
                  className={navClass("/")}
                  onClick={() => setMenuOpen(false)}
                >
                  <FiHome className="text-lg" />
                  <span>Home</span>
                </Link>
    
             
                <Link
                  to="/profile"
                  className={navClass("/profile")}
                  onClick={() => setMenuOpen(false)}
                >
                  <FiUser className="text-lg" />
                  <span>Profile</span>
                </Link>
                <div className="flex items-center space-x-2 mt-2">
                  <FiUser className="text-lg text-white/90" />
                  <span className="font-medium text-white/90">
                    {user.username}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-gradient-to-r from-red-500 to-pink-600 text-white mt-2"
                >
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive("/login")
                      ? "bg-white/10 text-white font-medium"
                      : "text-white/80 hover:bg-white/5 hover:text-white"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive("/register")
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium"
                      : "bg-gradient-to-r from-purple-600 to-pink-600 text-white/90 hover:shadow-lg"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
