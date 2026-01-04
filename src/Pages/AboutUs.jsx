// import React, { useEffect, useRef } from 'react';
// import { motion } from 'framer-motion';
// import { gsap } from 'gsap';
// import {
//     Code,
//     Palette,
//     Server,
//     Globe,
//     Heart,
//     Shield,
//     Zap,
//     Target,
//     Users,
//     Github,
//     Linkedin,
//     Clock,
//     Activity
// } from 'lucide-react';


// const AboutUs = () => {
//     const bgRef = useRef(null);

//     // GSAP: Ambient Serum Motion for the Background
//     useEffect(() => {
//         const ctx = gsap.context(() => {
//             gsap.to(".serum-blob", {
//                 x: "random(-100, 100)",
//                 y: "random(-100, 100)",
//                 scale: "random(1.2, 1.6)",
//                 duration: 25,
//                 repeat: -1,
//                 yoyo: true,
//                 ease: "sine.inOut",
//                 stagger: 2
//             });
//         }, bgRef);
//         return () => ctx.revert();
//     }, []);

//     const team = [
//         {
//             name: "Riadul Hasan Riad",
//             role: "Frontend Developer",
//             image: "https://i.ibb.co/BKdMDcpB/484830788-2042097956287910-8285311950149983486-n.jpg",
//             bio: "Architecting the fluid visual artery of Red Drop. Specialist in React, GSAP, and high-performance UI orchestration.",
//             icon: <Code className="text-red-600" size={18} />,
//             social: { github: "https://github.com/Riadul-Hasan", linkedin: "#" }
//         },
//         {
//             name: "MD Rifat Hossain",
//             role: "Backend Developer",
//             image: "https://i.ibb.co/Xx33c3sG/485768379-1815762082599527-4056265010160277885-n.jpg",
//             bio: "Engineered the secure neural network and database logic that powers real-time artery synchronization.",
//             icon: <Server className="text-blue-600" size={18} />,
//             social: { github: "https://github.com/iftekharrifat09", linkedin: "#" }
//         },
//         {
//             name: "MD Foysal",
//             role: "Figma Designer & Hosting Support",
//             image: "https://i.ibb.co/7JDxPpxt/483835627-3717074755258268-8589807955055170792-n.jpg",

//             bio: "Crafting the creative blueprint and managing the high-frequency server infrastructure for 99.9% uptime.",
//             icon: <Palette className="text-amber-600" size={18} />,
//             social: { github: "#", linkedin: "#" }
//         }
//     ];

//     return (
//         <div className="relative min-h-screen bg-transparent text-black font-sans pb-20 selection:bg-red-100">

//             {/* AMBIENT SERUM BACKGROUND */}
//             <div ref={bgRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
//                 <div className="serum-blob absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-red-100 rounded-full blur-[120px]" />
//                 <div className="serum-blob absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-100 rounded-full blur-[100px]" />
//             </div>

//             {/* STICKY HEADER AREA */}
//             <header className="relative z-10 mb-16 pt-8">
//                 <motion.div
//                     initial={{ opacity: 0, y: -20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="max-w-7xl mx-auto px-4"
//                 >
//                     <div className="flex items-center gap-3 mb-4">
//                         <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-red-200">System Core</span>
//                         <div className="w-[80px] h-[2px] bg-slate-100" />
//                     </div>
//                     <h1 className="text-5xl lg:text-6xl font-black tracking-tighter text-black uppercase leading-none">
//                         Behind <span className="text-red-600">Red Drop</span>
//                     </h1>
//                     <p className="text-lg font-medium text-slate-500 mt-6 max-w-2xl leading-relaxed">
//                         Meet the architects of the world's most vital blood donation network. Bridging medicine and technology to save lives through code and design.
//                     </p>
//                 </motion.div>
//             </header>

//             {/* TEAM DOSSIER GRID */}
//             <section className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 max-w-7xl mx-auto px-4">
//                 {team.map((member, idx) => (
//                     <motion.div
//                         key={member.name}
//                         initial={{ opacity: 0, y: 30 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ delay: idx * 0.1, duration: 0.6, ease: "circOut" }}
//                         whileHover={{ y: -10 }}
//                         className="group"
//                     >
//                         <div className="h-full bg-white/70 backdrop-blur-2xl rounded-2xl border border-white shadow-sm overflow-hidden p-6 transition-all hover:shadow-2xl hover:border-red-200">
//                             {/* Profile Image - Clinical Grayscale effect */}
//                             <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-6 bg-slate-50 border border-slate-100 shadow-inner">
//                                 <img
//                                     src={member.image}
//                                     alt={member.name}
//                                     className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
//                                 />
//                                 <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
//                                     <div className="flex gap-3">
//                                         {/* GitHub */}
//                                         <a
//                                             href={member.social.github}
//                                             target="_blank"
//                                             rel="noopener noreferrer"
//                                             className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-black hover:bg-red-600 hover:text-white transition-all shadow-xl"
//                                         >
//                                             <Github size={16} />
//                                         </a>

