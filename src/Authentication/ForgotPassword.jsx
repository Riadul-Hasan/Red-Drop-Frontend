


// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import {
//     Mail,
//     Key,
//     ArrowRight,
//     Shield,
//     Heart
// } from "lucide-react";

// function ForgotPassword() {
//     const [email, setEmail] = useState("");
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(false);

//     const navigate = useNavigate();

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError("");
//         setLoading(true);

//         try {
//             const res = await fetch("http://localhost:8000/api/forgot-password/", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ email }),
//             });

//             const data = await res.json();

//             if (!res.ok) {
//                 throw new Error(data.error || "Failed to send OTP");
//             }

//             navigate("/verify-forgot-otp", { state: { email } });
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 flex items-center justify-center p-4">
//             <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//                 className="max-w-md w-full"
//             >
//                 {/* Header */}
//                 <div className="text-center mb-10">
//                     <motion.div
//                         initial={{ scale: 0 }}
//                         animate={{ scale: 1 }}
//                         transition={{ delay: 0.2, type: "spring" }}
//                         className="inline-block p-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl shadow-lg mb-4"
//                     >
//                         <div className="relative">
//                             <Heart className="w-12 h-12 text-white" />
//                             <Shield className="w-6 h-6 text-white absolute -top-2 -right-2 bg-blue-500 rounded-full p-1" />
//                         </div>
//                     </motion.div>

//                     <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                         Reset Your Password
//                     </h1>
//                     <p className="text-gray-600">
//                         Enter your email address and we'll send you an OTP to reset your password
//                     </p>
//                 </div>

//                 {/* Card */}
//                 <motion.div
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.3 }}
//                     className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
//                 >
//                     {/* Card Header */}
//                     <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
//                         <div className="flex items-center space-x-3">
//                             <Key className="w-6 h-6 text-white" />
//                             <h2 className="text-xl font-bold text-white">Password Recovery</h2>
//                         </div>
//                     </div>

//                     {/* Card Body */}
//                     <div className="p-6 md:p-8">
//                         {error && (
//                             <motion.div
//                                 initial={{ opacity: 0, height: 0 }}
//                                 animate={{ opacity: 1, height: "auto" }}
//                                 className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
//                             >
//                                 <div className="flex items-center">
//                                     <div className="flex-shrink-0">
//                                         <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
//                                             <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
//                                                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                                             </svg>
//                                         </div>
//                                     </div>
//                                     <div className="ml-3">
//                                         <p className="text-sm font-medium text-red-800">{error}</p>
//                                     </div>
//                                 </div>
//                             </motion.div>
//                         )}

//                         <form onSubmit={handleSubmit} className="space-y-6">
//                             {/* Email Input */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                                     <div className="flex items-center">
//                                         <Mail className="w-4 h-4 text-gray-500 mr-2" />
//                                         Email Address
//                                     </div>
//                                 </label>
//                                 <div className="relative">
//                                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                         <Mail className="h-5 w-5 text-gray-400" />
//                                     </div>
//                                     <input
//                                         type="email"
//                                         value={email}
//                                         onChange={(e) => setEmail(e.target.value)}
//                                         required
//                                         className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//                                         placeholder="you@example.com"
//                                     />
//                                 </div>
//                                 <p className="mt-2 text-sm text-gray-500">
//                                     Enter the email address associated with your account
//                                 </p>
//                             </div>

//                             {/* Submit Button */}
//                             <motion.button
//                                 whileHover={{ scale: 1.02 }}
//                                 whileTap={{ scale: 0.98 }}
//                                 type="submit"
//                                 disabled={loading}
//                                 className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center"
//                             >
//                                 {loading ? (
//                                     <>
//                                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                         </svg>
//                                         Sending OTP...
//                                     </>
//                                 ) : (
//                                     <>
//                                         Send OTP
//                                         <ArrowRight className="ml-2 w-5 h-5" />
//                                     </>
//                                 )}
//                             </motion.button>

//                             {/* Additional Help Text */}
//                             <div className="text-center mt-4">
//                                 <p className="text-sm text-gray-600">
//                                     We'll email you a 6-digit OTP code to verify your identity
//                                 </p>
//                             </div>
//                         </form>

//                         {/* Decorative Elements */}
//                         <div className="mt-8 pt-6 border-t border-gray-200">
//                             <div className="flex items-center justify-center space-x-4">
//                                 <div className="flex items-center">
//                                     <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                                     <span className="ml-2 text-xs text-gray-600">Secure</span>
//                                 </div>
//                                 <div className="flex items-center">
//                                     <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                                     <span className="ml-2 text-xs text-gray-600">Fast</span>
//                                 </div>
//                                 <div className="flex items-center">
//                                     <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
//                                     <span className="ml-2 text-xs text-gray-600">Reliable</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </motion.div>

