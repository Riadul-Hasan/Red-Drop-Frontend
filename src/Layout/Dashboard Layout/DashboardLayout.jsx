

// import React, { useState, useEffect, useRef } from "react";
// import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { gsap } from "gsap";
// import {
//     Heart,
//     Droplets,
//     Users,
//     Bell,
//     Search,
//     User,
//     LogOut,
//     Menu,
//     X,
//     PlusCircle,
//     MessageSquare,
//     Home,
//     ClipboardList,
//     Calendar,
//     Map,
//     Activity,
//     Award,
//     Zap,
//     Droplet
// } from "lucide-react";

// // --- HELPERS ---
// const getCookie = (n) => {
//     let a = document.cookie.match(new RegExp("(^| )" + n + "=([^;]*)"));
//     return a ? decodeURIComponent(a[2]) : null;
// };

// const DashboardLayout = ({ userData }) => {
//     const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
//     const [isNotifOpen, setNotifOpen] = useState(false);
//     const [notifications, setNotifications] = useState([]);
//     const location = useLocation();
//     const navigate = useNavigate();
//     const bgRef = useRef(null);

//     // 1. GSAP: SUBTLE GLOBAL AMBIENT MOTION
//     useEffect(() => {
//         const ctx = gsap.context(() => {
//             gsap.to(".serum-blob", {
//                 x: "random(-150, 150)",
//                 y: "random(-150, 150)",
//                 scale: "random(1.2, 1.8)",
//                 duration: "random(20, 30)",
//                 repeat: -1,
//                 yoyo: true,
//                 ease: "sine.inOut",
//                 stagger: 3,
//             });
//             gsap.to(".logo-pulse", {
//                 scale: 1.1,
//                 duration: 0.8,
//                 repeat: -1,
//                 yoyo: true,
//                 ease: "power1.inOut",
//             });
//         }, bgRef);

//         const handleResize = () => {
//             if (window.innerWidth > 1024) {
//                 setSidebarOpen(true);
//             } else {
//                 setSidebarOpen(false);
//             }
//         };

//         window.addEventListener("resize", handleResize);
//         return () => {
//             ctx.revert();
//             window.removeEventListener("resize", handleResize);
//         };
//     }, []);

//     const fetchNotifications = async () => {
//         try {
//             const res = await fetch("http://localhost:8000/api/notifications/", {
//                 credentials: "include",
//             });
//             if (res.ok) setNotifications(await res.json());
//         } catch (e) {
//             console.error(e);
//         }
//     };


//     //   logout
//     const handleLogout = async () => {
//         try {
//             await fetch("http://localhost:8000/api/logout/", {
//                 method: "POST",
//                 credentials: "include",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "X-CSRFToken": getCookie("csrftoken"),
//                 },
//             });
//         } catch (err) {
//             console.error("Logout failed:", err);
//         } finally {
//             navigate("/login", { replace: true });
//         }
//     };

//     useEffect(() => {
//         fetchNotifications();
//         const int = setInterval(fetchNotifications, 10000);
//         return () => clearInterval(int);
//     }, []);

//     const navLinks = [
//         { name: "Dashboard", path: "/dashboard", icon: Home },
//         { name: "Emergency", path: "/dashboard/emergencyBlood", icon: ClipboardList },
//         { name: "Chat Hub", path: "/dashboard/my-chats", icon: MessageSquare },
//         { name: "Live Map", path: "/dashboard/live-map", icon: Map },
//         { name: "About Us", path: "/dashboard/about-us", icon: Calendar },
//     ];

//     const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

//     return (
//         <div className="flex h-screen bg-[#F8FAFC] text-slate-900 overflow-hidden select-none relative">

//             {/* --- GLOBAL GSAP BACKGROUND --- */}
//             <div ref={bgRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-50">
//                 <div className="serum-blob absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-red-100 rounded-full blur-[140px]" />
//                 <div className="serum-blob absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-100 rounded-full blur-[120px]" />
//                 <div className="serum-blob absolute top-[30%] left-[20%] w-[40vw] h-[40vw] bg-red-50 rounded-full blur-[100px]" />
//             </div>

