// // ChatRoomPage.jsx - Standalone chat page with emoji support
// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import EmojiPicker from 'emoji-picker-react'; // Install this package: npm install emoji-picker-react
// import {
//     MessageSquare,
//     Send,
//     ArrowLeft,
//     User,
//     Clock,
//     Heart,
//     Loader2,
//     Smile,
//     Paperclip,
//     Users,
//     X
// } from 'lucide-react';

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

// const ChatRoomPage = () => {
//     const { roomId } = useParams();
//     const navigate = useNavigate();
//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState('');
//     const [loading, setLoading] = useState(true);
//     const [sending, setSending] = useState(false);
//     const [chatRoom, setChatRoom] = useState(null);
//     const [userData, setUserData] = useState(null);
//     const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//     const messagesEndRef = useRef(null);
//     const textareaRef = useRef(null);
//     const emojiPickerRef = useRef(null);
//     const csrfToken = getCookie('csrftoken');

//     useEffect(() => {
//         fetchUserData();
//         fetchChatRoomDetails();
//         fetchMessages();

//         // Poll for new messages every 5 seconds
//         const interval = setInterval(fetchMessages, 5000);

//         return () => clearInterval(interval);
//     }, [roomId]);

//     console.log("Room ID:", roomId);

//     useEffect(() => {
//         scrollToBottom();
//     }, [messages]);

//     // Close emoji picker when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
//                 setShowEmojiPicker(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);

//     const scrollToBottom = () => {
//         messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     };

//     const fetchUserData = async () => {
//         try {
//             const response = await fetch("http://localhost:8000/api/current-user/", {
//                 method: "GET",
//                 credentials: "include",
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 setUserData(data);
//             }
//         } catch (error) {
//             console.error('Error fetching user data:', error);
//         }
//     };

//     const fetchChatRoomDetails = async () => {
//         try {
//             const response = await fetch("http://localhost:8000/api/my-chats/", {
//                 method: "GET",
//                 credentials: "include",
//                 headers: {
//                     'X-CSRFToken': csrfToken,
//                 }
//             });

//             if (response.ok) {
//                 const chatRooms = await response.json();
//                 const room = chatRooms.find(r => r.room_id === parseInt(roomId));
//                 setChatRoom(room);
//             }
//         } catch (error) {
//             console.error('Error fetching chat room details:', error);
//         }
//     };

//     const fetchMessages = async () => {
//         try {
//             const response = await fetch(
//                 `http://localhost:8000/api/chat-messages/${roomId}/`,
//                 {
//                     method: 'GET',
//                     credentials: 'include',
//                     headers: {
//                         'X-CSRFToken': csrfToken,
//                     }
//                 }
//             );

//             if (response.ok) {
//                 const data = await response.json();
//                 setMessages(data);
//                 setLoading(false);
//             } else {
//                 console.error('Failed to fetch messages');
//                 setLoading(false);
//             }
//         } catch (error) {
//             console.error('Error fetching messages:', error);
//             setLoading(false);
//         }
//     };

//     const sendMessage = async (e) => {
//         e.preventDefault();
//         if (!newMessage.trim() || sending) return;

//         setSending(true);

//         const messageData = {
//             message: newMessage.trim(),
//             room_id: roomId
//         };

//         try {
//             const response = await fetch('http://localhost:8000/api/send-message/', {
//                 method: 'POST',
//                 credentials: 'include',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'X-CSRFToken': csrfToken,
//                 },
//                 body: JSON.stringify(messageData)
//             });

//             if (response.ok) {
//                 const sentMessage = await response.json();
//                 setMessages(prev => [...prev, sentMessage]);
//                 setNewMessage('');
//                 // Reset textarea height
//                 if (textareaRef.current) {
//                     textareaRef.current.style.height = 'auto';
//                 }
//                 // Close emoji picker if open
//                 setShowEmojiPicker(false);
//             } else {
//                 const errorData = await response.json();
//                 alert(errorData.error || 'Failed to send message');
//             }
//         } catch (error) {
//             console.error('Error sending message:', error);
//             alert('Failed to send message');
//         } finally {
//             setSending(false);
//         }
//     };

//     const handleKeyDown = (e) => {
//         if (e.key === 'Enter' && !e.shiftKey) {
//             e.preventDefault();
//             sendMessage(e);
//         }
//         // Shift + Enter will work naturally in a textarea
//     };

