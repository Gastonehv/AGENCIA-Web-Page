import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import essenceHeroVideo from '../assets/videos/esencia_hero_ultra.mp4'; // IMPORTACI├ôN DE VIDEO
import EssenceBackground from '../components/EssenceBackground';
import officialTypography from '../assets/logos/agencia_typography_official.png';
import NeuralNetworkALMA from '../components/NeuralNetworkALMA';
import ScrambleText from '../components/ScrambleText';
import AsciiRipple from '../components/AsciiRipple';
import Prism from '../components/Prism';
import ShowcaseSlider from '../components/ShowcaseSlider';
import ceoImg from '../assets/team/ceo.jpg';
import gaelImg from '../assets/team/gael_oracle.png';
import almaLogo from '../assets/images/alma_logo_final.png';
import almaVideo from '../assets/videos/alma_fondo_v3_opt.mp4';
import footerLogo from '../assets/logo_agencia_full.png';
// import AlmaSection from '../components/AlmaSection'; // Unused in this version
import Symbiosis from '../components/Symbiosis';
import GlitchPortal from '../components/GlitchPortal';
import Footer from '../components/Footer';
import ChapterHUD from '../components/ChapterHUD';
import Loader from '../components/Loader';

gsap.registerPlugin(ScrollTrigger);

const MANIFESTO = [
    {
        title: "EN LA ERA DEL RUIDO INFINITO",
        body: ["La tecnología ha democratizado la creación,", "pero ha mercantilizado el alma,", "En este frenesí de velocidad,", "hemos olvidado por qué creamos."],
    },
    {
        title: "EL ALGORITMO NO TIENE PULSO",
        body: ["La IA es el pincel más poderoso,", "pero sigue siendo solo eso: un pincel.", "Buscamos 'el error hermoso',", "esa chispa que la lógica pura jamás descubriría."],
    },
    {
        title: "ARQUITECTOS DE LA NUEVA REALIDAD",
        body: ["Fusionamos sensibilidad artística visceral", "con potencia de cálculo masiva.", "Donde otros ven simples 'prompts',", "nosotros vemos partituras complejas."],
    },
    {
        title: "LA MEDIOCRIDAD ES EL ENEMIGO",
        body: ["Si buscas lo seguro,", "el mundo está lleno de agencias.", "Pero si buscas lo imposible,", "bienvenido a casa."],
    }
];