//             {/* --- MOBILE SIDEBAR OVERLAY --- */}
//             <AnimatePresence>
//                 {isSidebarOpen && window.innerWidth <= 1024 && (
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         onClick={() => setSidebarOpen(false)}
//                         className="fixed inset-0 bg-slate-900/10 backdrop-blur-sm z-[90]"
//                     />
//                 )}
//             </AnimatePresence>

//             {/* --- SIDEBAR --- */}
//             <motion.aside
//                 initial={false}
//                 animate={{
//                     x: isSidebarOpen ? 0 : -340,
//                     // Only use width on desktop to push content, on mobile width is 0 to avoid layout shifting
//                     width: window.innerWidth > 1024 ? (isSidebarOpen ? 320 : 0) : 0
//                 }}
//                 transition={{ type: "spring", damping: 25, stiffness: 200 }}
//                 className="fixed lg:relative z-[100] h-full p-4 shrink-0 overflow-visible"
//             >
//                 <div className="h-full w-[280px] lg:w-full bg-white/70 backdrop-blur-3xl rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.03)] border border-white/50 flex flex-col overflow-hidden">
//                     {/* Logo Section */}
//                     <Link to="/">
//                         <div className="p-10 flex items-center gap-4">
//                             <div className="logo-pulse w-11 h-11 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg">
//                                 <Heart className="text-white fill-current" size={22} />
//                             </div>
//                             <div className="flex-1">
//                                 <h1 className="text-xl font-black tracking-tighter  leading-none">Red Drop</h1>
//                                 <p className="text-[10px] font-bold text-red-600  tracking-widest mt-1">Be a life saver hero!</p>
//                             </div>
//                             {/* Mobile-only close button */}
//                             <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-2 text-slate-400">
//                                 <X size={20} />
//                             </button>
//                         </div>
//                     </Link>

//                     {/* Navigation Area */}
//                     <nav className="flex-1 px-4 flex flex-col overflow-y-auto custom-scrollbar">
//                         <div className="space-y-1 mb-6">
//                             {navLinks.map((item) => {
//                                 const isActive = location.pathname === item.path;
//                                 return (
//                                     <Link key={item.name} to={item.path} onClick={() => window.innerWidth <= 1024 && setSidebarOpen(false)}>
//                                         <motion.div
//                                             whileHover={{ x: 10 }}
//                                             className={`relative flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${isActive ? "text-red-600" : "text-slate-400 hover:text-slate-700"
//                                                 }`}
//                                         >
//                                             {isActive && (
//                                                 <motion.div
//                                                     layoutId="liquidNav"
//                                                     className="absolute inset-0 bg-red-50/60 rounded-2xl border border-red-100/50 z-0"
//                                                 />
//                                             )}
//                                             <item.icon size={18} className="relative z-10" />
//                                             <span className="relative z-10 font-bold text-sm">{item.name}</span>
//                                         </motion.div>
//                                     </Link>
//                                 );
//                             })}
//                         </div>

//                         {/* Pushed Down: STOCK PULSE */}
//                         <div className="mt-auto px-4 pb-8 space-y-4">
//                             <div className="p-5 bg-white/40 rounded-3xl border border-white/50 shadow-sm">
//                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
//                                     <Droplet size={12} className="text-red-600" /> Stock Pulse
//                                 </p>
//                                 <div className="space-y-4">
//                                     {["O+", "A-"].map((type, i) => (
//                                         <div key={type}>
//                                             <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1 uppercase">
//                                                 <span>Type {type}</span>
//                                                 <span className={i === 1 ? "text-red-600" : "text-emerald-600"}>{i === 1 ? "Critical" : "Stable"}</span>
//                                             </div>
//                                             <div className="h-1.5 bg-slate-200/50 rounded-full overflow-hidden">
//                                                 <motion.div
//                                                     initial={{ width: 0 }}
//                                                     animate={{ width: i === 1 ? "15%" : "80%" }}
//                                                     className={`h-full ${i === 1 ? "bg-red-600" : "bg-emerald-500"}`}
//                                                 />
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>

