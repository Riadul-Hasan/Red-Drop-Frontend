



// import React, { useState, useRef, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import {
//     Key,
//     ShieldCheck,
//     ArrowRight,
//     Clock,
//     Mail,
//     Lock
// } from "lucide-react";

// function VerifyForgotOTP() {
//     const { state } = useLocation();
//     const navigate = useNavigate();
//     const email = state?.email;

//     const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//     const [error, setError] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [timer, setTimer] = useState(180); // 3 minutes
//     const [canResend, setCanResend] = useState(false);

//     const inputRefs = useRef([]);

//     useEffect(() => {
//         const countdown = setInterval(() => {
//             setTimer((prev) => {
//                 if (prev <= 1) {
//                     clearInterval(countdown);
//                     setCanResend(true);
//                     return 0;
//                 }
//                 return prev - 1;
//             });
//         }, 1000);

//         return () => clearInterval(countdown);
//     }, []);

//     if (!email) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-pink-50">
//                 <div className="text-center">
//                     <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                         <ShieldCheck className="w-8 h-8 text-red-600" />
//                     </div>
//                     <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Access</h2>
//                     <p className="text-gray-600">Please go back and try again.</p>
//                 </div>
//             </div>
//         );
//     }

//     const handleChange = (index, value) => {
//         if (value.length <= 1 && /^\d*$/.test(value)) {
//             const newOtp = [...otp];
//             newOtp[index] = value;
//             setOtp(newOtp);

//             // Auto-focus next input
//             if (value && index < 5) {
//                 inputRefs.current[index + 1]?.focus();
//             }
//         }
//     };

//     const handleKeyDown = (index, e) => {
//         if (e.key === "Backspace" && !otp[index] && index > 0) {
//             inputRefs.current[index - 1]?.focus();
//         }
//     };

//     const handlePaste = (e) => {
//         e.preventDefault();
//         const pasteData = e.clipboardData.getData("text").slice(0, 6);
//         if (/^\d+$/.test(pasteData)) {
//             const newOtp = [...otp];
//             pasteData.split("").forEach((char, index) => {
//                 if (index < 6) newOtp[index] = char;
//             });
//             setOtp(newOtp);
//             inputRefs.current[Math.min(pasteData.length, 5)]?.focus();
//         }
//     };

//     const handleResendOTP = async () => {
//         setLoading(true);
//         try {
//             const res = await fetch("http://localhost:8000/api/forgot-password/", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ email }),
//             });

//             const data = await res.json();

//             if (!res.ok) {
//                 throw new Error(data.error || "Failed to resend OTP");
//             }

//             setTimer(180);
//             setCanResend(false);
//             alert("OTP has been resent to your email!");
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError("");
//         setLoading(true);

//         const otpString = otp.join("");

//         try {
//             const res = await fetch("http://localhost:8000/api/verify-forgot-otp/", {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ email, otp: otpString }),
//             });

//             const data = await res.json();

//             if (!res.ok) {
//                 throw new Error(data.error || "Invalid OTP");
//             }

//             navigate("/reset-password", { state: { email, otp: otpString } });
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const formatTime = (seconds) => {
//         const mins = Math.floor(seconds / 60);
//         const secs = seconds % 60;
//         return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
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
//                         className="inline-block p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-lg mb-4"
//                     >
//                         <div className="relative">
//                             <Key className="w-12 h-12 text-white" />
//                             <ShieldCheck className="w-6 h-6 text-white absolute -top-2 -right-2 bg-green-500 rounded-full p-1" />
//                         </div>
//                     </motion.div>

//                     <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                         Verify OTP
//                     </h1>
//                     <p className="text-gray-600 mb-4">
//                         Enter the 6-digit code sent to your email
//                     </p>

//                     <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full">
//                         <Mail className="w-4 h-4 text-blue-500 mr-2" />
//                         <span className="text-sm font-medium text-blue-700">{email}</span>
//                     </div>
//                 </div>

//                 {/* Card */}
//                 <motion.div
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.3 }}
//                     className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200"
//                 >
//                     {/* Card Header */}
//                     <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
//                         <div className="flex items-center justify-between">
//                             <div className="flex items-center space-x-3">
//                                 <ShieldCheck className="w-6 h-6 text-white" />
//                                 <h2 className="text-xl font-bold text-white">OTP Verification</h2>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                                 <Clock className="w-5 h-5 text-white" />
//                                 <span className="text-white font-mono font-bold">
//                                     {formatTime(timer)}
//                                 </span>
//                             </div>
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

