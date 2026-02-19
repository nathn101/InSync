import React, { useState } from "react";
import { FaPlay, FaStop } from "react-icons/fa"; // Switched Pause to Stop for better semantics
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import heroImage from '../assets/hero-image.png'; // Import the image
import { Canvas } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { EffectComposer, Bloom, TiltShift2, Vignette } from "@react-three/postprocessing"; // npm install @react-three/postprocessing
import AudioVisualizerTunnel from "./AudioVisualizerTunnel";

const CameraRig = () => {
    useFrame((state) => {
        // Read mouse position (x and y are between -1 and 1)
        const mouseX = state.mouse.x;
        const mouseY = state.mouse.y;

        // Smoothly interpolate current camera position to target position
        // We move X quite a bit (mouseX * 1.5)
        // We move Y a little less, and keep the base height of 2 ((mouseY * 0.5) + 2)
        state.camera.position.x = THREE.MathUtils.lerp(
            state.camera.position.x,
            mouseX * 0.5,
            0.05
        );
        state.camera.position.y = THREE.MathUtils.lerp(
            state.camera.position.y,
            mouseY * 0.65 + 1.5,
            0.05
        );

        // Ensure camera always looks at the end of the tunnel
        state.camera.lookAt(0, -1, -5);
    });
    return null; // This component renders nothing visual
};

const Home = () => {
    const [isActive, setIsActive] = useState(false);

    return (
        <div className="relative w-full h-screen bg-black overflow-hidden font-sans">

            {/* --- NOISE TEXTURE OVERLAY --- */}
            <div className="noise-bg"></div>

            {/* --- 3D SCENE --- */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 2, 5], fov: 60 }}>
                    <color attach="background" args={['#050505']} />
                    <fog attach="fog" args={['#050505', 5, 10]} />

                    <AudioVisualizerTunnel isActive={isActive} />

                    <EffectComposer disableNormalPass>
                        <Bloom luminanceThreshold={0} mipmapBlur intensity={0.3} />
                        <Vignette eskil={false} offset={0.1} darkness={1.1} />
                    </EffectComposer>
                    <CameraRig />
                </Canvas>
            </div>

            {/* --- HERO UI OVERLAY --- */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full pointer-events-none px-4 pb-20">

                {/* 1. Main Title with "Syne" font */}
                <div className="text-center space-y-0">
                    <h1 className="font-display text-8xl md:text-8xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-green-200 to-green-900 drop-shadow-2xl mix-blend-overlay">
                        InSync
                    </h1>

                    {/* 2. Subtitle with wider spacing */}
                    <p className="text-white/80 text-xs md:text-sm tracking-[0.5em] uppercase font-medium backdrop-blur-sm">
                        A new channel of music discovery
                    </p>
                </div>

                {/* 3. Modern Call to Action (Glass Button) */}
                <div className="mt-12 pointer-events-auto flex flex-col items-center gap-6">
                    <button
                        onClick={handleGetStarted}
                        className="px-8 py-3 bg-green-500 text-black font-bold rounded-full hover:bg-green-400 transition transform hover:scale-105"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Home;
