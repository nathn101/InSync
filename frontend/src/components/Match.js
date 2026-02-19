import React from 'react';
import { FaSpotify, FaHeart, FaComment } from 'react-icons/fa';
import { IoMusicalNotes, IoFlash, IoPersonAdd } from 'react-icons/io5';

const Matches = () => {
    // Mock data for matches
    const matches = [
        {
            id: 1,
            name: "Alex Rivers",
            compatibility: 94,
            topGenre: "Indie Rock",
            sharedArtists: ["Arctic Monkeys", "Tame Impala"],
            img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop"
        },
        {
            id: 2,
            name: "Jordan Lee",
            compatibility: 88,
            topGenre: "Techno / House",
            sharedArtists: ["Peggy Gou", "Fred again.."],
            img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop"
        },
        {
            id: 3,
            name: "Sarah Chen",
            compatibility: 82,
            topGenre: "Jazz Fusion",
            sharedArtists: ["Kamasi Washington", "Snarky Puppy"],
            img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
        }
    ];

    return (
        <div className="relative min-h-screen bg-black overflow-x-hidden py-20 px-4 font-sans selection:bg-green-500 selection:text-black">
            
            {/* --- BACKGROUND ELEMENTS (Consistent with About Page) --- */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
            <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="relative z-10 max-w-6xl mx-auto">
                
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                        Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Soulmates</span>
                    </h2>
                    <p className="text-gray-400 max-w-lg mx-auto">
                        Based on your recent listening history and top-played artists.
                    </p>
                </div>

                {/* Matches Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {matches.map((match) => (
                        <MatchCard key={match.id} match={match} />
                    ))}
                </div>

                {/* Quick Action Footer */}
                <div className="mt-20 text-center">
                    <button className="px-8 py-4 bg-white/5 border border-white/10 hover:border-green-500/50 text-white rounded-full transition-all duration-300 backdrop-blur-sm group">
                        <span className="flex items-center gap-2">
                            <IoFlash className="group-hover:text-green-400 transition-colors" />
                            Refresh Recommendations
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

// Helper Component: Individual Match Card
const MatchCard = ({ match }) => (
    <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-green-500/30 transition-all duration-500 hover:-translate-y-2 shadow-2xl">
        
        {/* Profile Image & Compatibility Badge */}
        <div className="relative h-64 w-full overflow-hidden">
            <img 
                src={match.img} 
                alt={match.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-white text-xs font-bold">{match.compatibility}% Match</span>
            </div>
        </div>

        {/* Card Content */}
        <div className="p-6">
            <h3 className="text-2xl font-bold text-white mb-1">{match.name}</h3>
            <p className="text-green-400 text-sm font-medium mb-4 flex items-center gap-2">
                <IoMusicalNotes /> {match.topGenre}
            </p>

            <div className="space-y-3 mb-6">
                <p className="text-xs uppercase tracking-widest text-gray-500">Shared Artists</p>
                <div className="flex flex-wrap gap-2">
                    {match.sharedArtists.map((artist, idx) => (
                        <span key={idx} className="text-xs bg-white/5 border border-white/5 px-3 py-1 rounded-lg text-gray-300">
                            {artist}
                        </span>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <button className="flex-1 bg-green-500 hover:bg-green-400 text-black font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                    <IoPersonAdd /> Connect
                </button>
                <button className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-colors">
                    <FaComment />
                </button>
            </div>
        </div>
    </div>
);

export default Matches;