

// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import gsap from "gsap";
// import { useGSAP } from "@gsap/react";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import {
//   Heart,
//   Droplet,
//   LogIn,
//   User,
//   Lock,
//   Eye,
//   EyeOff,
//   ArrowRight,
//   Shield,
//   AlertCircle,
//   Zap,
//   Activity,
//   Users,
//   CheckCircle
// } from "lucide-react";
// import Swal from "sweetalert2";

// // Register GSAP plugins
// gsap.registerPlugin(useGSAP, ScrollTrigger);

// // Get CSRF token
// function getCookie(name) {
//   const cookies = document.cookie.split(';');
//   for (let cookie of cookies) {
//     const [key, value] = cookie.trim().split('=');
//     if (key === name) return decodeURIComponent(value);
//   }
//   return null;
// }

// // Custom animated cursor component
// const AnimatedCursor = () => {
//   const cursorRef = useRef(null);
//   const followerRef = useRef(null);
//   const particlesRef = useRef([]);

//   useEffect(() => {
//     if (window.matchMedia("(pointer: coarse)").matches) return;

//     const cursor = cursorRef.current;
//     const follower = followerRef.current;
//     if (!cursor || !follower) return;

//     let mouseX = 0, mouseY = 0;
//     let posX = 0, posY = 0;
//     let particleInterval;

//     const moveCursor = (e) => {
//       mouseX = e.clientX;
//       mouseY = e.clientY;

//       gsap.to(cursor, {
//         x: mouseX - 4,
//         y: mouseY - 4,
//         duration: 0.1,
//         ease: "power2.out"
//       });
//     };

//     const animateFollower = () => {
//       posX += (mouseX - posX) / 6;
//       posY += (mouseY - posY) / 6;

//       gsap.set(follower, {
//         x: posX - 12,
//         y: posY - 12
//       });

//       requestAnimationFrame(animateFollower);
//     };

//     const createParticle = () => {
//       if (particlesRef.current.length > 8) {
//         const oldParticle = particlesRef.current.shift();
//         if (oldParticle) document.body.removeChild(oldParticle);
//       }

//       const particle = document.createElement('div');
//       particle.className = 'cursor-particle';
//       particle.style.cssText = `
//         position: fixed;
//         width: 4px;
//         height: 4px;
//         background: #ef4444;
//         border-radius: 50%;
//         pointer-events: none;
//         z-index: 9999;
//         left: ${mouseX}px;
//         top: ${mouseY}px;
//         opacity: 0.7;
//       `;
//       document.body.appendChild(particle);
//       particlesRef.current.push(particle);

//       gsap.to(particle, {
//         x: (Math.random() - 0.5) * 20,
//         y: (Math.random() - 0.5) * 20,
//         opacity: 0,
//         scale: 0,
//         duration: 0.8,
//         ease: "power2.out",
//         onComplete: () => {
//           document.body.removeChild(particle);
//         }
//       });
//     };

//     particleInterval = setInterval(createParticle, 100);
//     window.addEventListener('mousemove', moveCursor);
//     animateFollower();

//     return () => {
//       window.removeEventListener('mousemove', moveCursor);
//       clearInterval(particleInterval);
//       particlesRef.current.forEach(p => {
//         if (p.parentNode) p.parentNode.removeChild(p);
//       });
//     };
//   }, []);

//   return (
//     <>
//       <div ref={cursorRef} className="hidden md:block fixed w-2 h-2 bg-rose-600 rounded-full pointer-events-none z-50 mix-blend-difference" />
//       <div ref={followerRef} className="hidden md:block fixed w-6 h-6 border-2 border-rose-400/50 rounded-full pointer-events-none z-50 mix-blend-difference" />
//     </>
//   );
// };

// // Animated stats counter component
// const AnimatedStat = ({ icon: Icon, value, label, delay = 0 }) => {
//   const [count, setCount] = useState(0);
//   const statRef = useRef(null);
//   const numValue = parseInt(value.replace(/[^0-9]/g, ''));