//                             <div className="flex items-center gap-3 px-5 py-3 bg-red-50/40 rounded-2xl border border-red-100/30">
//                                 <Award size={18} className="text-red-600" />
//                                 <div>
//                                     <p className="text-[10px] font-black text-red-900 uppercase leading-none">Impact</p>
//                                     <p className="text-xs font-bold text-red-600 tracking-tight">1,248 Saved</p>
//                                 </div>
//                             </div>
//                         </div>
//                     </nav>

//                     {/* User & Logout Section */}
//                     <div className="p-4 bg-slate-900 mx-4 mb-4 rounded-[2.5rem] shadow-xl">
//                         <div className="flex items-center gap-3 mb-4 px-2">
//                             <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center font-black text-white">
//                                 {userData?.donorprofile?.blood_group || "O+"}
//                             </div>
//                             <div className="min-w-0 flex-1">
//                                 <p className="text-xs font-black text-white truncate uppercase tracking-tighter">{userData?.username || "Guest"}</p>
//                                 <p className="text-[9px] text-red-400 font-bold uppercase tracking-widest">Medical Access</p>
//                             </div>
//                         </div>
//                         <button
//                             onClick={handleLogout}
//                             className="w-full py-3 bg-white/10 hover:bg-red-600 text-white rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all"
//                         >
//                             <LogOut size={14} /> End Session
//                         </button>

//                     </div>
//                 </div>
//             </motion.aside>

//             {/* --- MAIN AREA --- */}
//             <div className="flex-1 flex flex-col min-w-0 p-4 relative z-10">

//                 {/* HEADER */}
//                 <header className="h-20 flex items-center justify-between px-6 lg:px-8 bg-white/40 backdrop-blur-2xl rounded-[2.2rem] border border-white shadow-sm mb-4 relative z-40">
//                     <button
//                         onClick={toggleSidebar}
//                         className="w-11 h-11 flex items-center justify-center bg-white/80 rounded-2xl text-slate-400 hover:text-red-600 shadow-sm border border-white transition-all"
//                     >
//                         {isSidebarOpen && window.innerWidth <= 1024 ? <X size={20} /> : <Menu size={20} />}
//                     </button>

//                     <div className="flex items-center gap-3 lg:gap-4">
//                         <div className="hidden sm:flex items-center gap-2 bg-emerald-50/50 text-emerald-600 px-4 py-2 rounded-xl border border-emerald-100/50">
//                             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
//                             <span className="text-[9px] font-black uppercase tracking-widest">Artery Stable</span>
//                         </div>

//                         <motion.button
//                             whileTap={{ scale: 0.9 }}
//                             onClick={() => setNotifOpen(!isNotifOpen)}
//                             className={`relative w-11 h-11 flex items-center justify-center rounded-2xl transition-all ${isNotifOpen ? "bg-red-600 text-white shadow-lg" : "bg-white/80 text-slate-400 border border-white"
//                                 }`}
//                         >
//                             <Bell size={20} />
//                             {notifications.some((n) => !n.is_read) && (
//                                 <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 border-2 border-white rounded-full flex items-center justify-center text-[10px] text-white font-bold animate-bounce">
//                                     {notifications.filter((n) => !n.is_read).length}
//                                 </span>
//                             )}
//                         </motion.button>

//                         <motion.button
//                             whileHover={{ scale: 1.02 }}
//                             className="h-11 px-4 lg:px-6 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg"
//                         >
//                             <PlusCircle size={14} /> <span className="hidden sm:inline">Urgent Request</span><span className="sm:hidden">Urgent</span>
//                         </motion.button>
//                     </div>
//                 </header>

//                 {/* MAIN VIEWPORT */}
//                 <main className="flex-1 overflow-y-auto bg-white/30 backdrop-blur-md rounded-[3rem] border border-white p-6 lg:p-10 custom-scrollbar relative z-10 shadow-sm">
//                     <AnimatePresence mode="wait">
//                         <motion.div
//                             key={location.pathname}
//                             initial={{ opacity: 0, y: 15 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             exit={{ opacity: 0, y: -15 }}
//                             className="max-w-11xl mx-auto h-full"
//                         >
//                             <Outlet />
//                         </motion.div>
//                     </AnimatePresence>
//                 </main>
//             </div>

