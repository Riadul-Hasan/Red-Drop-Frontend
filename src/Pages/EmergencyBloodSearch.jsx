



import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    MapPin,
    Users,
    Heart,
    Navigation,
    Phone,
    Mail,
    AlertCircle,
    CheckCircle,
    ChevronRight,
    User,
    Loader2,
    Bell,
    Send,
    Shield,
    ChevronDown,
    FileText,
    Hospital,
    XCircle,
    Map,
    Calendar,
    Clock,
    User as UserIcon,
    ArrowRight,
    ArrowLeft,
    Activity,
    Target,
    MapIcon,
    Zap
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Get CSRF token helper
const getCSRFToken = () => {
    const name = 'csrftoken';
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

// Custom icons
const createCustomIcon = (color, iconType = 'user') => {
    const iconHtml = `
    <div style="
      background: ${color};
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 3px 10px rgba(0,0,0,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 16px;
      font-weight: bold;
      z-index: 1000;
    ">
      ${iconType === 'donor' ? '🧬' : '📍'}
    </div>
  `;

    return L.divIcon({
        html: iconHtml,
        className: 'custom-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36]
    });
};

// Component to update map center
const UpdateMapCenter = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, zoom);
        }
    }, [center, zoom, map]);
    return null;
};

// Component to handle map interactions during modal
const MapBlocker = ({ showConfirmation }) => {
    const map = useMap();

    useEffect(() => {
        if (showConfirmation) {
            // Disable map interactions when modal is open
            map.dragging.disable();
            map.touchZoom.disable();
            map.doubleClickZoom.disable();
            map.scrollWheelZoom.disable();
            map.boxZoom.disable();
            map.keyboard.disable();

            // Close all popups
            map.closePopup();
        } else {
            // Re-enable map interactions
            map.dragging.enable();
            map.touchZoom.enable();
            map.doubleClickZoom.enable();
            map.scrollWheelZoom.enable();
            map.boxZoom.enable();
            map.keyboard.enable();
        }

        return () => {
            // Cleanup - re-enable interactions
            map.dragging.enable();
            map.touchZoom.enable();
            map.doubleClickZoom.enable();
            map.scrollWheelZoom.enable();
            map.boxZoom.enable();
            map.keyboard.enable();
        };
    }, [showConfirmation, map]);

    return null;
};

