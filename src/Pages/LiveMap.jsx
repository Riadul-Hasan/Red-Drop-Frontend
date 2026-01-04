import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from "gsap";
import {
    Globe, Clock, RefreshCw, Share2, AlertCircle, Signal, Satellite,
    Crosshair, ChevronRight, Map as MapIcon, Navigation, Activity, 
    Target, ZoomIn, ZoomOut, Compass
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// --- LEAFLET ASSET FIX ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// --- CUSTOM COMPACT MARKERS ---
const createMedicalIcon = () => L.divIcon({
    html: `
        <div class="relative flex items-center justify-center">
            <div class="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow-lg border-2 border-white transform rotate-45">
                <div class="-rotate-45"><svg viewBox="0 0 24 24" width="14" height="14" fill="white"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></div>
            </div>
        </div>`,
    className: 'medical-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
});

const createUserIcon = () => L.divIcon({
    html: `
        <div class="relative flex items-center justify-center">
            <div class="w-10 h-10 bg-slate-950 rounded-xl flex items-center justify-center shadow-2xl border-2 border-white">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#ef4444" stroke-width="3"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle></svg>
            </div>
        </div>`,
    className: 'user-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20]
});

const MapCenter = ({ position }) => {
    const map = useMap();
    useEffect(() => { if (position) map.setView(position, 15); }, [position, map]);
    return null;
};

const LiveMap = () => {
    const [userLocation, setUserLocation] = useState([23.8103, 90.4125]);
    const [locationName, setLocationName] = useState('Locating Artery...');
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [accuracy, setAccuracy] = useState(50);
    const [mapKey, setMapKey] = useState(Date.now());
    const mapRef = useRef(null);
    const bgRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(".serum-blob", {
                x: "random(-80, 80)", y: "random(-80, 80)",
                duration: 25, repeat: -1, yoyo: true, ease: "sine.inOut"
            });
        }, bgRef);
        return () => ctx.revert();
    }, []);

    const getLocationName = useCallback(async (lat, lng) => {
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18`);
            if (res.ok) {
                const data = await res.json();
                return data.display_name.split(',').slice(0, 2).join(', ');
            }
        } catch (e) { console.error(e); }
        return "Coordinates Locked";
    }, []);

    const getCurrentLocation = useCallback(async () => {
        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude: lat, longitude: lng, accuracy: acc } = pos.coords;
            setUserLocation([lat, lng]);
            setAccuracy(acc);
            setLastUpdated(new Date());
            setLocationName(await getLocationName(lat, lng));
            setIsLoading(false);
            setMapKey(Date.now());
        }, () => setIsLoading(false), { enableHighAccuracy: true });
    }, [getLocationName]);

    useEffect(() => {
        getCurrentLocation();
        const int = setInterval(getCurrentLocation, 60000);
        return () => clearInterval(int);
    }, [getCurrentLocation]);

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-black font-sans selection:bg-red-100 relative overflow-hidden p-4 lg:p-5">
            
            {/* GSAP BACKGROUND */}
            <div ref={bgRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
                <div className="serum-blob absolute top-0 left-0 w-[40vw] h-[40vw] bg-red-100 rounded-full blur-[100px]" />
                <div className="serum-blob absolute bottom-0 right-0 w-[30vw] h-[30vw] bg-blue-100 rounded-full blur-[80px]" />
            </div>

            {/* MINIMAL HEADER */}
            <div className="relative z-10 max-w-full mx-auto mb-4">
                <div className="flex items-center justify-between gap-4 bg-white/60 backdrop-blur-xl p-3 px-5 rounded-xl border border-white shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-lg">
                            <Compass className="text-white" size={20} />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight text-black leading-none">Artery Live Map</h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> GPS Active
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={getCurrentLocation} className="p-2.5 bg-white border border-slate-200 rounded-lg hover:border-red-200 transition-all">
                            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                        </button>
                        <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all hover:bg-red-600 shadow-md">
                            <Share2 size={14} /> Broadcast
                        </button>
                    </div>
                </div>
            </div>

            <div className="relative z-10 max-w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4">
                
                {/* COMPACT SIDE PANEL */}
                <div className="lg:col-span-3 space-y-4">
                    {/* TERMINAL STATUS */}
                    <div className="bg-slate-950 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden border border-slate-800">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-5">
                                <Satellite size={18} className="text-red-500" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Linked Terminal</span>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Current Sector</p>
                                    <p className="text-sm font-bold text-slate-100 line-clamp-1">{isLoading ? "Syncing..." : locationName}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                                        <p className="text-[8px] font-bold text-slate-500 uppercase">Latitude</p>
                                        <p className="text-xs font-mono font-bold text-red-400">{userLocation[0].toFixed(5)}</p>
                                    </div>
                                    <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                                        <p className="text-[8px] font-bold text-slate-500 uppercase">Longitude</p>
                                        <p className="text-xs font-mono font-bold text-red-400">{userLocation[1].toFixed(5)}</p>
                                    </div>
                                </div>

                                <div className="bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                                    <div className="flex justify-between items-center mb-1.5">
                                        <span className="text-[9px] font-bold text-emerald-400 uppercase">Signal</span>
                                        <span className="text-[9px] font-black text-emerald-400">±{accuracy.toFixed(0)}m</span>
                                    </div>
                                    <div className="h-1 w-full bg-emerald-950 rounded-full overflow-hidden">
                                        <motion.div animate={{ width: `${Math.max(10, 100 - accuracy)}%` }} className="h-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* VITAL TILES */}
                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
                            <Clock size={16} className="text-red-600" />
                            <div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase">Last Sync</p>
                                <p className="text-xs font-bold text-black">{lastUpdated.toLocaleTimeString()}</p>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-center gap-3">
                            <Activity size={16} className="text-emerald-600" />
                            <div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase">Status</p>
                                <p className="text-xs font-bold text-black">High Freq</p>
                            </div>
                        </div>
                    </div>

                    <button onClick={getCurrentLocation} className="w-full py-3.5 bg-red-600 text-white rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-lg shadow-red-100 flex items-center justify-center gap-2">
                        <Crosshair size={16} /> Re-Center Artery
                    </button>
                </div>

                {/* MAIN MAP AREA */}
                <div className="lg:col-span-9 relative">
                    <div className="h-[550px] lg:h-[calc(100vh-160px)] bg-white rounded-2xl border-4 border-white shadow-xl overflow-hidden relative">
                        <MapContainer key={mapKey} center={userLocation} zoom={15} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            
                            <Marker position={userLocation} icon={createUserIcon()}>
                                <Popup className="tactical-popup">
                                    <div className="p-1 font-sans">
                                        <p className="text-[9px] font-bold text-red-500 uppercase">Current Marker</p>
                                        <p className="text-xs font-bold text-slate-800">{locationName}</p>
                                    </div>
                                </Popup>
                            </Marker>

                            <Circle center={userLocation} radius={accuracy} pathOptions={{ fillColor: '#ef4444', fillOpacity: 0.1, color: '#ef4444', weight: 1, dashArray: '4, 8' }} />

                            <Marker position={[userLocation[0] + 0.005, userLocation[1] + 0.005]} icon={createMedicalIcon()}>
                                <Popup>
                                    <div className="p-1">
                                        <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-tight">Active Node</p>
                                        <p className="text-xs font-bold text-slate-800">Unit Alpha-01</p>
                                    </div>
                                </Popup>
                            </Marker>

                            <MapCenter position={userLocation} />
                        </MapContainer>

                        {/* COMPACT MAP CONTROLS */}
                        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
                            <button onClick={() => mapRef.current?.zoomIn()} className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center text-slate-800 border border-slate-100 hover:bg-slate-50 transition-all"><ZoomIn size={18}/></button>
                            <button onClick={() => mapRef.current?.zoomOut()} className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center text-slate-800 border border-slate-100 hover:bg-slate-50 transition-all"><ZoomOut size={18}/></button>
                            <button onClick={getCurrentLocation} className="w-10 h-10 bg-black rounded-lg shadow-lg flex items-center justify-center text-white transition-all"><Navigation size={18}/></button>
                        </div>

                        {/* STATUS OVERLAY */}
                        <div className="absolute bottom-6 left-6 z-[1000] flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-lg border border-slate-200 shadow-xl">
                            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                            <span className="text-[10px] font-bold text-black uppercase tracking-widest">Satellite Locked</span>
                            <div className="w-[1px] h-3 bg-slate-200 mx-1" />
                            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-tighter">Prec-V.2</span>
                        </div>

                        {/* LOADING OVERLAY */}
                        <AnimatePresence>
                            {isLoading && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm z-[2000] flex items-center justify-center">
                                    <div className="text-center bg-white p-6 rounded-2xl shadow-2xl border border-slate-100">
                                        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                        <p className="text-black font-bold uppercase tracking-[0.2em] text-[10px]">Updating GPS Feed...</p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .leaflet-container { background: #f1f5f9 !important; border-radius: 0.75rem; }
                .tactical-popup .leaflet-popup-content-wrapper { background: white !important; color: black !important; border-radius: 0.75rem !important; border: 1px solid #e2e8f0; }
                .leaflet-tile-pane { filter: grayscale(100%) invert(5%) contrast(110%); opacity: 0.8; }
            `}</style>
        </div>
    );
};

export default LiveMap;