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

    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        empresa: '',
        detalles: '',
        'bot-field': ''
    });
    const [status, setStatus] = useState<'IDLE' | 'SENDING' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio.';
        if (!formData.email.trim()) {
            newErrors.email = 'El correo electrónico es obligatorio.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Ingresa un correo electrónico válido.';
        }
        if (!formData.empresa.trim()) newErrors.empresa = 'El nombre de la empresa es obligatorio.';
        if (!formData.detalles.trim()) newErrors.detalles = 'Por favor, describe los detalles de tu proyecto.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setStatus('SENDING');

        try {
            const encodedData = new URLSearchParams({
                'form-name': 'contacto',
                subject: 'Nuevo proyecto desde agenciamx.app',
                recipient: 'proyectos@agenciamx.app',
                nombre: formData.nombre.trim(),
                email: formData.email.trim(),
                empresa: formData.empresa.trim(),
                detalles: formData.detalles.trim(),
                origen: typeof window !== 'undefined' ? window.location.href : 'https://agenciamx.app/contacto',
                timestamp: new Date().toISOString(),
                'bot-field': formData['bot-field']
            }).toString();

            const response = await fetch('/contacto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: encodedData
            });

            if (response.ok) {
                setStatus('SUCCESS');
                setFormData({ nombre: '', email: '', empresa: '', detalles: '', 'bot-field': '' });
                setErrors({});
            } else {
                setStatus('ERROR');
            }
        } catch (err) {
            console.error(err);
            setStatus('ERROR');
        }
    };

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
                title="Contacto para proyectos de IA, web y automatización"
                description="Agenda una conversación con AgencIA para desarrollar tu sitio, app, automatización con IA, sistema digital o estrategia de crecimiento."
                keywords="contacto agencia IA, cotizar desarrollo web, cotizar automatización con IA, agencia digital México"
                url="https://agenciamx.app/contacto"
                canonical="https://agenciamx.app/contacto"
            />
            <StructuredData data={{
                "@context": "https://schema.org",
                "@type": "ContactPage",
                "name": "Contacto AgencIA",
                "url": "https://agenciamx.app/contacto",
                "description": "Formulario de contacto para proyectos de desarrollo web, automatización con IA, sistemas digitales e identidad premium.",
                "publisher": {
                    "@type": "Organization",
                    "name": "AgencIA",
                    "url": "https://agenciamx.app/",
                    "email": "proyectos@agenciamx.app"
                }
            }} />
            {/* Vortex Background - Exclusive */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: isMobile ? 'none' : 'auto' }}>
                <Canvas
                    camera={{ position: [0, 0, isMobile ? 14 : 8], fov: 45 }}
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
                    padding: isMobile ? '2rem 1.5rem' : '2.5rem 3rem',
                    width: '95%',
                    maxWidth: '520px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    zIndex: 10,
                    gap: '1.5rem',
                    background: 'rgba(5, 5, 5, 0.75)', // Glassmorphism B2B dark
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 0 60px rgba(0,0,0,0.6)'
                }}
            >
                {status === 'SUCCESS' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2rem 0', width: '100%' }}>
                        <div style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            background: 'rgba(0, 255, 153, 0.1)',
                            border: '2px solid #00FF99',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '1.5rem',
                            color: '#00FF99',
                            fontSize: '2rem'
                        }}>
                            ✓
                        </div>
                        <h3 style={{ fontSize: '1.6rem', color: '#fff', marginBottom: '0.8rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>¡ENVIADO CON ÉXITO!</h3>
                        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', lineHeight: '1.6', maxWidth: '360px', marginBottom: '1.5rem' }}>
                            Tu mensaje ha sido capturado. Nuestro equipo B2B analizará la viabilidad tecnológica del proyecto y te responderá en breve.
                        </p>
                        <button onClick={() => setStatus('IDLE')} style={{
                            padding: '0.8rem 1.8rem',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            color: '#fff',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            letterSpacing: '0.05em',
                            transition: 'all 0.3s ease'
                        }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                            }}
                        >
                            ENVIAR OTRA SOLICITUD
                        </button>
                    </div>
                ) : (
                    <>
                        <div style={{ textAlign: 'center', width: '100%', marginBottom: '0.5rem' }}>
                            <h2 style={{ color: 'white', fontSize: '2rem', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>CONTACTO</h2>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Hablemos sobre tu infraestructura y objetivos B2B.</p>
                        </div>

                        <form 
                            name="contacto" 
                            method="POST" 
                            data-netlify="true" 
                            onSubmit={handleSubmit}
                            style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}
                        >
                            <input type="hidden" name="form-name" value="contacto" />
                            
                            {/* Honeypot field for Netlify Forms spam prevention */}
                            <div style={{ display: 'none' }}>
                                <label>
                                    Don't fill this out if you're human:{" "}
                                    <input 
                                        name="bot-field" 
                                        value={formData['bot-field']} 
                                        onChange={e => setFormData({ ...formData, 'bot-field': e.target.value })} 
                                    />
                                </label>
                            </div>
                            
                            {/* Nombre */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%' }}>
                                <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>Nombre Completo</label>
                                <input 
                                    type="text" 
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                    placeholder="Ej. Alexander Pierce"
                                    required
                                    style={{
                                        width: '100%',
                                        backgroundColor: 'rgba(255,255,255,0.03)',
                                        border: errors.nombre ? '1px solid #EF4444' : '1px solid rgba(255,255,255,0.12)',
                                        borderRadius: '12px',
                                        padding: '0.75rem 1rem',
                                        color: '#fff',
                                        fontSize: '0.85rem',
                                        outline: 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onFocus={e => e.currentTarget.style.borderColor = '#00f3ff'}
                                    onBlur={e => e.currentTarget.style.borderColor = errors.nombre ? '#EF4444' : 'rgba(255,255,255,0.12)'}
                                />
                                {errors.nombre && <span style={{ fontSize: '10px', color: '#F87171', fontFamily: 'var(--font-mono)' }}>{errors.nombre}</span>}
                            </div>

                            {/* Email */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%' }}>
                                <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>Correo Corporativo</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="ejemplo@empresa.com"
                                    required
                                    style={{
                                        width: '100%',
                                        backgroundColor: 'rgba(255,255,255,0.03)',
                                        border: errors.email ? '1px solid #EF4444' : '1px solid rgba(255,255,255,0.12)',
                                        borderRadius: '12px',
                                        padding: '0.75rem 1rem',
                                        color: '#fff',
                                        fontSize: '0.85rem',
                                        outline: 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onFocus={e => e.currentTarget.style.borderColor = '#00f3ff'}
                                    onBlur={e => e.currentTarget.style.borderColor = errors.email ? '#EF4444' : 'rgba(255,255,255,0.12)'}
                                />
                                {errors.email && <span style={{ fontSize: '10px', color: '#F87171', fontFamily: 'var(--font-mono)' }}>{errors.email}</span>}
                            </div>

                            {/* Empresa */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%' }}>
                                <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>Nombre de la Empresa</label>
                                <input 
                                    type="text" 
                                    name="empresa"
                                    value={formData.empresa}
                                    onChange={e => setFormData({ ...formData, empresa: e.target.value })}
                                    placeholder="Ej. Stripe Inc."
                                    required
                                    style={{
                                        width: '100%',
                                        backgroundColor: 'rgba(255,255,255,0.03)',
                                        border: errors.empresa ? '1px solid #EF4444' : '1px solid rgba(255,255,255,0.12)',
                                        borderRadius: '12px',
                                        padding: '0.75rem 1rem',
                                        color: '#fff',
                                        fontSize: '0.85rem',
                                        outline: 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onFocus={e => e.currentTarget.style.borderColor = '#00f3ff'}
                                    onBlur={e => e.currentTarget.style.borderColor = errors.empresa ? '#EF4444' : 'rgba(255,255,255,0.12)'}
                                />
                                {errors.empresa && <span style={{ fontSize: '10px', color: '#F87171', fontFamily: 'var(--font-mono)' }}>{errors.empresa}</span>}
                            </div>

                            {/* Detalles */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%' }}>
                                <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>Detalles del Proyecto</label>
                                <textarea 
                                    name="detalles"
                                    rows={4}
                                    value={formData.detalles}
                                    onChange={e => setFormData({ ...formData, detalles: e.target.value })}
                                    placeholder="Cuéntanos sobre tus objetivos de automatización o digitalización..."
                                    required
                                    style={{
                                        width: '100%',
                                        backgroundColor: 'rgba(255,255,255,0.03)',
                                        border: errors.detalles ? '1px solid #EF4444' : '1px solid rgba(255,255,255,0.12)',
                                        borderRadius: '12px',
                                        padding: '0.75rem 1rem',
                                        color: '#fff',
                                        fontSize: '0.85rem',
                                        outline: 'none',
                                        resize: 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onFocus={e => e.currentTarget.style.borderColor = '#00f3ff'}
                                    onBlur={e => e.currentTarget.style.borderColor = errors.detalles ? '#EF4444' : 'rgba(255,255,255,0.12)'}
                                />
                                {errors.detalles && <span style={{ fontSize: '10px', color: '#F87171', fontFamily: 'var(--font-mono)' }}>{errors.detalles}</span>}
                            </div>

                            {status === 'ERROR' && (
                                <div style={{ fontSize: '0.75rem', color: '#F87171', fontFamily: 'var(--font-mono)', textAlign: 'center', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.5rem', borderRadius: '8px' }}>
                                    Error de red o campos inválidos. Por favor, intenta de nuevo.
                                </div>
                            )}

                            <button 
                                type="submit" 
                                disabled={status === 'SENDING'}
                                style={{
                                    marginTop: '0.5rem',
                                    padding: '1rem 2rem',
                                    background: 'white',
                                    color: 'black',
                                    border: 'none',
                                    borderRadius: '50px',
                                    fontWeight: 'bold',
                                    fontSize: '0.85rem',
                                    cursor: status === 'SENDING' ? 'not-allowed' : 'pointer',
                                    width: '100%',
                                    transition: 'all 0.3s ease',
                                    opacity: status === 'SENDING' ? 0.7 : 1,
                                    letterSpacing: '0.08em'
                                }}
                                onMouseEnter={e => {
                                    if (status !== 'SENDING') e.currentTarget.style.transform = 'scale(1.02)';
                                }}
                                onMouseLeave={e => {
                                    if (status !== 'SENDING') e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                {status === 'SENDING' ? 'ENVIANDO PROTOCOLO...' : 'INICIAR CONVERSACIÓN'}
                            </button>
                        </form>
                    </>
                )}
            </div>

            {/* Interaction Guide Overlay */}
            <InteractionGuide
                items={isMobile ? [
                    { type: 'scroll', text: 'DESLIZAR PARA EXPLORAR' }
                ] : [
                    { type: 'drag', text: 'SELECCIONA Y ARRASTRA EL VÓRTICE' }
                ]}
                style={{ bottom: '2rem' }}
            />
        </div>
    );
};

export default Contacto;
