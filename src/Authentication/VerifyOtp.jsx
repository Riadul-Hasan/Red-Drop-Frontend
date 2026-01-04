

// import { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { FaClock, FaEnvelope, FaCheckCircle, FaRedo } from "react-icons/fa";

// export default function VerifyOtp() {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const email = state?.email;

//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);
//   const [loading, setLoading] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(180);
//   const [otpSent, setOtpSent] = useState(true);

//   if (!email) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center px-4">
//         <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
//           <div className="text-red-500 mb-4">
//             <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//             </svg>
//           </div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-3">Email Not Found</h2>
//           <p className="text-gray-600 mb-6">Please complete the registration process first.</p>
//           <button
//             onClick={() => navigate("/register")}
//             className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300"
//           >
//             Go to Signup
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // Countdown timer
//   useEffect(() => {
//     if (timeLeft <= 0) return;

//     const timer = setInterval(() => {
//       setTimeLeft((prev) => prev - 1);
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeLeft]);

//   const formatTime = (seconds) => {
//     const m = Math.floor(seconds / 60);
//     const s = seconds % 60;
//     return `${m}:${s.toString().padStart(2, "0")}`;
//   };

//   const handleOtpChange = (index, value) => {
//     if (!/^\d?$/.test(value)) return;

//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     // Auto-focus next input
//     if (value && index < 5) {
//       document.getElementById(`otp-input-${index + 1}`)?.focus();
//     }
//   };

//   const handleKeyDown = (index, e) => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       document.getElementById(`otp-input-${index - 1}`)?.focus();
//     }
//   };

//   const verifyOtp = async () => {
//     const otpString = otp.join("");
//     if (otpString.length !== 6) {
//       alert("Please enter a 6-digit OTP");
//       return;
//     }

//     setLoading(true);

//     const res = await fetch("http://localhost:8000/api/verify-otp/", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, otp: otpString }),
//     });

//     const data = await res.json();
//     setLoading(false);

//     if (res.ok) {
//       setOtpSent(false);
//       // Show success message before redirect
//       setTimeout(() => {
//         navigate("/dashboard", { state: { message: "Registration successful! Please login." } });
//       }, 1500);
//     } else {
//       alert(data.error || "Invalid OTP");
//       // Shake animation on error
//       document.querySelectorAll('.otp-input').forEach(input => {
//         input.classList.add('shake');
//         setTimeout(() => input.classList.remove('shake'), 500);
//       });
//     }
//   };

//   const resendOtp = async () => {
//     const res = await fetch("http://localhost:8000/api/resend-otp/", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email }),
//     });

//     const data = await res.json();

//     if (res.ok) {
//       alert("OTP resent! Check your email.");
//       setTimeLeft(180);
//       setOtp(["", "", "", "", "", ""]);
//       document.getElementById("otp-input-0")?.focus();
//     } else {
//       alert(data.error || "Failed to resend OTP");
//     }
//   };

//   const handlePaste = (e) => {
//     e.preventDefault();
//     const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);
//     if (/^\d{6}$/.test(pastedData)) {
//       const otpArray = pastedData.split('');
//       setOtp(otpArray);
//       document.getElementById(`otp-input-5`)?.focus();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center px-4 py-8">
//       <div className="max-w-md w-full">
//         {/* Header */}
//         <div className="text-center mb-10">
//           <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
//             <FaEnvelope className="w-10 h-10 text-red-600" />
//           </div>
//           <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
//             Verify Your Email
//           </h1>
//           <p className="text-gray-600 mb-2">
//             We've sent a 6-digit code to
//           </p>
//           <p className="text-red-600 font-semibold text-lg break-all">
//             {email}
//           </p>
//         </div>

//         {/* OTP Input Section */}
//         <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
//           <div className="mb-8">
//             <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
//               Enter verification code
//             </label>
//             <div className="flex justify-center gap-3 md:gap-4 mb-2" onPaste={handlePaste}>
//               {otp.map((digit, index) => (
//                 <input
//                   key={index}
//                   id={`otp-input-${index}`}
//                   type="text"
//                   inputMode="numeric"
//                   maxLength="1"
//                   value={digit}
//                   onChange={(e) => handleOtpChange(index, e.target.value)}
//                   onKeyDown={(e) => handleKeyDown(index, e)}
//                   className="otp-input w-12 h-14 md:w-14 md:h-16 text-center text-2xl md:text-3xl font-bold border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all duration-200"
//                   autoFocus={index === 0}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* Timer */}
//           <div className="flex items-center justify-center gap-2 mb-8">
//             <FaClock className={`w-5 h-5 ${timeLeft < 60 ? 'text-red-500' : 'text-gray-500'}`} />
//             <span className={`text-lg font-semibold ${timeLeft < 60 ? 'text-red-600' : 'text-gray-700'}`}>
//               {formatTime(timeLeft)}
//             </span>
//             <span className="text-gray-600">
//               {timeLeft > 0 ? "remaining" : "expired"}
//             </span>
//           </div>

