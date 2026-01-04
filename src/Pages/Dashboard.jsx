

// // Dashboard.jsx
// import React, { useEffect, useState, useRef, useCallback } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//     Heart,
//     MapPin,
//     Phone,
//     Users,
//     AlertCircle,
//     CheckCircle,
//     X,
//     User,
//     Bell,
//     Eye,
//     Trash2,
//     ThumbsUp,
//     ThumbsDown,
//     MessageSquare,
//     Map,
//     HelpCircle,
//     Loader2,
//     Droplets,
//     Target,
//     LogOut,
//     Activity,
//     Clock,
//     Calendar,
//     Navigation,
//     Search,
//     Filter,
//     AlertTriangle,
//     ChevronRight,
//     ChevronDown,
//     UserCheck,
//     UserX,
//     Zap,
//     Award,
//     Plus,
//     TrendingUp,
//     BarChart3,
//     HeartPulse,
//     ShieldCheck,
//     Trophy,
//     History,
//     ChartBar,
//     Target as TargetIcon,
//     Activity as ActivityIcon,
//     CheckSquare,
//     XCircle,
//     Clock as ClockIcon,
//     CalendarDays,
//     ArrowUpRight,
//     ArrowDownRight,
//     TrendingDown,
//     Star,
//     ClipboardList
// } from 'lucide-react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import { Link, useNavigate } from 'react-router-dom';
// import ModalPortal from '../Components/ModalPortal';

// // Fix Leaflet default icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: '/images/marker-icon-2x.png',
//     iconUrl: '/images/marker-icon.png',
//     shadowUrl: '/images/marker-shadow.png',
// });

// // Function to get CSRF token from cookies
// function getCookie(name) {
//     let cookieValue = null;
//     if (document.cookie && document.cookie !== "") {
//         const cookies = document.cookie.split(";");
//         for (let cookie of cookies) {
//             cookie = cookie.trim();
//             if (cookie.startsWith(name + "=")) {
//                 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//                 break;
//             }
//         }
//     }
//     return cookieValue;
// }

// // Helper function to normalize help post request ID
// const getHelpPostRequestId = (helpPost) => {
//     if (!helpPost) return null;
//     if (helpPost.blood_request_id) return helpPost.blood_request_id;
//     if (helpPost.blood_request?.id) return helpPost.blood_request.id;
//     if (helpPost.request_id) return helpPost.request_id;
//     return null;
// };

// // Custom icons with fallback
// const createCustomIcon = (color, iconName = 'user') => {
//     return L.divIcon({
//         html: `
//             <div style="
//                 background: ${color};
//                 width: 42px;
//                 height: 42px;
//                 border-radius: 50%;
//                 border: 3px solid white;
//                 box-shadow: 0 4px 12px rgba(0,0,0,0.2);
//                 display: flex;
//                 align-items: center;
//                 justify-content: center;
//                 color: white;
//                 font-size: 16px;
//                 font-weight: bold;
//             ">
//                 ${iconName === 'donor' ? '👨‍⚕️' : iconName === 'receiver' ? '🩸' : '📍'}
//             </div>
//         `,
//         className: 'custom-marker',
//         iconSize: [42, 42],
//         iconAnchor: [21, 42],
//         popupAnchor: [0, -42]
//     });
// };

// // Map Fit Bounds Component
// const MapFitBounds = ({ positions }) => {
//     const map = useMap();

//     useEffect(() => {
//         if (positions && positions.length > 0) {
//             const bounds = L.latLngBounds(positions);
//             map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
//         }
//     }, [positions, map]);

//     return null;
// };

// // NEW: Status Stats Popup Modal
// const StatusStatsPopup = ({ isOpen, onClose, statusData }) => {
//     if (!isOpen || !statusData) return null;

//     const { requester, donor } = statusData?.counts || {};
//     const userId = statusData?.user_id;
//     const success = statusData?.success;

//     // Format date for display
//     const formatDate = (dateString) => {
//         if (!dateString) return 'Never';
//         const date = new Date(dateString);
//         return date.toLocaleDateString('en-US', {
//             weekday: 'short',
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     };

//     // Calculate stats
//     const totalRequests = (requester?.created_active || 0) + (requester?.created_deleted || 0);
//     const successRate = totalRequests > 0
//         ? Math.round(((requester?.approved || 0) / totalRequests) * 100)
//         : 0;

//     const totalDonations = (donor?.accepted_waiting_approval || 0) + (donor?.approved || 0) + (donor?.helped || 0);
//     const donationSuccessRate = totalDonations > 0
//         ? Math.round(((donor?.helped || 0) / totalDonations) * 100)
//         : 0;

//     return (
//         <ModalPortal>
//             <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
//                 <motion.div
//                     initial={{ opacity: 0, scale: 0.95, y: 30 }}
//                     animate={{ opacity: 1, scale: 1, y: 0 }}
//                     exit={{ opacity: 0, scale: 0.95, y: 30 }}
//                     className="relative bg-white/95 backdrop-blur-3xl rounded-2xl shadow-[0_40px_120px_rgba(0,0,0,0.3)] w-full max-w-6xl mx-auto overflow-hidden border border-white max-h-[90vh] flex flex-col"
//                 >
//                     {/* TACTICAL TERMINAL HEADER */}
//                     <div className="bg-slate-950 px-8 py-6 border-b border-white/10 shrink-0 relative overflow-hidden">
//                         <div className="absolute top-0 right-0 p-8 opacity-10">
//                             <Activity size={120} className="text-white" />
//                         </div>

//                         <div className="relative z-10 flex items-center justify-between">
//                             <div className="flex items-center gap-5">
//                                 <div className="w-14 h-14 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/40">
//                                     <ChartBar className="w-7 h-7 text-white" />
//                                 </div>
//                                 <div>
//                                     <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Activity Diagnostics</h2>
//                                     <div className="flex items-center gap-3 mt-1">
//                                         <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">User_ID: {userId}</p>
//                                         <span className="w-1 h-1 bg-white/20 rounded-full" />
//                                         <div className="flex items-center gap-1.5">
//                                             <div className={`w-2 h-2 rounded-full animate-pulse ${success ? 'bg-emerald-500' : 'bg-red-500'}`} />
//                                             <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
//                                                 System Status: {success ? '✓ Active' : '✗ Inactive'}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                             <button
//                                 onClick={onClose}
//                                 className="w-11 h-11 bg-white/10 hover:bg-red-600 rounded-xl flex items-center justify-center transition-all group"
//                             >
//                                 <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform" />
//                             </button>
//                         </div>
//                     </div>

//                     {/* BIO-ANALYTIC CONTENT */}
//                     <div className="overflow-y-auto flex-1 p-8 bg-[#FDFDFD]">

//                         {/* VITAL SUMMARY TILES */}
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//                             {/* Requester Statistics */}
//                             <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
//                                 <div className="flex items-center gap-3 mb-6">
//                                     <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100"><User size={18} /></div>
//                                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Requester Artery</span>
//                                 </div>
//                                 <div className="mb-6">
//                                     <p className="text-4xl font-black text-black tracking-tighter">{totalRequests}</p>
//                                     <p className="text-xs font-bold text-slate-500 mt-1 uppercase">Total Requests Made</p>
//                                 </div>
//                                 <div className="space-y-2">
//                                     <div className="flex justify-between items-end">
//                                         <span className="text-[10px] font-black text-slate-400 uppercase">Success Rate</span>
//                                         <span className="text-sm font-black text-emerald-600">{successRate}%</span>
//                                     </div>
//                                     <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
//                                         <motion.div initial={{ width: 0 }} animate={{ width: `${successRate}%` }} className="h-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Donor Statistics */}
//                             <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
//                                 <div className="flex items-center gap-3 mb-6">
//                                     <div className="p-2 bg-red-50 text-red-600 rounded-lg border border-red-100"><Heart size={18} /></div>
//                                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Donor Pulse</span>
//                                 </div>
//                                 <div className="mb-6">
//                                     <p className="text-4xl font-black text-black tracking-tighter">{donor?.helped || 0}</p>
//                                     <p className="text-xs font-bold text-slate-500 mt-1 uppercase">Lives Helped</p>
//                                 </div>
//                                 <div className="space-y-2">
//                                     <div className="flex justify-between items-end">
//                                         <span className="text-[10px] font-black text-slate-400 uppercase">Donation Rate</span>
//                                         <span className="text-sm font-black text-blue-600">{donationSuccessRate}%</span>
//                                     </div>
//                                     <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
//                                         <motion.div initial={{ width: 0 }} animate={{ width: `${donationSuccessRate}%` }} className="h-full bg-blue-600 shadow-[0_0_8px_#2563eb]" />
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Recent Activity Card */}
//                             <div className="bg-slate-950 rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
//                                 <div className="flex items-center gap-3 mb-6">
//                                     <div className="p-2 bg-white/10 text-red-500 rounded-lg border border-white/5"><Award size={18} /></div>
//                                     <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Recent Logs</span>
//                                 </div>
//                                 <div className="space-y-4">
//                                     <div className="flex justify-between items-center border-b border-white/5 pb-2">
//                                         <span className="text-[10px] font-bold text-slate-500 uppercase">Last Request</span>
//                                         <span className="text-xs font-black text-white">{formatDate(requester?.last_request_created).split(',')[0]}</span>
//                                     </div>
//                                     <div className="flex justify-between items-center border-b border-white/5 pb-2">
//                                         <span className="text-[10px] font-bold text-slate-500 uppercase">Last Donation</span>
//                                         <span className="text-xs font-black text-white">{formatDate(donor?.last_approved_date).split(',')[0]}</span>
//                                     </div>
//                                     <div className="pt-2 flex items-center gap-2 text-emerald-400">
//                                         <Zap size={12} className="fill-current" />
//                                         <p className="text-[10px] font-black uppercase tracking-widest">Diagnostic Level High</p>
//                                     </div>
//                                 </div>
//                                 <Target size={120} className="absolute -right-12 -bottom-12 text-white/[0.03]" />
//                             </div>
//                         </div>

//                         {/* DETAILED STATS SPLIT */}
//                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
//                             {/* Requester Statistics Detailed */}
//                             <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col">
//                                 <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
//                                     <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white"><UserCheck size={20} /></div>
//                                     <h3 className="text-lg font-black text-black uppercase tracking-tight">Requester Detailed Analytics</h3>
//                                 </div>

//                                 <div className="grid grid-cols-2 gap-3 mb-6">
//                                     <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
//                                         <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active</p><p className="text-2xl font-black text-black">{requester?.created_active || 0}</p></div>
//                                         <ArrowUpRight className="text-blue-500" size={20} />
//                                     </div>
//                                     <div className="bg-red-50/50 p-4 rounded-xl border border-red-100 flex justify-between items-center">
//                                         <div><p className="text-[9px] font-black text-red-400 uppercase tracking-widest">Deleted</p><p className="text-2xl font-black text-red-600">{requester?.created_deleted || 0}</p></div>
//                                         <TrendingDown className="text-red-400" size={20} />
//                                     </div>
//                                     <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 flex justify-between items-center">
//                                         <div><p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Approved</p><p className="text-2xl font-black text-emerald-600">{requester?.approved || 0}</p></div>
//                                         <CheckCircle className="text-emerald-500" size={20} />
//                                     </div>
//                                     <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 flex justify-between items-center">
//                                         <div><p className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Help Received</p><p className="text-2xl font-black text-amber-600">{requester?.help_received || 0}</p></div>
//                                         <HeartPulse className="text-amber-500" size={20} />
//                                     </div>
//                                 </div>

//                                 <div className="grid grid-cols-3 gap-2">
//                                     <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center"><p className="text-[8px] font-black text-slate-400 uppercase">Waiting</p><p className="text-sm font-black text-black">{requester?.accepted_waiting_approval || 0}</p></div>
//                                     <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center"><p className="text-[8px] font-black text-slate-400 uppercase">Rejected</p><p className="text-sm font-black text-black">{requester?.rejected || 0}</p></div>
//                                     <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center"><p className="text-[8px] font-black text-slate-400 uppercase">Ignored</p><p className="text-sm font-black text-black">{requester?.ignored || 0}</p></div>
//                                 </div>

//                                 <div className="mt-8 pt-6 border-t border-slate-100 space-y-2">
//                                     <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                                         <CalendarDays size={14} className="text-blue-500" /> Last Request Created: <span className="text-black">{formatDate(requester?.last_request_created)}</span>
//                                     </div>
//                                     {requester?.last_approved_date && (
//                                         <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                                             <ClockIcon size={14} className="text-emerald-500" /> Last Request Approved: <span className="text-black">{formatDate(requester?.last_approved_date)}</span>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* Donor Statistics Detailed */}
//                             <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col">
//                                 <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
//                                     <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-red-200"><Heart size={20} /></div>
//                                     <h3 className="text-lg font-black text-black uppercase tracking-tight">Donor Module Feed</h3>
//                                 </div>

//                                 {donor?.last_approved_date ? (
//                                     <div className="bg-emerald-600 rounded-xl p-5 text-white mb-6 shadow-xl shadow-emerald-900/20 relative overflow-hidden group">
//                                         <div className="relative z-10">
//                                             <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Impact Summary</p>
//                                             <h4 className="text-2xl font-black mt-2">You saved {donor?.helped || 0} lives.</h4>
//                                             <div className="mt-4 flex items-center gap-3 bg-white/10 p-3 rounded-lg border border-white/10">
//                                                 <CalendarDays size={16} />
//                                                 <p className="text-xs font-bold uppercase tracking-tight">Last Approved: {formatDate(donor.last_approved_date)}</p>
//                                             </div>
//                                         </div>
//                                         <Trophy size={80} className="absolute -right-4 -bottom-4 text-white/10 group-hover:scale-110 transition-transform duration-500" />
//                                     </div>
//                                 ) : (
//                                     <div className="bg-slate-100 rounded-xl p-8 text-center mb-6 border border-slate-200">
//                                         <Heart size={32} className="mx-auto mb-3 text-slate-300" />
//                                         <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed">No approved donations recorded.<br />Start contributing to help the community!</p>
//                                     </div>
//                                 )}

//                                 <div className="grid grid-cols-2 gap-3 mt-auto">
//                                     <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm flex items-center justify-between">
//                                         <div><p className="text-[9px] font-black text-slate-400 uppercase">Waiting</p><p className="text-xl font-black text-black">{donor?.accepted_waiting_approval || 0}</p></div>
//                                         <ClockIcon size={18} className="text-amber-500" />
//                                     </div>
//                                     <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm flex items-center justify-between">
//                                         <div><p className="text-[9px] font-black text-emerald-600 uppercase">Success</p><p className="text-xl font-black text-emerald-600">{donor?.approved || 0}</p></div>
//                                         <CheckSquare size={18} className="text-emerald-500" />
//                                     </div>
//                                     <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm flex items-center justify-between">
//                                         <div><p className="text-[9px] font-black text-red-600 uppercase">Declined</p><p className="text-xl font-black text-red-600">{donor?.rejected || 0}</p></div>
//                                         <XCircle size={18} className="text-red-500" />
//                                     </div>
//                                     <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm flex items-center justify-between">
//                                         <div><p className="text-[9px] font-black text-slate-400 uppercase">Ignored</p><p className="text-xl font-black text-slate-400">{donor?.ignored || 0}</p></div>
//                                         <UserX size={18} className="text-slate-400" />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* KEY METRICS BARSET */}
//                         <div className="bg-slate-50 rounded-xl p-8 border border-slate-200 shadow-inner">
//                             <h3 className="text-xs font-black text-black uppercase tracking-[0.3em] mb-8 text-center flex items-center justify-center gap-4">
//                                 <div className="h-[1px] w-12 bg-slate-200" /> Performance Indicators <div className="h-[1px] w-12 bg-slate-200" />
//                             </h3>
//                             <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//                                 {[
//                                     { label: 'Request Accuracy', val: successRate, icon: TargetIcon, color: 'text-blue-600', bg: 'bg-blue-100' },
//                                     { label: 'Donation Pulse', val: donationSuccessRate, icon: ActivityIcon, color: 'text-emerald-600', bg: 'bg-emerald-100' },
//                                     { label: 'Activity Logs', val: (totalRequests + totalDonations), icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
//                                     { label: 'System Impact', val: ((requester?.help_received || 0) + (donor?.helped || 0)), icon: Award, color: 'text-red-600', bg: 'bg-red-100' }
//                                 ].map((metric, i) => (
//                                     <div key={i} className="text-center group">
//                                         <div className={`w-12 h-12 ${metric.bg} ${metric.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
//                                             <metric.icon size={20} />
//                                         </div>
//                                         <p className="text-2xl font-black text-black tracking-tighter">{metric.val}{metric.label.includes('Rate') || metric.label.includes('Pulse') || metric.label.includes('Accuracy') ? '%' : ''}</p>
//                                         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{metric.label}</p>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     </div>

//                     {/* MODAL FOOTER */}
//                     <div className="p-6 bg-white border-t border-slate-100 shrink-0">
//                         <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
//                             <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
//                                 <Clock size={12} /> Sync Timestamp: {new Date().toLocaleTimeString()}
//                             </div>
//                             <div className="flex gap-3 w-full sm:w-auto">
//                                 <button
//                                     onClick={onClose}
//                                     className="flex-1 sm:flex-none px-10 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
//                                 >
//                                     Close Portal
//                                 </button>
//                                 <button
//                                     onClick={() => window.location.reload()}
//                                     className="flex-1 sm:flex-none px-10 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-200 hover:bg-slate-900 transition-all border border-transparent"
//                                 >
//                                     Refresh Stats
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </motion.div>
//             </div>
//         </ModalPortal>
//     );
// };

// // Map Modal Component
// const MapModal = ({ isOpen, onClose, routeData, userLocation }) => {
//     const [positions, setPositions] = useState([]);
//     const [mapKey, setMapKey] = useState(Date.now());

//     useEffect(() => {
//         if (isOpen && routeData?.waypoints) {
//             const latlngs = routeData.waypoints.map(wp => [wp.lat, wp.lng]);
//             setPositions(latlngs);
//             setMapKey(Date.now());
//         }
//     }, [isOpen, routeData]);

//     const generateRoutePath = (waypoints) => {
//         if (waypoints.length < 2) return waypoints;
//         const path = [];
//         for (let i = 0; i < waypoints.length; i++) {
//             path.push(waypoints[i]);
//             if (i < waypoints.length - 1) {
//                 const midLat = (waypoints[i][0] + waypoints[i + 1][0]) / 2;
//                 const midLng = (waypoints[i][1] + waypoints[i + 1][1]) / 2;
//                 const offset = 0.0005;
//                 path.push([midLat + offset, midLng + offset]);
//             }
//         }
//         return path;
//     };

//     if (!isOpen) return null;

//     const routePath = generateRoutePath(positions);
//     const defaultCenter = positions[0] || userLocation || [23.8041, 90.4152];

//     return (
//         <ModalPortal>
//             <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
//                 <motion.div
//                     initial={{ opacity: 0, scale: 0.9 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.9 }}
//                     className="relative bg-white rounded-2xl shadow-2xl w-full h-full max-w-6xl max-h-[90vh] mx-auto overflow-hidden"
//                 >
//                     <div className="absolute top-4 right-4 z-[10001]">
//                         <button
//                             onClick={onClose}
//                             className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow hover:bg-gray-50"
//                         >
//                             <X className="w-5 h-5 text-gray-700" />
//                         </button>
//                     </div>

//                     <div className="h-full w-full">
//                         <MapContainer
//                             key={mapKey}
//                             center={defaultCenter}
//                             zoom={13}
//                             style={{ height: '100%', width: '100%' }}
//                             scrollWheelZoom={true}
//                         >
//                             <TileLayer
//                                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                             />

//                             {positions.length > 0 && <MapFitBounds positions={positions} />}

//                             {userLocation && (
//                                 <Marker
//                                     position={userLocation}
//                                     icon={createCustomIcon('linear-gradient(135deg, #3b82f6, #1d4ed8)', 'user')}
//                                 >
//                                     <Popup>
//                                         <div className="p-3">
//                                             <div className="font-bold text-gray-900">Your Location</div>
//                                             <div className="text-sm text-gray-600">
//                                                 Latitude: {userLocation[0].toFixed(6)}<br />
//                                                 Longitude: {userLocation[1].toFixed(6)}
//                                             </div>
//                                         </div>
//                                     </Popup>
//                                 </Marker>
//                             )}

//                             {positions.slice(1).map((pos, index) => (
//                                 <Marker
//                                     key={index}
//                                     position={pos}
//                                     icon={createCustomIcon(
//                                         index === 0
//                                             ? 'linear-gradient(135deg, #ef4444, #dc2626)'
//                                             : 'linear-gradient(135deg, #10b981, #059669)',
//                                         index === 0 ? 'receiver' : 'donor'
//                                     )}
//                                 >
//                                     <Popup>
//                                         <div className="p-3">
//                                             <div className="font-bold text-gray-900">
//                                                 {index === 0 ? 'Receiver Location' : `Donor ${index}`}
//                                             </div>
//                                             <div className="text-sm text-gray-600">
//                                                 Latitude: {pos[0].toFixed(6)}<br />
//                                                 Longitude: {pos[1].toFixed(6)}
//                                             </div>
//                                         </div>
//                                     </Popup>
//                                 </Marker>
//                             ))}

//                             {routePath.length > 1 && (
//                                 <Polyline
//                                     positions={routePath}
//                                     color="#ef4444"
//                                     weight={4}
//                                     opacity={0.7}
//                                 />
//                             )}
//                         </MapContainer>
//                     </div>
//                 </motion.div>
//             </div>
//         </ModalPortal>
//     );
// };

// // Help Offers Modal Component
// const HelpOffersModal = ({ isOpen, onClose, request, helpOffers }) => {
//     if (!isOpen || !request) return null;

//     const filteredHelpOffers = helpOffers?.filter(offer =>
//         getHelpPostRequestId(offer) === request?.id
//     );

//     return (
//         <ModalPortal>
//             <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
//                 <motion.div
//                     initial={{ opacity: 0, scale: 0.95, y: 20 }}
//                     animate={{ opacity: 1, scale: 1, y: 0 }}
//                     exit={{ opacity: 0, scale: 0.95, y: 20 }}
//                     className="relative bg-white/95 backdrop-blur-2xl rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.2)] w-full max-w-2xl mx-auto overflow-hidden border border-white max-h-[85vh] flex flex-col"
//                 >
//                     {/* VITAL SUPPORT HEADER */}
//                     <div className="bg-amber-500 px-6 py-5 border-b border-white/20 shrink-0 relative overflow-hidden">
//                         {/* Subtle pulse effect in header background */}
//                         <motion.div
//                             animate={{ opacity: [0.3, 0.6, 0.3] }}
//                             transition={{ repeat: Infinity, duration: 3 }}
//                             className="absolute inset-0 bg-amber-400 pointer-events-none"
//                         />

//                         <div className="relative z-10 flex items-center justify-between">
//                             <div className="flex items-center gap-3">
//                                 <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
//                                     <Zap className="text-amber-600 fill-current" size={20} />
//                                 </div>
//                                 <div>
//                                     <h3 className="text-lg font-bold text-slate-950 leading-none">Support Manifest</h3>
//                                     <div className="flex items-center gap-2 mt-1">
//                                         <p className="text-[10px] font-black text-amber-950 uppercase tracking-widest">
//                                             Request #{request.id}
//                                         </p>
//                                         <span className="w-1 h-1 bg-amber-900/30 rounded-full" />
//                                         <p className="text-[10px] font-black text-amber-900 uppercase tracking-widest">
//                                             {filteredHelpOffers?.length || 0} Signal(s) Received
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>
//                             <button
//                                 onClick={onClose}
//                                 className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/20 text-slate-950 hover:bg-white hover:text-amber-600 transition-all"
//                             >
//                                 <X size={20} />
//                             </button>
//                         </div>
//                     </div>

//                     {/* MODAL BODY: HIGH DENSITY LIST */}
//                     <div className="overflow-y-auto flex-1 p-5 custom-scrollbar bg-[#FDFDFD]">
//                         {filteredHelpOffers && filteredHelpOffers.length > 0 ? (
//                             <div className="space-y-3">
//                                 {filteredHelpOffers.map((offer, index) => (
//                                     <motion.div
//                                         key={offer.id || index}
//                                         initial={{ opacity: 0, x: -10 }}
//                                         animate={{ opacity: 1, x: 0 }}
//                                         transition={{ delay: index * 0.05 }}
//                                         className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm hover:border-amber-400 transition-all group relative overflow-hidden"
//                                     >
//                                         {/* Status vertical bar */}
//                                         <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 opacity-50 group-hover:opacity-100 transition-opacity" />