//                 {/* Back to Login */}
//                 <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: 0.5 }}
//                     className="text-center mt-6"
//                 >
//                     <button
//                         onClick={() => navigate("/login")}
//                         className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center justify-center group"
//                     >
//                         <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                         </svg>
//                         Back to Login
//                     </button>
//                 </motion.div>

//                 {/* Floating Elements */}
//                 <div className="absolute top-10 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
//                 <div className="absolute bottom-10 right-10 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
//             </motion.div>

//             {/* Add CSS for blob animation */}
//             <style>{`
//         @keyframes blob {
//           0% {
//             transform: translate(0px, 0px) scale(1);
//           }
//           33% {
//             transform: translate(30px, -50px) scale(1.1);
//           }
//           66% {
//             transform: translate(-20px, 20px) scale(0.9);
//           }
//           100% {
//             transform: translate(0px, 0px) scale(1);
//           }
//         }
//         .animate-blob {
//           animation: blob 7s infinite;
//         }
//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }
//       `}</style>
//         </div>
//     );
// }

// export default ForgotPassword;



import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import {
    Mail,
    Key,
    ArrowRight,
    Shield,
    Heart,
    ArrowLeft,
    Loader2,
    Lock,
    Activity,
    AlertCircle
} from "lucide-react";

function ForgotPassword() {
    // --- EXACT ORIGINAL FUNCTIONALITY ---
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("http://localhost:8000/api/forgot-password/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to send OTP");
            }

            // Correctly passing email to the verification page
            navigate("/verify-forgot-otp", { state: { email } });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    // --- END ORIGINAL FUNCTIONALITY ---

    const bgRef = useRef(null);

    // GSAP Ambient Background
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(".serum-blob", {
                x: "random(-100, 100)",
                y: "random(-100, 100)",
                scale: "random(1.2, 1.6)",
                duration: 25,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: 2
            });
        }, bgRef);
        return () => ctx.revert();
    }, []);

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-black font-sans selection:bg-red-200 flex items-center justify-center p-4 relative overflow-hidden">
            
            {/* GSAP BACKGROUND BLOBS */}
            <div ref={bgRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
                <div className="serum-blob absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-red-100 rounded-full blur-[140px]" />
                <div className="serum-blob absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-100 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 max-w-md w-full"
            >
                {/* BRAND LOGO AREA */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="inline-block relative mb-4"
                    >
                        <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-200">
                            <Heart className="w-8 h-8 text-white fill-current animate-pulse" />
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-slate-950 rounded-lg flex items-center justify-center border-2 border-white">
                                <Shield className="w-3 h-3 text-white" />
                            </div>
                        </div>
                    </motion.div>
                    <h1 className="text-3xl font-black text-black uppercase tracking-tighter leading-none">
                        Credential <span className="text-red-600">Recovery</span>
                    </h1>
                </div>

                {/* MAIN CAPSULE */}
                <div className="bg-white/80 backdrop-blur-3xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.05)] border border-white overflow-hidden">
                    <div className="bg-slate-950 px-6 py-4 flex items-center gap-3">
                        <Key className="text-red-500 w-5 h-5" />
                        <h2 className="text-sm font-bold text-white uppercase tracking-widest">Artery Authentication</h2>
                    </div>

                    <div className="p-8">
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3"
                                >
                                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                                    <p className="text-xs font-bold text-red-800 uppercase tracking-tight">{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[10px] font-black text-black uppercase tracking-[0.2em] ml-1">
                                    <Mail size={12} className="text-red-600" /> Identity Email
                                </label>
                                <div className="relative group">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="block w-full px-5 py-4 bg-slate-50 border-2 border-slate-50 rounded-xl text-sm font-bold text-black focus:bg-white focus:border-red-600 outline-none transition-all placeholder:text-slate-300"
                                        placeholder="you@example.com"
                                    />
                                </div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight ml-1 leading-relaxed">
                                    Systems will transmit a verification pulse to this address
                                </p>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02, backgroundColor: "#000" }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full bg-red-600 text-white font-black text-xs uppercase tracking-[0.3em] py-4 rounded-xl shadow-xl shadow-red-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin w-5 h-5" />
                                        Transmitting...
                                    </>
                                ) : (
                                    <>
                                        Send OTP Pulse
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {/* STATUS SIGNALS */}
                        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Artery Stable</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Activity className="w-3 h-3 text-red-500" />
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Secure Link</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* BACK TO TERMINAL */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-8"
                >
                    <button
                        onClick={() => navigate("/login")}
                        className="text-slate-400 hover:text-black font-black text-xs uppercase tracking-widest flex items-center justify-center group transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                        Abort to Terminal
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default ForgotPassword;