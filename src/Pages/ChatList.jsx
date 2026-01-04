

// // ChatList.jsx - Refined Version
// import React, { useState, useEffect } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//     MessageSquare, 
//     Users, 
//     X, 
//     Clock, 
//     ChevronRight, 
//     Heart, 
//     ArrowLeft,
//     Loader2,
//     Search,
//     Filter,
//     CheckCircle,
//     Star,
//     Sparkles,
//     Shield,
//     Calendar
// } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

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

// const ChatList = () => {
//     const [chatRooms, setChatRooms] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filteredRooms, setFilteredRooms] = useState([]);
//     const [userData, setUserData] = useState(null);
//     const [activeFilter, setActiveFilter] = useState('all');
//     const [showFilters, setShowFilters] = useState(false);
//     const navigate = useNavigate();
//     const csrfToken = getCookie('csrftoken');

//     // Mock data for demonstration
//     const mockChatRooms = [
//         {
//             room_id: 1,
//             with: "Sarah Johnson",
//             request_id: 12345,
//             last_message_time: "2024-01-15T14:30:00Z",
//             unread_count: 3,
//             is_online: true,
//             user_type: "donor",
//             status: "active",
//             last_message: "Thank you so much for your help!",
//             request_title: "Medical Supplies for Children's Hospital"
//         },
//         {
//             room_id: 2,
//             with: "Michael Chen",
//             request_id: 12346,
//             last_message_time: "2024-01-14T10:15:00Z",
//             unread_count: 0,
//             is_online: false,
//             user_type: "requester",
//             status: "pending",
//             last_message: "Can we schedule the pickup for tomorrow?",
//             request_title: "Food Donations for Homeless Shelter"
//         },
//         {
//             room_id: 3,
//             with: "Emma Wilson",
//             request_id: 12347,
//             last_message_time: "2024-01-13T16:45:00Z",
//             unread_count: 1,
//             is_online: true,
//             user_type: "donor",
//             status: "completed",
//             last_message: "The items have been delivered successfully",
//             request_title: "Winter Clothes for Refugees"
//         },
//         {
//             room_id: 4,
//             with: "David Rodriguez",
//             request_id: 12348,
//             last_message_time: "2024-01-12T09:20:00Z",
//             unread_count: 0,
//             is_online: true,
//             user_type: "requester",
//             status: "active",
//             last_message: "Looking forward to your donation!",
//             request_title: "Educational Materials for School"
//         },
//         {
//             room_id: 5,
//             with: "Lisa Anderson",
//             request_id: 12349,
//             last_message_time: "2024-01-11T11:10:00Z",
//             unread_count: 5,
//             is_online: false,
//             user_type: "donor",
//             status: "active",
//             last_message: "I have some additional items to donate",
//             request_title: "Toys for Orphanage Christmas Drive"
//         }
//     ];

//     useEffect(() => {
//         fetchUserData();
//         fetchChatRooms();
//     }, []);

//     useEffect(() => {
//         let filtered = chatRooms;
        
//         if (searchTerm) {
//             filtered = filtered.filter(room =>
//                 room.with.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 room.request_id.toString().includes(searchTerm) ||
//                 room.request_title?.toLowerCase().includes(searchTerm.toLowerCase())
//             );
//         }

//         if (activeFilter !== 'all') {
//             filtered = filtered.filter(room => room.status === activeFilter);
//         }

//         // Sort by last message time (most recent first)
//         filtered.sort((a, b) => new Date(b.last_message_time) - new Date(a.last_message_time));
        
//         setFilteredRooms(filtered);
//     }, [searchTerm, chatRooms, activeFilter]);

//     const fetchUserData = async () => {
//         try {
//             const response = await fetch("http://localhost:8000/api/current-user/", {
//                 method: "GET",
//                 credentials: "include",
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 setUserData(data);
//             } else {
//                 // Use mock data if API fails
//                 setUserData({ username: "Alex Morgan", role: "Donor", avatar_color: "#8B5CF6" });
//             }
//         } catch (error) {
//             console.error('Error fetching user data:', error);
//             setUserData({ username: "Alex Morgan", role: "Donor", avatar_color: "#8B5CF6" });
//         }
//     };

