import React from 'react';
import { FaSpotify, FaGoogle, FaFacebook } from 'react-icons/fa'; // Assuming you have react-icons installed
import { IoMusicalNotes, IoPeople, IoInfinite } from 'react-icons/io5';

const About = () => {
    return (
        <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center font-sans selection:bg-green-500 selection:text-black">
            
            {/* --- BACKGROUND ELEMENTS --- */}
            
            {/* 1. The Grid (CSS Pattern) */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            
            {/* 2. Ambient Glow Blobs (Behind the card) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-500/20 rounded-full blur-[100px] pointer-events-none"></div>

            {/* --- MAIN CONTENT CARD --- */}
            <div className="relative z-10 max-w-4xl w-full mx-4">
                <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
                    
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">InSync</span>
                        </h2>
                        <div className="h-1 w-20 bg-green-500 mx-auto rounded-full opacity-50"></div>
                    </div>

                    {/* Grid Layout for Features */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        
                        {/* Text Section */}
                        <div className="space-y-6 text-gray-300 text-lg font-light leading-relaxed">
                            <p>
                                Music is more than just sound—it's a language. 
                                <strong className="text-white font-medium"> InSync</strong> bridges the gap between streaming and socializing.
                            </p>
                            <p>
                                We analyze your listening habits to connect you with people who vibrate on your frequency. Whether you're into underground techno or classical jazz, find your crowd here.
                            </p>
                        </div>

                        {/* Feature Pills */}
                        <div className="space-y-4">
                            <FeatureRow 
                                icon={<IoMusicalNotes className="text-green-400" />} 
                                title="Music Matching" 
                                desc="Algorithm-driven compatibility based on your taste."
                            />
                            <FeatureRow 
                                icon={<IoPeople className="text-blue-400" />} 
                                title="Social Discovery" 
                                desc="Meet friends, not just playlists."
                            />
                            <FeatureRow 
                                icon={<IoInfinite className="text-purple-400" />} 
                                title="Seamless Sync" 
                                desc="Integrated directly with your favorite platforms."
                            />
                        </div>
                    </div>

                    {/* Integrations Footer */}
                    <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center">
                        <p className="text-xs uppercase tracking-widest text-gray-500 mb-4">Powered by</p>
                        <div className="flex gap-6 text-2xl text-gray-400">
                            <FaSpotify className="hover:text-[#1DB954] transition-colors duration-300 cursor-pointer" title="Spotify" />
                            <FaGoogle className="hover:text-white transition-colors duration-300 cursor-pointer" title="Google" />
                            <FaFacebook className="hover:text-[#1877F2] transition-colors duration-300 cursor-pointer" title="Facebook" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper component for the feature list
const FeatureRow = ({ icon, title, desc }) => (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors duration-300">
        <div className="text-2xl p-3 bg-black/50 rounded-lg">
            {icon}
        </div>
        <div>
            <h4 className="text-white font-medium">{title}</h4>
            <p className="text-sm text-gray-400">{desc}</p>
        </div>
    </div>
);

export default About;