import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import lataVideo from '../../assets/videos/Lata AGENCIA.mp4';

gsap.registerPlugin(ScrollTrigger);

const CinematicDrinkHero: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    // Smooth progress for UI elements (bar, text)
    const smoothProgress = useSpring(0, {
        damping: 30,
        mass: 0.2,
        stiffness: 250
    });

    useEffect(() => {
        smoothProgress.set(progress);
    }, [progress, smoothProgress]);

    // Parallax effects
    const scale = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.1, 1]);
    const textY = useTransform(smoothProgress, [0, 1], ["0%", "-50%"]);

    // GSAP ScrollTrigger Implementation
    useLayoutEffect(() => {
        const container = containerRef.current;
        const video = videoRef.current;

        if (!container || !video) return;

        const ctx = gsap.context(() => {
            // Pin the container and scrub the animation
            ScrollTrigger.create({
                trigger: container,
                start: "top top",
                end: "+=1000%", // Extreme increase to 1000% to guarantee slow-motion feel
                pin: true,
                scrub: 2, // Heavy smoothing to mask video keyframe jumps
                onUpdate: (self) => {
                    const p = self.progress;
                    setProgress(p);

                    // Sync video time
                    if (video.duration) {
                        video.currentTime = p * video.duration;
                    }
                }
            });
        }, containerRef);

        return () => ctx.revert();
    }, [isLoading]);

    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Handle Video Loading & Canvas Setup
    useEffect(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Resize canvas to match video dimensions once metadata is loaded
        const handleResize = () => {
            if (video.videoWidth && video.videoHeight) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;

                // Initial draw
                const scale = Math.max(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
                const x = (canvas.width - video.videoWidth * scale) / 2;
                const y = (canvas.height - video.videoHeight * scale) / 2;
                ctx.drawImage(video, x, y, video.videoWidth * scale, video.videoHeight * scale);
            }
        };

        video.addEventListener('loadedmetadata', handleResize);
        window.addEventListener('resize', handleResize);

        // Draw loop
        const render = () => {
            if (video.readyState >= 2) {
                const scale = Math.max(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
                const x = (canvas.width - video.videoWidth * scale) / 2;
                const y = (canvas.height - video.videoHeight * scale) / 2;
                ctx.drawImage(video, x, y, video.videoWidth * scale, video.videoHeight * scale);
            }
            requestAnimationFrame(render);
        };
        const rafId = requestAnimationFrame(render);

        // Load video normally
        video.src = lataVideo;
        video.load();

        // Wake up
        const onReady = () => {
            setIsLoading(false);
            handleResize();
            ScrollTrigger.refresh();
        };

        video.addEventListener('canplay', onReady);

        return () => {
            window.removeEventListener('resize', handleResize);
            video.removeEventListener('loadedmetadata', handleResize);
            video.removeEventListener('canplay', onReady);
            cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                height: '100vh',
                width: '100vw',
                background: '#000',
                overflow: 'hidden',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 10
            }}
        >
            {/* Loading Overlay */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: '#000',
                            zIndex: 20,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'column'
                        }}
                    >
                        <div style={{
                            width: '40px',
                            height: '40px',
                            border: '3px solid rgba(255,255,255,0.1)',
                            borderTopColor: '#ff2a6d',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                        }} />
                        <p style={{
                            color: '#fff',
                            marginTop: '1rem',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.8rem',
                            letterSpacing: '0.2em'
                        }}>RENDERING ENGINE...</p>
                        <style>{`
                            @keyframes spin {
                                to { transform: rotate(360deg); }
                            }
                        `}</style>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Background Glow */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '60vw',
                height: '60vw',
                background: 'radial-gradient(circle, rgba(255, 42, 109, 0.15) 0%, transparent 70%)',
                zIndex: 0,
                pointerEvents: 'none'
            }} />

            {/* Canvas for Video Rendering */}
            <motion.canvas
                ref={canvasRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    scale,
                    zIndex: 1
                }}
            />

            {/* Hidden Video Source */}
            <video
                ref={videoRef}
                muted
                playsInline
                preload="auto"
                style={{ display: 'none' }}
            />

            {/* Overlay Content */}
            <motion.div
                style={{
                    position: 'relative',
                    zIndex: 2,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0 5%',
                    pointerEvents: 'none'
                }}
            >
                {/* Left Text */}
                <motion.div style={{ y: textY, textAlign: 'left' }}>
                    <h2 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(2rem, 4vw, 5rem)',
                        color: '#fff',
                        lineHeight: 0.9,
                        textShadow: '0 0 20px rgba(0,0,0,0.5)'
                    }}>
                        ÉXITO<br />
                        <span style={{ color: '#ff2a6d' }}>PURO</span>
                    </h2>
                    <p style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1rem',
                        color: 'rgba(255,255,255,0.7)',
                        marginTop: '1rem',
                        letterSpacing: '0.1em'
                    }}>
                        // DOMINIO TOTAL
                    </p>
                </motion.div>

                {/* Right Text */}
                <motion.div style={{ y: textY, textAlign: 'right' }}>
                    <h2 style={{
                        fontFamily: 'var(--font-heading)',
                        fontSize: 'clamp(2rem, 4vw, 5rem)',
                        color: '#fff',
                        lineHeight: 0.9,
                        textShadow: '0 0 20px rgba(0,0,0,0.5)'
                    }}>
                        PODER<br />
                        <span style={{ color: 'transparent', WebkitTextStroke: '1px #fff' }}>ABSOLUTO</span>
                    </h2>
                    <p style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1rem',
                        color: 'rgba(255,255,255,0.7)',
                        marginTop: '1rem',
                        letterSpacing: '0.1em'
                    }}>
                        ESTATUS: LEYENDA //
                    </p>
                </motion.div>
            </motion.div>

            {/* Progress Bar */}
            <div style={{
                position: 'absolute',
                bottom: '2rem',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '200px',
                height: '4px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '2px',
                zIndex: 5,
                overflow: 'hidden'
            }}>
                <motion.div
                    style={{
                        width: '100%',
                        height: '100%',
                        background: '#ff2a6d',
                        scaleX: smoothProgress,
                        transformOrigin: 'left'
                    }}
                />
            </div>

            {/* Bottom Gradient */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '20%',
                background: 'linear-gradient(to top, #000 0%, transparent 100%)',
                zIndex: 3
            }} />
        </div>
    );
};

export default CinematicDrinkHero;
