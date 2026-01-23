import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import brainIcon from '../assets/logos/header-brain.png';

const GravityOrb: React.FC = () => {
    // Hooks
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Refs
    const orbRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // State for Dragging Logic (Native Physics)
    const isDraggingRef = useRef(false);
    const dragRec = useRef({
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        initialLeft: 0,
        initialTop: 0
    });

    // Detección Mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // --- 1. LÓGICA DE ARRASTRE NATIVA (MANUAL) ---
    // Inmunidad total al scroll y a Lenis.
    useEffect(() => {
        if (!isMobile || !orbRef.current) return;

        const orb = orbRef.current;

        // Posición Inicial (80vw, 80vh)
        const initialX = window.innerWidth * 0.8 - 32; // -32 por mitad del ancho (64px)
        const initialY = window.innerHeight * 0.8 - 32;

        gsap.set(orb, { x: initialX, y: initialY });
        dragRec.current.currentX = initialX;
        dragRec.current.currentY = initialY;

        const onPointerDown = (e: PointerEvent) => {
            e.stopPropagation();

            isDraggingRef.current = false;
            orb.setPointerCapture(e.pointerId);

            dragRec.current.startX = e.clientX;
            dragRec.current.startY = e.clientY;
            dragRec.current.initialLeft = dragRec.current.currentX;
            dragRec.current.initialTop = dragRec.current.currentY;

            // Feedback visual
            gsap.to(orb, { scale: 0.9, duration: 0.1 });

            window.addEventListener('pointermove', onPointerMove);
            window.addEventListener('pointerup', onPointerUp);
        };

        const onPointerMove = (e: PointerEvent) => {
            const deltaX = e.clientX - dragRec.current.startX;
            const deltaY = e.clientY - dragRec.current.startY;

            if (!isDraggingRef.current && Math.hypot(deltaX, deltaY) > 5) {
                isDraggingRef.current = true;
            }

            if (isDraggingRef.current) {
                const newX = dragRec.current.initialLeft + deltaX;
                const newY = dragRec.current.initialTop + deltaY;

                gsap.set(orb, { x: newX, y: newY });

                dragRec.current.currentX = newX;
                dragRec.current.currentY = newY;
            }
        };

        const onPointerUp = (e: PointerEvent) => {
            orb.releasePointerCapture(e.pointerId);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);

            gsap.to(orb, { scale: 1, duration: 0.2, ease: "back.out(1.7)" });

            // Inercia / Bordes
            const padding = 20;
            let targetX = dragRec.current.currentX;
            let targetY = dragRec.current.currentY;
            let needsSnap = false;

            if (targetX < padding) { targetX = padding; needsSnap = true; }
            if (targetX > window.innerWidth - 64 - padding) { targetX = window.innerWidth - 64 - padding; needsSnap = true; }
            if (targetY < padding) { targetY = padding; needsSnap = true; }
            if (targetY > window.innerHeight - 64 - padding) { targetY = window.innerHeight - 64 - padding; needsSnap = true; }

            if (needsSnap) {
                gsap.to(orb, { x: targetX, y: targetY, duration: 0.4, ease: "power2.out" });
                dragRec.current.currentX = targetX;
                dragRec.current.currentY = targetY;
            }

            setTimeout(() => {
                isDraggingRef.current = false;
            }, 50);
        };

        orb.addEventListener('pointerdown', onPointerDown);
        orb.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

        return () => {
            orb.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
        };
    }, [isMobile]);


    // --- 2. ANIMACIÓN MENÚ ---
    useEffect(() => {
        if (!menuRef.current) return;
        if (isOpen) {
            const tl = gsap.timeline();
            tl.set(menuRef.current, { display: 'flex', autoAlpha: 0 });
            tl.to(menuRef.current, { autoAlpha: 1, duration: 0.4, ease: "power3.out" });
        } else {
            gsap.to(menuRef.current, {
                autoAlpha: 0,
                duration: 0.3,
                ease: "power3.in",
                onComplete: () => { if (menuRef.current) menuRef.current.style.display = 'none'; }
            });
        }
    }, [isOpen]);

    // Handlers
    const handleOrbClick = (e: React.MouseEvent) => {
        if (isDraggingRef.current) {
            e.stopPropagation();
            return;
        }
        e.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleMenuClick = (path: string) => {
        setIsOpen(false);
        navigate(path);
    };

    // --- 3. RENDERIZADO EN PORTAL (UNIVERSAL) ---
    // SC: Eliminamos la restricción isMobile. El Orbe es ahora la interfaz universal.
    return createPortal(
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                top: 0, left: 0, width: '100vw', height: '100vh',
                zIndex: 99999,
                pointerEvents: 'none',
                overflow: 'hidden'
            }}
        >
            {/* OVERLAY MENÚ - NEURAL INDEX (Responsive Fit) */}
            <div
                ref={menuRef}
                className="orb-menu-overlay"
                data-lenis-prevent="true"
                style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(5, 5, 5, 0.96)',
                    backdropFilter: 'blur(20px)',
                    display: 'none', opacity: 0,
                    zIndex: 99998,
                    pointerEvents: 'auto',
                    // SC: Usamos Flex Column con 'justify-content: space-between' para distribuir espacio verticalmente
                    // y garantizar que nada se salga del viewport.
                    flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
                    padding: '2rem 1rem 3rem 1rem', // Padding seguro
                    fontFamily: 'var(--font-mono)',
                    boxSizing: 'border-box' // CRÍTICO para que el padding no rompa el 100% height
                }}
            >
                {/* 1. TOP: STATUS BAR */}
                <div style={{ width: '100%', textAlign: 'center', opacity: 0.5, letterSpacing: '0.2em', fontSize: '0.7rem', flexShrink: 0 }}>
                    AGENCIA SYSTEM // ONLINE
                </div>

                {/* 2. MIDDLE: NAVIGATION LIST (Compact) */}
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
                    justifyContent: 'center',
                    gap: isMobile ? '0.8rem' : '1.5rem', // Menos gap en móvil 
                    width: 'min(90%, 600px)',
                    flexGrow: 1 // Ocupa el espacio disponible central
                }}>
                    {[
                        { idx: '00', label: 'MANIFIESTO', path: '/' },
                        { idx: '01', label: 'ESENCIA', path: '/esencia' },
                        { idx: '02', label: 'INFRAESTRUCTURA', path: '/infraestructura' },
                        { idx: '03', label: 'AUTOMATIZACIÓN', path: '/automatizacion' },
                        { idx: '04', label: 'IDENTIDAD', path: '/identidad' },
                        { idx: '05', label: 'PLAYGROUND', path: '/playground' },
                        { idx: '06', label: 'CONTACTO', path: '/contacto' }
                    ].map((item) => (
                        <button
                            key={item.path}
                            onClick={() => handleMenuClick(item.path)}
                            className="menu-item-glitch"
                            style={{
                                background: 'none', border: 'none',
                                color: location.pathname === item.path ? '#00FF99' : '#FFFFFF',
                                fontFamily: 'var(--font-heading)',
                                // SC: Switch to VW units to ensure fit on narrow screens.
                                fontSize: 'clamp(1.2rem, 7.5vw, 2.5rem)',
                                fontWeight: 800,
                                letterSpacing: '-0.02em',
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                                textAlign: 'left',
                                width: '100%',
                                display: 'flex', alignItems: 'baseline', gap: '0.8rem',
                                transition: 'all 0.3s ease',
                                flexShrink: 1 // Permitir que se encojan si la pantalla es muy pequeña verticalmente
                            }}
                            onMouseEnter={(e) => {
                                gsap.to(e.currentTarget, { paddingLeft: '20px', color: '#00FF99', duration: 0.3 });
                            }}
                            onMouseLeave={(e) => {
                                if (location.pathname !== item.path) {
                                    gsap.to(e.currentTarget, { paddingLeft: '0px', color: '#FFFFFF', duration: 0.3 });
                                }
                            }}
                        >
                            <span style={{ fontSize: '0.4em', opacity: 0.5, fontFamily: 'var(--font-mono)' }}>{item.idx} //</span>
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* 3. BOTTOM: CONTROLS & FOOTER */}
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem',
                    flexShrink: 0 // No dejar que esto desaparezca
                }}>
                    {/* TECH FOOTER INSTRUCTION */}
                    <div style={{
                        fontFamily: 'monospace', fontSize: '0.65rem', color: '#00FF99',
                        opacity: 0.8, letterSpacing: '0.1em',
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        textAlign: 'center'
                    }}>
                        <span style={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: '#00FF99', borderRadius: '50%', animation: 'pulse 2s infinite' }}></span>
                        // MENÚ MODO FLUIDO: ARRASTRAR PARA MOVER
                    </div>
                </div>

                <style>{`
                    @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1); } }
                `}</style>
            </div>

            {/* ORBE - DESIGN CONCEPT 2: THE CHROMATIC LENS (High Visibility Tune) */}
            <div
                ref={orbRef}
                className="gravity-orb-btn"
                onClick={handleOrbClick}
                data-lenis-prevent="true"
                style={{
                    position: 'absolute',
                    top: 0, left: 0,
                    width: '64px', height: '64px',
                    borderRadius: '50%',

                    // --- GLASSMORPHISM CORE ---
                    // SC: Base más oscura (gris nulo) para que el blanco del cerebro resalte más + contraste con fondo blanco
                    backgroundColor: 'rgba(20, 20, 20, 0.12)',
                    backdropFilter: 'blur(10px) saturate(150%)',
                    WebkitBackdropFilter: 'blur(10px) saturate(150%)',

                    // --- VOLUME & LIGHTING ---
                    // Sombras ajustadas para definir el contorno del cristal en fondo blanco
                    boxShadow: `
                        inset 0 0 15px rgba(255, 255, 255, 0.15), 
                        inset 1px 1px 2px rgba(255, 255, 255, 0.4),
                        0 8px 32px rgba(0, 0, 0, 0.25),
                        0 0 0 1px rgba(0,0,0,0.05)
                    `,
                    border: '1px solid rgba(255, 255, 255, 0.2)',

                    zIndex: 99999,
                    cursor: 'grab',
                    pointerEvents: 'auto',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    touchAction: 'none'
                }}
            >
                {/* --- CHROMATIC SHINE --- */}
                <div style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 45%)',
                    pointerEvents: 'none',
                    mixBlendMode: 'overlay'
                }} />

                {/* --- LOGO CEREBRO REAL (PNG) --- */}
                {/* ESTRATEGIA: "CONTRASTE FORZADO" sin mix-blend-mode */}
                {/* Usamos el icono BLANCO, pero con una sombra NEGRA dura detrás. */}
                {/* Esto crea un contorno natural que funciona en Blanco (se ve la sombra) y Negro (se ve la luz/relleno blanco). */}
                <img
                    src={brainIcon}
                    alt="Gravity Orb"
                    style={{
                        width: '60%',
                        height: 'auto',
                        objectFit: 'contain',
                        pointerEvents: 'none',
                        // SC: Filtro de seguridad para contraste máximo "Sticker-like"
                        // 1. Brightness 1.5: Hacerlo blanco brillante.
                        // 2. Drop-shadow negro pequeño y duro (outline) de 1px.
                        // 3. Drop-shadow negro mediano y suave (profundidad).
                        filter: 'brightness(1.5) drop-shadow(0 1px 2px rgba(0,0,0,0.9)) drop-shadow(0 0 15px rgba(0,0,0,0.3))',
                        opacity: 1
                    }}
                />
            </div>
        </div>,
        document.body
    );
};

export default GravityOrb;
