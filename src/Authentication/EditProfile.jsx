import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, 
  User, 
  Mail, 
  Droplet, 
  Phone, 
  MapPin, 
  Home,
  Navigation,
  Loader2,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

/* ---------------- CSRF HELPER ---------------- */
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(
          cookie.substring(name.length + 1)
        );
        break;
      }
    }
  }
  return cookieValue;
}

function EditProfile() {
  const navigate = useNavigate();
  const csrfToken = getCookie("csrftoken");

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    blood_group: "",
    phone: "",
    detailed_address: "",
    latitude: "",
    longitude: "",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  /* ---------------- FETCH PROFILE ---------------- */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/profile/", {
          method: "GET",
          credentials: "include",
          headers: {
            "X-CSRFToken": csrfToken,
          },
        });

        if (res.status === 401) {
          throw new Error("You must be logged in");
        }

        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await res.json();

        setFormData({
          username: data.username || "",
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          blood_group: data.blood_group || "",
          phone: data.phone || "",
          detailed_address: data.detailed_address || "",
          latitude: data.latitude || "",
          longitude: data.longitude || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setTimeout(() => setLoading(false), 500);
      }
    };

    fetchProfile();
  }, [csrfToken]);

  /* ---------------- HANDLE INPUT ---------------- */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);

    // remove read-only fields
    const {
      email,
      blood_group,
      latitude,
      longitude,
      ...editableFields
    } = formData;

    // SAFE empty-field filter
    const cleanedData = Object.fromEntries(
      Object.entries(editableFields).filter(
        ([_, value]) =>
          value !== null &&
          value !== undefined &&
          String(value).trim() !== ""
      )
    );

    if (Object.keys(cleanedData).length === 0) {
      setError("Nothing to update");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:8000/api/profile/edit/",
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
          },
          body: JSON.stringify(cleanedData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Backend error:", data);
        throw new Error(data.error || "Profile update failed");
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------- ANIMATION VARIANTS ---------------- */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.02,
      boxShadow: "0 10px 30px -10px rgba(59, 130, 246, 0.5)"
    },
    tap: { scale: 0.98 },
    loading: { scale: 0.95 }
  };

  /* ---------------- LOADING SKELETON ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8"
        >
          <div className="text-center space-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"
            />
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-48 mx-auto" />
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32 mx-auto" />
          </div>
          
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 + Math.sin(i * 0.5) * 0.5 }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
              className="h-14 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl"
            />
          ))}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg mb-4"
          >
            <User className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold text-gray-800 mb-2"
          >
            Edit Profile
          </motion.h1>
          <p className="text-gray-600">Update your personal information</p>
        </div>

        {/* Form Container */}
        <motion.form
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Success Message */}
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -20, height: 0 }}
                className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4"
              >
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  <div>
                    <p className="font-medium text-green-800">Profile Updated!</p>
                    <p className="text-sm text-green-600">Redirecting to dashboard...</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4"
              >
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email Field - Read Only */}
            <motion.div variants={itemVariants}>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 mr-2 text-blue-500" />
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <input
                  type="email"
                  value={formData.email}
                  readOnly
                  className="relative w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 transition-all duration-300 text-gray-600"
                />
              </div>
            </motion.div>

            {/* Blood Group Field - Read Only */}
            <motion.div variants={itemVariants}>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Droplet className="w-4 h-4 mr-2 text-red-500" />
                Blood Group
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-red-100 to-pink-100 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <input
                  type="text"
                  value={formData.blood_group}
                  readOnly
                  className="relative w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-400 transition-all duration-300 text-gray-600"
                />
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username Field */}
            <motion.div variants={itemVariants}>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 mr-2 text-purple-500" />
                Username
              </label>
              <div className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl blur-sm transition-opacity duration-300 ${focusedField === 'username' ? 'opacity-100' : 'opacity-0'}`} />
                <input
                  name="username"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  className="relative w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 transition-all duration-300 shadow-sm hover:shadow-md"
                />
              </div>
            </motion.div>

            {/* Phone Field */}
            <motion.div variants={itemVariants}>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 mr-2 text-green-500" />
                Phone Number
              </label>
              <div className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl blur-sm transition-opacity duration-300 ${focusedField === 'phone' ? 'opacity-100' : 'opacity-0'}`} />
                <input
                  name="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('phone')}
                  onBlur={() => setFocusedField(null)}
                  className="relative w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-all duration-300 shadow-sm hover:shadow-md"
                />
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name Field */}
            <motion.div variants={itemVariants}>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                First Name
              </label>
              <div className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl blur-sm transition-opacity duration-300 ${focusedField === 'first_name' ? 'opacity-100' : 'opacity-0'}`} />
                <input
                  name="first_name"
                  placeholder="Enter first name"
                  value={formData.first_name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('first_name')}
                  onBlur={() => setFocusedField(null)}
                  className="relative w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-md"
                />
              </div>
            </motion.div>

            {/* Last Name Field */}
            <motion.div variants={itemVariants}>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Last Name
              </label>
              <div className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-xl blur-sm transition-opacity duration-300 ${focusedField === 'last_name' ? 'opacity-100' : 'opacity-0'}`} />
                <input
                  name="last_name"
                  placeholder="Enter last name"
                  value={formData.last_name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('last_name')}
                  onBlur={() => setFocusedField(null)}
                  className="relative w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all duration-300 shadow-sm hover:shadow-md"
                />
              </div>
            </motion.div>
          </div>

          {/* Address Field */}
          <motion.div variants={itemVariants}>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <Home className="w-4 h-4 mr-2 text-orange-500" />
              Detailed Address
            </label>
            <div className="relative group">
              <div className={`absolute inset-0 bg-gradient-to-r from-orange-100 to-yellow-100 rounded-xl blur-sm transition-opacity duration-300 ${focusedField === 'detailed_address' ? 'opacity-100' : 'opacity-0'}`} />
              <textarea
                name="detailed_address"
                placeholder="Enter your detailed address"
                value={formData.detailed_address}
                onChange={handleChange}
                onFocus={() => setFocusedField('detailed_address')}
                onBlur={() => setFocusedField(null)}
                rows={3}
                className="relative w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 transition-all duration-300 shadow-sm hover:shadow-md resize-none"
              />
            </div>
          </motion.div>

          {/* Location Display */}
          <motion.div variants={itemVariants}>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 mr-2 text-rose-500" />
              Location Coordinates
            </label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-100 to-pink-100 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center space-x-4 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl">
                <Navigation className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-gray-600">
                    Latitude: <span className="font-mono text-gray-800">{formData.latitude || "Not set"}</span>
                  </p>
                  <p className="text-gray-600">
                    Longitude: <span className="font-mono text-gray-800">{formData.longitude || "Not set"}</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants} className="pt-4">
            <motion.button
              type="submit"
              disabled={submitting}
              variants={buttonVariants}
              initial="initial"
              whileHover={submitting ? "loading" : "hover"}
              whileTap={submitting ? "loading" : "tap"}
              animate={submitting ? "loading" : "initial"}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              {/* Button Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Button Content */}
              <div className="relative flex items-center justify-center space-x-3">
                {submitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Loader2 className="w-5 h-5" />
                    </motion.div>
                    <span>Updating Profile...</span>
                  </>
                ) : success ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Profile Updated!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Update Profile</span>
                  </>
                )}
              </div>

              {/* Button Shine Effect */}
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
            </motion.button>

            {/* Cancel Button */}
            <motion.button
              type="button"
              onClick={() => navigate("/dashboard")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-4 py-3 px-6 bg-white text-gray-600 font-medium rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300"
            >
              Cancel
            </motion.button>
          </motion.div>
        </motion.form>

        {/* Footer Note */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-gray-500 text-sm mt-8"
        >
          Fields marked with icons are read-only for security purposes
        </motion.p>
      </motion.div>

      {/* Custom CSS for Shine Effect */}
      <style jsx>{`
        @keyframes shine {
          100% {
            left: 125%;
          }
        }
        .group:hover .animate-shine {
          animation: shine 0.75s;
        }
      `}</style>
    </div>
  );
}

export default EditProfile;