//                                         <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
//                                             <div className="flex-1 min-w-0">
//                                                 <div className="flex items-center justify-between mb-3">
//                                                     <div className="flex items-center gap-2">
//                                                         <h4 className="font-bold text-slate-950 text-base truncate">
//                                                             {offer.name || 'Anonymous Helper'}
//                                                         </h4>
//                                                         <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-[10px] font-bold uppercase border border-red-100">
//                                                             {offer.blood_group || 'N/A'}
//                                                         </span>
//                                                     </div>
//                                                     <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
//                                                         <Clock size={12} /> {new Date(offer.created_at).toLocaleDateString()}
//                                                     </div>
//                                                 </div>

//                                                 {/* COMPACT DATA GRID */}
//                                                 <div className="grid grid-cols-2 gap-4">
//                                                     <div className="flex items-center gap-3">
//                                                         <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
//                                                             <Phone size={14} className="text-emerald-600" />
//                                                         </div>
//                                                         <div className="min-w-0">
//                                                             <p className="text-[9px] font-bold text-slate-400 uppercase leading-none mb-1">Contact</p>
//                                                             <p className="text-sm font-bold text-slate-950 truncate">{offer.phone || 'Not Provided'}</p>
//                                                         </div>
//                                                     </div>
//                                                     <div className="flex items-center gap-3">
//                                                         <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
//                                                             <Activity size={14} className="text-blue-600" />
//                                                         </div>
//                                                         <div className="min-w-0">
//                                                             <p className="text-[9px] font-bold text-slate-400 uppercase leading-none mb-1">Helper ID</p>
//                                                             <p className="text-sm font-bold text-slate-950 truncate">#{offer.helper || 'N/A'}</p>
//                                                         </div>
//                                                     </div>
//                                                 </div>

//                                                 {/* MESSAGE BUBBLE */}
//                                                 {offer.message && (
//                                                     <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
//                                                         <div className="flex gap-2">
//                                                             <MessageSquare size={12} className="text-slate-400 shrink-0 mt-0.5" />
//                                                             <p className="text-xs font-medium text-slate-600 leading-relaxed italic">
//                                                                 "{offer.message}"
//                                                             </p>
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </motion.div>
//                                 ))}
//                             </div>
//                         ) : (
//                             <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 mx-2">
//                                 <div className="relative inline-block mb-4">
//                                     <HelpCircle className="w-12 h-12 text-slate-200" />
//                                     <motion.div
//                                         animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
//                                         transition={{ repeat: Infinity, duration: 2 }}
//                                         className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl"
//                                     />
//                                 </div>
//                                 <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">No Signals Found</h4>
//                                 <p className="text-xs text-slate-400 mt-2">The support artery for this request is currently empty.</p>
//                             </div>
//                         )}
//                     </div>

//                     {/* MODAL FOOTER */}
//                     <div className="p-4 bg-white border-t border-slate-100 shrink-0">
//                         <button
//                             onClick={onClose}
//                             className="w-full py-3.5 bg-slate-950 text-white rounded-xl text-xs font-bold uppercase tracking-[0.2em] shadow-lg hover:bg-red-600 transition-all"
//                         >
//                             Close Support Feed
//                         </button>
//                     </div>
//                 </motion.div>
//             </div>
//         </ModalPortal>
//     );
// };

// // Help Form Modal
// const HelpFormModal = ({ isOpen, onClose, request, onSubmit }) => {
//     const [formData, setFormData] = useState({
//         name: '',
//         phone: '',
//         message: '',
//         blood_group: request?.blood_group || ''
//     });
//     const [submitting, setSubmitting] = useState(false);

//     useEffect(() => {
//         if (isOpen && request) {
//             setFormData({
//                 name: '',
//                 phone: '',
//                 message: '',
//                 blood_group: request.blood_group || ''
//             });
//         }
//     }, [isOpen, request]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setSubmitting(true);
//         try {
//             await onSubmit(formData);
//             onClose();
//         } catch (error) {
//             console.error('Error submitting help form:', error);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     if (!isOpen || !request) return null;

//     return (
//         <ModalPortal>
//             {/* <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
//                 <motion.div
//                     initial={{ opacity: 0, scale: 0.9 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.9 }}
//                     className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden"
//                 >
//                     <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
//                         <div className="flex items-center justify-between">
//                             <h3 className="text-xl font-bold text-white flex items-center">
//                                 <Heart className="w-6 h-6 mr-2" />
//                                 Offer Help
//                             </h3>
//                             <button
//                                 onClick={onClose}
//                                 className="text-white opacity-80 hover:opacity-100 transition-opacity"
//                             >
//                                 <X className="w-6 h-6" />
//                             </button>
//                         </div>
//                     </div>

//                     <div className="p-6">
//                         <form onSubmit={handleSubmit} className="space-y-4">
//                             <div className="bg-red-50 border border-red-200 rounded-lg p-3">
//                                 <div className="flex items-center justify-between">
//                                     <span className="text-sm text-red-700">Requested Blood Type:</span>
//                                     <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm font-bold">
//                                         {request?.blood_group}
//                                     </span>
//                                 </div>
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Your Name *
//                                 </label>
//                                 <input
//                                     type="text"
//                                     required
//                                     value={formData.name}
//                                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
//                                     placeholder="Enter your name"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Phone Number *
//                                 </label>
//                                 <input
//                                     type="tel"
//                                     required
//                                     value={formData.phone}
//                                     onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
//                                     placeholder="Enter your phone number"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                                     Message *
//                                 </label>
//                                 <textarea
//                                     required
//                                     rows="3"
//                                     value={formData.message}
//                                     onChange={(e) => setFormData({ ...formData, message: e.target.value })}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition resize-none"
//                                     placeholder="Write your message here..."
//                                 />
//                             </div>

//                             <div className="flex gap-3 pt-2">
//                                 <button
//                                     type="button"
//                                     onClick={onClose}
//                                     className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
//                                 >
//                                     Cancel
//                                 </button>
//                                 <button
//                                     type="submit"
//                                     disabled={submitting}
//                                     className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//                                 >
//                                     {submitting ? (
//                                         <span className="flex items-center justify-center">
//                                             <Loader2 className="w-4 h-4 animate-spin mr-2" />
//                                             Submitting...
//                                         </span>
//                                     ) : (
//                                         'Submit Offer'
//                                     )}
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </motion.div>
//             </div> */}


//             <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
//                 <motion.div
//                     initial={{ opacity: 0, scale: 0.95, y: 20 }}
//                     animate={{ opacity: 1, scale: 1, y: 0 }}
//                     exit={{ opacity: 0, scale: 0.95, y: 20 }}
//                     className="relative bg-white/95 backdrop-blur-2xl rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.2)] w-full max-w-md mx-auto overflow-hidden border border-white"
//                 >
//                     {/* MODAL HEADER: CLINICAL TAB */}
//                     <div className="bg-slate-950 px-6 py-5 border-b border-white/10 shrink-0">
//                         <div className="flex items-center justify-between">
//                             <div className="flex items-center gap-3">
//                                 <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/20">
//                                     <Heart className="text-white fill-current" size={20} />
//                                 </div>
//                                 <div>
//                                     <h3 className="text-lg font-bold text-white leading-none uppercase tracking-tighter">Transmit Help</h3>
//                                     <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mt-1">
//                                         Artery Connection Feed
//                                     </p>
//                                 </div>
//                             </div>
//                             <button
//                                 onClick={onClose}
//                                 className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:bg-red-600 hover:text-white transition-all"
//                             >
//                                 <X size={18} />
//                             </button>
//                         </div>
//                     </div>

//                     <div className="p-6">
//                         <form onSubmit={handleSubmit} className="space-y-5">
//                             {/* BLOOD TYPE INDICATOR: HIGH VISIBILITY */}
//                             <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center justify-between">
//                                 <div className="flex items-center gap-2">
//                                     <Activity className="text-red-600" size={16} />
//                                     <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Target Blood Type</span>
//                                 </div>
//                                 <span className="px-4 py-1.5 bg-slate-950 text-white rounded-lg text-lg font-black tracking-tighter">
//                                     {request?.blood_group}
//                                 </span>
//                             </div>

//                             <div className="space-y-4">
//                                 {/* NAME FIELD */}
//                                 <div>
//                                     <label className="block text-[11px] font-black text-slate-950 uppercase tracking-widest mb-1.5 ml-1">
//                                         Identity Name
//                                     </label>
//                                     <div className="relative group">
//                                         <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-red-600 transition-colors" size={16} />
//                                         <input
//                                             type="text"
//                                             required
//                                             value={formData.name}
//                                             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                                             className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-950 focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600 transition-all placeholder:text-slate-300"
//                                             placeholder="Full Name"
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* PHONE FIELD (NUMBERS ONLY) */}
//                                 <div>
//                                     <label className="block text-[11px] font-black text-slate-950 uppercase tracking-widest mb-1.5 ml-1">
//                                         Contact Frequency
//                                     </label>
//                                     <div className="relative group">
//                                         <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-red-600 transition-colors" size={16} />
//                                         <input
//                                             type="number"
//                                             required
//                                             value={formData.phone}
//                                             onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                                             className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-950 focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600 transition-all placeholder:text-slate-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
//                                             placeholder="Numbers Only"
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* MESSAGE FIELD */}
//                                 <div>
//                                     <label className="block text-[11px] font-black text-slate-950 uppercase tracking-widest mb-1.5 ml-1">
//                                         Message Payload
//                                     </label>
//                                     <textarea
//                                         required
//                                         rows="3"
//                                         value={formData.message}
//                                         onChange={(e) => setFormData({ ...formData, message: e.target.value })}
//                                         className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-950 focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600 transition-all placeholder:text-slate-300 resize-none min-h-[100px]"
//                                         placeholder="Write your brief message here..."
//                                     />
//                                 </div>
//                             </div>

//                             {/* ACTION BUTTONS */}
//                             <div className="flex gap-3 pt-4 border-t border-slate-50">
//                                 <button
//                                     type="button"
//                                     onClick={onClose}
//                                     className="flex-1 px-4 py-3.5 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-100 hover:text-slate-800 transition-all font-bold text-xs uppercase tracking-widest border border-slate-100"
//                                 >
//                                     Abort
//                                 </button>
//                                 <motion.button
//                                     type="submit"
//                                     whileHover={{ scale: 1.02 }}
//                                     whileTap={{ scale: 0.98 }}
//                                     disabled={submitting}
//                                     className="flex-[2] px-4 py-3.5 bg-red-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-red-200 hover:bg-slate-950 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//                                 >
//                                     {submitting ? (
//                                         <>
//                                             <Loader2 className="w-4 h-4 animate-spin" />
//                                             Transmitting...
//                                         </>
//                                     ) : (
//                                         <>
//                                             <Zap size={14} className="fill-current" />
//                                             Broadcast Offer
//                                         </>
//                                     )}
//                                 </motion.button>
//                             </div>
//                         </form>
//                     </div>
//                 </motion.div>
//             </div>
//         </ModalPortal>
//     );
// };

// // Donor Modal Component
// const DonorModal = ({ isOpen, onClose, request, onApprove, onReject }) => {
//     const [donorDetails, setDonorDetails] = useState({});
//     const [loading, setLoading] = useState(false);
//     const [processing, setProcessing] = useState({});
//     const navigate = useNavigate();
//     const csrfToken = getCookie('csrftoken');

//     const isDonorInList = (donorId, list) => {
//         if (!list || list.length === 0) return false;
//         if (typeof list[0] === 'number') {
//             return list.includes(donorId);
//         }
//         return list.some(item => item.id === donorId || item === donorId);
//     };

//     useEffect(() => {
//         if (isOpen && request) {
//             fetchDonorDetails();
//         }
//     }, [isOpen, request]);

//     const fetchDonorDetails = async () => {
//         setLoading(true);
//         try {
//             const donorIds = [...(request.donors || []), ...(request.accepted_donors || []), ...(request.final_donors || [])]
//                 .map(d => typeof d === 'object' ? d.id : d)
//                 .filter((value, index, self) => self.indexOf(value) === index);

//             const details = {};

//             for (const donorId of donorIds) {
//                 try {
//                     const response = await fetch(`http://localhost:8000/api/get-donor-details/${donorId}/`, {
//                         method: 'GET',
//                         credentials: 'include',
//                         headers: {
//                             'X-CSRFToken': csrfToken,
//                         }
//                     });

//                     if (response.ok) {
//                         const donorDetail = await response.json();
//                         details[donorId] = donorDetail;
//                     }
//                 } catch (error) {
//                     console.error(`Error fetching details for donor ${donorId}:`, error);
//                 }
//             }

//             setDonorDetails(details);
//         } catch (error) {
//             console.error('Error fetching donor details:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleApprove = async (requestId, donorId) => {
//         setProcessing(prev => ({ ...prev, [`approve-${donorId}`]: true }));
//         try {
//             await onApprove(requestId, donorId);
//             setDonorDetails(prev => ({
//                 ...prev,
//                 [donorId]: {
//                     ...prev[donorId],
//                     status: 'approved'
//                 }
//             }));
//         } catch (error) {
//             console.error('Error approving donor:', error);
//         } finally {
//             setProcessing(prev => ({ ...prev, [`approve-${donorId}`]: false }));
//         }
//     };

//     const handleReject = async (requestId, donorId) => {
//         setProcessing(prev => ({ ...prev, [`reject-${donorId}`]: true }));
//         try {
//             await onReject(requestId, donorId);
//             setDonorDetails(prev => ({
//                 ...prev,
//                 [donorId]: {
//                     ...prev[donorId],
//                     status: 'rejected'
//                 }
//             }));
//         } catch (error) {
//             console.error('Error rejecting donor:', error);
//         } finally {
//             setProcessing(prev => ({ ...prev, [`reject-${donorId}`]: false }));
//         }
//     };

//     const openChatWithDonor = async (donorId) => {
//         try {
//             const response = await fetch(`http://localhost:8000/api/chat-room/${request.id}/${donorId}/`, {
//                 method: "GET",
//                 credentials: "include",
//                 headers: {
//                     'X-CSRFToken': csrfToken,
//                 }
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 const roomId = data.room_id;

//                 if (roomId) {
//                     navigate(`/chat/${roomId}`);
//                     onClose();
//                 } else {
//                     alert('Chat room not found.');
//                 }
//             } else {
//                 alert('Failed to open chat room.');
//             }
//         } catch (error) {
//             console.error('Error opening chat:', error);
//             alert('Failed to open chat');
//         }
//     };

//     if (!isOpen || !request) return null;

//     const allDonorIds = [
//         ...(request?.donors || []).map(d => typeof d === 'object' ? d.id : d),
//         ...(request?.accepted_donors || []).map(d => typeof d === 'object' ? d.id : d),
//         ...(request?.final_donors || []).map(d => typeof d === 'object' ? d.id : d)
//     ].filter((value, index, self) => self.indexOf(value) === index);

//     return (
//         <ModalPortal>
//             {/* <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           exit={{ opacity: 0, scale: 0.9 }}
//           className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto overflow-hidden max-h-[80vh]"
//         >
//           <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
//             <div className="flex items-center justify-between">
//               <h3 className="text-xl font-bold text-white">
//                 Donors for Request #{request.id}
//               </h3>
//               <button
//                 onClick={onClose}
//                 className="text-white opacity-80 hover:opacity-100 transition-opacity"
//               >
//                 <X className="w-6 h-6" />
//               </button>
//             </div>
//           </div>

//           <div className="overflow-y-auto max-h-[60vh] p-4">
//             {loading ? (
//               <div className="text-center py-8">
//                 <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-3" />
//                 <p className="text-gray-600">Loading donor details...</p>
//               </div>
//             ) : allDonorIds.length > 0 ? (
//               <div className="space-y-4">
//                 {allDonorIds.map((donorId) => {
//                   const details = donorDetails[donorId] || {};
//                   const isAccepted = isDonorInList(donorId, request.accepted_donors);
//                   const isFinal = isDonorInList(donorId, request.final_donors);
//                   const isRejected = isDonorInList(donorId, request.rejected_donors_by_requester);
//                   const isIgnored = isDonorInList(donorId, request.request_ignored_by_donors);
//                   const isApproving = processing[`approve-${donorId}`];
//                   const isRejecting = processing[`reject-${donorId}`];

//                   return (
//                     <div key={donorId} className="bg-white rounded-lg border border-gray-200 p-4">
//                       <div className="flex justify-between items-start">
//                         <div className="flex-1">
//                           <h4 className="font-bold text-lg text-gray-900">
//                             {details.username || `Donor ${donorId}`}
//                           </h4>
//                           <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
//                             <div>
//                               <div className="text-gray-500">Blood Group</div>
//                               <div className="font-medium text-red-600">
//                                 {details.blood_group || 'N/A'}
//                               </div>
//                             </div>
//                             <div>
//                               <div className="text-gray-500">Phone</div>
//                               <div className="font-medium">{details.phone || 'N/A'}</div>
//                             </div>
//                             <div className="col-span-2">
//                               <div className="text-gray-500">Address</div>
//                               <div className="font-medium">{details.detailed_address || 'N/A'}</div>
//                             </div>
//                             <div className="col-span-2">
//                               <div className="text-gray-500">Status</div>
//                               <div className="font-medium">
//                                 {isFinal ? 'Approved' :
//                                   isRejected ? 'Rejected' :
//                                     isAccepted ? 'Accepted' :
//                                       isIgnored ? 'Ignored' : 'Donor'}
//                               </div>
//                             </div>
//                           </div>
//                         </div>

