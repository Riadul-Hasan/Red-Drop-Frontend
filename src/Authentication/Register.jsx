





import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  User,
  Mail,
  Lock,
  Droplet,
  Phone,
  MapPin,
  Navigation,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Heart,
  ShieldCheck,
  Zap,
  Users,
  Activity,
  Eye,
  EyeOff,
  Sparkles,
  Globe,
  Target
} from "lucide-react";

const MySwal = withReactContent(Swal);

// Register GSAP
if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

// Get CSRF token
function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === name) return decodeURIComponent(value);
  }
  return null;
}

// Animated blood cell component
const BloodCell = ({ delay = 0 }) => {
  return (
    <motion.div
      className="absolute w-4 h-4 bg-gradient-to-br from-rose-400/30 to-pink-400/20 rounded-full blur-sm"
      initial={{
        x: Math.random() * 100,
        y: Math.random() * 100,
        scale: 0,
      }}
      animate={{
        x: [null, Math.random() * 100 - 50],
        y: [null, Math.random() * 100 - 50],
        scale: [0, 1, 0.8, 1],
      }}
      transition={{
        x: {
          duration: 8 + Math.random() * 4,
          repeat: Infinity,
          repeatType: "reverse",
          delay,
        },
        y: {
          duration: 6 + Math.random() * 3,
          repeat: Infinity,
          repeatType: "reverse",
          delay,
        },
        scale: {
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          repeatType: "reverse",
          delay,
        },
      }}
    />
  );
};