//     const fetchChatRooms = async () => {
//         try {
//             setLoading(true);
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
//                 setFilteredRooms(data);
//             } else {
//                 // Use mock data if API fails
//                 console.log('Using mock chat data');
//                 setChatRooms(mockChatRooms);
//                 setFilteredRooms(mockChatRooms);
//             }
//         } catch (error) {
//             console.error('Error fetching chat rooms:', error);
//             // Use mock data on error
//             setChatRooms(mockChatRooms);
//             setFilteredRooms(mockChatRooms);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const formatTime = (timestamp) => {
//         if (!timestamp) return '';
//         const date = new Date(timestamp);
//         const now = new Date();
//         const diffMs = now - date;
//         const diffMins = Math.floor(diffMs / 60000);
//         const diffHours = Math.floor(diffMins / 60);
//         const diffDays = Math.floor(diffHours / 24);

//         if (diffMins < 60) {
//             return `${diffMins}m ago`;
//         } else if (diffHours < 24) {
//             return `${diffHours}h ago`;
//         } else if (diffDays < 7) {
//             return `${diffDays}d ago`;
//         } else {
//             return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
//         }
//     };

//     const getStatusColor = (status) => {
//         switch (status) {
//             case 'active': return 'bg-green-100 text-green-800 border-green-200';
//             case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//             case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
//             default: return 'bg-gray-100 text-gray-800 border-gray-200';
//         }
//     };

//     const getUserTypeColor = (type) => {
//         return type === 'donor' 
//             ? 'bg-purple-100 text-purple-800 border-purple-200'
//             : 'bg-pink-100 text-pink-800 border-pink-200';
//     };

//     const handleChatSelect = (room) => {
//         navigate(`/chat/${room.room_id}`);
//     };

//     const getAvatarColor = (name) => {
//         const colors = [
//             'from-purple-500 to-pink-500',
//             'from-blue-500 to-cyan-500',
//             'from-green-500 to-emerald-500',
//             'from-orange-500 to-red-500',
//             'from-indigo-500 to-purple-500',
//         ];
//         const index = name.length % colors.length;
//         return colors[index];
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center">
//                 <div className="text-center space-y-4">
//                     <div className="relative">
//                         <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl animate-pulse mx-auto"></div>
//                         <Loader2 className="absolute inset-0 m-auto w-12 h-12 text-white animate-spin" />
//                     </div>
//                     <div className="space-y-2">
//                         <p className="text-gray-600 font-medium">Loading your conversations</p>
//                         <div className="w-48 h-1 bg-gradient-to-r from-transparent via-purple-300 to-transparent mx-auto"></div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
//             {/* Floating Background Elements */}
//             <div className="fixed inset-0 overflow-hidden pointer-events-none">
//                 <div className="absolute top-1/4 left-10 w-72 h-72 bg-purple-300/10 rounded-full blur-3xl"></div>
//                 <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl"></div>
//                 <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-pink-300/10 rounded-full blur-3xl"></div>
//             </div>

//             {/* Header */}
//             <header className="relative bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100/50 sticky top-0 z-50">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-4">
//                             <motion.button
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.95 }}
//                                 onClick={() => navigate('/dashboard')}
//                                 className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100/80 rounded-xl transition-all duration-200 backdrop-blur-sm"
//                             >
//                                 <ArrowLeft className="w-5 h-5" />
//                             </motion.button>
                            
//                             <div className="flex items-center space-x-3">
//                                 <div className="relative">
//                                     <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
//                                         <MessageSquare className="w-6 h-6 text-white" />
//                                     </div>
//                                     <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
//                                 </div>
//                                 <div>
//                                     <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
//                                         Messages
//                                     </h1>
//                                     <p className="text-sm text-gray-600 flex items-center">
//                                         <Sparkles className="w-3 h-3 mr-1 text-purple-500" />
//                                         Welcome back, <span className="font-semibold text-gray-900 ml-1">{userData?.username || 'User'}</span>
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="flex items-center space-x-3">
//                             <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50/50 rounded-xl border border-purple-100/50">
//                                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                                 <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
//                                     {chatRooms.length} active conversations
//                                 </span>
//                             </div>
                            
//                             <motion.button
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.95 }}
//                                 onClick={() => setShowFilters(!showFilters)}
//                                 className="p-2.5 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50/30 transition-all duration-200"
//                             >
//                                 <Filter className="w-5 h-5 text-gray-600" />
//                             </motion.button>
//                         </div>
//                     </div>
//                 </div>
//             </header>