//           {/* Action Buttons */}
//           <div className="space-y-4">
//             <button
//               onClick={verifyOtp}
//               disabled={loading || otp.join("").length !== 6}
//               className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${loading || otp.join("").length !== 6
//                   ? 'bg-gray-300 cursor-not-allowed text-gray-500'
//                   : 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
//                 }`}
//             >
//               {loading ? (
//                 <>
//                   <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Verifying...
//                 </>
//               ) : (
//                 <>
//                   <FaCheckCircle className="w-5 h-5" />
//                   Verify & Continue
//                 </>
//               )}
//             </button>

//             <button
//               onClick={resendOtp}
//               disabled={timeLeft > 0}
//               className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 ${timeLeft > 0
//                   ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                   : 'bg-white border-2 border-red-600 text-red-600 hover:bg-red-50'
//                 }`}
//             >
//               <FaRedo className={`w-4 h-4 ${timeLeft > 0 ? 'text-gray-400' : 'text-red-600'}`} />
//               Resend OTP {timeLeft > 0 && `(in ${formatTime(timeLeft)})`}
//             </button>
//           </div>
//         </div>

//         {/* Help Text */}
//         <div className="text-center space-y-3">
//           <p className="text-gray-600 text-sm">
//             Didn't receive the code? Check your spam folder
//           </p>
//           <button
//             onClick={() => navigate("/register")}
//             className="text-red-600 hover:text-red-700 font-medium text-sm transition-colors duration-300"
//           >
//             ← Back to Sign Up
//           </button>
//         </div>

//         {/* Success Modal */}
//         {otpSent === false && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center animate-scale-in">
//               <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
//                 <FaCheckCircle className="w-8 h-8 text-green-600" />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-900 mb-3">Success!</h3>
//               <p className="text-gray-600 mb-6">
//                 Your email has been verified successfully. Redirecting to login...
//               </p>
//               <div className="w-8 h-1 bg-red-600 rounded-full mx-auto animate-pulse"></div>
//             </div>
//           </div>
//         )}

//         {/* CSS for shake animation */}
//         <style jsx>{`
//           @keyframes shake {
//             0%, 100% { transform: translateX(0); }
//             25% { transform: translateX(-5px); }
//             75% { transform: translateX(5px); }
//           }
//           .shake {
//             animation: shake 0.3s ease-in-out;
//             border-color: #ef4444 !important;
//           }
//           @keyframes scale-in {
//             from { transform: scale(0.9); opacity: 0; }
//             to { transform: scale(1); opacity: 1; }
//           }
//           .animate-scale-in {
//             animation: scale-in 0.3s ease-out;
//           }
//         `}</style>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { 
    Clock, 
    Mail, 
    CheckCircle, 
    RefreshCcw, 
    ArrowLeft, 
    Shield, 
    Zap, 
    Loader2, 
    Activity,
    Lock
} from "lucide-react";

