import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Loader from '../components/Loader';
import { useScroll } from '../context/ScrollContext';
import EssenceBackground from '../components/EssenceBackground';
import SoulManifesto from '../components/SoulManifesto';
import ShowcaseSlider from '../components/ShowcaseSlider';
import Symbiosis from '../components/Symbiosis';
import Footer from '../components/Footer';
import AlmaSection from '../components/AlmaSection';
import GlitchPortal from '../components/GlitchPortal';
import type { GlitchPortalHandle } from '../components/GlitchPortal';
import SEO from '../components/SEO';
import StructuredData from '../components/StructuredData';
import ChapterHUD from '../components/ChapterHUD';
// --- RECURSOS (Desde Esencia) ---
import essenceHeroVideo from '../assets/videos/esencia_hero_ultra.mp4';
const videoSrc = essenceHeroVideo;
import officialTypography from '../assets/logos/agencia_typography_official.png';
import ceoImg from '../assets/team/ceo.jpg';
import gaelImg from '../assets/team/gael_oracle.png';
import footerLogo from '../assets/logo_agencia_full.png';


gsap.registerPlugin(ScrollTrigger);

const Home: React.FC = () => {
    // SALTAR LOADER SI SE REGRESA (Hash detectado)
    const { hash } = useLocation();
    const [loading, setLoading] = useState(!hash); // Si hay hash, loading = false
    const { lenis } = useScroll();
    // ESTADO DEL HUD DE CAPÍTULOS
    const [activeChapter, setActiveChapter] = useState('ESENCIA');
    const [chapterNum, setChapterNum] = useState('1');
    const maskGroupRef = useRef<SVGSVGElement>(null); // Ref actualizada de CinematicDev
    const bgRef = useRef<HTMLDivElement>(null); // Ref fondo CinematicDev
    const redLayerRef = useRef<HTMLDivElement>(null); // Ref roja CinematicDev
    const windowRef = useRef<HTMLDivElement>(null); // Ref ventana CinematicDev
    const containerRef = useRef<HTMLDivElement>(null);
    const pulseButtonRef = useRef<HTMLButtonElement>(null);
    const ctaSectionRef = useRef<HTMLElement>(null); // Nueva referencia para seguridad del Pin
    const glitchRef = useRef<GlitchPortalHandle>(null);

    // Estado de scroll para redes neuronales (anteriormente Esencia)

    // DATOS DEL EQUIPO
    const team = [
        { id: 1, role: 'CEO / VISIONARY', name: 'Arquitecto de Ecosistemas Digitales', img: ceoImg, scale: 1.35 },
        { id: 2, role: 'CTO /\nAI LEAD', name: 'Oráculo\nde Datos', img: gaelImg, scale: 1.6 },
        { id: 3, role: 'LEAD DEVELOPER', name: 'Tejedor de Código', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop', scale: 1.35 },
        { id: 4, role: 'UX/UI DIRECTOR', name: 'Escultor de Interfaces', img: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=1000&auto=format&fit=crop', scale: 1.35 },
    ];

    // RUTAS DEL LOGOTIPO (Para la máscara del portal de la N)
    const logoPaths = [
        "449.17,2442.5 90.53,2442.5 1043.39,157.04 1992.73,2442.5 1637.6,2442.5 1043.39,1025.52", // A
        "M3825.9 519.19c-206.28,0 -382.09,76.19 -527.41,228.55 -145.34,152.36 -218,335.2 -218,548.51 0,215.66 72.66,400.84 218,555.54 145.33,154.71 321.13,232.07 527.41,232.07 119.54,0 234.99,-30.47 346.33,-91.43 111.35,-60.95 203.35,-145.33 276.01,-253.15l80.88 -116.04 -397.32 -348.09 235.58 -270.75 559.06 488.74c-77.35,285.97 -216.24,515.7 -416.65,689.15 -200.42,173.46 -428.37,260.2 -683.87,260.2 -304.74,0 -564.92,-111.93 -780.58,-335.79 -215.66,-223.86 -323.48,-494.01 -323.48,-810.46 0,-314.11 107.82,-582.5 323.48,-805.18 215.66,-222.69 475.84,-334.03 780.58,-334.03 215.65,0 416.07,59.78 601.25,179.32l-242.61 274.26c-107.82,-60.95 -227.38,-91.43 -358.64,-91.43z", // G
        "6253.29,515.69 6253.29,1120.45 6995.18,1120.45 6995.18,1479.09 6253.29,1479.09 6253.29,2083.86 7297.56,2083.86 7297.56,2442.5 5894.64,2442.5 5894.64,157.04 7297.56,157.04 7297.56,515.69", // E
        "9999.2,2438.98 8687.7,1074.74 8687.7,2442.5 8329.06,2442.5 8329.06,157.04 9640.56,1531.83 9640.56,157.04 9999.2,157.04", // N
        "M12138.27 519.19c-206.28,0 -382.09,76.19 -527.41,228.55 -145.34,152.36 -218,335.2 -218,548.51 0,218 72.66,403.77 218,557.3 145.33,153.54 321.13,230.31 527.41,230.31 128.92,0 248.47,-31.65 358.64,-94.93l242.61 274.25c-180.5,119.54 -380.91,179.32 -601.25,179.32 -304.74,0 -564.92,-111.34 -780.58,-334.03 -215.66,-222.69 -323.48,-491.08 -323.48,-805.18 0,-316.44 107.82,-586.6 323.48,-810.46 215.66,-223.86 475.84,-335.79 780.58,-335.79 220.34,0 420.75,59.78 601.25,179.32l-242.61 277.77c-105.48,-63.28 -225.03,-94.93 -358.64,-94.93z", // C
        "13718.27,2442.5 13718.27,157.04 14076.92,157.04 14076.92,2442.5", // I
        "15375.63,2442.5 15016.99,2442.5 15969.85,157.04 16919.2,2442.5 16564.07,2442.5 15969.85,1025.52" // A
    ];

    const handleLoaderComplete = React.useCallback(() => {
        setLoading(false);
    }, []);

    // LÓGICA DE ANIMACIÓN
    useEffect(() => {
        // Forzar el bloqueo de scroll durante el Loader
        if (loading) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            document.body.classList.add('loading'); // AÑADIR CLASE
            if (lenis) lenis.stop();
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            document.body.classList.remove('loading'); // QUITAR CLASE

            // LÓGICA DE NAVEGACIÓN POR HASH
            if (hash && lenis) {
                lenis.start();
                // Refresco forzado para asegurar que el layout sea correcto antes de scrollear
                ScrollTrigger.refresh();

                // Use a single robust scroll call with onComplete
                // Delay slightly to ensure browser paint
                gsap.delayedCall(0.1, () => {
                    lenis.scrollTo(hash, {
                        offset: 0,
                        duration: 1.5,
                        force: true,
                        onComplete: () => ScrollTrigger.refresh()
                    });
                });
            } else if (lenis) {
                // Carga normal (Sin Hash) -> Iniciar y Resetear
                lenis.start();
                lenis.scrollTo(0, { immediate: true });
            }
        }

        if (!loading && maskGroupRef.current) {
            // Reset nativo solo si no se apunta a un hash
            if (!hash) window.scrollTo(0, 0);

            const ctx = gsap.context(() => {
                // Animación Cycler de Fondo Celeste (Desde CinematicDev)
                gsap.to(bgRef.current, {
                    backgroundColor: '#89CFF0',
                    duration: 2,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    keyframes: [
                        { backgroundColor: '#A7C7E7', duration: 2 },
                        { backgroundColor: '#B0E0E6', duration: 2 },
                        { backgroundColor: '#89CFF0', duration: 2 },
                        { backgroundColor: '#ADD8E6', duration: 2 }
                    ]
                });

                // --- 1. ANIMACIÓN DE ZOOM DEL PORTAL (SCROLL) ---
                const tlZoom = gsap.timeline({
                    scrollTrigger: {
                        trigger: '.cinematic-content', // Solo el cap 1
                        start: 'top top',
                        end: '+=600%', // Duración moderada para el Hero Cinematic
                        scrub: 1,
                        pin: true,
                        anticipatePin: 1
                    }
                });

                // 1. Zoom Infinito de la Máscara
                tlZoom.to(maskGroupRef.current, {
                    scale: 150, // Crecimiento masivo para "atravesar"
                    transformOrigin: "53.8% 50.1%",
                    ease: "power2.inOut",
                    duration: 1
                });

                // 2. Desvanecimiento de la Capa Roja
                tlZoom.to(redLayerRef.current, {
                    autoAlpha: 0,
                    ease: "power1.out",
                    duration: 0.6
                }, "<");

                // 3. Aparición/Acercamiento de la Ventana
                tlZoom.fromTo(windowRef.current,
                    { scale: 0.4 },
                    { scale: 0.8, duration: 1, ease: "power2.inOut" },
                    "<"
                );

                // 4. Secuencia de TEXTO (NUESTRA -> ESENCIA)
                tlZoom.to('.text-nuestra', {
                    autoAlpha: 1, y: 0,
                    duration: 0.8, ease: "power2.out"
                }, "-=0.4");

                tlZoom.to('.text-esencia', {
                    autoAlpha: 1, scale: 1, filter: 'blur(0px)',
                    duration: 1, ease: "power2.out"
                }, ">-0.6");

                // 5. TRANSFORMACIÓN: "NUESTRA ESENCIA" -> "NUESTRA IA"
                // "ESENC" se desvanece lentamente
                tlZoom.to('.word-esenc', {
                    width: 0,
                    opacity: 0,
                    filter: 'blur(20px)',
                    duration: 1.5,
                    ease: "power2.inOut"
                }, ">+0.5"); // Pequeña pausa para leer "ESENCIA" completo antes de borrarlo

                tlZoom.to('.hero-char-ia', {
                    color: '#00FF99',
                    textShadow: 'none',
                    WebkitTextStroke: '0px',
                    scale: 1.15,
                    duration: 1.5,
                    ease: "power2.out"
                }, "<");

                // Desaparecer la red neuronal / capa de esencia de fondo (Como en original)
                tlZoom.to(".essence-fixed-wrapper", {
                    opacity: 0,
                    autoAlpha: 0,
                    duration: 1,
                    ease: 'power1.in'
                }, "<");

                // ALINEACIÓN "NUESTRA" con "IA"
                tlZoom.to('.text-nuestra', {
                    y: '0%',
                    x: '0%',
                    scale: 1.05,
                    duration: 1.5,
                    ease: "power2.inOut"
                }, "<");

                tlZoom.to({}, { duration: 1.5 }); // Pausa asimilación

                // 6. ADIÓS A "NUESTRA"
                tlZoom.to('.text-nuestra', {
                    opacity: 0,
                    filter: 'blur(20px)',
                    duration: 1.2,
                    ease: "power2.inOut"
                });

                // 7. EL PORTAL FINAL: "IA" SE CONVIERTE EN LA PUERTA AL SIGUIENTE NIVEL
                // IA Crece masivamente
                tlZoom.to('.hero-char-ia', {
                    scale: 120, // Zoom infinito estilo Nolan
                    filter: 'blur(0px)',
                    opacity: 0, // Se desvanece al cruzar
                    duration: 2,
                    autoAlpha: 0,
                    display: 'none', // FORZAR DESAPARICIÓN DEL DOM para evitar bug GPU
                    ease: "expo.in"
                }, ">"); // En vez de "8.5" absoluto que generaba huecos en blanco

                // SIMULTÁNEO: La ventana de video se desvanece y desaparece para revelar el fondo blanco
                tlZoom.to(windowRef.current, {
                    autoAlpha: 0,
                    scale: 0.9, // Ligera contracción mientras desaparece
                    filter: 'blur(20px)',
                    duration: 1.5,
                    ease: "power2.in"
                }, "<0.2"); // Empieza un poco después de que inicie el zoom de IA

                // SIMULTÁNEO: Capa iridiscente pasa a Blanco
                tlZoom.to('.iridescent-layer', {
                    opacity: 0,
                    duration: 1.5,
                    ease: "power2.inOut"
                }, "<");

                // Opacidad final para limpieza profunda y colapso para empalmar con Identidad
                tlZoom.to('.cinematic-content', {
                    autoAlpha: 0,
                    duration: 0.1,
                    ease: "none"
                }, "<"); // Desaparece al mismo tiempo que muere la IA y demás capas
                // --- Lógica del Resto de GSAP (Manteniendo Rifts y Simbiosis) ---

                // --- CHAPTER HUD TRACKING ---
                const chapters = [
                    { id: '#hero', name: 'ESENCIA', num: '1' },
                    { id: '#identidad', name: 'IDENTIDAD', num: '2' },
                    { id: '#manifesto', name: 'EL MANIFIESTO', num: '3' },
                    { id: '#capacidades', name: 'INGENIERÍA CREATIVA', num: '4' },
                    { id: '#nucleo', name: 'EL NÚCLEO', num: '5' },
                    { id: '#simbiosis', name: 'SIMBIOSIS', num: '6' },
                    { id: '#contacto', name: 'EL SALTO', num: '7' },
                ];

                chapters.forEach(chapter => {
                    ScrollTrigger.create({
                        trigger: chapter.id,
                        start: "top 50%",
                        end: "bottom 50%",
                        onEnter: () => {
                            setActiveChapter(chapter.name);
                            setChapterNum(chapter.num);
                        },
                        onEnterBack: () => {
                            setActiveChapter(chapter.name);
                            setChapterNum(chapter.num);
                        }
                    });
                });
                const tlIdentidad = gsap.timeline({
                    scrollTrigger: {
                        trigger: '#identidad',
                        start: 'top top', // Empalme Inmediato y perfecto (Top con Top, gracias al Margin -100vh)
                        end: '+=600%', // Igualado a CinematicDev
                        pin: true,
                        scrub: 0.5,
                        anticipatePin: 1
                    }
                });

                // Resurrección de Nodos: Después de apagar la red neuronal en Cap 1, renace aquí (como el usuario exige)
                tlIdentidad.to('.essence-fixed-wrapper', {
                    opacity: 1,
                    autoAlpha: 1,
                    duration: 1.5,
                    ease: 'power2.inOut'
                }, 0); // Empieza instantáneamente en start del tlIdentidad

                tlIdentidad.to('.entropy-el', {
                    opacity: 1,
                    filter: 'blur(0px)',
                    transform: 'scale(1)',
                    duration: 3,
                    stagger: 1.2,
                    ease: 'power2.out'
                }, 0.2);

                tlIdentidad.to('.entropy-catchphrase', {
                    opacity: 1,
                    filter: 'blur(0px)',
                    transform: 'scale(1)',
                    color: '#888888', // CORRECCIÓN: Gris en lugar de Blanco (Invisible)
                    duration: 3,
                    ease: 'expo.out'
                }, ">-0.5");

                tlIdentidad.to('.entropy-catchphrase', {
                    color: '#00FF99',
                    textShadow: '0 0 40px rgba(0,255,153,0.6), 0 0 80px rgba(0,255,153,0.4)',
                    duration: 2,
                    ease: 'power4.out'
                }, ">");

                tlIdentidad.to('.entropy-finish', {
                    opacity: 1,
                    filter: 'blur(0px)',
                    duration: 3,
                    ease: 'power2.out'
                }, ">-1");

                tlIdentidad.to('.entropy-line', {
                    scaleY: 1,
                    duration: 3,
                    ease: 'power2.inOut'
                }, ">-1.5");

                tlIdentidad.to('.entropy-body', {
                    opacity: 1,
                    transform: 'translateY(0)',
                    filter: 'blur(0px)',
                    duration: 3,
                    stagger: 1,
                    ease: 'power2.out'
                }, ">-1.5");

                tlIdentidad.to('#identidad', {
                    opacity: 0,
                    duration: 4,
                    ease: 'power2.in'
                }, ">+1.5");

                ScrollTrigger.create({
                    trigger: '#contacto',
                    start: 'top bottom',
                    onEnter: () => {
                        glitchRef.current?.trigger(0.8);
                    },
                    onLeaveBack: () => {
                        glitchRef.current?.trigger(0.35);
                    }
                });

                if (ctaSectionRef.current) {
                    const ctaTl = gsap.timeline({
                        scrollTrigger: {
                            trigger: ctaSectionRef.current,
                            start: 'top top',
                            end: '+=500%',
                            pin: true,
                            pinSpacing: true,
                            scrub: 1,
                            anticipatePin: 1,
                            snap: {
                                snapTo: (value) => {
                                    return value < 0.2 ? 0 : 1;
                                },
                                duration: { min: 0.5, max: 1.2 },
                                delay: 0.02,
                                ease: 'expo.out'
                            }
                        }
                    });

                    ctaTl.addLabel("somos");
                    ctaTl.to({}, { duration: 1 });
                    ctaTl.to('.cta-somos-text', {
                        opacity: 0,
                        y: -80,
                        duration: 0.6,
                        ease: 'power3.in'
                    });

                    ctaTl.to('.cta-brain-container', {
                        y: '-35vh',
                        scale: 0.5,
                        duration: 1,
                        ease: 'power4.inOut'
                    }, "<");

                    ctaTl.to('.cta-invitation-container', {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: 'power3.out'
                    }, ">-0.4");

                    ctaTl.addLabel("final");
                }

                if (pulseButtonRef.current) {
                    const btn = pulseButtonRef.current;
                    gsap.from(btn, {
                        scrollTrigger: {
                            trigger: btn,
                            start: "top 95%"
                        },
                        y: 40,
                        opacity: 0,
                        duration: 1.2,
                        ease: "power4.out"
                    });
                }

            }, containerRef.current || undefined);

            return () => { ctx.revert(); };
        }
    }, [loading, lenis, hash]);

    // canRenderSlider eliminado para evitar problemas de layout

    return (
        <main ref={containerRef} style={{ backgroundColor: 'transparent' }}>
            <div ref={bgRef} style={{
                position: 'fixed',
                inset: 0,
                zIndex: -3,
                backgroundColor: '#ADD8E6' // Azul claro inicial
            }} />
            <SEO
                title="Agencia de Ingeniería Digital & Automatización"
                description="Especialistas en Arquitectura Digital, Sistemas de Automatización 360 e Identidad Visual de Alta Fidelidad. Operamos a un nivel de eficiencia imposible para humanos."
            />
            <StructuredData data={{
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "AgencIA",
                "url": "https://www.agenciamx.app",
                "logo": "https://www.agenciamx.app/logo.png",
                "description": "Agencia líder en Transformación Digital e Inteligencia Artificial.",
                "sameAs": [
                    "https://www.linkedin.com/company/agencia",
                    "https://instagram.com/agencia"
                ]
            }} />
            {loading && <Loader onComplete={handleLoaderComplete} />}
            <GlitchPortal ref={glitchRef} />
            {/* --- GLOBAL BACKGROUND LAYERS --- */}

            {/* 1. CAPA BASE VOLUMÉTRICA ("El Vacío Inconmensurable Blanco") */}
            <div className="iridescent-layer" style={{
                position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
                background: 'radial-gradient(ellipse at 30% 20%, #ffffff 0%, #f4f6f9 50%, #e2e6eb 100%)',
                opacity: 1,
                visibility: 'visible'
            }}>
                <div className="absolute inset-0 opacity-[0.04] mix-blend-multiply" 
                     style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')" }}>
                </div>
            </div>

            {/* 2. CAPA DE RED NEURONAL (Capítulo 02+) */}
            <div className="essence-fixed-wrapper" style={{ position: 'fixed', inset: 0, zIndex: -2, pointerEvents: 'none', opacity: 1 }}>
                <EssenceBackground paused={false} />
            </div>

            {/* WRAPPER RELATIVO (Capítulo 1: NUESTRA IA Cinematic) */}
            <div className="cinematic-content" style={{
                position: 'relative', // Bloque HTML Normal
                width: '100%', height: '100vh',
                overflow: 'hidden',
                zIndex: 10
            }}>

                {/* CAPA 1: VENTANA FLOTANTE (TEXTO SOBRE BLANCO) */}
                <div ref={windowRef} style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '60vw', height: '35vw',
                    borderRadius: '20px',
                    // Sombra direccional MUY marcada para la ilusión de profundidad extrema
                    boxShadow: '-40px 50px 60px rgba(0,0,0,0.5), -15px 20px 25px rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    backgroundColor: '#000000', // Fondo negro para video
                    zIndex: 1,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    overflow: 'visible' // CAMBIADO a visible para que "IA" explote fuera de la caja
                }}>
                    {/* Contenedor estricto para redondear el video SIN cortar el texto */}
                    <div className="video-layer" style={{ position: 'absolute', inset: 0, borderRadius: '20px', overflow: 'hidden' }}>
                        {/* VIDEO DE FONDO: Esencia Hero Ultra */}
                        <video
                            src={videoSrc}
                            autoPlay muted loop playsInline webkit-playsinline="true" preload="metadata"
                            style={{
                                width: '100%', height: '100%',
                                objectFit: 'cover', opacity: 0.8
                            }}
                        />
                    </div>

                    {/* 1.2 CAPA DE TEXTO (Encima del Video, sin restricciones de overflow) */}
                    <div className="text-container" style={{ textAlign: 'center', zIndex: 10, position: 'relative' }}>
                        <h1 style={{
                            fontSize: 'clamp(2rem, 8vw, 10rem)',
                            lineHeight: 0.9, fontWeight: 900, letterSpacing: '-0.04em', margin: 0,
                            textTransform: 'uppercase', color: '#000000',
                            // Glow blanco ultra-refinado y multicapa para separar del video oscuro
                            textShadow: '0 0 5px rgba(255,255,255,1), 0 0 15px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.5)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {/* LÍNEA 1: NUESTRA */}
                            <span className="text-nuestra" style={{
                                display: 'inline-block', fontSize: '0.4em', letterSpacing: '0.2em', marginBottom: '0.2em',
                                // Glow proporcional para línea menor
                                textShadow: '0 0 5px rgba(255,255,255,0.9), 0 0 10px rgba(255,255,255,0.6)',
                                opacity: 0, transform: 'translateY(20px)'
                            }}>
                                NUESTRA
                            </span>

                            {/* LÍNEA 2: ESENCIA */}
                            <div className="text-esencia" style={{
                                display: 'flex', gap: '0', whiteSpace: 'nowrap',
                                opacity: 0, transform: 'scale(0.9)', filter: 'blur(10px)'
                            }}>
                                {/* PART 2A: ESENC (Will Fade Away) */}
                                <span className="word-esenc" style={{ display: 'inline-block', overflow: 'hidden' }}>ESENC</span>
                                <span className="hero-char-ia" style={{ display: 'inline-block', position: 'relative' }}>IA</span>
                            </div>
                        </h1>
                    </div>
                </div>

                {/* CAPA 2: CAPA NEGRA INTERMEDIA (Transición) */}
                <div ref={redLayerRef} style={{
                    position: 'absolute', inset: 0, zIndex: 2,
                    backgroundColor: '#000000', // NEGRO por solicitud
                    mixBlendMode: 'normal'
                }} />

                {/* CAPA 3: PARED BLANCA CON RECORTE EN LA "N" */}
                {/* Nota: Pared Blanca vs Fondo Azul vs Ventana Blanca. 
                    El fondo crea el contraste entre la Pared y la Ventana. */}
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 3,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: '100%', height: '100%'
                }}>
                    <svg ref={maskGroupRef} viewBox="0 0 17009 2588" width="80%" height="auto" style={{ overflow: 'visible' }}>
                        <defs>
                            <mask id="n-portal-mask">
                                {/* 1. Lienzo Blanco (Visible - Pared) */}
                                <rect x="-50000" y="-50000" width="100000" height="100000" fill="white" />

                                {/* 2. La "N" es Negra (El Agujero - Invisible) */}
                                {logoPaths[3].startsWith('M') ?
                                    <path d={logoPaths[3]} fill="black" /> :
                                    <polygon points={logoPaths[3]} fill="black" />
                                }
                            </mask>
                        </defs>

                        {/* A. La Pared Blanca Infinita (con el hueco de la N) */}
                        <rect x="-50000" y="-50000" width="100000" height="100000" fill="white" mask="url(#n-portal-mask)" />

                        {/* B. El resto de letras en NEGRO SÓLIDO */}
                        <g fill="black">
                            {logoPaths.map((d, i) => {
                                if (i === 3) return null;
                                return d.startsWith('M') ?
                                    <path key={i} d={d} /> :
                                    <polygon key={i} points={d} />;
                            })}
                        </g>
                    </svg>
                </div>

            </div> {/* Cierre de cinematic-content (Fase 1: Hero) */}

            {/* --- NARRATIVE WRAPPER ELIMINADO POR SUSTITUCIÓN CINEMÁTICA --- */}

            {/* 3. IDENTIDAD MASTERPIECE */}
            <section id="identidad" style={{
                marginTop: '-100vh', // MAGIA PURA: Compensa el tamaño del pin-spacer anterior logrando un hand-off al 100% de la pantalla
                minHeight: '100vh',
                padding: '2rem 5% 2rem 5%', // Compact Padding
                backgroundColor: 'transparent',
                display: 'flex',
                flexDirection: 'column', // Force Stack for perfect centering
                alignItems: 'center', // Horizontally center
                justifyContent: 'center', // Vertically center in 100vh
                gap: '4vh', // Dynamic spacing
                position: 'relative',
                zIndex: 40,
                perspective: '1000px',
                transformStyle: 'preserve-3d',
            }}>
                {/* COLUMN 2: CONTENT (Main Text) */}
                <div className="identidad-headline-container" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', perspective: '1000px', width: '100%', maxWidth: '800px' }}>

                    {/* BLOCK 1: NO SOMOS UNA AGENCIA... */}
                    <div className="entropy-block-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <h2 className="entropy-el" style={{
                            fontSize: 'clamp(1.5rem, 3.5vw, 3rem)', // Reduced Size
                            fontWeight: 800,
                            margin: 0,
                            lineHeight: 1.1,
                            color: '#000',
                            opacity: 0,
                            filter: 'blur(20px)',
                            transform: 'scale(0.8)',
                            willChange: 'opacity, filter, transform'
                        }}>
                            NO SOMOS UNA
                        </h2>
                        <h2 className="entropy-el" style={{
                            fontSize: 'clamp(1.5rem, 3.5vw, 3rem)', // Reduced Size
                            fontWeight: 800,
                            margin: 0,
                            lineHeight: 1.1,
                            color: '#222', // SC: Increased contrast for visibility
                            opacity: 0,
                            filter: 'blur(30px)',
                            transform: 'scale(0.7)',
                            willChange: 'opacity, filter, transform'
                        }}>
                            AGENCIA CON IA.
                        </h2>
                    </div>

                    {/* BLOCK 2: SOMOS LA IA... */}
                    <div className="entropy-block-2" style={{ marginTop: '1rem' }}>
                        <h2 className="entropy-catchphrase" style={{
                            fontSize: 'clamp(2rem, 5vw, 4.5rem)', // Reduced Size
                            fontWeight: 800,
                            margin: 0,
                            lineHeight: 1,
                            color: '#333',
                            opacity: 0,
                            filter: 'blur(40px)',
                            transform: 'scale(1.2)',
                            willChange: 'opacity, filter, transform, color, text-shadow'
                        }}>
                            SOMOS LA IA
                        </h2>
                        <div className="entropy-finish" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '0.3rem', opacity: 0, filter: 'blur(20px)' }}>
                            <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', fontWeight: 900, margin: 0, lineHeight: 1, color: '#000' }}>COMO</h2>
                            <img
                                src={officialTypography}
                                alt="AgencIA"
                                style={{
                                    height: 'clamp(1.8rem, 4.5vw, 4rem)', // Tuned for crispness
                                    width: 'auto',
                                    objectFit: 'contain',
                                    imageRendering: 'auto' // Let browser handle smoothing
                                }}
                            />
                        </div>
                    </div>

                </div>

                <div className="identidad-body-container" style={{
                    marginTop: '1.5rem',
                    paddingLeft: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.8rem',
                    position: 'relative',
                    // borderLeft removed
                }}>
                    {/* ANIMATED VERTICAL LINE */}
                    <div className="entropy-line" style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '3px',
                        backgroundColor: '#00FF99', // Neon Acccent
                        boxShadow: '0 0 10px rgba(0,255,153,0.5)',
                        transformOrigin: 'top',
                        transform: 'scaleY(0)', // Start hidden
                    }} />

                    {/* Line 1 */}
                    <p className="entropy-body" style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'clamp(0.9rem, 1.2vw, 1.15rem)',
                        lineHeight: 1.3,
                        maxWidth: '550px',
                        color: '#333',
                        margin: 0,
                        opacity: 0,
                        transform: 'translateY(20px)',
                        filter: 'blur(10px)'
                    }}>
                        No hacemos "diseño bonito". Construimos interfaces que<br />
                        <strong style={{ color: '#00FF99' }}>imponen autoridad</strong> y capturan mercado.
                    </p>

                    {/* Line 2 - NIVEL 2 */}
                    <p className="entropy-body" style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'clamp(0.9rem, 1.2vw, 1.15rem)',
                        lineHeight: 1.3,
                        maxWidth: '550px',
                        color: '#333',
                        margin: 0,
                        opacity: 0,
                        transform: 'translateY(20px)',
                        filter: 'blur(10px)',
                        textShadow: '3px 6px 12px rgba(0,0,0,0.28)'
                    }}>
                        Estética superior. Ejecución quirúrgica. Resultados financieros.
                    </p>

                    {/* Line 3 - NIVEL 1 (más cerca, más marcada) */}
                    <p className="entropy-body" style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: 'clamp(0.9rem, 1.2vw, 1.15rem)',
                        lineHeight: 1.3,
                        maxWidth: '550px',
                        color: '#000',
                        fontWeight: 800,
                        margin: '0.3rem 0 0',
                        opacity: 0,
                        transform: 'translateY(20px)',
                        filter: 'blur(10px)',
                        textShadow: '4px 8px 16px rgba(0,0,0,0.35)'
                    }}>
                        Creatividad humana. Velocidad de máquina.
                    </p>
                </div>

            </section>


            {/* 4. SOUL MANIFESTO */}
            <section id="manifesto" className="soul-narrative-section" style={{ position: 'relative', zIndex: 40, backgroundColor: 'transparent', color: '#FFF' }}>
                <SoulManifesto />
            </section>


            {/* 5. SHOWCASE SLIDER */}
            <section id="capacidades" className="identity-section" style={{ position: 'relative', zIndex: 50, marginTop: '0', backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
                <ShowcaseSlider initialHash={hash} />
            </section>

            {/* 6. TEAM RIFT */}
            <section id="nucleo" className="team-list" style={{ minHeight: '100vh', padding: '15vh 0 10vh', backgroundColor: '#FFFFFF', color: '#000', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                <h2 style={{ fontSize: 'clamp(3rem, 6vw, 6rem)', margin: '6rem 0', fontWeight: 900, textAlign: 'center', letterSpacing: '0.02em', wordSpacing: '0.2em', color: '#000' }}>EL NÚCLEO</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {team.map((member) => (
                        <div key={member.id} className="rift-row" style={{ position: 'relative', width: '100%', height: '60vh', minHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer', borderTop: '1px solid rgba(0,0,0,0.1)', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                            <div className="rift-img" style={{ position: 'absolute', top: '15%', left: 0, width: '100%', height: '70%', zIndex: 0, transition: 'none', overflow: 'hidden', opacity: 0.3, filter: 'grayscale(100%)' }}>
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    backgroundImage: `url(${member.img})`,
                                    backgroundSize: 'contain', // Revert to contain to prevent "enormous" cutups
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'center', // Focus on faces generally
                                    transform: 'scale(1)', // No zoom
                                }} />
                            </div>
                            <span className="rift-id" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', fontSize: '10rem', fontWeight: 900, opacity: 0.05, zIndex: 1, pointerEvents: 'none', color: '#000' }}>0{member.id}</span>
                            <div className="rift-left" style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '4rem', zIndex: 2, background: 'linear-gradient(90deg, #FFFFFF 40%, rgba(255,255,255,0.8) 90%, transparent 100%)', transform: 'translateX(0)', willChange: 'transform' }}>
                                <h3 style={{ fontSize: 'clamp(2rem, 3.5vw, 4rem)', fontWeight: 700, textAlign: 'right', margin: 0, color: '#000', whiteSpace: 'pre-line' }}>{member.role}</h3>
                            </div>
                            <div className="rift-right" style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '4rem', zIndex: 2, background: 'linear-gradient(-90deg, #FFFFFF 40%, rgba(255,255,255,0.8) 90%, transparent 100%)', transform: 'translateX(0)', willChange: 'transform' }}>
                                <span style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)', color: '#000', maxWidth: '300px', whiteSpace: 'pre-line' }}>{member.name}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* A.L.M.A. PORTAL (Integrated into Nucleo End) */}
                <div className="alma-portal-container" style={{ marginTop: '5vh' }}>
                    <AlmaSection />
                </div>
            </section>

            {/* 7. SIMBIOSIS */}
            {/* GRADIENT BRIDGE: WHITE -> BLACK (Smooth Descent) */}
            <div style={{ height: '20vh', background: 'linear-gradient(to bottom, #FFFFFF 0%, #000000 100%)', width: '100%', position: 'relative', zIndex: 15 }} />

            <div id="simbiosis" style={{ position: 'relative' }}>
                <Symbiosis />
            </div>

            {/* INJECTED STYLES FOR MOBILE MASTERPIECE */}
            <style>{`
                    @media (max-width: 768px) {
                        #identidad {
                            flex-direction: column !important;
                            align-items: flex-start !important;
                            /* CENTERED LAYOUT with safe padding */
                            justify-content: center !important;
                            padding: 2rem 5% 2rem 5% !important; 
                            gap: 0.5rem !important;
                            min-height: 100vh !important; /* Ensure full height for centering */
                        }
                        .identidad-marker {
                            display: none !important;
                        }
                        .identidad-headline-1 {
                            font-size: clamp(1.5rem, 8vw, 2.5rem) !important; /* SMALLER BASE for iPhone 5 */
                            line-height: 1.1 !important;
                        }
                        .identidad-headline-2 {
                            font-size: clamp(1.8rem, 10vw, 3rem) !important; /* SMALLER BASE */
                            margin-top: 0.2rem !important;
                            line-height: 1 !important;
                        }
                        .identidad-body-container {
                            margin-top: 0.8rem !important;
                            padding-left: 0.8rem !important; /* Less indentation */
                            gap: 0.5rem !important;
                        }
                        .identidad-body-line {
                            font-size: clamp(0.75rem, 3.5vw, 1rem) !important; /* iPhone 5 safe */
                            line-height: 1.3 !important;
                        }
                        /* FORCE LOGO COMPACTNESS */
                        #identidad img {
                            max-height: 10vh !important; /* Even smaller for iPhone 5 safety */
                            margin-top: 0.5rem !important;
                            align-self: flex-start !important; /* Ensure left align */
                        }
                    }

                    /* IPHONE 5/SE & ULTRA SMALL SPECIFIC OVERRIDES */
                    @media (max-width: 380px), (max-height: 700px) {
                        #identidad {
                            justify-content: flex-start !important; /* Let it flow from top */
                            padding-top: 10vh !important; /* REDUCED to bring connection closer to prev section */
                            padding-bottom: 25vh !important; /* MASSIVE BOTTOM PADDING TO PREVENT CUTOFF */
                            gap: 0.2rem !important;
                        }
                        .identidad-headline-1 {
                            font-size: 1.3rem !important; /* EVEN SMALLER */
                        }
                        .identidad-headline-2 {
                            font-size: 1.5rem !important; /* EVEN SMALLER */
                            margin-top: 0.1rem !important;
                        }
                        .identidad-body-container {
                             margin-top: 0.5rem !important;
                             padding-left: 0.5rem !important;
                        }
                        .identidad-body-line {
                            font-size: 0.7rem !important;
                            line-height: 1.25 !important;
                        }
                        #identidad img {
                            max-height: 70px !important; /* Fixed pixel max height for safety */
                            margin-top: 0.2rem !important;
                        }
                        /* Ensure nothing is hidden */
                        #identidad {
                            overflow-y: visible !important;
                            height: auto !important;
                            min-height: 100svh !important;
                        }
                    }
                `}</style>

            {/* 8. CTA SECTION - PINNED ANIMATION RESTORED */}
            <section
                ref={ctaSectionRef} // Attached Ref
                id="contacto"
                className="cta-section"
                style={{
                    height: '100vh', // Viewport height (GSAP adds scroll space)
                    width: '100%',
                    position: 'relative',
                    backgroundColor: '#FFFFFF',
                    overflow: 'hidden', // Clean edges
                    zIndex: 50 // Ensure it sits on top of previous gradients
                }}
            >
                {/* PINNED CONTENT CONTAINER */}
                <div
                    className="cta-pinned-content"
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center', // Back to center
                        alignItems: 'center',
                        position: 'relative',
                        paddingTop: '0'
                    }}
                >

                    {/* SOMOS text */}
                    <h2
                        className="cta-somos-text"
                        style={{
                            fontSize: 'clamp(3rem, 8vw, 6rem)',
                            textAlign: 'center',
                            fontWeight: 900,
                            margin: '0 0 2vh 0',
                            letterSpacing: '-0.05em',
                            color: '#000',
                            position: 'relative',
                            zIndex: 2
                        }}
                    >
                        SOMOS
                    </h2>

                    {/* BRAIN + AGENCIA LOGO */}
                    <div
                        className="cta-brain-container"
                        style={{
                            width: 'clamp(400px, 80vw, 1200px)', // Keep width MAX
                            maxHeight: '65vh', // SAFE HEIGHT to ensure Pin works (75vh was too risky)
                            marginBottom: '1rem',
                            position: 'relative',
                            zIndex: 1,
                            transformOrigin: 'center center',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <img src={footerLogo} alt="AgencIA Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
                    </div>

                    {/* CTA CONTENT - Hidden initially */}
                    <div
                        className="cta-invitation-container"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            position: 'absolute',
                            top: '55%', // Positioned relative to viewport height
                            left: '50%',
                            transform: 'translateX(-50%) translateY(50px)', // Centered horizontally
                            width: '100%',
                            opacity: 0,
                            zIndex: 5
                        }}
                    >
                        <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)', textAlign: 'center', fontWeight: 900, marginBottom: '2rem', letterSpacing: '-0.05em', color: '#333' }}>
                            ¿TIENES UNA IDEA?
                        </h2>

                        <Link to="/contacto">
                            <button
                                ref={pulseButtonRef}
                                style={{
                                    padding: 'clamp(0.8rem, 2vh, 1.2rem) clamp(1.5rem, 8vw, 4rem)',
                                    background: '#000',
                                    color: '#FFF',
                                    border: '1px solid #000',
                                    borderRadius: '0px',
                                    fontWeight: '900',
                                    fontSize: 'clamp(0.85rem, 4vw, 1.1rem)',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    transition: 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
                                    letterSpacing: 'clamp(0.1em, 2vw, 0.25em)',
                                    textTransform: 'uppercase',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'clamp(0.5rem, 3vw, 1.5rem)',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                    width: 'auto',
                                    maxWidth: '92vw'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.backgroundColor = '#FFF';
                                    e.currentTarget.style.color = '#000';
                                    e.currentTarget.style.padding = 'clamp(0.8rem, 2vh, 1.2rem) clamp(2rem, 9vw, 4.5rem)';
                                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,255,153,0.15)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.backgroundColor = '#000';
                                    e.currentTarget.style.color = '#FFF';
                                    e.currentTarget.style.padding = 'clamp(0.8rem, 2vh, 1.2rem) clamp(1.5rem, 8vw, 4rem)';
                                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
                                }}
                            >
                                <span style={{ position: 'relative', zIndex: 1 }}>Tómate un café virtual</span>
                                <span style={{ fontSize: '1.4rem', transition: 'transform 0.3s ease' }} className="cta-arrow">→</span>
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- PHYSICAL GRADIENT BRIDGE: WHITE -> BLACK (To Footer) --- */}
            <div style={{
                width: '100%',
                height: '150px',
                background: 'linear-gradient(to bottom, #FFFFFF 0%, #000000 100%)',
                position: 'relative',
                zIndex: 20
            }} />

            {/* 7. FOOTER */}
            <Footer />

            {/* HUD DE CAPÍTULOS (WOW!) */}
            <ChapterHUD currentChapter={activeChapter} chapterNumber={chapterNum} />
        </main>
    );
};

export default Home;
