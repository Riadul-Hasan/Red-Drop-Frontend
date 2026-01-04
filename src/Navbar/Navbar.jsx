import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplet, Menu, X, Heart, Activity, Globe, Zap, ChevronRight } from 'lucide-react';
import { FaHeartBroken } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

    const getCookie = (name) => {
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
};


const handleLogout = async () => {
  try {
    const csrfToken = getCookie("csrftoken");

    const res = await fetch("http://localhost:8000/api/logout/", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
    });

    if (res.ok) {
      window.location.href = "/login";
    } else {
      console.error("Logout failed");
    }
  } catch (error) {
    console.error("Logout error:", error);
  }
};


  // Nav links configuration
  const navLinks = [
    { name: 'Request Blood', icon: <Activity size={14} />, href: '/emergencyBlood' },
    { name: 'Journey', icon: <Zap size={14} />, href: '#journey' },
    { name: 'Centers', icon: <Globe size={14} />, href: '#map' },
  ];

  // Mobile menu variants for the "Cellular Reveal"
  const menuVariants = {
    closed: {
      clipPath: "circle(0% at 90% 5%)",
      transition: { type: "spring", stiffness: 400, damping: 40 }
    },
    open: {
      clipPath: "circle(150% at 90% 5%)",
      transition: { type: "spring", stiffness: 20, restDelta: 2 }
    }
  };

  const linkVariants = {
    closed: { x: -20, opacity: 0 },
    open: i => ({
      x: 0,
      opacity: 1,
      transition: { delay: i * 0.1 + 0.3 }
    })
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      /* 
         bg-slate-950/90: Provides the permanent "blakish" look 
         backdrop-blur-xl: Adds the professional glass feel
         border-white/5: A surgical-thin border for depth
      */
      className="fixed top-0 left-0 right-0 z-[1000] h-[74px] flex items-center px-6 md:px-12 bg-slate-950/90 backdrop-blur-xl border-b border-white/5 shadow-2xl"
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        
        {/* --- LOGO: Pulsing Organism --- */}
        <motion.div 
          className="flex items-center gap-3 cursor-pointer group"
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative">
            <motion.div 
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-red-600 rounded-full blur-lg"
            />
            <div className="relative bg-red-600 p-2 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.4)]">
              <Droplet className="text-white fill-white" size={22} />
            </div>
          </div>
         <Link to="/">
           <span className="text-xl font-black tracking-tighter text-white">
            RedDr<span className="text-red-600">op</span>
          </span>
         </Link>
        </motion.div>

        {/* --- DESKTOP NAV --- */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="relative group py-2 text-sm font-bold text-slate-400 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-red-600 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  {link.icon}
                </span>
                {link.name}
              </div>
              <motion.span 
                className="absolute bottom-0 left-0 w-0 h-[2px] bg-red-600"
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </a>
          ))}
        </div>

        {/* --- NAV ACTIONS --- */}
        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] font-black text-red-500 tracking-[0.2em] uppercase">Emergency Need</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">B- Positive</span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
            </div>
          </div>
{/* 
          <motion.button
            whileHover="hover"
            whileTap={{ scale: 0.95 }}
            className="relative overflow-hidden bg-white text-black px-7 py-3 rounded-full font-black text-xs tracking-wider transition-colors hover:text-white"
          >
            <span className="relative z-10 flex items-center gap-2">
              Sign Out <FaHeartBroken size={14} className="fill-current" />
            </span>
            <motion.div
              variants={{ hover: { y: "0%" } }}
              initial={{ y: "100%" }}
              transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
              className="absolute inset-0 bg-red-600 z-0"
            />
          </motion.button> */}

          <motion.button
  whileHover="hover"
  whileTap={{ scale: 0.95 }}
  onClick={handleLogout}
  className="relative overflow-hidden bg-white text-black px-7 py-3 rounded-full font-black text-xs tracking-wider hover:text-white"
>
  <span className="relative z-10 flex items-center gap-2">
    Sign Out <FaHeartBroken size={14} />
  </span>

  <motion.div
    variants={{ hover: { y: "0%" } }}
    initial={{ y: "100%" }}
    transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
    className="absolute inset-0 bg-red-600 z-0"
  />
</motion.button>


          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-white bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* --- MOBILE OVERLAY --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 bg-slate-950 z-[-1] flex flex-col justify-center px-10 lg:hidden"
          >
            <div className="space-y-8 relative z-10">
              <span className="text-red-600 font-black tracking-widest text-xs uppercase">Navigation</span>
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  custom={i}
                  variants={linkVariants}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between text-5xl font-black text-white hover:text-red-600 transition-colors group"
                >
                  {link.name}
                  <ChevronRight className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all text-red-600" size={40} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;