//   useGSAP(() => {
//     if (statRef.current) {
//       gsap.to(statRef.current, {
//         innerText: numValue,
//         duration: 2,
//         delay: delay,
//         snap: { innerText: 1 },
//         ease: "power2.out",
//         onUpdate: function () {
//           setCount(Math.floor(this.targets()[0].innerText));
//         }
//       });
//     }
//   }, [numValue, delay]);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: delay + 0.2 }}
//       className="relative group"
//       whileHover={{ y: -5 }}
//     >
//       <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 border border-rose-100 shadow-lg shadow-rose-100/50 hover:shadow-xl hover:shadow-rose-200/50 transition-all duration-300">
//         <div className="flex items-center space-x-4">
//           <motion.div
//             animate={{ rotate: [0, 10, -10, 0] }}
//             transition={{ duration: 3, repeat: Infinity, delay: delay }}
//             className="relative"
//           >
//             <div className="w-12 h-12 bg-gradient-to-br from-rose-500/10 to-pink-500/10 rounded-xl flex items-center justify-center">
//               <Icon className="w-6 h-6 text-rose-600" />
//             </div>
//             <motion.div
//               className="absolute -inset-1 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"
//               animate={{ scale: [1, 1.1, 1] }}
//               transition={{ duration: 2, repeat: Infinity }}
//             />
//           </motion.div>
//           <div>
//             <div className="text-2xl font-bold text-gray-900">
//               <span ref={statRef}>0</span>
//               <span className="text-lg">{value.replace(/[0-9]/g, '')}</span>
//             </div>
//             <div className="text-sm text-gray-600">{label}</div>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// // Main Login Component
// function Login() {
//   const navigate = useNavigate();
//   const containerRef = useRef();
//   const formContainerRef = useRef();
//   const [form, setForm] = useState({ identifier: "", password: "" });
//   const [error, setError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [activeInput, setActiveInput] = useState(null);

//   // Initialize animations
//   useGSAP(() => {
//     // Container entrance
//     gsap.from(containerRef.current, {
//       opacity: 0,
//       scale: 0.98,
//       duration: 1,
//       ease: "power2.out"
//     });

//     // Floating elements
//     gsap.utils.toArray(".float-element").forEach((el, i) => {
//       gsap.to(el, {
//         y: (Math.random() - 0.5) * 30,
//         duration: 3 + Math.random() * 2,
//         repeat: -1,
//         yoyo: true,
//         ease: "sine.inOut",
//         delay: i * 0.5
//       });
//     });

//   }, []);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setError("");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setIsLoading(true);

//     const button = e.target.querySelector('button[type="submit"]');
//     gsap.to(button, {
//       scale: 0.95,
//       duration: 0.1,
//       yoyo: true,
//       repeat: 1
//     });

//     try {
//       const csrftoken = getCookie("csrftoken");
//       const res = await fetch("http://localhost:8000/api/login/", {
//         method: "POST",
//         credentials: "include",
//         headers: {
//           "Content-Type": "application/json",
//           "X-CSRFToken": csrftoken,
//         },
//         body: JSON.stringify(form),
//       });

//       const data = await res.json();

//       if (res.ok) {

//         Swal.fire({
//           title: '<span style="font-family: Poppins; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: -0.01em;">Access Granted</span>',
//           html: '<div style="font-family: Poppins; font-weight: 600; color: #64748b; font-size: 14px; margin-top: 8px;">Identity verified. Artery synchronization complete.</div>',
//           icon: 'success',
//           iconColor: '#dc2626', // Clinical Artery Red
//           timer: 2200,
//           timerProgressBar: true,
//           showConfirmButton: false,
//           background: '#ffffff',
//           width: '420px',
//           padding: '2.5rem',
//           confirmButtonColor: '#dc2626', // This colors the progress bar automatically
//         });

//         // Success animation sequence
//         const tl = gsap.timeline();

//         // Create celebration particles
//         for (let i = 0; i < 15; i++) {
//           const particle = document.createElement('div');
//           particle.className = 'celebration-particle';
//           particle.style.cssText = `
//             position: fixed;
//             width: 8px;
//             height: 8px;
//             background: linear-gradient(45deg, #ef4444, #ec4899);
//             border-radius: 50%;
//             pointer-events: none;
//             z-index: 1000;
//             left: ${button.getBoundingClientRect().left + button.offsetWidth / 2}px;
//             top: ${button.getBoundingClientRect().top + button.offsetHeight / 2}px;
//           `;
//           document.body.appendChild(particle);

//           tl.to(particle, {
//             x: (Math.random() - 0.5) * 150,
//             y: (Math.random() - 0.5) * 150 - 50,
//             opacity: 0,
//             scale: 0,
//             duration: 1,
//             ease: "power2.out",
//             onComplete: () => particle.remove(),
//           }, "<");
//         }

//         // Button success glow
//         tl.to(button, {
//           boxShadow: "0 0 0 10px rgba(34, 197, 94, 0.3), 0 0 30px rgba(34, 197, 94, 0.5)",
//           duration: 0.5,
//           yoyo: true,
//           repeat: 2
//         }, "-=0.5");