// Password strength indicator
const PasswordStrength = ({ strength }) => {
  const getColor = (strength) => {
    if (strength < 30) return { bg: "bg-red-400", text: "text-red-400" };
    if (strength < 60) return { bg: "bg-yellow-400", text: "text-yellow-400" };
    if (strength < 80) return { bg: "bg-blue-400", text: "text-blue-400" };
    return { bg: "bg-emerald-500", text: "text-emerald-500" };
  };

  const getLabel = (strength) => {
    if (strength < 30) return "Weak";
    if (strength < 60) return "Fair";
    if (strength < 80) return "Good";
    return "Strong";
  };

  const color = getColor(strength);

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-gray-600">Password strength</span>
        <span className={`text-xs font-bold ${color.text}`}>{getLabel(strength)}</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${color.bg}`}
          initial={{ width: "0%" }}
          animate={{ width: `${strength}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

// Blood type selector

const BloodTypeButton = ({ type, selected, onClick }) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative z-0 py-3 rounded-xl text-sm font-semibold transition-all ${selected
        ? 'text-white shadow-lg'
        : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
        }`}
    >
      {selected && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl -z-10"
          layoutId="bloodTypeBg"
          initial={false}
        />
      )}

      <span className="relative z-10">{type}</span>

      {selected && (
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <div className="w-full h-full bg-emerald-400 rounded-full animate-ping" />
        </motion.div>
      )}
    </motion.button>
  );
};


function Register() {
  const navigate = useNavigate();
  const containerRef = useRef();
  const formRef = useRef();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationName, setLocationName] = useState("");
  const [activeInput, setActiveInput] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    blood_group: "",
    phone: "",
    detailed_address: "",
    latitude: "",
    longitude: "",
  });

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  // Password strength calculation
  const [passwordStrength, setPasswordStrength] = useState(0);
  useEffect(() => {
    let strength = 0;
    if (formData.password.length >= 8) strength += 25;
    if (/[A-Z]/.test(formData.password)) strength += 25;
    if (/[0-9]/.test(formData.password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength += 25;
    setPasswordStrength(strength);
  }, [formData.password]);

  // Initialize animations
  useGSAP(() => {
    // Container entrance
    gsap.from(containerRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 1,
      ease: "power2.out",
    });

    // Step indicator animation
    gsap.from(".step-indicator", {
      width: 0,
      duration: 1,
      ease: "power2.out",
      stagger: 0.2,
      delay: 0.3,
    });

  }, []);

  // Show success toast
  const showSuccess = (message) => {
    MySwal.fire({
      icon: 'success',
      title: <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-emerald-600"
      >
        <Heart className="w-12 h-12 mx-auto mb-4" />
        <h3 className="text-xl font-bold">{message}</h3>
      </motion.div>,
      showConfirmButton: false,
      timer: 3000,
      background: '#f0fdf4',
      color: '#065f46',
      backdrop: `
        rgba(0, 0, 0, 0.4)
        url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 40a20 20 0 1 1 0-40 20 20 0 0 1 0 40zm0-4a16 16 0 1 0 0-32 16 16 0 0 0 0 32z' fill='%2310b981' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")
        left top
        repeat
      `,
      customClass: {
        popup: 'rounded-2xl border border-emerald-200 shadow-2xl',
      },
    });
  };

  // Show error toast
  const showError = (message) => {
    MySwal.fire({
      icon: 'error',
      title: <motion.div
        initial={{ x: [-10, 10, -10, 0] }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5 }}
        className="text-rose-600"
      >
        <AlertCircle className="w-12 h-12 mx-auto mb-4" />
        <h3 className="text-xl font-bold">{message}</h3>
      </motion.div>,
      showConfirmButton: false,
      timer: 4000,
      background: '#fef2f2',
      color: '#991b1b',
      customClass: {
        popup: 'rounded-2xl border border-rose-200 shadow-2xl',
      },
    });
  };

  // Show info toast
  const showInfo = (message) => {
    MySwal.fire({
      icon: 'info',
      title: <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 0.5 }}
        className="text-blue-600"
      >
        <ShieldCheck className="w-12 h-12 mx-auto mb-4" />
        <h3 className="text-xl font-bold">{message}</h3>
      </motion.div>,
      showConfirmButton: false,
      timer: 3000,
      background: '#eff6ff',
      color: '#1e40af',
      customClass: {
        popup: 'rounded-2xl border border-blue-200 shadow-2xl',
      },
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBloodTypeSelect = (type) => {
    setFormData(prev => ({ ...prev, blood_group: type }));

    // Celebration effect for blood type selection
    const button = document.querySelector(`button[data-blood-type="${type}"]`);
    if (button) {
      gsap.fromTo(button,
        { scale: 0.8, boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.7)' },
        {
          scale: 1,
          boxShadow: '0 0 0 10px rgba(239, 68, 68, 0)',
          duration: 0.5,
          ease: "back.out(1.7)"
        }
      );
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      showError("Geolocation is not supported by your browser");
      return;
    }

    setLoadingLocation(true);
    showInfo("Detecting your location...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);

        setFormData(prev => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));

        // Reverse geocoding
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await response.json();
          setLocationName(data.display_name || "Location detected");

          // Animate success
          gsap.fromTo(".location-success",
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
          );

          showSuccess("Location detected successfully!");
        } catch (error) {
          console.error("Geocoding error:", error);
        }

        setLoadingLocation(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLoadingLocation(false);
        showError("Unable to retrieve location. Please enable location services.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Step validation
  const validateStep1 = () => {
    return formData.username && formData.email && formData.password && formData.blood_group;
  };

  const validateStep2 = () => {
    return formData.phone && formData.detailed_address;
  };

  const handleNextStep = () => {
    if (!validateStep1()) {
      showError("Please fill all required fields in Step 1");
      return;
    }

    // Animate step transition
    gsap.to(".step-1", {
      opacity: 0,
      x: -50,
      duration: 0.3,
      onComplete: () => {
        setCurrentStep(2);
        setTimeout(() => {
          gsap.fromTo(".step-2",
            { opacity: 0, x: 50 },
            { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
          );
        }, 50);
      }
    });
  };

  const handlePrevStep = () => {
    gsap.to(".step-2", {
      opacity: 0,
      x: 50,
      duration: 0.3,
      onComplete: () => {
        setCurrentStep(1);
        setTimeout(() => {
          gsap.fromTo(".step-1",
            { opacity: 0, x: -50 },
            { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
          );
        }, 50);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep2()) {
      showError("Please fill all contact information fields");
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      };

      const csrfToken = getCookie("csrftoken");
      const headers = {
        "Content-Type": "application/json",
      };

      if (csrfToken) {
        headers["X-CSRFToken"] = csrfToken;
      }

      const res = await fetch("http://localhost:8000/api/signup/", {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Server error:", text);
        showError("Server error occurred. Please try again.");
        setIsLoading(false);
        return;
      }

      if (res.ok) {

        Swal.fire({
          title: '<span style="font-family: Poppins; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: -0.01em;">Artery Established</span>',
          html: '<div style="font-family: Poppins; font-weight: 600; color: #64748b; font-size: 14px; margin-top: 8px;">Account created. You are now part of the life-saving network.</div>',
          icon: 'success',
          iconColor: '#dc2626', // Brand Artery Red
          timer: 2500,
          timerProgressBar: true,
          showConfirmButton: false,
          background: '#ffffff',
          width: '420px',
          padding: '2.5rem',
          confirmButtonColor: '#dc2626',
        });

        // Success animation
        const successTimeline = gsap.timeline();

        // Celebrate with particles
        for (let i = 0; i < 20; i++) {
          const particle = document.createElement('div');
          particle.className = 'celebration-particle';
          particle.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: linear-gradient(45deg, #ef4444, #ec4899);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            left: 50%;
            top: 50%;
          `;
          document.body.appendChild(particle);

          successTimeline.to(particle, {
            x: (Math.random() - 0.5) * 300,
            y: (Math.random() - 0.5) * 300,
            opacity: 0,
            scale: 0,
            duration: 1.5,
            ease: "power2.out",
            onComplete: () => particle.remove(),
          }, "<");
        }

        // Show success message
        MySwal.fire({
          title: <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 1, ease: "linear" }}
              className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h3>
            <p className="text-gray-600">OTP has been sent to your email</p>
          </motion.div>,
          showConfirmButton: true,
          confirmButtonText: "Verify OTP",
          confirmButtonColor: "#ef4444",
          background: "#ffffff",
          backdrop: `
            rgba(0, 0, 0, 0.4)
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ef4444' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
            left top
            repeat
          `,
          customClass: {
            popup: 'rounded-3xl border border-gray-200 shadow-2xl',
            confirmButton: 'px-8 py-3 rounded-xl font-semibold',
          },
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/verify-otp", { state: { email: formData.email } });
          }
        });

      } else {
        showError(data.error || "Registration failed. Please check your information.");
      }
    } catch (err) {
      console.error(err);
      showError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Background Blood Cells */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <BloodCell key={i} delay={i * 0.2} />
        ))}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-rose-100/20 to-pink-100/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-rose-100/20 to-pink-100/20 rounded-full blur-3xl" />
      </div>

      <div ref={containerRef} className="relative min-h-screen flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-5 gap-6 lg:gap-8">
            {/* Left Panel - Hero */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <div className="bg-gradient-to-br from-rose-50 to-white rounded-3xl p-6 md:p-8 border border-rose-100 shadow-xl h-full">
                {/* Logo & Progress */}
                <div className="space-y-8">
                  {/* Logo */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="flex items-center space-x-4"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="relative"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-rose-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-500/30">
                        <Droplet className="w-8 h-8 text-white" />
                      </div>
                      <motion.div
                        className="absolute -inset-2 bg-gradient-to-r from-rose-600 to-pink-600 rounded-2xl blur opacity-20"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 0.5 }}
                      />
                    </motion.div>
                    <div>
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 via-rose-700 to-pink-600 bg-clip-text text-transparent">
                        RedDrop
                      </h1>
                      <p className="text-gray-600">Life Saving Network</p>
                    </div>
                  </motion.div>

                  {/* Progress Steps */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">Step {currentStep} of 2</span>
                        <span className="text-sm font-medium text-rose-600">
                          {currentStep === 1 ? "Personal Info" : "Contact Details"}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-rose-500 to-pink-500"
                          initial={{ width: currentStep === 1 ? "50%" : "100%" }}
                          animate={{ width: currentStep === 1 ? "50%" : "100%" }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>

                    {/* Step Indicators */}
                    <div className="flex space-x-2">
                      <motion.div
                        className={`step-indicator h-1 rounded-full ${currentStep >= 1 ? 'bg-rose-500' : 'bg-gray-300'}`}
                        style={{ flex: currentStep >= 1 ? 1 : 0.5 }}
                      />
                      <motion.div
                        className={`step-indicator h-1 rounded-full ${currentStep >= 2 ? 'bg-rose-500' : 'bg-gray-300'}`}
                        style={{ flex: currentStep >= 2 ? 1 : 0.5 }}
                      />
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center space-x-3 p-3 bg-white/80 rounded-xl border border-rose-100"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-rose-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Join 25K+ Lifesavers</p>
                        <p className="text-sm text-gray-600">Active community</p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center space-x-3 p-3 bg-white/80 rounded-xl border border-rose-100"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-rose-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">HIPAA Compliant</p>
                        <p className="text-sm text-gray-600">Bank-level security</p>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-center space-x-3 p-3 bg-white/80 rounded-xl border border-rose-100"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-rose-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Quick Registration</p>
                        <p className="text-sm text-gray-600">Under 2 minutes</p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Impact Stats */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-4 border border-rose-200"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <Activity className="w-5 h-5 text-rose-600" />
                      <h3 className="font-semibold text-gray-900">Real-time Impact</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Lives Saved Today</span>
                        <span className="font-bold text-rose-600">42</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Active Donors</span>
                        <span className="font-bold text-rose-600">25,327+</span>
                      </div>
                    </div>

                    {/* ECG Animation */}
                    <div className="mt-3 relative h-1 overflow-hidden rounded-full bg-rose-100">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="absolute h-full bg-gradient-to-r from-rose-500 to-pink-500"
                          style={{ left: `${i * 33}%`, width: "33%" }}
                          initial={{ x: "-100%" }}
                          animate={{ x: "400%" }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Right Panel - Registration Form */}
            <motion.div
              ref={formRef}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-3xl shadow-2xl shadow-rose-500/10 p-6 md:p-8 border border-gray-100 h-full">
                <div className="max-w-lg mx-auto">
                  {/* Form Header */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {currentStep === 1 ? "Create Your Account" : "Contact Information"}
                        </h2>
                        <p className="text-gray-600 mt-1">
                          {currentStep === 1
                            ? "Join our community of lifesavers in less than 2 minutes"
                            : "Help us match you with nearby urgent requests"}
                        </p>
                      </div>
                      <motion.div
                        animate={{ rotate: currentStep === 1 ? [0, 10, 0] : [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Sparkles className="w-8 h-8 text-rose-400" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Form Steps */}
                  <form onSubmit={handleSubmit}>
                    <AnimatePresence mode="wait">
                      {currentStep === 1 ? (
                        <motion.div
                          key="step-1"
                          className="step-1 space-y-6"
                          initial={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                        >
                          {/* Username & Email */}
                          <div className="grid md:grid-cols-2 gap-4">
                            <motion.div
                              animate={{
                                borderColor: activeInput === 'username' ? '#ef4444' : '#e5e7eb',
                                scale: activeInput === 'username' ? 1.02 : 1
                              }}
                              className="relative group rounded-2xl border-2 transition-all duration-300"
                            >
                              <label className="block text-sm font-medium text-gray-700 mb-2 px-4 pt-4">
                                Username
                              </label>
                              <div className="relative px-4 pb-4">
                                <motion.div
                                  animate={{
                                    x: activeInput === 'username' ? 5 : 0,
                                    scale: activeInput === 'username' ? 1.1 : 1
                                  }}
                                  className="absolute left-4 top-1/2 -translate-y-1/2"
                                >
                                  <User className="w-5 h-5 text-gray-400 group-hover:text-rose-500 transition-colors" />
                                </motion.div>
                                <input
                                  type="text"
                                  name="username"
                                  value={formData.username}
                                  onChange={handleInputChange}
                                  onFocus={() => setActiveInput('username')}
                                  onBlur={() => setActiveInput(null)}
                                  className="w-full pl-12 pr-4 py-3 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-sm"
                                  placeholder="Choose username"
                                  required
                                />
                              </div>
                            </motion.div>

                            <motion.div
                              animate={{
                                borderColor: activeInput === 'email' ? '#ef4444' : '#e5e7eb',
                                scale: activeInput === 'email' ? 1.02 : 1
                              }}
                              className="relative group rounded-2xl border-2 transition-all duration-300"
                            >
                              <label className="block text-sm font-medium text-gray-700 mb-2 px-4 pt-4">
                                Email Address
                              </label>
                              <div className="relative px-4 pb-4">
                                <motion.div
                                  animate={{
                                    x: activeInput === 'email' ? 5 : 0,
                                    scale: activeInput === 'email' ? 1.1 : 1
                                  }}
                                  className="absolute left-4 top-1/2 -translate-y-1/2"
                                >
                                  <Mail className="w-5 h-5 text-gray-400 group-hover:text-rose-500 transition-colors" />
                                </motion.div>
                                <input
                                  type="email"
                                  name="email"
                                  value={formData.email}
                                  onChange={handleInputChange}
                                  onFocus={() => setActiveInput('email')}
                                  onBlur={() => setActiveInput(null)}
                                  className="w-full pl-12 pr-4 py-3 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-sm"
                                  placeholder="your@email.com"
                                  required
                                />
                              </div>
                            </motion.div>
                          </div>

                          {/* Password */}
                          <motion.div
                            animate={{
                              borderColor: activeInput === 'password' ? '#ef4444' : '#e5e7eb',
                              scale: activeInput === 'password' ? 1.02 : 1
                            }}
                            className="relative group rounded-2xl border-2 transition-all duration-300"
                          >
                            <label className="block text-sm font-medium text-gray-700 mb-2 px-4 pt-4">
                              Password
                            </label>
                            <div className="relative px-4 pb-4">
                              <motion.div
                                animate={{
                                  rotate: activeInput === 'password' ? [0, 10, 0] : 0,
                                  scale: activeInput === 'password' ? 1.1 : 1
                                }}
                                transition={{ rotate: { duration: 0.5 } }}
                                className="absolute left-4 top-1/2 -translate-y-1/2"
                              >
                                <Lock className="w-5 h-5 text-gray-400 group-hover:text-rose-500 transition-colors" />
                              </motion.div>
                              <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                onFocus={() => setActiveInput('password')}
                                onBlur={() => setActiveInput(null)}
                                className="w-full pl-12 pr-12 py-3 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-sm"
                                placeholder="Create secure password"
                                required
                              />
                              <motion.button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-500 transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </motion.button>
                            </div>
                            {formData.password && <PasswordStrength strength={passwordStrength} />}
                          </motion.div>

                          {/* Blood Type */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                              Blood Type
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                              {bloodGroups.map((type) => (
                                <BloodTypeButton
                                  key={type}
                                  type={type}
                                  selected={formData.blood_group === type}
                                  onClick={() => handleBloodTypeSelect(type)}
                                  data-blood-type={type}
                                />
                              ))}
                            </div>
                          </div>

                          {/* Next Button */}
                          <motion.button
                            type="button"
                            onClick={handleNextStep}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={!validateStep1()}
                            className={`w-full relative overflow-hidden group rounded-2xl py-4 font-semibold ${validateStep1()
                              ? 'text-white shadow-lg shadow-rose-200'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              }`}
                          >
                            {validateStep1() && (
                              <>
                                <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl" />
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-rose-600 to-pink-600 rounded-2xl"
                                  initial={{ x: "-100%" }}
                                  whileHover={{ x: "0%" }}
                                  transition={{ duration: 0.5 }}
                                />
                              </>
                            )}
                            <div className="relative z-10 flex items-center justify-center space-x-2">
                              <span>Continue to Contact Details</span>
                              <ArrowRight className="w-5 h-5" />
                            </div>
                          </motion.button>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="step-2"
                          className="step-2 space-y-6"
                          initial={{ opacity: 0, x: 50 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 50 }}
                        >
                          {/* Phone Number */}
                          <motion.div
                            animate={{
                              borderColor: activeInput === 'phone' ? '#ef4444' : '#e5e7eb',
                              scale: activeInput === 'phone' ? 1.02 : 1
                            }}
                            className="relative group rounded-2xl border-2 transition-all duration-300"
                          >
                            <label className="block text-sm font-medium text-gray-700 mb-2 px-4 pt-4">
                              Phone Number
                            </label>
                            <div className="relative px-4 pb-4">
                              <motion.div
                                animate={{
                                  x: activeInput === 'phone' ? 5 : 0,
                                  scale: activeInput === 'phone' ? 1.1 : 1
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2"
                              >
                                <Phone className="w-5 h-5 text-gray-400 group-hover:text-rose-500 transition-colors" />
                              </motion.div>
                              <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                onFocus={() => setActiveInput('phone')}
                                onBlur={() => setActiveInput(null)}
                                className="w-full pl-12 pr-4 py-3 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-sm"
                                placeholder="+1 234 567 8900"
                                required
                              />
                            </div>
                          </motion.div>

                          {/* Address */}
                          <motion.div
                            animate={{
                              borderColor: activeInput === 'detailed_address' ? '#ef4444' : '#e5e7eb',
                              scale: activeInput === 'detailed_address' ? 1.02 : 1
                            }}
                            className="relative group rounded-2xl border-2 transition-all duration-300"
                          >
                            <label className="block text-sm font-medium text-gray-700 mb-2 px-4 pt-4">
                              Detailed Address
                            </label>
                            <div className="relative px-4 pb-4">
                              <motion.div
                                animate={{
                                  x: activeInput === 'detailed_address' ? 5 : 0,
                                  scale: activeInput === 'detailed_address' ? 1.1 : 1
                                }}
                                className="absolute left-4 top-4"
                              >
                                <MapPin className="w-5 h-5 text-gray-400 group-hover:text-rose-500 transition-colors" />
                              </motion.div>
                              <textarea
                                name="detailed_address"
                                value={formData.detailed_address}
                                onChange={handleInputChange}
                                onFocus={() => setActiveInput('detailed_address')}
                                onBlur={() => setActiveInput(null)}
                                className="w-full pl-12 pr-4 py-3 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none text-sm min-h-[100px] resize-none"
                                placeholder="Full address for emergency matching"
                                required
                              />
                            </div>
                          </motion.div>

                          {/* Location Section */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-1">Location Coordinates</h3>
                                <p className="text-xs text-gray-500">For urgent request matching</p>
                              </div>
                              <motion.button
                                type="button"
                                onClick={getCurrentLocation}
                                disabled={loadingLocation}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-2 bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 text-sm font-medium rounded-lg hover:from-rose-100 hover:to-pink-100 transition-all flex items-center space-x-2 border border-rose-200"
                              >
                                {loadingLocation ? (
                                  <>
                                    <motion.div
                                      className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full"
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                    <span>Detecting...</span>
                                  </>
                                ) : (
                                  <>
                                    <Navigation className="w-4 h-4" />
                                    <span>Use Current Location</span>
                                  </>
                                )}
                              </motion.button>
                            </div>

                            {/* Coordinates Inputs */}
                            <div className="grid md:grid-cols-2 gap-3">
                              <div>
                                <input
                                  type="number"
                                  step="any"
                                  name="latitude"
                                  placeholder="Latitude"
                                  value={formData.latitude}
                                  onChange={handleInputChange}
                                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition-all text-sm"
                                />
                              </div>
                              <div>
                                <input
                                  type="number"
                                  step="any"
                                  name="longitude"
                                  placeholder="Longitude"
                                  value={formData.longitude}
                                  onChange={handleInputChange}
                                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-100 transition-all text-sm"
                                />
                              </div>
                            </div>

                            {/* Location Success */}
                            <AnimatePresence>
                              {locationName && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="location-success p-3 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl">
                                    <div className="flex items-center space-x-2">
                                      <Target className="w-4 h-4 text-emerald-600" />
                                      <p className="text-emerald-800 text-sm font-medium">📍 {locationName}</p>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Info Box */}
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl"
                            >
                              <div className="flex items-start space-x-2">
                                <Globe className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <p className="text-blue-700 text-xs">
                                  Location helps match you with emergency blood requests nearby. This information is encrypted and secure.
                                </p>
                              </div>
                            </motion.div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3 pt-4">
                            <motion.button
                              type="button"
                              onClick={handlePrevStep}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex-1 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
                            >
                              <ArrowLeft className="w-5 h-5" />
                              <span>Back</span>
                            </motion.button>

                            <motion.button
                              type="submit"
                              disabled={!validateStep2() || isLoading}
                              whileHover={{ scale: validateStep2() && !isLoading ? 1.02 : 1 }}
                              whileTap={{ scale: validateStep2() && !isLoading ? 0.98 : 1 }}
                              className={`flex-1 relative overflow-hidden group rounded-2xl py-4 font-semibold ${validateStep2() && !isLoading
                                ? 'text-white shadow-lg shadow-rose-200'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                              {validateStep2() && !isLoading && (
                                <>
                                  <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl" />
                                  <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-rose-600 to-pink-600 rounded-2xl"
                                    initial={{ x: "-100%" }}
                                    whileHover={{ x: "0%" }}
                                    transition={{ duration: 0.5 }}
                                  />
                                  {isLoading && (
                                    <motion.div
                                      className="absolute inset-0 bg-gradient-to-r from-rose-400 to-pink-400 rounded-2xl"
                                      animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                                      transition={{ duration: 1.5, repeat: Infinity }}
                                    />
                                  )}
                                </>
                              )}
                              <div className="relative z-10 flex items-center justify-center space-x-2">
                                {isLoading ? (
                                  <>
                                    <motion.div
                                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    />
                                    <span>Registering...</span>
                                  </>
                                ) : (
                                  <>
                                    <span>Complete Registration</span>
                                    <CheckCircle className="w-5 h-5" />
                                  </>
                                )}
                              </div>
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>

                  {/* Login Link */}
                  <motion.div
                    className="mt-8 pt-6 border-t border-gray-200 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <p className="text-gray-600 text-sm">
                      Already have an account?{" "}
                      <motion.button
                        onClick={() => navigate('/login')}
                        className="text-rose-600 hover:text-rose-700 font-semibold relative inline-flex items-center group"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="relative z-10">Sign In</span>
                        <motion.span
                          className="absolute -inset-1 bg-rose-100 rounded-lg -z-10 opacity-0 group-hover:opacity-100"
                          initial={{ scale: 0 }}
                          whileHover={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        />
                      </motion.button>
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Celebration Particles Styles */}
      <style jsx>{`
        .celebration-particle {
          pointer-events: none;
          z-index: 10000;
        }
        
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
}

export default Register;