//             {/* Main Content */}
//             <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//                 {/* Compact Hero Stats Section */}
//                 <motion.div 
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="bg-gradient-to-br from-white to-purple-50/30 rounded-2xl shadow-lg border border-gray-100/50 overflow-hidden mb-6 backdrop-blur-sm"
//                 >
//                     <div className="p-5">
//                         <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
//                             <div className="mb-4 md:mb-0 md:mr-6">
//                                 <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-1">
//                                     Your Conversations
//                                 </h2>
//                                 <p className="text-sm text-gray-600">
//                                     Connect and coordinate with donors & recipients
//                                 </p>
//                             </div>
                            
//                             <div className="grid grid-cols-4 gap-3">
//                                 <div className="text-center p-3 bg-white/60 rounded-xl border border-gray-100/50 backdrop-blur-sm min-w-[70px]">
//                                     <div className="text-lg font-bold text-gray-900">{chatRooms.length}</div>
//                                     <div className="text-xs text-gray-500">Total</div>
//                                 </div>
//                                 <div className="text-center p-3 bg-white/60 rounded-xl border border-gray-100/50 backdrop-blur-sm min-w-[70px]">
//                                     <div className="text-lg font-bold text-gray-900">
//                                         {chatRooms.filter(r => r.unread_count > 0).length}
//                                     </div>
//                                     <div className="text-xs text-gray-500">Unread</div>
//                                 </div>
//                                 <div className="text-center p-3 bg-white/60 rounded-xl border border-gray-100/50 backdrop-blur-sm min-w-[70px]">
//                                     <div className="text-lg font-bold text-gray-900">
//                                         {chatRooms.filter(r => r.is_online).length}
//                                     </div>
//                                     <div className="text-xs text-gray-500">Online</div>
//                                 </div>
//                                 <div className="text-center p-3 bg-white/60 rounded-xl border border-gray-100/50 backdrop-blur-sm min-w-[70px]">
//                                     <div className="text-lg font-bold text-gray-900">
//                                         {chatRooms.filter(r => r.status === 'completed').length}
//                                     </div>
//                                     <div className="text-xs text-gray-500">Completed</div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
                    
//                     <div className="h-0.5 bg-gradient-to-r from-purple-500/30 via-indigo-500/30 to-blue-500/30"></div>
//                 </motion.div>

//                 {/* Search and Filter Section */}
//                 <div className="mb-6 space-y-4">
//                     <div className="relative group">
//                         <input
//                             type="text"
//                             placeholder="Search conversations, request IDs, or names..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="w-full pl-14 pr-4 py-3.5 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all duration-300 shadow-sm group-hover:shadow-md"
//                         />
//                         <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
//                         <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
//                             {searchTerm && (
//                                 <motion.button
//                                     initial={{ opacity: 0, scale: 0 }}
//                                     animate={{ opacity: 1, scale: 1 }}
//                                     onClick={() => setSearchTerm('')}
//                                     className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
//                                 >
//                                     <X className="w-4 h-4" />
//                                 </motion.button>
//                             )}
//                         </div>
//                     </div>

//                     <AnimatePresence>
//                         {showFilters && (
//                             <motion.div
//                                 initial={{ opacity: 0, height: 0 }}
//                                 animate={{ opacity: 1, height: 'auto' }}
//                                 exit={{ opacity: 0, height: 0 }}
//                                 className="overflow-hidden"
//                             >
//                                 <div className="flex flex-wrap gap-2 p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100/50">
//                                     {['all', 'active', 'pending', 'completed'].map((filter) => (
//                                         <button
//                                             key={filter}
//                                             onClick={() => setActiveFilter(filter)}
//                                             className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${
//                                                 activeFilter === filter
//                                                     ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md shadow-purple-500/25'
//                                                     : 'bg-white/80 text-gray-600 hover:bg-gray-50/80 hover:text-gray-900 border border-gray-200/50'
//                                             }`}
//                                         >
//                                             {filter}
//                                         </button>
//                                     ))}
//                                 </div>
//                             </motion.div>
//                         )}
//                     </AnimatePresence>
//                 </div>

//                 {/* Chat List */}
//                 <div className="space-y-4">
//                     <div className="flex items-center justify-between mb-2">
//                         <h3 className="text-base font-semibold text-gray-900">
//                             Recent Conversations
//                             <span className="text-gray-400 font-normal ml-2">({filteredRooms.length})</span>
//                         </h3>
//                         <div className="text-xs text-gray-500">
//                             Most recent first
//                         </div>
//                     </div>