//         setTimeout(() => navigate("/dashboard"), 1200);
//       } else {
//         setError(data.error || "Invalid credentials");
//         gsap.from(formContainerRef.current, {
//           x: [-5, 5, -5, 5, 0],
//           duration: 0.4,
//           ease: "power2.out"
//         });
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Network error. Please check your connection.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Stats data
//   const stats = [
//     { icon: Users, value: "25,327+", label: "Active Donors" },
//     { icon: Heart, value: "10,458+", label: "Lives Saved" },
//     { icon: Activity, value: "99.8%", label: "Success Rate" }
//   ];

//   return (
//     <>
//       <AnimatedCursor />

//       {/* Background */}
//       <div className="fixed inset-0 bg-gradient-to-br from-rose-50 via-white to-pink-50" />

//       {/* Animated Background Elements */}
//       <div className="fixed inset-0 overflow-hidden pointer-events-none">
//         {/* Floating blood cells */}
//         {Array.from({ length: 12 }).map((_, i) => (
//           <motion.div
//             key={i}
//             className="float-element absolute"
//             style={{
//               width: `${12 + Math.random() * 20}px`,
//               height: `${12 + Math.random() * 20}px`,
//               background: `radial-gradient(circle, 
//                 rgba(239, 68, 68, ${0.2 + Math.random() * 0.2}) 0%,
//                 rgba(220, 38, 38, ${0.1 + Math.random() * 0.1}) 70%,
//                 transparent 100%
//               )`,
//               borderRadius: "50%",
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               filter: "blur(1px)"
//             }}
//             animate={{
//               x: (Math.random() - 0.5) * 80,
//               rotate: 360
//             }}
//             transition={{
//               x: { duration: 6 + Math.random() * 4, repeat: Infinity, repeatType: "reverse" },
//               rotate: { duration: 25 + Math.random() * 10, repeat: Infinity, ease: "linear" }
//             }}
//           />
//         ))}

//         {/* Gradient orbs */}
//         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-rose-200/20 to-pink-200/20 rounded-full blur-3xl" />
//         <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-rose-200/20 to-pink-200/20 rounded-full blur-3xl" />
//       </div>

//       {/* Main Container */}
//       <div
//         ref={containerRef}
//         className="relative min-h-screen flex items-center justify-center p-4 md:p-6"
//       >
//         <div className="w-full max-w-7xl mx-auto">
//           <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
//             {/* Left Panel - Hero & Stats */}
//             <motion.div
//               initial={{ opacity: 0, x: -30 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.6 }}
//               className="space-y-8"
//             >
//               {/* Brand */}
//               <div className="space-y-6">
//                 <motion.div
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   transition={{ type: "spring", stiffness: 200, damping: 15 }}
//                   className="flex items-center space-x-4"
//                 >
//                   <motion.div
//                     animate={{ rotate: 360 }}
//                     transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
//                     className="relative"
//                   >
//                     <div className="w-16 h-16 bg-gradient-to-br from-rose-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl shadow-rose-500/30">
//                       <Heart className="w-8 h-8 text-white" />
//                     </div>
//                     <motion.div
//                       className="absolute -inset-2 bg-gradient-to-r from-rose-600 to-pink-600 rounded-2xl blur opacity-20"
//                       animate={{ rotate: 360 }}
//                       transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 0.5 }}
//                     />
//                   </motion.div>
//                   <div>
//                     <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 via-rose-700 to-pink-600 bg-clip-text text-transparent">
//                       RedDrop
//                     </h1>
//                     <p className="text-gray-600 mt-1">Life Saving Network</p>
//                   </div>
//                 </motion.div>

//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.2 }}
//                   className="space-y-3"
//                 >
//                   <h2 className="text-3xl font-bold text-gray-900">
//                     Welcome Back,
//                     <span className="block bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
//                       Life Saver
//                     </span>
//                   </h2>
//                   <p className="text-gray-600 text-lg max-w-md">
//                     Your next donation could save up to 3 lives. Continue your heroic journey.
//                   </p>
//                 </motion.div>
//               </div>

//               {/* Animated Stats */}
//               <div className="space-y-5">
//                 {stats.map((stat, idx) => (
//                   <AnimatedStat
//                     key={idx}
//                     {...stat}
//                     delay={idx * 0.1}
//                   />
//                 ))}
//               </div>