//                                         {/* LinkedIn */}
//                                         <a
//                                             href={member.social.linkedin}
//                                             target="_blank"
//                                             rel="noopener noreferrer"
//                                             className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-black hover:bg-red-600 hover:text-white transition-all shadow-xl"
//                                         >
//                                             <Linkedin size={16} />
//                                         </a>
//                                     </div>

//                                 </div>
//                             </div>

//                             {/* Member Identity */}
//                             <div className="flex items-center gap-3 mb-4">
//                                 <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-red-50 transition-colors">
//                                     {member.icon}
//                                 </div>
//                                 <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.15em]">{member.role}</span>
//                             </div>

//                             <h3 className="text-2xl font-bold text-black mb-3">{member.name}</h3>
//                             <p className="text-sm font-medium text-slate-500 leading-relaxed min-h-[60px]">
//                                 {member.bio}
//                             </p>

//                             <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
//                                 <div className="flex items-center gap-2">
//                                     <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
//                                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Pulse</span>
//                                 </div>
//                                 <div className="flex gap-1.5">
//                                     {[1, 2, 3].map(i => <div key={i} className="w-1 h-1 bg-red-600/30 rounded-full" />)}
//                                 </div>
//                             </div>
//                         </div>
//                     </motion.div>
//                 ))}
//             </section>

//             {/* MISSION & VISION: HIGH CONTRAST */}
//             <section className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto px-4">
//                 <motion.div
//                     whileHover={{ scale: 1.01 }}
//                     className="bg-slate-950 rounded-2xl p-10 text-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative overflow-hidden group border border-slate-800"
//                 >
//                     <div className="relative z-10">
//                         <div className="flex items-center gap-4 mb-8">
//                             <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/40 transform group-hover:rotate-6 transition-transform">
//                                 <Target size={28} />
//                             </div>
//                             <h2 className="text-3xl font-black uppercase tracking-tighter">Our Mission</h2>
//                         </div>
//                         <p className="text-slate-400 text-lg font-medium leading-relaxed mb-10">
//                             To eliminate the critical blood shortage crisis by building a synchronized, digital artery that connects donors and hospitals in under 60 seconds.
//                         </p>
//                         <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-8">
//                             <div>
//                                 <h4 className="text-red-500 font-black text-3xl leading-none">100%</h4>
//                                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Artery Security</p>
//                             </div>
//                             <div>
//                                 <h4 className="text-red-500 font-black text-3xl leading-none">Instant</h4>
//                                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Signal Processing</p>
//                             </div>
//                         </div>
//                     </div>
//                     <Globe size={220} className="absolute -right-20 -bottom-20 text-white/[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
//                 </motion.div>

//                 <div className="space-y-6">
//                     <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm flex items-start gap-6 hover:border-red-100 transition-colors">
//                         <div className="shrink-0 w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
//                             <Shield size={24} />
//                         </div>
//                         <div>
//                             <h3 className="text-xl font-bold text-black uppercase tracking-tight mb-2">Vulnerability Shield</h3>
//                             <p className="text-slate-500 text-sm font-medium leading-relaxed">
//                                 Every request is verified through our neurally-linked medical algorithms, ensuring that help reaches the people who need it most, securely and safely.
//                             </p>
//                         </div>
//                     </div>

//                     <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm flex items-start gap-6 hover:border-blue-100 transition-colors">
//                         <div className="shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
//                             <Zap size={24} className="fill-current" />
//                         </div>
//                         <div>
//                             <h3 className="text-xl font-bold text-black uppercase tracking-tight mb-2">High Frequency Pulse</h3>
//                             <p className="text-slate-500 text-sm font-medium leading-relaxed">
//                                 Our architecture is designed for speed. When an emergency signal is broadcasted, our artery triggers notifications across the entire community grid instantly.
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//         </div>
//     );
// };

// export default AboutUs;


import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import {
    Code,
    Palette,
    Server,
    Globe,
    Heart,
    Shield,
    Zap,
    Target,
    Users,
    Github,
    Linkedin,
    Clock,
    Activity
} from 'lucide-react';

