import React, { useEffect, useRef, useState } from 'react';
import { FaPause, FaPlay, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';

const Home = () => {
    const canvasRef = useRef(null);
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const animationRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const dataArrayRef = useRef(null);

    const gaussianBlur = (data, radius) => {
        const kernelSize = 2 * radius + 1;
        const kernel = new Array(kernelSize).fill(1 / kernelSize);
        const blurredData = new Uint8Array(data.length);

        for (let i = 0; i < data.length; i++) {
            let sum = 0;
            for (let j = -radius; j <= radius; j++) {
                const index = Math.min(Math.max(i + j, 0), data.length - 1);
                sum += data[index] * kernel[j + radius];
            }
            blurredData[i] = sum;
        }

        return blurredData;
    };

    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const analyser = analyserRef.current;
        const dataArray = dataArrayRef.current;
        analyser.getByteFrequencyData(dataArray);
        const blurredData = gaussianBlur([ ...[...dataArray].slice(0, 20), ...[...dataArray].slice(0, 20).reverse()], 3);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / blurredData.length); // Adjusted width
        let barHeight;
        const curvePoints = [];

        for (let i = 0; i < blurredData.length; i++) {
            barHeight = blurredData[i] * 4; // Increased height
            const rectHeight = 10;
            const numRectangles = Math.floor(barHeight / rectHeight);
            const gap = 3.5; // Gap between rectangles
            const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
            gradient.addColorStop(0, 'green');
            gradient.addColorStop(1, 'yellow');
            ctx.fillStyle = gradient;
            for (let j = 0; j < numRectangles; j++) {
                ctx.beginPath();
                ctx.moveTo(i * barWidth, canvas.height - (rectHeight + gap) * (j + 1) + 5);
                ctx.arcTo(i * barWidth, canvas.height - (rectHeight + gap) * (j + 1), i * barWidth + barWidth, canvas.height - (rectHeight + gap) * (j + 1), 5);
                ctx.arcTo(i * barWidth + barWidth, canvas.height - (rectHeight + gap) * (j + 1), i * barWidth + barWidth, canvas.height - (rectHeight + gap) * (j + 1) + rectHeight, 5);
                ctx.arcTo(i * barWidth + barWidth, canvas.height - (rectHeight + gap) * (j + 1) + rectHeight, i * barWidth, canvas.height - (rectHeight + gap) * (j + 1) + rectHeight, 5);
                ctx.arcTo(i * barWidth, canvas.height - (rectHeight + gap) * (j + 1) + rectHeight, i * barWidth, canvas.height - (rectHeight + gap) * (j + 1), 5);
                ctx.closePath();
                ctx.fill();
            }
            curvePoints.push({ x: i * barWidth + barWidth / 2, y: canvas.height - barHeight });
        }
        animationRef.current = requestAnimationFrame(draw);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        dataArrayRef.current = dataArray;

        // Ensure the path to the audio file is correct
        const audio = new Audio('/audio/i-dont-need-your-love-adi-goldstein-main-version-06-17-13841.mp3');
        audio.crossOrigin = "anonymous";
        audio.volume = 0.008;
        audio.playbackRate = 0.75; // Slow down the music
        audio.loop = true; // Repeat the audio
        audio.preload = 'auto'; // Preload the audio

        audio.addEventListener('canplaythrough', () => {
            setIsLoaded(true);
        });

        audioRef.current = audio;
        const source = audioContext.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        return () => {
            audio.pause();
            audioContext.close();
            cancelAnimationFrame(animationRef.current);
        };
    }, []);

    const handlePlayPause = async () => {
        if (isLoaded) {
            if (audioContextRef.current.state === 'suspended') {
                await audioContextRef.current.resume();
            }
            if (!isPlaying) {
                audioRef.current.play();
                animationRef.current = requestAnimationFrame(draw);
            } else {
                audioRef.current.pause();
                cancelAnimationFrame(animationRef.current);
            }
            setIsPlaying(!isPlaying);
        } else {
            console.log('Audio is not fully loaded yet.');
        }
    };

    const handleMuteUnmute = () => {
        audioRef.current.muted = !audioRef.current.muted;
        setIsMuted(!isMuted);
    };

    return (
        <div className="relative flex justify-center items-center flex-grow bg-gradient-to-b from-black via-gray-900 to-green-900 min-h-screen">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full"></canvas>
            <div className="relative bg-opacity-50 p-16 rounded-lg text-center text-white max-w-4xl w-full">
                <h1 className="text-4xl mb-4">Welcome to <span className="text-green-500">InSync</span></h1>
                <p className="text-xl">Your personalized music circle</p>
            </div>
            <div className="absolute bottom-4 left-2 flex space-x-4">
                <button 
                    onClick={handlePlayPause} 
                    className="text-white p-4 flex items-center justify-center"
                    disabled={!isLoaded}
                >
                    {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
                </button>
                <button 
                    onClick={handleMuteUnmute} 
                    className="text-white p-4 flex items-center justify-center"
                >
                    {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
                </button>
            </div>
        </div>
    );
}

export default Home;