//                     <AnimatePresence mode="wait">
//                         {filteredRooms.length > 0 ? (
//                             <motion.div
//                                 layout
//                                 className="space-y-3"
//                             >
//                                 {filteredRooms.map((room, index) => (
//                                     <motion.div
//                                         key={room.room_id}
//                                         layout
//                                         initial={{ opacity: 0, y: 10 }}
//                                         animate={{ opacity: 1, y: 0 }}
//                                         transition={{ delay: index * 0.05, duration: 0.3 }}
//                                         exit={{ opacity: 0, y: -10 }}
//                                         whileHover={{ scale: 1.005, y: -1 }}
//                                         onClick={() => handleChatSelect(room)}
//                                         className="group cursor-pointer"
//                                     >
//                                         <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 p-4 transition-all duration-200 hover:shadow-lg hover:border-purple-200/50 hover:bg-gradient-to-r hover:from-white hover:via-purple-50/20 hover:to-white">
//                                             <div className="flex items-start justify-between">
//                                                 <div className="flex items-start space-x-3 flex-1 min-w-0">
//                                                     <div className="relative flex-shrink-0">
//                                                         <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${getAvatarColor(room.with)}`}>
//                                                             <Users className="w-5 h-5 text-white" />
//                                                         </div>
//                                                         <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${room.is_online ? 'bg-green-500' : 'bg-gray-400'}`}></div>
//                                                     </div>
                                                    
//                                                     <div className="flex-1 min-w-0">
//                                                         <div className="flex items-center justify-between mb-1.5">
//                                                             <div className="flex items-center space-x-2">
//                                                                 <h4 className="font-semibold text-gray-900 text-base truncate group-hover:text-purple-700 transition-colors">
//                                                                     {room.with}
//                                                                 </h4>
//                                                                 {room.status === 'completed' && (
//                                                                     <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
//                                                                 )}
//                                                             </div>
//                                                             <div className="flex items-center space-x-2">
//                                                                 <span className="text-xs text-gray-500 font-medium whitespace-nowrap">
//                                                                     {formatTime(room.last_message_time)}
//                                                                 </span>
//                                                                 <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors flex-shrink-0" />
//                                                             </div>
//                                                         </div>
                                                        
//                                                         <div className="flex flex-wrap items-center gap-1.5 mb-2">
//                                                             <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(room.status)}`}>
//                                                                 {room.status}
//                                                             </span>
//                                                             <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getUserTypeColor(room.user_type)}`}>
//                                                                 {room.user_type}
//                                                             </span>
//                                                             <span className="px-2 py-0.5 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
//                                                                 #{room.request_id}
//                                                             </span>
//                                                         </div>
                                                        
//                                                         <p className="text-sm text-gray-600 line-clamp-1 mb-1">
//                                                             {room.request_title || "No request title available"}
//                                                         </p>
                                                        
//                                                         <div className="flex items-center justify-between">
//                                                             <p className="text-xs text-gray-500 truncate">
//                                                                 {room.last_message || "Start a conversation..."}
//                                                             </p>
//                                                             {room.unread_count > 0 && (
//                                                                 <span className="flex-shrink-0 w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
//                                                                     {room.unread_count}
//                                                                 </span>
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </motion.div>
//                                 ))}
//                             </motion.div>
//                         ) : (
//                             <motion.div
//                                 initial={{ opacity: 0 }}
//                                 animate={{ opacity: 1 }}
//                                 exit={{ opacity: 0 }}
//                                 className="text-center py-12"
//                             >
//                                 <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
//                                     <div className="relative">
//                                         <MessageSquare className="w-12 h-12 text-purple-300" />
//                                         <Search className="absolute -bottom-1 -right-1 w-6 h-6 text-purple-400" />
//                                     </div>
//                                 </div>
//                                 <h4 className="text-xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-2">
//                                     {searchTerm ? 'No conversations found' : 'No conversations yet'}
//                                 </h4>
//                                 <p className="text-gray-600 text-sm max-w-md mx-auto mb-6">
//                                     {searchTerm
//                                         ? "Try different keywords or clear your filters to find conversations."
//                                         : "Your chat rooms will appear here once you connect with donors or recipients."}
//                                 </p>
//                                 <div className="flex flex-col sm:flex-row gap-3 justify-center">
//                                     {searchTerm ? (
//                                         <motion.button
//                                             whileHover={{ scale: 1.05 }}
//                                             whileTap={{ scale: 0.95 }}
//                                             onClick={() => setSearchTerm('')}
//                                             className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:shadow-md transition-all duration-300 font-medium text-sm shadow-sm shadow-purple-500/25"
//                                         >
//                                             Clear Search
//                                         </motion.button>
//                                     ) : (
//                                         <motion.button
//                                             whileHover={{ scale: 1.05 }}
//                                             whileTap={{ scale: 0.95 }}
//                                             onClick={() => navigate('/dashboard')}
//                                             className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:shadow-md transition-all duration-300 font-medium text-sm shadow-sm shadow-purple-500/25"
//                                         >
//                                             Browse Requests
//                                         </motion.button>
//                                     )}
//                                 </div>
//                             </motion.div>
//                         )}
//                     </AnimatePresence>
//                 </div>