//     const handleTextareaInput = (e) => {
//         // Auto-resize the textarea
//         e.target.style.height = 'auto';
//         e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
//     };

//     const handleEmojiClick = (emojiData) => {
//         const cursorPosition = textareaRef.current.selectionStart;
//         const textBeforeCursor = newMessage.substring(0, cursorPosition);
//         const textAfterCursor = newMessage.substring(cursorPosition);

//         setNewMessage(textBeforeCursor + emojiData.emoji + textAfterCursor);

//         // Focus back on textarea and set cursor position after the emoji
//         setTimeout(() => {
//             textareaRef.current.focus();
//             const newCursorPosition = cursorPosition + emojiData.emoji.length;
//             textareaRef.current.selectionStart = textareaRef.current.selectionEnd = newCursorPosition;
//         }, 0);
//     };

//     const toggleEmojiPicker = () => {
//         setShowEmojiPicker(!showEmojiPicker);
//         if (!showEmojiPicker) {
//             // Focus on textarea when opening emoji picker
//             setTimeout(() => textareaRef.current?.focus(), 0);
//         }
//     };

//     const formatTime = (timestamp) => {
//         if (!timestamp) return '';
//         const date = new Date(timestamp);
//         return date.toLocaleTimeString('en-US', {
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     };

//     const formatDate = (timestamp) => {
//         if (!timestamp) return '';
//         const date = new Date(timestamp);
//         return date.toLocaleDateString('en-US', {
//             month: 'short',
//             day: 'numeric',
//             year: 'numeric'
//         });
//     };

//     const isToday = (timestamp) => {
//         const date = new Date(timestamp);
//         const today = new Date();
//         return date.getDate() === today.getDate() &&
//             date.getMonth() === today.getMonth() &&
//             date.getFullYear() === today.getFullYear();
//     };

//     if (loading && messages.length === 0) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
//                 <div className="text-center">
//                     <Loader2 className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-3" />
//                     <p className="text-gray-600">Loading chat room...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
//             {/* Header */}
//             <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
//                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-3">
//                             <button
//                                 onClick={() => navigate('/dashboard/my-chats')}
//                                 className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
//                             >
//                                 <ArrowLeft className="w-5 h-5" />
//                             </button>
//                             <div className="relative">
//                                 <MessageSquare className="w-8 h-8 text-purple-500" />
//                                 <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
//                             </div>
//                             <div>
//                                 <h1 className="text-xl font-bold text-gray-900">
//                                     {chatRoom?.with || 'Chat'}
//                                 </h1>
//                                 <div className="flex items-center text-xs text-gray-600">
//                                     <Heart className="w-3 h-3 mr-1 text-red-500" />
//                                     <span>Request #{chatRoom?.request_id || 'Unknown'}</span>
//                                     <span className="mx-2">•</span>
//                                     <span className="flex items-center">
//                                         <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
//                                         Online
//                                     </span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </header>

//             {/* Chat Container */}
//             <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//                 <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-[calc(100vh-180px)] flex flex-col">
//                     {/* Messages Area */}
//                     <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
//                         {messages.length > 0 ? (
//                             <div>
//                                 {messages.map((message, index) => {
//                                     const showDate = index === 0 ||
//                                         formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp);

//                                     return (
//                                         <React.Fragment key={message.id || index}>
//                                             {showDate && (
//                                                 <div className="flex justify-center my-4">
//                                                     <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium">
//                                                         {isToday(message.timestamp) ? 'Today' : formatDate(message.timestamp)}
//                                                     </div>
//                                                 </div>
//                                             )}
//                                             <div className={`mb-3 ${message.sender === userData?.username ? 'flex justify-end' : 'flex justify-start'}`}>
//                                                 <div
//                                                     className={`max-w-[70%] rounded-2xl p-3 ${message.sender === userData?.username
//                                                         ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-br-none'
//                                                         : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
//                                                         }`}
//                                                 >
//                                                     <div className="flex items-center justify-between mb-1">
//                                                         <span className={`text-xs font-medium ${message.sender === userData?.username ? 'text-purple-200' : 'text-gray-500'}`}>
//                                                             {message.sender}
//                                                         </span>
//                                                         <span className={`text-xs ml-2 ${message.sender === userData?.username ? 'text-purple-200' : 'text-gray-400'}`}>
//                                                             {formatTime(message.timestamp)}
//                                                         </span>
//                                                     </div>
//                                                     <p className="text-sm whitespace-pre-wrap">{message.message}</p>
//                                                 </div>
//                                             </div>
//                                         </React.Fragment>
//                                     );
//                                 })}
//                                 <div ref={messagesEndRef} />
//                             </div>
//                         ) : (
//                             <div className="flex-1 flex flex-col items-center justify-center h-full">
//                                 <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mb-4">
//                                     <MessageSquare className="w-10 h-10 text-purple-400" />
//                                 </div>
//                                 <h4 className="text-xl font-bold text-gray-900 mb-2">No messages yet</h4>
//                                 <p className="text-gray-600 text-center max-w-sm mb-6">
//                                     Start the conversation with {chatRoom?.with || 'the other user'}
//                                 </p>
//                                 <div className="text-sm text-gray-500">
//                                     Say hello 👋 or ask about the donation details
//                                 </div>
//                             </div>
//                         )}
//                     </div>

