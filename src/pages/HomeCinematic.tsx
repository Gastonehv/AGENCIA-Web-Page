import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import essenceHeroVideo from '../assets/videos/esencia_hero_ultra.mp4'; // IMPORTACIÓN DE VIDEO
import EssenceBackground from '../components/EssenceBackground';
import NeuralNetworkALMA from '../components/NeuralNetworkALMA';
import ScrambleText from '../components/ScrambleText';
import Prism from '../components/Prism';
import ShowcaseSlider from '../components/ShowcaseSlider';
import ceoImg from '../assets/team/ceo.jpg';
import gaelImg from '../assets/team/gael_oracle.png';
import footerLogo from '../assets/logo_agencia_full.png';
import AlmaSection from '../components/AlmaSection';
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

const Home: React.FC = () => {
    const [isLoading, setIsLoading] = React.useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const entranceGlitchRef = useRef<any>(null);
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
    // Referencia para la ventana contenedora
    const windowRef = useRef<HTMLDivElement>(null);

    // Referencia al Prisma para controlarlo vía ScrollTrigger
    const prismRef = useRef<any>(null);

    // REFS FOR CHAPTER 7 (HOME REACTION RECREATION)
    const ctaSectionRef = useRef<HTMLDivElement>(null);
    const pulseButtonRef = useRef<HTMLButtonElement>(null);

    const [activeManifestoItem, setActiveManifestoItem] = React.useState(0);
    const [mountEssence, setMountEssence] = React.useState(true);
    const [mountNeural, setMountNeural] = React.useState(true);
    const [mountPrism, setMountPrism] = React.useState(false);

    // Referencia para el grupo SVG que vamos a escalar
    const maskGroupRef = useRef<SVGSVGElement>(null);

    // CHAPTER-SPECIFIC REFS (For Chapter 5 Rifts)
    const team = [
        { id: 1, role: 'CEO / VISIONARY', name: 'Arquitecto de Ecosistemas Digitales', img: ceoImg, scale: 1.35 },
        { id: 2, role: 'CTO /\nAI LEAD', name: 'Oráculo\nde Datos', img: gaelImg, scale: 1.6 },
    ];

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
                    scrub: 0.8,
                    refreshPriority: 10,
                    onToggle: (self) => {
                        if (self.isActive) {
                            setCurrentChapter('ESENCIA');
                            setChapterNumber('1');
                        }
                    },
                    onUpdate: (self) => {
                        if (self.progress > 0.99) {
                            setMountEssence(false);
                            gsap.set('.cinematic-content', { opacity: 0, visibility: 'hidden', pointerEvents: 'none' });
                        } else {
                            setMountEssence(true);
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
                scale: 150, 
                transformOrigin: "53.8% 50.1%",
                ease: "power2.inOut",
                duration: 1
            });

            tlZoom.to(redLayerRef.current, {
                autoAlpha: 0,
                ease: "power1.out",
                duration: 0.6
            }, "<");

            tlZoom.fromTo(windowRef.current,
                { scale: 0.4 },
                { scale: 0.8, duration: 1, ease: "power2.inOut" },
                "<"
            );

            tlZoom.to('.text-nuestra', {
                autoAlpha: 1, y: 0,
                duration: 0.8, ease: "power2.out"
            }, "-=0.4");

            tlZoom.to('.text-esencia', {
                autoAlpha: 1, scale: 1, filter: 'blur(0px)',
                duration: 1, ease: "power2.out"
            }, ">-0.6");

            tlZoom.to('.word-esenc', {
                width: 0, 
                opacity: 0,
                filter: 'blur(20px)',
                duration: 1.5,
                ease: "power2.inOut"
            }, ">+0.5");

            tlZoom.to('.hero-char-ia', {
                color: '#00FF99',
                textShadow: 'none',
                WebkitTextStroke: '0px',
                scale: 1.15,
                duration: 1.5,
                ease: "power2.out"
            }, "<");

            tlZoom.to(".essence-dev-wrapper", {
                opacity: 0,
                autoAlpha: 0,
                duration: 1,
                ease: 'power1.in'
            }, "<");

            tlZoom.to('.text-nuestra', {
                y: '0%',
                x: '0%',
                scale: 1.05,
                duration: 1.5,
                ease: "power2.inOut"
            }, "<");

            tlZoom.to({}, { duration: 4 }); 

            tlZoom.to('.text-nuestra', {
                opacity: 0,
                filter: 'blur(20px)',
                duration: 1.2,
                ease: "power2.inOut"
            });

            tlZoom.to('.hero-char-ia', {
                scale: 300,
                filter: 'blur(0px)',
                opacity: 0,
                duration: 2.5,
                ease: "expo.in",
                immediateRender: false
            }, ">");

            tlZoom.to('.iridescent-layer', {
                opacity: 0,
                duration: 1.5,
                ease: "power2.inOut",
                immediateRender: false
            }, "<");

            tlZoom.to(windowRef.current, {
                autoAlpha: 0,
                scale: 0.9,
                filter: 'blur(20px)',
                duration: 1.5,
                ease: "power2.in",
                immediateRender: false
            }, "<0.2");

            tlZoom.to('.iridescent-layer', {
                opacity: 0,
                duration: 1.5,
                ease: "power2.inOut",
                immediateRender: false
            }, "<");

            tlZoom.to('.cinematic-content', {
                autoAlpha: 0,
                duration: 0.5,
                ease: "power2.in",
            });

            const tlIdentidad = gsap.timeline({
                scrollTrigger: {
                    trigger: "#identidad",
                    start: "top top",
                    end: "+=800%",
                    pin: true,
                    pinSpacing: true,
                    scrub: 0.8,
                    anticipatePin: 1,
                    refreshPriority: 9,
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
                color: '#888888',
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

            tlIdentidad.to({}, { duration: 4 }); 

            tlIdentidad.to('#identidad', {
                opacity: 0,
                autoAlpha: 0,
                visibility: 'hidden',
                duration: 2,
                ease: 'power2.in'
            }, ">+0.5");

            const manifestoItems = gsap.utils.toArray<HTMLElement>('.manifesto-item');

            gsap.set(manifestoItems, {
                autoAlpha: 0,
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh',
                scale: 1.5, filter: 'blur(20px)', pointerEvents: 'none',
                display: 'flex'
            });

            const tlCap3 = gsap.timeline({
                scrollTrigger: {
                    trigger: "#capitulo-3",
                    start: "top top",
                    end: "+=1000%",
                    pin: true,
                    pinSpacing: true,
                    scrub: 0.8,
                    refreshPriority: 8,
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

                const morphProxy = { transition: 0 };
                const shapeA = i === 0 ? 3 : (i - 1) % 4;
                const shapeB = i % 4;

                tlCap3.to(item, {
                    autoAlpha: 1,
                    scale: 1, filter: 'blur(0px)', duration: 1.5,
                    pointerEvents: 'all', ease: "power2.inOut",
                    onStart: () => setActiveManifestoItem(i),
                    onReverseComplete: () => setActiveManifestoItem(Math.max(0, i - 1)),
                });

                tlCap3.to(morphProxy, {
                    transition: 1,
                    duration: 6.0,
                    ease: "power2.out",
                    onUpdate: () => {
                        if (prismRef.current) {
                            const energy = Math.sin(morphProxy.transition * Math.PI);
                            prismRef.current.setMorph(shapeA, shapeB, morphProxy.transition, energy);
                        }
                    }
                }, "<");

                tlCap3.fromTo(title, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, "-=0.5")
                    .fromTo(bodyLines, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.15 }, ">")
                    .to({}, { duration: 12 });

                if (i === manifestoItems.length - 1) {
                    tlCap3.to(item, { duration: 4 });
                    tlCap3.to('.manifesto-white-fog', {
                        opacity: 1,
                        duration: 3.5,
                        ease: "power2.inOut"
                    }, ">");
                }

                tlCap3.to(item, {
                    autoAlpha: 0,
                    scale: 0.5, filter: 'blur(30px)',
                    duration: 1.5, pointerEvents: 'none', ease: "power2.inOut"
                });
            });

            tlCap3.to('#capitulo-3', {
                autoAlpha: 0,
                visibility: 'hidden',
                duration: 0.5
            });

            ScrollTrigger.create({
                trigger: ".alma-focus-trigger",
                start: "top top",
                end: "+=1vh",
            });

            gsap.timeline({
                scrollTrigger: {
                    trigger: "#capacidades",
                    start: "top top",
                    end: "+=600%",
                    pin: true,
                    pinSpacing: true,
                    scrub: 0.8,
                    refreshPriority: 7,
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

            const tlNucleoGlobal = gsap.timeline({
                scrollTrigger: {
                    trigger: "#nucleo",
                    start: "top top",
                    end: "+=500%",
                    pin: true,
                    pinSpacing: true,
                    scrub: 0.8,
                    refreshPriority: 6,
                    onToggle: (self) => {
                        if (self.isActive) {
                            setCurrentChapter('EL NÚCLEO');
                            setChapterNumber('5');
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

            const teamRows = gsap.utils.toArray<HTMLElement>('.rift-row');
            teamRows.forEach((row, i) => {
                const left = row.querySelector('.rift-left');
                const right = row.querySelector('.rift-right');
                const img = row.querySelector('.rift-img');
                const id = row.querySelector('.rift-id');

                tlNucleoGlobal.to(row, {
                    onStart: () => {
                        gsap.to(left, { x: -40, duration: 0.8, ease: "power2.out" });
                        gsap.to(right, { x: 40, duration: 0.8, ease: "power2.out" });
                        gsap.to(img, { opacity: 0.95, scale: 1.15, duration: 1, ease: "power2.out" });
                        gsap.to(id, { opacity: 0.15, scale: 1.2, duration: 0.6 });
                    }
                }, `+=${i * 1}`);

                tlNucleoGlobal.to({}, { duration: 1 });

                tlNucleoGlobal.to(row, {
                    onStart: () => {
                        gsap.to(left, { x: 0, duration: 0.8, ease: "power2.inOut" });
                        gsap.to(right, { x: 0, duration: 0.8, ease: "power2.inOut" });
                        gsap.to(img, { opacity: 0.45, scale: 1, duration: 1, ease: "power2.inOut" });
                        gsap.to(id, { opacity: 0.05, scale: 1, duration: 0.6 });
                    }
                }, ">+1");
            });

            tlNucleoGlobal.fromTo(".alma-pinned-content", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 2 }, ">+1");
            tlNucleoGlobal.to({}, { duration: 3 });

            const tlSimbiosis = gsap.timeline({
                scrollTrigger: {
                    trigger: "#simbiosis",
                    start: "top top",
                    end: "+=400%",
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1,
                    refreshPriority: 5,
                    onToggle: (self) => {
                        if (self.isActive) {
                            setCurrentChapter('SIMBIOSIS');
                            setChapterNumber('6');
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

            tlSimbiosis.to({}, { duration: 5 });

            ScrollTrigger.create({
                trigger: "#entrance-trigger",
                start: "top 80%",
                onEnter: () => {
                    if (entranceGlitchRef.current) {
                        (entranceGlitchRef.current as any).triggerGlitch?.();
                    }
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

            ScrollTrigger.sort();
            ScrollTrigger.refresh();

        }, containerRef.current || undefined);

        return () => ctx.revert();
    }, []);

    return (
        <>
            {isLoading && (
                <Loader onComplete={() => {
                    setIsLoading(false);
                    ScrollTrigger.refresh();
                }} />
            )}
        <div ref={containerRef} style={{
            width: '100%',
            backgroundColor: '#fff',
            cursor: 'none !important'
        }}>

            <div className="iridescent-layer" style={{
                position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
                background: 'radial-gradient(ellipse at 30% 20%, #ffffff 0%, #f4f6f9 50%, #e2e6eb 100%)',
                opacity: 1,
            }}></div>

            <section className="cinematic-content" style={{
                position: 'relative',
                width: '100%', height: '100vh',
                zIndex: 1000,
                overflow: 'hidden'
            }}>
                <div id="hud-marker-1" style={{ position: 'absolute', top: 0, height: '1px' }} />
                {mountEssence && (
                    <div style={{ position: 'absolute', inset: 0, zIndex: -1 }}>
                        <EssenceBackground paused={false} />
                    </div>
                )}

                <div ref={windowRef} style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '60vw', height: '35vw',
                    borderRadius: '20px',
                    boxShadow: '-40px 50px 60px rgba(0,0,0,0.5), -15px 20px 25px rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    backgroundColor: '#000000',
                    zIndex: 1,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    overflow: 'visible'
                }}>
                    <div style={{ position: 'absolute', inset: 0, borderRadius: '20px', overflow: 'hidden' }}>
                        <video
                            src={essenceHeroVideo}
                            autoPlay muted loop playsInline
                            style={{
                                width: '100%', height: '100%',
                                objectFit: 'cover', opacity: 0.8
                            }}
                        />
                    </div>

                    <div className="text-container" style={{ textAlign: 'center', zIndex: 10, position: 'relative' }}>
                        <h1 style={{
                            fontSize: 'clamp(2rem, 8vw, 10rem)',
                            lineHeight: 0.9, fontWeight: 900, letterSpacing: '-0.04em', margin: 0,
                            textTransform: 'uppercase', color: '#000000',
                            textShadow: '0 0 5px rgba(255,255,255,1), 0 0 15px rgba(255,255,255,0.8), 0 0 40px rgba(255,255,255,0.5)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <span className="text-nuestra" style={{
                                display: 'inline-block', fontSize: '0.4em', letterSpacing: '0.2em', marginBottom: '0.2em',
                                textShadow: '0 0 5px rgba(255,255,255,0.9), 0 0 10px rgba(255,255,255,0.6)',
                                opacity: 0, transform: 'translateY(20px)'
                            }}>
                                NUESTRA
                            </span>

                            <div className="text-esencia" style={{
                                display: 'flex', gap: '0', whiteSpace: 'nowrap',
                                opacity: 0, transform: 'scale(0.9)', filter: 'blur(10px)'
                            }}>
                                <span className="word-esenc" style={{ display: 'inline-block', overflow: 'hidden' }}>ESENC</span>
                                <span className="hero-char-ia" style={{ display: 'inline-block', position: 'relative', transformOrigin: '70% 50%' }}>IA</span>
                            </div>
                        </h1>
                    </div>
                </div>

                <div ref={redLayerRef} style={{
                    position: 'absolute', inset: 0, zIndex: 2,
                    backgroundColor: '#000000',
                    mixBlendMode: 'normal'
                }} />

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
                zIndex: 900,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
            }}>
                <div id="hud-marker-2" style={{ position: 'absolute', top: 0, height: '1px' }} />
                {mountNeural && (
                    <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.15, pointerEvents: 'none' }}>
                        <NeuralNetworkALMA />
                    </div>
                )}

                <div className="identidad-text-container" style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '1200px', padding: '0 2rem' }}>
                    <div style={{ marginBottom: '8rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h2 style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <span className="entropy-el" style={{ fontSize: 'clamp(2rem, 6vw, 5rem)', fontWeight: 900, color: '#000', opacity: 0, filter: 'blur(10px)', transform: 'scale(0.8)' }}>ENTROPÍA</span>
                            <span className="entropy-el" style={{ fontSize: 'clamp(2rem, 6vw, 5rem)', fontWeight: 900, color: '#000', opacity: 0, filter: 'blur(10px)', transform: 'scale(0.8)' }}>VOLCÁNICA</span>
                        </h2>
                        <div className="entropy-catchphrase" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.8rem)', fontWeight: 300, letterSpacing: '0.4em', marginTop: '2rem', opacity: 0, filter: 'blur(5px)', transform: 'scale(1.1)' }}>
                            CREATIVIDAD SIN LÍMITES
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4rem', marginBottom: '8rem' }}>
                        <div className="entropy-line" style={{ width: '4px', height: '100px', backgroundColor: '#00FF99', transform: 'scaleY(0)', transformOrigin: 'top' }}></div>
                        <h3 className="entropy-finish" style={{ fontSize: 'clamp(2.5rem, 8vw, 7rem)', fontWeight: 900, color: '#000', margin: 0, opacity: 0, filter: 'blur(20px)' }}>SOMOS LA IA QUE ESTÁS BUSCANDO</h3>
                    </div>

                    <div className="entropy-body" style={{ opacity: 0, transform: 'translateY(30px)', filter: 'blur(10px)' }}>
                        <p style={{ fontSize: 'clamp(1rem, 1.5vw, 1.4rem)', color: '#666', maxWidth: '800px', margin: '0 auto', lineHeight: 1.8 }}>
                            En AgencIA, no usamos la inteligencia artificial para automatizar la mediocridad, sino para amplificar la genialidad humana. Cada pixel, cada línea de código y cada estrategia es una colisión entre el caos creativo y el orden algorítmico.
                        </p>
                    </div>
                </div>
            </section>

            <section id="capitulo-3" style={{ height: '100vh', width: '100%', backgroundColor: '#000', position: 'relative', zIndex: 850, overflow: 'hidden' }}>
                <div id="hud-marker-3" style={{ position: 'absolute', top: 0, height: '1px' }} />
                <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
                    <Prism ref={prismRef} active={mountPrism} />
                </div>
                
                <div className="manifesto-white-fog" style={{ position: 'absolute', inset: 0, zIndex: 5, backgroundColor: '#FFFFFF', opacity: 0, pointerEvents: 'none' }}></div>

                <div className="manifesto-items-container" style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%' }}>
                    {MANIFESTO.map((item, i) => (
                        <div key={i} className="manifesto-item" style={{
                            flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 10vw'
                        }}>
                            <h2 style={{
                                fontSize: 'clamp(2rem, 5vw, 4.5rem)', fontWeight: 900, color: '#00FF99', marginBottom: '4rem', letterSpacing: '-0.02em',
                                textShadow: '0 0 20px rgba(0,255,153,0.3)'
                            }}>
                                <ScrambleText text={item.title} trigger={activeManifestoItem === i} />
                            </h2>
                            <div className="manifesto-body" style={{ maxWidth: '900px' }}>
                                {item.body.map((line, j) => (
                                    <p key={j} className="manifesto-body-line" style={{
                                        fontSize: 'clamp(1.2rem, 2vw, 1.8rem)', color: '#FFFFFF', marginBottom: '1rem', fontWeight: 300, lineHeight: 1.4, opacity: 0.8
                                    }}>
                                        {line}
                                    </p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="alma-focus-trigger" style={{ height: '10vh', width: '100%' }} />
            <section id="capacidades" style={{ height: '100vh', width: '100%', backgroundColor: '#fff', position: 'relative', zIndex: 800 }}>
                <div id="hud-marker-4" style={{ position: 'absolute', top: 0, height: '1px' }} />
                <ShowcaseSlider />
            </section>

            <section id="nucleo" style={{ height: '100vh', width: '100%', backgroundColor: '#000', position: 'relative', zIndex: 700, display: 'flex', flexDirection: 'column', justifyContent: 'center', overflow: 'hidden' }}>
                <div id="hud-marker-5" style={{ position: 'absolute', top: 0, height: '1px' }} />
                
                <div className="team-container" style={{ position: 'relative', zIndex: 10, width: '100%' }}>
                    {team.map((member) => (
                        <div key={member.id} className="rift-row" style={{
                            position: 'relative', width: '100%', height: '35vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer'
                        }}>
                            <div className="rift-left" style={{ position: 'absolute', left: '10%', zIndex: 2 }}>
                                <span style={{ fontSize: '1rem', color: '#00FF99', fontWeight: 900, letterSpacing: '0.3em' }}>{member.role}</span>
                            </div>
                            <div className="rift-img-container" style={{ position: 'relative', width: '25vw', height: '25vh', overflow: 'hidden' }}>
                                <img className="rift-img" src={member.img} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.45, filter: 'grayscale(100%)', transition: 'all 0.8s cubic-bezier(0.19, 1, 0.22, 1)' }} />
                            </div>
                            <div className="rift-right" style={{ position: 'absolute', right: '10%', zIndex: 2, textAlign: 'right' }}>
                                <span style={{ fontSize: '1.5rem', color: '#fff', fontWeight: 300, letterSpacing: '0.1em' }}>{member.name}</span>
                            </div>
                            <div className="rift-id" style={{ position: 'absolute', fontSize: '20rem', fontWeight: 900, color: '#fff', opacity: 0.05, zIndex: 1, pointerEvents: 'none' }}>0{member.id}</div>
                        </div>
                    ))}
                </div>

                <div className="alma-pinned-content" style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ width: '100%', height: '100%', pointerEvents: 'all' }}>
                        <AlmaSection />
                    </div>
                </div>
            </section>

            <section id="simbiosis" style={{ height: '100vh', width: '100%', backgroundColor: '#050505', position: 'relative', zIndex: 600, overflow: 'hidden' }}>
                <div id="simbiosis-content" style={{ width: '100%', height: '100%', position: 'relative' }}>
                    <div id="hud-marker-6" style={{ position: 'absolute', top: 0, height: '1px' }} />
                    <Symbiosis />
                </div>
            </section>

            <div id="entrance-trigger" style={{ height: '5vh', width: '100%', background: '#050505' }} />
            <div style={{
                width: '100%',
                height: '15vh',
                background: 'linear-gradient(to bottom, #050505 0%, #FFFFFF 100%)',
                position: 'relative',
                zIndex: 450
            }} />
            <GlitchPortal ref={entranceGlitchRef} />

            <section
                ref={ctaSectionRef}
                id="capitulo-7"
                style={{
                    height: '100vh',
                    width: '100%',
                    backgroundColor: '#FFFFFF',
                    position: 'relative',
                    zIndex: 400,
                    overflow: 'hidden'
                }}
            >
                <div id="hud-marker-7" style={{ position: 'absolute', top: 0, height: '1px' }} />

                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)',
                    backgroundSize: '40px 40px', pointerEvents: 'none', zIndex: 1
                }} />

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
                    <h2
                        className="cta-somos-text"
                        style={{
                            fontSize: 'clamp(1rem, 4vw, 1.4rem)',
                            textAlign: 'center',
                            fontWeight: 900,
                            margin: '0 0 15vh 0',
                            letterSpacing: '1em',
                            paddingLeft: '1em',
                            width: '100%',
                            color: '#000',
                            position: 'relative',
                            zIndex: 2,
                            opacity: 1
                        }}
                    >
                        SOMOS
                    </h2>

                    <div
                        className="cta-brain-container"
                        style={{
                            width: 'clamp(350px, 70vw, 1000px)',
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
                        <div
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
                        </div>
                    </div>

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
                                    border: '2px solid #000',
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
                `}</style>
            </section>
            
            <div id="hud-marker-8" style={{ width: '100%', height: '1px' }} />
            <Footer />

            <ChapterHUD 
                currentChapter={currentChapter} 
                chapterNumber={chapterNumber}
            />
        </div>
        </>
    );
};

export default Home;