//                         <div className="flex flex-col items-end ml-4">
//                           {isFinal ? (
//                             <div className="flex flex-col items-end gap-2">
//                               <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
//                                 Approved
//                               </span>
//                               <button
//                                 onClick={() => openChatWithDonor(donorId)}
//                                 className="px-3 py-1.5 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition text-sm font-medium flex items-center"
//                               >
//                                 <MessageSquare className="w-3 h-3 mr-1" />
//                                 Chat
//                               </button>
//                             </div>
//                           ) : isRejected ? (
//                             <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
//                               Rejected
//                             </span>
//                           ) : isAccepted ? (
//                             <div className="flex gap-2 mt-2">
//                               <button
//                                 onClick={() => handleApprove(request.id, donorId)}
//                                 disabled={isApproving || isRejecting}
//                                 className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//                               >
//                                 {isApproving ? (
//                                   <span className="flex items-center">
//                                     <Loader2 className="w-3 h-3 animate-spin mr-1" />
//                                     Approving...
//                                   </span>
//                                 ) : 'Approve'}
//                               </button>
//                               <button
//                                 onClick={() => handleReject(request.id, donorId)}
//                                 disabled={isRejecting || isApproving}
//                                 className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//                               >
//                                 {isRejecting ? (
//                                   <span className="flex items-center">
//                                     <Loader2 className="w-3 h-3 animate-spin mr-1" />
//                                     Rejecting...
//                                   </span>
//                                 ) : 'Reject'}
//                               </button>
//                             </div>
//                           ) : null}
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             ) : (
//               <div className="text-center py-8">
//                 <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
//                 <p className="text-gray-600">No donors have accepted this request yet.</p>
//               </div>
//             )}
//           </div>
//         </motion.div>
//       </div> */}

//             <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
//                 <motion.div
//                     initial={{ opacity: 0, scale: 0.95, y: 20 }}
//                     animate={{ opacity: 1, scale: 1, y: 0 }}
//                     exit={{ opacity: 0, scale: 0.95, y: 20 }}
//                     className="relative bg-white/95 backdrop-blur-2xl rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.2)] w-full max-w-2xl mx-auto overflow-hidden border border-white max-h-[85vh] flex flex-col"
//                 >
//                     {/* CLINICAL HEADER */}
//                     <div className="bg-slate-950 px-6 py-5 border-b border-white/10 shrink-0">
//                         <div className="flex items-center justify-between">
//                             <div className="flex items-center gap-3">
//                                 <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/20">
//                                     <Users className="text-white w-5 h-5" />
//                                 </div>
//                                 <div>
//                                     <h3 className="text-lg font-bold text-white leading-none">Artery Management</h3>
//                                     <p className="text-[10px] font-bold text-red-500 uppercase tracking-[0.2em] mt-1">
//                                         Request #{request.id} • Donor Manifest
//                                     </p>
//                                 </div>
//                             </div>
//                             <button
//                                 onClick={onClose}
//                                 className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-red-600 transition-all"
//                             >
//                                 <X size={20} />
//                             </button>
//                         </div>
//                     </div>

//                     {/* MODAL BODY */}
//                     <div className="overflow-y-auto flex-1 p-5 custom-scrollbar">
//                         {loading ? (
//                             <div className="text-center py-16">
//                                 <motion.div
//                                     animate={{ rotate: 360 }}
//                                     transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
//                                     className="w-12 h-12 border-4 border-slate-100 border-t-red-600 rounded-full mx-auto mb-4"
//                                 />
//                                 <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Scanning Artery Logs...</p>
//                             </div>
//                         ) : allDonorIds.length > 0 ? (
//                             <div className="space-y-3">
//                                 {allDonorIds.map((donorId) => {
//                                     const details = donorDetails[donorId] || {};
//                                     const isAccepted = isDonorInList(donorId, request.accepted_donors);
//                                     const isFinal = isDonorInList(donorId, request.final_donors);
//                                     const isRejected = isDonorInList(donorId, request.rejected_donors_by_requester);
//                                     const isIgnored = isDonorInList(donorId, request.request_ignored_by_donors);
//                                     const isApproving = processing[`approve-${donorId}`];
//                                     const isRejecting = processing[`reject-${donorId}`];

//                                     return (
//                                         <motion.div
//                                             key={donorId}
//                                             initial={{ opacity: 0, x: -10 }}
//                                             animate={{ opacity: 1, x: 0 }}
//                                             className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm hover:border-red-100 transition-all group"
//                                         >
//                                             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//                                                 <div className="flex-1 min-w-0">
//                                                     <div className="flex items-center gap-2 mb-2">
//                                                         <h4 className="font-bold text-slate-950 text-base truncate">
//                                                             {details.username || `Donor ${donorId}`}
//                                                         </h4>
//                                                         <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${isFinal ? 'bg-emerald-100 text-emerald-700' :
//                                                             isRejected ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
//                                                             }`}>
//                                                             {isFinal ? 'Verified' : isRejected ? 'Declined' : 'Candidate'}
//                                                         </span>
//                                                     </div>

//                                                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-6">
//                                                         <div>
//                                                             <p className="text-[10px] font-bold text-slate-400 uppercase">Blood Type</p>
//                                                             <p className="text-sm font-bold text-red-600">{details.blood_group || 'N/A'}</p>
//                                                         </div>
//                                                         <div>
//                                                             <p className="text-[10px] font-bold text-slate-400 uppercase">Contact</p>
//                                                             <p className="text-sm font-bold text-slate-950">{details.phone || 'N/A'}</p>
//                                                         </div>
//                                                         <div className="col-span-2 sm:col-span-1">
//                                                             <p className="text-[10px] font-bold text-slate-400 uppercase">Sector</p>
//                                                             <p className="text-sm font-bold text-slate-950 truncate">{details.detailed_address || 'Coordinates Locked'}</p>
//                                                         </div>
//                                                     </div>
//                                                 </div>

//                                                 {/* ACTIONS AREA */}
//                                                 <div className="shrink-0 flex sm:flex-col gap-2 w-full sm:w-auto">
//                                                     {isFinal ? (
//                                                         <div className="flex flex-row sm:flex-col gap-2 w-full">
//                                                             <button
//                                                                 onClick={() => openChatWithDonor(donorId)}
//                                                                 className="flex-1 py-2 px-4 bg-slate-950 text-white rounded-lg text-xs font-bold uppercase flex items-center justify-center gap-2 hover:bg-red-600 transition-all shadow-md"
//                                                             >
//                                                                 <MessageSquare size={14} /> Chat
//                                                             </button>
//                                                             <div className="hidden sm:block h-[1px] bg-slate-100 w-full" />
//                                                             <span className="flex-1 text-center py-2 px-4 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold uppercase border border-emerald-100">
//                                                                 Linked
//                                                             </span>
//                                                         </div>
//                                                     ) : isRejected ? (
//                                                         <span className="w-full text-center py-2 px-4 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold uppercase border border-red-100">
//                                                             Rejected
//                                                         </span>
//                                                     ) : isAccepted ? (
//                                                         <div className="flex flex-row sm:flex-col gap-2 w-full">
//                                                             <button
//                                                                 onClick={() => handleApprove(request.id, donorId)}
//                                                                 disabled={isApproving || isRejecting}
//                                                                 className="flex-1 py-2 px-4 bg-emerald-600 text-white rounded-lg text-xs font-bold uppercase hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg shadow-emerald-100"
//                                                             >
//                                                                 {isApproving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Approve'}
//                                                             </button>
//                                                             <button
//                                                                 onClick={() => handleReject(request.id, donorId)}
//                                                                 disabled={isRejecting || isApproving}
//                                                                 className="flex-1 py-2 px-4 bg-white border border-slate-200 text-slate-400 rounded-lg text-xs font-bold uppercase hover:text-red-600 hover:border-red-100 transition-all"
//                                                             >
//                                                                 {isRejecting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Decline'}
//                                                             </button>
//                                                         </div>
//                                                     ) : (
//                                                         <div className="px-4 py-2 bg-slate-50 text-slate-400 rounded-lg text-[10px] font-bold uppercase text-center border border-slate-100">
//                                                             Pending Pulse
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </motion.div>
//                                     );
//                                 })}
//                             </div>
//                         ) : (
//                             <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 mx-2">
//                                 <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
//                                 <h4 className="text-sm font-bold text-slate-900 uppercase">Artery Empty</h4>
//                                 <p className="text-xs text-slate-400 mt-2">No donors have established a link yet.</p>
//                             </div>
//                         )}
//                     </div>

//                     {/* MODAL FOOTER */}
//                     <div className="p-4 bg-slate-50 border-t border-slate-100 shrink-0">
//                         <button
//                             onClick={onClose}
//                             className="w-full py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all"
//                         >
//                             Close Artery Manifest
//                         </button>
//                     </div>
//                 </motion.div>
//             </div>
//         </ModalPortal>
//     );
// };

// // Main Dashboard Component
// const Dashboard = () => {
//     const [userData, setUserData] = useState(null);
//     const [userStatusData, setUserStatusData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [activeTab, setActiveTab] = useState('my-requests');
//     const [showMapModal, setShowMapModal] = useState(false);
//     const [showHelpModal, setShowHelpModal] = useState(false);
//     const [showDonorModal, setShowDonorModal] = useState(false);
//     const [showHelpOffersModal, setShowHelpOffersModal] = useState(false);
//     const [showStatusPopup, setShowStatusPopup] = useState(false);
//     const [selectedRequest, setSelectedRequest] = useState(null);
//     const [mapRouteData, setMapRouteData] = useState(null);
//     const [userLocation, setUserLocation] = useState([23.8041, 90.4152]);

//     const [locationName, setLocationName] = useState('Loading location...');

//     const [myRequests, setMyRequests] = useState([]);
//     const [activeMyGroup, setActiveMyGroup] = useState([]);
//     const [activeOther, setActiveOther] = useState([]);
//     const [helpPosts, setHelpPosts] = useState([]);
//     const [chatRooms, setChatRooms] = useState([]);
//     const navigate = useNavigate();

//     const csrfToken = getCookie('csrftoken');

//     const getHelpOffersCount = (requestId) => {
//         if (!helpPosts || helpPosts.length === 0) return 0;
//         return helpPosts.filter(helpPost => {
//             const helpRequestId = getHelpPostRequestId(helpPost);
//             return helpRequestId === requestId;
//         }).length;
//     };

//     // Fetch all data including the new status counts
//     useEffect(() => {
//         fetchDashboardData();
//         fetchUserStatusCounts();
//         fetchChatRooms();
//     }, []);

//     const fetchDashboardData = async () => {
//         try {
//             setLoading(true);

//             const userRes = await fetch("http://localhost:8000/api/current-user/", {
//                 method: "GET",
//                 credentials: "include",
//             });

//             if (userRes.ok) {
//                 const userData = await userRes.json();
//                 setUserData(userData);

//                 if (userData.latitude && userData.longitude) {
//                     setUserLocation([parseFloat(userData.latitude), parseFloat(userData.longitude)]);
//                 }
//             }

//             const dashboardRes = await fetch("http://localhost:8000/api/dashboard/", {
//                 method: "GET",
//                 credentials: "include",
//             });

//             if (dashboardRes.ok) {
//                 const dashboardData = await dashboardRes.json();
//                 setMyRequests(dashboardData.my_requests || []);
//                 setActiveMyGroup(dashboardData.active_my_group || []);
//                 setActiveOther(dashboardData.active_other || []);
//                 setHelpPosts(dashboardData.help_posts || []);
//             }

//         } catch (error) {
//             console.error('Error fetching dashboard data:', error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const getLocationName = useCallback(async (lat, lng) => {
//         try {
//             const response = await fetch(
//                 `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
//             );

//             if (response.ok) {
//                 const data = await response.json();
//                 if (data.address) {
//                     const {
//                         neighbourhood,
//                         suburb,
//                         road,
//                         quarter,
//                         hamlet,
//                         village,
//                         town,
//                         city,
//                         county,
//                         state,
//                         country
//                     } = data.address;

//                     const location =
//                         neighbourhood ||
//                         suburb ||
//                         road ||
//                         quarter ||
//                         hamlet ||
//                         village ||
//                         town ||
//                         city ||
//                         county ||
//                         'Unknown area';

//                     const district = data.address.municipality || data.address.district || '';

//                     let locationString = location;
//                     if (district && district !== location) {
//                         locationString += `, ${district}`;
//                     }
//                     if (state && state !== location && state !== district) {
//                         locationString += `, ${state}`;
//                     }
//                     if (country) {
//                         locationString += `, ${country}`;
//                     }

//                     if (data.display_name && data.display_name.length < 100) {
//                         const parts = data.display_name.split(',');
//                         if (parts.length > 2) {
//                             return `${parts[0].trim()}, ${parts[1].trim()}, ${parts[2].trim()}`;
//                         }
//                         return data.display_name;
//                     }

//                     return locationString;
//                 }
//             }
//         } catch (error) {
//             console.error('Error getting location name:', error);
//         }

//         // Fallback based on coordinates (Bangladesh cities)
//         if (lat >= 23.7 && lat <= 23.9 && lng >= 90.3 && lng <= 90.5) {
//             return "Dhaka Central, Dhaka, Bangladesh";
//         } else if (lat >= 22.3 && lat <= 22.4 && lng >= 91.7 && lng <= 91.9) {
//             return "Chittagong City, Chittagong, Bangladesh";
//         } else if (lat >= 24.8 && lat <= 25.0 && lng >= 91.8 && lng <= 92.0) {
//             return "Sylhet City, Sylhet, Bangladesh";
//         } else if (lat >= 24.3 && lat <= 24.4 && lng >= 88.5 && lng <= 88.7) {
//             return "Rajshahi City, Rajshahi, Bangladesh";
//         } else if (lat >= 22.8 && lat <= 22.9 && lng >= 89.5 && lng <= 89.6) {
//             return "Khulna City, Khulna, Bangladesh";
//         }

//         return "Unknown Location";
//     }, []);

//     // Fetch user status counts
//     const fetchUserStatusCounts = async () => {
//         try {
//             const response = await fetch("http://localhost:8000/api/user-history/my-status-counts/", {
//                 method: "GET",
//                 credentials: "include",
//                 headers: {
//                     'X-CSRFToken': csrfToken,
//                 }
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 setUserStatusData(data);
//             } else {
//                 console.error('Failed to fetch status counts');
//             }
//         } catch (error) {
//             console.error('Error fetching status counts:', error);
//         }
//     };

//     const fetchChatRooms = async () => {
//         try {
//             const response = await fetch("http://localhost:8000/api/my-chats/", {
//                 method: "GET",
//                 credentials: "include",
//                 headers: {
//                     'X-CSRFToken': csrfToken,
//                 }
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 setChatRooms(data);
//             }
//         } catch (error) {
//             console.error('Error fetching chat rooms:', error);
//         }
//     };

//     const isUserInList = (userId, list) => {
//         if (!list || list.length === 0) return false;
//         if (typeof list[0] === 'number') {
//             return list.includes(userId);
//         }
//         return list.some(item => item.id === userId || item === userId);
//     };

//     const updateLocation = async () => {
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 async (position) => {
//                     const lat = position.coords.latitude;
//                     const lng = position.coords.longitude;

//                     try {
//                         const response = await fetch('http://localhost:8000/api/update-location/', {
//                             method: 'POST',
//                             credentials: 'include',
//                             headers: {
//                                 'Content-Type': 'application/json',
//                                 'X-CSRFToken': csrfToken,
//                             },
//                             body: JSON.stringify({
//                                 latitude: lat,
//                                 longitude: lng
//                             })
//                         });

//                         if (response.ok) {
//                             setUserLocation([lat, lng]);

//                             // Get more precise location name
//                             const name = await getLocationName(lat, lng);
//                             setLocationName(name);

//                             alert('Location updated successfully!');
//                         } else {
//                             throw new Error('Failed to update location');
//                         }
//                     } catch (error) {
//                         console.error('Error updating location:', error);
//                         alert('Failed to update location');
//                     }
//                 },
//                 (error) => {
//                     console.error('Error getting location:', error);
//                     alert('Failed to get location. Please enable location services.');
//                 }
//             );
//         } else {
//             alert('Geolocation is not supported by your browser');
//         }
//     };

//     // Add this after the updateLocation function
//     useEffect(() => {
//         if (userLocation && userLocation.length === 2) {
//             getLocationName(userLocation[0], userLocation[1])
//                 .then(name => setLocationName(name))
//                 .catch(() => setLocationName('Unknown Location'));
//         }
//     }, [userLocation, getLocationName]);

//     const handleLogout = async () => {
//         try {
//             const res = await fetch("http://localhost:8000/api/logout/", {
//                 method: "POST",
//                 credentials: "include",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "X-CSRFToken": csrfToken,
//                 },
//             });

//             if (res.ok) {
//                 window.location.href = "/login";
//             }
//         } catch (err) {
//             console.error(err);
//         }
//     };

//     const canChatWithRequest = (request) => {
//         if (!userData) return false;

//         const userId = userData.id;

//         if (request.requester?.id === userId || request.requester === userId) {
//             return request.final_donors && request.final_donors.length > 0;
//         }

//         if (isUserInList(userId, request.final_donors)) {
//             return true;
//         }

//         return false;
//     };

//     const openChatRoomForRequest = async (request) => {
//         if (!userData) return;

//         try {
//             const userId = userData.id;
//             const isRequester = request.requester?.id === userId || request.requester === userId;

//             let roomId;

//             if (isRequester) {
//                 if (!request.final_donors || request.final_donors.length === 0) {
//                     alert('No approved donors to chat with yet.');
//                     return;
//                 }

//                 const donorId = request.final_donors[0];

//                 const response = await fetch(`http://localhost:8000/api/chat-room/${request.id}/${donorId}/`, {
//                     method: "GET",
//                     credentials: "include",
//                     headers: {
//                         'X-CSRFToken': csrfToken,
//                     }
//                 });

//                 if (response.ok) {
//                     const data = await response.json();
//                     roomId = data.room_id;
//                 }
//             } else {
//                 const requesterId = request.requester?.id || request.requester;

//                 const response = await fetch(`http://localhost:8000/api/chat-room/${request.id}/${userId}/`, {
//                     method: "GET",
//                     credentials: "include",
//                     headers: {
//                         'X-CSRFToken': csrfToken,
//                     }
//                 });

//                 if (response.ok) {
//                     const data = await response.json();
//                     roomId = data.room_id;
//                 }
//             }

//             if (roomId) {
//                 navigate(`/chat/${roomId}`);
//             } else {
//                 alert('Chat room not found. Please make sure you have been approved by the requester.');
//             }
//         } catch (error) {
//             console.error('Error opening chat:', error);
//             alert('Failed to open chat');
//         }
//     };

//     const openAllTheChats = async () => {
//         if (!userData) return;
//         navigate('/my-chats/');
//     };

//     const acceptBloodRequest = async (requestId) => {
//         try {
//             const response = await fetch(`http://localhost:8000/api/accept-blood-request/${requestId}/`, {
//                 method: 'POST',
//                 credentials: 'include',
//                 headers: {
//                     'X-CSRFToken': csrfToken,
//                     'Content-Type': 'application/json',
//                 }
//             });

//             if (response.ok) {
//                 setActiveMyGroup(prev => prev.map(request => {
//                     if (request.id === requestId && userData) {
//                         const userId = userData.id;
//                         const updatedAcceptedDonors = Array.isArray(request.accepted_donors)
//                             ? [...request.accepted_donors, userId]
//                             : [userId];

//                         return {
//                             ...request,
//                             accepted_donors: updatedAcceptedDonors,
//                             accepted_count: updatedAcceptedDonors.length
//                         };
//                     }
//                     return request;
//                 }));

//                 alert('Request accepted successfully! You are now waiting for requester approval.');
//             } else {
//                 const errorData = await response.json();
//                 throw new Error(errorData.error || 'Failed to accept request');
//             }
//         } catch (error) {
//             console.error('Error accepting request:', error);
//             alert(error.message || 'Failed to accept request');
//         }
//     };

//     const ignoreBloodRequest = async (request) => {
//         const requestId = request.id;
//         if (isUserInList(userData.id, request.accepted_donors)) {
//             alert('You have already accepted this request and cannot ignore it.');
//             return;
//         }
//         try {
//             const response = await fetch(`http://localhost:8000/api/ignore-blood-request/${requestId}/`, {
//                 method: 'POST',
//                 credentials: 'include',
//                 headers: {
//                     'X-CSRFToken': csrfToken,
//                     'Content-Type': 'application/json',
//                 }
//             });

//             if (response.ok) {
//                 setActiveMyGroup(prev => prev.filter(req => req.id !== requestId));
//                 setActiveOther(prev => prev.filter(req => req.id !== requestId));
//                 alert('Request ignored successfully!');
//             } else {
//                 const errorData = await response.json();
//                 throw new Error(errorData.error || 'Failed to ignore request');
//             }
//         } catch (error) {
//             console.error('Error ignoring request:', error);
//             alert(error.message || 'Failed to ignore request');
//         }
//     };

//     const approveDonor = async (requestId, donorId) => {
//         const response = await fetch(
//             `http://localhost:8000/api/approve-blood-request/${requestId}/${donorId}/`,
//             {
//                 method: 'POST',
//                 credentials: 'include',
//                 headers: {
//                     'X-CSRFToken': csrfToken,
//                     'Content-Type': 'application/json',
//                 }
//             }
//         );

//         if (response.ok) {
//             setMyRequests(prev =>
//                 prev.map(req =>
//                     req.id === requestId
//                         ? {
//                             ...req,
//                             final_donors: [...(req.final_donors || []), donorId],
//                             accepted_donors: (req.accepted_donors || []).filter(id => id !== donorId),
//                         }
//                         : req
//                 )
//             );

//             setSelectedRequest(prev =>
//                 prev && prev.id === requestId
//                     ? {
//                         ...prev,
//                         final_donors: [...(prev.final_donors || []), donorId],
//                         accepted_donors: (prev.accepted_donors || []).filter(id => id !== donorId),
//                     }
//                     : prev
//             );

//             fetchChatRooms();
//         }
//     };

//     const rejectDonor = async (requestId, donorId) => {
//         try {
//             const response = await fetch(
//                 `http://localhost:8000/api/reject-donor-request/${requestId}/${donorId}/`,
//                 {
//                     method: 'POST',
//                     credentials: 'include',
//                     headers: {
//                         'X-CSRFToken': csrfToken,
//                         'Content-Type': 'application/json',
//                     }
//                 }
//             );

//             if (response.ok) {
//                 setMyRequests(prev =>
//                     prev.map(req =>
//                         req.id === requestId
//                             ? {
//                                 ...req,
//                                 rejected_donors_by_requester: [
//                                     ...(req.rejected_donors_by_requester || []),
//                                     donorId
//                                 ],
//                                 accepted_donors: (req.accepted_donors || []).filter(id => id !== donorId),
//                             }
//                             : req
//                     )
//                 );

//                 setSelectedRequest(prev =>
//                     prev && prev.id === requestId
//                         ? {
//                             ...prev,
//                             rejected_donors_by_requester: [
//                                 ...(prev.rejected_donors_by_requester || []),
//                                 donorId
//                             ],
//                             accepted_donors: (prev.accepted_donors || []).filter(id => id !== donorId),
//                         }
//                         : prev
//                 );

//                 alert('Donor rejected successfully!');
//             } else {
//                 const errorData = await response.json();
//                 throw new Error(errorData.error || 'Failed to reject donor');
//             }
//         } catch (error) {
//             console.error('Error rejecting donor:', error);
//             alert(error.message || 'Failed to reject donor');
//         }
//     };

//     const deleteBloodRequest = async (requestId) => {
//         if (!confirm('Are you sure you want to delete this blood request?')) {
//             return;
//         }

//         try {
//             const response = await fetch(`http://localhost:8000/api/delete-blood-request/${requestId}/`, {
//                 method: 'DELETE',
//                 credentials: 'include',
//                 headers: {
//                     'X-CSRFToken': csrfToken,
//                 }
//             });

//             if (response.ok) {
//                 await fetchDashboardData();
//                 alert('Request deleted successfully!');
//             } else {
//                 const errorData = await response.json();
//                 throw new Error(errorData.error || 'Failed to delete request');
//             }
//         } catch (error) {
//             console.error('Error deleting request:', error);
//             alert(error.message || 'Failed to delete request');
//         }
//     };

//     const createBloodRequest = async (formData) => {
//         try {
//             const response = await fetch('http://localhost:8000/api/create-blood-request/', {
//                 method: 'POST',
//                 credentials: 'include',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'X-CSRFToken': csrfToken,
//                 },
//                 body: JSON.stringify({
//                     ...formData,
//                     urgency: formData.urgency_level
//                 })
//             });

//             if (response.ok) {
//                 await fetchDashboardData();
//                 alert('Blood request created successfully!');
//                 return Promise.resolve();
//             } else {
//                 const errorData = await response.json();
//                 throw new Error(errorData.error || 'Failed to create request');
//             }
//         } catch (error) {
//             console.error('Error creating blood request:', error);
//             alert(error.message || 'Failed to create request');
//             throw error;
//         }
//     };

//     const submitHelpForm = async (formData) => {
//         if (!selectedRequest || !userData) return;

//         try {
//             const response = await fetch(
//                 `http://localhost:8000/api/help-form/${userData.id}/${selectedRequest.requester?.id || selectedRequest.requester_id}/${selectedRequest.id}/`,
//                 {
//                     method: 'POST',
//                     credentials: 'include',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'X-CSRFToken': csrfToken,
//                     },
//                     body: JSON.stringify(formData)
//                 }
//             );

//             if (response.ok) {
//                 const data = await response.json();
//                 alert('Help offer submitted successfully!');
//                 await fetchDashboardData();
//                 return Promise.resolve();
//             } else {
//                 const errorData = await response.json();
//                 throw new Error(errorData.error || 'Failed to submit help offer');
//             }
//         } catch (error) {
//             console.error('Error submitting help form:', error);
//             alert(error.message || 'Failed to submit help offer. Please try again.');
//             throw error;
//         }
//     };

//     const showRequestOnMap = (request) => {
//         if (!request.final_donors || request.final_donors.length === 0) {
//             alert('No donors have been approved for this request yet.');
//             return;
//         }

//         const waypoints = [
//             { lat: userLocation[0], lng: userLocation[1] }
//         ];

//         const numDonors = Math.min(request.final_donors.length, 3);
//         for (let i = 0; i < numDonors; i++) {
//             const offset = 0.01 * (i + 1);
//             waypoints.push({
//                 lat: userLocation[0] + offset,
//                 lng: userLocation[1] + offset
//             });
//         }

//         setMapRouteData({ waypoints });
//         setShowMapModal(true);
//     };

//     const showReceiverOnMap = (request) => {
//         const waypoints = [
//             { lat: userLocation[0], lng: userLocation[1] },
//             {
//                 lat: userLocation[0] + 0.02,
//                 lng: userLocation[1] + 0.015
//             }
//         ];

//         setMapRouteData({ waypoints });
//         setShowMapModal(true);
//     };

//     // Status badge component
//     const StatusBadge = ({ status, acceptedCount }) => {
//         if (status === "Fulfilled") {
//             return (
//                 <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                     <CheckCircle className="w-3 h-3 mr-1" />
//                     Fulfilled
//                 </span>
//             );
//         } else if (acceptedCount == 2) {
//             return (
//                 <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                     <Loader2 className="w-3 h-3 mr-1 animate-spin" />
//                     On Going
//                 </span>
//             );

//         } else if (acceptedCount < 2) {
//             return (
//                 <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                     <Loader2 className="w-3 h-3 mr-1 animate-spin" />
//                     In Progress
//                 </span>
//             );
//         } else {
//             return (
//                 <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
//                     <AlertCircle className="w-3 h-3 mr-1" />
//                     {status || 'Pending'}
//                 </span>
//             );
//         }
//     };

//     // Donor status component
//     const DonorStatus = ({ request }) => {
//         if (!userData) return null;

//         const userId = userData.id;

//         if (isUserInList(userId, request.final_donors)) {
//             return (
//                 <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
//                     <UserCheck className="w-4 h-4 mr-1" />
//                     Confirmed
//                 </span>
//             );
//         } else if (isUserInList(userId, request.accepted_donors)) {
//             if (isUserInList(userId, request.rejected_donors_by_requester)) {
//                 return (
//                     <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
//                         <UserX className="w-4 h-4 mr-1" />
//                         Rejected
//                     </span>
//                 );
//             } else {
//                 return (
//                     <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
//                         <Loader2 className="w-4 h-4 mr-1 animate-spin" />
//                         Waiting Approval
//                     </span>
//                 );
//             }
//         } else if (isUserInList(userId, request.request_ignored_by_donors)) {
//             return (
//                 <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
//                     <X className="w-4 h-4 mr-1" />
//                     Ignored
//                 </span>
//             );
//         }
//         return null;
//     };

//     // Function to check if user can accept a request
//     const canAcceptRequest = (request) => {
//         if (!userData) return false;

//         const userId = userData.id;

//         return !isUserInList(userId, request.accepted_donors) &&
//             !isUserInList(userId, request.final_donors) &&
//             !isUserInList(userId, request.rejected_donors_by_requester) &&
//             !isUserInList(userId, request.request_ignored_by_donors) &&
//             (request.accepted_count || 0) < 2;
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
//                 <div className="text-center">
//                     <div className="relative">
//                         <Heart className="w-16 h-16 text-red-500 animate-pulse mx-auto" />
//                         <Loader2 className="w-8 h-8 animate-spin text-blue-600 absolute -top-2 -right-2" />
//                     </div>
//                     <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
//                 </div>
//             </div>
//         );
//     }

//     // Get user's blood group
//     const userBloodGroup = userData?.donorprofile?.blood_group || userData?.blood_group || 'N/A';

//     return (
//         <div className="min-h-screen bg-transparent">
//             <section className="relative overflow-hidden">
//                 {/* GSAP BACKGROUND: BIO-BLOOM EFFECT */}
//                 <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
//                     <div className="serum-blob absolute top-[-5%] left-[-5%] w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[100px]" />
//                     <div className="serum-blob absolute bottom-[10%] right-[10%] w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-[80px]" />
//                 </div>

//                 <div className="relative max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10">
//                     <motion.div
//                         initial={{ opacity: 0, y: 30 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
//                         className="grid grid-cols-1 lg:grid-cols-4 gap-8"
//                     >
//                         {/* MAIN PROFILE CAPSULE (Takes 3 columns on desktop) */}
//                         <div className="lg:col-span-3">
//                             <div className="bg-white/60 backdrop-blur-2xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.02)] p-8 lg:p-10 border border-white flex flex-col relative overflow-hidden">

//                                 {/* Welcome Artery Header */}
//                                 <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 mb-12">
//                                     <div className="text-center md:text-left">
//                                         <motion.div
//                                             initial={{ opacity: 0, x: -20 }}
//                                             animate={{ opacity: 1, x: 0 }}
//                                             transition={{ delay: 0.2 }}
//                                             className="flex items-center gap-3 justify-center md:justify-start mb-2"
//                                         >
//                                             <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg shadow-red-200">
//                                                 Artery Verified
//                                             </span>
//                                             <div className="flex items-center gap-1">
//                                                 <Star className="w-3 h-3 text-amber-500 fill-current" />
//                                                 <span className="text-[10px] font-bold text-slate-400 uppercase">Elite Donor</span>
//                                             </div>
//                                         </motion.div>
//                                         <h1 className="text-4xl lg:text-5xl font-bold text-black tracking-tighter leading-none">
//                                             Welcome, <span className="text-red-600">{userData?.username}</span>
//                                         </h1>
//                                         <p className="text-slate-500 mt-3 font-medium flex items-center gap-2 justify-center md:justify-start">
//                                             <Activity className="w-4 h-4 text-emerald-500" />
//                                             Your vitals are stable. Ready to save lives today.
//                                         </p>
//                                     </div>

//                                     {/* Living Heart Biometric */}
//                                     <div className="relative group shrink-0">
//                                         <motion.div
//                                             animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
//                                             transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
//                                             className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-700 rounded-[2rem] flex items-center justify-center shadow-[0_20px_40px_rgba(220,38,38,0.3)] border-4 border-white"
//                                         >
//                                             <Heart className="w-12 h-12 text-white fill-current" />
//                                         </motion.div>
//                                         <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform">
//                                             <Trophy className="w-5 h-5 text-amber-500" />
//                                         </div>
//                                         <div className="absolute -inset-4 bg-red-600/10 rounded-full blur-2xl -z-10 animate-pulse" />
//                                     </div>
//                                 </div>

//                                 {/* VITAL SIGNS GRID (Poppins inherited) */}
//                                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-auto">
//                                     <div className="bg-white border border-slate-100 p-5 rounded-[2rem] shadow-sm hover:shadow-md transition-all group overflow-hidden">
//                                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Blood Type</p>
//                                         <p className="text-3xl font-bold text-black group-hover:text-red-600 transition-colors">{userBloodGroup}</p>
//                                         <Droplets className="absolute -right-2 -bottom-2 w-12 h-12 text-red-600/5" />
//                                     </div>

//                                     <div className="bg-white border border-slate-100 p-5 rounded-[2rem] shadow-sm hover:shadow-md transition-all group overflow-hidden">
//                                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">My Requests</p>
//                                         <p className="text-3xl font-bold text-black group-hover:text-blue-600 transition-colors">{myRequests.length}</p>
//                                         <ClipboardList className="absolute -right-2 -bottom-2 w-12 h-12 text-blue-600/5" />
//                                     </div>

//                                     <div className="bg-white border border-slate-100 p-5 rounded-[2rem] shadow-sm hover:shadow-md transition-all group overflow-hidden">
//                                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Live Channels</p>
//                                         <p className="text-3xl font-bold text-black group-hover:text-purple-600 transition-colors">{chatRooms.length}</p>
//                                         <MessageSquare className="absolute -right-2 -bottom-2 w-12 h-12 text-purple-600/5" />
//                                     </div>

//                                     <div className="bg-slate-950 p-5 rounded-[2.2rem] shadow-xl group overflow-hidden">
//                                         <div className="flex items-center gap-2 mb-2">
//                                             <MapPin className="w-4 h-4 text-red-500 animate-pulse" />
//                                             <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Live Artery</span>
//                                         </div>
//                                         <p className="text-xs font-bold text-white leading-tight truncate mb-1">{locationName}</p>
//                                         <p className="text-[10px] font-medium text-slate-500 font-mono">
//                                             {userLocation[0].toFixed(2)}, {userLocation[1].toFixed(2)}
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* COMMAND CENTER: QUICK ACTIONS */}
//                         <div className="lg:col-span-1">
//                             <div className="h-full bg-slate-900 rounded-[3rem] p-6 shadow-2xl relative overflow-hidden group">
//                                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />

//                                 <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
//                                     <Zap className="w-4 h-4 text-red-500 fill-current" />
//                                     Tactical Hub
//                                 </h3>

//                                 <div className="space-y-4 relative z-10">
//                                     <motion.button
//                                         whileHover={{ scale: 1.02, x: 5 }}
//                                         whileTap={{ scale: 0.98 }}
//                                         onClick={() => setShowStatusPopup(true)}
//                                         className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-3xl flex items-center gap-4 transition-all border border-white/5"
//                                     >
//                                         <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0">
//                                             <ChartBar className="w-5 h-5 text-slate-900" />
//                                         </div>
//                                         <div className="text-left">
//                                             <p className="text-xs font-bold text-white uppercase tracking-tight">Diagnostic Stats</p>
//                                             <p className="text-[10px] text-slate-400">View ID: {userStatusData?.user_id}</p>
//                                         </div>
//                                     </motion.button>

//                                     <motion.button
//                                         whileHover={{ scale: 1.02, x: 5 }}
//                                         whileTap={{ scale: 0.98 }}
//                                         onClick={() => navigate('/dashboard/my-chats/')}
//                                         className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-3xl flex items-center gap-4 transition-all border border-white/5"
//                                     >
//                                         <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center shrink-0">
//                                             <MessageSquare className="w-5 h-5 text-white" />
//                                         </div>
//                                         <div className="text-left">
//                                             <p className="text-xs font-bold text-white uppercase tracking-tight">Chat Area</p>
//                                             <p className="text-[10px] text-slate-400">{chatRooms.length} Active Feeds</p>
//                                         </div>
//                                     </motion.button>

//                                     <motion.button
//                                         whileHover={{ scale: 1.02, x: 5 }}
//                                         whileTap={{ scale: 0.98 }}
//                                         onClick={updateLocation}
//                                         className="w-full p-4 bg-emerald-600 hover:bg-emerald-700 rounded-3xl flex items-center gap-4 transition-all shadow-lg shadow-emerald-900/40"
//                                     >
//                                         <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
//                                             <Navigation className="w-5 h-5 text-white" />
//                                         </div>
//                                         <div className="text-left">
//                                             <p className="text-xs font-bold text-white uppercase tracking-tight">Relocate Artery</p>
//                                             <p className="text-[10px] text-emerald-200">Sync Live GPS</p>
//                                         </div>
//                                     </motion.button>

//                                     <motion.button
//                                         whileHover={{ scale: 1.02 }}
//                                         whileTap={{ scale: 0.98 }}
//                                         onClick={() => window.location.reload()}
//                                         className="w-full py-4 mt-6 bg-white/5 hover:bg-white text-white hover:text-slate-900 rounded-[2rem] text-[10px] font-bold uppercase tracking-[0.3em] transition-all border border-white/10"
//                                     >
//                                         <Loader2 className="w-3 h-3 inline mr-2 animate-spin" />
//                                         Refresh System
//                                     </motion.button>
//                                 </div>
//                             </div>
//                         </div>
//                     </motion.div>
//                 </div>
//             </section>

//             {/* Main Dashboard Tabs */}
//             <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 pb-20">
//                 {/* Tab Navigation */}
//                 <div className="mb-10 relative z-20">
//                     <div className="flex flex-col sm:flex-row gap-2 bg-white/60 backdrop-blur-2xl  rounded-2xl border border-white shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
//                         {[
//                             {
//                                 id: 'my-requests',
//                                 label: 'My Requests',
//                                 count: myRequests.length,
//                                 icon: <ClipboardList size={16} />
//                             },
//                             {
//                                 id: 'my-group',
//                                 label: `My Blood Match (${userBloodGroup})`,
//                                 count: activeMyGroup.length,
//                                 icon: <Activity size={16} />
//                             },
//                             {
//                                 id: 'other-group',
//                                 label: 'Other Types',
//                                 count: activeOther.length,
//                                 icon: <Users size={16} />
//                             }
//                         ].map((tab) => {
//                             const isActive = activeTab === tab.id;
//                             return (
//                                 <button
//                                     key={tab.id}
//                                     onClick={() => setActiveTab(tab.id)}
//                                     className={`relative flex-1 group flex items-center justify-center gap-3 py-4 px-6 rounded-[1.6rem] transition-all duration-500 overflow-hidden ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-600'
//                                         }`}
//                                 >
//                                     {/* LIQUID FLOW BACKGROUND */}
//                                     {isActive && (
//                                         <motion.div
//                                             layoutId="activeArteryTab"
//                                             className="absolute inset-0 bg-slate-900 shadow-xl shadow-slate-200 z-0"
//                                             style={{ borderRadius: '1.6rem' }}
//                                             transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
//                                         />
//                                     )}

//                                     {/* TAB CONTENT */}
//                                     <span className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
//                                         {React.cloneElement(tab.icon, {
//                                             className: isActive ? "text-red-500" : "text-slate-300 group-hover:text-red-400"
//                                         })}
//                                     </span>

//                                     <span className="relative z-10 text-xs font-bold uppercase tracking-widest truncate">
//                                         {tab.label}
//                                     </span>

//                                     {/* DIGITAL COUNTER BADGE */}
//                                     <div className={`relative z-10 ml-2 px-2.5 py-1 rounded-full text-[10px] font-black transition-all duration-300 ${isActive
//                                         ? 'bg-red-600 text-white shadow-lg'
//                                         : 'bg-slate-100 text-slate-400 group-hover:bg-red-50 group-hover:text-red-600'
//                                         }`}>
//                                         {tab.count.toString().padStart(2, '0')}
//                                     </div>

//                                     {/* ACTIVE GLOW DOT */}
//                                     {isActive && (
//                                         <motion.div
//                                             layoutId="activeDot"
//                                             className="absolute bottom-2 w-1 h-1 bg-red-500 rounded-full"
//                                         />
//                                     )}
//                                 </button>
//                             );
//                         })}
//                     </div>
//                 </div>

//                 {/* Content Area */}
//                 <AnimatePresence mode="wait">
//                     {activeTab === 'my-requests' && (
//                         <motion.div
//                             key="my-requests"
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             exit={{ opacity: 0, y: -20 }}
//                         >


//                             <div className="mb-6 flex flex-row items-center justify-between gap-4">
//                                 {/* TEXT SECTION */}
//                                 <div>
//                                     <h2 className="text-2xl font-bold text-black leading-tight">
//                                         My <span className="text-red-600">Blood</span> Requests
//                                     </h2>
//                                     <p className="text-sm font-medium text-slate-500">
//                                         Manage your blood donation requests
//                                     </p>
//                                 </div>

//                                 {/* ACTION BUTTON */}
//                                 <Link to="/dashboard/emergencyBlood">
//                                     <motion.button
//                                         whileHover={{ backgroundColor: "#000" }} // Tactical switch to Solid Black
//                                         whileTap={{ scale: 0.95 }}
//                                         className="flex items-center px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-100 transition-all duration-300 group"
//                                     >
//                                         <Plus className="w-4 h-4 mr-2 transition-transform group-hover:rotate-90" />
//                                         New Request
//                                     </motion.button>
//                                 </Link>
//                             </div>



//                             {myRequests.length > 0 ? (
//                                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
//                                     {myRequests.map((request, idx) => (
//                                         <motion.div
//                                             key={request.id}
//                                             initial={{ opacity: 0, y: 15 }}
//                                             animate={{ opacity: 1, y: 0 }}
//                                             transition={{ delay: idx * 0.05 }}
//                                             className="group h-full"
//                                         >
//                                             {/* CARD BODY: COMPACT BIO-CAPSULE */}
//                                             <div className="relative h-full bg-white/70 backdrop-blur-xl rounded-3xl border border-slate-200 overflow-hidden p-5 flex flex-col shadow-sm transition-all hover:shadow-md hover:border-red-200">

//                                                 {/* HEADER: ID & BLOOD GROUP (Consolidated) */}
//                                                 <div className="flex justify-between items-start mb-4">
//                                                     <div className="space-y-1.5">
//                                                         <div className="flex items-center gap-2">
//                                                             <span className="text-xs font-bold text-slate-400">#{request.id}</span>
//                                                             {request.urgency && (
//                                                                 <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${request.urgency === 'emergency'
//                                                                     ? 'bg-red-600 text-white animate-pulse'
//                                                                     : 'bg-amber-500 text-white'
//                                                                     }`}>
//                                                                     {request.urgency}
//                                                                 </span>
//                                                             )}
//                                                         </div>
//                                                         <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
//                                                             <Calendar className="w-3.5 h-3.5 text-red-500" />
//                                                             {request.created_at_12h}
//                                                         </div>
//                                                     </div>

//                                                     {/* BLOOD GROUP BOX */}
//                                                     <div className="relative shrink-0">
//                                                         <div className="w-14 h-14 bg-slate-900 rounded-2xl flex flex-col items-center justify-center shadow-lg group-hover:bg-red-600 transition-colors duration-300">
//                                                             <span className="text-xl font-bold text-white leading-none">
//                                                                 {request.blood_group}
//                                                             </span>
//                                                             <span className="text-[8px] font-bold text-white/40 uppercase mt-0.5">Type</span>
//                                                         </div>
//                                                     </div>
//                                                 </div>

//                                                 {/* DONOR PROGRESS (Compact) */}
//                                                 <div className="mb-4 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100">
//                                                     <div className="flex justify-between items-center mb-2 text-[11px]">
//                                                         <div className="flex items-center gap-2">
//                                                             <StatusBadge status={request.status} acceptedCount={request.accepted_count} />
//                                                             <span className="font-bold text-slate-400">ARTERY</span>
//                                                         </div>
//                                                         <span className="font-bold text-slate-700">
//                                                             {request.accepted_count || 0}/2 Donors
//                                                         </span>
//                                                     </div>
//                                                     <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
//                                                         <motion.div
//                                                             initial={{ width: 0 }}
//                                                             animate={{ width: `${((request.accepted_count || 0) / 2) * 100}%` }}
//                                                             className={`h-full transition-all duration-1000 ${request.accepted_count >= 2 ? 'bg-emerald-500' : 'bg-red-600'
//                                                                 }`}
//                                                         />
//                                                     </div>
//                                                 </div>

//                                                 {/* DETAILS: TIGHT LIST */}
//                                                 <div className="space-y-2.5 mb-5 flex-1">
//                                                     {request.full_name && (
//                                                         <div className="flex items-center gap-3">
//                                                             <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center shrink-0">
//                                                                 <User className="w-4 h-4 text-slate-400" />
//                                                             </div>
//                                                             <span className="text-sm font-semibold text-slate-700 truncate">{request.full_name}</span>
//                                                         </div>
//                                                     )}

//                                                     {request.detail_address && (
//                                                         <div className="flex items-start gap-3">
//                                                             <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center shrink-0">
//                                                                 <MapPin className="w-4 h-4 text-slate-400" />
//                                                             </div>
//                                                             <span className="text-[13px] font-medium text-slate-600 leading-snug line-clamp-2">{request.detail_address}</span>
//                                                         </div>
//                                                     )}

//                                                     {request.contact_number && (
//                                                         <div className="flex items-center gap-3">
//                                                             <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center shrink-0">
//                                                                 <Phone className="w-4 h-4 text-emerald-500" />
//                                                             </div>
//                                                             <span className="text-sm font-semibold text-slate-700">{request.contact_number}</span>
//                                                         </div>
//                                                     )}
//                                                 </div>

//                                                 {/* ACTION BUTTONS: COMPACT GRID */}
//                                                 <div className="space-y-2 pt-4 border-t border-slate-100">
//                                                     {(request.accepted_donors?.length > 0 || request.donors?.length > 0) ? (
//                                                         <div className="flex flex-col gap-2">
//                                                             <button
//                                                                 onClick={() => {
//                                                                     setSelectedRequest(request);
//                                                                     setShowDonorModal(true);
//                                                                 }}
//                                                                 className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 hover:bg-red-600 transition-colors"
//                                                             >
//                                                                 <Users size={14} /> Manage Donors ({request.accepted_donors?.length || 0})
//                                                             </button>

//                                                             {request.final_donors?.length > 0 && (
//                                                                 <button
//                                                                     onClick={() => showRequestOnMap(request)}
//                                                                     className="w-full py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 hover:bg-slate-50"
//                                                                 >
//                                                                     <Map size={14} className="text-red-600" /> Location
//                                                                 </button>
//                                                             )}
//                                                         </div>
//                                                     ) : (
//                                                         <div className="text-center py-3 bg-red-50 rounded-xl border border-dashed border-red-100">
//                                                             <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Awaiting Responses</p>
//                                                         </div>
//                                                     )}

//                                                     <div className="flex gap-2">
//                                                         <button
//                                                             onClick={() => {
//                                                                 setSelectedRequest(request);
//                                                                 setShowHelpOffersModal(true);
//                                                             }}
//                                                             className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-bold uppercase flex items-center justify-center gap-2 hover:bg-amber-500 hover:text-white transition-all"
//                                                         >
//                                                             <Zap size={14} /> Help ({getHelpOffersCount(request.id)})
//                                                         </button>

//                                                         <button
//                                                             onClick={() => deleteBloodRequest(request.id)}
//                                                             className="px-3 py-2.5 bg-white border border-slate-200 text-slate-300 hover:text-red-600 hover:border-red-200 rounded-xl transition-all"
//                                                         >
//                                                             <Trash2 size={16} />
//                                                         </button>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </motion.div>
//                                     ))}
//                                 </div>
//                             ) : (
//                                 <motion.div
//                                     initial={{ opacity: 0, scale: 0.95 }}
//                                     animate={{ opacity: 1, scale: 1 }}
//                                     className="text-center py-20 bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white shadow-[inner_0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden"
//                                 >
//                                     {/* SUBTLE SCANNING EFFECT BACKGROUND */}
//                                     <div className="absolute inset-0 pointer-events-none">
//                                         <motion.div
//                                             animate={{ y: [-100, 400] }}
//                                             transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
//                                             className="w-full h-[2px] bg-gradient-to-r from-transparent via-red-500/10 to-transparent"
//                                         />
//                                     </div>

//                                     <div className="relative z-10 max-w-md mx-auto px-6">
//                                         {/* PULSING BIOMETRIC ICON */}
//                                         <div className="relative w-24 h-24 mx-auto mb-8">
//                                             <motion.div
//                                                 animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
//                                                 transition={{ repeat: Infinity, duration: 2 }}
//                                                 className="absolute inset-0 bg-red-100 rounded-full blur-2xl"
//                                             />
//                                             <div className="relative w-full h-full bg-white rounded-[2rem] shadow-xl border border-slate-50 flex items-center justify-center">
//                                                 <Heart className="w-12 h-12 text-red-600 fill-current animate-pulse" />

//                                                 {/* SMALL STATUS INDICATOR */}
//                                                 <div className="absolute -top-1 -right-1 w-6 h-6 bg-slate-950 rounded-lg flex items-center justify-center border-2 border-white">
//                                                     <X size={12} className="text-white" />
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         {/* TEXT CONTENT: SOLID BLACK POPPINS */}
//                                         <h3 className="text-2xl font-black text-black uppercase tracking-tighter mb-4">
//                                             Artery Feed Empty
//                                         </h3>
//                                         <p className="text-[13px] font-bold text-slate-500 leading-relaxed uppercase tracking-widest mb-10">
//                                             No active blood requests detected. Your terminal is currently on standby. Start a new signal to find matching donor nodes.
//                                         </p>

//                                         {/* TACTICAL ACTION BUTTON */}
//                                         <Link to="/dashboard/emergencyBlood">
//                                             <motion.button
//                                                 whileHover={{ scale: 1.05, backgroundColor: "#000" }}
//                                                 whileTap={{ scale: 0.95 }}
//                                                 className="inline-flex items-center px-10 py-4 bg-red-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-red-200 transition-all group"
//                                             >
//                                                 <Plus className="w-4 h-4 mr-3 transition-transform group-hover:rotate-90" />
//                                                 Find Donors
//                                             </motion.button>
//                                         </Link>
//                                     </div>

//                                     {/* WATERMARK ICON */}
//                                     <Droplets size={200} className="absolute -bottom-20 -right-20 text-slate-900/[0.02] -rotate-12" />
//                                 </motion.div>
//                             )}
//                         </motion.div>
//                     )}

//                     {activeTab === 'my-group' && (
//                         <motion.div
//                             key="my-group"
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             exit={{ opacity: 0, y: -20 }}
//                         >
//                             <div className="mb-6">
//                                 <h2 className="text-2xl font-bold text-gray-900">Emergency Requests ({userBloodGroup})</h2>
//                                 <p className="text-gray-600">Blood requests matching your blood type</p>
//                             </div>

//                             {activeMyGroup.length > 0 ? (
//                                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
//                                     {activeMyGroup.map((request, idx) => (
//                                         <motion.div
//                                             key={request.id}
//                                             initial={{ opacity: 0, y: 10 }}
//                                             animate={{ opacity: 1, y: 0 }}
//                                             transition={{ delay: idx * 0.05 }}
//                                             whileHover={{ y: -6, scale: 1.01 }}
//                                             className="group h-full"
//                                         >
//                                             {/* MEDICAL EMERGENCY CARD - PREMIUM DESIGN */}
//                                             <div className="relative h-full bg-gradient-to-br from-white to-white/95 rounded-2xl border border-slate-200/80 p-5 flex flex-col transition-all duration-300 hover:border-red-300/50 hover:shadow-2xl hover:shadow-red-100/30 shadow-sm shadow-slate-100 overflow-hidden">

//                                                 {/* EMERGENCY STRIPE */}
//                                                 {request.urgency === 'emergency' && (
//                                                     <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-red-500 to-red-600 animate-pulse"></div>
//                                                 )}

//                                                 {/* HEADER: MEDICAL PROFILE */}
//                                                 <div className="flex justify-between items-start mb-4">
//                                                     <div className="flex items-center gap-3">
//                                                         <div className="relative">
//                                                             <div className="w-11 h-11 bg-gradient-to-br from-slate-50 to-white rounded-xl flex items-center justify-center border border-slate-200/80 group-hover:border-red-200 transition-colors shadow-sm">
//                                                                 <User className="w-5 h-5 text-slate-700 group-hover:text-red-600 transition-colors" />
//                                                             </div>
//                                                             {/* ONLINE STATUS DOT */}
//                                                             {Math.random() > 0.5 && (
//                                                                 <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
//                                                             )}
//                                                         </div>
//                                                         <div>
//                                                             <h3 className="text-[15px] font-bold text-slate-900 leading-tight">
//                                                                 {request.requester?.username || 'Anonymous'}
//                                                             </h3>
//                                                             <div className="flex items-center gap-2 mt-1">
//                                                                 <p className="text-[11px] font-medium text-slate-500">
//                                                                     {request.created_at_12h}
//                                                                 </p>
//                                                                 <span className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded-full uppercase">
//                                                                     ID: #{request.id}
//                                                                 </span>
//                                                             </div>
//                                                         </div>
//                                                     </div>

//                                                     {/* BLOOD TYPE - MEDICAL BADGE */}
//                                                     <div className="relative">
//                                                         <div className="w-14 h-14 bg-gradient-to-br from-slate-900 to-black rounded-xl flex flex-col items-center justify-center shadow-lg group-hover:from-red-700 group-hover:to-red-900 transition-all duration-300">
//                                                             <span className="text-xl font-black text-white leading-none tracking-tight">{request.blood_group}</span>
//                                                             <span className="text-[7px] font-bold text-white/60 uppercase tracking-widest mt-0.5">BLOOD</span>
//                                                         </div>
//                                                         {/* DONOR COUNT BADGE */}
//                                                         <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-white border-2 border-slate-900 rounded-full flex items-center justify-center shadow-md">
//                                                             <span className="text-[10px] font-black text-slate-900">{(request.accepted_count || 0)}/2</span>
//                                                         </div>
//                                                     </div>
//                                                 </div>

//                                                 {/* STATUS & URGENCY INDICATOR */}
//                                                 <div className="flex items-center gap-2 mb-4">
//                                                     <DonorStatus request={request} />

//                                                     {request.urgency === 'emergency' && (
//                                                         <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-50 to-red-100/50 border border-red-200 rounded-full">
//                                                             <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
//                                                             <span className="text-[10px] font-black text-red-700 uppercase tracking-wider">EMERGENCY</span>
//                                                         </div>
//                                                     )}
//                                                 </div>

//                                                 {/* PATIENT INFORMATION - MEDICAL CHART STYLE */}
//                                                 <div className="space-y-3 mb-5 flex-1">
//                                                     {request.full_name && (
//                                                         <div className="flex items-center gap-3 p-2.5 bg-slate-50/80 rounded-xl border border-slate-100">
//                                                             <div className="w-8 h-8 bg-gradient-to-br from-red-50 to-red-100 rounded-lg flex items-center justify-center">
//                                                                 <Activity className="w-4 h-4 text-red-600" />
//                                                             </div>
//                                                             <div className="flex-1">
//                                                                 <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Patient</p>
//                                                                 <p className="text-sm font-bold text-slate-900 truncate">{request.full_name}</p>
//                                                             </div>
//                                                         </div>
//                                                     )}

//                                                     {request.detail_address && (
//                                                         <div className="flex items-start gap-3 p-2.5 bg-slate-50/80 rounded-xl border border-slate-100">
//                                                             <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
//                                                                 <MapPin className="w-4 h-4 text-blue-600" />
//                                                             </div>
//                                                             <div className="flex-1 min-w-0">
//                                                                 <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Location</p>
//                                                                 <p className="text-[13px] font-semibold text-slate-900 line-clamp-1">{request.detail_address}</p>
//                                                             </div>
//                                                         </div>
//                                                     )}

//                                                     {request.contact_number && (
//                                                         <div className="flex items-center gap-3 p-2.5 bg-slate-50/80 rounded-xl border border-slate-100">
//                                                             <div className="w-8 h-8 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg flex items-center justify-center">
//                                                                 <Phone className="w-4 h-4 text-emerald-600" />
//                                                             </div>
//                                                             <div className="flex-1">
//                                                                 <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Contact</p>
//                                                                 <p className="text-sm font-black text-slate-900">{request.contact_number}</p>
//                                                             </div>
//                                                         </div>
//                                                     )}

//                                                     {request.description && (
//                                                         <div className="p-3 bg-gradient-to-br from-amber-50/50 to-amber-100/30 rounded-xl border border-amber-100">
//                                                             <div className="flex items-center gap-2 mb-1">
//                                                                 <AlertCircle className="w-4 h-4 text-amber-600" />
//                                                                 <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">Additional Notes</span>
//                                                             </div>
//                                                             <p className="text-xs text-slate-700 line-clamp-2 italic pl-6">{request.description}</p>
//                                                         </div>
//                                                     )}
//                                                 </div>

//                                                 {/* ACTION BUTTONS - MEDICAL PROTOCOL STYLE */}
//                                                 <div className="space-y-2.5 pt-4 border-t border-slate-100/80">
//                                                     {/* PRIMARY ACTIONS */}
//                                                     <div className="flex gap-2">
//                                                         {canAcceptRequest(request) && (
//                                                             <motion.button
//                                                                 whileHover={{ scale: 1.03 }}
//                                                                 whileTap={{ scale: 0.97 }}
//                                                                 onClick={() => acceptBloodRequest(request.id)}
//                                                                 className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wide hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-md hover:shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
//                                                             >
//                                                                 <CheckCircle className="w-4 h-4" />
//                                                                 Accept Request
//                                                             </motion.button>
//                                                         )}

//                                                         {canChatWithRequest(request) && (
//                                                             <motion.button
//                                                                 whileHover={{ scale: 1.03 }}
//                                                                 whileTap={{ scale: 0.97 }}
//                                                                 onClick={() => openChatRoomForRequest(request)}
//                                                                 className="flex-1 py-3 bg-gradient-to-r from-slate-900 to-black text-white rounded-xl text-xs font-black uppercase tracking-wide hover:from-red-700 hover:to-red-900 transition-all shadow-md hover:shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
//                                                             >
//                                                                 <MessageSquare className="w-4 h-4" />
//                                                                 Medical Hub
//                                                             </motion.button>
//                                                         )}
//                                                     </div>

//                                                     {/* SECONDARY ACTIONS */}
//                                                     <div className="flex gap-2">
//                                                         <motion.button
//                                                             whileHover={{ scale: 1.02 }}
//                                                             whileTap={{ scale: 0.98 }}
//                                                             onClick={() => ignoreBloodRequest(request)}
//                                                             className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-wide hover:border-red-200 hover:text-red-600 hover:bg-red-50/30 transition-all flex items-center justify-center gap-2"
//                                                         >
//                                                             <X className="w-3.5 h-3.5" />
//                                                             Ignore Case
//                                                         </motion.button>

//                                                         <motion.button
//                                                             whileHover={{ scale: 1.05 }}
//                                                             whileTap={{ scale: 0.95 }}
//                                                             onClick={() => showReceiverOnMap(request)}
//                                                             className="px-4 py-2.5 bg-gradient-to-br from-slate-50 to-white border border-slate-200 text-slate-700 rounded-xl hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all shadow-sm"
//                                                             title="View on Medical Map"
//                                                         >
//                                                             <div className="flex items-center gap-1.5">
//                                                                 <Map className="w-4 h-4" />
//                                                                 <span className="text-[10px] font-bold uppercase">Map</span>
//                                                             </div>
//                                                         </motion.button>
//                                                     </div>

//                                                     {/* DISTANCE INDICATOR (Optional - if you have distance data) */}
//                                                     {request.distance && (
//                                                         <div className="pt-2 border-t border-slate-100">
//                                                             <div className="flex items-center justify-between">
//                                                                 <div className="flex items-center gap-1.5">
//                                                                     <Navigation className="w-3.5 h-3.5 text-slate-400" />
//                                                                     <span className="text-[10px] font-medium text-slate-500 uppercase">Distance</span>
//                                                                 </div>
//                                                                 <span className="text-sm font-black text-slate-900">{request.distance} km</span>
//                                                             </div>
//                                                         </div>
//                                                     )}
//                                                 </div>

//                                                 {/* CARD FOOTER DECORATION */}
//                                                 <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-slate-100 to-transparent opacity-50 group-hover:via-red-100 transition-colors"></div>
//                                             </div>
//                                         </motion.div>
//                                     ))}
//                                 </div>
//                             ) : (
//                                 <motion.div
//                                     initial={{ opacity: 0, scale: 0.98 }}
//                                     animate={{ opacity: 1, scale: 1 }}
//                                     className="text-center py-16 bg-white/40 backdrop-blur-md rounded-2xl border border-white shadow-sm relative overflow-hidden"
//                                 >
//                                     {/* SCANNING LINE ANIMATION */}
//                                     <div className="absolute inset-0 pointer-events-none opacity-20">
//                                         <motion.div
//                                             animate={{ y: [-200, 400] }}
//                                             transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
//                                             className="w-full h-[1px] bg-red-500 shadow-[0_0_10px_red]"
//                                         />
//                                     </div>

//                                     <div className="relative z-10 max-w-md mx-auto px-6">
//                                         {/* PULSING SIGNAL ICON */}
//                                         <div className="relative w-16 h-16 mx-auto mb-6">
//                                             <motion.div
//                                                 animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
//                                                 transition={{ repeat: Infinity, duration: 2 }}
//                                                 className="absolute inset-0 bg-red-100 rounded-full blur-xl"
//                                             />
//                                             <div className="relative w-full h-full bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center">
//                                                 <Activity className="w-8 h-8 text-slate-300" />

//                                                 {/* LIVE SCAN DOT */}
//                                                 <div className="absolute top-2 right-2 flex h-2 w-2">
//                                                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
//                                                     <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
//                                                 </div>
//                                             </div>
//                                         </div>

//                                         {/* TEXT CONTENT: SOLID BLACK POPPINS */}
//                                         <h3 className="text-xl font-bold text-black uppercase tracking-tight mb-2">
//                                             No Active Signals
//                                         </h3>
//                                         <p className="text-sm font-medium text-slate-500 leading-relaxed">
//                                             The artery is currently clear. No emergency requests matching your profile were detected in this sector.
//                                         </p>

//                                         {/* REFRESH STATUS */}
//                                         <div className="mt-8 inline-flex items-center gap-2 px-4 py-1.5 bg-slate-900/5 rounded-full border border-slate-200/50">
//                                             <Loader2 size={12} className="text-slate-400 animate-spin" />
//                                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                                                 Monitoring Artery...
//                                             </span>
//                                         </div>
//                                     </div>

//                                     {/* DECORATIVE BACKGROUND ICON */}
//                                     <Zap size={150} className="absolute -bottom-10 -right-10 text-slate-900/[0.02] -rotate-12" />
//                                 </motion.div>
//                             )}
//                         </motion.div>
//                     )}

//                     {activeTab === 'other-group' && (
//                         <motion.div
//                             key="other-group"
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             exit={{ opacity: 0, y: -20 }}
//                         >
//                             <div className="mb-6">
//                                 <h2 className="text-2xl font-bold text-gray-900">Other Blood Type Requests</h2>
//                                 <p className="text-gray-600">You can still offer help for other blood types</p>
//                             </div>

//                             {activeOther.length > 0 ? (
//                                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                                     {activeOther.map((request, idx) => (
//                                         <motion.div
//                                             key={request.id}
//                                             initial={{ opacity: 0, scale: 0.98 }}
//                                             animate={{ opacity: 1, scale: 1 }}
//                                             transition={{ delay: idx * 0.05 }}
//                                             whileHover={{ y: -5 }}
//                                             className="group relative h-full"
//                                         >
//                                             {/* CARD BODY: THE DIAGNOSTIC SLIP */}
//                                             <div className="relative h-full bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-xl hover:border-red-200">

//                                                 {/* TOP STRIP: SYSTEM ID & TIME */}
//                                                 <div className="px-6 py-3 bg-slate-900/5 border-b border-white/50 flex justify-between items-center">
//                                                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Community Artery</span>
//                                                     <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-950">
//                                                         <Clock className="w-3.5 h-3.5 text-red-500" />
//                                                         {request.created_at_12h}
//                                                     </div>
//                                                 </div>

//                                                 <div className="p-6 flex flex-col flex-1">
//                                                     {/* MAIN INFO ROW */}
//                                                     <div className="flex items-center justify-between mb-6">
//                                                         <div className="flex items-center gap-4">
//                                                             <div className="w-16 h-16 bg-slate-950 rounded-2xl flex flex-col items-center justify-center shadow-lg group-hover:bg-red-600 transition-colors duration-500">
//                                                                 <span className="text-2xl font-bold text-white leading-none">{request.blood_group}</span>
//                                                                 <span className="text-[8px] font-bold text-white/50 uppercase mt-1">Need</span>
//                                                             </div>
//                                                             <div className="space-y-1">
//                                                                 <h3 className="text-base font-bold text-slate-950 leading-tight">Blood Required</h3>
//                                                                 <div className="flex items-center gap-2">
//                                                                     <StatusBadge status={request.status} acceptedCount={request.accepted_count} />
//                                                                     <span className="text-[11px] font-bold text-slate-400">{request.accepted_count || 0}/2 Donors</span>
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>

//                                                     {/* DATA GRID: REDUCES WHITESPACE */}
//                                                     <div className="grid grid-cols-2 gap-4 mb-6">
//                                                         <div className="bg-white/40 p-3 rounded-xl border border-white/50">
//                                                             <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Requester</p>
//                                                             <div className="flex items-center gap-2">
//                                                                 <User className="w-3.5 h-3.5 text-red-500" />
//                                                                 <span className="text-xs font-bold text-slate-950 truncate">{request.requester?.username || 'Unknown'}</span>
//                                                             </div>
//                                                         </div>

//                                                         <div className="bg-white/40 p-3 rounded-xl border border-white/50">
//                                                             <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Patient</p>
//                                                             <div className="flex items-center gap-2">
//                                                                 <Activity className="w-3.5 h-3.5 text-blue-500" />
//                                                                 <span className="text-xs font-bold text-slate-950 truncate">{request.full_name || 'N/A'}</span>
//                                                             </div>
//                                                         </div>

//                                                         <div className="col-span-2 bg-white/40 p-3 rounded-xl border border-white/50">
//                                                             <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Location</p>
//                                                             <div className="flex items-center gap-2">
//                                                                 <MapPin className="w-3.5 h-3.5 text-emerald-500" />
//                                                                 <span className="text-xs font-bold text-slate-950 line-clamp-1">{request.detail_address}</span>
//                                                             </div>
//                                                         </div>

//                                                         {request.description && (
//                                                             <div className="col-span-2 bg-slate-900/5 p-3 rounded-xl border border-dashed border-slate-200">
//                                                                 <p className="text-[11px] text-slate-600 italic line-clamp-2">
//                                                                     <MessageSquare className="w-3 h-3 inline mr-2 text-slate-400" />
//                                                                     {request.description}
//                                                                 </p>
//                                                             </div>
//                                                         )}
//                                                     </div>

//                                                     {/* ACTIONS: TIGHT & FUNCTIONAL */}
//                                                     <div className="mt-auto space-y-2">
//                                                         <div className="flex gap-2">
//                                                             <button
//                                                                 onClick={() => {
//                                                                     setSelectedRequest(request);
//                                                                     setShowHelpModal(true);
//                                                                 }}
//                                                                 className="flex-[2] py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase hover:bg-emerald-700 transition-all shadow-md shadow-emerald-100"
//                                                             >
//                                                                 Offer Help
//                                                             </button>
//                                                             <button
//                                                                 onClick={() => ignoreBloodRequest(request)}
//                                                                 className="flex-1 py-3 bg-white border border-slate-200 text-slate-400 rounded-xl text-xs font-bold uppercase hover:text-red-600 hover:border-red-100 transition-all"
//                                                             >
//                                                                 Ignore
//                                                             </button>
//                                                         </div>

//                                                         <button
//                                                             onClick={() => showReceiverOnMap(request)}
//                                                             className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 hover:bg-red-600 transition-colors shadow-lg shadow-slate-200"
//                                                         >
//                                                             <Map size={14} /> View Location
//                                                         </button>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </motion.div>
//                                     ))}
//                                 </div>
//                             ) : (
//                                 <div className="text-center py-16 bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-sm border border-purple-100">
//                                     <AlertCircle className="w-20 h-20 text-gray-300 mx-auto mb-6" />
//                                     <h3 className="text-2xl font-bold text-gray-900 mb-3">No Requests Available</h3>
//                                     <p className="text-gray-600 max-w-md mx-auto">
//                                         There are currently no active requests for other blood types.
//                                     </p>
//                                 </div>
//                             )}
//                         </motion.div>
//                     )}
//                 </AnimatePresence>
//             </main>

//             {/* 🔥 CRITICAL FIX: MODALS RENDERED PROPERLY 🔥 */}
//             {/* All modals are now properly wrapped with conditional rendering */}

//             {/* Status Stats Popup Modal */}
//             <StatusStatsPopup
//                 isOpen={showStatusPopup}
//                 onClose={() => setShowStatusPopup(false)}
//                 statusData={userStatusData}
//             />

//             {/* Map Modal */}
//             <MapModal
//                 isOpen={showMapModal}
//                 onClose={() => setShowMapModal(false)}
//                 routeData={mapRouteData}
//                 userLocation={userLocation}
//             />

//             {/* Help Form Modal */}
//             <HelpFormModal
//                 isOpen={showHelpModal}
//                 onClose={() => {
//                     setShowHelpModal(false);
//                     setSelectedRequest(null);
//                 }}
//                 request={selectedRequest}
//                 onSubmit={submitHelpForm}
//             />

//             {/* Donor Modal */}
//             <DonorModal
//                 isOpen={showDonorModal}
//                 onClose={() => {
//                     setShowDonorModal(false);
//                     setSelectedRequest(null);
//                 }}
//                 request={selectedRequest}
//                 onApprove={approveDonor}
//                 onReject={rejectDonor}
//             />

//             {/* Help Offers Modal */}
//             <HelpOffersModal
//                 isOpen={showHelpOffersModal}
//                 onClose={() => {
//                     setShowHelpOffersModal(false);
//                     setSelectedRequest(null);
//                 }}
//                 request={selectedRequest}
//                 helpOffers={helpPosts}
//             />
//         </div>
//     );
// };

// export default Dashboard;











// Dashboard.jsx
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart,
    MapPin,
    Phone,
    Users,
    AlertCircle,
    CheckCircle,
    X,
    User,
    Bell,
    Eye,
    Trash2,
    ThumbsUp,
    ThumbsDown,
    MessageSquare,
    Map,
    HelpCircle,
    Loader2,
    Droplets,
    Target,
    LogOut,
    Activity,
    Clock,
    Calendar,
    Navigation,
    Search,
    Filter,
    AlertTriangle,
    ChevronRight,
    ChevronDown,
    UserCheck,
    UserX,
    Zap,
    Award,
    Plus,
    TrendingUp,
    BarChart3,
    HeartPulse,
    ShieldCheck,
    Trophy,
    History,
    ChartBar,
    Target as TargetIcon,
    Activity as ActivityIcon,
    CheckSquare,
    XCircle,
    Clock as ClockIcon,
    CalendarDays,
    ArrowUpRight,
    ArrowDownRight,
    TrendingDown,
    Star,
    ClipboardList
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link, useNavigate } from 'react-router-dom';
import ModalPortal from '../Components/ModalPortal';
import Swal from 'sweetalert2'; // Import SweetAlert2

