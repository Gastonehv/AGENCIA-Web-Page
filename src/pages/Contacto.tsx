import React, { useEffect, useRef, Suspense, useState } from 'react';
import gsap from 'gsap';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import Vortex from '../components/Vortex';
import InteractionGuide from '../components/InteractionGuide';
import SEO from '../components/SEO';
import StructuredData from '../components/StructuredData';

// Mobile detection hook - detects immediately on first render
const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia('(max-width: 768px)').matches;
        }
        return false;
    });

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);

        // Sync check
        if (isMobile !== mediaQuery.matches) {
            Promise.resolve().then(() => {
                setIsMobile(mediaQuery.matches);
            });
        }

        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, [isMobile]);

    return isMobile;
};

const Contacto: React.FC = () => {
    const isMobile = useIsMobile();
    const containerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(formRef.current, {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                delay: 0.5 // Delay pequeño para permitir carga
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                minHeight: '100vh', // Full viewport
                position: 'relative',
                overflow: 'hidden',
                padding: '0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: '#000', // Exclusive black background
                color: '#fff',
                zIndex: 5
            }}
        >
            <SEO
                title="Contacto"
                description="Conéctate con el futuro. Hablemos de cómo la IA puede transformar tu marca."
            />
            <StructuredData data={{
                "@context": "https://schema.org",
                "@type": "ContactPage",
                "name": "Contacto AgencIA",
                "publisher": {
                    "@type": "Organization",
                    "name": "AgencIA"
                }
            }} />
            {/* Vortex Background - Exclusive */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: isMobile ? 'none' : 'auto' }}>
                <Canvas
                    camera={{ position: [0, 0, 8], fov: 45 }}
                    style={{ pointerEvents: isMobile ? 'none' : 'auto' }}
                >
                    <Suspense fallback={null}>
                        <Vortex />
                        <Environment preset="city" />
                    </Suspense>
                    {/* Disable OrbitControls on mobile to allow scrolling */}
                    {!isMobile && (
                        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
                    )}
                </Canvas>
            </div>

            {/* Form Container */}
            <div
                ref={formRef}
                style={{
                    padding: '3rem',
                    width: '90%',
                    maxWidth: '500px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    zIndex: 10,
                    gap: '2rem',
                    background: 'rgba(5, 5, 5, 0.6)', // Glassmorphism darker
                    backdropFilter: 'blur(15px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 0 50px rgba(0,0,0,0.5)'
                }}
            >
                <h2 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)' }}>CONTACTO</h2>
                <p style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center' }}>¿Listo para la Singularidad?</p>

                {/* Placeholder de Formulario */}
                <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.1)', margin: '1rem 0' }} />

                <button style={{
                    padding: '1rem 2rem',
                    background: 'white',
                    color: 'black',
                    border: 'none',
                    borderRadius: '50px',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    width: '100%',
                    transition: 'transform 0.2s',
                }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    INICIAR CONVERSACIÓN
                </button>
            </div>

            {/* Interaction Guide Overlay */}
            <InteractionGuide
                items={[
                    { type: 'drag', text: 'SELECCIONA Y ARRASTRA EL VÓRTICE' }
                ]}
                style={{ bottom: '2rem' }}
            />
        </div>
    );
};

export default Contacto;