//                     {/* Message Input Area */}
//                     <div className="border-t border-gray-200 p-4 bg-white">
//                         {/* Emoji Picker */}
//                         {showEmojiPicker && (
//                             <div
//                                 ref={emojiPickerRef}
//                                 className="absolute bottom-24 right-8 z-50 shadow-2xl rounded-xl overflow-hidden border border-gray-200"
//                             >
//                                 <div className="bg-white p-2 border-b border-gray-200 flex justify-between items-center">
//                                     <span className="text-sm font-medium text-gray-700">Emoji</span>
//                                     <button
//                                         onClick={() => setShowEmojiPicker(false)}
//                                         className="p-1 hover:bg-gray-100 rounded-full"
//                                     >
//                                         <X className="w-4 h-4 text-gray-500" />
//                                     </button>
//                                 </div>
//                                 <EmojiPicker
//                                     onEmojiClick={handleEmojiClick}
//                                     height={350}
//                                     width={300}
//                                     previewConfig={{ showPreview: false }}
//                                     searchPlaceholder="Search emojis..."
//                                 />
//                             </div>
//                         )}

//                         <form onSubmit={sendMessage} className="flex items-start space-x-2 relative">
//                             <button
//                                 type="button"
//                                 className="p-2 text-gray-500 hover:text-purple-600 transition-colors mt-2"
//                             >
//                                 <Paperclip className="w-5 h-5" />
//                             </button>

//                             <div className="flex-1 relative">
//                                 <textarea
//                                     ref={textareaRef}
//                                     value={newMessage}
//                                     onChange={(e) => setNewMessage(e.target.value)}
//                                     onKeyDown={handleKeyDown}
//                                     onInput={handleTextareaInput}
//                                     placeholder={`Message ${chatRoom?.with || ''}...`}
//                                     className="w-full px-4 py-3 bg-gray-100 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition resize-none"
//                                     disabled={sending}
//                                     rows="1"
//                                     style={{ minHeight: '48px', maxHeight: '120px' }}
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={toggleEmojiPicker}
//                                     className={`absolute right-3 top-3 transition-colors ${showEmojiPicker ? 'text-purple-600' : 'text-gray-400 hover:text-purple-600'}`}
//                                 >
//                                     <Smile className="w-5 h-5" />
//                                 </button>
//                             </div>

//                             <button
//                                 type="submit"
//                                 disabled={!newMessage.trim() || sending}
//                                 className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
//                             >
//                                 {sending ? (
//                                     <Loader2 className="w-5 h-5 animate-spin" />
//                                 ) : (
//                                     <Send className="w-5 h-5" />
//                                 )}
//                             </button>
//                         </form>

//                         <div className="text-xs text-gray-500 text-center mt-2">
//                             Press Enter to send • Shift + Enter for new line
//                         </div>
//                     </div>
//                 </div>
//             </main>
//         </div>
//     );
// };

// export default ChatRoomPage;






import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from "gsap";
import {
    MessageSquare, Send, ArrowLeft, User, Heart, Loader2,
    Smile, Paperclip, X, Activity, Shield, Zap, Target
} from 'lucide-react';

// Function to get CSRF token (Unchanged)
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