//                 {/* Features & Tips Section */}
//                 <div className="mt-8 grid md:grid-cols-2 gap-4">
//                     <div className="bg-gradient-to-br from-blue-50/50 to-cyan-50/30 rounded-xl p-4 border border-blue-100/50 backdrop-blur-sm">
//                         <div className="flex items-start">
//                             <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3 shadow-sm shadow-blue-500/25">
//                                 <Shield className="w-5 h-5 text-white" />
//                             </div>
//                             <div>
//                                 <h4 className="font-semibold text-gray-900 text-sm mb-1">Secure Messaging</h4>
//                                 <p className="text-xs text-gray-600">
//                                     All conversations are encrypted and private. Your information is protected.
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
                    
//                     <div className="bg-gradient-to-br from-purple-50/50 to-pink-50/30 rounded-xl p-4 border border-purple-100/50 backdrop-blur-sm">
//                         <div className="flex items-start">
//                             <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3 shadow-sm shadow-purple-500/25">
//                                 <Calendar className="w-5 h-5 text-white" />
//                             </div>
//                             <div>
//                                 <h4 className="font-semibold text-gray-900 text-sm mb-1">Communication Tips</h4>
//                                 <ul className="text-xs text-gray-600">
//                                     <li>• Be clear about details</li>
//                                     <li>• Confirm arrangements in advance</li>
//                                     <li>• Share delivery updates</li>
//                                 </ul>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </main>

//             {/* Floating Action Button */}
//             <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//                 onClick={() => navigate('/dashboard')}
//                 className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 z-40"
//             >
//                 <MessageSquare className="w-5 h-5 text-white" />
//             </motion.button>
//         </div>
//     );
// };

// export default ChatList;