const CinematicDev: React.FC = () => {
    const [isLoading, setIsLoading] = React.useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const entranceGlitchRef = useRef<any>(null);
    
    // Parallax Refs for Hero
    const heroWindowRef = useRef<HTMLDivElement>(null);
    const heroTextRef = useRef<HTMLDivElement>(null);

    const [currentChapter, setCurrentChapter] = React.useState('ESENCIA');
    const [chapterNumber, setChapterNumber] = React.useState('1');

    // RUTAS DEL LOGOTIPO (Vectores "AGENCIA")
    const logoPaths = [
        "449.17,2442.5 90.53,2442.5 1043.39,157.04 1992.73,2442.5 1637.6,2442.5 1043.39,1025.52", // A
        "M3825.9 519.19c-206.28,0 -382.09,76.19 -527.41,228.55 -145.34,152.36 -218,335.2 -218,548.51 0,215.66 72.66,400.84 218,555.54 145.33,154.71 321.13,232.07 527.41,232.07 119.54,0 234.99,-30.47 346.33,-91.43 111.35,-60.95 203.35,-145.33 276.01,-253.15l80.88 -116.04 -397.32 -348.09 235.58 -270.75 559.06 488.74c-77.35,285.97 -216.24,515.7 -416.65,689.15 -200.42,173.46 -428.37,260.2 -683.87,260.2 -304.74,0 -564.92,-111.93 -780.58,-335.79 -215.66,-223.86 -323.48,-494.01 -323.48,-810.46 0,-314.11 107.82,-582.5 323.48,-805.18 215.66,-222.69 475.84,-334.03 780.58,-334.03 215.65,0 416.07,59.78 601.25,179.32l-242.61 274.26c-107.82,-60.95 -227.38,-91.43 -358.64,-91.43z", // G
        "6253.29,515.69 6253.29,1120.45 6995.18,1120.45 6995.18,1479.09 6253.29,1479.09 6253.29,2083.86 7297.56,2083.86 7297.56,2442.5 5894.64,2442.5 5894.64,157.04 7297.56,157.04 7297.56,515.69", // E
        "9999.2,2438.98 8687.7,1074.74 8687.7,2442.5 8329.06,2442.5 8329.06,157.04 9640.56,1531.83 9640.56,157.04 9999.2,157.04", // N
        "M12138.27 519.19c-206.28,0 -382.09,76.19 -527.41,228.55 -145.34,152.36 -218,335.2 -218,548.51 0,218 72.66,403.77 218,557.3 145.33,153.54 321.13,230.31 527.41,230.31 128.92,0 248.47,-31.65 358.64,-94.93l242.61 274.25c-180.5,119.54 -380.91,179.32 -601.25,179.32 -304.74,0 -564.92,-111.34 -780.58,-334.03 -215.66,-222.69 -323.48,-491.08 -323.48,-805.18 0,-316.44 107.82,-586.6 323.48,-810.46 215.66,-223.86 475.84,-335.79 780.58,-335.79 220.34,0 420.75,59.78 601.25,179.32l-242.61 277.77c-105.48,-63.28 -225.03,-94.93 -358.64,-94.93z", // C
        "13718.27,2442.5 13718.27,157.04 14076.92,157.04 14076.92,2442.5", // I
        "15375.63,2442.5 15016.99,2442.5 15969.85,157.04 16919.2,2442.5 16564.07,2442.5 15969.85,1025.52" // A
    ];

    // Referencia para el fondo
    const bgRef = useRef<HTMLDivElement>(null);
    // Referencia para la capa roja intermedia
    const redLayerRef = useRef<HTMLDivElement>(null);
    // Referencia para la capa de éter líquido (Deprecado)
    // const etherLayerRef = useRef<HTMLDivElement>(null);

    // Referencia para la ventana contenedora (Re-asignada al heroWindowRef)
    const windowRef = heroWindowRef;

    // Referencia al Prisma para controlarlo vía ScrollTrigger
    const prismRef = useRef<any>(null);

    // REFS FOR CHAPTER 7 (HOME REACTION RECREATION)
    const ctaSectionRef = useRef<HTMLDivElement>(null);
    const pulseButtonRef = useRef<HTMLButtonElement>(null);
    const monolithRef = useRef<HTMLDivElement>(null);

    const [activeManifestoItem, setActiveManifestoItem] = React.useState(0);
    const [mountEssence, setMountEssence] = React.useState(true);
    const [mountNeural, setMountNeural] = React.useState(true);
    const [mountPrism, setMountPrism] = React.useState(false);

    const [orientationPermitted, setOrientationPermitted] = React.useState(false);
    const orientationRef = useRef({ x: 0, y: 0 });

    // --- SENSOR PERMISSION PROTOCOL (iOS/Android) ---
    const requestOrientationPermission = async () => {
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            try {
                const permissionState = await (DeviceOrientationEvent as any).requestPermission();
                if (permissionState === 'granted') {
                    setOrientationPermitted(true);
                }
            } catch (error) {
                console.error("DeviceOrientation permission error:", error);
            }
        } else {
            // Android or non-iOS browsers
            setOrientationPermitted(true);
        }
    };

    React.useEffect(() => {
        const handleFirstInteraction = () => {
            requestOrientationPermission();
            window.removeEventListener('click', handleFirstInteraction);
            window.removeEventListener('touchstart', handleFirstInteraction);
        };
        window.addEventListener('click', handleFirstInteraction);
        window.addEventListener('touchstart', handleFirstInteraction);
        return () => {
            window.removeEventListener('click', handleFirstInteraction);
            window.removeEventListener('touchstart', handleFirstInteraction);
        };
    }, []);

    // --- PARALLAX ENGINE (MOUSE + SENSORS) ---
    React.useEffect(() => {
        const win = heroWindowRef.current;
        const txt = heroTextRef.current;
        
        if (!win || !txt) return;

        // Utilizamos quickTo para un rendimiento superior sin repaints bloqueantes
        const winXTo = gsap.quickTo(win, "x", { duration: 0.8, ease: "power3" });
        const winYTo = gsap.quickTo(win, "y", { duration: 0.8, ease: "power3" });
        
        // El texto se mueve más rápido/lento para crear el desfase 3D (Multilayer Parallax)
        const txtXTo = gsap.quickTo(txt, "x", { duration: 1.2, ease: "power3.out" });
        const txtYTo = gsap.quickTo(txt, "y", { duration: 1.2, ease: "power3.out" });

        const rangeWin = 30; // La ventana se mueve sutilmente
        const rangeTxt = -50; // El texto se mueve en dirección opuesta

        const handleMouseMove = (e: MouseEvent) => {
            // Normalizar coordenadas (-0.5 a 0.5)
            const nx = (e.clientX / window.innerWidth) - 0.5;
            const ny = (e.clientY / window.innerHeight) - 0.5;
            
            orientationRef.current = { x: nx, y: ny };

            winXTo(nx * rangeWin);
            winYTo(ny * rangeWin);
            txtXTo(nx * rangeTxt);
            txtYTo(ny * rangeTxt);
        };

        const handleOrientation = (e: DeviceOrientationEvent) => {
            // Gamma (inclinación izquierda/derecha) y Beta (inclinación adelante/atrás)
            // Normalizamos a un rango de aprox -0.5 a 0.5 usando 30 grados como límite
            const nx = (e.gamma || 0) / 60; 
            // Restamos 60 grados de Beta porque es el ángulo natural al sostener un móvil
            const ny = ((e.beta || 60) - 60) / 60;

            // Clamp para evitar movimientos extremos
            const cnx = Math.max(-0.5, Math.min(0.5, nx));
            const cny = Math.max(-0.5, Math.min(0.5, ny));

            orientationRef.current = { x: cnx, y: cny };

            winXTo(cnx * rangeWin);
            winYTo(cny * rangeWin);
            txtXTo(cnx * rangeTxt);
            txtYTo(cny * rangeTxt);

            // Monolith Rotation (Mobile)
            if (monolithRef.current) {
                gsap.to(monolithRef.current, {
                    rotationY: cnx * 30, 
                    rotationX: -cny * 30,
                    filter: `drop-shadow(${cnx * -40}px ${cny * -40}px 30px rgba(0,0,0,0.1))`,
                    duration: 0.5,
                    overwrite: 'auto'
                });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        
        if (orientationPermitted) {
            window.addEventListener('deviceorientation', handleOrientation);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, [orientationPermitted]);

    // Referencia para el grupo SVG que vamos a escalar
    const maskGroupRef = useRef<SVGSVGElement>(null);

    // CHAPTER-SPECIFIC REFS (For Chapter 5 Rifts)
    const team = [
        { id: 1, role: 'CEO / VISIONARY', name: 'Arquitecto de Ecosistemas Digitales', img: ceoImg, scale: 1.35 },
        { id: 2, role: 'CTO /\nAI LEAD', name: 'Oráculo\nde Datos', img: gaelImg, scale: 1.6 },
        {
            id: 3,
            role: 'A.L.M.A.',
            name: 'ALGORITMO LÓGICO DE MENTE ARTIFICIAL',
            extraInfo: 'A.L.M.A. ES UNA PROPIEDAD INTELECTUAL DE AGENCIA. SISTEMAS DE ORQUESTACIÓN PROPIETARIA. ALL RIGHTS RESERVED.',
            isAlma: true
        },
    ];

    // --- CAMPO DE PARTICULAS MAGNETICAS (APAGADO) ---

    React.useEffect(() => {
        const ctx = gsap.context(() => {
            // Animación de Fondo (Ciclo de Color) - MANTENIDA
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

            // --- 1. ANIMACIÓN DE ZOOM DEL PORTAL ---
            const tlZoom = gsap.timeline({
                scrollTrigger: {
                    trigger: '.cinematic-content',
                    start: 'top top',
                    end: '+=750%', 
                    pin: true,
                    anticipatePin: 1,
                    scrub: 1,
                    refreshPriority: 15,
                    fastScrollEnd: true,
                    onToggle: (self) => {
                        if (self.isActive) {
                            setCurrentChapter('ESENCIA');
                            setChapterNumber('1');
                            setMountEssence(true);
                        }
                        
                        // MOUNT LOGIC - Absolute Death to Ghosting
                        if (self.progress > 0.99) {
                            setMountEssence(false);
                            gsap.set('.cinematic-content', { opacity: 0, visibility: 'hidden', pointerEvents: 'none' });
                        } else {
                            gsap.set('.cinematic-content', { opacity: 1, visibility: 'visible', pointerEvents: 'auto' });
                        }

                        if (self.progress === 0) {
                            gsap.set('.iridescent-layer', { opacity: 1 });
                            gsap.set('.cinematic-content', { opacity: 1, visibility: 'visible' });
                        }
                    }
                }
            });

            tlZoom.to(maskGroupRef.current, {
                scale: 150, // Crecimiento masivo para "atravesar"
                // Coordenadas calculadas del centro de la N (9164, 1299) sobre el viewBox (17009, 2588)
                // X: 9164/17009 = 53.8%
                // Y: 1299/2588 = 50.1%
                transformOrigin: "53.8% 50.1%",
                ease: "power2.inOut",
                duration: 1
            });

            // 2. Desvanecimiento de la Capa Roja
            tlZoom.to(redLayerRef.current, {
                autoAlpha: 0, // Se desvanece hasta ser invisible
                ease: "power1.out",
                duration: 0.6 // Un poco más rápido para revelar la ventana antes
            }, "<"); // "<" = Inicia al mismo tiempo que el inicio del zoom

            // 3. Aparición/Acercamiento de la Ventana
            tlZoom.fromTo(windowRef.current,
                { scale: 0.4 },
                { scale: 0.8, duration: 1, ease: "power2.inOut" },
                "<"
            );

            // 4. Secuencia de TEXTO (NUESTRA -> ESENCIA)
            // Aparecen con estilo cinemático (Blur + Fade + Scale)
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
                width: 0, // CRÍTICO: Libera el espacio físico para que "IA" se centre al 100%
                opacity: 0,
                filter: 'blur(20px)',
                duration: 1.5,
                ease: "power2.inOut"
            }, ">+0.5"); // Pequeña pausa para leer "ESENCIA" completo antes de borrarlo

            // "IA" se vuelve Verde Radiactivo con efecto de TUBOS DE NEÓN
            tlZoom.to('.hero-char-ia', {
                color: '#00FF99', // Color base
                textShadow: 'none', // Limpio, sin halo difuminado excesivo
                WebkitTextStroke: '0px',
                scale: 1.15, // Poco más de peso
                duration: 1.5,
                ease: "power2.out"
            }, "<"); // Al mismo tiempo que ESENC desaparece

            // Desaparecer la red neuronal / capa de esencia de fondo (Como en original)
            tlZoom.to(".essence-dev-wrapper", {
                opacity: 0,
                autoAlpha: 0,
                duration: 1,
                ease: 'power1.in'
            }, "<");

            // ALINEACIÓN PERFECTAMENTE MILIMÉTRICA: "NUESTRA" se acopla con "IA"
            tlZoom.to('.text-nuestra', {
                y: '0%', // Baja para alinear al centro de IA
                x: '0%', // Desplazamiento fino horizontal ajustado
                scale: 1.05, // Ligeramente crecido para presencia
                duration: 1.5,
                ease: "power2.inOut"
            }, "<");

            // Pausa dramática para asimilar "NUESTRA IA"
            tlZoom.to({}, { duration: 4 }); // INCREASED PAUSE FOR IMPACT


            // 6. EL DESPLIEGUE CONTINÚA: "NUESTRA" se despide
            tlZoom.to('.text-nuestra', {
                opacity: 0,
                filter: 'blur(20px)',
                duration: 1.2,
                ease: "power2.inOut"
            });

            // 7. EL PORTAL FINAL: "IA" SE CONVIERTE EN LA PUERTA AL SIGUIENTE NIVEL
            // IA Crece masivamente
            tlZoom.to('.hero-char-ia', {
                scale: 300,
                filter: 'blur(0px)',
                opacity: 0,
                duration: 2.5,
                ease: "expo.in",
                immediateRender: false
            }, ">");

            // SIMULTÁNEO: La capa iridiscente/líquida de fondo desaparece exactamente AQUÍ
            tlZoom.to('.iridescent-layer', {
                opacity: 0,
                duration: 1.5,
                ease: "power2.inOut",
                immediateRender: false
            }, "<");

            // SIMULTÁNEO: La ventana de video se desvanece y desaparece para revelar el fondo blanco
            tlZoom.to(windowRef.current, {
                autoAlpha: 0,
                scale: 0.9,
                filter: 'blur(20px)',
                duration: 1.5,
                ease: "power2.in",
                immediateRender: false
            }, "<0.2");

            // SIMULTÁNEO: El fondo y sus destellos iridiscentes pasan a Blanco Sólido impoluto
            tlZoom.to('.iridescent-layer', {
                opacity: 0,
                duration: 1.5,
                ease: "power2.inOut",
                immediateRender: false
            }, "<");

            // Opacidad final para limpieza profunda y colapso para empalmar con Identidad
            tlZoom.to('.cinematic-content', {
                autoAlpha: 0,
                duration: 0.5,
                ease: "power2.in",
            });

            const tlIdentidad = gsap.timeline({
                scrollTrigger: {
                    trigger: "#identidad",
                    start: "top top",
                    end: "+=800%", // Cinematic zoom for chapter 2
                    pin: true,
                    pinSpacing: true,
                    scrub: 1,
                    anticipatePin: 1,
                    refreshPriority: 14,
                    fastScrollEnd: true,
                    onToggle: (self) => {
                        if (self.isActive) {
                            setMountNeural(true);
                            setCurrentChapter('IDENTIDAD');
                            setChapterNumber('2');
                        }
                    },
                    onLeaveBack: () => setMountNeural(false),
                    onLeave: () => setMountNeural(false),
                    onEnterBack: () => setMountNeural(true)
                }
            });

            // Clean start for Identidad
            tlIdentidad.to('.entropy-el', { // Primera Letra aparece en un lapso exacto
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

            tlIdentidad.to({}, { duration: 4 }); // PAUSA DE LECTURA: "SOMOS LA IA QUE ESTÁS BUSCANDO"

            tlIdentidad.to('#identidad', {
                opacity: 0,
                autoAlpha: 0,
                visibility: 'hidden',
                duration: 2,
                ease: 'power2.in'
            }, ">+0.5");

            // --- 3. CAPÍTULO 3: EL MANIFIESTO (PRISM RESTORATION) ---
            const manifestoItems = gsap.utils.toArray<HTMLElement>('.manifesto-item');

            // Stack items absolutely via GSAP set
            gsap.set(manifestoItems, {
                autoAlpha: 0, // HIDDEN BY DEFAULT (opacity 0 + visibility hidden)
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh',
                scale: 1.5, filter: 'blur(20px)', pointerEvents: 'none',
                display: 'flex' // Keep flex layout active, just hide visibility
            });

            const tlCap3 = gsap.timeline({
                scrollTrigger: {
                    trigger: "#capitulo-3",
                    start: "top top",
                    end: "+=1000%",
                    pin: true,
                    pinSpacing: true,
                    scrub: 1,
                    refreshPriority: 13,
                    fastScrollEnd: true,
                    onToggle: (self) => {
                        if (self.isActive) {
                            setMountPrism(true);
                            setCurrentChapter('GÉNESIS');
                            setChapterNumber('3');
                        }
                    },
                    onLeaveBack: () => setMountPrism(false),
                    onLeave: () => setMountPrism(false),
                    onEnterBack: () => setMountPrism(true)
                }
            });

            manifestoItems.forEach((item, i) => {
                const title = item.querySelector('h2');
                const bodyLines = item.querySelectorAll('.manifesto-body-line');

                // Morphing scrubbeado al tiempo de la aparición del texto
                const morphProxy = { transition: 0 };
                const shapeA = i === 0 ? 3 : (i - 1) % 4; // De la forma anterior
                const shapeB = i % 4; // A la forma actual

                tlCap3.to(item, {
                    autoAlpha: 1, // Fades in and sets visibility visible
                    scale: 1, filter: 'blur(0px)', duration: 1.5,
                    pointerEvents: 'all', ease: "power2.inOut",
                    onStart: () => setActiveManifestoItem(i),
                    onReverseComplete: () => setActiveManifestoItem(Math.max(0, i - 1)), // Arreglar backwards
                });

                tlCap3.to(morphProxy, {
                    transition: 1,
                    duration: 6.0, // Se extiende profundamente en la pausa de lectura para que sea muy sutil
                    ease: "power2.out", // Termina de resolverse de manera extremadamente suave
                    onUpdate: () => {
                        if (prismRef.current) {
                            // Calcula la energía basada en la parábola de la transición
                            const energy = Math.sin(morphProxy.transition * Math.PI);
                            prismRef.current.setMorph(shapeA, shapeB, morphProxy.transition, energy);
                        }
                    }
                }, "<"); // Al mismo tiempo que aparece el texto

                // SUGERENCIA 1: PURE AUTHORITY (Minimalismo Radical)
                tlCap3.fromTo(title, 
                    { opacity: 0, y: 30, filter: 'blur(12px)' }, 
                    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: "power4.out" }, 
                    "-=0.5"
                )
                    .fromTo(bodyLines, 
                        { opacity: 0, y: 15, filter: 'blur(8px)' }, 
                        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.2, ease: "power3.out" }, 
                        ">-0.6"
                    );

                if (i === 3) {
                    // --- CLIMAX ANIMATION: PURE AUTHORITY ---
                    // Texto Blanco Puro con Aura de Energía Sutil
                    tlCap3.to(bodyLines, {
                        color: '#FFFFFF',
                        letterSpacing: '0.12em',
                        fontWeight: 900,
                        textShadow: '0 0 20px rgba(255,255,255,0.4), 0 0 40px rgba(0,255,255,0.1)',
                        duration: 2.5,
                        ease: "power4.inOut"
                    }, ">-0.5");

                    // Pulso de Energía Constante y Elegante
                    tlCap3.to(bodyLines, {
                        textShadow: '0 0 35px rgba(255,255,255,0.7), 0 0 70px rgba(0,255,255,0.2)',
                        duration: 1.5,
                        repeat: 3,
                        yoyo: true,
                        ease: "sine.inOut"
                    }, ">");
                }

                tlCap3.to({}, { duration: 12 }); // EXTENDED READING PAUSE FOR EACH ITEM (SENSORY COMFORT)

                // ATMOSPHERIC WHITE FOG FUSION (CLIMAX PAUSE)
                if (i === manifestoItems.length - 1) {
                    tlCap3.to(item, { duration: 4 }); // EXTRA TIME PARA EL ÚLTIMO ITEM
                    tlCap3.to('.manifesto-white-fog', {
                        opacity: 1,
                        duration: 3.5, // SLOW & SENSORIAL
                        ease: "power2.inOut"
                    }, ">"); // NOTA: Empieza DESPUÉS de la pausa (">")
                }

                tlCap3.to(item, {
                    autoAlpha: 0, // Fades out and sets visibility hidden
                    scale: 0.5, filter: 'blur(30px)',
                    duration: 1.5, pointerEvents: 'none', ease: "power2.inOut"
                });
            });

            // FINAL CLEANUP FOR MANIFESTO GHOSTING
            tlCap3.to('#capitulo-3', {
                autoAlpha: 0,
                visibility: 'hidden',
                duration: 0.5
            });

            // --- SECCIÓN 5: EL NÚCLEO (CONTROL DE PAUSAS POR DISTANCIA) ---
            // La atención se logra mediante la altura de las secciones en el JSX.

            // --- CAPÍTULO 4: EJECUCIÓN (PINNED SHOWCASE) ---
            gsap.timeline({
                scrollTrigger: {
                    trigger: "#capacidades",
                    start: "top top",
                    end: "+=600%",
                    pin: true,
                    pinSpacing: true,
                    scrub: 1,
                    refreshPriority: 12,
                    fastScrollEnd: true,
                    onToggle: (self) => {
                        if (self.isActive) {
                            setCurrentChapter('EJECUCIÓN');
                            setChapterNumber('4');
                        }
                    },
                    snap: {
                        snapTo: [0, 1],
                        duration: { min: 0.4, max: 1.0 },
                        delay: 0.1,
                        ease: "power2.out"
                    }
                }
            });

            // --- CAPÍTULO 5: EL NÚCLEO (PINNED TEAM & ALMA) ---
            const tlNucleoGlobal = gsap.timeline({
                scrollTrigger: {
                    trigger: "#nucleo",
                    start: "top top",
                    end: "+=500%", // Extended space for team and Alma
                    pin: true,
                    pinSpacing: true,
                    scrub: 1,
                    refreshPriority: 11,
                    fastScrollEnd: true,
                    anticipatePin: 1,
                    onEnter: () => {
                        setCurrentChapter('EL NÚCLEO');
                        setChapterNumber('5');
                    },
                    onEnterBack: () => {
                        setCurrentChapter('EL NÚCLEO');
                        setChapterNumber('5');
                    }
                }
            });

            // Secuencia Explícita y Simétrica para el Equipo (Totalmente atada al scroll)
            const rows = gsap.utils.toArray<HTMLElement>('.team-member-row');

            // --- INTEGRANTE 1: CEO (USUARIO) ---
            const row1 = rows[0];
            const l1 = row1.querySelector('.rift-left');
            const r1 = row1.querySelector('.rift-right');
            const img1 = row1.querySelector('.rift-img');
            // const id1 = row1.querySelector('.rift-id');

            // Entrada CEO
            tlNucleoGlobal.to(row1, { opacity: 1, pointerEvents: 'all', duration: 0.5 }, "+=0.2")
                .to(l1, { xPercent: -100, duration: 1.5, ease: "power4.inOut" }, "<")
                .to(r1, { xPercent: 100, duration: 1.5, ease: "power4.inOut" }, "<")
                .to(img1, { opacity: 0.95, scale: 1.1, duration: 1.5, ease: "power4.inOut" }, "<");

            // Pausa CEO
            tlNucleoGlobal.to({}, { duration: 3 });

            // Salida CEO
            tlNucleoGlobal.to(row1, { opacity: 0, pointerEvents: 'none', duration: 0.5 }, ">")
                .to(l1, { xPercent: 0, duration: 1, ease: "power2.in" }, "<")
                .to(r1, { xPercent: 0, duration: 1, ease: "power2.in" }, "<")
                .to(img1, { opacity: 0, scale: 1, duration: 1 }, "<");

            // --- INTEGRANTE 2: CTO (GAEL) ---
            const row2 = rows[1];
            const l2 = row2.querySelector('.rift-left');
            const r2 = row2.querySelector('.rift-right');
            const img2 = row2.querySelector('.rift-img');
            // const id2 = row2.querySelector('.rift-id');

            // Entrada CTO
            tlNucleoGlobal.to(row2, { opacity: 1, pointerEvents: 'all', duration: 0.5 }, ">+0.5")
                .to(l2, { xPercent: -100, duration: 1.5, ease: "power4.inOut" }, "<")
                .to(r2, { xPercent: 100, duration: 1.5, ease: "power4.inOut" }, "<")
                .to(img2, { opacity: 0.95, scale: 1.1, duration: 1.5, ease: "power4.inOut" }, "<");

            // Pausa CTO
            tlNucleoGlobal.to({}, { duration: 3 });

            // Salida CTO
            tlNucleoGlobal.to(row2, { opacity: 0, pointerEvents: 'none', duration: 0.5 }, ">")
                .to(l2, { xPercent: 0, duration: 1, ease: "power2.in" }, "<")
                .to(r2, { xPercent: 0, duration: 1, ease: "power2.in" }, "<")
                .to(img2, { opacity: 0, scale: 1, duration: 1 }, "<");

            // --- INTEGRANTE 3: ALMA ---
            const row3 = rows[2];
            if (row3) {
                const l3 = row3.querySelector('.rift-left');
                const r3 = row3.querySelector('.rift-right');
                const img3 = row3.querySelector('.rift-img');
                // const id3 = row3.querySelector('.rift-id');

                // Entrada ALMA
                tlNucleoGlobal.to(row3, { opacity: 1, pointerEvents: 'all', duration: 0.5 }, ">+0.5")
                    .to(l3, { xPercent: -100, duration: 1.5, ease: "power4.inOut" }, "<")
                    .to(r3, { xPercent: 100, duration: 1.5, ease: "power4.inOut" }, "<")
                    .to(img3, { opacity: 0.95, scale: 1.1, duration: 1.5, ease: "power4.inOut" }, "<");

                // Pausa ALMA
                tlNucleoGlobal.to({}, { duration: 3 });

                // ALMA PERMANECE: Fusión de Precisión (Eliminar grises)
                tlNucleoGlobal.to("#nucleo", {
                    background: "linear-gradient(to bottom, #FFFFFF 0%, #FFFFFF 55%, #050505 90%)",
                    duration: 1.2,
                    ease: "power2.inOut"
                }, "<");
            }

            // Pausa mínima antes de liberar el pin para permitir lectura
            tlNucleoGlobal.to({}, { duration: 1 });

            // --- CAPÍTULO 6: SIMBIOSIS CINEMÁTICA ---
            const tlSimbiosis = gsap.timeline({
                scrollTrigger: {
                    trigger: "#simbiosis",
                    start: "top top",
                    end: "+=200%",
                    pin: true,
                    pinSpacing: true,
                    scrub: 1,
                    anticipatePin: 1,
                    refreshPriority: 10,
                    fastScrollEnd: true,
                    onEnter: () => {
                        setCurrentChapter('SIMBIOSIS');
                        setChapterNumber('6');
                    },
                    onEnterBack: () => {
                        setCurrentChapter('SIMBIOSIS');
                        setChapterNumber('6');
                    }
                }
            });

            // Simbiosis content is always visible
            tlSimbiosis.to({}, { duration: 2.5 }); // Pausa de lectura optimizada (reducida a la mitad)

            // --- ENTRANCE GLITCH TRIGGER (CAP 6 -> 7) ---
            ScrollTrigger.create({
                trigger: "#entrance-trigger",
                start: "top 80%",
                onEnter: () => {
                    if (entranceGlitchRef.current) {
                        (entranceGlitchRef.current as any).triggerGlitch?.();
                    }
                }
            });

            // --- 7. CAPITULO 7: EL SALTO (EXACT RECREATION OF ORIGINAL NARRATIVE) ---
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
                        refreshPriority: 9,
                        fastScrollEnd: true,
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
                ctaTl.to({}, { duration: 1 }); // Wait time
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

            // --- HUD UPDATER: REMOVED MANUAL TRIGGERS, NOW INTEGRATED ABOVE ---
            // Triggers for 4, 5, 6 are now handled in their pinned timelines above.

            // Dedicated trigger for EL SALTO (Cap 7)
            ScrollTrigger.create({
                trigger: "#capitulo-7",
                start: "top center",
                end: "bottom center",
                refreshPriority: 4,
                onToggle: (self) => {
                    if (self.isActive) {
                        setCurrentChapter('EL SALTO');
                        setChapterNumber('7');
                    }
                }
            });

            // CONTACTO (Footer)
            ScrollTrigger.create({
                trigger: "footer",
                start: "top 90%",
                onEnter: () => {
                    setCurrentChapter('CONTACTO');
                    setChapterNumber('8');
                },
                onLeaveBack: () => {
                    setCurrentChapter('EL SALTO');
                    setChapterNumber('7');
                }
            });

            // CRITICAL: Sort all triggers to ensure pin-spacers are calculated in narrative order
            ScrollTrigger.sort();
            ScrollTrigger.refresh();

        }, containerRef.current || undefined);

        return () => ctx.revert();
    }, []);

    return (
        <>
            {isLoading && <Loader onComplete={() => setIsLoading(false)} />}
            <div ref={containerRef} style={{
            width: '100%',
            backgroundColor: '#fff',
            cursor: 'none !important' // FORZAR CURSOR PERSONALIZADO SIEMPRE
        }}>

            {/* CAPA BASE IRIDISCENTE (Solo visible en Hero) */}
            <div className="iridescent-layer" style={{
                position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
                background: 'radial-gradient(ellipse at 30% 20%, #ffffff 0%, #f4f6f9 50%, #e2e6eb 100%)',
                opacity: 1,
            }}></div>

            {/* SECCIÓN 1: HERO PORTAL */}
            <section className="cinematic-content" style={{
                position: 'relative',
                width: '100%', height: '100vh',
                zIndex: 1000,
                overflow: 'hidden' // BLOCK SIDE MARGIN BUG
            }}>
                <div id="hud-marker-1" style={{ position: 'absolute', top: 0, height: '1px' }} />
                {/* FONDO ESENCIA INTEGRADO */}
                {mountEssence && (
                    <div style={{ position: 'absolute', inset: 0, zIndex: -1 }}>
                        <EssenceBackground paused={false} />
                    </div>
                )}

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
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '20px', overflow: 'hidden' }}>
                        {/* VIDEO DE FONDO: Esencia Hero Ultra */}
                        <video
                            src={essenceHeroVideo}
                            autoPlay muted loop playsInline
                            style={{
                                width: '100%', height: '100%',
                                objectFit: 'cover', opacity: 0.8
                            }}
                        />
                    </div>

                    {/* 1.2 CAPA DE TEXTO (Encima del Video, sin restricciones de overflow) */}
                    <div ref={heroTextRef} className="text-container" style={{ textAlign: 'center', zIndex: 10, position: 'relative' }}>
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
                                <span className="word-esenc" style={{ display: 'inline-block' }}>ESENC</span>
                                <span className="hero-char-ia" style={{ display: 'inline-block', position: 'relative', transformOrigin: '70% 50%' }}>IA</span>
                            </div>
                        </h1>
                    </div>
                </div>

                {/* CAPA 2: CAPA NEGRA INTERMEDIA (Transición) */}
                <div ref={redLayerRef} style={{
                    position: 'absolute', inset: 0, zIndex: 2,
                    backgroundColor: '#000000', // Modificado a NEGRO por solicitud
                    mixBlendMode: 'normal'
                }} />

                {/* CAPA 3: PARED BLANCA CON RECORTE EN LA "N" */}
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 3,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: '100%', height: '100%'
                }}>
                    <svg ref={maskGroupRef} viewBox="0 0 17009 2588" width="80%" style={{ height: 'auto', overflow: 'visible' }}>
                        <defs>
                            <mask id="n-portal-mask">
                                <rect x="-50000" y="-50000" width="100000" height="100000" fill="white" />
                                {logoPaths[3].startsWith('M') ?
                                    <path d={logoPaths[3]} fill="black" /> :
                                    <polygon points={logoPaths[3]} fill="black" />
                                }
                            </mask>
                        </defs>
                        <rect x="-50000" y="-50000" width="100000" height="100000" fill="white" mask="url(#n-portal-mask)" />
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
            </section>

            <section id="identidad" style={{
                minHeight: '100vh',
                width: '100%',
                backgroundColor: '#FFF',
                position: 'relative',
                zIndex: 900, // Narrative Shield
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
            }}>
                <div id="hud-marker-2" style={{ position: 'absolute', top: 0, height: '1px' }} />
                {/* FONDO NEURAL INTEGRADO */}
                {/* Alma Section removida por redundancia (ya integrada en el Rift) */}
                {mountNeural && (
                    <div className="neural-container" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                        <NeuralNetworkALMA />
                    </div>
                )}

                <div className="identidad-headline-container" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', perspective: '1000px', width: '100%', maxWidth: '800px' }}>

                    {/* BLOCK 1: NO SOMOS UNA AGENCIA... */}
                    <div className="entropy-block-1" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <h2 className="entropy-el" style={{
                            fontSize: 'clamp(1.5rem, 3.5vw, 3rem)',
                            fontWeight: 800,
                            margin: 0,
                            lineHeight: 1.1,
                            color: '#000',
                            textShadow: '-5px 10px 20px rgba(0,0,0,0.15)', // Sombra física para el texto
                            opacity: 0, // GSAP manejará esto
                            filter: 'blur(20px)',
                            transform: 'scale(0.8)',
                            willChange: 'opacity, filter, transform'
                        }}>
                            NO SOMOS UNA
                        </h2>
                        <h2 className="entropy-el" style={{
                            fontSize: 'clamp(1.5rem, 3.5vw, 3rem)',
                            fontWeight: 800,
                            margin: 0,
                            lineHeight: 1.1,
                            color: '#000', // Modificado a NEGRO por el screenshot
                            textShadow: '-5px 10px 20px rgba(0,0,0,0.15)', // Sombra física para el texto
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
                            filter: 'blur(40px)', // Original era 40px
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

            {/* BRIDGE GRADIENT: WHITE (IDENTIDAD) -> BLUE (MANIFIESTO) */}
            <div style={{
                width: '100%',
                height: '15vh',
                background: 'linear-gradient(to bottom, #f8fafc 0%, #0A192F 100%)',
                position: 'relative',
                zIndex: 850 // BETWEEN IDENTIDAD (900) AND MANIFIESTO (800)
            }} />

            {/* --- SECCIÓN 3: CAPÍTULO 3 (EL MANIFIESTO CON VELO IRIDISCENTE) --- */}
            <section id="capitulo-3" style={{
                height: '100vh',
                width: '100%',
                backgroundColor: '#000000',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                zIndex: 800, // Narrative Shield
                position: 'relative'
            }}>
                <div id="hud-marker-3" style={{ position: 'absolute', top: 0, height: '1px' }} />
                {/* ATMOSPHERIC WHITE FOG OVERLAY (FOR SEAMLESS TRANSITION) */}
                <div className="manifesto-white-fog" style={{
                    position: 'absolute', inset: 0,
                    backgroundColor: '#FFFFFF',
                    opacity: 0,
                    zIndex: 10,
                    pointerEvents: 'none'
                }} />
                {/* EL PRISMA (EL REGRESO DEL REY): GEOMETRÍA ÉLITE AGENCIA */}
                {mountPrism && (
                    <div className="prism-background-container" style={{
                        position: 'absolute', inset: 0, zIndex: -1,
                        width: '100%', height: '100%'
                    }}>
                        <Prism
                            ref={prismRef}
                            animationType="drift" timeScale={0.3} height={3.0} baseWidth={6.0}
                            scale={2.2} hueShift={0} colorFrequency={1} noise={0} glow={1.2}
                            hoverStrength={3.5} inertia={0.12} bloom={0.8}
                        />
                    </div>
                )}

                {/* CINEMATIC GRAIN OVERLAY - LUSION GRADE TEXTURE */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    opacity: 0.08, pointerEvents: 'none', mixBlendMode: 'overlay', zIndex: 1
                }} />

                <style>{`
                    @keyframes liquid-shift {
                        0% { transform: scale(1) rotate(0deg) translate(0, 0); filter: blur(100px) hue-rotate(0deg); }
                        50% { transform: scale(1.3) rotate(5deg) translate(5%, 5%); filter: blur(120px) hue-rotate(15deg); }
                        100% { transform: scale(1.1) rotate(-5deg) translate(-5%, -5%); filter: blur(90px) hue-rotate(-15deg); }
                        }
                `}</style>

                {/* MANIFESTO ITEMS */}
                {MANIFESTO.map((item, i) => (
                    <div
                        key={item.title}
                        className={`manifesto-item manifesto-item-${i}`}
                        style={{
                            display: 'flex', flexDirection: 'column', justifyContent: 'center',
                            alignItems: 'center', textAlign: 'center', padding: 'clamp(2rem, 5vw, 4rem)',
                            width: '100%', boxSizing: 'border-box', zIndex: 10,
                        }}
                    >
                        <h2 style={{
                            fontSize: 'clamp(1.5rem, 5vw, 6rem)', lineHeight: 1.1, textTransform: 'uppercase',
                            marginBottom: '2rem', color: '#FFF', fontWeight: 900,
                            letterSpacing: '-0.02em', textShadow: '0 4px 20px rgba(0,0,0,0.8)',
                        }}>
                            <ScrambleText
                                text={item.title} speed={1.2} iridescent={true}
                                finalColor="#FFFFFF" trigger={activeManifestoItem === i}
                            />
                        </h2>

                        <div style={{
                            fontSize: 'clamp(1rem, 1.8vw, 1.3rem)', lineHeight: 1.6,
                            color: 'rgba(255,255,255,0.85)', textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                            fontFamily: 'monospace', maxWidth: '800px',
                        }}>
                            {item.body.map((line, j) => (
                                <p key={j} className={`manifesto-body-line ${i === 3 ? 'imposible-climax' : ''}`} style={{
                                    margin: '0 0 0.8rem 0',
                                    opacity: 0,
                                    fontWeight: i === 3 ? 900 : 500,
                                    fontSize: i === 3 ? 'clamp(1.5rem, 3vw, 2.5rem)' : 'inherit',
                                    color: i === 3 && line.includes('imposible') ? '#00FF99' : 'inherit',
                                    textShadow: i === 3
                                        ? '0 0 20px rgba(0,255,153,0.5), 0 0 40px rgba(0,255,153,0.2)'
                                        : '1px 1px 2px #000, 0 4px 12px rgba(0,0,0,1), 0 10px 40px rgba(0,0,0,0.8)',
                                    transition: 'all 0.8s cubic-bezier(0.19, 1, 0.22, 1)'
                                }}>
                                    <AsciiRipple text={line} autoTrigger={true} trigger={activeManifestoItem === i} />
                                </p>
                            ))}
                        </div>
                    </div>
                ))}
            </section>

            {/* --- SECCIÓN 4: CAPACIDADES (SHOWCASE SLIDER) --- */}
            <section id="capacidades" style={{
                position: 'relative',
                zIndex: 700, // Normalized Z-Index
                backgroundColor: '#FFFFFF',
                minHeight: '100vh',
                overflow: 'hidden'
            }}>
                <div id="hud-marker-4" style={{ position: 'absolute', top: 0, height: '1px' }} />
                <ShowcaseSlider />
            </section>

            {/* --- SECCIÓN 5: EL NÚCLEO (TEAM RIFT) --- */}
            <section id="nucleo" style={{
                position: 'relative',
                zIndex: 600, // Narrative Shield
                backgroundColor: '#FFFFFF',
                width: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div id="hud-marker-5" style={{ position: 'absolute', top: 0, height: '1px' }} />
                <h2 style={{
                    fontSize: 'clamp(2.5rem, 5vw, 5rem)',
                    padding: '5vh 0 2rem',
                    fontWeight: 900,
                    textAlign: 'center',
                    color: '#000',
                    margin: 0
                }}>
                    EL NÚCLEO
                </h2>

                {/* TEAM LIST WITH TOTAL FUSION COMPACTNESS */}
                <div className="team-container" style={{ position: 'relative', width: '100%', height: '85vh' }}>
                    {team.map((member) => (
                        <div key={member.id} className="team-member-row" style={{
                            position: 'absolute', inset: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            opacity: 0, pointerEvents: 'none' // Inicialmente invisibles y no interactuables
                        }}>
                            <div className="rift-row"
                                style={{
                                    width: '100%', height: '80vh', // Más inmersivo
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    overflow: 'hidden',
                                    backgroundColor: 'transparent', position: 'relative'
                                }}>

                                {/* BACKGROUND PHOTO / CUSTOM ALMA CORE */}
                                <div className="rift-img" style={{
                                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                    zIndex: 0, transition: 'none', opacity: 0
                                }}>
                                    {member.isAlma ? (
                                        <div style={{
                                            width: '100%', height: '100%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            backgroundColor: 'transparent'
                                        }}>
                                            <div style={{
                                                width: 'clamp(280px, 30vw, 450px)',
                                                aspectRatio: '2.5 / 1',
                                                maskImage: `url(${almaLogo})`,
                                                WebkitMaskImage: `url(${almaLogo})`,
                                                maskSize: 'contain', WebkitMaskSize: 'contain',
                                                maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat',
                                                maskPosition: 'center', WebkitMaskPosition: 'center',
                                                backgroundColor: '#000'
                                            }}>
                                                <video
                                                    src={almaVideo}
                                                    autoPlay muted loop playsInline
                                                    style={{
                                                        width: '100%', height: '100%',
                                                        objectFit: 'cover',
                                                        filter: 'brightness(1.4) contrast(1.1) saturate(1.2)'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{
                                            width: '100%', height: '100%',
                                            backgroundImage: `url(${member.img})`,
                                            backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center'
                                        }} />
                                    )}
                                </div>

                                {/* GRADIENT OVERLAY (Fusión Ultra-Limpia) */}
                                <div style={{
                                    position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%',
                                    background: 'linear-gradient(to top, #050505 0%, rgba(5,5,5,0.6) 25%, transparent 100%)',
                                    zIndex: 2, pointerEvents: 'none'
                                }} />

                                {/* LEFT: ROLE HALF (Móvil) */}
                                <div className="rift-left" style={{
                                    position: 'absolute', left: 0, top: 0, width: '50.1%', height: '100%',
                                    zIndex: 4, backgroundColor: '#FFF'
                                }} />

                                {/* RIGHT: NAME HALF (Móvil) */}
                                <div className="rift-right" style={{
                                    position: 'absolute', right: 0, top: 0, width: '50.1%', height: '100%',
                                    zIndex: 4, backgroundColor: '#FFF'
                                }} />

                                {/* TEXT OVERLAY (Diseño Senior Editorial) */}
                                <div className="rift-text-overlay" style={{
                                    position: 'absolute', bottom: '12%', left: '50%', transform: 'translateX(-50%)',
                                    width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    zIndex: 5, pointerEvents: 'none', textAlign: 'center'
                                }}>
                                    {/* ROLE / PUESTO (Oculto para ALMA) */}
                                    {!member.isAlma && (
                                        <>
                                            <h3 style={{
                                                fontSize: 'clamp(1.4rem, 2.5vw, 2.2rem)',
                                                fontWeight: 300, textAlign: 'center', margin: 0,
                                                color: '#FFF', textTransform: 'uppercase',
                                                letterSpacing: '0.6em',
                                                opacity: 0.9
                                            }}>{member.role}</h3>

                                            {/* DIVIDER */}
                                            <div style={{
                                                width: '40px', height: '1px', backgroundColor: 'rgba(255,255,255,0.3)',
                                                margin: '1.2rem 0'
                                            }} />
                                        </>
                                    )}

                                    {/* NAME / EXTRA INFO */}
                                    <span style={{
                                        fontSize: member.isAlma ? '0.7rem' : '1rem',
                                        fontFamily: 'var(--font-mono)',
                                        maxWidth: '700px',
                                        letterSpacing: '0.3em',
                                        lineHeight: 1.8,
                                        color: '#FFF',
                                        textTransform: 'uppercase',
                                        fontWeight: 400,
                                        opacity: 0.8
                                    }}>
                                        {member.name}
                                        {member.isAlma && (
                                            <>
                                                <br /><br />
                                                <span style={{ fontSize: '0.6rem', opacity: 0.6, letterSpacing: '0.2em' }}>
                                                    {member.extraInfo}
                                                </span>
                                            </>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Alma Section removida por redundancia (integrada en el Núcleo) */}

            </section>

            {/* Puente eliminado para unión directa */}

            <div id="simbiosis" style={{
                position: 'relative',
                zIndex: 700,
                backgroundColor: '#050505',
                minHeight: '100vh'
            }}>
                <div id="simbiosis-content" style={{ width: '100%', height: '100%', position: 'relative' }}>
                    <div id="hud-marker-6" style={{ position: 'absolute', top: 0, height: '1px' }} />
                    <Symbiosis />
                </div>
            </div>

            {/* BRIDGE GRADIENT: BLACK (SIMBIOSIS) -> WHITE (CAPITULO 7) */}
            <div id="entrance-trigger" style={{ height: '5vh', width: '100%', background: '#050505' }} />
            <div style={{
                width: '100%',
                height: '15vh',
                background: 'linear-gradient(to bottom, #050505 0%, #FFFFFF 100%)',
                position: 'relative',
                zIndex: 450 // BETWEEN SIMBIOSIS (500) AND SALTO (400)
            }} />
            <GlitchPortal ref={entranceGlitchRef} />

            <section
                ref={ctaSectionRef} // Attached Ref
                id="capitulo-7"
                style={{
                    height: '100vh',
                    width: '100%',
                    backgroundColor: '#FFFFFF', // Pure White
                    position: 'relative',
                    zIndex: 400, // Narrative Shield
                    overflow: 'hidden'
                }}
            >
                <div id="hud-marker-7" style={{ position: 'absolute', top: 0, height: '1px' }} />

                {/* MINIMALIST GRID (Technical Whisper) */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)',
                    backgroundSize: '40px 40px', pointerEvents: 'none', zIndex: 1
                }} />

                {/* THE PINNED CONTENT CONTAINER (Exact replica of Home.tsx structure) */}
                <div
                    className="cta-pinned-content"
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                        paddingTop: '0',
                        zIndex: 10
                    }}
                >

                    {/* Layer 1: SOMOS TEXT (Surgical Centering) */}
                    <h2
                        className="cta-somos-text"
                        style={{
                            fontSize: 'clamp(1rem, 4vw, 1.4rem)',
                            textAlign: 'center',
                            fontWeight: 900,
                            margin: '0 0 15vh 0',
                            letterSpacing: '1em',
                            paddingLeft: '1em', // CENTERING COMPENSATOR
                            width: '100%',
                            color: '#000',
                            position: 'relative',
                            zIndex: 2,
                            opacity: 1
                        }}
                    >
                        SOMOS
                    </h2>

                    {/* Layer 2: BRAIN + LOGO CONTAINER */}
                    <div
                        className="cta-brain-container"
                        style={{
                            width: 'clamp(350px, 70vw, 1000px)', // Slightly more contained
                            maxHeight: '55vh',
                            marginBottom: '10vh',
                            position: 'relative',
                            zIndex: 1,
                            transformOrigin: 'center center',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        {/* THE LOGO WITH MAGNETIC REACTION (MANTENIDA) */}
                        <div
                            ref={monolithRef}
                            className="cap7-logo-monolith"
                            onMouseMove={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                const x = (e.clientX - rect.left) / rect.width - 0.5;
                                const y = (e.clientY - rect.top) / rect.height - 0.5;
                                gsap.to(e.currentTarget, {
                                    rotationY: x * 15, rotationX: -y * 15, scale: 1.05,
                                    filter: `drop-shadow(${x * -40}px ${y * -40}px 30px rgba(0,0,0,0.1))`,
                                    duration: 0.5
                                });
                            }}
                            onMouseLeave={(e) => {
                                gsap.to(e.currentTarget, {
                                    rotationY: 0, rotationX: 0, scale: 1,
                                    filter: 'drop-shadow(0 0 0px rgba(0,0,0,0))',
                                    duration: 1
                                });
                            }}
                            style={{ position: 'relative', width: '100%', perspective: '1500px', transformStyle: 'preserve-3d' }}
                        >
                            <img src={footerLogo} alt="AgencIA Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', filter: 'brightness(0)' }} />
                            <div className="ia-light-pulse" style={{
                                position: 'absolute', right: '5%', top: '22%', width: '28%', height: '55%',
                                border: '1px solid rgba(0,0,0,0.1)', background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.05), transparent)',
                                opacity: 0, transition: 'opacity 0.3s ease', pointerEvents: 'none'
                            }} />
                        </div>
                    </div>

                    {/* Layer 3: THE CALL TO ACTION (Hidden Initially) */}
                    <div
                        className="cta-invitation-container"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            position: 'absolute',
                            top: '55%',
                            left: '50%',
                            transform: 'translateX(-50%) translateY(50px)',
                            width: '100%',
                            opacity: 0,
                            zIndex: 5
                        }}
                    >
                        <h2 style={{
                            fontSize: 'clamp(1.5rem, 4vw, 3rem)', textAlign: 'center', fontWeight: 900,
                            marginBottom: '2rem', letterSpacing: '-0.02em', color: '#000'
                        }}>
                            ¿TIENES UNA IDEA?
                        </h2>

                        <a
                            href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssM2lUv8W368QO4u3P7Z9h8r6o2l1"
                            target="_blank" rel="noopener noreferrer"
                            style={{ textDecoration: 'none' }}
                        >
                            <button
                                ref={pulseButtonRef}
                                style={{
                                    padding: '1.2rem 4.5rem',
                                    background: 'transparent',
                                    color: '#000',
                                    border: '2px solid #000', // SURGICAL OUTLINE
                                    borderRadius: '0px',
                                    fontWeight: '900',
                                    fontSize: '1.1rem',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    transition: 'all 0.4s cubic-bezier(0.19, 1, 0.22, 1)',
                                    letterSpacing: '0.25em',
                                    textTransform: 'uppercase',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1.5rem',
                                    boxShadow: '0 0px 0px rgba(0,0,0,0)'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.backgroundColor = '#000';
                                    e.currentTarget.style.color = '#00FF99';
                                    e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,255,153,0.3)';
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = '#000';
                                    e.currentTarget.style.boxShadow = '0 0px 0px rgba(0,0,0,0)';
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                <span style={{ position: 'relative', zIndex: 1 }}>Tómate un café virtual</span>
                                <span style={{ fontSize: '1.8rem' }}>→</span>
                            </button>
                        </a>
                    </div>
                </div>

                <style>{`
                    .cap7-logo-monolith:hover .ia-light-pulse {
                        opacity: 0.8;
                    }
                    .imposible-climax {
                        animation: cinematic-pulse 4s infinite ease-in-out;
                    }
                    @keyframes cinematic-pulse {
                        0%, 100% { transform: scale(1); filter: brightness(1); }
                        50% { transform: scale(1.02); filter: brightness(1.2) drop-shadow(0 0 15px rgba(0,255,153,0.3)); }
                    }
                `}</style>
            </section>
            {/* FINAL FOOTER - PURE ORIGINAL */}
            <div id="hud-marker-8" style={{ width: '100%', height: '1px' }} />
            <Footer />

            {/* CINEMATIC HUD (ODOMETER + CHAPTERS) */}
            <ChapterHUD currentChapter={currentChapter} chapterNumber={chapterNumber} />
        </div>
        </>
    );
};

export default CinematicDev;