//             {/* --- NOTIFICATION PORTAL --- */}
//             <AnimatePresence>
//                 {isNotifOpen && (
//                     <>
//                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setNotifOpen(false)}
//                             className="fixed inset-0 z-[9998] bg-slate-900/5 backdrop-blur-[2px]" />
//                         <motion.div
//                             initial={{ opacity: 0, y: 50, scale: 0.9, filter: "blur(10px)" }}
//                             animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
//                             exit={{ opacity: 0, y: 50, scale: 0.9, filter: "blur(10px)" }}
//                             className="fixed bottom-6 right-6 lg:top-24 lg:bottom-auto lg:right-10 w-[calc(100vw-3rem)] sm:w-96 bg-white/95 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.15)] border border-white z-[9999] overflow-hidden"
//                         >
//                             <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white/50">
//                                 <h3 className="text-sm font-black text-slate-800 uppercase tracking-tighter">Vital Alerts</h3>
//                                 <button onClick={() => setNotifOpen(false)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><X size={18} /></button>
//                             </div>
//                             <div className="max-h-[400px] overflow-y-auto custom-scrollbar divide-y divide-slate-50">
//                                 {notifications.length > 0 ? notifications.map(n => (
//                                     <div key={n.id} className={`p-5 flex gap-4 transition-all ${!n.is_read ? 'bg-red-50/40' : 'hover:bg-slate-50'}`}>
//                                         <div className={`w-11 h-11 rounded-2xl shrink-0 flex items-center justify-center ${!n.is_read ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}>
//                                             <Zap size={16} />
//                                         </div>
//                                         <div className="flex-1 min-w-0">
//                                             <p className={`text-sm truncate ${!n.is_read ? 'font-black text-slate-900' : 'text-slate-500'}`}>{n.title}</p>
//                                             <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{n.message}</p>
//                                         </div>
//                                     </div>
//                                 )) : (
//                                     <div className="p-16 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-40">Artery Clear</div>
//                                 )}
//                             </div>
//                         </motion.div>
//                     </>
//                 )}
//             </AnimatePresence>

//             <style jsx global>{`
//         .custom-scrollbar::-webkit-scrollbar { width: 4px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 20px; }
//       `}</style>
//         </div>
//     );
// };

// export default DashboardLayout;