//                         <form onSubmit={handleSubmit} className="space-y-8">
//                             {/* OTP Inputs */}
//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
//                                     Enter the 6-digit verification code
//                                 </label>

//                                 <div className="flex justify-center space-x-3" onPaste={handlePaste}>
//                                     {otp.map((digit, index) => (
//                                         <motion.div
//                                             key={index}
//                                             whileHover={{ scale: 1.05 }}
//                                             whileTap={{ scale: 0.95 }}
//                                         >
//                                             <input
//                                                 ref={(el) => (inputRefs.current[index] = el)}
//                                                 type="text"
//                                                 maxLength="1"
//                                                 value={digit}
//                                                 onChange={(e) => handleChange(index, e.target.value)}
//                                                 onKeyDown={(e) => handleKeyDown(index, e)}
//                                                 className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition duration-200"
//                                                 required
//                                             />
//                                         </motion.div>
//                                     ))}
//                                 </div>

//                                 <div className="text-center mt-4">
//                                     <button
//                                         type="button"
//                                         onClick={() => {
//                                             setOtp(["", "", "", "", "", ""]);
//                                             inputRefs.current[0]?.focus();
//                                         }}
//                                         className="text-sm text-blue-600 hover:text-blue-800 font-medium"
//                                     >
//                                         Clear All
//                                     </button>
//                                 </div>
//                             </div>

//                             {/* Submit Button */}
//                             <motion.button
//                                 whileHover={{ scale: 1.02 }}
//                                 whileTap={{ scale: 0.98 }}
//                                 type="submit"
//                                 disabled={loading || otp.some(digit => !digit)}
//                                 className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center"
//                             >
//                                 {loading ? (
//                                     <>
//                                         <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                         </svg>
//                                         Verifying...
//                                     </>
//                                 ) : (
//                                     <>
//                                         Verify & Continue
//                                         <ArrowRight className="ml-2 w-5 h-5" />
//                                     </>
//                                 )}
//                             </motion.button>

//                             {/* Resend OTP */}
//                             <div className="text-center pt-4 border-t border-gray-200">
//                                 <p className="text-sm text-gray-600 mb-3">
//                                     Didn't receive the code?
//                                 </p>
//                                 <button
//                                     type="button"
//                                     onClick={handleResendOTP}
//                                     disabled={!canResend || loading}
//                                     className={`font-medium text-sm ${canResend ? "text-blue-600 hover:text-blue-800" : "text-gray-400 cursor-not-allowed"}`}
//                                 >
//                                     {canResend ? "Resend OTP" : `Resend OTP in ${formatTime(timer)}`}
//                                 </button>
//                             </div>
//                         </form>

//                         {/* Security Info */}
//                         <div className="mt-6 pt-6 border-t border-gray-200">
//                             <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
//                                 <ShieldCheck className="w-4 h-4" />
//                                 <span>Your security is our priority</span>
//                             </div>
//                         </div>
//                     </div>
//                 </motion.div>

//                 {/* Back Link */}
//                 <motion.div
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: 0.5 }}
//                     className="text-center mt-6"
//                 >
//                     <button
//                         onClick={() => navigate("/forgot-password")}
//                         className="text-gray-600 hover:text-gray-900 font-medium text-sm flex items-center justify-center group"
//                     >
//                         <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                         </svg>
//                         Use different email
//                     </button>
//                 </motion.div>

//                 {/* Floating Elements */}
//                 <div className="absolute top-10 left-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
//                 <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
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

// export default VerifyForgotOTP;


import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import {
    Key,
    ShieldCheck,
    ArrowRight,
    Clock,
    Mail,
    Lock,
    ArrowLeft,
    RefreshCw,
    Loader2,
    Activity,
    AlertCircle
} from "lucide-react";