//               {/* Impact & Security */}
//               <div className="space-y-5">
//                 {/* Real-time Impact */}
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.5 }}
//                   className="bg-gradient-to-r from-emerald-50 to-emerald-100/50 rounded-2xl p-5 border border-emerald-200 shadow-lg"
//                 >
//                   <div className="flex items-center space-x-4">
//                     <motion.div
//                       animate={{ scale: [1, 1.2, 1] }}
//                       transition={{ duration: 2, repeat: Infinity }}
//                       className="relative"
//                     >
//                       <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
//                         <Zap className="w-6 h-6 text-white" />
//                       </div>
//                     </motion.div>
//                     <div className="flex-1">
//                       <h3 className="font-bold text-emerald-800">Real-time Impact</h3>
//                       <div className="flex items-baseline space-x-2">
//                         <span className="text-2xl font-bold text-emerald-900">142</span>
//                         <span className="text-emerald-700">lives saved yesterday</span>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Animated ECG Line */}
//                   <div className="mt-4 relative h-1.5 overflow-hidden rounded-full bg-emerald-200">
//                     <motion.div
//                       className="absolute h-full bg-gradient-to-r from-emerald-400 to-emerald-500"
//                       style={{ width: "100%" }}
//                       initial={{ x: "-100%" }}
//                       animate={{ x: "200%" }}
//                       transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//                     />
//                   </div>
//                 </motion.div>

//                 {/* Security Badge */}
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.7 }}
//                   className="flex items-center justify-center space-x-3 text-gray-600 bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200"
//                 >
//                   <motion.div
//                     animate={{ rotate: 360 }}
//                     transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
//                   >
//                     <Shield className="w-5 h-5 text-rose-600" />
//                   </motion.div>
//                   <span className="text-sm font-medium">HIPAA Compliant • End-to-End Encrypted</span>
//                 </motion.div>
//               </div>
//             </motion.div>

//             {/* Right Panel - Login Form */}
//             <motion.div
//               ref={formContainerRef}
//               initial={{ opacity: 0, x: 30 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.6, delay: 0.1 }}
//               className="relative"
//             >
//               <div className="bg-white rounded-3xl shadow-2xl shadow-rose-500/10 p-6 md:p-8 border border-gray-100">
//                 {/* Form Header */}
//                 <div className="mb-8">
//                   <div className="flex items-center justify-between mb-6">
//                     <div>
//                       <h3 className="text-2xl font-bold text-gray-900">Continue Your Journey</h3>
//                       <p className="text-gray-600 mt-1">Sign in to access your donor dashboard</p>
//                     </div>
//                     <motion.div
//                       animate={{ rotate: [0, 10, 0] }}
//                       transition={{ duration: 3, repeat: Infinity }}
//                       className="hidden md:block"
//                     >
//                       <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl flex items-center justify-center border border-rose-200">
//                         <LogIn className="w-6 h-6 text-rose-600" />
//                       </div>
//                     </motion.div>
//                   </div>

//                   {/* Urgent Need Indicator */}
//                   <motion.div
//                     initial={{ opacity: 0, scale: 0.95 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     transition={{ delay: 0.3 }}
//                     className="bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 rounded-2xl p-5 relative overflow-hidden"
//                   >
//                     <div className="flex items-center space-x-4">
//                       <motion.div
//                         animate={{ scale: [1, 1.3, 1] }}
//                         transition={{ duration: 1.5, repeat: Infinity }}
//                         className="relative"
//                       >
//                         <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center">
//                           <Heart className="w-5 h-5 text-white" />
//                         </div>
//                       </motion.div>
//                       <div>
//                         <p className="text-sm font-medium text-rose-800">
//                           <span className="font-bold">Urgent:</span> 142 lives saved yesterday
//                         </p>
//                         <p className="text-sm text-rose-600">Your login can help save more</p>
//                       </div>
//                     </div>

//                     {/* Pulsing ring */}
//                     <motion.div
//                       className="absolute -inset-1 border-2 border-rose-300 rounded-2xl"
//                       animate={{ scale: [1, 1.05, 1] }}
//                       transition={{ duration: 2, repeat: Infinity }}
//                     />
//                   </motion.div>
//                 </div>

//                 {/* Error Message */}
//                 <AnimatePresence>
//                   {error && (
//                     <motion.div
//                       initial={{ opacity: 0, height: 0, marginBottom: 0 }}
//                       animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
//                       exit={{ opacity: 0, height: 0, marginBottom: 0 }}
//                       className="overflow-hidden"
//                     >
//                       <div className="bg-red-50 border border-red-200 rounded-xl p-4">
//                         <div className="flex items-center space-x-3">
//                           <motion.div
//                             animate={{ rotate: [0, 10, -10, 0] }}
//                             transition={{ duration: 0.5 }}
//                           >
//                             <AlertCircle className="w-5 h-5 text-red-500" />
//                           </motion.div>
//                           <p className="text-red-700 text-sm font-medium">{error}</p>
//                         </div>
//                       </div>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>