import React, { useState, useEffect, useRef } from "react";
import { Link, Outlet, ScrollRestoration, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import {
    Heart, Droplets, Users, Bell, Search, User, LogOut, Menu, X,
    PlusCircle, MessageSquare, Home, ClipboardList, Calendar, Map,
    Activity, Award, Zap, Droplet, Trash2, Loader2, Clock, CheckCircle,
    ThumbsUp, UserCheck, HelpCircle, Phone
} from "lucide-react";
import Swal from "sweetalert2";

// --- HELPERS ---
const getCookie = (n) => {
    let a = document.cookie.match(new RegExp("(^| )" + n + "=([^;]*)"));
    return a ? decodeURIComponent(a[2]) : null;
};

// Helper function to normalize help post request ID
const getHelpPostRequestId = (helpPost) => {
    if (!helpPost) return null;
    if (helpPost.blood_request_id) return helpPost.blood_request_id;
    if (helpPost.blood_request?.id) return helpPost.blood_request.id;
    if (helpPost.request_id) return helpPost.request_id;
    return null;
};

// --- REFINED HELP OFFERS MODAL (Integrated into Layout) ---
const HelpOffersModal = ({ isOpen, onClose, request, helpOffers }) => {
    if (!isOpen || !request) return null;

    const filteredHelpOffers = helpOffers.filter(offer =>
        getHelpPostRequestId(offer) === request.id
    );

    return (
        <div className="fixed inset-0 z-[100001] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto overflow-hidden border border-white max-h-[85vh] flex flex-col"
            >
                <div className="bg-amber-500 px-6 py-5 shrink-0">
                    <div className="flex items-center justify-between text-slate-950">
                        <div className="flex items-center gap-3">
                            <HelpCircle className="w-6 h-6" />
                            <div>
                                <h3 className="text-lg font-bold leading-none">Support Manifest</h3>
                                <p className="text-[10px] font-black uppercase tracking-widest mt-1">Request #{request.id}</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="hover:rotate-90 transition-transform"><X size={20} /></button>
                    </div>
                </div>
                <div className="overflow-y-auto flex-1 p-5 bg-[#FDFDFD]">
                    {filteredHelpOffers.length > 0 ? (
                        <div className="space-y-3">
                            {filteredHelpOffers.map((offer, index) => (
                                <div key={index} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
                                    <div className="flex justify-between mb-3">
                                        <h4 className="font-bold text-slate-950">{offer.name || 'Anonymous'}</h4>
                                        <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-[10px] font-bold uppercase">{offer.blood_group || 'N/A'}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                                        <div className="flex items-center gap-2 text-slate-600"><Phone size={14} /> {offer.phone || 'N/A'}</div>
                                        <div className="flex items-center gap-2 text-slate-600"><User size={14} /> ID: {offer.helper || 'N/A'}</div>
                                    </div>
                                    {offer.message && <p className="text-xs text-slate-500 bg-slate-50 p-2 rounded-lg italic">"{offer.message}"</p>}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-slate-400 font-bold uppercase text-xs tracking-widest">No matching offers found</div>
                    )}
                </div>
                <div className="p-4 border-t border-slate-100"><button onClick={onClose} className="w-full py-3 bg-slate-950 text-white rounded-xl text-xs font-bold uppercase tracking-widest">Close Manifest</button></div>
            </motion.div>
        </div>
    );
};

const DashboardLayout = ({ userData }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
    const [isNotifOpen, setNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [helpPosts, setHelpPosts] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showHelpOffersModal, setShowHelpOffersModal] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const bgRef = useRef(null);
    const csrfToken = getCookie("csrftoken");

    // 1. GSAP: AMBIENT MOTION
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(".serum-blob", { x: "random(-150, 150)", y: "random(-150, 150)", scale: "random(1.2, 1.8)", duration: 25, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 3 });
            gsap.to(".logo-pulse", { scale: 1.1, duration: 0.8, repeat: -1, yoyo: true, ease: "power1.inOut" });
        }, bgRef);
        const handleResize = () => { if (window.innerWidth > 1024) setSidebarOpen(true); else setSidebarOpen(false); };
        window.addEventListener("resize", handleResize);
        return () => { ctx.revert(); window.removeEventListener("resize", handleResize); };
    }, []);

    // 2. DATA FETCHING (Notifications + My Requests for Modal)
    const fetchData = async () => {
        try {
            // Notifications
            const nRes = await fetch("http://localhost:8000/api/notifications/", { credentials: 'include', headers: { "X-CSRFToken": csrfToken } });
            if (nRes.ok) setNotifications(await nRes.json());

            // Dashboard Data (to find requests for Help Offers)
            const dRes = await fetch("http://localhost:8000/api/dashboard/", { credentials: 'include' });
            if (dRes.ok) {
                const dData = await dRes.json();
                setMyRequests(dData.my_requests || []);
                setHelpPosts(dData.help_posts || []);
            }
        } catch (e) { console.error("Sync error:", e); }
    };

    useEffect(() => {
        fetchData();
        const int = setInterval(fetchData, 5000);
        return () => clearInterval(int);
    }, [csrfToken]);

    // 3. NOTIFICATION LOGIC (Same as your Dashboard.jsx)
    const handleNotificationClick = async (notification) => {
        try {
            await fetch(`http://localhost:8000/api/notifications/${notification.id}/mark-read/`, {
                method: 'POST', credentials: 'include', headers: { 'X-CSRFToken': csrfToken, 'Content-Type': 'application/json' }
            });
            setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n));
            setNotifOpen(false);

            if (notification.type === 'message') {
                if (notification.room_id) navigate(`/dashboard/chat/${notification.room_id}`);
                else navigate('/dashboard/my-chats');
            }
            else if (notification.type === 'help_offer') {
                const request = myRequests.find(req => req.id === notification.request_id);
                if (request) {
                    setSelectedRequest(request);
                    setShowHelpOffersModal(true);
                } else {
                    navigate('/dashboard'); // Fallback if data not yet loaded
                }
            }
            else if (notification.type === 'donor_approved' || notification.type === 'donor_accepted') {
                navigate('/dashboard/emergencyBlood');
            }
        } catch (e) { console.error(e); }
    };

    const handleDeleteNotification = async (id, e) => {
        e.stopPropagation();
        if (!confirm('Delete this alert?')) return;
        try {
            const res = await fetch(`http://localhost:8000/api/notifications/${id}/delete/`, { method: 'DELETE', credentials: 'include', headers: { 'X-CSRFToken': csrfToken } });
            if (res.ok) setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (e) { console.error(e); }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/notifications/mark-all-read/', { method: 'POST', credentials: 'include', headers: { 'X-CSRFToken': csrfToken } });
            if (res.ok) setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (e) { console.error(e); }
    };

    const handleDeleteAllNotifications = async () => {
        if (!confirm('Clear all notification history?')) return;
        try {
            const res = await fetch('http://localhost:8000/api/notifications/delete-all/', { method: 'DELETE', credentials: 'include', headers: { 'X-CSRFToken': csrfToken } });
            if (res.ok) { setNotifications([]); setNotifOpen(false); }
        } catch (e) { console.error(e); }
    };

    const handleLogout = async () => {
        try {
            // 1. Perform the backend logout
            await fetch("http://localhost:8000/api/logout/", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken
                }
            });

            // 2. Trigger the Tactical Artery Alert
            await Swal.fire({
                title: '<span style="font-family: Poppins; font-weight: 900; color: #0f172a; text-transform: uppercase; letter-spacing: -0.01em;">Session Terminated</span>',
                html: '<div style="font-family: Poppins; font-weight: 600; color: #64748b; font-size: 14px; margin-top: 8px;">Artery synchronization closed. You have been logged out safely.</div>',
                icon: 'success',
                iconColor: '#dc2626', // Artery Red
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: false,
                background: '#ffffff',
                width: '420px',
                padding: '2.5rem',
                confirmButtonColor: '#dc2626',
            });
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            // 3. Redirect to login
            navigate("/login", { replace: true });
        }
    };
    const navLinks = [
        { name: "Dashboard", path: "/dashboard", icon: Home },
        { name: "Find Blood", path: "/dashboard/emergencyBlood", icon: ClipboardList },
        { name: "Chat Hub", path: "/dashboard/my-chats", icon: MessageSquare },
        { name: "Live Map", path: "/dashboard/live-map", icon: Map },
        { name: "About Us", path: "/dashboard/about-us", icon: Users },
    ];

    const unreadCount = notifications.filter(n => !n.is_read).length;

    return (
        <div className="flex h-screen bg-[#F8FAFC] text-slate-900 overflow-hidden select-none relative font-sans">
            {/* BG */}
            <div ref={bgRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-50">
                <div className="serum-blob absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-red-100 rounded-full blur-[140px]" />
                <div className="serum-blob absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-100 rounded-full blur-[120px]" />
            </div>

            {/* SIDEBAR */}
            <motion.aside
                initial={false}
                animate={{ x: isSidebarOpen ? 0 : -340, width: window.innerWidth > 1024 ? (isSidebarOpen ? 320 : 0) : 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed lg:relative z-[100] h-full p-4 shrink-0"
            >
                <div className="h-full w-[280px] lg:w-full bg-white/70 backdrop-blur-3xl rounded-[3rem] shadow-xl border border-white/50 flex flex-col overflow-hidden">
                    <Link to="/"><div className="p-10 flex items-center gap-4">
                        <div className="logo-pulse w-11 h-11 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg"><Heart className="text-white fill-current" size={22} /></div>
                        <div className="flex-1"><h1 className="text-xl font-black tracking-tighter leading-none">Red Drop</h1><p className="text-[10px] font-bold text-red-600 tracking-widest mt-1 uppercase">Life Artery</p></div>
                    </div></Link>

                    <nav className="flex-1 px-4 flex flex-col overflow-y-auto custom-scrollbar">
                        <div className="space-y-1 mb-6">
                            {navLinks.map((item) => (
                                <Link key={item.name} to={item.path} onClick={() => window.innerWidth <= 1024 && setSidebarOpen(false)}>
                                    <motion.div whileHover={{ x: 10 }} className={`relative flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${location.pathname === item.path ? "text-red-600" : "text-slate-400 hover:text-slate-700"}`}>
                                        {location.pathname === item.path && <motion.div layoutId="liquidNav" className="absolute inset-0 bg-red-50/60 rounded-2xl border border-red-100/50 z-0" />}
                                        <item.icon size={18} className="relative z-10" />
                                        <span className="relative z-10 font-bold text-sm">{item.name}</span>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                        <div className="mt-auto px-4 pb-8 space-y-4">
                            <div className="p-5 bg-white/40 rounded-3xl border border-white/50 shadow-sm">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Droplet size={12} className="text-red-600" /> Stock Pulse</p>
                                <div className="space-y-4">
                                    {["O+", "A-"].map((type, i) => (
                                        <div key={type}>
                                            <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1 uppercase"><span>Type {type}</span><span className={i === 1 ? "text-red-600" : "text-emerald-600"}>{i === 1 ? "Low" : "Stable"}</span></div>
                                            <div className="h-1.5 bg-slate-200/50 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: i === 1 ? "15%" : "80%" }} className={`h-full ${i === 1 ? "bg-red-600" : "bg-emerald-500"}`} /></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </nav>

                    <div className="p-4 bg-slate-900 mx-4 mb-4 rounded-[2.5rem] shadow-xl">
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center font-black text-white">{userData?.donorprofile?.blood_group || "O+"}</div>
                            <div className="min-w-0 flex-1"><p className="text-xs font-black text-white truncate uppercase">{userData?.username || "Guest"}</p><p className="text-[9px] text-red-400 font-bold uppercase">Clinical Access</p></div>
                        </div>
                        <button onClick={handleLogout} className="w-full py-3 bg-white/10 hover:bg-red-600 text-white rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/5"><LogOut size={14} /> End Session</button>
                    </div>
                </div>
            </motion.aside>

            {/* MAIN AREA */}
            <div className="flex-1 flex flex-col min-w-0 p-4 relative z-10">
                <header className="h-20 flex items-center justify-between px-6 lg:px-8 bg-white/40 backdrop-blur-2xl rounded-[2.2rem] border border-white shadow-sm mb-4 relative z-40">
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="w-11 h-11 flex items-center justify-center bg-white/80 rounded-2xl text-slate-400 hover:text-red-600 shadow-sm transition-all border border-white">
                        {isSidebarOpen && window.innerWidth <= 1024 ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <div className="flex items-center gap-3 lg:gap-4">
                        <div className="hidden sm:flex items-center gap-2 bg-emerald-50/50 text-emerald-600 px-4 py-2 rounded-xl border border-emerald-100/50">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /><span className="text-[9px] font-black uppercase tracking-widest">Artery Stable</span>
                        </div>

                        <motion.button whileTap={{ scale: 0.9 }} onClick={() => setNotifOpen(!isNotifOpen)}
                            className={`relative w-11 h-11 flex items-center justify-center rounded-2xl transition-all ${isNotifOpen ? "bg-red-600 text-white shadow-lg shadow-red-200" : "bg-white/80 text-slate-400 border border-white"}`}>
                            <Bell size={20} />
                            {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 border-2 border-white rounded-full flex items-center justify-center text-[10px] text-white font-bold animate-bounce">{unreadCount}</span>}
                        </motion.button>

                        <motion.button onClick={() => navigate('/dashboard/emergencyBlood')} className="h-11 px-4 lg:px-6 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg"><PlusCircle size={14} /> Urgent Request</motion.button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto bg-white/30 backdrop-blur-md rounded-[3rem] border border-white p-6 lg:p-10 custom-scrollbar relative z-10 shadow-sm">
                    <ScrollRestoration></ScrollRestoration>
                    <AnimatePresence mode="wait"><motion.div key={location.pathname} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="max-w-11xl mx-auto h-full"><Outlet /></motion.div></AnimatePresence>
                </main>
            </div>

            {/* NOTIFICATION PORTAL */}
            <AnimatePresence>
                {isNotifOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setNotifOpen(false)} className="fixed inset-0 z-[9998] bg-slate-900/5 backdrop-blur-[2px]" />
                        <motion.div initial={{ opacity: 0, y: 50, scale: 0.9, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }} exit={{ opacity: 0, y: 50, scale: 0.9, filter: "blur(10px)" }}
                            className="fixed bottom-6 right-6 lg:top-24 lg:bottom-auto lg:right-10 w-[calc(100vw-3rem)] sm:w-96 bg-white/95 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.15)] border border-white z-[9999] overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white/50">
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-tighter">Vital Alerts</h3>
                                <div className="flex items-center gap-3">
                                    {unreadCount > 0 && <button onClick={handleMarkAllAsRead} className="text-[10px] font-bold text-red-600 uppercase hover:underline">Mark read</button>}
                                    <button onClick={() => setNotifOpen(false)} className="p-2 text-slate-400 hover:text-red-600"><X size={18} /></button>
                                </div>
                            </div>
                            <div className="max-h-[400px] overflow-y-auto custom-scrollbar divide-y divide-slate-50">
                                {notifications.length > 0 ? notifications.map(n => (
                                    <div key={n.id} onClick={() => handleNotificationClick(n)} className={`p-5 flex gap-4 transition-all group relative cursor-pointer ${!n.is_read ? 'bg-red-50/40' : 'hover:bg-slate-50'}`}>
                                        <div className={`w-11 h-11 rounded-2xl shrink-0 flex items-center justify-center ${!n.is_read ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'bg-slate-100 text-slate-400'}`}>
                                            {n.type === 'message' ? <MessageSquare size={16} /> : n.type === 'help_offer' ? <HelpCircle size={16} /> : <Droplets size={16} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <p className={`text-sm truncate font-bold ${!n.is_read ? 'text-black' : 'text-slate-600'}`}>{n.title}</p>
                                                <button onClick={(e) => handleDeleteNotification(n.id, e)} className="p-1 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-600 transition-all"><Trash2 size={14} /></button>
                                            </div>
                                            <p className="text-xs text-slate-500 line-clamp-2 mt-1">{n.message}</p>
                                            <div className="flex justify-between items-center mt-2">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase"><Clock size={10} className="inline mr-1" />{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                <span className="text-[9px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-bold uppercase">{n.request_id ? `Req #${n.request_id}` : 'Artery'}</span>
                                            </div>
                                        </div>
                                    </div>
                                )) : <div className="p-16 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-40">Artery Clear</div>}
                            </div>
                            {notifications.length > 0 && (
                                <div className="p-3 bg-slate-50/50 border-t border-slate-50 flex justify-between px-6">
                                    <button onClick={() => { navigate('/dashboard/my-chats'); setNotifOpen(false) }} className="text-[10px] font-black text-slate-500 uppercase hover:text-red-600">All Chats</button>
                                    <button onClick={handleDeleteAllNotifications} className="text-[10px] font-black text-red-600 uppercase hover:text-red-800">Clear Logs</button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* INTEGRATED HELP OFFERS MODAL */}
            <HelpOffersModal
                isOpen={showHelpOffersModal}
                onClose={() => { setShowHelpOffersModal(false); setSelectedRequest(null); }}
                request={selectedRequest}
                helpOffers={helpPosts}
            />

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 20px; }
            `}</style>
        </div>
    );
};

export default DashboardLayout;
