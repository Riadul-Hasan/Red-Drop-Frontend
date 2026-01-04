import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  Shield,
  CheckCircle,
  AlertCircle,
  ArrowRight
} from "lucide-react";

/* Get CSRF token from cookies */
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function ChangePassword() {
  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const csrftoken = getCookie("csrftoken");

      const res = await fetch("http://localhost:8000/api/change-password/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Password change failed");
      }

      setSuccess("Password updated successfully");
      setForm({
        old_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#D4EEFA] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8"
      >
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-rose-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
          <p className="text-gray-600 text-sm">
            Keep your account secure
          </p>
        </div>

        {/* Success */}
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center space-x-2"
          >
            <CheckCircle className="w-4 h-4 text-green-600" />
            <p className="text-green-700 text-sm font-medium">{success}</p>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-start space-x-2"
          >
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
            <p className="text-red-700 text-sm font-medium">{error}</p>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Old Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="old_password"
                value={form.old_password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
              />
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="new_password"
                value={form.new_password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="confirm_password"
                value={form.confirm_password}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100"
              />
            </div>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            disabled={loading}
            className={`w-full py-3.5 rounded-xl font-medium text-white transition-all ${
              loading
                ? "bg-rose-400 cursor-not-allowed"
                : "bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
            }`}
          >
            {loading ? (
              <div className="flex justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Updating...</span>
              </div>
            ) : (
              <div className="flex justify-center space-x-2">
                <span>Update Password</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default ChangePassword;