//                 {/* Login Form */}
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                   {/* Username/Email Input */}
//                   <motion.div
//                     animate={{
//                       borderColor: activeInput === 'identifier' ? '#ef4444' : '#e5e7eb',
//                       backgroundColor: activeInput === 'identifier' ? '#fdf2f8' : '#f9fafb'
//                     }}
//                     className="relative group rounded-2xl border-2 transition-all duration-300"
//                   >
//                     <label className="block text-sm font-medium text-gray-700 mb-2 px-4 pt-4">
//                       Username or Email
//                     </label>
//                     <div className="relative px-4 pb-4">
//                       <motion.div
//                         animate={{
//                           x: activeInput === 'identifier' ? 5 : 0,
//                           scale: activeInput === 'identifier' ? 1.1 : 1
//                         }}
//                         className="absolute left-4 top-1/2 -translate-y-1/2"
//                       >
//                         <User className="w-5 h-5 text-gray-400 group-hover:text-rose-500 transition-colors" />
//                       </motion.div>
//                       <input
//                         type="text"
//                         name="identifier"
//                         value={form.identifier}
//                         onChange={handleChange}
//                         onFocus={() => setActiveInput('identifier')}
//                         onBlur={() => setActiveInput(null)}
//                         className="w-full pl-12 pr-4 py-3 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-sm"
//                         placeholder="Enter username or email"
//                         required
//                         disabled={isLoading}
//                       />
//                     </div>
//                   </motion.div>

//                   {/* Password Input */}
//                   <motion.div
//                     animate={{
//                       borderColor: activeInput === 'password' ? '#ef4444' : '#e5e7eb',
//                       backgroundColor: activeInput === 'password' ? '#fdf2f8' : '#f9fafb'
//                     }}
//                     className="relative group rounded-2xl border-2 transition-all duration-300"
//                   >
//                     <label className="block text-sm font-medium text-gray-700 mb-2 px-4 pt-4">
//                       Password
//                     </label>
//                     <div className="relative px-4 pb-4">
//                       <motion.div
//                         animate={{
//                           rotate: activeInput === 'password' ? [0, 10, 0] : 0,
//                           scale: activeInput === 'password' ? 1.1 : 1
//                         }}
//                         transition={{ rotate: { duration: 0.5 } }}
//                         className="absolute left-4 top-1/2 -translate-y-1/2"
//                       >
//                         <Lock className="w-5 h-5 text-gray-400 group-hover:text-rose-500 transition-colors" />
//                       </motion.div>
//                       <input
//                         type={showPassword ? "text" : "password"}
//                         name="password"
//                         value={form.password}
//                         onChange={handleChange}
//                         onFocus={() => setActiveInput('password')}
//                         onBlur={() => setActiveInput(null)}
//                         className="w-full pl-12 pr-12 py-3 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-sm"
//                         placeholder="Enter your password"
//                         required
//                         disabled={isLoading}
//                       />
//                       <motion.button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500 transition-colors"
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.95 }}
//                         disabled={isLoading}
//                       >
//                         {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                       </motion.button>
//                     </div>
//                     <div className="px-4 pb-4 flex justify-between items-center">
//                       <motion.button
//                         type="button"
//                         onClick={() => navigate('/forgot-password')}
//                         className="text-sm text-rose-600 hover:text-rose-700 font-medium transition-colors"
//                         whileHover={{ x: 3 }}
//                       >
//                         Forgot password?
//                       </motion.button>
//                       <span className="text-xs text-gray-500">
//                         Secure 8+ characters
//                       </span>
//                     </div>
//                   </motion.div>

//                   {/* Remember Me & Submit Button */}
//                   <div className="space-y-6">
//                     <motion.div
//                       className="flex items-center space-x-3"
//                       whileHover={{ x: 5 }}
//                     >
//                       <motion.div
//                         className="relative"
//                         whileTap={{ scale: 0.95 }}
//                       >
//                         <input
//                           type="checkbox"
//                           id="remember"
//                           className="sr-only"
//                         />
//                         <label htmlFor="remember" className="flex items-center cursor-pointer">
//                           <div className="w-5 h-5 border-2 border-gray-300 rounded-md flex items-center justify-center mr-3 transition-colors group-hover:border-rose-500">
//                             <motion.div
//                               initial={{ scale: 0 }}
//                               animate={{ scale: 1 }}
//                               className="hidden"
//                             >
//                               <CheckCircle className="w-4 h-4 text-rose-600" />
//                             </motion.div>
//                           </div>
//                           <span className="text-sm text-gray-700">Remember me on this device</span>
//                         </label>
//                       </motion.div>
//                     </motion.div>

