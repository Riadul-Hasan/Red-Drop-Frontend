// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// function ResetPassword() {
//   const { state } = useLocation();
//   const navigate = useNavigate();

//   const email = state?.email;
//   const otp = state?.otp;

//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   if (!email || !otp) {
//     return <p>Invalid access</p>;
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const res = await fetch("http://localhost:8000/api/reset-password/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email,
//           otp,
//           new_password: newPassword,
//           confirm_password: confirmPassword,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.error || "Password reset failed");
//       }

//       alert("Password reset successful!");
//       navigate("/login");
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ maxWidth: 400, margin: "100px auto" }}>
//       <h2>Reset Password</h2>

//       {error && <p style={{ color: "red" }}>{error}</p>}

//       <form onSubmit={handleSubmit}>
//         <input
//           type="password"
//           placeholder="New Password"
//           value={newPassword}
//           onChange={(e) => setNewPassword(e.target.value)}
//           required
//           style={{ width: "100%", marginBottom: 10 }}
//         />

//         <input
//           type="password"
//           placeholder="Confirm New Password"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           required
//           style={{ width: "100%", marginBottom: 10 }}
//         />

//         <button type="submit" disabled={loading} style={{ width: "100%" }}>
//           {loading ? "Updating..." : "Reset Password"}
//         </button>
//       </form>
//     </div>
//   );
// }

// export default ResetPassword;



import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Lock, 
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowRight,
  Key
} from "lucide-react";

function ResetPassword() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const email = state?.email;
  const otp = state?.otp;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  if (!email || !otp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Access</h2>
          <p className="text-gray-600 mb-4">Please complete the verification process first.</p>
          <button
            onClick={() => navigate("/forgot-password")}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Go to Forgot Password
          </button>
        </div>
      </div>
    );
  }

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  const handlePasswordChange = (password) => {
    setNewPassword(password);
    setPasswordStrength(checkPasswordStrength(password));
  };

  const getStrengthColor = (strength) => {
    if (strength === 0) return "bg-gray-200";
    if (strength <= 2) return "bg-red-500";
    if (strength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = (strength) => {
    if (strength === 0) return "Enter a password";
    if (strength <= 2) return "Weak";
    if (strength <= 3) return "Good";
    return "Strong";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (passwordStrength < 3) {
      setError("Please choose a stronger password");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/reset-password/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          new_password: newPassword,
          confirm_password: confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Password reset failed");
      }

      // Show success animation before navigation
      setTimeout(() => {
        alert("Password reset successful!");
        navigate("/login");
      }, 500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-block p-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl shadow-lg mb-4"
          >
            <div className="relative">
              <Lock className="w-12 h-12 text-white" />
              <Key className="w-6 h-6 text-white absolute -top-2 -right-2 bg-yellow-500 rounded-full p-1" />
            </div>
          </motion.div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Set New Password
          </h1>
          <p className="text-gray-600">
            Create a strong, secure password for your account
          </p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
        >
          {/* Card Header */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-white" />
              <h2 className="text-xl font-bold text-white">Password Reset</h2>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 md:p-8">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <Lock className="w-4 h-4 text-gray-500 mr-2" />
                    New Password
                  </div>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    required
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                    placeholder="Create new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                
                {/* Password Strength Meter */}
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Password strength:</span>
                    <span className={`font-medium ${
                      passwordStrength === 0 ? "text-gray-500" :
                      passwordStrength <= 2 ? "text-red-600" :
                      passwordStrength <= 3 ? "text-yellow-600" :
                      "text-green-600"
                    }`}>
                      {getStrengthText(passwordStrength)}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: `${passwordStrength * 20}%` }}
                      className={`h-full ${getStrengthColor(passwordStrength)} transition-all duration-300`}
                    />
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-gray-600 font-medium">Requirements:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center">
                      <CheckCircle className={`w-4 h-4 mr-2 ${newPassword.length >= 8 ? "text-green-500" : "text-gray-300"}`} />
                      <span className={`text-xs ${newPassword.length >= 8 ? "text-gray-700" : "text-gray-400"}`}>
                        8+ characters
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className={`w-4 h-4 mr-2 ${/[A-Z]/.test(newPassword) ? "text-green-500" : "text-gray-300"}`} />
                      <span className={`text-xs ${/[A-Z]/.test(newPassword) ? "text-gray-700" : "text-gray-400"}`}>
                        Uppercase letter
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className={`w-4 h-4 mr-2 ${/[a-z]/.test(newPassword) ? "text-green-500" : "text-gray-300"}`} />
                      <span className={`text-xs ${/[a-z]/.test(newPassword) ? "text-gray-700" : "text-gray-400"}`}>
                        Lowercase letter
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className={`w-4 h-4 mr-2 ${/[0-9]/.test(newPassword) ? "text-green-500" : "text-gray-300"}`} />
                      <span className={`text-xs ${/[0-9]/.test(newPassword) ? "text-gray-700" : "text-gray-400"}`}>
                        Number
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 text-gray-500 mr-2" />
                    Confirm Password
                  </div>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Shield className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition duration-200"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                
                {/* Password Match Indicator */}
                {newPassword && confirmPassword && (
                  <div className="mt-2">
                    <div className="flex items-center">
                      <CheckCircle className={`w-4 h-4 mr-2 ${newPassword === confirmPassword ? "text-green-500" : "text-red-500"}`} />
                      <span className={`text-sm ${newPassword === confirmPassword ? "text-green-600" : "text-red-600"}`}>
                        {newPassword === confirmPassword ? "Passwords match" : "Passwords do not match"}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword || passwordStrength < 3}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating Password...
                  </>
                ) : (
                  <>
                    Reset Password
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </motion.button>

              {/* Security Note */}
              <div className="text-center mt-4">
                <p className="text-sm text-gray-500">
                  <Shield className="w-4 h-4 inline mr-1" />
                  Your new password will be securely encrypted
                </p>
              </div>
            </form>

            {/* Tips */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">Tips for a strong password:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center">
                  <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                  Use a mix of letters, numbers, and symbols
                </li>
                <li className="flex items-center">
                  <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                  Avoid common words and personal information
                </li>
                <li className="flex items-center">
                  <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                  Consider using a passphrase you can remember
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6"
        >
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900 font-medium text-sm flex items-center justify-center group"
          >
            <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to OTP verification
          </button>
        </motion.div>

        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      </motion.div>

      {/* Add CSS for blob animation */}
      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
}

export default ResetPassword;