const AboutUs = () => {
    const bgRef = useRef(null);

    // GSAP: Ambient Serum Motion for the Background
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(".serum-blob", {
                x: "random(-100, 100)",
                y: "random(-100, 100)",
                scale: "random(1.2, 1.6)",
                duration: 25,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: 2
            });
        }, bgRef);
        return () => ctx.revert();
    }, []);

    const team = [
        {
            name: "Riadul Hasan Riad",
            role: "Frontend Developer",
            image: "https://i.ibb.co/BKdMDcpB/484830788-2042097956287910-8285311950149983486-n.jpg",
            bio: "Architecting the fluid visual artery of Red Drop. Specialist in React, GSAP, and high-performance UI orchestration.",
            icon: <Code className="text-red-600" size={18} />,
            social: {
                github: "https://github.com/Riadul-Hasan",
                linkedin: "#"
            }
        },
        {
            name: "MD Rifat Hossain",
            role: "Backend Developer",
            image: "https://i.ibb.co/Xx33c3sG/485768379-1815762082599527-4056265010160277885-n.jpg",
            bio: "Engineered the secure neural network and database logic that powers real-time artery synchronization.",
            icon: <Server className="text-blue-600" size={18} />,
            social: {
                github: "https://github.com/iftekharrifat09",
                linkedin: "#"
            }
        },
        {
            name: "MD Foysal",
            role: "Figma Designer & Hosting Support",
            image: "https://i.ibb.co/7JDxPpxt/483835627-3717074755258268-8589807955055170792-n.jpg",
            bio: "Crafting the creative blueprint and managing the high-frequency server infrastructure for 99.9% uptime.",
            icon: <Palette className="text-amber-600" size={18} />,
            social: {
                github: "#",
                linkedin: "#"
            }
        }
    ];

    return (
        <div className="relative min-h-screen bg-transparent text-black  pb-20 selection:bg-red-100">

            {/* AMBIENT SERUM BACKGROUND */}
            <div ref={bgRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
                <div className="serum-blob absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-red-100 rounded-full blur-[120px]" />
                <div className="serum-blob absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-blue-100 rounded-full blur-[100px]" />
            </div>

            {/* STICKY HEADER AREA */}
            <header className="relative z-10 mb-16 pt-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-7xl mx-auto px-4"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg shadow-red-200">
                            System Core
                        </span>
                        <div className="w-[80px] h-[2px] bg-slate-100" />
                    </div>

                    <h1 className="text-5xl lg:text-6xl font-black tracking-tighter text-black uppercase leading-none">
                        Behind <span className="text-red-600">Red Drop</span>
                    </h1>

                    <p className="text-lg font-medium text-slate-500 mt-6 max-w-2xl leading-relaxed">
                        Meet the architects of the world's most vital blood donation network. Bridging medicine and technology to save lives through code and design.
                    </p>
                </motion.div>
            </header>

            {/* TEAM DOSSIER GRID */}
            <section className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 max-w-7xl mx-auto px-4">
                {team.map((member, idx) => (
                    <motion.div
                        key={member.name}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.6, ease: "circOut" }}
                        whileHover={{ y: -10 }}
                        className="group"
                    >
                        <div className="h-full bg-white/70 backdrop-blur-2xl rounded-2xl border border-white shadow-sm overflow-hidden p-6 transition-all hover:shadow-2xl hover:border-red-200">

                            {/* Profile Image */}
                            <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-6 bg-slate-50 border border-slate-100 shadow-inner">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                                />

                                {/* SOCIAL ICONS — FIXED */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                                    <div className="flex gap-3">
                                        <a
                                            href={member.social.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={e => member.social.github === "#" && e.preventDefault()}
                                            className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-black hover:bg-red-600 hover:text-white transition-all shadow-xl"
                                        >
                                            <Github size={16} />
                                        </a>

                                        <a
                                            href={member.social.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={e => member.social.linkedin === "#" && e.preventDefault()}
                                            className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-black hover:bg-red-600 hover:text-white transition-all shadow-xl"
                                        >
                                            <Linkedin size={16} />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Member Identity */}
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-red-50 transition-colors">
                                    {member.icon}
                                </div>
                                <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.15em]">
                                    {member.role}
                                </span>
                            </div>

                            <h3 className="text-2xl font-bold text-black mb-3">{member.name}</h3>

                            <p className="text-sm font-medium text-slate-500 leading-relaxed min-h-[60px]">
                                {member.bio}
                            </p>

                            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        Active Pulse
                                    </span>
                                </div>
                                <div className="flex gap-1.5">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-1 h-1 bg-red-600/30 rounded-full" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </section>

            {/* MISSION & VISION */}
            <section className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto px-4">
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="bg-slate-950 rounded-2xl p-10 text-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative overflow-hidden group border border-slate-800"
                >
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/40 transform group-hover:rotate-6 transition-transform">
                                <Target size={28} />
                            </div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter">
                                Our Mission
                            </h2>
                        </div>

                        <p className="text-slate-400 text-lg font-medium leading-relaxed mb-10">
                            To eliminate the critical blood shortage crisis by building a synchronized, digital artery that connects donors and hospitals in under 60 seconds.
                        </p>
                    </div>

                    <Globe
                        size={220}
                        className="absolute -right-20 -bottom-20 text-white/[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-1000"
                    />
                </motion.div>

                <div className="space-y-6">
                    <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm flex items-start gap-6 hover:border-red-100 transition-colors">
                        <div className="shrink-0 w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                            <Shield size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold uppercase mb-2">
                                Vulnerability Shield
                            </h3>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                Every request is verified through our neurally-linked medical algorithms.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm flex items-start gap-6 hover:border-blue-100 transition-colors">
                        <div className="shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                            <Zap size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold uppercase mb-2">
                                High Frequency Pulse
                            </h3>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                Our architecture is designed for speed.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;
