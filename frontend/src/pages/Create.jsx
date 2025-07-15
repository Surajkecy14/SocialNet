import React, { useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

const Create = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    gender: "",
    age: "",
    password: "",
  });
  const navigate = useNavigate(); // ✅ FIXED

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/create`,
        formData,
        { withCredentials: true }
      );

      // ✅ show message from server
      alert(res.data.message); // "User created successfully ✅"
      navigate('/login'); // go to login page

    } catch (err) {
      if (err.response && err.response.data.message) {
        alert(err.response.data.message); // Show server message like "User already exists"
      } else {
        alert("Something went wrong ❌");
      }
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
      <div className="relative w-full max-w-md mx-auto mt-8 p-6 bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-3xl transition-transform transform hover:scale-[1.01] duration-300">
        <h2 className="text-3xl font-bold text-center text-white mb-6 drop-shadow-md">
          Create Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full px-4 py-2 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-400"
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-4 py-2 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-400"
            onChange={handleChange}
            required
          />
          <select
            name="gender"
            className="w-full px-4 py-2 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-400"
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option className="bg-black" value="male">Male</option>
            <option className="bg-black" value="female">Female</option>
            <option className="bg-black" value="other">Other</option>
          </select>
          <input
            type="number"
            name="age"
            placeholder="Age"
            className="w-full px-4 py-2 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-400"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-xl shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-400"
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-2 rounded-xl hover:brightness-110 transition duration-300 shadow-md"
          >
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-gray-300">Already have an account?</span>{" "}
          <Link to="/login" className="text-pink-400 hover:underline hover:text-pink-300">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Create;