const EmergencyBloodRequest = () => {
    const [form, setForm] = useState({
        blood_group: '',
        radius: 5,
        detail_address: '',
        description: '',
        urgency: 'normal',
        // Appointment fields (only for normal urgency)
        full_name: '',
        donation_date: '',
        donation_time: '',
        contact_number: '',
        note: ''
    });

    const [donors, setDonors] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false);
    const [sendingRequests, setSendingRequests] = useState(false);
    const [userLocation, setUserLocation] = useState({ lat: 23.8041, lng: 90.4152 });
    const [mapCenter, setMapCenter] = useState([23.8041, 90.4152]);
    const [mapZoom, setMapZoom] = useState(13);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [requestSummary, setRequestSummary] = useState(null);
    const [expandedDonor, setExpandedDonor] = useState(null);
    const [requestStatus, setRequestStatus] = useState({});
    const [currentUserId, setCurrentUserId] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [mapKey, setMapKey] = useState(Date.now());
    const [formStep, setFormStep] = useState(1); // For two-step form

    const mapRef = useRef(null);
    const formRef = useRef(null);

    // Fetch current user and all users
    useEffect(() => {
        const fetchCurrentUserAndAllUsers = async () => {
            try {
                setLoading(true);

                // First, fetch current user
                const currentUserResponse = await fetch('http://localhost:8000/api/current-user/', {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (currentUserResponse.ok) {
                    const currentUserData = await currentUserResponse.json();
                    setCurrentUser(currentUserData);
                    setCurrentUserId(currentUserData.email);

                    // Set user location from current user data
                    if (currentUserData.latitude && currentUserData.longitude) {
                        const lat = parseFloat(currentUserData.latitude);
                        const lng = parseFloat(currentUserData.longitude);
                        setUserLocation({ lat, lng });
                        setMapCenter([lat, lng]);
                    } else {
                        getBrowserLocation();
                    }

                    // Set default full name to current user's name if available
                    if (currentUserData.name) {
                        setForm(prev => ({ ...prev, full_name: currentUserData.name }));
                    }
                } else {
                    getBrowserLocation();
                }

                // Then fetch all users
                const allUsersResponse = await fetch('http://localhost:8000/api/all-users/', {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (allUsersResponse.ok) {
                    const allUsersData = await allUsersResponse.json();

                    // Filter out users without location data
                    const usersWithLocation = allUsersData.filter(user =>
                        user.latitude && user.longitude &&
                        user.latitude !== null && user.longitude !== null &&
                        !isNaN(parseFloat(user.latitude)) && !isNaN(parseFloat(user.longitude))
                    );

                    setAllUsers(usersWithLocation);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
                getBrowserLocation();
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentUserAndAllUsers();
    }, []);

    const getBrowserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setUserLocation(newLocation);
                    setMapCenter([newLocation.lat, newLocation.lng]);
                },
                () => {
                    console.log('Geolocation permission denied');
                }
            );
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleBloodGroupSelect = (group) => {
        setForm({
            ...form,
            blood_group: group
        });
    };

    const handleUrgencyChange = (urgency) => {
        setForm({
            ...form,
            urgency
        });
        setFormStep(1); // Reset to step 1 when urgency changes
    };

    // Calculate distance using Haversine formula
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const validateStep1 = () => {
        if (!form.blood_group) {
            setError('Please select a blood group');
            setTimeout(() => setError(null), 3000);
            return false;
        }

        if (form.urgency === 'normal') {
            if (!form.full_name?.trim()) {
                setError('Please enter full name for appointment');
                setTimeout(() => setError(null), 3000);
                return false;
            }
            if (!form.contact_number) {
                setError('Please enter contact number');
                setTimeout(() => setError(null), 3000);
                return false;
            }
        }

        return true;
    };

    const validateStep2 = () => {
        if (form.urgency === 'normal') {
            if (!form.donation_date) {
                setError('Please select donation date');
                setTimeout(() => setError(null), 3000);
                return false;
            }
            if (!form.donation_time) {
                setError('Please select donation time');
                setTimeout(() => setError(null), 3000);
                return false;
            }
        }

        return true;
    };

    const handleNextStep = () => {
        if (validateStep1()) {
            setFormStep(2);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrevStep = () => {
        setFormStep(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.urgency === 'normal' && formStep === 1) {
            handleNextStep();
            return;
        }

        if (!validateStep2()) {
            return;
        }

        setSearching(true);
        setError(null);
        setSuccess(null);

        try {
            // Filter donors by blood group, distance, AND exclude current user
            const filteredDonors = allUsers.filter(donor => {
                // Skip current logged-in user from donor list
                if (currentUserId && donor.email === currentUserId) {
                    return false;
                }

                if (donor.blood_group !== form.blood_group) return false;

                const distance = calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    parseFloat(donor.latitude),
                    parseFloat(donor.longitude)
                );

                return distance <= form.radius;
            });

            // Add distance to each donor
            const donorsWithDistance = filteredDonors.map(donor => ({
                ...donor,
                distance: calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    parseFloat(donor.latitude),
                    parseFloat(donor.longitude)
                ).toFixed(2)
            }));

            // Sort by distance
            donorsWithDistance.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

            setDonors(donorsWithDistance);

            if (donorsWithDistance.length > 0) {
                setTimeout(() => {
                    setRequestSummary({
                        bloodGroup: form.blood_group,
                        count: donorsWithDistance.length,
                        radius: form.radius,
                        donors: donorsWithDistance,
                        urgency: form.urgency,
                        isEmergency: form.urgency === 'emergency'
                    });
                    setShowConfirmation(true);
                }, 500);
            } else {
                setError(`No ${form.blood_group} donors found within ${form.radius} km radius`);
                setTimeout(() => setError(null), 3000);
            }

        } catch (error) {
            console.error('Error searching donors:', error);
            setError('Error searching donors. Please try again.');
            setTimeout(() => setError(null), 3000);
        } finally {
            setSearching(false);
        }
    };

    const sendEmergencyRequests = async () => {
        if (!requestSummary || !requestSummary.donors.length) return;

        setSendingRequests(true);
        setError(null);

        try {
            const csrfToken = getCSRFToken();

            // Prepare request data based on urgency
            const requestData = {
                blood_group: form.blood_group,
                radius: form.radius,
                detail_address: form.detail_address,
                description: form.description,
                urgency: form.urgency
            };

            // Add appointment fields only for normal urgency
            if (form.urgency === 'normal') {
                requestData.full_name = form.full_name;
                requestData.donation_date = form.donation_date;
                requestData.donation_time = form.donation_time;
                requestData.contact_number = form.contact_number;
                requestData.note = form.note;
            }

            // First, create the main blood request via search-blood API
            const searchResponse = await fetch('http://localhost:8000/api/search-blood/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                credentials: 'include',
                body: JSON.stringify(requestData)
            });

            if (!searchResponse.ok) {
                const errorData = await searchResponse.json();
                throw new Error(errorData.error || 'Failed to create request');
            }

            const searchData = await searchResponse.json();

            // Update donors with request sent status
            const updatedDonors = donors.map(donor => ({
                ...donor,
                requestSent: true,
                requestId: searchData.request_id || Date.now()
            }));

            setDonors(updatedDonors);

            // Update request status for each donor
            const statusUpdates = {};
            updatedDonors.forEach(donor => {
                statusUpdates[donor.id] = { sent: true, time: new Date().toLocaleTimeString() };
            });
            setRequestStatus(statusUpdates);

            // Show success message
            const requestType = form.urgency === 'emergency' ? 'Emergency' : 'Appointment';
            setSuccess({
                title: `${requestType} Requests Sent Successfully!`,
                message: `Requests have been sent to all ${updatedDonors.length} donors.`,
                requestId: searchData.request_id,
                donorCount: updatedDonors.length,
                requestType
            });

            setShowConfirmation(false);
            setFormStep(1);

            // Clear form for next request (keep urgency setting)
            setForm(prev => ({
                ...prev,
                blood_group: '',
                detail_address: '',
                description: '',
                full_name: currentUser?.name || '',
                donation_date: '',
                donation_time: '',
                contact_number: '',
                note: ''
            }));

        } catch (error) {
            console.error('Error sending requests:', error);
            setError(`Failed to send ${form.urgency === 'emergency' ? 'emergency' : 'appointment'} requests: ${error.message}`);
        } finally {
            setSendingRequests(false);
        }
    };

    // Function to handle map click
    const handleMapClick = (e) => {
        if (showConfirmation) return;

        const { lat, lng } = e.latlng;
        setUserLocation({ lat, lng });
        setMapCenter([lat, lng]);
    };

    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

    // Get today's date for date input min value
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="min-h-screen bg-transparent p-2 relative" ref={formRef}>
            <div className="max-w-11xl mx-auto">
                {/* Success Notification */}
                <AnimatePresence>
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-4 relative z-[1001]"
                        >
                            <div className={`bg-gradient-to-r ${success.requestType === 'Emergency' ? 'from-red-50 to-pink-50 border-red-200' : 'from-blue-50 to-cyan-50 border-blue-200'} border rounded-xl p-4 shadow-lg`}>
                                <div className="flex items-start space-x-3">
                                    <div className={`w-10 h-10 ${success.requestType === 'Emergency' ? 'bg-red-100' : 'bg-blue-100'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                        <CheckCircle className={`w-5 h-5 ${success.requestType === 'Emergency' ? 'text-red-600' : 'text-blue-600'}`} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900">{success.title}</h3>
                                        <p className="text-gray-700 text-sm mt-1">{success.message}</p>
                                    </div>
                                    <button
                                        onClick={() => setSuccess(null)}
                                        className="p-1 hover:bg-gray-100 rounded-lg transition"
                                    >
                                        <XCircle className="w-4 h-4 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Error Alert */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-4 relative z-[1001]"
                        >
                            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                                <div className="flex items-center space-x-2">
                                    <AlertCircle className="w-4 h-4 text-red-600" />
                                    <p className="text-red-700 text-sm">{error}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Progress Steps for Normal Appointment */}
                {form.urgency === 'normal' && (
                    <div className="mb-6">
                        <div className="flex items-center justify-center space-x-4">
                            <div className={`flex items-center ${formStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formStep >= 1 ? 'bg-blue-100 border-2 border-blue-600' : 'bg-gray-100 border-2 border-gray-300'}`}>
                                    {formStep > 1 ? <CheckCircle className="w-4 h-4" /> : <span className="text-sm font-bold">1</span>}
                                </div>
                                <span className="ml-2 text-sm font-medium">Basic Info</span>
                            </div>
                            <div className={`h-1 w-16 ${formStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                            <div className={`flex items-center ${formStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${formStep >= 2 ? 'bg-blue-100 border-2 border-blue-600' : 'bg-gray-100 border-2 border-gray-300'}`}>
                                    <span className="text-sm font-bold">2</span>
                                </div>
                                <span className="ml-2 text-sm font-medium">Appointment Details</span>
                            </div>
                        </div>
                    </div>
                )}


                {/* form change will placed there */}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-10"
                >
                    {/* --- LEFT COLUMN: CLINICAL CONTROL PANEL --- */}
                    <motion.div
                        className="lg:col-span-1 space-y-4"
                        initial={{ x: -20 }}
                        animate={{ x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {/* CONFIGURATION CARD */}
                        <div className="bg-white/80 backdrop-blur-2xl rounded-xl shadow-lg border border-white overflow-hidden p-5">
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`w-11 h-11 rounded-lg flex items-center justify-center shadow-lg ${form.urgency === 'emergency' ? 'bg-red-600 shadow-red-200' : 'bg-slate-950 shadow-slate-200'
                                    }`}>
                                    {form.urgency === 'emergency' ? (
                                        <Heart className="w-6 h-6 text-white fill-current" />
                                    ) : (
                                        <Calendar className="w-6 h-6 text-white" />
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-950 leading-none uppercase tracking-tighter">
                                        {form.urgency === 'emergency' ? 'Emergency' : 'Schedule'}
                                    </h2>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                        Artery Mode
                                    </p>
                                </div>
                            </div>

                            {/* URGENCY TOGGLE */}
                            <div className="flex bg-slate-100 rounded-lg p-1 mb-6 border border-slate-200/50">
                                <button
                                    onClick={() => handleUrgencyChange('normal')}
                                    className={`flex-1 py-2 rounded text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-2 ${form.urgency === 'normal'
                                        ? 'bg-white text-slate-950 shadow-sm border border-slate-200'
                                        : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    <Calendar size={14} /> Normal
                                </button>
                                <button
                                    onClick={() => handleUrgencyChange('emergency')}
                                    className={`flex-1 py-2 rounded text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-2 ${form.urgency === 'emergency'
                                        ? 'bg-red-600 text-white shadow-lg shadow-red-100'
                                        : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    <AlertCircle size={14} /> Urgent
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* BLOOD GROUP SELECTION */}
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                                        Target Blood Group *
                                    </label>
                                    <div className="grid grid-cols-4 gap-1.5">
                                        {bloodGroups.map(group => (
                                            <motion.button
                                                key={group}
                                                type="button"
                                                onClick={() => handleBloodGroupSelect(group)}
                                                whileTap={{ scale: 0.95 }}
                                                className={`py-2 rounded-lg text-xs font-bold transition-all border ${form.blood_group === group
                                                    ? (form.urgency === 'emergency' ? 'bg-red-600 border-red-600 text-white shadow-md' : 'bg-slate-950 border-slate-950 text-white shadow-md')
                                                    : 'bg-white border-slate-200 text-slate-950 hover:border-red-400'
                                                    }`}
                                            >
                                                {group}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                {/* FORM STEPS */}
                                <AnimatePresence mode="wait">
                                    {formStep === 1 && (
                                        <motion.div
                                            key="step1"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            className="space-y-4"
                                        >
                                            {/* RADIUS SELECTOR */}
                                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Search Radius</span>
                                                    <span className="text-xs font-bold text-slate-950">{form.radius} KM</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    name="radius"
                                                    min="1" max="50" step="1"
                                                    value={form.radius}
                                                    onChange={handleChange}
                                                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                                                />
                                            </div>

                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Sector Address</label>
                                                    <input
                                                        type="text"
                                                        name="detail_address"
                                                        value={form.detail_address}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:border-red-600 outline-none text-sm font-bold text-slate-950 transition-all"
                                                        placeholder="Hospital, area..."
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Diagnostic Note</label>
                                                    <textarea
                                                        name="description"
                                                        value={form.description}
                                                        onChange={handleChange}
                                                        rows="2"
                                                        className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:border-red-600 outline-none text-sm font-bold text-slate-950 transition-all resize-none"
                                                        placeholder="Enter details..."
                                                    />
                                                </div>

                                                {form.urgency === 'normal' && (
                                                    <>
                                                        <input
                                                            type="text"
                                                            name="full_name"
                                                            value={form.full_name}
                                                            onChange={handleChange}
                                                            required
                                                            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-950 outline-none focus:border-red-600"
                                                            placeholder="Patient Full Name *"
                                                        />
                                                        <input
                                                            type="number"
                                                            name="contact_number"
                                                            value={form.contact_number}
                                                            onChange={handleChange}
                                                            required
                                                            className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-950 outline-none focus:border-red-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                            placeholder="Phone Number (Digits) *"
                                                        />
                                                    </>
                                                )}
                                            </div>

                                            <motion.button
                                                type={form.urgency === 'normal' ? "button" : "submit"}
                                                onClick={form.urgency === 'normal' ? handleNextStep : undefined}
                                                whileTap={{ scale: 0.98 }}
                                                disabled={!form.blood_group || searching || loading}
                                                className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${!form.blood_group
                                                    ? 'bg-slate-100 text-slate-400'
                                                    : (form.urgency === 'emergency' ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-950 text-white')
                                                    }`}
                                            >
                                                {searching ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
                                                {form.urgency === 'normal' ? "Schedule Feed" : "Initiate Broadcast"}
                                            </motion.button>
                                        </motion.div>
                                    )}

                                    {/* STEP 2: SCHEDULE (FOR NORMAL) */}
                                    {formStep === 2 && form.urgency === 'normal' && (
                                        <motion.div
                                            key="step2"
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="space-y-4"
                                        >
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Date</label>
                                                    <input
                                                        type="date"
                                                        name="donation_date"
                                                        value={form.donation_date}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-950 outline-none focus:border-red-600"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Time</label>
                                                    <input
                                                        type="time"
                                                        name="donation_time"
                                                        value={form.donation_time}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-950 outline-none focus:border-red-600"
                                                    />
                                                </div>
                                            </div>
                                            <textarea
                                                name="note"
                                                value={form.note}
                                                onChange={handleChange}
                                                rows="2"
                                                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-950 outline-none focus:border-red-600 resize-none"
                                                placeholder="Special Artery notes..."
                                            />
                                            <div className="flex gap-2">
                                                <button onClick={handlePrevStep} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-lg font-bold text-[10px] uppercase tracking-widest">Back</button>
                                                <button type="submit" className="flex-[2] py-3 bg-slate-950 text-white rounded-lg font-bold text-[10px] uppercase tracking-widest shadow-lg">Finalize Hub</button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </form>
                        </div>

                        {/* QUICK STATS PANEL */}
                        <div className="bg-slate-950 rounded-xl p-5 text-white shadow-xl relative overflow-hidden border border-slate-800">
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
                                    <Activity className="w-4 h-4 text-red-600" />
                                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Artery Pulse</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500 font-bold uppercase">Matched Group</span>
                                        <span className="font-bold text-red-500">{form.blood_group || '—'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500 font-bold uppercase">Search Radius</span>
                                        <span className="font-bold text-white">{form.radius} KM</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-500 font-bold uppercase">Active Nodes</span>
                                        <span className="font-bold text-emerald-500">{donors.length}</span>
                                    </div>
                                </div>
                            </div>
                            <Target size={80} className="absolute -right-6 -bottom-6 text-white/[0.02]" />
                        </div>
                    </motion.div>

                    {/* --- RIGHT COLUMN: COLORFUL TACTICAL MAP & BROADCAST --- */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* TACTICAL MAP UNIT */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
                        >
                            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-950 rounded-lg flex items-center justify-center shadow-lg shadow-red-900/20">
                                        <MapIcon size={20} className="text-red-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-950 uppercase tracking-tighter">Live Artery Grid</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">{donors.length} Potential Satellites</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                                        <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                                        <span className="text-[9px] font-bold text-slate-950 uppercase">Origin</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                        <span className="text-[9px] font-bold text-slate-950 uppercase">Donor Node</span>
                                    </div>
                                </div>
                            </div>

                            {/* COLORFUL MAP CONTAINER */}
                            <div className="h-[500px] relative">
                                {loading ? (
                                    <div className="absolute inset-0 bg-slate-50 flex items-center justify-center z-[1001]">
                                        <Loader2 className="w-10 h-10 animate-spin text-red-600" />
                                    </div>
                                ) : (
                                    <MapContainer
                                        key={mapKey} center={mapCenter} zoom={mapZoom}
                                        style={{ height: '100%', width: '100%', zIndex: 1 }}
                                    >
                                        <UpdateMapCenter center={mapCenter} zoom={mapZoom} />
                                        <MapBlocker showConfirmation={showConfirmation} />
                                        {/* COLORFUL TILE LAYER (CartoDB Voyager) */}
                                        <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />

                                        <Marker position={[userLocation.lat, userLocation.lng]} icon={createCustomIcon('linear-gradient(135deg, #ef4444, #991b1b)', 'user')}>
                                            <Popup className="custom-popup"><p className="text-xs font-bold p-1">Your Sector</p></Popup>
                                        </Marker>

                                        {donors.map(donor => (
                                            <Marker
                                                key={donor.id}
                                                position={[parseFloat(donor.latitude), parseFloat(donor.longitude)]}
                                                icon={createCustomIcon(donor.requestSent ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 'donor')}
                                            >
                                                <Popup className="custom-popup">
                                                    <div className="p-1 min-w-[120px]">
                                                        <p className="font-bold text-slate-950 text-sm">{donor.username}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase">{donor.blood_group} • {donor.distance}km away</p>
                                                    </div>
                                                </Popup>
                                            </Marker>
                                        ))}

                                        <Circle
                                            center={[userLocation.lat, userLocation.lng]}
                                            radius={form.radius * 1000}
                                            pathOptions={{
                                                fillColor: form.urgency === 'emergency' ? '#ef4444' : '#3b82f6',
                                                color: form.urgency === 'emergency' ? '#ef4444' : '#3b82f6',
                                                fillOpacity: 0.08, weight: 1.5, dashArray: '5, 10'
                                            }}
                                        />
                                    </MapContainer>
                                )}
                                {showConfirmation && (
                                    <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] z-[1000] pointer-events-none" />
                                )}
                            </div>
                        </motion.div>

                        {/* IDENTIFIED DONORS LIST */}
                        {donors.length > 0 && (
                            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                    <div className="flex items-center gap-2">
                                        <Users size={16} className="text-red-600" />
                                        <h3 className="text-xs font-bold text-slate-950 uppercase tracking-widest">Target Nodes</h3>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">{donors.length} Valid Connections</span>
                                </div>

                                <div className="p-2 max-h-[300px] overflow-y-auto custom-scrollbar space-y-1">
                                    {donors.map((donor, idx) => (
                                        <div
                                            key={donor.id}
                                            onClick={() => setExpandedDonor(expandedDonor === donor.id ? null : donor.id)}
                                            className={`p-3 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${donor.requestSent ? 'bg-emerald-50/40 border-emerald-100' : 'bg-white border-transparent hover:border-slate-100 hover:bg-slate-50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-11 h-11 rounded-lg flex items-center justify-center font-bold text-xs border ${donor.requestSent ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'
                                                    }`}>
                                                    {donor.blood_group}
                                                </div>
                                                <div className="min-w-0">
                                                    <h4 className="text-sm font-bold text-slate-950 leading-none truncate">{donor.username}</h4>
                                                    <div className="flex items-center gap-3 mt-1.5">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                                                            <Navigation size={10} /> {donor.distance} KM
                                                        </span>
                                                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                                            <Phone size={10} /> {donor.phone || 'Artery Encrypted'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {donor.requestSent ? (
                                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-emerald-100 rounded-full text-emerald-600 shadow-sm">
                                                        <CheckCircle size={12} />
                                                        <span className="text-[9px] font-bold uppercase tracking-tighter">Linked</span>
                                                    </div>
                                                ) : (
                                                    <ChevronDown className={`w-4 h-4 text-slate-300 transition-transform ${expandedDonor === donor.id ? 'rotate-180 text-red-600' : ''}`} />
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* BOTTOM BROADCAST COMMANDS */}
                                <div className="p-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <button
                                        onClick={() => setForm({ ...form, radius: parseFloat(form.radius) + 5 })}
                                        className="text-[10px] font-bold text-red-600 uppercase tracking-widest hover:underline flex items-center gap-1.5"
                                    >
                                        Expand Search Radius <ChevronRight size={12} />
                                    </button>

                                    {!donors.every(d => d.requestSent) && donors.length > 0 && (
                                        <motion.button
                                            onClick={sendEmergencyRequests} disabled={sendingRequests}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full sm:w-auto px-8 py-3 bg-red-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-red-200 flex items-center justify-center gap-2"
                                        >
                                            {sendingRequests ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                            Broadcast Artery Signal
                                        </motion.button>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Confirmation Modal */}
            {/* <AnimatePresence>
                {showConfirmation && requestSummary && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-[2000]"
                            onClick={() => setShowConfirmation(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                className="bg-white rounded-xl shadow-xl max-w-sm w-full overflow-hidden border border-gray-300"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className={`bg-gradient-to-r ${form.urgency === 'emergency' ? 'from-red-600 to-pink-600' : 'from-blue-600 to-cyan-600'} p-4`}>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                            <Bell className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-lg">
                                                Confirm Request?
                                            </h3>
                                            <p className="text-white/80 text-xs">
                                                Notify {requestSummary.count} donors
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className={`${form.urgency === 'emergency' ? 'bg-red-50' : 'bg-blue-50'} p-3 rounded-lg`}>
                                                <div className={`text-xs ${form.urgency === 'emergency' ? 'text-red-600' : 'text-blue-600'} font-medium`}>Blood Group</div>
                                                <div className={`font-black ${form.urgency === 'emergency' ? 'text-red-800' : 'text-blue-800'} text-lg`}>{requestSummary.bloodGroup}</div>
                                            </div>
                                            <div className="bg-gray-50 p-3 rounded-lg">
                                                <div className="text-xs text-gray-600 font-medium">Donors</div>
                                                <div className="font-black text-gray-800 text-lg">{requestSummary.count}</div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <div className="text-xs font-medium text-gray-700 mb-2">Request Details</div>
                                            <div className="space-y-1 text-xs text-gray-600">
                                                <div className="flex justify-between">
                                                    <span>Type</span>
                                                    <span className={`font-medium ${form.urgency === 'emergency' ? 'text-red-600' : 'text-blue-600'}`}>
                                                        {form.urgency === 'emergency' ? 'Emergency' : 'Appointment'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span>Radius</span>
                                                    <span className="font-medium">{requestSummary.radius} km</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`${form.urgency === 'emergency' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'} border rounded-lg p-3`}>
                                            <div className="flex items-start space-x-2">
                                                <AlertCircle className={`w-4 h-4 ${form.urgency === 'emergency' ? 'text-red-600' : 'text-blue-600'} flex-shrink-0 mt-0.5`} />
                                                <div className={`text-xs ${form.urgency === 'emergency' ? 'text-red-700' : 'text-blue-700'}`}>
                                                    {form.urgency === 'emergency'
                                                        ? 'Emergency notification will be sent immediately.'
                                                        : 'Appointment details will be shared with donors.'
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-4">
                                        <button
                                            onClick={() => setShowConfirmation(false)}
                                            className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={sendEmergencyRequests}
                                            disabled={sendingRequests}
                                            className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${form.urgency === 'emergency' ? 'from-red-600 to-pink-600' : 'from-blue-600 to-cyan-600'} text-white rounded-lg font-bold hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm`}
                                        >
                                            {sendingRequests ? (
                                                <span className="flex items-center justify-center space-x-2">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span>Sending</span>
                                                </span>
                                            ) : (
                                                'Confirm'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence> */}
            {/* Tactical Confirmation Modal */}
            <AnimatePresence>
                {showConfirmation && requestSummary && (
                    <>
                        {/* GLOBAL BACKDROP */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-[100000]"
                            onClick={() => setShowConfirmation(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 30 }}
                                className="bg-white rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.3)] max-w-sm w-full overflow-hidden border border-white"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* CLINICAL HEADER */}
                                <div className={`p-6 border-b border-slate-100 ${form.urgency === 'emergency' ? 'bg-red-600' : 'bg-slate-950'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm">
                                            <Zap className="w-6 h-6 text-white fill-current" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-white uppercase tracking-tighter leading-none">
                                                Final Broadcast
                                            </h3>
                                            <p className="text-white/70 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
                                                Initiate Artery Signal
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* DIAGNOSTIC TELEMETRY GRID */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex flex-col items-center justify-center">
                                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Target Group</p>
                                            <p className={`text-3xl font-black tracking-tighter ${form.urgency === 'emergency' ? 'text-red-600' : 'text-slate-950'}`}>
                                                {requestSummary.bloodGroup}
                                            </p>
                                        </div>
                                        <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex flex-col items-center justify-center">
                                            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Target Nodes</p>
                                            <p className="text-3xl font-black text-slate-950 tracking-tighter">
                                                {requestSummary.count.toString().padStart(2, '0')}
                                            </p>
                                        </div>
                                    </div>

                                    {/* SIGNAL LOGS */}
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                                        <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol</span>
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${form.urgency === 'emergency' ? 'text-red-600 animate-pulse' : 'text-blue-600'}`}>
                                                {form.urgency} Request
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Radius</span>
                                            <span className="text-[11px] font-black text-slate-950 uppercase">{requestSummary.radius} KM Perimeter</span>
                                        </div>
                                    </div>

                                    {/* WARNING MESSAGE */}
                                    <div className={`p-4 rounded-xl border-2 ${form.urgency === 'emergency'
                                            ? 'bg-red-50 border-red-100 text-red-700'
                                            : 'bg-blue-50 border-blue-100 text-blue-700'
                                        }`}>
                                        <div className="flex gap-3">
                                            <AlertCircle className="w-5 h-5 shrink-0" />
                                            <p className="text-[11px] font-bold leading-relaxed">
                                                {form.urgency === 'emergency'
                                                    ? 'ATTENTION: Immediate emergency signals will be broadcasted to all selected donor nodes.'
                                                    : 'SYSTEM: Appointment request will be synchronized with matching donor schedules.'
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    {/* ACTION COMMANDS */}
                                    <div className="flex gap-3 pt-2">
                                        <button
                                            onClick={() => setShowConfirmation(false)}
                                            className="flex-1 py-3.5 bg-white border-2 border-slate-100 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                                        >
                                            Abort
                                        </button>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={sendEmergencyRequests}
                                            disabled={sendingRequests}
                                            className={`flex-[2] py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] text-white shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${form.urgency === 'emergency'
                                                    ? 'bg-red-600 shadow-red-200'
                                                    : 'bg-slate-950 shadow-slate-300'
                                                }`}
                                        >
                                            {sendingRequests ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span>Transmitting</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Activity size={14} />
                                                    <span>Confirm Launch</span>
                                                </>
                                            )}
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .slider-thumb::-webkit-slider-thumb {
                    appearance: none;
                    height: 16px;
                    width: 16px;
                    border-radius: 50%;
                    cursor: pointer;
                    border: 2px solid white;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
                    transition: transform 0.2s;
                }
                
                .slider-emergency::-webkit-slider-thumb {
                    background: linear-gradient(to bottom right, #ef4444, #ec4899);
                }
                
                .slider-normal::-webkit-slider-thumb {
                    background: linear-gradient(to bottom right, #3b82f6, #06b6d4);
                }
                
                .slider-thumb::-webkit-slider-thumb:hover {
                    transform: scale(1.1);
                }
                
                .custom-marker {
                    background: transparent !important;
                    border: none !important;
                }
                
                .leaflet-popup {
                    z-index: 1001 !important;
                }
                
                .leaflet-popup-content-wrapper {
                    border-radius: 8px !important;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
                    border: 1px solid #e5e7eb !important;
                }
                
                .leaflet-popup-content {
                    margin: 8px !important;
                    font-family: 'Inter', sans-serif !important;
                }
                
                .leaflet-container {
                    z-index: 1 !important;
                    position: relative !important;
                }
                
                .leaflet-container {
                    width: 100%;
                    height: 100%;
                }
            `}</style>
        </div>
    );
};

export default EmergencyBloodRequest;

