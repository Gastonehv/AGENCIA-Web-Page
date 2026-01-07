import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLocation } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const QuantumDepthMeter: React.FC = () => {
    const stripRef = useRef<HTMLDivElement>(null);
    const [progressLabel, setProgressLabel] = useState('000');
    const { pathname } = useLocation();

    useEffect(() => {
        // Force refresh ScrollTrigger to pick up new page height
        ScrollTrigger.refresh();

        const trigger = ScrollTrigger.create({
            trigger: document.body,
            start: 0,
            end: "max",
            onUpdate: (self) => {
                const p = Math.floor(self.progress * 100);
                const label = p.toString().padStart(3, '0');
                setProgressLabel(label);

                if (stripRef.current) {
                    gsap.to(stripRef.current, {
                        y: -p * 40,
                        duration: 0.3, // Snappier response
                        ease: "power2.out",
                        overwrite: "auto"
                    });
                }
            }
        });

        return () => trigger.kill();
    }, [pathname]); // RE-RUN ON ROUTE CHANGE

    // Generate numbers from 000 to 100
    const numbers = Array.from({ length: 101 }, (_, i) => i.toString().padStart(3, '0'));

    return (
        <div
            className="quantum-depth-meter"
            style={{
                position: 'fixed',
                left: '20px',
                bottom: '20px',
                zIndex: 2000,
                display: 'flex',
                alignItems: 'flex-end',
                gap: '12px',
                pointerEvents: 'none'
            }}
        >
            {/* ODOMETER WINDOW */}
            <div style={{
                width: '60px',
                height: '40px',
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                backdropFilter: 'blur(15px)',
                WebkitBackdropFilter: 'blur(15px)',
                border: '1px solid rgba(0, 255, 153, 0.4)', // GREEN (Version Update)
                borderRadius: '2px',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 255, 153, 0.2)'
            }}>
                {/* VERTICAL STRIP */}
                <div
                    ref={stripRef}
                    style={{
                        position: 'absolute',
                        top: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%'
                    }}
                >
                    {numbers.map((num) => (
                        <div
                            key={num}
                            style={{
                                height: '40px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '1.2rem',
                                color: progressLabel === num ? '#00FF99' : '#888', // GREEN
                                fontWeight: progressLabel === num ? 900 : 400,
                                opacity: progressLabel === num ? 1 : 0.1,
                                transition: 'all 0.3s ease',
                                textShadow: progressLabel === num ? '0 0 10px rgba(0, 255, 153, 0.6)' : 'none'
                            }}
                        >
                            {num}
                        </div>
                    ))}
                </div>
            </div>

            {/* SIDE LABELS / DECORATION (HUD FEEL) */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                paddingBottom: '5px'
            }}>
                <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.65rem',
                    color: '#00FF99', // GREEN
                    letterSpacing: '0.2em',
                    fontWeight: 900,
                    opacity: 0.8
                }}>
                    MEDIDOR.EXE
                </div>
                <div style={{
                    width: '30px',
                    height: '1px',
                    background: 'linear-gradient(to right, #00FF99, transparent)', // GREEN
                    opacity: 0.5
                }} />
            </div>

            <style>{`
                .quantum-depth-meter {
                    pointer-events: none;
                    animation: meterAppear 1s ease-out;
                }
                @keyframes meterAppear {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </div>
    );
};

export default QuantumDepthMeter;
