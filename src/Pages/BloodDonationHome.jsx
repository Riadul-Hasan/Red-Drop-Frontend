import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { Droplet, Heart, Activity, Zap, Globe, ChevronRight, Play, ShieldCheck } from 'lucide-react';

// --- 1. THE PRELOADER (The Heartbeat Entry) ---
const Preloader = ({ finishLoading }) => {
  return (
    <motion.div
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[5000] bg-slate-950 flex flex-col items-center justify-center"
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.5, 1]
        }}
        transition={{ duration: 0.8, repeat: 3, onComplete: finishLoading }}
        className="relative"
      >
        <div className="absolute inset-0 bg-red-600 blur-2xl opacity-20" />
        <Droplet size={80} className="text-red-600 fill-red-600 relative z-10" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-red-500 font-black tracking-[0.3em] mt-8 uppercase text-xs"
      >
        Initializing Vital Systems
      </motion.p>
    </motion.div>
  );
};

const BloodDonationHome = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  const [isAuthenticated, setIsAuthenticated] = useState(false);


  useEffect(() => {
    fetch("http://localhost:8000/api/current-user/", {
      credentials: "include",
    })
      .then(res => setIsAuthenticated(res.ok))
      .catch(() => setIsAuthenticated(false));
  }, []);


  const handleDashboardClick = () => {
    if (isAuthenticated) {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/login";
    }
  };

  // --- Animation Variants for "Perfect" Entry ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.5 }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="bg-[#050507] min-h-screen text-white overflow-hidden font-sans">
      <AnimatePresence>
        {isLoading ? (
          <Preloader finishLoading={() => setIsLoading(false)} />
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* --- 2. PROGRESS BAR --- */}
            <motion.div
              className="fixed top-0 left-0 right-0 h-1 bg-red-600 z-[2000] origin-left"
              style={{ scaleX: smoothProgress }}
            />

            {/* --- 3. DYNAMIC HERO SECTION --- */}
            <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
              {/* Animated Plasma Background */}
              <div className="absolute inset-0 z-0">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      x: [0, 50, 0],
                      y: [0, 30, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 10 + i, repeat: Infinity, ease: "linear" }}
                    className="absolute rounded-full bg-red-900/10 blur-[120px]"
                    style={{
                      width: '40vw',
                      height: '40vw',
                      left: `${i * 20}%`,
                      top: `${i * 10}%`,
                    }}
                  />
                ))}
              </div>

              <div className="container max-w-7xl mx-auto relative z-10 text-center">
                <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/10 border border-red-600/20 text-red-500 text-xs font-black tracking-widest uppercase mb-8">
                  <Activity size={14} className="animate-pulse" /> Urgent Supply Needed: O-
                </motion.div>

                <motion.h1
                  variants={itemVariants}
                  className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] mb-8"
                >
                  GIVE <span className="text-red-600">LIFE</span><br />
                  <span className="text-outline">BE THE PULSE</span>
                </motion.h1>

                <motion.p
                  variants={itemVariants}
                  className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl mb-12 font-medium leading-relaxed"
                >
                  Every drop is a heartbeat. Join a global network of donors
                  turning empathy into action through cutting-edge coordination.
                </motion.p>

                <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-6">
                  <motion.button
                    onClick={handleDashboardClick}
                    whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(220,38,38,0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    className="px-10 py-5 bg-red-600 rounded-full font-black text-white flex items-center gap-3 shadow-2xl"
                  >
                    DASHBOARD <ChevronRight size={20} />
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                    className="px-10 py-5 rounded-full border border-white/10 font-black text-white flex items-center gap-3 backdrop-blur-md"
                  >
                    <Play size={20} fill="white" /> WATCH IMPACT
                  </motion.button>
                </motion.div>
              </div>

              {/* Floating Stat Decorations */}
              <motion.div
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute right-12 bottom-20 hidden xl:block"
              >
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 p-6 rounded-3xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center">
                      <Heart className="fill-white" />
                    </div>
                    <div>
                      <p className="text-3xl font-black">12.4k</p>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Lives Saved Daily</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </section>

            {/* --- 4. FEATURE GRID (Reveals on Scroll) --- */}
            <section className="py-32 px-6">
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { title: "Smart Matching", icon: <Zap />, desc: "AI-driven donor compatibility routing." },
                  { title: "Global Reach", icon: <Globe />, desc: "Connecting blood banks across 120+ countries." },
                  { title: "Secure Chain", icon: <ShieldCheck />, desc: "Military-grade data protection for your journey." }
                ].map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.2 }}
                    whileHover={{ y: -10 }}
                    className="p-10 bg-gradient-to-b from-slate-900/50 to-transparent border border-white/5 rounded-[2.5rem] hover:border-red-600/30 transition-colors"
                  >
                    <div className="text-red-600 mb-6">{feature.icon}</div>
                    <h3 className="text-2xl font-black mb-4">{feature.title}</h3>
                    <p className="text-slate-400 font-medium">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </section>

          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .text-outline {
          color: transparent;
          -webkit-text-stroke: 1px rgba(255,255,255,0.2);
        }
        @font-face {
          font-family: 'Inter';
          src: url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        }
      `}</style>
    </div>
  );
};

export default BloodDonationHome;