//                     {/* Submit Button */}
//                     <motion.button
//                       type="submit"
//                       disabled={isLoading}
//                       className="w-full relative overflow-hidden group rounded-2xl"
//                       whileHover={{ scale: 1.01 }}
//                       whileTap={{ scale: 0.99 }}
//                     >
//                       {/* Button background layers */}
//                       <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-pink-600 rounded-2xl" />
//                       <motion.div
//                         className="absolute inset-0 bg-gradient-to-r from-rose-700 to-pink-700 rounded-2xl"
//                         initial={{ x: "-100%" }}
//                         whileHover={{ x: "0%" }}
//                         transition={{ duration: 0.5 }}
//                       />

//                       {/* Loading ripple */}
//                       {isLoading && (
//                         <motion.div
//                           className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl"
//                           animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
//                           transition={{ duration: 1.5, repeat: Infinity }}
//                         />
//                       )}

//                       {/* Button content */}
//                       <div className="relative z-10 py-4 px-6 flex items-center justify-center space-x-3">
//                         {isLoading ? (
//                           <>
//                             <motion.div
//                               className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
//                               animate={{ rotate: 360 }}
//                               transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//                             />
//                             <span className="text-white font-semibold">Signing In...</span>
//                           </>
//                         ) : (
//                           <>
//                             <span className="text-white font-semibold">Sign In</span>
//                             <motion.div
//                               animate={{ x: [0, 5, 0] }}
//                               transition={{ duration: 1.5, repeat: Infinity }}
//                             >
//                               <ArrowRight className="w-5 h-5 text-white" />
//                             </motion.div>
//                           </>
//                         )}
//                       </div>

//                       {/* Button shine effect */}
//                       <motion.div
//                         className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
//                         initial={{ x: "-100%" }}
//                         whileHover={{ x: "100%" }}
//                         transition={{ duration: 0.8 }}
//                       />
//                     </motion.button>
//                   </div>
//                 </form>

//                 {/* Registration Link */}
//                 <motion.div
//                   className="mt-8 pt-6 border-t border-gray-200 text-center"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ delay: 0.8 }}
//                 >
//                   <p className="text-gray-600 text-sm">
//                     Don't have an account?{" "}
//                     <motion.button
//                       onClick={() => navigate('/register')}
//                       className="text-rose-600 hover:text-rose-700 font-semibold relative inline-flex items-center group"
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                     >
//                       <span className="relative z-10">Join as a Life Saver</span>
//                       <motion.span
//                         className="absolute -inset-1 bg-rose-100 rounded-lg -z-10 opacity-0 group-hover:opacity-100"
//                         initial={{ scale: 0 }}
//                         whileHover={{ scale: 1 }}
//                         transition={{ type: "spring", stiffness: 400, damping: 25 }}
//                       />
//                     </motion.button>
//                   </p>
//                 </motion.div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </div>


//     </>
//   );
// }

// export default Login;



import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Heart,
  Droplet,
  LogIn,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  AlertCircle,
  Zap,
  Activity,
  Users,
  CheckCircle,
  Trophy,
  Loader2,
  Target
} from "lucide-react";
import Swal from "sweetalert2";

// Register GSAP plugins
gsap.registerPlugin(useGSAP, ScrollTrigger);

// --- HELPERS (UNCHANGED) ---
function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === name) return decodeURIComponent(value);
  }
  return null;
}

// Custom animated cursor component (Tactical Red Drop)
const AnimatedCursor = () => {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    let mouseX = 0, mouseY = 0, posX = 0, posY = 0;

    const moveCursor = (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      gsap.to(cursor, { x: mouseX - 4, y: mouseY - 4, duration: 0.1 });
    };

    const animateFollower = () => {
      posX += (mouseX - posX) / 6;
      posY += (mouseY - posY) / 6;
      gsap.set(follower, { x: posX - 12, y: posY - 12 });
      requestAnimationFrame(animateFollower);
    };

    window.addEventListener('mousemove', moveCursor);
    animateFollower();
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <>
      <div ref={cursorRef} className="hidden md:block fixed w-2 h-2 bg-red-600 rounded-full pointer-events-none z-[9999] mix-blend-difference" />
      <div ref={followerRef} className="hidden md:block fixed w-6 h-6 border border-red-400/50 rounded-full pointer-events-none z-[9999] mix-blend-difference" />
    </>
  );
};

