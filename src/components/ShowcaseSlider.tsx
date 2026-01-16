import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScroll } from '../context/ScrollContext'; // Import useScroll
import techArchitectureImg from '../assets/images/architecture_digital.jpg';
import architectureVideo from "../assets/videos/web_apps_final_opt.mp4";
import automationVideo from '../assets/videos/automatizacion_final_opt.mp4';
import marketingVideo from '../assets/videos/marketing_final_opt.mp4';

gsap.registerPlugin(ScrollTrigger);

interface ShowcaseSliderProps {
    initialHash?: string;
}

const CASES = [
    {
        id: '01',
        title: 'PÁGINAS WEB Y APPS',
        subtitle: 'Arquitectura para Alto Rendimiento',
        desc: 'Sistemas y sitios digitales que no solo existen, dominan. Ecosistemas diseñados para resistir tráfico masivo y operaciones críticas.',
        fullDesc: 'Construimos la interfaz de tu autoridad. Creamos plataformas web y aplicaciones de alto rendimiento que proyectan poder y escalan tu negocio sin límites.',
        humanDesc: 'Tu negocio necesita un activo digital, no un folleto. Hacemos webs y apps que aguantan millones de usuarios y se cargan en milisegundos. Si no domina, no es AgencIA.',
        services: 'Desarrollo Web de Élite, Apps Inmersivas, SaaS Escalables',
        humanServices: 'Webs Premium, Apps para Negocio, Plataformas de Software',
        buttonCopy: 'NIVEL DE ACCESO: HUMANO',
        year: '2025',
        img: techArchitectureImg,
        video: architectureVideo,
        path: '/infraestructura',
        ctaCopy: 'CONSTRUIR ACTIVOS'
    },
    {
        id: '02',
        title: 'AUTOMATIZACIÓN E IA',
        subtitle: 'Sistemas que Operan por Ti',
        desc: 'El fin de la micro-gestión. Implementamos cerebros digitales que optimizan procesos y escalan tu operación sin intervención humana.',
        fullDesc: 'Implementamos la "Plataforma 360", un ecosistema donde la IA asume el control operativo de tu negocio. Ventas, soporte y agendamiento ocurren solos con precisión absoluta.',
        humanDesc: 'Imagina un ejército de clones perfectos que venden, atienden y organizan tu empresa mientras tú te enfocas en liderar su crecimiento.',
        services: 'Agentes Autónomos de IA, Flujos Automáticos, Sistemas de Control',
        humanServices: 'Vendedor IA 24/7, Procesos en Piloto Automático, Ahorro Operativo',
        buttonCopy: 'VERSIÓN SIMPLIFICADA',
        year: '2025',
        img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
        video: automationVideo,
        path: '/automatizacion',
        ctaCopy: 'ACTIVAR ECOSISTEMA'
    },
    {
        id: '03',
        title: 'ESTRATEGIA Y MARKETING',
        subtitle: 'Ingeniería para Dominar tu Mercado',
        desc: 'No diseñamos logos, codificamos respeto. Estrategia de crecimiento e identidad inmersiva diseñada para posicionarte como líder indiscutible.',
        fullDesc: 'Trascendemos lo visual para diseñar sistemas de dominio de mercado. Tu marca dejará de competir para empezar a reinar mediante estrategias de adquisición y conversión de alto impacto.',
        humanDesc: 'El marketing de AgencIA no es publicidad, es conquista. Hacemos que tu marca se vea tan poderosa que la confianza de tus clientes sea absoluta y la competencia se vuelva irrelevante.',
        services: 'Estrategia de Crecimiento, Marketing de Autoridad, Branding Pro',
        humanServices: 'Ventas Escalables, Imagen de Líder, Campaños de Alto Impacto',
        buttonCopy: 'ENTENDER EL CONCEPTO',
        year: '2025',
        img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
        video: marketingVideo,
        path: '/identidad',
        ctaCopy: 'DOMINAR MERCADO'
    },
];

