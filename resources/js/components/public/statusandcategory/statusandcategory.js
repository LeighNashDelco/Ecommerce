import React, { useState } from "react";
import { FaUser, FaHome } from 'react-icons/fa';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex w-[800px] shadow-lg rounded-lg overflow-hidden bg-black">
        {/* Left Side - Login Form */}
        <div className="w-1/2 p-8">
          <h2 className="text-white text-3xl font-semibold mb-6">Welcome Back!</h2>
          <p className="text-gray-400 mb-4">Login with email</p>

          <div className="mb-4">
            <label className="text-gray-300 block mb-1">Email</label>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border border-gray-600 rounded bg-black text-white focus:outline-none"
            />
          </div>

          <div className="mb-4 relative">
            <label className="text-gray-300 block mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-2 border border-gray-600 rounded bg-black text-white focus:outline-none"
            />
            <button
              type="button"
              className="absolute top-9 right-3 text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="flex items-center justify-between text-gray-400 text-sm mb-6">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <a href="#" className="hover:underline">Forgot password?</a>
          </div>

          <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition">
            Login
          </button>
        </div>

        {/* Right Side - Image */}
        <div className="w-1/2 bg-cover bg-center flex items-center justify-center" 
             style={{ backgroundImage: "url('/your-image-path.jpg')" }}>
          <h1 className="text-white text-4xl font-bold">VERO</h1>
        </div>
      </div>
    </div>
  );
};

export default Login;