// Animated stats counter component (Clinical Tile Design)
const AnimatedStat = ({ icon: Icon, value, label, delay = 0 }) => {
  const statRef = useRef(null);
  const numValue = parseInt(value.replace(/[^0-9]/g, ''));

  useGSAP(() => {
    if (statRef.current) {
      gsap.to(statRef.current, {
        innerText: numValue,
        duration: 2,
        delay: delay,
        snap: { innerText: 1 },
        ease: "power2.out"
      });
    }
  }, [numValue]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay + 0.2 }}
      className="bg-white/60 backdrop-blur-xl border border-white p-5 rounded-2xl shadow-sm group hover:border-red-200 transition-all"
    >
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors duration-500">
          <Icon size={22} />
        </div>
        <div>
          <div className="text-2xl font-black text-black tracking-tighter leading-none">
            <span ref={statRef}>0</span>
            <span>{value.replace(/[0-9]/g, '')}</span>
          </div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{label}</div>
        </div>
      </div>
    </motion.div>
  );
};

function Login() {
  const navigate = useNavigate();
  const containerRef = useRef();
  const formContainerRef = useRef();
  const bgRef = useRef();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeInput, setActiveInput] = useState(null);

  // Initialize GSAP Ambient Motion
  useGSAP(() => {
    gsap.to(".serum-blob", {
      x: "random(-100, 100)",
      y: "random(-100, 100)",
      scale: "random(1.2, 1.6)",
      duration: 20,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 2
    });
    gsap.to(".logo-pulse", { scale: 1.1, duration: 0.8, repeat: -1, yoyo: true, ease: "power1.inOut" });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const button = e.target.querySelector('button[type="submit"]');

    try {
      const csrftoken = getCookie("csrftoken");
      const res = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        // Clinical Alert
        await Swal.fire({
          title: '<span style="font-family: Poppins; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: -0.01em;">Access Granted</span>',
          html: '<div style="font-family: Poppins; font-weight: 600; color: #64748b; font-size: 14px; margin-top: 8px;">Identity verified. Artery synchronization complete.</div>',
          icon: 'success',
          iconColor: '#dc2626',
          timer: 2200,
          timerProgressBar: true,
          showConfirmButton: false,
          background: '#ffffff',
          width: '420px',
          padding: '2.5rem',
          confirmButtonColor: '#dc2626',
        });

        // SUCCESS ANIMATION (UNCHANGED LOGIC)
        const tl = gsap.timeline();
        for (let i = 0; i < 15; i++) {
          const particle = document.createElement('div');
          particle.style.cssText = `position:fixed; width:8px; height:8px; background:linear-gradient(45deg, #ef4444, #ec4899); border-radius:50%; pointer-events:none; z-index:1000; left:${button.getBoundingClientRect().left + button.offsetWidth / 2}px; top:${button.getBoundingClientRect().top + button.offsetHeight / 2}px;`;
          document.body.appendChild(particle);
          tl.to(particle, { x: (Math.random() - 0.5) * 150, y: (Math.random() - 0.5) * 150 - 50, opacity: 0, scale: 0, duration: 1, ease: "power2.out", onComplete: () => particle.remove() }, "<");
        }
        tl.to(button, { boxShadow: "0 0 0 10px rgba(220, 38, 38, 0.2)", duration: 0.5, yoyo: true, repeat: 2 }, "-=0.5");

        setTimeout(() => navigate("/dashboard"), 500);
      } else {
        setError(data.error || "Invalid credentials");
        gsap.from(formContainerRef.current, { x: [-10, 10, -10, 10, 0], duration: 0.4 });
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { icon: Users, value: "25,327+", label: "Active Donors" },
    { icon: Heart, value: "10,458+", label: "Lives Saved" },
    { icon: Activity, value: "99.8%", label: "Success Rate" }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-black  selection:bg-red-200 relative overflow-hidden flex items-center justify-center p-4">
      <AnimatedCursor />

      {/* GSAP BACKGROUND BLOBS */}
      <div ref={bgRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-50">
        <div className="serum-blob absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-red-100 rounded-full blur-[140px]" />
        <div className="serum-blob absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-100 rounded-full blur-[120px]" />
      </div>

      <div ref={containerRef} className="relative z-10 w-full max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* --- LEFT PANEL --- */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="space-y-10">
            {/* Brand */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="logo-pulse w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-200">
                    <Heart className="text-white fill-current" size={32} />
                  </div>
                  <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }} transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-red-500 rounded-2xl blur-xl -z-10" />
                </div>
                <div>
                  <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">Red Drop</h1>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Life Saving Artery</p>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl lg:text-6xl font-black text-black tracking-tighter leading-[0.95]">
                  WELCOME BACK,<br /><span className="text-red-600 uppercase">Life Saver</span>
                </h2>
                <p className="text-slate-500 text-lg font-medium max-w-md leading-relaxed">
                  Your next donation signal could save up to 3 lives. Continue your journey in the clinical network.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map((stat, idx) => (
                <AnimatedStat key={idx} {...stat} delay={idx * 0.1} />
              ))}
            </div>

            {/* Impact Strip */}
            <div className="bg-slate-950 rounded-[2rem] p-6 text-white shadow-2xl relative overflow-hidden group border border-slate-800">
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-5">
                  <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-lg"><Zap className="text-white fill-current" size={20} /></div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest leading-none mb-1">Real-time Impact</h3>
                    <p className="text-xs font-bold text-slate-400">142 Signals Synchronized Yesterday</p>
                  </div>
                </div>
                <div className="text-right hidden sm:block"><span className="text-2xl font-black text-red-500 animate-pulse">LIVE</span></div>
              </div>
              <Activity size={120} className="absolute -right-10 -bottom-10 text-white/[0.03] rotate-12" />
            </div>

            {/* Security */}
            <div className="flex items-center gap-4 text-slate-400">
              <Shield size={16} className="text-red-600" />
              <span className="text-[10px] font-black uppercase tracking-widest">HIPAA Compliant • End-to-End Encrypted</span>
            </div>
          </motion.div>

          {/* --- RIGHT PANEL (LOGIN FORM) --- */}
          <motion.div ref={formContainerRef} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="relative">
            <div className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.08)] p-8 md:p-12 border border-white">
              
              <div className="mb-10 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-black uppercase tracking-tighter">Terminal Access</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Verify Clinical Identity</p>
                </div>
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                  <LogIn className="w-7 h-7 text-red-600" />
                </div>
              </div>

              {/* Urgent Condition Badge */}
              <div className="bg-red-50 border border-red-100 rounded-2xl p-5 mb-8 flex items-center gap-5 relative overflow-hidden">
                <Heart className="w-6 h-6 text-red-600 fill-current animate-pulse shrink-0" />
                <p className="text-xs font-bold text-red-800 leading-tight">
                  <span className="font-black uppercase block mb-0.5">High Urgency Condition</span>
                  142 lives were saved yesterday. Your entry is vital.
                </p>
              </div>

              {/* Error Feedback */}
              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="bg-red-600 text-white rounded-xl p-4 mb-6 text-xs font-black uppercase tracking-widest flex items-center gap-3">
                    <AlertCircle size={16} /> {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Identity Identifier</label>
                  <div className={`transition-all duration-300 border-2 rounded-2xl flex items-center px-5 py-4 bg-white ${activeInput === 'identifier' ? 'border-red-600 shadow-lg shadow-red-50' : 'border-slate-100'}`}>
                    <User size={20} className={`${activeInput === 'identifier' ? 'text-red-600' : 'text-slate-300'}`} />
                    <input 
                      type="text" name="identifier" value={form.identifier} onChange={handleChange}
                      onFocus={() => setActiveInput('identifier')} onBlur={() => setActiveInput(null)}
                      className="w-full bg-transparent border-none outline-none px-4 text-sm font-bold text-black placeholder:text-slate-300"
                      placeholder="Username or Email Address" required disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between px-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Security Key</label>
                    <button type="button" onClick={() => navigate('/forgot-password')} className="text-[10px] font-black text-red-600 uppercase tracking-widest hover:underline">Forgot Password?</button>
                  </div>
                  <div className={`transition-all duration-300 border-2 rounded-2xl flex items-center px-5 py-4 bg-white ${activeInput === 'password' ? 'border-red-600 shadow-lg shadow-red-50' : 'border-slate-100'}`}>
                    <Lock size={20} className={`${activeInput === 'password' ? 'text-red-600' : 'text-slate-300'}`} />
                    <input 
                      type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange}
                      onFocus={() => setActiveInput('password')} onBlur={() => setActiveInput(null)}
                      className="w-full bg-transparent border-none outline-none px-4 text-sm font-bold text-black placeholder:text-slate-300"
                      placeholder="••••••••••••" required disabled={isLoading}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-300 hover:text-red-600 transition-colors">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 px-1">
                  <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-600" />
                  <label htmlFor="remember" className="text-[11px] font-bold text-slate-500 uppercase tracking-widest cursor-pointer">Trust this terminal</label>
                </div>

                <motion.button
                  type="submit" disabled={isLoading}
                  whileHover={{ scale: 1.02, backgroundColor: "#0f172a" }} whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-red-200 flex items-center justify-center gap-3 transition-all"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap size={18} className="fill-current" />}
                  {isLoading ? 'Synchronizing...' : 'Initialize Access'}
                </motion.button>
              </form>

              {/* Registration Link */}
              <div className="mt-10 pt-8 border-t border-slate-50 text-center">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Not on the network? <button onClick={() => navigate('/register')} className="text-red-600 font-black hover:underline ml-2">Establish Artery Link</button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Login;