export default function VerifyOtp() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [otpSent, setOtpSent] = useState(true);
  const bgRef = useRef(null);

  // GSAP: Ambient Background Motion
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

  // Countdown timer (Unchanged Logic)
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  if (!email) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 font-sans">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-slate-100">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100">
            <Lock className="text-red-600" size={32} />
          </div>
          <h2 className="text-xl font-black text-slate-950 uppercase tracking-tight mb-2">Access Denied</h2>
          <p className="text-sm font-medium text-slate-500 mb-6">Artery link failed. Please initiate registration first.</p>
          <button
            onClick={() => navigate("/register")}
            className="w-full bg-slate-950 text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl hover:bg-red-600 transition-colors"
          >
            Return to Signup
          </button>
        </div>
      </div>
    );
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };

  const verifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) return;
    setLoading(true);
    try {
        const res = await fetch("http://localhost:8000/api/verify-otp/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp: otpString }),
        });
        const data = await res.json();
        if (res.ok) {
            setOtpSent(false);
            setTimeout(() => navigate("/dashboard", { state: { message: "Sync successful." } }), 1500);
        } else {
            document.querySelectorAll('.otp-input').forEach(input => {
                input.classList.add('shake');
                setTimeout(() => input.classList.remove('shake'), 500);
            });
        }
    } finally { setLoading(false); }
  };

  const resendOtp = async () => {
    const res = await fetch("http://localhost:8000/api/resend-otp/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      setTimeLeft(180);
      setOtp(["", "", "", "", "", ""]);
      document.getElementById("otp-input-0")?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      setOtp(pastedData.split(''));
      document.getElementById(`otp-input-5`)?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-black font-sans selection:bg-red-200 flex items-center justify-center p-4 relative overflow-hidden">
      
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
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-[2rem] shadow-2xl shadow-red-200 mb-6 border-4 border-white"
          >
            <Mail className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl font-black text-slate-950 uppercase tracking-tighter leading-none">
            Email <span className="text-red-600">Verification</span>
          </h1>
          <p className="text-sm font-bold text-slate-500 mt-4 uppercase tracking-widest leading-none">Transmission sent to</p>
          <p className="text-slate-950 font-black text-sm break-all mt-2 bg-slate-950/5 inline-block px-3 py-1 rounded-lg">
            {email}
          </p>
        </div>

        {/* OTP CAPSULE */}
        <div className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.08)] border border-white p-8 mb-8 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-slate-100">
             <motion.div 
                initial={{ width: "100%" }}
                animate={{ width: `${(timeLeft / 180) * 100}%` }}
                className="h-full bg-red-600"
             />
          </div>

          <div className="mb-8">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 text-center">
              Input 6-Digit Verification Pulse
            </label>
            <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="otp-input w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-black text-slate-950 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-red-600 focus:bg-white focus:ring-4 focus:ring-red-600/5 outline-none transition-all duration-200"
                  autoFocus={index === 0}
                />
              ))}
            </div>
          </div>

          {/* TIMER READOUT */}
          <div className="flex items-center justify-center gap-3 mb-8 bg-slate-50 py-3 rounded-2xl border border-slate-100">
            <Clock className={`w-4 h-4 ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
            <span className={`text-sm font-black tracking-widest ${timeLeft < 60 ? 'text-red-600' : 'text-slate-900'}`}>
              {formatTime(timeLeft)}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Remaining</span>
          </div>

          {/* ACTIONS */}
          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "#000" }}
              whileTap={{ scale: 0.98 }}
              onClick={verifyOtp}
              disabled={loading || otp.join("").length !== 6}
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-xl ${
                loading || otp.join("").length !== 6
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-red-600 text-white shadow-red-200'
              }`}
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <CheckCircle className="w-5 h-5" />}
              {loading ? "Verifying..." : "Verify Artery"}
            </motion.button>

            <button
              onClick={resendOtp}
              disabled={timeLeft > 0}
              className={`w-full py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                timeLeft > 0
                  ? 'text-slate-300'
                  : 'text-red-600 hover:bg-red-50 border border-red-100'
              }`}
            >
              <RefreshCcw className="w-3 h-3" />
              Resend Pulse {timeLeft > 0 && `(${formatTime(timeLeft)})`}
            </button>
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center">
            <button
                onClick={() => navigate("/register")}
                className="text-slate-400 hover:text-slate-950 font-black text-[10px] uppercase tracking-widest flex items-center justify-center mx-auto transition-colors group"
            >
                <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                Abort to Signup
            </button>
        </div>

        {/* SUCCESS PORTAL */}
        <AnimatePresence>
            {!otpSent && (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-4 z-[2000]"
                >
                    <motion.div 
                        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                        className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full text-center shadow-[0_30px_100px_rgba(0,0,0,0.5)] border border-white"
                    >
                        <div className="w-20 h-20 bg-emerald-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-950 uppercase tracking-tighter mb-2">Sync Verified</h3>
                        <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">
                            Artery established successfully. Redirecting to your dashboard terminal.
                        </p>
                        <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div 
                                initial={{ x: "-100%" }} animate={{ x: "0%" }}
                                transition={{ duration: 1.5 }}
                                className="h-full bg-emerald-500" 
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

        <style jsx global>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-6px); }
            75% { transform: translateX(6px); }
          }
          .shake { animation: shake 0.3s ease-in-out; border-color: #dc2626 !important; background-color: #fef2f2 !important; }
          input[type='text']::-webkit-inner-spin-button, input[type='text']::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
          .custom-scrollbar::-webkit-scrollbar { width: 4px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 20px; }
        `}</style>
      </motion.div>
    </div>
  );
}