const ShowcaseSlider: React.FC<ShowcaseSliderProps> = ({ initialHash }) => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const navigate = useNavigate();
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const cardContainerRefs = useRef<(HTMLDivElement | null)[]>([]); // New ref for the outer card
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]); // Keeps existing ref for image window (Parallax)
    // Fix: Allow both Div and Video elements for the parallax target
    const imagesRef = useRef<(HTMLElement | null)[]>([]);

    const { lenis } = useScroll(); // Need Lenis for precision scrolling

    // Floating Indicator State
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const indicatorRef = useRef<HTMLDivElement>(null);

    // Track Mouse
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Animate Indicator Position (Magnetic Smoothing)
    useEffect(() => {
        if (indicatorRef.current && isHovering) {
            gsap.to(indicatorRef.current, {
                x: mousePos.x,
                y: mousePos.y,
                duration: 0.8,
                ease: "power3.out",
                overwrite: true
            });
        }
    }, [mousePos, isHovering]);

    // 4. RESPONSIVE LAYOUT STATE
    const [cardWidth, setCardWidth] = useState('30vw'); // Start Small

    useEffect(() => {
        const handleResize = () => {
            const w = window.innerWidth;
            if (w <= 768) setCardWidth('85vw');
            else if (w <= 1024) setCardWidth('60vw'); // Tablet wider
            else if (w <= 1440) setCardWidth('40vw'); // Adjusted for better proportions
            else setCardWidth('35vw'); // NARROWER for more specialized "Portal" look
        };

        handleResize(); // Init
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // CHANGED TO useLayoutEffect TO PREVENT JUMPS
    useLayoutEffect(() => {
        let scrollTimeline: gsap.core.Timeline;

        const ctx = gsap.context(() => {
            if (!sliderRef.current || !containerRef.current) return;

            // 1. CLEANUP
            ScrollTrigger.getById('showcase-scroll')?.kill();
            ScrollTrigger.getAll().filter(st => st.vars.id?.startsWith('parallax-')).forEach(st => st.kill());

            // 2. APPLY STYLES FIRST (MatchMedia)
            // Critical: Apply styles BEFORE calculating width
            const mm = gsap.matchMedia();
            mm.add({
                isMobile: "(max-width: 768px)",
                isTablet: "(min-width: 769px) and (max-width: 1024px)",
                isLaptop: "(min-width: 1025px) and (max-width: 1440px)",
                isDesktop: "(min-width: 1441px)"
            }, (context) => {
                const { isMobile, isTablet, isLaptop } = context.conditions as { isMobile: boolean, isTablet: boolean, isLaptop: boolean };

                if (isMobile) {
                    gsap.set('.showcase-headline', { minWidth: '90vw', marginRight: '5vw' });
                    gsap.set(sliderRef.current, { paddingLeft: '5vw', gap: 0 });
                } else if (isTablet) {
                    gsap.set('.showcase-headline', { minWidth: '40vw', marginRight: '0' });
                    gsap.set(sliderRef.current, { paddingLeft: '6vw', gap: '4vw' });
                } else if (isLaptop) {
                    gsap.set('.showcase-headline', { minWidth: '35vw', marginRight: '0' });
                    gsap.set(sliderRef.current, { paddingLeft: '8vw', gap: '4vw' });
                } else {
                    gsap.set('.showcase-headline', { minWidth: '40vw', marginRight: '0' });
                    gsap.set(sliderRef.current, { paddingLeft: '10vw', gap: '5vw' });
                }
            });

            // 3. FORCE RECALCULATION
            // Helper to get true width after styles applied
            const getScrollWidth = () => sliderRef.current?.scrollWidth || 0;
            const getViewportWidth = () => window.innerWidth;

            // 4. TIMELINE

            // 4. TIMELINE (ALL DEVICES - Pinning Enabled)
            // Use existing 'mm' from line 148

            // UNIFIED: Horizontal Scroll logic for BOTH Desktop and Mobile
            mm.add("all", () => {
                const viewportWidth = getViewportWidth();
                const totalScrollWidth = getScrollWidth();
                const maxScroll = -(totalScrollWidth - viewportWidth);

                // Adjust scroll length for mobile feel if needed
                const isMobile = window.innerWidth <= 768;
                const scrollLength = isMobile
                    ? totalScrollWidth + viewportWidth * 2.0 // Slightly more budget for mobile touch control
                    : totalScrollWidth + viewportWidth * 2.5;

                scrollTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top top",
                        end: () => `+=${scrollLength}`,
                        pin: true,
                        scrub: 0.5,
                        invalidateOnRefresh: true,
                        id: 'showcase-scroll',
                        // MAGNETIC SNAPPING REMOVED
                        // snap: { ... }
                    }
                });

                // ... (Logic continues inside) ...

                // 1. Initial Headline Flow (minimum pause)
                scrollTimeline.to({}, { duration: viewportWidth * 0.1 });

                let currentX = 0;
                cardContainerRefs.current.forEach((card, i) => { // Added index 'i'
                    if (!card) return;
                    const cardCenter = card.offsetLeft + card.offsetWidth / 2;
                    let targetX = (viewportWidth / 2) - cardCenter;
                    if (targetX > 0) targetX = 0;
                    if (targetX < maxScroll) targetX = maxScroll;
                    const distance = Math.abs(targetX - currentX);
                    if (distance > 0) {
                        scrollTimeline.to(sliderRef.current, {
                            x: targetX, ease: "none", duration: distance
                        });
                    }

                    // ADD SNAP LABEL WHEN CENTERED
                    scrollTimeline.addLabel(`card-${i}`);

                    // Kinetic Flow: Minimal pause to maintain velocity differential
                    const pauseDuration = viewportWidth * 0.05;
                    scrollTimeline.to({}, { duration: pauseDuration });
                    currentX = targetX;
                });

                if (currentX > maxScroll) {
                    scrollTimeline.to(sliderRef.current, {
                        x: maxScroll,
                        ease: "none",
                        duration: Math.abs(maxScroll - currentX)
                    });
                }
                scrollTimeline.to({}, { duration: 0.15 });

                // PARALLAX v7: Natural Aspect (16:9 native vs 4:3 window)
                const parallaxRange = 8; // ULTRA SAFE: Uses natural extra width

                imagesRef.current.forEach((img, i) => {
                    if (!img || !cardsRef.current[i]) return;

                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: cardsRef.current[i],
                            containerAnimation: scrollTimeline,
                            start: "left 100%",
                            end: "right 0%",
                            scrub: 0.1,
                            id: `parallax-natural-${i}`
                        }
                    });

                    tl.set(img, { xPercent: 0, scale: 1.0, rotateY: 0 }); // Native Center
                    tl.to(img, {
                        xPercent: -parallaxRange,
                        scale: 1.05, // Almost invisible zoom, just for Z-feeling
                        rotateY: 3, // Minimal jewelry volume
                        duration: 0.35,
                        ease: "power1.inOut"
                    });
                    tl.to(img, {
                        xPercent: parallaxRange,
                        scale: 1.05,
                        rotateY: -3,
                        duration: 0.3,
                        ease: "none"
                    }); // NATURAL COUNTER-MOVEMENT
                    tl.to(img, {
                        xPercent: 0,
                        scale: 1.0,
                        rotateY: 0,
                        duration: 0.35,
                        ease: "power1.inOut"
                    }); // Reset
                });
            });

            // Refresh to ensure all start/end points are correct with new styles
            ScrollTrigger.refresh();

        }, containerRef);

        // 5. DEEP LINKING
        if (initialHash && initialHash.startsWith('#case-') && lenis) {
            setTimeout(() => {
                ScrollTrigger.refresh();
                const st = ScrollTrigger.getById('showcase-scroll');
                if (!st || !sliderRef.current) return;

                const targetId = initialHash.replace('#case-', '');
                const targetIndex = CASES.findIndex(c => c.id === targetId);
                const card = cardsRef.current[targetIndex];

                if (card) {
                    setHighlightedIndex(targetIndex);
                    setTimeout(() => setHighlightedIndex(null), 6000); // Doubled from 3s to 6s

                    const totalWidth = sliderRef.current.scrollWidth;
                    const viewportWidth = window.innerWidth;
                    const maxTrans = totalWidth - viewportWidth;
                    const cardOffset = card.offsetLeft;
                    let targetTrans = -(cardOffset - (viewportWidth - card.offsetWidth) / 2);

                    if (targetTrans > 0) targetTrans = 0;
                    if (targetTrans < -maxTrans) targetTrans = -maxTrans;

                    const progressInTimeline = (targetTrans / -maxTrans) * (1 / 1.8);
                    const targetScrollY = st.start + (progressInTimeline * (st.end - st.start));
                    lenis.scrollTo(targetScrollY, { duration: 2, force: true });
                }
            }, 800);
        }

        return () => ctx.revert();
    }, [initialHash, lenis]);

    return (
        <div ref={containerRef} className="showcase-slider-container" style={{ width: '100%', height: '100vh', overflow: 'hidden', backgroundColor: '#FFF' }}>
            <div
                ref={sliderRef}
                className="showcase-track"
                style={{
                    display: 'flex',
                    height: '100%',
                    width: 'fit-content',
                    // Inline defaults (Desktop) - Overridden by GSAP logic above
                    paddingLeft: '10vw',
                    gap: '5vw'
                }}
            >
                {/* HEADLINE CARD */}
                <div className="showcase-headline" style={{
                    minWidth: '40vw',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}>
                    <h2 style={{
                        fontSize: 'clamp(3rem, 6vw, 8rem)',
                        lineHeight: 0.9,
                        color: '#000',
                        marginBottom: '2rem',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 900,
                        textShadow: '0px 10px 30px rgba(0,0,0,0.1)'
                    }}>
                        INGENIERÍA<br />
                        <span style={{ color: '#CCC' }}>/// CREATIVA</span>
                    </h2>
                    <p style={{
                        fontSize: 'clamp(1rem, 1.5vw, 1.5rem)',
                        maxWidth: '500px',
                        fontFamily: 'var(--font-mono)',
                        color: '#555'
                    }}>
                        Construimos infraestructura que piensa, escala y domina.
                    </p>
                </div>

                {/* CASE CARDS */}
                {CASES.map((item, i) => (
                    <div
                        key={i}
                        ref={el => { cardContainerRefs.current[i] = el; }} // OUTER REFERENCE FOR POSITIONING
                        className="showcase-card"
                        onClick={() => navigate(item.path)} // NAVIGATE TO PAGE
                        style={{
                            textDecoration: 'none',
                            width: cardWidth, // Strict Width
                            maxWidth: cardWidth, // Prevent expansion
                            minWidth: cardWidth, // Prevent shrinking
                            height: isMobile ? 'auto' : '80%', // AUTO on mobile to prevent clipping
                            alignSelf: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            padding: isMobile ? '1.5rem' : '2rem',
                            backgroundColor: '#FFFFFF',
                            cursor: 'none',
                            flexShrink: 0,
                            transition: 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
                            zIndex: highlightedIndex === i || hoveredIndex === i ? 10 : 2,
                            boxShadow: highlightedIndex === i
                                ? '0 0 100px rgba(0, 255, 153, 0.6)'
                                : (hoveredIndex === i ? '0 40px 80px rgba(0,0,0,0.3)' : '0 30px 60px rgba(0,0,0,0.1)'),
                            border: highlightedIndex === i ? '2px solid #00FF99' : '1px solid rgba(0,0,0,0.05)',
                            animation: highlightedIndex === i ? 'landingFlash 1.5s infinite alternate' : 'none',
                            transform: hoveredIndex === i && !isMobile ? 'translateY(-10px) scale(1.02)' : 'none',
                            borderRadius: '24px'
                        }}
                        onMouseEnter={() => {
                            setIsHovering(true);
                            setHoveredIndex(i);
                        }}
                        onMouseLeave={() => {
                            setIsHovering(false);
                            setHoveredIndex(null);
                        }}
                    >
                        {/* PARALLAX IMAGE WINDOW */}
                        <div
                            ref={el => { cardsRef.current[i] = el; }}
                            className="showcase-media-window"
                            style={{
                                width: '100%',
                                height: isMobile ? '250px' : 'auto',
                                aspectRatio: isMobile ? 'auto' : '4/3', // USER SUGGESTION: Narrower for focus
                                overflow: 'hidden',
                                borderRadius: '16px',
                                marginBottom: '1rem',
                                position: 'relative',
                                backgroundColor: '#000', // MASK FOR GAPS
                                boxShadow: '0 30px 60px rgba(0,0,0,0.7)',
                                border: '1px solid rgba(0,0,0,0.05)',
                                flexShrink: 0,
                                transform: 'translateZ(0)', // FORCE GPU MASK
                                willChange: 'transform'     // OPTIMIZE REPAINTS
                            }}>
                            {/* VIGNETTE OVERLAY - FOR DEPTH */}
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                zIndex: 2,
                                pointerEvents: 'none',
                                boxShadow: 'inset 0 0 100px rgba(0,0,0,0.6)',
                                borderRadius: '16px'
                            }} />
                            {item.video ? (
                                <video
                                    ref={el => { imagesRef.current[i] = el; }}
                                    src={item.video}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    webkit-playsinline="true"
                                    preload="auto"
                                    poster={item.img}
                                    className="showcase-video"
                                    style={{
                                        width: '133.33%', // NATIVE 16:9 OVER 4:3 WINDOW (1.77 / 1.33 = 1.333)
                                        height: '100%',
                                        objectFit: 'cover',
                                        position: 'absolute',
                                        left: '-16.66%', // PERFECT NATIVE CENTER ((133.33 - 100) / 2)
                                        top: 0,
                                        willChange: 'transform',
                                        backfaceVisibility: 'hidden',
                                        transform: 'translate3d(0,0,0)',
                                        perspective: '1000px'
                                    }}
                                />
                            ) : (
                                <div
                                    ref={el => { imagesRef.current[i] = el; }}
                                    className="showcase-image"
                                    style={{
                                        width: '133.33%',
                                        height: '100%',
                                        backgroundImage: `url(${item.img})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        position: 'absolute',
                                        left: '-16.66%',
                                        top: 0,
                                        backfaceVisibility: 'hidden'
                                    }}
                                />
                            )}
                        </div>

                        <div style={{
                            display: 'flex',
                            flexDirection: isMobile ? 'column' : 'row',
                            alignItems: isMobile ? 'flex-start' : 'flex-start',
                            justifyContent: 'space-between',
                            gap: isMobile ? '1rem' : '0'
                        }}>
                            <div>
                                <h3 className="showcase-title" style={{
                                    fontSize: isMobile ? '1.4rem' : '2.5rem', // FURTHER REDUCED ON MOBILE
                                    fontWeight: 800,
                                    margin: '0 0 0.25rem 0', // TIGHTER
                                    color: '#000',
                                    textTransform: 'uppercase',
                                    letterSpacing: '-1px',
                                    lineHeight: 1
                                }}>{item.title}</h3>
                                <p className="showcase-subtitle" style={{
                                    fontSize: isMobile ? '0.8rem' : '1rem',
                                    color: '#888',
                                    margin: 0,
                                    fontFamily: 'var(--font-mono)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '2px'
                                }}>{item.subtitle}</p>
                            </div>
                            <span style={{
                                fontSize: isMobile ? '2.5rem' : '4rem',
                                fontWeight: 900,
                                color: '#AAAAAA',
                                lineHeight: 0.8,
                                alignSelf: isMobile ? 'flex-end' : 'flex-start',
                                opacity: 0.4
                            }}>{item.id}</span>
                        </div>
                        <p style={{
                            marginTop: isMobile ? '0.5rem' : '1.5rem', // TIGHTER ON MOBILE
                            paddingTop: '0.1rem',
                            fontSize: 'clamp(0.9rem, 1vw, 1.1rem)', // FLUID FONTS
                            lineHeight: 1.5, // Slightly tighter
                            color: '#444',
                            // Ensure valid flex behavior
                            whiteSpace: 'normal',
                            overflow: 'hidden'
                        }}>
                            {item.desc}
                        </p>
                    </div>
                ))}

                <div style={{ minWidth: '40vw' }} />
            </div>

            <style>{`
                @media (max-width: 768px) {
                    /* MOBILE: GSAP PINNING ENABLED (Vertical Scroll drives Horizontal movement) */
                    .showcase-slider-container {
                        height: 100vh !important;
                        overflow: hidden !important; /* Critical for Pinning */
                        background-color: #FFF !important;
                        display: flex;
                        align-items: center;
                    }

                    .showcase-track {
                        display: flex !important;
                        flex-direction: row !important;
                        width: max-content !important;
                        height: 100% !important;
                        padding: 0 5vw !important;
                        gap: 1rem !important;
                        /* Transform is handled by GSAP now */
                        align-items: center !important;
                    }

                    .showcase-headline {
                        min-width: 90vw !important; /* Wider headline on mobile */
                        height: auto !important;
                        margin-bottom: 0 !important;
                        margin-right: 1rem !important;
                        align-items: flex-start !important;
                        flex-shrink: 0;
                        padding-left: 1rem;
                    }

                    .showcase-card {
                        width: 85vw !important;
                        max-width: 85vw !important;
                        min-width: 85vw !important;
                        height: 82vh !important; /* INCREASED TO 82VH FOR FULL TEXT VISIBILITY */
                        margin: 0 !important;
                        padding: 1.5rem !important;
                        flex-shrink: 0;
                        border-right: 1px solid rgba(0,0,0,0.05);
                        overflow-y: visible !important;
                    }

                    .showcase-media-window {
                        height: 30% !important; /* REDUCED TO 30% TO GIVE TEXT MORE ROOM */
                        min-height: 150px !important;
                        flex-shrink: 0;
                        overflow: hidden !important;
                    }

                    .showcase-video, .showcase-image {
                        width: 160% !important; /* Max Mobile Parallax */
                        height: 100% !important;
                        left: -30% !important;
                        position: absolute !important;
                        top: 0 !important;
                        object-fit: cover !important;
                        backface-visibility: hidden !important;
                        transform: translate3d(0,0,0) !important;
                    }

                    .floating-button {
                        display: none !important;
                    }
                }
                }
            `}</style>

            {/* MODALS REMOVED - Now navigating directly to pages */}

            {/* FLOATING CASE INDICATOR (Desktop Only) */}
            <div
                ref={indicatorRef}
                className="floating-button"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    padding: '0.8rem 1.5rem',
                    backgroundColor: '#000',
                    color: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    opacity: isHovering ? 1 : 0,
                    scale: isHovering ? 1 : 0.8,
                    mixBlendMode: 'normal',
                    transition: 'opacity 0.3s ease, transform 0.3s cubic-bezier(0.19, 1, 0.22, 1)',
                    transform: 'translate(-50%, -50%)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    fontWeight: 900,
                    letterSpacing: '0.2em',
                    textAlign: 'center',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.1)'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span>VER PROYECTO</span>
                    <span style={{ fontSize: '1.2rem', color: '#00FF99' }}>→</span>
                </div>
            </div>
        </div>
    );
};

export default ShowcaseSlider;
