import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    axios.get(`${ import.meta.env.VITE_BACKEND_URL}/user/profile`, { withCredentials: true })
      .then(() => {
        setAuthenticated(true);
        setLoading(false);
      })
      .catch(() => {
        setAuthenticated(false);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center text-white mt-20">Loading...</div>;

  if (!authenticated) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