// Fix Leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/images/marker-icon-2x.png',
    iconUrl: '/images/marker-icon.png',
    shadowUrl: '/images/marker-shadow.png',
});

// Function to get CSRF token from cookies
function getCookie(name) {
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
}

// Helper function to normalize help post request ID
const getHelpPostRequestId = (helpPost) => {
    if (!helpPost) return null;
    if (helpPost.blood_request_id) return helpPost.blood_request_id;
    if (helpPost.blood_request?.id) return helpPost.blood_request.id;
    if (helpPost.request_id) return helpPost.request_id;
    return null;
};

// Custom icons with fallback
const createCustomIcon = (color, iconName = 'user') => {
    return L.divIcon({
        html: `
            <div style="
                background: ${color};
                width: 42px;
                height: 42px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 16px;
                font-weight: bold;
            ">
                ${iconName === 'donor' ? '👨‍⚕️' : iconName === 'receiver' ? '🩸' : '📍'}
            </div>
        `,
        className: 'custom-marker',
        iconSize: [42, 42],
        iconAnchor: [21, 42],
        popupAnchor: [0, -42]
    });
};

// Map Fit Bounds Component
const MapFitBounds = ({ positions }) => {
    const map = useMap();

    useEffect(() => {
        if (positions && positions.length > 0) {
            const bounds = L.latLngBounds(positions);
            map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
        }
    }, [positions, map]);

    return null;
};