function VerifyForgotOTP() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const email = state?.email;

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(180);
    const [canResend, setCanResend] = useState(false);

    const inputRefs = useRef([]);
    const bgRef = useRef(null);

    // GSAP: Ambient Serum Background
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

    useEffect(() => {
        const countdown = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(countdown);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countdown);
    }, []);

    if (!email) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-slate-100">
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
                        <Lock className="text-red-600" size={32} />
                    </div>
                    <h2 className="text-xl font-black text-slate-950 uppercase tracking-tight mb-2">Access Denied</h2>
                    <p className="text-sm font-medium text-slate-500 mb-6">Unauthorized terminal access. Please initiate recovery first.</p>
                    <button
                        onClick={() => navigate("/forgot-password")}
                        className="w-full bg-slate-950 text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl hover:bg-red-600 transition-colors"
                    >
                        Return to Recovery
                    </button>
                </div>
            </div>
        );
    }

    const handleChange = (index, value) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            if (value && index < 5) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text").slice(0, 6);
        if (/^\d+$/.test(pasteData)) {
            const newOtp = [...otp];
            pasteData.split("").forEach((char, index) => {
                if (index < 6) newOtp[index] = char;
            });
            setOtp(newOtp);
            inputRefs.current[Math.min(pasteData.length, 5)]?.focus();
        }
    };

    const handleResendOTP = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8000/api/forgot-password/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to resend OTP");
            setTimer(180);
            setCanResend(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        const otpString = otp.join("");
        try {
            const res = await fetch("http://localhost:8000/api/verify-forgot-otp/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp: otpString }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Invalid OTP");
            navigate("/reset-password", { state: { email, otp: otpString } });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-black  selection:bg-red-200 flex items-center justify-center p-4 relative overflow-hidden">

            {/* GSAP BACKGROUND */}
            <div ref={bgRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
                <div className="serum-blob absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-red-100 rounded-full blur-[140px]" />
                <div className="serum-blob absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-100 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 max-w-md w-full"
            >
                {/* HEADER AREA */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className="inline-block relative mb-4"
                    >
                        <div className="w-20 h-20 bg-red-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-red-200 border-4 border-white">
                            <Key className="w-10 h-10 text-white fill-current" />
                        </div>
                    </motion.div>

                    <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tighter leading-none">
                        Verify <span className="text-red-600">Artery Pulse</span>
                    </h1>
                    <p className="text-sm font-bold text-slate-500 mt-4 uppercase tracking-widest leading-none mb-4">Transmission sent to</p>
                    <div className="inline-flex items-center px-4 py-2 bg-slate-950/5 rounded-lg border border-slate-200">
                        <Mail className="w-4 h-4 text-red-600 mr-2" />
                        <span className="text-sm font-black text-slate-900">{email}</span>
                    </div>
                </div>

                {/* MAIN OTP CAPSULE */}
                <div className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.08)] border border-white overflow-hidden">
                    <div className="bg-slate-950 px-8 py-5 border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="text-red-600 w-5 h-5" />
                            <h2 className="text-xs font-black text-white uppercase tracking-widest">Signal Authentication</h2>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                            <Clock className="w-4 h-4 text-red-500" />
                            <span className="text-white font-mono font-bold text-xs">{formatTime(timer)}</span>
                        </div>
                    </div>

                    <div className="p-8">
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-6 bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3"
                                >
                                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                                    <p className="text-xs font-black text-red-800 uppercase tracking-tight">{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 text-center">
                                    Input 6-Digit Security Frequency
                                </label>

                                <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => (inputRefs.current[index] = el)}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength="1"
                                            value={digit}
                                            onChange={(e) => handleChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-black text-slate-950 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-red-600 focus:bg-white focus:ring-4 focus:ring-red-600/5 outline-none transition-all duration-200"
                                            required
                                        />
                                    ))}
                                </div>

                                <div className="text-center mt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setOtp(["", "", "", "", "", ""]);
                                            inputRefs.current[0]?.focus();
                                        }}
                                        className="text-[10px] font-black text-red-600 uppercase tracking-widest hover:underline"
                                    >
                                        Reset Digits
                                    </button>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02, backgroundColor: "#000" }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading || otp.some(digit => !digit)}
                                className="w-full bg-red-600 text-white font-black text-xs uppercase tracking-[0.3em] py-4 rounded-2xl shadow-xl shadow-red-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin w-5 h-5" />
                                        Syncing Artery...
                                    </>
                                ) : (
                                    <>
                                        Authorize Sync
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </motion.button>

                            <div className="text-center pt-4 border-t border-slate-50">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                                    Signal not received?
                                </p>
                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    disabled={!canResend || loading}
                                    className={`text-[10px] font-black uppercase tracking-widest transition-colors ${canResend ? "text-red-600 hover:text-black" : "text-slate-300 cursor-not-allowed"}`}
                                >
                                    {canResend ? "Resend OTP Pulse" : `Retry in ${formatTime(timer)}`}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* FOOTER */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-8"
                >
                    <button
                        onClick={() => navigate("/forgot-password")}
                        className="text-slate-400 hover:text-slate-950 font-black text-[10px] uppercase tracking-widest flex items-center justify-center mx-auto transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                        Use Different Artery
                    </button>
                </motion.div>
            </motion.div>

            <style jsx global>{`
                input[type='text']::-webkit-inner-spin-button, 
                input[type='text']::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 20px; }
            `}</style>
        </div>
    );
}

export default VerifyForgotOTP;