const ChatRoomPage = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [chatRoom, setChatRoom] = useState(null);
    const [userData, setUserData] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
    const emojiPickerRef = useRef(null);
    const bgRef = useRef(null);
    const csrfToken = getCookie('csrftoken');

    // GSAP: Ambient Serum Background
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(".serum-blob", {
                x: "random(-150, 150)", y: "random(-150, 150)",
                scale: "random(1.2, 1.8)", duration: 25,
                repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 3
            });
        }, bgRef);
        return () => ctx.revert();
    }, []);

    useEffect(() => {
        fetchUserData();
        fetchChatRoomDetails();
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [roomId]);

    useEffect(() => { scrollToBottom(); }, [messages]);

    const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); };

    const fetchUserData = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/current-user/", { method: "GET", credentials: "include" });
            if (res.ok) setUserData(await res.json());
        } catch (e) { console.error(e); }
    };

    const fetchChatRoomDetails = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/my-chats/", {
                method: "GET", credentials: "include", headers: { 'X-CSRFToken': csrfToken }
            });
            if (res.ok) {
                const chatRooms = await res.json();
                const room = chatRooms.find(r => r.room_id === parseInt(roomId));
                setChatRoom(room);
            }
        } catch (e) { console.error(e); }
    };

    const fetchMessages = async () => {
        try {
            const res = await fetch(`http://localhost:8000/api/chat-messages/${roomId}/`, {
                method: 'GET', credentials: 'include', headers: { 'X-CSRFToken': csrfToken }
            });
            if (res.ok) { setMessages(await res.json()); setLoading(false); }
        } catch (e) { setLoading(false); }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;
        setSending(true);
        try {
            const res = await fetch('http://localhost:8000/api/send-message/', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken },
                body: JSON.stringify({ message: newMessage.trim(), room_id: roomId })
            });
            if (res.ok) {
                const sent = await res.json();
                setMessages(prev => [...prev, sent]);
                setNewMessage('');
                if (textareaRef.current) textareaRef.current.style.height = 'auto';
            }
        } catch (e) { console.error(e); } finally { setSending(false); }
    };

    const handleKeyDown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(e); } };

    const handleTextareaInput = (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
    };

    const handleEmojiClick = (emojiData) => {
        const cursorPosition = textareaRef.current.selectionStart;
        const textBeforeCursor = newMessage.substring(0, cursorPosition);
        const textAfterCursor = newMessage.substring(cursorPosition);
        setNewMessage(textBeforeCursor + emojiData.emoji + textAfterCursor);
        setTimeout(() => {
            textareaRef.current.focus();
            const newPos = cursorPosition + emojiData.emoji.length;
            textareaRef.current.selectionStart = textareaRef.current.selectionEnd = newPos;
        }, 0);
    };

    const formatTime = (ts) => ts ? new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
    const formatDate = (ts) => ts ? new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

    if (loading && messages.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center">
                <Activity className="text-red-600 w-16 h-16 animate-pulse" />
                <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mt-6">Connecting Artery...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-black font-sans selection:bg-red-100 relative overflow-hidden flex flex-col">
            
            {/* GSAP BACKGROUND */}
            <div ref={bgRef} className="fixed inset-0 pointer-events-none z-0 opacity-50">
                <div className="serum-blob absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-red-100 rounded-full blur-[140px]" />
                <div className="serum-blob absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-blue-100 rounded-full blur-[120px]" />
            </div>

            {/* HEADER AREA: CHAT IDENTITY FOCUS */}
            <header className="relative z-[100] px-4 pt-6 lg:px-8 shrink-0">
                <div className="max-w-11xl mx-auto bg-white/70 backdrop-blur-3xl border border-white shadow-sm rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button onClick={() => navigate('/dashboard/my-chats')} className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-600 transition-all shadow-sm">
                            <ArrowLeft size={24} />
                        </button>
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center text-white shadow-xl relative shrink-0">
                                <User size={28} />
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-4 border-white rounded-full" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-black leading-none tracking-tight">
                                    {chatRoom?.with || 'Sync Channel'}
                                </h1>
                                <div className="flex items-center gap-3 mt-1.5">
                                    <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-black rounded uppercase tracking-widest">REQ-#{chatRoom?.request_id || '---'}</span>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secure Broadcast</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-4">
                        <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 flex items-center gap-3">
                            <Shield size={16} className="text-blue-500" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">E2E Protection Active</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 max-w-11xl w-full mx-auto px-4 lg:px-8 py-6 relative z-10 flex flex-col min-h-0">
                <div className="flex-1 bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white shadow-sm overflow-hidden flex flex-col relative">
                    
                    {/* MESSAGE FLOW */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                        <div className="max-w-6xl mx-auto space-y-8">
                            {messages.length > 0 ? (
                                messages.map((message, index) => {
                                    const isMe = message.sender === userData?.username;
                                    const showDate = index === 0 || formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp);

                                    return (
                                        <React.Fragment key={message.id || index}>
                                            {showDate && (
                                                <div className="flex justify-center py-6">
                                                    <span className="bg-white/50 backdrop-blur-sm border border-white px-5 py-1.5 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">
                                                        {formatDate(message.timestamp)}
                                                    </span>
                                                </div>
                                            )}
                                            <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[85%] sm:max-w-[70%] group`}>
                                                    <div className={`flex items-center gap-3 mb-2 px-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                                                        <span className="text-[11px] font-black text-black uppercase">{isMe ? 'Artery Admin' : message.sender}</span>
                                                        <span className="text-[10px] text-slate-300 font-bold">{formatTime(message.timestamp)}</span>
                                                    </div>
                                                    <div className={`px-6 py-4 rounded-[1.8rem] shadow-[0_4px_15px_rgba(0,0,0,0.02)] text-[15px] leading-relaxed transition-all font-medium ${
                                                        isMe 
                                                        ? 'bg-slate-950 text-white rounded-tr-none' 
                                                        : 'bg-white border border-slate-200 text-black rounded-tl-none group-hover:border-red-400'
                                                    }`}>
                                                        {message.message}
                                                    </div>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    );
                                })
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                                    <div className="w-24 h-24 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 border-2 border-dashed border-slate-200">
                                        <Target className="text-slate-200" size={40} />
                                    </div>
                                    <h4 className="text-xl font-black text-black uppercase tracking-widest">Signal Locked</h4>
                                    <p className="text-sm text-slate-400 mt-2 max-w-xs font-medium italic">Begin artery synchronization for request #{chatRoom?.request_id}</p>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* INPUT TERMINAL */}
                    <div className="p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100 shrink-0">
                        <div className="max-w-6xl mx-auto relative">
                            {/* EMOJI COMPONENT */}
                            <AnimatePresence>
                                {showEmojiPicker && (
                                    <motion.div
                                        ref={emojiPickerRef}
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute bottom-24 right-0 z-[200] shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-2xl overflow-hidden border border-slate-200"
                                    >
                                        <EmojiPicker onEmojiClick={handleEmojiClick} height={400} width={320} skinTonesDisabled searchPlaceholder="Scan symbols..." />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form onSubmit={sendMessage} className="flex items-end gap-4">
                                <div className="flex-1 relative flex items-center bg-slate-100 rounded-[1.8rem] p-1.5 focus-within:bg-white focus-within:ring-4 focus-within:ring-red-600/5 transition-all border border-transparent focus-within:border-red-600/20 shadow-inner">
                                    <button type="button" className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-black hover:bg-slate-200/50 rounded-full transition-all">
                                        <Paperclip size={20}/>
                                    </button>
                                    <textarea
                                        ref={textareaRef} value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        onInput={handleTextareaInput}
                                        placeholder="Transmit Artery Message..."
                                        className="flex-1 bg-transparent py-3.5 px-3 text-[15px] font-bold text-black outline-none resize-none max-h-[120px] custom-scrollbar"
                                        rows="1"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
                                        className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors ${showEmojiPicker ? 'bg-red-50 text-red-600' : 'text-slate-400 hover:text-red-600'}`}
                                    >
                                        <Smile size={22}/>
                                    </button>
                                </div>
                                
                                <motion.button
                                    whileTap={{ scale: 0.92 }}
                                    disabled={!newMessage.trim() || sending}
                                    className="w-14 h-14 bg-red-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-red-200 hover:bg-slate-950 transition-all disabled:opacity-30 disabled:shadow-none"
                                >
                                    {sending ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
                                </motion.button>
                            </form>
                            
                            <div className="flex justify-center mt-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest opacity-60 flex items-center gap-2">
                                    <Zap size={10} className="text-red-600 fill-current" /> Auto-sync enabled • Enter to Transmit
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 20px; }
                .epr-main { border: none !important; box-shadow: none !important; }
                .epr-category-nav { padding: 12px !important; }
            `}</style>
        </div>
    );
};

export default ChatRoomPage;