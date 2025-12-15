import React, { Suspense, useLayoutEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Environment } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TheCore from './TheCore';
import DigitalTerrain from './DigitalTerrain';
import FloatingParticles from './FloatingParticles';

gsap.registerPlugin(ScrollTrigger);

const CameraController = () => {
    const { camera } = useThree();

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Intro Animation
            gsap.from(camera.position, {
                z: 20,
                duration: 2,
                ease: "power3.out"
            });

            // Scroll Warp
            gsap.to(camera.position, {
                z: -2, // Fly INTO the core
                ease: "none",
                scrollTrigger: {
                    trigger: "#hero-section",
                    start: "top top",
                    end: "bottom top",
                    scrub: true
                }
            });
        });
        return () => ctx.revert();
    }, [camera]);

    return null;
};

const Scene: React.FC = () => {
    return (
        <div style={{ width: '100%', height: '100vh', position: 'absolute', top: 0, left: 0, zIndex: 1, background: '#000' }}>
            <Canvas gl={{ antialias: true, toneMappingExposure: 1.5 }}>
                <PerspectiveCamera makeDefault position={[0, 2, 10]} fov={75} />
                <CameraController />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />

                <Suspense fallback={null}>
                    <TheCore />
                    <DigitalTerrain />
                    <FloatingParticles />
                    <Environment preset="city" />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default Scene;