// NEW: Status Stats Popup Modal
const StatusStatsPopup = ({ isOpen, onClose, statusData }) => {
    if (!isOpen || !statusData) return null;

    const { requester, donor } = statusData?.counts || {};
    const userId = statusData?.user_id;
    const success = statusData?.success;

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Calculate stats
    const totalRequests = (requester?.created_active || 0) + (requester?.created_deleted || 0);
    const successRate = totalRequests > 0
        ? Math.round(((requester?.approved || 0) / totalRequests) * 100)
        : 0;

    const totalDonations = (donor?.accepted_waiting_approval || 0) + (donor?.approved || 0) + (donor?.helped || 0);
    const donationSuccessRate = totalDonations > 0
        ? Math.round(((donor?.helped || 0) / totalDonations) * 100)
        : 0;

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 30 }}
                    className="relative bg-white/95 backdrop-blur-3xl rounded-2xl shadow-[0_40px_120px_rgba(0,0,0,0.3)] w-full max-w-6xl mx-auto overflow-hidden border border-white max-h-[90vh] flex flex-col"
                >
                    {/* TACTICAL TERMINAL HEADER */}
                    <div className="bg-slate-950 px-8 py-6 border-b border-white/10 shrink-0 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Activity size={120} className="text-white" />
                        </div>

                        <div className="relative z-10 flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div className="w-14 h-14 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/40">
                                    <ChartBar className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Activity Diagnostics</h2>
                                    <div className="flex items-center gap-3 mt-1">
                                        <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">User_ID: {userId}</p>
                                        <span className="w-1 h-1 bg-white/20 rounded-full" />
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-2 h-2 rounded-full animate-pulse ${success ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                            <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                                                System Status: {success ? '✓ Active' : '✗ Inactive'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-11 h-11 bg-white/10 hover:bg-red-600 rounded-xl flex items-center justify-center transition-all group"
                            >
                                <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform" />
                            </button>
                        </div>
                    </div>

                    {/* BIO-ANALYTIC CONTENT */}
                    <div className="overflow-y-auto flex-1 p-8 bg-[#FDFDFD]">

                        {/* VITAL SUMMARY TILES */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            {/* Requester Statistics */}
                            <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100"><User size={18} /></div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Requester Artery</span>
                                </div>
                                <div className="mb-6">
                                    <p className="text-4xl font-black text-black tracking-tighter">{totalRequests}</p>
                                    <p className="text-xs font-bold text-slate-500 mt-1 uppercase">Total Requests Made</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black text-slate-400 uppercase">Success Rate</span>
                                        <span className="text-sm font-black text-emerald-600">{successRate}%</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${successRate}%` }} className="h-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                                    </div>
                                </div>
                            </div>

                            {/* Donor Statistics */}
                            <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-red-50 text-red-600 rounded-lg border border-red-100"><Heart size={18} /></div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Donor Pulse</span>
                                </div>
                                <div className="mb-6">
                                    <p className="text-4xl font-black text-black tracking-tighter">{donor?.helped || 0}</p>
                                    <p className="text-xs font-bold text-slate-500 mt-1 uppercase">Lives Helped</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black text-slate-400 uppercase">Donation Rate</span>
                                        <span className="text-sm font-black text-blue-600">{donationSuccessRate}%</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${donationSuccessRate}%` }} className="h-full bg-blue-600 shadow-[0_0_8px_#2563eb]" />
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity Card */}
                            <div className="bg-slate-950 rounded-xl p-6 text-white shadow-xl relative overflow-hidden">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-white/10 text-red-500 rounded-lg border border-white/5"><Award size={18} /></div>
                                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Recent Logs</span>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">Last Request</span>
                                        <span className="text-xs font-black text-white">{formatDate(requester?.last_request_created).split(',')[0]}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">Last Donation</span>
                                        <span className="text-xs font-black text-white">{formatDate(donor?.last_approved_date).split(',')[0]}</span>
                                    </div>
                                    <div className="pt-2 flex items-center gap-2 text-emerald-400">
                                        <Zap size={12} className="fill-current" />
                                        <p className="text-[10px] font-black uppercase tracking-widest">Diagnostic Level High</p>
                                    </div>
                                </div>
                                <Target size={120} className="absolute -right-12 -bottom-12 text-white/[0.03]" />
                            </div>
                        </div>

                        {/* DETAILED STATS SPLIT */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                            {/* Requester Statistics Detailed */}
                            <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col">
                                <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
                                    <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white"><UserCheck size={20} /></div>
                                    <h3 className="text-lg font-black text-black uppercase tracking-tight">Requester Detailed Analytics</h3>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                                        <div><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active</p><p className="text-2xl font-black text-black">{requester?.created_active || 0}</p></div>
                                        <ArrowUpRight className="text-blue-500" size={20} />
                                    </div>
                                    <div className="bg-red-50/50 p-4 rounded-xl border border-red-100 flex justify-between items-center">
                                        <div><p className="text-[9px] font-black text-red-400 uppercase tracking-widest">Deleted</p><p className="text-2xl font-black text-red-600">{requester?.created_deleted || 0}</p></div>
                                        <TrendingDown className="text-red-400" size={20} />
                                    </div>
                                    <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 flex justify-between items-center">
                                        <div><p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Approved</p><p className="text-2xl font-black text-emerald-600">{requester?.approved || 0}</p></div>
                                        <CheckCircle className="text-emerald-500" size={20} />
                                    </div>
                                    <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100 flex justify-between items-center">
                                        <div><p className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Help Received</p><p className="text-2xl font-black text-amber-600">{requester?.help_received || 0}</p></div>
                                        <HeartPulse className="text-amber-500" size={20} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2">
                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center"><p className="text-[8px] font-black text-slate-400 uppercase">Waiting</p><p className="text-sm font-black text-black">{requester?.accepted_waiting_approval || 0}</p></div>
                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center"><p className="text-[8px] font-black text-slate-400 uppercase">Rejected</p><p className="text-sm font-black text-black">{requester?.rejected || 0}</p></div>
                                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center"><p className="text-[8px] font-black text-slate-400 uppercase">Ignored</p><p className="text-sm font-black text-black">{requester?.ignored || 0}</p></div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-100 space-y-2">
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        <CalendarDays size={14} className="text-blue-500" /> Last Request Created: <span className="text-black">{formatDate(requester?.last_request_created)}</span>
                                    </div>
                                    {requester?.last_approved_date && (
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                            <ClockIcon size={14} className="text-emerald-500" /> Last Request Approved: <span className="text-black">{formatDate(requester?.last_approved_date)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Donor Statistics Detailed */}
                            <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col">
                                <div className="flex items-center gap-3 mb-8 border-b border-slate-50 pb-4">
                                    <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-red-200"><Heart size={20} /></div>
                                    <h3 className="text-lg font-black text-black uppercase tracking-tight">Donor Module Feed</h3>
                                </div>

                                {donor?.last_approved_date ? (
                                    <div className="bg-emerald-600 rounded-xl p-5 text-white mb-6 shadow-xl shadow-emerald-900/20 relative overflow-hidden group">
                                        <div className="relative z-10">
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Impact Summary</p>
                                            <h4 className="text-2xl font-black mt-2">You saved {donor?.helped || 0} lives.</h4>
                                            <div className="mt-4 flex items-center gap-3 bg-white/10 p-3 rounded-lg border border-white/10">
                                                <CalendarDays size={16} />
                                                <p className="text-xs font-bold uppercase tracking-tight">Last Approved: {formatDate(donor.last_approved_date)}</p>
                                            </div>
                                        </div>
                                        <Trophy size={80} className="absolute -right-4 -bottom-4 text-white/10 group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                ) : (
                                    <div className="bg-slate-100 rounded-xl p-8 text-center mb-6 border border-slate-200">
                                        <Heart size={32} className="mx-auto mb-3 text-slate-300" />
                                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed">No approved donations recorded.<br />Start contributing to help the community!</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-3 mt-auto">
                                    <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm flex items-center justify-between">
                                        <div><p className="text-[9px] font-black text-slate-400 uppercase">Waiting</p><p className="text-xl font-black text-black">{donor?.accepted_waiting_approval || 0}</p></div>
                                        <ClockIcon size={18} className="text-amber-500" />
                                    </div>
                                    <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm flex items-center justify-between">
                                        <div><p className="text-[9px] font-black text-emerald-600 uppercase">Success</p><p className="text-xl font-black text-emerald-600">{donor?.approved || 0}</p></div>
                                        <CheckSquare size={18} className="text-emerald-500" />
                                    </div>
                                    <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm flex items-center justify-between">
                                        <div><p className="text-[9px] font-black text-red-600 uppercase">Declined</p><p className="text-xl font-black text-red-600">{donor?.rejected || 0}</p></div>
                                        <XCircle size={18} className="text-red-500" />
                                    </div>
                                    <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm flex items-center justify-between">
                                        <div><p className="text-[9px] font-black text-slate-400 uppercase">Ignored</p><p className="text-xl font-black text-slate-400">{donor?.ignored || 0}</p></div>
                                        <UserX size={18} className="text-slate-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* KEY METRICS BARSET */}
                        <div className="bg-slate-50 rounded-xl p-8 border border-slate-200 shadow-inner">
                            <h3 className="text-xs font-black text-black uppercase tracking-[0.3em] mb-8 text-center flex items-center justify-center gap-4">
                                <div className="h-[1px] w-12 bg-slate-200" /> Performance Indicators <div className="h-[1px] w-12 bg-slate-200" />
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {[
                                    { label: 'Request Accuracy', val: successRate, icon: TargetIcon, color: 'text-blue-600', bg: 'bg-blue-100' },
                                    { label: 'Donation Pulse', val: donationSuccessRate, icon: ActivityIcon, color: 'text-emerald-600', bg: 'bg-emerald-100' },
                                    { label: 'Activity Logs', val: (totalRequests + totalDonations), icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-100' },
                                    { label: 'System Impact', val: ((requester?.help_received || 0) + (donor?.helped || 0)), icon: Award, color: 'text-red-600', bg: 'bg-red-100' }
                                ].map((metric, i) => (
                                    <div key={i} className="text-center group">
                                        <div className={`w-12 h-12 ${metric.bg} ${metric.color} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
                                            <metric.icon size={20} />
                                        </div>
                                        <p className="text-2xl font-black text-black tracking-tighter">{metric.val}{metric.label.includes('Rate') || metric.label.includes('Pulse') || metric.label.includes('Accuracy') ? '%' : ''}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{metric.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* MODAL FOOTER */}
                    <div className="p-6 bg-white border-t border-slate-100 shrink-0">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                                <Clock size={12} /> Sync Timestamp: {new Date().toLocaleTimeString()}
                            </div>
                            <div className="flex gap-3 w-full sm:w-auto">
                                <button
                                    onClick={onClose}
                                    className="flex-1 sm:flex-none px-10 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                >
                                    Close Portal
                                </button>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="flex-1 sm:flex-none px-10 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-200 hover:bg-slate-900 transition-all border border-transparent"
                                >
                                    Refresh Stats
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </ModalPortal>
    );
};

// Map Modal Component
const MapModal = ({ isOpen, onClose, routeData, userLocation }) => {
    const [positions, setPositions] = useState([]);
    const [mapKey, setMapKey] = useState(Date.now());

    useEffect(() => {
        if (isOpen && routeData?.waypoints) {
            const latlngs = routeData.waypoints.map(wp => [wp.lat, wp.lng]);
            setPositions(latlngs);
            setMapKey(Date.now());
        }
    }, [isOpen, routeData]);

    const generateRoutePath = (waypoints) => {
        if (waypoints.length < 2) return waypoints;
        const path = [];
        for (let i = 0; i < waypoints.length; i++) {
            path.push(waypoints[i]);
            if (i < waypoints.length - 1) {
                const midLat = (waypoints[i][0] + waypoints[i + 1][0]) / 2;
                const midLng = (waypoints[i][1] + waypoints[i + 1][1]) / 2;
                const offset = 0.0005;
                path.push([midLat + offset, midLng + offset]);
            }
        }
        return path;
    };

    if (!isOpen) return null;

    const routePath = generateRoutePath(positions);
    const defaultCenter = positions[0] || userLocation || [23.8041, 90.4152];

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative bg-white rounded-2xl shadow-2xl w-full h-full max-w-6xl max-h-[90vh] mx-auto overflow-hidden"
                >
                    <div className="absolute top-4 right-4 z-[10001]">
                        <button
                            onClick={onClose}
                            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow hover:bg-gray-50"
                        >
                            <X className="w-5 h-5 text-gray-700" />
                        </button>
                    </div>

                    <div className="h-full w-full">
                        <MapContainer
                            key={mapKey}
                            center={defaultCenter}
                            zoom={13}
                            style={{ height: '100%', width: '100%' }}
                            scrollWheelZoom={true}
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            {positions.length > 0 && <MapFitBounds positions={positions} />}

                            {userLocation && (
                                <Marker
                                    position={userLocation}
                                    icon={createCustomIcon('linear-gradient(135deg, #3b82f6, #1d4ed8)', 'user')}
                                >
                                    <Popup>
                                        <div className="p-3">
                                            <div className="font-bold text-gray-900">Your Location</div>
                                            <div className="text-sm text-gray-600">
                                                Latitude: {userLocation[0].toFixed(6)}<br />
                                                Longitude: {userLocation[1].toFixed(6)}
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            )}

                            {positions.slice(1).map((pos, index) => (
                                <Marker
                                    key={index}
                                    position={pos}
                                    icon={createCustomIcon(
                                        index === 0
                                            ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                                            : 'linear-gradient(135deg, #10b981, #059669)',
                                        index === 0 ? 'receiver' : 'donor'
                                    )}
                                >
                                    <Popup>
                                        <div className="p-3">
                                            <div className="font-bold text-gray-900">
                                                {index === 0 ? 'Receiver Location' : `Donor ${index}`}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Latitude: {pos[0].toFixed(6)}<br />
                                                Longitude: {pos[1].toFixed(6)}
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}

                            {routePath.length > 1 && (
                                <Polyline
                                    positions={routePath}
                                    color="#ef4444"
                                    weight={4}
                                    opacity={0.7}
                                />
                            )}
                        </MapContainer>
                    </div>
                </motion.div>
            </div>
        </ModalPortal>
    );
};

// Help Offers Modal Component
const HelpOffersModal = ({ isOpen, onClose, request, helpOffers }) => {
    if (!isOpen || !request) return null;

    const filteredHelpOffers = helpOffers?.filter(offer =>
        getHelpPostRequestId(offer) === request?.id
    );

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white/95 backdrop-blur-2xl rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.2)] w-full max-w-2xl mx-auto overflow-hidden border border-white max-h-[85vh] flex flex-col"
                >
                    {/* VITAL SUPPORT HEADER */}
                    <div className="bg-amber-500 px-6 py-5 border-b border-white/20 shrink-0 relative overflow-hidden">
                        {/* Subtle pulse effect in header background */}
                        <motion.div
                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                            transition={{ repeat: Infinity, duration: 3 }}
                            className="absolute inset-0 bg-amber-400 pointer-events-none"
                        />

                        <div className="relative z-10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                                    <Zap className="text-amber-600 fill-current" size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-950 leading-none">Support Manifest</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-[10px] font-black text-amber-950 uppercase tracking-widest">
                                            Request #{request.id}
                                        </p>
                                        <span className="w-1 h-1 bg-amber-900/30 rounded-full" />
                                        <p className="text-[10px] font-black text-amber-900 uppercase tracking-widest">
                                            {filteredHelpOffers?.length || 0} Signal(s) Received
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/20 text-slate-950 hover:bg-white hover:text-amber-600 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* MODAL BODY: HIGH DENSITY LIST */}
                    <div className="overflow-y-auto flex-1 p-5 custom-scrollbar bg-[#FDFDFD]">
                        {filteredHelpOffers && filteredHelpOffers.length > 0 ? (
                            <div className="space-y-3">
                                {filteredHelpOffers.map((offer, index) => (
                                    <motion.div
                                        key={offer.id || index}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm hover:border-amber-400 transition-all group relative overflow-hidden"
                                    >
                                        {/* Status vertical bar */}
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 opacity-50 group-hover:opacity-100 transition-opacity" />

                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-bold text-slate-950 text-base truncate">
                                                            {offer.name || 'Anonymous Helper'}
                                                        </h4>
                                                        <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-[10px] font-bold uppercase border border-red-100">
                                                            {offer.blood_group || 'N/A'}
                                                        </span>
                                                    </div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                                                        <Clock size={12} /> {new Date(offer.created_at).toLocaleDateString()}
                                                    </div>
                                                </div>

                                                {/* COMPACT DATA GRID */}
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                                                            <Phone size={14} className="text-emerald-600" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[9px] font-bold text-slate-400 uppercase leading-none mb-1">Contact</p>
                                                            <p className="text-sm font-bold text-slate-950 truncate">{offer.phone || 'Not Provided'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                                                            <Activity size={14} className="text-blue-600" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-[9px] font-bold text-slate-400 uppercase leading-none mb-1">Helper ID</p>
                                                            <p className="text-sm font-bold text-slate-950 truncate">#{offer.helper || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* MESSAGE BUBBLE */}
                                                {offer.message && (
                                                    <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                        <div className="flex gap-2">
                                                            <MessageSquare size={12} className="text-slate-400 shrink-0 mt-0.5" />
                                                            <p className="text-xs font-medium text-slate-600 leading-relaxed italic">
                                                                "{offer.message}"
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 mx-2">
                                <div className="relative inline-block mb-4">
                                    <HelpCircle className="w-12 h-12 text-slate-200" />
                                    <motion.div
                                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl"
                                    />
                                </div>
                                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">No Signals Found</h4>
                                <p className="text-xs text-slate-400 mt-2">The support artery for this request is currently empty.</p>
                            </div>
                        )}
                    </div>

                    {/* MODAL FOOTER */}
                    <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                        <button
                            onClick={onClose}
                            className="w-full py-3.5 bg-slate-950 text-white rounded-xl text-xs font-bold uppercase tracking-[0.2em] shadow-lg hover:bg-red-600 transition-all"
                        >
                            Close Support Feed
                        </button>
                    </div>
                </motion.div>
            </div>
        </ModalPortal>
    );
};

// Help Form Modal
const HelpFormModal = ({ isOpen, onClose, request, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        message: '',
        blood_group: request?.blood_group || ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && request) {
            setFormData({
                name: '',
                phone: '',
                message: '',
                blood_group: request.blood_group || ''
            });
        }
    }, [isOpen, request]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Error submitting help form:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen || !request) return null;

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white/95 backdrop-blur-2xl rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.2)] w-full max-w-md mx-auto overflow-hidden border border-white"
                >
                    {/* MODAL HEADER: CLINICAL TAB */}
                    <div className="bg-slate-950 px-6 py-5 border-b border-white/10 shrink-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/20">
                                    <Heart className="text-white fill-current" size={20} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white leading-none uppercase tracking-tighter">Transmit Help</h3>
                                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-[0.2em] mt-1">
                                        Artery Connection Feed
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:bg-red-600 hover:text-white transition-all"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* BLOOD TYPE INDICATOR: HIGH VISIBILITY */}
                            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Activity className="text-red-600" size={16} />
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Target Blood Type</span>
                                </div>
                                <span className="px-4 py-1.5 bg-slate-950 text-white rounded-lg text-lg font-black tracking-tighter">
                                    {request?.blood_group}
                                </span>
                            </div>

                            <div className="space-y-4">
                                {/* NAME FIELD */}
                                <div>
                                    <label className="block text-[11px] font-black text-slate-950 uppercase tracking-widest mb-1.5 ml-1">
                                        Identity Name
                                    </label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-red-600 transition-colors" size={16} />
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-950 focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600 transition-all placeholder:text-slate-300"
                                            placeholder="Full Name"
                                        />
                                    </div>
                                </div>

                                {/* PHONE FIELD (NUMBERS ONLY) */}
                                <div>
                                    <label className="block text-[11px] font-black text-slate-950 uppercase tracking-widest mb-1.5 ml-1">
                                        Contact Frequency
                                    </label>
                                    <div className="relative group">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-red-600 transition-colors" size={16} />
                                        <input
                                            type="number"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-950 focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600 transition-all placeholder:text-slate-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            placeholder="Numbers Only"
                                        />
                                    </div>
                                </div>

                                {/* MESSAGE FIELD */}
                                <div>
                                    <label className="block text-[11px] font-black text-slate-950 uppercase tracking-widest mb-1.5 ml-1">
                                        Message Payload
                                    </label>
                                    <textarea
                                        required
                                        rows="3"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-950 focus:outline-none focus:ring-2 focus:ring-red-600/10 focus:border-red-600 transition-all placeholder:text-slate-300 resize-none min-h-[100px]"
                                        placeholder="Write your brief message here..."
                                    />
                                </div>
                            </div>

                            {/* ACTION BUTTONS */}
                            <div className="flex gap-3 pt-4 border-t border-slate-50">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 px-4 py-3.5 bg-slate-50 text-slate-500 rounded-xl hover:bg-slate-100 hover:text-slate-800 transition-all font-bold text-xs uppercase tracking-widest border border-slate-100"
                                >
                                    Abort
                                </button>
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={submitting}
                                    className="flex-[2] px-4 py-3.5 bg-red-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-xl shadow-red-200 hover:bg-slate-950 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Transmitting...
                                        </>
                                    ) : (
                                        <>
                                            <Zap size={14} className="fill-current" />
                                            Broadcast Offer
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </ModalPortal>
    );
};

// Donor Modal Component
const DonorModal = ({ isOpen, onClose, request, onApprove, onReject }) => {
    const [donorDetails, setDonorDetails] = useState({});
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState({});
    const navigate = useNavigate();
    const csrfToken = getCookie('csrftoken');

    const isDonorInList = (donorId, list) => {
        if (!list || list.length === 0) return false;
        if (typeof list[0] === 'number') {
            return list.includes(donorId);
        }
        return list.some(item => item.id === donorId || item === donorId);
    };

    useEffect(() => {
        if (isOpen && request) {
            fetchDonorDetails();
        }
    }, [isOpen, request]);

    const fetchDonorDetails = async () => {
        setLoading(true);
        try {
            const donorIds = [...(request.donors || []), ...(request.accepted_donors || []), ...(request.final_donors || [])]
                .map(d => typeof d === 'object' ? d.id : d)
                .filter((value, index, self) => self.indexOf(value) === index);

            const details = {};

            for (const donorId of donorIds) {
                try {
                    const response = await fetch(`http://localhost:8000/api/get-donor-details/${donorId}/`, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'X-CSRFToken': csrfToken,
                        }
                    });

                    if (response.ok) {
                        const donorDetail = await response.json();
                        details[donorId] = donorDetail;
                    }
                } catch (error) {
                    console.error(`Error fetching details for donor ${donorId}:`, error);
                }
            }

            setDonorDetails(details);
        } catch (error) {
            console.error('Error fetching donor details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (requestId, donorId) => {
        setProcessing(prev => ({ ...prev, [`approve-${donorId}`]: true }));
        try {
            await onApprove(requestId, donorId);
            setDonorDetails(prev => ({
                ...prev,
                [donorId]: {
                    ...prev[donorId],
                    status: 'approved'
                }
            }));
        } catch (error) {
            console.error('Error approving donor:', error);
        } finally {
            setProcessing(prev => ({ ...prev, [`approve-${donorId}`]: false }));
        }
    };

    const handleReject = async (requestId, donorId) => {
        setProcessing(prev => ({ ...prev, [`reject-${donorId}`]: true }));
        try {
            await onReject(requestId, donorId);
            setDonorDetails(prev => ({
                ...prev,
                [donorId]: {
                    ...prev[donorId],
                    status: 'rejected'
                }
            }));
        } catch (error) {
            console.error('Error rejecting donor:', error);
        } finally {
            setProcessing(prev => ({ ...prev, [`reject-${donorId}`]: false }));
        }
    };

    const openChatWithDonor = async (donorId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/chat-room/${request.id}/${donorId}/`, {
                method: "GET",
                credentials: "include",
                headers: {
                    'X-CSRFToken': csrfToken,
                }
            });

            if (response.ok) {
                const data = await response.json();
                const roomId = data.room_id;

                if (roomId) {
                    navigate(`/chat/${roomId}`);
                    onClose();
                } else {
                    Swal.fire({
                        title: 'Chat Room Not Found',
                        text: 'Unable to locate chat room.',
                        icon: 'warning',
                        confirmButtonColor: '#ef4444',
                    });
                }
            } else {
                Swal.fire({
                    title: 'Failed to Open Chat',
                    text: 'Unable to open chat room at this time.',
                    icon: 'error',
                    confirmButtonColor: '#ef4444',
                });
            }
        } catch (error) {
            console.error('Error opening chat:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to open chat',
                icon: 'error',
                confirmButtonColor: '#ef4444',
            });
        }
    };

    if (!isOpen || !request) return null;

    const allDonorIds = [
        ...(request?.donors || []).map(d => typeof d === 'object' ? d.id : d),
        ...(request?.accepted_donors || []).map(d => typeof d === 'object' ? d.id : d),
        ...(request?.final_donors || []).map(d => typeof d === 'object' ? d.id : d)
    ].filter((value, index, self) => self.indexOf(value) === index);

    return (
        <ModalPortal>
            <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative bg-white/95 backdrop-blur-2xl rounded-2xl shadow-[0_30px_100px_rgba(0,0,0,0.2)] w-full max-w-2xl mx-auto overflow-hidden border border-white max-h-[85vh] flex flex-col"
                >
                    {/* CLINICAL HEADER */}
                    <div className="bg-slate-950 px-6 py-5 border-b border-white/10 shrink-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-900/20">
                                    <Users className="text-white w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white leading-none">Artery Management</h3>
                                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-[0.2em] mt-1">
                                        Request #{request.id} • Donor Manifest
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-red-600 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* MODAL BODY */}
                    <div className="overflow-y-auto flex-1 p-5 custom-scrollbar">
                        {loading ? (
                            <div className="text-center py-16">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                    className="w-12 h-12 border-4 border-slate-100 border-t-red-600 rounded-full mx-auto mb-4"
                                />
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Scanning Artery Logs...</p>
                            </div>
                        ) : allDonorIds.length > 0 ? (
                            <div className="space-y-3">
                                {allDonorIds.map((donorId) => {
                                    const details = donorDetails[donorId] || {};
                                    const isAccepted = isDonorInList(donorId, request.accepted_donors);
                                    const isFinal = isDonorInList(donorId, request.final_donors);
                                    const isRejected = isDonorInList(donorId, request.rejected_donors_by_requester);
                                    const isIgnored = isDonorInList(donorId, request.request_ignored_by_donors);
                                    const isApproving = processing[`approve-${donorId}`];
                                    const isRejecting = processing[`reject-${donorId}`];

                                    return (
                                        <motion.div
                                            key={donorId}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm hover:border-red-100 transition-all group"
                                        >
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h4 className="font-bold text-slate-950 text-base truncate">
                                                            {details.username || `Donor ${donorId}`}
                                                        </h4>
                                                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${isFinal ? 'bg-emerald-100 text-emerald-700' :
                                                            isRejected ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                                                            }`}>
                                                            {isFinal ? 'Verified' : isRejected ? 'Declined' : 'Candidate'}
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-6">
                                                        <div>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Blood Type</p>
                                                            <p className="text-sm font-bold text-red-600">{details.blood_group || 'N/A'}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Contact</p>
                                                            <p className="text-sm font-bold text-slate-950">{details.phone || 'N/A'}</p>
                                                        </div>
                                                        <div className="col-span-2 sm:col-span-1">
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Sector</p>
                                                            <p className="text-sm font-bold text-slate-950 truncate">{details.detailed_address || 'Coordinates Locked'}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* ACTIONS AREA */}
                                                <div className="shrink-0 flex sm:flex-col gap-2 w-full sm:w-auto">
                                                    {isFinal ? (
                                                        <div className="flex flex-row sm:flex-col gap-2 w-full">
                                                            <button
                                                                onClick={() => openChatWithDonor(donorId)}
                                                                className="flex-1 py-2 px-4 bg-slate-950 text-white rounded-lg text-xs font-bold uppercase flex items-center justify-center gap-2 hover:bg-red-600 transition-all shadow-md"
                                                            >
                                                                <MessageSquare size={14} /> Chat
                                                            </button>
                                                            <div className="hidden sm:block h-[1px] bg-slate-100 w-full" />
                                                            <span className="flex-1 text-center py-2 px-4 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold uppercase border border-emerald-100">
                                                                Linked
                                                            </span>
                                                        </div>
                                                    ) : isRejected ? (
                                                        <span className="w-full text-center py-2 px-4 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold uppercase border border-red-100">
                                                            Rejected
                                                        </span>
                                                    ) : isAccepted ? (
                                                        <div className="flex flex-row sm:flex-col gap-2 w-full">
                                                            <button
                                                                onClick={() => handleApprove(request.id, donorId)}
                                                                disabled={isApproving || isRejecting}
                                                                className="flex-1 py-2 px-4 bg-emerald-600 text-white rounded-lg text-xs font-bold uppercase hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg shadow-emerald-100"
                                                            >
                                                                {isApproving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Approve'}
                                                            </button>
                                                            <button
                                                                onClick={() => handleReject(request.id, donorId)}
                                                                disabled={isRejecting || isApproving}
                                                                className="flex-1 py-2 px-4 bg-white border border-slate-200 text-slate-400 rounded-lg text-xs font-bold uppercase hover:text-red-600 hover:border-red-100 transition-all"
                                                            >
                                                                {isRejecting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Decline'}
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="px-4 py-2 bg-slate-50 text-slate-400 rounded-lg text-[10px] font-bold uppercase text-center border border-slate-100">
                                                            Pending Pulse
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 mx-2">
                                <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                <h4 className="text-sm font-bold text-slate-900 uppercase">Artery Empty</h4>
                                <p className="text-xs text-slate-400 mt-2">No donors have established a link yet.</p>
                            </div>
                        )}
                    </div>

                    {/* MODAL FOOTER */}
                    <div className="p-4 bg-slate-50 border-t border-slate-100 shrink-0">
                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all"
                        >
                            Close Artery Manifest
                        </button>
                    </div>
                </motion.div>
            </div>
        </ModalPortal>
    );
};

// Main Dashboard Component
const Dashboard = () => {
    const [userData, setUserData] = useState(null);
    const [userStatusData, setUserStatusData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('my-requests');
    const [showMapModal, setShowMapModal] = useState(false);
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [showDonorModal, setShowDonorModal] = useState(false);
    const [showHelpOffersModal, setShowHelpOffersModal] = useState(false);
    const [showStatusPopup, setShowStatusPopup] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [mapRouteData, setMapRouteData] = useState(null);
    const [userLocation, setUserLocation] = useState([23.8041, 90.4152]);

    const [locationName, setLocationName] = useState('Loading location...');

    const [myRequests, setMyRequests] = useState([]);
    const [activeMyGroup, setActiveMyGroup] = useState([]);
    const [activeOther, setActiveOther] = useState([]);
    const [helpPosts, setHelpPosts] = useState([]);
    const [chatRooms, setChatRooms] = useState([]);
    const navigate = useNavigate();

    const csrfToken = getCookie('csrftoken');

    const getHelpOffersCount = (requestId) => {
        if (!helpPosts || helpPosts.length === 0) return 0;
        return helpPosts.filter(helpPost => {
            const helpRequestId = getHelpPostRequestId(helpPost);
            return helpRequestId === requestId;
        }).length;
    };

    // Fetch all data including the new status counts
    useEffect(() => {
        fetchDashboardData();
        fetchUserStatusCounts();
        fetchChatRooms();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            const userRes = await fetch("http://localhost:8000/api/current-user/", {
                method: "GET",
                credentials: "include",
            });

            if (userRes.ok) {
                const userData = await userRes.json();
                setUserData(userData);

                if (userData.latitude && userData.longitude) {
                    setUserLocation([parseFloat(userData.latitude), parseFloat(userData.longitude)]);
                }
            }

            const dashboardRes = await fetch("http://localhost:8000/api/dashboard/", {
                method: "GET",
                credentials: "include",
            });

            if (dashboardRes.ok) {
                const dashboardData = await dashboardRes.json();
                setMyRequests(dashboardData.my_requests || []);
                setActiveMyGroup(dashboardData.active_my_group || []);
                setActiveOther(dashboardData.active_other || []);
                setHelpPosts(dashboardData.help_posts || []);
            }

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to load dashboard data',
                icon: 'error',
                confirmButtonColor: '#ef4444',
            });
        } finally {
            setLoading(false);
        }
    };

    const getLocationName = useCallback(async (lat, lng) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
            );

            if (response.ok) {
                const data = await response.json();
                if (data.address) {
                    const {
                        neighbourhood,
                        suburb,
                        road,
                        quarter,
                        hamlet,
                        village,
                        town,
                        city,
                        county,
                        state,
                        country
                    } = data.address;

                    const location =
                        neighbourhood ||
                        suburb ||
                        road ||
                        quarter ||
                        hamlet ||
                        village ||
                        town ||
                        city ||
                        county ||
                        'Unknown area';

                    const district = data.address.municipality || data.address.district || '';

                    let locationString = location;
                    if (district && district !== location) {
                        locationString += `, ${district}`;
                    }
                    if (state && state !== location && state !== district) {
                        locationString += `, ${state}`;
                    }
                    if (country) {
                        locationString += `, ${country}`;
                    }

                    if (data.display_name && data.display_name.length < 100) {
                        const parts = data.display_name.split(',');
                        if (parts.length > 2) {
                            return `${parts[0].trim()}, ${parts[1].trim()}, ${parts[2].trim()}`;
                        }
                        return data.display_name;
                    }

                    return locationString;
                }
            }
        } catch (error) {
            console.error('Error getting location name:', error);
        }

        // Fallback based on coordinates (Bangladesh cities)
        if (lat >= 23.7 && lat <= 23.9 && lng >= 90.3 && lng <= 90.5) {
            return "Dhaka Central, Dhaka, Bangladesh";
        } else if (lat >= 22.3 && lat <= 22.4 && lng >= 91.7 && lng <= 91.9) {
            return "Chittagong City, Chittagong, Bangladesh";
        } else if (lat >= 24.8 && lat <= 25.0 && lng >= 91.8 && lng <= 92.0) {
            return "Sylhet City, Sylhet, Bangladesh";
        } else if (lat >= 24.3 && lat <= 24.4 && lng >= 88.5 && lng <= 88.7) {
            return "Rajshahi City, Rajshahi, Bangladesh";
        } else if (lat >= 22.8 && lat <= 22.9 && lng >= 89.5 && lng <= 89.6) {
            return "Khulna City, Khulna, Bangladesh";
        }

        return "Unknown Location";
    }, []);

    // Fetch user status counts
    const fetchUserStatusCounts = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/user-history/my-status-counts/", {
                method: "GET",
                credentials: "include",
                headers: {
                    'X-CSRFToken': csrfToken,
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUserStatusData(data);
            } else {
                console.error('Failed to fetch status counts');
            }
        } catch (error) {
            console.error('Error fetching status counts:', error);
        }
    };

    const fetchChatRooms = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/my-chats/", {
                method: "GET",
                credentials: "include",
                headers: {
                    'X-CSRFToken': csrfToken,
                }
            });

            if (response.ok) {
                const data = await response.json();
                setChatRooms(data);
            }
        } catch (error) {
            console.error('Error fetching chat rooms:', error);
        }
    };

    const isUserInList = (userId, list) => {
        if (!list || list.length === 0) return false;
        if (typeof list[0] === 'number') {
            return list.includes(userId);
        }
        return list.some(item => item.id === userId || item === userId);
    };

    const updateLocation = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;

                    try {
                        const response = await fetch('http://localhost:8000/api/update-location/', {
                            method: 'POST',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CSRFToken': csrfToken,
                            },
                            body: JSON.stringify({
                                latitude: lat,
                                longitude: lng
                            })
                        });

                        if (response.ok) {
                            setUserLocation([lat, lng]);

                            // Get more precise location name
                            const name = await getLocationName(lat, lng);
                            setLocationName(name);

                            Swal.fire({
                                title: 'Success',
                                text: 'Location updated successfully!',
                                icon: 'success',
                                confirmButtonColor: '#10b981',
                            });
                        } else {
                            throw new Error('Failed to update location');
                        }
                    } catch (error) {
                        console.error('Error updating location:', error);
                        Swal.fire({
                            title: 'Error',
                            text: 'Failed to update location',
                            icon: 'error',
                            confirmButtonColor: '#ef4444',
                        });
                    }
                },
                (error) => {
                    console.error('Error getting location:', error);
                    Swal.fire({
                        title: 'Location Error',
                        text: 'Failed to get location. Please enable location services.',
                        icon: 'warning',
                        confirmButtonColor: '#ef4444',
                    });
                }
            );
        } else {
            Swal.fire({
                title: 'Not Supported',
                text: 'Geolocation is not supported by your browser',
                icon: 'warning',
                confirmButtonColor: '#ef4444',
            });
        }
    };

    // Add this after the updateLocation function
    useEffect(() => {
        if (userLocation && userLocation.length === 2) {
            getLocationName(userLocation[0], userLocation[1])
                .then(name => setLocationName(name))
                .catch(() => setLocationName('Unknown Location'));
        }
    }, [userLocation, getLocationName]);

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You will be logged out from the system.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, logout',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch("http://localhost:8000/api/logout/", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": csrfToken,
                    },
                });

                if (res.ok) {
                    Swal.fire({
                        title: 'Logged Out',
                        text: 'You have been successfully logged out.',
                        icon: 'success',
                        confirmButtonColor: '#10b981',
                    }).then(() => {
                        window.location.href = "/login";
                    });
                }
            } catch (err) {
                console.error(err);
                Swal.fire({
                    title: 'Error',
                    text: 'Failed to logout',
                    icon: 'error',
                    confirmButtonColor: '#ef4444',
                });
            }
        }
    };

    const canChatWithRequest = (request) => {
        if (!userData) return false;

        const userId = userData.id;

        if (request.requester?.id === userId || request.requester === userId) {
            return request.final_donors && request.final_donors.length > 0;
        }

        if (isUserInList(userId, request.final_donors)) {
            return true;
        }

        return false;
    };

    const openChatRoomForRequest = async (request) => {
        if (!userData) return;

        try {
            const userId = userData.id;
            const isRequester = request.requester?.id === userId || request.requester === userId;

            let roomId;

            if (isRequester) {
                if (!request.final_donors || request.final_donors.length === 0) {
                    Swal.fire({
                        title: 'No Approved Donors',
                        text: 'No approved donors to chat with yet.',
                        icon: 'info',
                        confirmButtonColor: '#3b82f6',
                    });
                    return;
                }

                const donorId = request.final_donors[0];

                const response = await fetch(`http://localhost:8000/api/chat-room/${request.id}/${donorId}/`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        'X-CSRFToken': csrfToken,
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    roomId = data.room_id;
                }
            } else {
                const requesterId = request.requester?.id || request.requester;

                const response = await fetch(`http://localhost:8000/api/chat-room/${request.id}/${userId}/`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        'X-CSRFToken': csrfToken,
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    roomId = data.room_id;
                }
            }

            if (roomId) {
                navigate(`/chat/${roomId}`);
            } else {
                Swal.fire({
                    title: 'Chat Room Not Found',
                    text: 'Please make sure you have been approved by the requester.',
                    icon: 'warning',
                    confirmButtonColor: '#ef4444',
                });
            }
        } catch (error) {
            console.error('Error opening chat:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to open chat',
                icon: 'error',
                confirmButtonColor: '#ef4444',
            });
        }
    };

    const openAllTheChats = async () => {
        if (!userData) return;
        navigate('/my-chats/');
    };

    const acceptBloodRequest = async (requestId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/accept-blood-request/${requestId}/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                setActiveMyGroup(prev => prev.map(request => {
                    if (request.id === requestId && userData) {
                        const userId = userData.id;
                        const updatedAcceptedDonors = Array.isArray(request.accepted_donors)
                            ? [...request.accepted_donors, userId]
                            : [userId];

                        return {
                            ...request,
                            accepted_donors: updatedAcceptedDonors,
                            accepted_count: updatedAcceptedDonors.length
                        };
                    }
                    return request;
                }));

                Swal.fire({
                    title: 'Success',
                    text: 'Request accepted successfully! You are now waiting for requester approval.',
                    icon: 'success',
                    confirmButtonColor: '#10b981',
                });
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to accept request');
            }
        } catch (error) {
            console.error('Error accepting request:', error);
            Swal.fire({
                title: 'Error',
                text: error.message || 'Failed to accept request',
                icon: 'error',
                confirmButtonColor: '#ef4444',
            });
        }
    };

    const ignoreBloodRequest = async (request) => {
        const requestId = request.id;
        if (isUserInList(userData.id, request.accepted_donors)) {
            Swal.fire({
                title: 'Cannot Ignore',
                text: 'You have already accepted this request and cannot ignore it.',
                icon: 'warning',
                confirmButtonColor: '#f59e0b',
            });
            return;
        }
        try {
            const response = await fetch(`http://localhost:8000/api/ignore-blood-request/${requestId}/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                setActiveMyGroup(prev => prev.filter(req => req.id !== requestId));
                setActiveOther(prev => prev.filter(req => req.id !== requestId));
                Swal.fire({
                    title: 'Ignored',
                    text: 'Request ignored successfully!',
                    icon: 'success',
                    confirmButtonColor: '#10b981',
                });
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to ignore request');
            }
        } catch (error) {
            console.error('Error ignoring request:', error);
            Swal.fire({
                title: 'Error',
                text: error.message || 'Failed to ignore request',
                icon: 'error',
                confirmButtonColor: '#ef4444',
            });
        }
    };

    const approveDonor = async (requestId, donorId) => {
        const response = await fetch(
            `http://localhost:8000/api/approve-blood-request/${requestId}/${donorId}/`,
            {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/json',
                }
            }
        );

        if (response.ok) {
            setMyRequests(prev =>
                prev.map(req =>
                    req.id === requestId
                        ? {
                            ...req,
                            final_donors: [...(req.final_donors || []), donorId],
                            accepted_donors: (req.accepted_donors || []).filter(id => id !== donorId),
                        }
                        : req
                )
            );

            setSelectedRequest(prev =>
                prev && prev.id === requestId
                    ? {
                        ...prev,
                        final_donors: [...(prev.final_donors || []), donorId],
                        accepted_donors: (prev.accepted_donors || []).filter(id => id !== donorId),
                    }
                    : prev
            );

            fetchChatRooms();

            Swal.fire({
                title: 'Donor Approved',
                text: 'Donor has been approved successfully!',
                icon: 'success',
                confirmButtonColor: '#10b981',
            });
        }
    };

    const rejectDonor = async (requestId, donorId) => {
        try {
            const response = await fetch(
                `http://localhost:8000/api/reject-donor-request/${requestId}/${donorId}/`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'X-CSRFToken': csrfToken,
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (response.ok) {
                setMyRequests(prev =>
                    prev.map(req =>
                        req.id === requestId
                            ? {
                                ...req,
                                rejected_donors_by_requester: [
                                    ...(req.rejected_donors_by_requester || []),
                                    donorId
                                ],
                                accepted_donors: (req.accepted_donors || []).filter(id => id !== donorId),
                            }
                            : req
                    )
                );

                setSelectedRequest(prev =>
                    prev && prev.id === requestId
                        ? {
                            ...prev,
                            rejected_donors_by_requester: [
                                ...(prev.rejected_donors_by_requester || []),
                                donorId
                            ],
                            accepted_donors: (prev.accepted_donors || []).filter(id => id !== donorId),
                        }
                        : prev
                );

                Swal.fire({
                    title: 'Donor Rejected',
                    text: 'Donor rejected successfully!',
                    icon: 'success',
                    confirmButtonColor: '#10b981',
                });
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to reject donor');
            }
        } catch (error) {
            console.error('Error rejecting donor:', error);
            Swal.fire({
                title: 'Error',
                text: error.message || 'Failed to reject donor',
                icon: 'error',
                confirmButtonColor: '#ef4444',
            });
        }
    };

    const deleteBloodRequest = async (requestId) => {
        const result = await Swal.fire({
            title: '<span style="font-family: Poppins; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: -0.02em;">Purge Signal?</span>',
            html: '<div style="font-family: Poppins; font-weight: 600; color: #64748b; font-size: 14px; line-height: 1.5; margin-top: 8px;">You are about to permanently terminate this blood request. This artery connection will be lost forever.</div>',
            icon: 'warning',
            iconColor: '#dc2626',
            showCancelButton: true,
            confirmButtonText: 'TERMINATE',
            cancelButtonText: 'ABORT',
            confirmButtonColor: '#dc2626', // Crimson Red
            cancelButtonColor: '#0f172a',  // Solid Black (Slate-950)
            background: '#ffffff',
            width: '400px',
            padding: '2.5rem',
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:8000/api/delete-blood-request/${requestId}/`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'X-CSRFToken': csrfToken,
                }
            });

            if (response.ok) {
                await fetchDashboardData();
                Swal.fire({
                    title: '<span style="font-family: Poppins; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: -0.02em;">Signal Purged</span>',
                    html: '<div style="font-family: Poppins; font-weight: 600; color: #64748b; font-size: 14px; margin-top: 8px;">The blood request has been permanently removed from the artery.</div>',
                    icon: 'success',
                    iconColor: '#10b981', // Clinical Emerald
                    confirmButtonText: 'ACKNOWLEDGE',
                    confirmButtonColor: '#0f172a', // Solid Black (Slate-950)
                    background: '#ffffff',
                    width: '400px',
                    padding: '2.5rem',
                });
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete request');
            }
        } catch (error) {
            console.error('Error deleting request:', error);
            Swal.fire({
                title: 'Error!',
                text: error.message || 'Failed to delete request',
                icon: 'error',
                confirmButtonColor: '#ef4444',
            });
        }
    };

    const createBloodRequest = async (formData) => {
        try {
            const response = await fetch('http://localhost:8000/api/create-blood-request/', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                },
                body: JSON.stringify({
                    ...formData,
                    urgency: formData.urgency_level
                })
            });

            if (response.ok) {
                await fetchDashboardData();
                Swal.fire({
                    title: 'Success!',
                    text: 'Blood request created successfully!',
                    icon: 'success',
                    confirmButtonColor: '#10b981',
                });
                return Promise.resolve();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create request');
            }
        } catch (error) {
            console.error('Error creating blood request:', error);
            Swal.fire({
                title: 'Error!',
                text: error.message || 'Failed to create request',
                icon: 'error',
                confirmButtonColor: '#ef4444',
            });
            throw error;
        }
    };

    const submitHelpForm = async (formData) => {
        if (!selectedRequest || !userData) return;

        try {
            const response = await fetch(
                `http://localhost:8000/api/help-form/${userData.id}/${selectedRequest.requester?.id || selectedRequest.requester_id}/${selectedRequest.id}/`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken,
                    },
                    body: JSON.stringify(formData)
                }
            );

            if (response.ok) {
                const data = await response.json();
                Swal.fire({
                    title: 'Success!',
                    text: 'Help offer submitted successfully!',
                    icon: 'success',
                    confirmButtonColor: '#10b981',
                });
                await fetchDashboardData();
                return Promise.resolve();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to submit help offer');
            }
        } catch (error) {
            console.error('Error submitting help form:', error);
            Swal.fire({
                title: 'Error!',
                text: error.message || 'Failed to submit help offer. Please try again.',
                icon: 'error',
                confirmButtonColor: '#ef4444',
            });
            throw error;
        }
    };

    const showRequestOnMap = (request) => {
        if (!request.final_donors || request.final_donors.length === 0) {
            Swal.fire({
                title: 'No Approved Donors',
                text: 'No donors have been approved for this request yet.',
                icon: 'info',
                confirmButtonColor: '#3b82f6',
            });
            return;
        }

        const waypoints = [
            { lat: userLocation[0], lng: userLocation[1] }
        ];

        const numDonors = Math.min(request.final_donors.length, 3);
        for (let i = 0; i < numDonors; i++) {
            const offset = 0.01 * (i + 1);
            waypoints.push({
                lat: userLocation[0] + offset,
                lng: userLocation[1] + offset
            });
        }

        setMapRouteData({ waypoints });
        setShowMapModal(true);
    };

    const showReceiverOnMap = (request) => {
        const waypoints = [
            { lat: userLocation[0], lng: userLocation[1] },
            {
                lat: userLocation[0] + 0.02,
                lng: userLocation[1] + 0.015
            }
        ];

        setMapRouteData({ waypoints });
        setShowMapModal(true);
    };

    // Status badge component
    const StatusBadge = ({ status, acceptedCount }) => {
        if (status === "Fulfilled") {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Fulfilled
                </span>
            );
        } else if (acceptedCount == 2) {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    On Going
                </span>
            );

        } else if (acceptedCount < 2) {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    In Progress
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {status || 'Pending'}
                </span>
            );
        }
    };

    // Donor status component
    const DonorStatus = ({ request }) => {
        if (!userData) return null;

        const userId = userData.id;

        if (isUserInList(userId, request.final_donors)) {
            return (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <UserCheck className="w-4 h-4 mr-1" />
                    Confirmed
                </span>
            );
        } else if (isUserInList(userId, request.accepted_donors)) {
            if (isUserInList(userId, request.rejected_donors_by_requester)) {
                return (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        <UserX className="w-4 h-4 mr-1" />
                        Rejected
                    </span>
                );
            } else {
                return (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        Waiting Approval
                    </span>
                );
            }
        } else if (isUserInList(userId, request.request_ignored_by_donors)) {
            return (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    <X className="w-4 h-4 mr-1" />
                    Ignored
                </span>
            );
        }
        return null;
    };

    // Function to check if user can accept a request
    const canAcceptRequest = (request) => {
        if (!userData) return false;

        const userId = userData.id;

        return !isUserInList(userId, request.accepted_donors) &&
            !isUserInList(userId, request.final_donors) &&
            !isUserInList(userId, request.rejected_donors_by_requester) &&
            !isUserInList(userId, request.request_ignored_by_donors) &&
            (request.accepted_count || 0) < 2;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="text-center">
                    <div className="relative">
                        <Heart className="w-16 h-16 text-red-500 animate-pulse mx-auto" />
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600 absolute -top-2 -right-2" />
                    </div>
                    <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    // Get user's blood group
    const userBloodGroup = userData?.donorprofile?.blood_group || userData?.blood_group || 'N/A';

    return (
        <div className="min-h-screen bg-transparent">
            <section className="relative overflow-hidden">
                {/* GSAP BACKGROUND: BIO-BLOOM EFFECT */}
                <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                    <div className="serum-blob absolute top-[-5%] left-[-5%] w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[100px]" />
                    <div className="serum-blob absolute bottom-[10%] right-[10%] w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-[80px]" />
                </div>

                <div className="relative max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="grid grid-cols-1 lg:grid-cols-4 gap-8"
                    >
                        {/* MAIN PROFILE CAPSULE (Takes 3 columns on desktop) */}
                        <div className="lg:col-span-3">
                            <div className="bg-white/60 backdrop-blur-2xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.02)] p-8 lg:p-10 border border-white flex flex-col relative overflow-hidden">

                                {/* Welcome Artery Header */}
                                <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 mb-12">
                                    <div className="text-center md:text-left">
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="flex items-center gap-3 justify-center md:justify-start mb-2"
                                        >
                                            <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg shadow-red-200">
                                                Artery Verified
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3 h-3 text-amber-500 fill-current" />
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">Elite Donor</span>
                                            </div>
                                        </motion.div>
                                        <h1 className="text-4xl lg:text-5xl font-bold text-black tracking-tighter leading-none">
                                            Welcome, <span className="text-red-600">{userData?.username}</span>
                                        </h1>
                                        <p className="text-slate-500 mt-3 font-medium flex items-center gap-2 justify-center md:justify-start">
                                            <Activity className="w-4 h-4 text-emerald-500" />
                                            Your vitals are stable. Ready to save lives today.
                                        </p>
                                    </div>

                                    {/* Living Heart Biometric */}
                                    <div className="relative group shrink-0">
                                        <motion.div
                                            animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                            className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-700 rounded-[2rem] flex items-center justify-center shadow-[0_20px_40px_rgba(220,38,38,0.3)] border-4 border-white"
                                        >
                                            <Heart className="w-12 h-12 text-white fill-current" />
                                        </motion.div>
                                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform">
                                            <Trophy className="w-5 h-5 text-amber-500" />
                                        </div>
                                        <div className="absolute -inset-4 bg-red-600/10 rounded-full blur-2xl -z-10 animate-pulse" />
                                    </div>
                                </div>

                                {/* VITAL SIGNS GRID (Poppins inherited) */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-auto">
                                    <div className="bg-white border border-slate-100 p-5 rounded-[2rem] shadow-sm hover:shadow-md transition-all group overflow-hidden">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Blood Type</p>
                                        <p className="text-3xl font-bold text-black group-hover:text-red-600 transition-colors">{userBloodGroup}</p>
                                        <Droplets className="absolute -right-2 -bottom-2 w-12 h-12 text-red-600/5" />
                                    </div>

                                    <div className="bg-white border border-slate-100 p-5 rounded-[2rem] shadow-sm hover:shadow-md transition-all group overflow-hidden">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">My Requests</p>
                                        <p className="text-3xl font-bold text-black group-hover:text-blue-600 transition-colors">{myRequests.length}</p>
                                        <ClipboardList className="absolute -right-2 -bottom-2 w-12 h-12 text-blue-600/5" />
                                    </div>

                                    <div className="bg-white border border-slate-100 p-5 rounded-[2rem] shadow-sm hover:shadow-md transition-all group overflow-hidden">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Live Channels</p>
                                        <p className="text-3xl font-bold text-black group-hover:text-purple-600 transition-colors">{chatRooms.length}</p>
                                        <MessageSquare className="absolute -right-2 -bottom-2 w-12 h-12 text-purple-600/5" />
                                    </div>

                                    <div className="bg-slate-950 p-5 rounded-[2.2rem] shadow-xl group overflow-hidden">
                                        <div className="flex items-center gap-2 mb-2">
                                            <MapPin className="w-4 h-4 text-red-500 animate-pulse" />
                                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Live Artery</span>
                                        </div>
                                        <p className="text-xs font-bold text-white leading-tight truncate mb-1">{locationName}</p>
                                        <p className="text-[10px] font-medium text-slate-500 font-mono">
                                            {userLocation[0].toFixed(2)}, {userLocation[1].toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* COMMAND CENTER: QUICK ACTIONS */}
                        <div className="lg:col-span-1">
                            <div className="h-full bg-slate-900 rounded-[3rem] p-6 shadow-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />

                                <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                                    <Zap className="w-4 h-4 text-red-500 fill-current" />
                                    Tactical Hub
                                </h3>

                                <div className="space-y-4 relative z-10">
                                    <motion.button
                                        whileHover={{ scale: 1.02, x: 5 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setShowStatusPopup(true)}
                                        className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-3xl flex items-center gap-4 transition-all border border-white/5"
                                    >
                                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0">
                                            <ChartBar className="w-5 h-5 text-slate-900" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-bold text-white uppercase tracking-tight">Diagnostic Stats</p>
                                            <p className="text-[10px] text-slate-400">View ID: {userStatusData?.user_id}</p>
                                        </div>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02, x: 5 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => navigate('/dashboard/my-chats/')}
                                        className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-3xl flex items-center gap-4 transition-all border border-white/5"
                                    >
                                        <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center shrink-0">
                                            <MessageSquare className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-bold text-white uppercase tracking-tight">Chat Area</p>
                                            <p className="text-[10px] text-slate-400">{chatRooms.length} Active Feeds</p>
                                        </div>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02, x: 5 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={updateLocation}
                                        className="w-full p-4 bg-emerald-600 hover:bg-emerald-700 rounded-3xl flex items-center gap-4 transition-all shadow-lg shadow-emerald-900/40"
                                    >
                                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                                            <Navigation className="w-5 h-5 text-white" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-bold text-white uppercase tracking-tight">Relocate Artery</p>
                                            <p className="text-[10px] text-emerald-200">Sync Live GPS</p>
                                        </div>
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => window.location.reload()}
                                        className="w-full py-4 mt-6 bg-white/5 hover:bg-white text-white hover:text-slate-900 rounded-[2rem] text-[10px] font-bold uppercase tracking-[0.3em] transition-all border border-white/10"
                                    >
                                        <Loader2 className="w-3 h-3 inline mr-2 animate-spin" />
                                        Refresh System
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Main Dashboard Tabs */}
            <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                {/* Tab Navigation */}
                <div className="mb-10 relative z-20">
                    <div className="flex flex-col sm:flex-row gap-2 bg-white/60 backdrop-blur-2xl  rounded-2xl border border-white shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
                        {[
                            {
                                id: 'my-requests',
                                label: 'My Requests',
                                count: myRequests.length,
                                icon: <ClipboardList size={16} />
                            },
                            {
                                id: 'my-group',
                                label: `My Blood Match (${userBloodGroup})`,
                                count: activeMyGroup.length,
                                icon: <Activity size={16} />
                            },
                            {
                                id: 'other-group',
                                label: 'Other Types',
                                count: activeOther.length,
                                icon: <Users size={16} />
                            }
                        ].map((tab) => {
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative flex-1 group flex items-center justify-center gap-3 py-4 px-6 rounded-[1.6rem] transition-all duration-500 overflow-hidden ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    {/* LIQUID FLOW BACKGROUND */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeArteryTab"
                                            className="absolute inset-0 bg-slate-900 shadow-xl shadow-slate-200 z-0"
                                            style={{ borderRadius: '1.6rem' }}
                                            transition={{ type: "spring", bounce: 0.25, duration: 0.6 }}
                                        />
                                    )}

                                    {/* TAB CONTENT */}
                                    <span className={`relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                                        {React.cloneElement(tab.icon, {
                                            className: isActive ? "text-red-500" : "text-slate-300 group-hover:text-red-400"
                                        })}
                                    </span>

                                    <span className="relative z-10 text-xs font-bold uppercase tracking-widest truncate">
                                        {tab.label}
                                    </span>

                                    {/* DIGITAL COUNTER BADGE */}
                                    <div className={`relative z-10 ml-2 px-2.5 py-1 rounded-full text-[10px] font-black transition-all duration-300 ${isActive
                                        ? 'bg-red-600 text-white shadow-lg'
                                        : 'bg-slate-100 text-slate-400 group-hover:bg-red-50 group-hover:text-red-600'
                                        }`}>
                                        {tab.count.toString().padStart(2, '0')}
                                    </div>

                                    {/* ACTIVE GLOW DOT */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeDot"
                                            className="absolute bottom-2 w-1 h-1 bg-red-500 rounded-full"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area */}
                <AnimatePresence mode="wait">
                    {activeTab === 'my-requests' && (
                        <motion.div
                            key="my-requests"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >


                            <div className="mb-6 flex flex-row items-center justify-between gap-4">
                                {/* TEXT SECTION */}
                                <div>
                                    <h2 className="text-2xl font-bold text-black leading-tight">
                                        My <span className="text-red-600">Blood</span> Requests
                                    </h2>
                                    <p className="text-sm font-medium text-slate-500">
                                        Manage your blood donation requests
                                    </p>
                                </div>

                                {/* ACTION BUTTON */}
                                <Link to="/dashboard/emergencyBlood">
                                    <motion.button
                                        whileHover={{ backgroundColor: "#000" }} // Tactical switch to Solid Black
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center px-5 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-100 transition-all duration-300 group"
                                    >
                                        <Plus className="w-4 h-4 mr-2 transition-transform group-hover:rotate-90" />
                                        New Request
                                    </motion.button>
                                </Link>
                            </div>



                            {myRequests.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
                                    {myRequests.map((request, idx) => (
                                        <motion.div
                                            key={request.id}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group h-full"
                                        >
                                            {/* CARD BODY: COMPACT BIO-CAPSULE */}
                                            <div className="relative h-full bg-white/70 backdrop-blur-xl rounded-3xl border border-slate-200 overflow-hidden p-5 flex flex-col shadow-sm transition-all hover:shadow-md hover:border-red-200">

                                                {/* HEADER: ID & BLOOD GROUP (Consolidated) */}
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="space-y-1.5">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-bold text-slate-400">#{request.id}</span>
                                                            {request.urgency && (
                                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${request.urgency === 'emergency'
                                                                    ? 'bg-red-600 text-white animate-pulse'
                                                                    : 'bg-amber-500 text-white'
                                                                    }`}>
                                                                    {request.urgency}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                                            <Calendar className="w-3.5 h-3.5 text-red-500" />
                                                            {request.created_at_12h}
                                                        </div>
                                                    </div>

                                                    {/* BLOOD GROUP BOX */}
                                                    <div className="relative shrink-0">
                                                        <div className="w-14 h-14 bg-slate-900 rounded-2xl flex flex-col items-center justify-center shadow-lg group-hover:bg-red-600 transition-colors duration-300">
                                                            <span className="text-xl font-bold text-white leading-none">
                                                                {request.blood_group}
                                                            </span>
                                                            <span className="text-[8px] font-bold text-white/40 uppercase mt-0.5">Type</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* DONOR PROGRESS (Compact) */}
                                                <div className="mb-4 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                                                    <div className="flex justify-between items-center mb-2 text-[11px]">
                                                        <div className="flex items-center gap-2">
                                                            <StatusBadge status={request.status} acceptedCount={request.accepted_count} />
                                                            <span className="font-bold text-slate-400">ARTERY</span>
                                                        </div>
                                                        <span className="font-bold text-slate-700">
                                                            {request.accepted_count || 0}/2 Donors
                                                        </span>
                                                    </div>
                                                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${((request.accepted_count || 0) / 2) * 100}%` }}
                                                            className={`h-full transition-all duration-1000 ${request.accepted_count >= 2 ? 'bg-emerald-500' : 'bg-red-600'
                                                                }`}
                                                        />
                                                    </div>
                                                </div>

                                                {/* DETAILS: TIGHT LIST */}
                                                <div className="space-y-2.5 mb-5 flex-1">
                                                    {request.full_name && (
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center shrink-0">
                                                                <User className="w-4 h-4 text-slate-400" />
                                                            </div>
                                                            <span className="text-sm font-semibold text-slate-700 truncate">{request.full_name}</span>
                                                        </div>
                                                    )}

                                                    {request.detail_address && (
                                                        <div className="flex items-start gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center shrink-0">
                                                                <MapPin className="w-4 h-4 text-slate-400" />
                                                            </div>
                                                            <span className="text-[13px] font-medium text-slate-600 leading-snug line-clamp-2">{request.detail_address}</span>
                                                        </div>
                                                    )}

                                                    {request.contact_number && (
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center shrink-0">
                                                                <Phone className="w-4 h-4 text-emerald-500" />
                                                            </div>
                                                            <span className="text-sm font-semibold text-slate-700">{request.contact_number}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* ACTION BUTTONS: COMPACT GRID */}
                                                <div className="space-y-2 pt-4 border-t border-slate-100">
                                                    {(request.accepted_donors?.length > 0 || request.donors?.length > 0) ? (
                                                        <div className="flex flex-col gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedRequest(request);
                                                                    setShowDonorModal(true);
                                                                }}
                                                                className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 hover:bg-red-600 transition-colors"
                                                            >
                                                                <Users size={14} /> Manage Donors ({request.accepted_donors?.length || 0})
                                                            </button>

                                                            {request.final_donors?.length > 0 && (
                                                                <button
                                                                    onClick={() => showRequestOnMap(request)}
                                                                    className="w-full py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 hover:bg-slate-50"
                                                                >
                                                                    <Map size={14} className="text-red-600" /> Location
                                                                </button>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="text-center py-3 bg-red-50 rounded-xl border border-dashed border-red-100">
                                                            <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Awaiting Responses</p>
                                                        </div>
                                                    )}

                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedRequest(request);
                                                                setShowHelpOffersModal(true);
                                                            }}
                                                            className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-bold uppercase flex items-center justify-center gap-2 hover:bg-amber-500 hover:text-white transition-all"
                                                        >
                                                            <Zap size={14} /> Help ({getHelpOffersCount(request.id)})
                                                        </button>

                                                        <button
                                                            onClick={() => deleteBloodRequest(request.id)}
                                                            className="px-3 py-2.5 bg-white border border-slate-200 text-slate-300 hover:text-red-600 hover:border-red-200 rounded-xl transition-all"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-20 bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white shadow-[inner_0_2px_10px_rgba(0,0,0,0.02)] relative overflow-hidden"
                                >
                                    {/* SUBTLE SCANNING EFFECT BACKGROUND */}
                                    <div className="absolute inset-0 pointer-events-none">
                                        <motion.div
                                            animate={{ y: [-100, 400] }}
                                            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                            className="w-full h-[2px] bg-gradient-to-r from-transparent via-red-500/10 to-transparent"
                                        />
                                    </div>

                                    <div className="relative z-10 max-w-md mx-auto px-6">
                                        {/* PULSING BIOMETRIC ICON */}
                                        <div className="relative w-24 h-24 mx-auto mb-8">
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                                                transition={{ repeat: Infinity, duration: 2 }}
                                                className="absolute inset-0 bg-red-100 rounded-full blur-2xl"
                                            />
                                            <div className="relative w-full h-full bg-white rounded-[2rem] shadow-xl border border-slate-50 flex items-center justify-center">
                                                <Heart className="w-12 h-12 text-red-600 fill-current animate-pulse" />

                                                {/* SMALL STATUS INDICATOR */}
                                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-slate-950 rounded-lg flex items-center justify-center border-2 border-white">
                                                    <X size={12} className="text-white" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* TEXT CONTENT: SOLID BLACK POPPINS */}
                                        <h3 className="text-2xl font-black text-black uppercase tracking-tighter mb-4">
                                            Artery Feed Empty
                                        </h3>
                                        <p className="text-[13px] font-bold text-slate-500 leading-relaxed uppercase tracking-widest mb-10">
                                            No active blood requests detected. Your terminal is currently on standby. Start a new signal to find matching donor nodes.
                                        </p>

                                        {/* TACTICAL ACTION BUTTON */}
                                        <Link to="/dashboard/emergencyBlood">
                                            <motion.button
                                                whileHover={{ scale: 1.05, backgroundColor: "#000" }}
                                                whileTap={{ scale: 0.95 }}
                                                className="inline-flex items-center px-10 py-4 bg-red-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl shadow-red-200 transition-all group"
                                            >
                                                <Plus className="w-4 h-4 mr-3 transition-transform group-hover:rotate-90" />
                                                Find Donors
                                            </motion.button>
                                        </Link>
                                    </div>

                                    {/* WATERMARK ICON */}
                                    <Droplets size={200} className="absolute -bottom-20 -right-20 text-slate-900/[0.02] -rotate-12" />
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'my-group' && (
                        <motion.div
                            key="my-group"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Emergency Requests ({userBloodGroup})</h2>
                                <p className="text-gray-600">Blood requests matching your blood type</p>
                            </div>

                            {activeMyGroup.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                    {activeMyGroup.map((request, idx) => (
                                        <motion.div
                                            key={request.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            whileHover={{ y: -6, scale: 1.01 }}
                                            className="group h-full"
                                        >
                                            {/* MEDICAL EMERGENCY CARD - PREMIUM DESIGN */}
                                            <div className="relative h-full bg-gradient-to-br from-white to-white/95 rounded-2xl border border-slate-200/80 p-5 flex flex-col transition-all duration-300 hover:border-red-300/50 hover:shadow-2xl hover:shadow-red-100/30 shadow-sm shadow-slate-100 overflow-hidden">

                                                {/* EMERGENCY STRIPE */}
                                                {request.urgency === 'emergency' && (
                                                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-red-500 to-red-600 animate-pulse"></div>
                                                )}

                                                {/* HEADER: MEDICAL PROFILE */}
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative">
                                                            <div className="w-11 h-11 bg-gradient-to-br from-slate-50 to-white rounded-xl flex items-center justify-center border border-slate-200/80 group-hover:border-red-200 transition-colors shadow-sm">
                                                                <User className="w-5 h-5 text-slate-700 group-hover:text-red-600 transition-colors" />
                                                            </div>
                                                            {/* ONLINE STATUS DOT */}
                                                            {Math.random() > 0.5 && (
                                                                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h3 className="text-[15px] font-bold text-slate-900 leading-tight">
                                                                {request.requester?.username || 'Anonymous'}
                                                            </h3>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <p className="text-[11px] font-medium text-slate-500">
                                                                    {request.created_at_12h}
                                                                </p>
                                                                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded-full uppercase">
                                                                    ID: #{request.id}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* BLOOD TYPE - MEDICAL BADGE */}
                                                    <div className="relative">
                                                        <div className="w-14 h-14 bg-gradient-to-br from-slate-900 to-black rounded-xl flex flex-col items-center justify-center shadow-lg group-hover:from-red-700 group-hover:to-red-900 transition-all duration-300">
                                                            <span className="text-xl font-black text-white leading-none tracking-tight">{request.blood_group}</span>
                                                            <span className="text-[7px] font-bold text-white/60 uppercase tracking-widest mt-0.5">BLOOD</span>
                                                        </div>
                                                        {/* DONOR COUNT BADGE */}
                                                        <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-white border-2 border-slate-900 rounded-full flex items-center justify-center shadow-md">
                                                            <span className="text-[10px] font-black text-slate-900">{(request.accepted_count || 0)}/2</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* STATUS & URGENCY INDICATOR */}
                                                <div className="flex items-center gap-2 mb-4">
                                                    <DonorStatus request={request} />

                                                    {request.urgency === 'emergency' && (
                                                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-red-50 to-red-100/50 border border-red-200 rounded-full">
                                                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                                            <span className="text-[10px] font-black text-red-700 uppercase tracking-wider">EMERGENCY</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* PATIENT INFORMATION - MEDICAL CHART STYLE */}
                                                <div className="space-y-3 mb-5 flex-1">
                                                    {request.full_name && (
                                                        <div className="flex items-center gap-3 p-2.5 bg-slate-50/80 rounded-xl border border-slate-100">
                                                            <div className="w-8 h-8 bg-gradient-to-br from-red-50 to-red-100 rounded-lg flex items-center justify-center">
                                                                <Activity className="w-4 h-4 text-red-600" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Patient</p>
                                                                <p className="text-sm font-bold text-slate-900 truncate">{request.full_name}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {request.detail_address && (
                                                        <div className="flex items-start gap-3 p-2.5 bg-slate-50/80 rounded-xl border border-slate-100">
                                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
                                                                <MapPin className="w-4 h-4 text-blue-600" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Location</p>
                                                                <p className="text-[13px] font-semibold text-slate-900 line-clamp-1">{request.detail_address}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {request.contact_number && (
                                                        <div className="flex items-center gap-3 p-2.5 bg-slate-50/80 rounded-xl border border-slate-100">
                                                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg flex items-center justify-center">
                                                                <Phone className="w-4 h-4 text-emerald-600" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Contact</p>
                                                                <p className="text-sm font-black text-slate-900">{request.contact_number}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {request.description && (
                                                        <div className="p-3 bg-gradient-to-br from-amber-50/50 to-amber-100/30 rounded-xl border border-amber-100">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <AlertCircle className="w-4 h-4 text-amber-600" />
                                                                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">Additional Notes</span>
                                                            </div>
                                                            <p className="text-xs text-slate-700 line-clamp-2 italic pl-6">{request.description}</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* ACTION BUTTONS - MEDICAL PROTOCOL STYLE */}
                                                <div className="space-y-2.5 pt-4 border-t border-slate-100/80">
                                                    {/* PRIMARY ACTIONS */}
                                                    <div className="flex gap-2">
                                                        {canAcceptRequest(request) && (
                                                            <motion.button
                                                                whileHover={{ scale: 1.03 }}
                                                                whileTap={{ scale: 0.97 }}
                                                                onClick={() => acceptBloodRequest(request.id)}
                                                                className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wide hover:from-emerald-700 hover:to-emerald-800 transition-all shadow-md hover:shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                                Accept Request
                                                            </motion.button>
                                                        )}

                                                        {canChatWithRequest(request) && (
                                                            <motion.button
                                                                whileHover={{ scale: 1.03 }}
                                                                whileTap={{ scale: 0.97 }}
                                                                onClick={() => openChatRoomForRequest(request)}
                                                                className="flex-1 py-3 bg-gradient-to-r from-slate-900 to-black text-white rounded-xl text-xs font-black uppercase tracking-wide hover:from-red-700 hover:to-red-900 transition-all shadow-md hover:shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
                                                            >
                                                                <MessageSquare className="w-4 h-4" />
                                                                Medical Hub
                                                            </motion.button>
                                                        )}
                                                    </div>

                                                    {/* SECONDARY ACTIONS */}
                                                    <div className="flex gap-2">
                                                        <motion.button
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={() => ignoreBloodRequest(request)}
                                                            className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-wide hover:border-red-200 hover:text-red-600 hover:bg-red-50/30 transition-all flex items-center justify-center gap-2"
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                            Ignore Case
                                                        </motion.button>

                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => showReceiverOnMap(request)}
                                                            className="px-4 py-2.5 bg-gradient-to-br from-slate-50 to-white border border-slate-200 text-slate-700 rounded-xl hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all shadow-sm"
                                                            title="View on Medical Map"
                                                        >
                                                            <div className="flex items-center gap-1.5">
                                                                <Map className="w-4 h-4" />
                                                                <span className="text-[10px] font-bold uppercase">Map</span>
                                                            </div>
                                                        </motion.button>
                                                    </div>

                                                    {/* DISTANCE INDICATOR (Optional - if you have distance data) */}
                                                    {request.distance && (
                                                        <div className="pt-2 border-t border-slate-100">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-1.5">
                                                                    <Navigation className="w-3.5 h-3.5 text-slate-400" />
                                                                    <span className="text-[10px] font-medium text-slate-500 uppercase">Distance</span>
                                                                </div>
                                                                <span className="text-sm font-black text-slate-900">{request.distance} km</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* CARD FOOTER DECORATION */}
                                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-slate-100 to-transparent opacity-50 group-hover:via-red-100 transition-colors"></div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-16 bg-white/40 backdrop-blur-md rounded-2xl border border-white shadow-sm relative overflow-hidden"
                                >
                                    {/* SCANNING LINE ANIMATION */}
                                    <div className="absolute inset-0 pointer-events-none opacity-20">
                                        <motion.div
                                            animate={{ y: [-200, 400] }}
                                            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                            className="w-full h-[1px] bg-red-500 shadow-[0_0_10px_red]"
                                        />
                                    </div>

                                    <div className="relative z-10 max-w-md mx-auto px-6">
                                        {/* PULSING SIGNAL ICON */}
                                        <div className="relative w-16 h-16 mx-auto mb-6">
                                            <motion.div
                                                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                                                transition={{ repeat: Infinity, duration: 2 }}
                                                className="absolute inset-0 bg-red-100 rounded-full blur-xl"
                                            />
                                            <div className="relative w-full h-full bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center">
                                                <Activity className="w-8 h-8 text-slate-300" />

                                                {/* LIVE SCAN DOT */}
                                                <div className="absolute top-2 right-2 flex h-2 w-2">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* TEXT CONTENT: SOLID BLACK POPPINS */}
                                        <h3 className="text-xl font-bold text-black uppercase tracking-tight mb-2">
                                            No Active Signals
                                        </h3>
                                        <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                            The artery is currently clear. No emergency requests matching your profile were detected in this sector.
                                        </p>

                                        {/* REFRESH STATUS */}
                                        <div className="mt-8 inline-flex items-center gap-2 px-4 py-1.5 bg-slate-900/5 rounded-full border border-slate-200/50">
                                            <Loader2 size={12} className="text-slate-400 animate-spin" />
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                Monitoring Artery...
                                            </span>
                                        </div>
                                    </div>

                                    {/* DECORATIVE BACKGROUND ICON */}
                                    <Zap size={150} className="absolute -bottom-10 -right-10 text-slate-900/[0.02] -rotate-12" />
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'other-group' && (
                        <motion.div
                            key="other-group"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Other Blood Type Requests</h2>
                                <p className="text-gray-600">You can still offer help for other blood types</p>
                            </div>

                            {activeOther.length > 0 ? (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {activeOther.map((request, idx) => (
                                        <motion.div
                                            key={request.id}
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: idx * 0.05 }}
                                            whileHover={{ y: -5 }}
                                            className="group relative h-full"
                                        >
                                            {/* CARD BODY: THE DIAGNOSTIC SLIP */}
                                            <div className="relative h-full bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-xl hover:border-red-200">

                                                {/* TOP STRIP: SYSTEM ID & TIME */}
                                                <div className="px-6 py-3 bg-slate-900/5 border-b border-white/50 flex justify-between items-center">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Community Artery</span>
                                                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-950">
                                                        <Clock className="w-3.5 h-3.5 text-red-500" />
                                                        {request.created_at_12h}
                                                    </div>
                                                </div>

                                                <div className="p-6 flex flex-col flex-1">
                                                    {/* MAIN INFO ROW */}
                                                    <div className="flex items-center justify-between mb-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-16 h-16 bg-slate-950 rounded-2xl flex flex-col items-center justify-center shadow-lg group-hover:bg-red-600 transition-colors duration-500">
                                                                <span className="text-2xl font-bold text-white leading-none">{request.blood_group}</span>
                                                                <span className="text-[8px] font-bold text-white/50 uppercase mt-1">Need</span>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <h3 className="text-base font-bold text-slate-950 leading-tight">Blood Required</h3>
                                                                <div className="flex items-center gap-2">
                                                                    <StatusBadge status={request.status} acceptedCount={request.accepted_count} />
                                                                    <span className="text-[11px] font-bold text-slate-400">{request.accepted_count || 0}/2 Donors</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* DATA GRID: REDUCES WHITESPACE */}
                                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                                        <div className="bg-white/40 p-3 rounded-xl border border-white/50">
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Requester</p>
                                                            <div className="flex items-center gap-2">
                                                                <User className="w-3.5 h-3.5 text-red-500" />
                                                                <span className="text-xs font-bold text-slate-950 truncate">{request.requester?.username || 'Unknown'}</span>
                                                            </div>
                                                        </div>

                                                        <div className="bg-white/40 p-3 rounded-xl border border-white/50">
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Patient</p>
                                                            <div className="flex items-center gap-2">
                                                                <Activity className="w-3.5 h-3.5 text-blue-500" />
                                                                <span className="text-xs font-bold text-slate-950 truncate">{request.full_name || 'N/A'}</span>
                                                            </div>
                                                        </div>

                                                        <div className="col-span-2 bg-white/40 p-3 rounded-xl border border-white/50">
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Location</p>
                                                            <div className="flex items-center gap-2">
                                                                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                                                                <span className="text-xs font-bold text-slate-950 line-clamp-1">{request.detail_address}</span>
                                                            </div>
                                                        </div>

                                                        {request.description && (
                                                            <div className="col-span-2 bg-slate-900/5 p-3 rounded-xl border border-dashed border-slate-200">
                                                                <p className="text-[11px] text-slate-600 italic line-clamp-2">
                                                                    <MessageSquare className="w-3 h-3 inline mr-2 text-slate-400" />
                                                                    {request.description}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* ACTIONS: TIGHT & FUNCTIONAL */}
                                                    <div className="mt-auto space-y-2">
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedRequest(request);
                                                                    setShowHelpModal(true);
                                                                }}
                                                                className="flex-[2] py-3 bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase hover:bg-emerald-700 transition-all shadow-md shadow-emerald-100"
                                                            >
                                                                Offer Help
                                                            </button>
                                                            <button
                                                                onClick={() => ignoreBloodRequest(request)}
                                                                className="flex-1 py-3 bg-white border border-slate-200 text-slate-400 rounded-xl text-xs font-bold uppercase hover:text-red-600 hover:border-red-100 transition-all"
                                                            >
                                                                Ignore
                                                            </button>
                                                        </div>

                                                        <button
                                                            onClick={() => showReceiverOnMap(request)}
                                                            className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 hover:bg-red-600 transition-colors shadow-lg shadow-slate-200"
                                                        >
                                                            <Map size={14} /> View Location
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-sm border border-purple-100">
                                    <AlertCircle className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No Requests Available</h3>
                                    <p className="text-gray-600 max-w-md mx-auto">
                                        There are currently no active requests for other blood types.
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* 🔥 CRITICAL FIX: MODALS RENDERED PROPERLY 🔥 */}
            {/* All modals are now properly wrapped with conditional rendering */}

            {/* Status Stats Popup Modal */}
            <StatusStatsPopup
                isOpen={showStatusPopup}
                onClose={() => setShowStatusPopup(false)}
                statusData={userStatusData}
            />

            {/* Map Modal */}
            <MapModal
                isOpen={showMapModal}
                onClose={() => setShowMapModal(false)}
                routeData={mapRouteData}
                userLocation={userLocation}
            />

            {/* Help Form Modal */}
            <HelpFormModal
                isOpen={showHelpModal}
                onClose={() => {
                    setShowHelpModal(false);
                    setSelectedRequest(null);
                }}
                request={selectedRequest}
                onSubmit={submitHelpForm}
            />

            {/* Donor Modal */}
            <DonorModal
                isOpen={showDonorModal}
                onClose={() => {
                    setShowDonorModal(false);
                    setSelectedRequest(null);
                }}
                request={selectedRequest}
                onApprove={approveDonor}
                onReject={rejectDonor}
            />

            {/* Help Offers Modal */}
            <HelpOffersModal
                isOpen={showHelpOffersModal}
                onClose={() => {
                    setShowHelpOffersModal(false);
                    setSelectedRequest(null);
                }}
                request={selectedRequest}
                helpOffers={helpPosts}
            />
        </div>
    );
};

export default Dashboard;





