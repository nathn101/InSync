import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Text } from '@react-three/drei';
import * as THREE from 'three';

const AudioVisualizerTunnel = ({ isActive }) => {
    const count = 50;     
    // 1. INCREASED SPACING (0.6 -> 0.8)
    // This makes the tunnel longer (40 units deep) without adding more bars (saving performance)
    // The "pop-in" will now happen much further away in the darkness.
    const spacing = 1.2;  
    const width = 6;     
    const loopLength = count * spacing / 4; 
    const pointsCount = count * 3;

    const barGroups = useRef([]);
    const leftLineGeo = useRef();
    const rightLineGeo = useRef();
    const ceilingRef = useRef();
    const floorRef = useRef();
    const textGroupRef = useRef();

    const bars = useMemo(() => new Array(count).fill(0).map((_, i) => ({ id: i })), [count]);
    const linePositions = useMemo(() => new Float32Array(pointsCount * 3), [pointsCount]);

    const alphaMap = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 64; 
        const context = canvas.getContext('2d');
        context.fillStyle = '#000000';
        context.fillRect(0, 0, 32, 64);
        context.fillStyle = '#FFFFFF';
        for(let i=0; i<12; i++) {
            context.fillRect(0, i * 5 + 1, 32, 3);
        }
        const texture = new THREE.CanvasTexture(canvas);
        texture.magFilter = THREE.NearestFilter; 
        return texture;
    }, []);

    useFrame((state) => {
        const time = state.clock.elapsedTime;
        const leftControlPoints = [];
        const rightControlPoints = [];

        if (ceilingRef.current) ceilingRef.current.position.z = (time * 2) % 2; 
        if (floorRef.current) floorRef.current.position.z = (time * 2) % 2;
        if (textGroupRef.current) textGroupRef.current.position.y = Math.sin(time) * 0.1 + 1.5;

        barGroups.current.forEach((group, index) => {
            if (!group) return;
            const rowIndex = Math.floor(index / 2);
            
            const moveSpeed = 0.5;
            let pos = (-(rowIndex * spacing) + (time * moveSpeed));
            let z = ((pos % loopLength) + loopLength) % loopLength;
            
            // 2. ADJUSTED OFFSET FOR LONGER TUNNEL
            // Loop Length is now 40. We shift Z to range [-34 ... +6]
            z = z - loopLength + 6; 
            group.position.z = z;
        
            // Wave Math (Kept smooth)
            const mainWave = Math.abs(Math.sin(time * 1.5 + index * 0.15));
            const noiseWave = Math.abs(Math.sin(time * 4 + index * 2.5)) * 0.3;
            let targetHeight = 0.2 + (mainWave * 1.0) + noiseWave;
            
            // 3. VISIBILITY LOGIC
            let opacity = 1;
            // Fade out deep in the back (-28)
            if (z < -28) opacity = THREE.MathUtils.smoothstep(z, -34, -28);
            if (z > 2) opacity = 1 - THREE.MathUtils.smoothstep(z, 2, 5);

            const mesh = group.children[0]; 
            if(mesh) {
                mesh.scale.y = THREE.MathUtils.lerp(mesh.scale.y, targetHeight, 0.2);
                mesh.material.opacity = opacity;
                mesh.material.emissiveIntensity = 1 + (targetHeight * 0.5); 
            }

            // 4. FILTER LINE POINTS (The Fix)
            // We ONLY add points to the line if the bar is actually visible (opacity > 0.1)
            // This prevents the line from snapping to the invisible bars respawning at the back.
            if (opacity > 0.1) {
                const isRightSide = index % 2 === 1;
                const x = isRightSide ? width / 2 : -width / 2;
                const y = mesh ? mesh.scale.y + 0.1 : 1; 
                const point = { x, y, z };
                if (isRightSide) rightControlPoints.push(point);
                else leftControlPoints.push(point);
            }
        });

        // Sort lines
        leftControlPoints.sort((a, b) => a.z - b.z);
        rightControlPoints.sort((a, b) => a.z - b.z);

        const updateSmoothLine = (controlPoints, geoAttribute) => {
            if (controlPoints.length < 2 || !geoAttribute) return;
            const vectors = controlPoints.map(p => new THREE.Vector3(p.x, p.y, p.z));
            const curve = new THREE.CatmullRomCurve3(vectors);
            curve.tension = 0.5; 
            
            // Dynamic point count based on visible length (prevents stretching)
            const pointsToDraw = Math.min(pointsCount, controlPoints.length * 5);
            const smoothPoints = curve.getPoints(pointsCount - 1);
            
            for (let i = 0; i < pointsCount; i++) {
                // If we run out of curve points, clamp to the last one
                // This prevents the "Zapping to 0,0,0" bug
                const p = smoothPoints[i] || smoothPoints[smoothPoints.length - 1];
                geoAttribute[i * 3] = p.x;
                geoAttribute[i * 3 + 1] = p.y;
                geoAttribute[i * 3 + 2] = p.z;
            }
        };

        updateSmoothLine(leftControlPoints, leftLineGeo.current?.attributes.position.array);
        updateSmoothLine(rightControlPoints, rightLineGeo.current?.attributes.position.array);
        
        if (leftLineGeo.current) leftLineGeo.current.attributes.position.needsUpdate = true;
        if (rightLineGeo.current) rightLineGeo.current.attributes.position.needsUpdate = true;
    });

    return (
        <group>
            <Environment preset="city" />
            <ambientLight intensity={0.2} />
            <pointLight position={[0, 5, -5]} color="#1ED760" intensity={2} distance={20} />

            {bars.map((bar, barIndex) => {
                 const isRight = barIndex % 2 === 1;
                 const xPos = isRight ? width / 2 : -width / 2;
                 return (
                    <group key={barIndex} ref={el => barGroups.current[barIndex] = el} position={[xPos, 0, 0]}>
                        <mesh>
                            <boxGeometry args={[0.15, 1, 0.4]} onUpdate={(c) => c.translate(0, 0.5, 0)} />
                            <meshStandardMaterial 
                                color="#000000"
                                emissive="#1ED760"
                                emissiveIntensity={1}
                                transparent
                                alphaMap={alphaMap} 
                            />
                        </mesh>
                    </group>
                )
            })}

            <line>
                <bufferGeometry ref={leftLineGeo}>
                    <bufferAttribute attach="attributes-position" count={pointsCount} array={linePositions} itemSize={3} />
                </bufferGeometry>
                <lineBasicMaterial color="#1ED760" transparent opacity={0.6} linewidth={2} />
            </line>
            <line>
                <bufferGeometry ref={rightLineGeo}>
                     <bufferAttribute attach="attributes-position" count={pointsCount} array={linePositions.slice()} itemSize={3} />
                </bufferGeometry>
                <lineBasicMaterial color="#1ED760" transparent opacity={0.6} linewidth={2} />
            </line>

            {/* FLOORS & CEILINGS */}
            <group ref={floorRef}>
                <gridHelper args={[60, 30, 0x002200, 0x001100]} position={[0, -0.1, 0]} />
            </group>
            <group ref={ceilingRef}>
                <gridHelper args={[60, 30, 0x002200, 0x001100]} position={[0, 4, 0]} />
            </group>
        </group>
    );
};

export default AudioVisualizerTunnel;