import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from "gsap";
import { 
    MessageSquare, Users, X, Clock, ChevronRight, Heart, ArrowLeft,
    Loader2, Search, Filter, CheckCircle, Star, Sparkles, Shield,
    Calendar, Zap, Activity, Target, Droplets, Bell, PlusCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- HELPERS (UNCHANGED) ---
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

const ChatList = () => {
    const [chatRooms, setChatRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [userData, setUserData] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const navigate = useNavigate();
    const csrfToken = getCookie('csrftoken');
    const bgRef = useRef(null);

    // Mock data (UNCHANGED)
    const mockChatRooms = [
        { room_id: 1, with: "Sarah Johnson", request_id: 12345, last_message_time: "2024-01-15T14:30:00Z", unread_count: 3, is_online: true, user_type: "donor", status: "active", last_message: "Thank you so much for your help!", request_title: "Emergency O+ needed for surgery" },
        { room_id: 2, with: "Michael Chen", request_id: 12346, last_message_time: "2024-01-14T10:15:00Z", unread_count: 0, is_online: false, user_type: "requester", status: "pending", last_message: "Can we schedule the pickup for tomorrow?", request_title: "Platelets Request for Oncology" },
        { room_id: 3, with: "Emma Wilson", request_id: 12347, last_message_time: "2024-01-13T16:45:00Z", unread_count: 1, is_online: true, user_type: "donor", status: "completed", last_message: "The items have been delivered successfully", request_title: "B+ Blood Units for General Hospital" }
    ];

    // GSAP: BACKGROUND SERUM MOTION
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(".serum-blob", {
                x: "random(-100, 100)", y: "random(-100, 100)",
                scale: "random(1.2, 1.5)", duration: 20,
                repeat: -1, yoyo: true, ease: "sine.inOut"
            });
        }, bgRef);
        return () => ctx.revert();
    }, []);

    useEffect(() => {
        fetchUserData();
        fetchChatRooms();
    }, []);

    useEffect(() => {
        let filtered = chatRooms;
        if (searchTerm) {
            filtered = filtered.filter(room =>
                room.with.toLowerCase().includes(searchTerm.toLowerCase()) ||
                room.request_id.toString().includes(searchTerm) ||
                room.request_title?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (activeFilter !== 'all') {
            filtered = filtered.filter(room => room.status === activeFilter);
        }
        filtered.sort((a, b) => new Date(b.last_message_time) - new Date(a.last_message_time));
        setFilteredRooms(filtered);
    }, [searchTerm, chatRooms, activeFilter]);

    // FETCH LOGIC (UNCHANGED)
    const fetchUserData = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/current-user/", { method: "GET", credentials: "include" });
            if (response.ok) setUserData(await response.json());
            else setUserData({ username: "Alex Morgan" });
        } catch (error) { setUserData({ username: "Alex Morgan" }); }
    };

    const fetchChatRooms = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:8000/api/my-chats/", {
                method: "GET", credentials: "include", headers: { 'X-CSRFToken': csrfToken }
            });
            if (response.ok) {
                const data = await response.json();
                setChatRooms(data);
                setFilteredRooms(data);
            } else {
                setChatRooms(mockChatRooms);
                setFilteredRooms(mockChatRooms);
            }
        } catch (error) {
            setChatRooms(mockChatRooms);
            setFilteredRooms(mockChatRooms);
        } finally { setLoading(false); }
    };

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diffHrs = Math.floor((now - date) / 3600000);
        if (diffHrs < 24) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'active': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'completed': return 'bg-blue-50 text-blue-700 border-blue-200';
            default: return 'bg-slate-50 text-slate-600 border-slate-200';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                    <Droplets className="text-red-600 w-16 h-16" />
                </motion.div>
                <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-slate-400 mt-6">Artery Syncing...</h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-black selection:bg-red-100 relative overflow-hidden pb-20">
            
            {/* GSAP AMBIENT BACKGROUND */}
            <div ref={bgRef} className="fixed inset-0 pointer-events-none z-0 opacity-40">
                <div className="serum-blob absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-red-100 rounded-full blur-[120px]" />
                <div className="serum-blob absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-100 rounded-full blur-[100px]" />
            </div>

            {/* STICKY HEADER */}
            <header className="sticky top-0 z-[100] px-4 pt-6 lg:px-8">
                <div className="max-w-7xl mx-auto bg-white/70 backdrop-blur-2xl border border-white shadow-sm rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/dashboard')} className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-600 transition-all">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-black leading-none">Messages</h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Channel Active
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl">
                            <Users size={14} className="text-slate-400" />
                            <span className="text-xs font-bold text-slate-600">{chatRooms.length} Connections</span>
                        </div>
                        <button onClick={() => setShowFilters(!showFilters)} className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${showFilters ? 'bg-red-600 border-red-600 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>
                            <Filter size={18} />
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 lg:px-8 mt-6 relative z-10">
                
                {/* INBOX ANALYTICS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: 'Unread Pulse', val: chatRooms.filter(r => r.unread_count > 0).length, icon: Bell, color: 'text-red-600', bg: 'bg-red-50' },
                        { label: 'Online Now', val: chatRooms.filter(r => r.is_online).length, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                        { label: 'Closed Cases', val: chatRooms.filter(r => r.status === 'completed').length, icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Total Logs', val: chatRooms.length, icon: MessageSquare, color: 'text-slate-900', bg: 'bg-slate-100' }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white/60 backdrop-blur-md border border-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{stat.label}</p>
                                <p className="text-xl font-bold text-black mt-0.5">{stat.val.toString().padStart(2, '0')}</p>
                            </div>
                            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                                <stat.icon size={18} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* SEARCH CAPSULE */}
                <div className="mb-6 relative group">
                    <input 
                        type="text" 
                        placeholder="Search donors, request IDs, or keywords..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-6 py-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/10 focus:border-red-500/20 transition-all font-medium text-sm text-black" 
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-red-500 transition-colors" size={20} />
                </div>

                <AnimatePresence>
                    {showFilters && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-wrap gap-2 mb-6 bg-white/40 p-2 rounded-2xl border border-white">
                            {['all', 'active', 'pending', 'completed'].map((f) => (
                                <button 
                                    key={f} 
                                    onClick={() => setActiveFilter(f)} 
                                    className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeFilter === f ? 'bg-black text-white shadow-lg' : 'bg-white text-slate-400 hover:text-red-600 hover:border-red-100 border border-slate-100'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* CONTENT CONTAINER */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <Zap size={14} className="text-red-600 fill-current" /> Communication Channel
                        </h3>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{filteredRooms.length} Active Channels</span>
                    </div>

                    <div className="divide-y divide-slate-100">
                        <AnimatePresence mode="popLayout">
                            {filteredRooms.length > 0 ? (
                                filteredRooms.map((room, idx) => (
                                    <motion.div 
                                        key={room.room_id} 
                                        layout 
                                        initial={{ opacity: 0 }} 
                                        animate={{ opacity: 1 }} 
                                        exit={{ opacity: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                        onClick={() => navigate(`/dashboard/chat/${room.room_id}`)}
                                        className="group cursor-pointer hover:bg-slate-50 transition-all p-5 flex items-center gap-4 relative overflow-hidden"
                                    >
                                        {/* UNREAD INDICATOR BAR */}
                                        {room.unread_count > 0 && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600" />
                                        )}

                                        {/* PROFILE AVATAR */}
                                        <div className="relative shrink-0">
                                            <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-md group-hover:bg-red-600 transition-colors">
                                                <Users size={24} />
                                            </div>
                                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-white ${room.is_online ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                        </div>

                                        {/* MESSAGE DETAILS */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="text-[15px] font-bold text-black group-hover:text-red-600 transition-colors truncate">
                                                    {room.with}
                                                </h4>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase">{formatTime(room.last_message_time)}</span>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${getStatusStyles(room.status)}`}>
                                                    {room.status}
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-300">REQ-{room.request_id}</span>
                                            </div>

                                            <p className="text-xs font-medium text-slate-500 mb-1 truncate">{room.request_title}</p>
                                            <div className="flex items-center justify-between gap-4">
                                                <p className="text-[11px] text-slate-400 truncate flex-1 italic">
                                                    {room.last_message || "Start conversation..."}
                                                </p>
                                                {room.unread_count > 0 && (
                                                    <div className="bg-red-600 text-white text-[10px] font-black h-5 min-w-[20px] px-1.5 rounded-full flex items-center justify-center shadow-lg shadow-red-200">
                                                        {room.unread_count}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <ChevronRight size={18} className="text-slate-200 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                                    </motion.div>
                                ))
                            ) : (
                                <div className="py-20 text-center">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-slate-200">
                                        <Search className="text-slate-300" size={24} />
                                    </div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No matching logs in Artery</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* FOOTER INFO CARDS */}
                <div className="mt-6 grid md:grid-cols-2 gap-4">
                    <div className="bg-slate-900 rounded-2xl p-5 text-white flex items-center gap-4 border border-slate-800 shadow-xl overflow-hidden relative group">
                        <Shield className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 group-hover:scale-110 transition-transform" />
                        <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shrink-0">
                            <Shield size={20} />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-red-500 mb-1">Encrypted Artery</h4>
                            <p className="text-[11px] text-slate-400 leading-relaxed font-medium">All communications are end-to-end synchronized within our medical secure layers.</p>
                        </div>
                    </div>

                    <div className="bg-emerald-600 rounded-2xl p-5 text-white flex items-center gap-4 shadow-xl shadow-emerald-100 overflow-hidden relative group">
                        <Target className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 group-hover:rotate-12 transition-transform" />
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                            <Heart size={20} />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-100 mb-1">Impact Tracker</h4>
                            <p className="text-[11px] text-emerald-50 leading-relaxed font-medium">Quick responses save more lives. Update your artery status after donation.</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* FLOATING ACTION BUTTON */}
            <motion.button 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }} 
                onClick={() => navigate('/dashboard')}
                className="fixed bottom-6 right-6 w-14 h-14 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-red-200 z-50 border-2 border-white/20"
            >
                <PlusCircle size={28} />
            </motion.button>
        </div>
    );
};

export default ChatList;