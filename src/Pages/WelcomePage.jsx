



import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import {
  Droplet, Heart, Shield, Users, ArrowRight, CheckCircle,
  MapPin, Clock, Star, ChevronRight, Sparkles, Zap, Target, Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BloodDonationHome from './BloodDonationHome';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const WelcomePage = () => {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const bloodCellsRef = useRef(null);
  const statsRef = useRef(null);
  const cursorRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);



  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // GSAP Master Animations
  useEffect(() => {
    if (isReducedMotion) return;

    // Hero section floating animation
    gsap.from('.hero-content', {
      duration: 1.2,
      y: 60,
      opacity: 0,
      ease: 'power3.out'
    });

    // Floating blood cells
    const cells = document.querySelectorAll('.blood-cell');
    cells.forEach((cell, i) => {
      gsap.to(cell, {
        y: `-=${gsap.utils.random(20, 40)}`,
        x: `+=${gsap.utils.random(-10, 10)}`,
        duration: gsap.utils.random(2, 4),
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.2
      });
    });

    // Stats counter animation
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach((stat, index) => {
      const value = stat.getAttribute('data-value');
      if (!value) return;

      gsap.fromTo(stat,
        { innerText: 0 },
        {
          innerText: value,
          duration: 2,
          delay: 1 + index * 0.2,
          ease: 'power2.out',
          snap: { innerText: 1 },
          scrollTrigger: {
            trigger: stat,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    // Scroll-triggered section animations
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: i * 0.1,
        ease: 'back.out(1.2)'
      });
    });

    // Pulse animation for urgent indicator
    gsap.to('.urgent-pulse', {
      scale: 1.2,
      opacity: 0.6,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // Liquid fill animation for progress
    gsap.to('.liquid-fill', {
      width: '100%',
      duration: 2,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: '.liquid-fill',
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      }
    });

  }, [isReducedMotion]);

  // Custom cursor effect
  useEffect(() => {
    if (isReducedMotion) return;

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Magnetic effect for CTAs
      const ctas = document.querySelectorAll('.magnetic');
      ctas.forEach((cta) => {
        const rect = cta.getBoundingClientRect();
        const distance = Math.sqrt(
          Math.pow(e.clientX - (rect.left + rect.width / 2), 2) +
          Math.pow(e.clientY - (rect.top + rect.height / 2), 2)
        );

        if (distance < 100) {
          const strength = (100 - distance) / 100 * 10;
          const angle = Math.atan2(
            e.clientY - (rect.top + rect.height / 2),
            e.clientX - (rect.left + rect.width / 2)
          );

          gsap.to(cta, {
            x: Math.cos(angle) * strength,
            y: Math.sin(angle) * strength,
            duration: 0.3,
            ease: 'power2.out'
          });
        } else {
          gsap.to(cta, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)'
          });
        }
      });

      // Cursor trail particles
      if (e.target.closest('.particle-trigger')) {
        createCursorParticle(e.clientX, e.clientY);
      }
    };

    const createCursorParticle = (x, y) => {
      const particle = document.createElement('div');
      particle.className = 'cursor-particle';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      document.body.appendChild(particle);

      gsap.to(particle, {
        x: gsap.utils.random(-20, 20),
        y: gsap.utils.random(-20, 20),
        opacity: 0,
        scale: 0,
        duration: 1,
        ease: 'power2.out',
        onComplete: () => particle.remove()
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isReducedMotion]);

  // Complex animations with staggered delays
  const heroVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  const stats = [
    { value: "10458", label: "Lives Saved", icon: Heart, color: "text-red-500", bg: "bg-red-50" },
    { value: "25327", label: "Active Donors", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
    { value: "842", label: "Partner Hospitals", icon: MapPin, color: "text-green-500", bg: "bg-green-50" },
    { value: "99.8", label: "Success Rate", icon: CheckCircle, color: "text-purple-500", bg: "bg-purple-50" }
  ];

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-time Matching",
      description: "Instant connection between donors and urgent needs",
      color: "from-orange-400 to-red-500",
      delay: 0
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Hospital Verified",
      description: "All requests verified by medical professionals",
      color: "from-blue-400 to-cyan-500",
      delay: 0.1
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Platform",
      description: "HIPAA compliant data protection",
      color: "from-green-400 to-emerald-500",
      delay: 0.2
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Location Based",
      description: "Find requests near you instantly",
      color: "from-purple-400 to-pink-500",
      delay: 0.3
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Register & Verify",
      description: "Create your secure profile and complete health screening",
      gradient: "from-blue-400 to-cyan-500",
      icon: <Shield className="w-6 h-6" />
    },
    {
      step: "02",
      title: "Get Matched",
      description: "Receive alerts for compatible blood needs near you",
      gradient: "from-purple-400 to-pink-500",
      icon: <Target className="w-6 h-6" />
    },
    {
      step: "03",
      title: "Donate & Save",
      description: "Schedule donation at verified healthcare centers",
      gradient: "from-green-400 to-emerald-500",
      icon: <Heart className="w-6 h-6" />
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <BloodDonationHome></BloodDonationHome>
      {/* Animated Background Elements */}
      <div ref={bloodCellsRef} className="fixed inset-0 pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="blood-cell absolute w-6 h-6 rounded-full bg-gradient-to-r from-red-200 to-pink-200 opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>

      {/* Custom Cursor (Desktop only) */}
      {!isReducedMotion && (
        <>
          <motion.div
            ref={cursorRef}
            className="fixed w-8 h-8 pointer-events-none z-50 mix-blend-difference"
            animate={{
              x: mousePosition.x - 16,
              y: mousePosition.y - 16
            }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 15,
              mass: 0.1
            }}
          >
            <div className="w-full h-full rounded-full bg-white opacity-20" />
          </motion.div>
          <div
            className="cursor-trail fixed w-1 h-1 rounded-full bg-red-400 pointer-events-none z-40"
            style={{
              left: mousePosition.x,
              top: mousePosition.y,
              transform: 'translate(-50%, -50%)'
            }}
          />
        </>
      )}

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="px-6 py-6 lg:px-12 relative z-10"
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3 cursor-pointer"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-red-200 opacity-50"
              />
              <Droplet className="w-10 h-10 text-red-600 relative z-10" />
              <svg className="absolute inset-0 w-10 h-10">
                <defs>
                  <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#dc2626" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <motion.div
                className="urgent-pulse absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent"
            >
              Red<span className="font-black">Drop</span>
            </motion.span>
          </motion.div>

          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              className="hidden md:flex magnetic items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-red-200 transition-all"
            >
              <Heart className="w-5 h-5" />
              <span>Urgent Requests</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ChevronRight className="w-4 h-4" />
              </motion.div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 text-gray-700 hover:text-red-600 font-medium hover:bg-red-50 rounded-lg transition-colors"
            >
              How It Works
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 pt-4 pb-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Left Content */}
          <motion.div
            ref={heroRef}
            variants={heroVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8 hero-content"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center space-x-2">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Shield className="w-6 h-6" />
              </motion.div>
              <span className="font-medium bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                Trusted Healthcare Platform
              </span>
              <Sparkles className="w-5 h-5 text-yellow-500" />
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl lg:text-6xl font-bold leading-tight"
            >
              <span className="text-gray-900">Connecting</span>
              <motion.span
                className="block bg-gradient-to-r from-red-600 via-pink-600 to-red-600 bg-clip-text text-transparent bg-[length:200%_auto]"
                animate={{ backgroundPosition: ['0% center', '200% center'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                Lifesaving Heroes
              </motion.span>
              <span className="text-gray-900">with Those in Need</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl text-gray-600 leading-relaxed"
            >
              RedDrop bridges the gap between blood donors and urgent medical needs.
              Join our community of compassionate donors making a real difference in healthcare.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="flex gap-4">
                <Link to="/login" className="magnetic">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(220, 38, 38, 0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-xl shadow-lg shadow-red-200 flex items-center justify-center space-x-3 relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <span className="relative">Login</span>
                    <ArrowRight className="w-5 h-5 relative" />
                  </motion.button>
                </Link>

                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05, borderColor: "#fca5a5" }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all"
                  >
                    Register
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div variants={itemVariants} className="pt-8">
              <p className="text-gray-500 text-sm mb-4">Trusted by medical institutions</p>
              <div className="flex flex-wrap gap-6">
                {['HIPAA Compliant', 'ISO Certified', 'GDPR Ready', 'SSL Secure'].map((badge, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex items-center space-x-2 px-3 py-2 bg-white rounded-lg shadow-sm"
                  >
                    <motion.div
                      animate={{ rotateY: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                    >
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </motion.div>
                    <span className="font-medium text-gray-700">{badge}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Stats Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
            className="relative"
          >
            {/* Floating Particles */}
            <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-gradient-to-r from-red-400 to-pink-400 animate-ping opacity-20" />

            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 relative overflow-hidden">
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-white to-pink-50 opacity-50" />

              <div className="relative">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <motion.h3
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-2xl font-bold text-gray-900"
                    >
                      Live Impact Dashboard
                    </motion.h3>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <motion.span
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-sm font-medium text-red-600"
                      >
                        LIVE
                      </motion.span>
                    </div>
                  </div>
                  <p className="text-gray-600">Real-time statistics from our platform</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="flex items-center space-x-4">
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                            className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}
                          >
                            <Icon className={`w-6 h-6 ${stat.color}`} />
                          </motion.div>
                          <div>
                            <div className="text-2xl font-bold text-gray-900 stat-number" data-value={stat.value}>
                              {stat.value}
                            </div>
                            <div className="text-sm text-gray-600">{stat.label}</div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Urgent Request Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{ scale: 1.02 }}
                  className="relative overflow-hidden rounded-xl p-6"
                >
                  {/* Liquid fill background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10" />
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-pink-500 liquid-fill" />

                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Clock className="w-6 h-6 text-red-600" />
                        </motion.div>
                        <div>
                          <h4 className="font-bold text-gray-900">Urgent Requests</h4>
                          <p className="text-sm text-gray-600">Needing immediate response</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', delay: 1 }}
                          className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent"
                        >
                          23
                        </motion.div>
                        <div className="text-sm text-gray-500">Active now</div>
                      </div>
                    </div>
                    <Link to="/login">
                      <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0 5px 20px rgba(220, 38, 38, 0.3)" }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3.5 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold rounded-lg hover:shadow-lg transition-all particle-trigger"
                      >
                        View Urgent Needs
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              Why Choose Red<span className="text-red-600">Drop</span>?
            </motion.h2>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              A platform built with trust, efficiency, and compassion at its core
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: feature.delay }}
                whileHover={{ y: -10, scale: 1.02 }}
                onHoverStart={() => setActiveFeature(index)}
                onHoverEnd={() => setActiveFeature(null)}
                className="feature-card relative bg-white p-8 rounded-2xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                {/* Animated Background */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  animate={activeFeature === index ? { scale: 1.1 } : { scale: 1 }}
                />

                <motion.div
                  animate={activeFeature === index ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 0.6 }}
                  className={`w-14 h-14 mb-6 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white`}
                >
                  {feature.icon}
                </motion.div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>

                {/* Animated underline */}
                <motion.div
                  className="h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mt-4"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 lg:p-12 mb-24 relative overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-100 to-pink-100 rounded-full -translate-y-32 translate-x-32 opacity-50" />

          <div className="relative">
            <div className="text-center mb-12">
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="text-4xl font-bold text-gray-900 mb-4"
              >
                How It Works
              </motion.h2>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg text-gray-600 max-w-2xl mx-auto"
              >
                Join our lifesaving community in three simple steps
              </motion.p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connecting Line */}
              <div className="hidden md:block absolute top-1/4 left-1/6 right-1/6 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 -translate-y-1/2 z-0" />

              {processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="relative z-10"
                >
                  <div className="text-center">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={`w-20 h-20 mb-6 mx-auto rounded-full bg-gradient-to-br ${step.gradient} flex items-center justify-center text-white relative`}
                    >
                      <div className="text-2xl font-bold">{step.step}</div>
                      <motion.div
                        className="absolute inset-0 rounded-full border-4 border-white/30"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                      />
                    </motion.div>

                    <div className="flex items-center justify-center mb-3">
                      {step.icon}
                      <h3 className="text-xl font-bold text-gray-900 ml-2">{step.title}</h3>
                    </div>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 100 }}
          className="text-center"
        >
          <div className="bg-gradient-to-r from-red-50 via-pink-50 to-red-50 rounded-3xl p-12 relative overflow-hidden">
            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-red-300 to-pink-300"
                  initial={{ y: 0, x: Math.random() * 100 + '%' }}
                  animate={{
                    y: [0, -100, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut"
                  }}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: '100%'
                  }}
                />
              ))}
            </div>

            <div className="relative">
              <div className="flex items-center justify-center space-x-2 mb-6">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ rotate: [0, 10, -10, 0], y: [0, -5, 0] }}
                    transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                  >
                    <Star className="w-8 h-8 text-yellow-500 fill-current" />
                  </motion.div>
                ))}
              </div>

              <motion.h3
                className="text-4xl font-bold text-gray-900 mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                Ready to Make a Difference?
              </motion.h3>

              <motion.p
                className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                Join thousands of donors who have saved lives through our platform
              </motion.p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 15px 40px rgba(220, 38, 38, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white font-bold rounded-xl shadow-xl shadow-red-200 hover:shadow-2xl hover:shadow-red-300 transition-all"
                >
                  Become a Lifesaver
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, borderColor: "#fca5a5", backgroundColor: "#fef2f2" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-red-300 transition-all"
                >
                  Learn More
                </motion.button>
              </div>

              <motion.p
                className="text-sm text-gray-500 mt-6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                Registration takes less than 5 minutes
              </motion.p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="border-t border-gray-100 py-8 bg-white"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center text-gray-600">
            <p>© 2024 RedDrop. All rights reserved.</p>
            <p className="text-sm mt-2">A platform dedicated to saving lives through blood donation</p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default WelcomePage;