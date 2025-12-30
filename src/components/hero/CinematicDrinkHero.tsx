import React, { useRef, useEffect, useState } from 'react';
import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import lataVideo from '../../assets/videos/Lata AGENCIA.mp4';

gsap.registerPlugin(ScrollTrigger);

const CinematicDrinkHero: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    const smoothProgress = useSpring(0, { damping: 40, stiffness: 300 });

    useEffect(() => {
        const container = containerRef.current;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!container || !video || !canvas) return;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            draw();
        };

        const draw = () => {
            if (video.readyState < 2) return;
            const cw = canvas.width;
            const ch = canvas.height;
            const vw = video.videoWidth;
            const vh = video.videoHeight;
            if (!vw || !vh) return;

            const sc = Math.max(cw / vw, ch / vh);
            const x = (cw - vw * sc) / 2;
            const y = (ch - vh * sc) / 2;
            ctx.drawImage(video, x, y, vw * sc, vh * sc);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        // 1. Spring-driven video scrubbing (THE SECRET FOR SILK-SMOOTH)
        const unsubscribe = smoothProgress.on("change", (v) => {
            if (video.duration) {
                video.currentTime = v * video.duration;
            }
            setProgress(v); // Sync visual progress with smooth value
        });

        const ctxGSAP = gsap.context(() => {
            ScrollTrigger.create({
                trigger: container,
                start: "top top",
                end: "+=400%", // Slightly longer for better control
                pin: true,
                scrub: 0.5, // Subtle scrub on the trigger itself
                anticipatePin: 1,
                onUpdate: (self) => {
                    smoothProgress.set(self.progress);
                },
                onRefresh: handleResize,
                id: 'lata-main'
            });
        });

        // 2. GSAP Ticker for ultra-stable frame syncing
        const tick = () => draw();
        gsap.ticker.add(tick);

        video.src = lataVideo;
        video.muted = true;
        video.setAttribute('muted', 'true');
        video.setAttribute('playsinline', 'true');
        video.load();

        const onReady = () => {
            setIsLoading(false);
            handleResize();
            video.play().then(() => {
                video.pause();
                ScrollTrigger.refresh();
            }).catch(() => ScrollTrigger.refresh());
        };

        video.addEventListener('canplaythrough', onReady, { once: true });
        const fallbackId = setTimeout(onReady, 3500);

        return () => {
            ctxGSAP.revert();
            unsubscribe();
            gsap.ticker.remove(tick);
            window.removeEventListener('resize', handleResize);
            clearTimeout(fallbackId);
        };
    }, [smoothProgress]);

    const textY = useTransform(smoothProgress, [0, 1], ["0%", "-40%"]);
    const scaleTransform = useTransform(smoothProgress, [0, 0.5, 1], [1, 1.15, 1.1]);

    return (
        <div
            ref={containerRef}
            style={{
                height: '100vh',
                width: '100%',
                background: '#000',
                position: 'relative',
                overflow: 'hidden',
                zIndex: 20
            }}
        >
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        exit={{ opacity: 0 }}
                        style={{ position: 'absolute', inset: 0, background: '#000', zIndex: 30, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                        <div style={{ width: '40px', height: '40px', border: '2px solid #ff2a6d', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', scale: scaleTransform, zIndex: 1 }} />
            <video ref={videoRef} style={{ display: 'none' }} />

            <motion.div
                style={{
                    position: 'absolute', inset: 0, zIndex: 2, display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', padding: '0 8%', pointerEvents: 'none', y: textY
                }}
            >
                <div>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 6vw, 7rem)', lineHeight: 0.8, color: '#fff' }}>
                        ÉXITO<br /><span style={{ color: '#ff2a6d' }}>PURO</span>
                    </h2>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 6vw, 7rem)', lineHeight: 0.8, color: '#fff' }}>
                        PODER<br /><span style={{ color: 'transparent', WebkitTextStroke: '1px #fff' }}>ABSOLUTO</span>
                    </h2>
                </div>
            </motion.div>

            <div style={{ position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)', width: '250px', height: '1px', background: 'rgba(255,255,255,0.1)', zIndex: 5 }}>
                <motion.div style={{ width: '100%', height: '100%', background: '#ff2a6d', scaleX: progress, transformOrigin: 'left' }} />
            </div>
        </div>
    );

};

export default CinematicDrinkHero;
