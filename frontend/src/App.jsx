import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Create from "./pages/Create";
import ProtectedRoute from "./pages/ProtectedRoute";
import Navbar from "./pages/Navbar";

import Profile from "./pages/Profile";

const App = () => {
  const location = useLocation();
  const hideNavbarPaths = ["/login", "/create"];

  // Check if the current path is in the hideNavbarPaths array
  const shouldShowNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <div className="bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<Create />} />
      </Routes>
    </div>
  );
};

export default App;