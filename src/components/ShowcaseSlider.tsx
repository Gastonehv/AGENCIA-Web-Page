import { useRef, useState, useLayoutEffect } from 'react';
// import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProjectModal from './ProjectModal';
import { useScroll } from '../context/ScrollContext'; // Import useScroll
import techArchitectureImg from '../assets/images/architecture_digital.jpg';
import architectureVideo from '../assets/videos/arquitectura.mp4';
import iaGenerativaVideo from '../assets/videos/IA generativa.mp4';
import automationVideo from '../assets/videos/automatización.mp4';
import identidadVideo from '../assets/videos/IDENTIDAD VISUAL.mp4';

gsap.registerPlugin(ScrollTrigger);

interface ShowcaseSliderProps {
    initialHash?: string;
}

const CASES = [
    {
        id: '01',
        title: 'ARQUITECTURA DIGITAL',
        subtitle: 'Cimientos de Código Puro',
        desc: 'No usamos plantillas. Construimos ecosistemas digitales desde cero, optimizados para velocidad y escalabilidad extrema.',
        fullDesc: 'Reescribimos las reglas del rendimiento web. Abandonamos los CMS tradicionales para construir una arquitectura headless distribuida globalmente. Utilizando React Server Components y edge caching, logramos tiempos de carga instantáneos que retienen a los usuarios y dominan los rankings de búsqueda.',
        humanDesc: 'Tu competencia pierde el 40% de sus visitas por cada segundo extra de carga. Nosotros eliminamos la espera. Sitios instantáneos que retienen clientes desde el primer pixel.',
        services: 'Next.js, Computación Edge, UI de Alto Rendimiento',
        humanServices: 'Páginas ultrarrápidas, Código limpio, Diseño que responde',
        buttonCopy: 'TRADUCCIÓN A MODO MENOS MAMÓN',
        year: '2026',
        img: techArchitectureImg,
        video: architectureVideo,
        path: '/arquitectura',
        ctaCopy: 'AUDITAR ARQUITECTURA'
    },
    {
        id: '02',
        title: 'IA GENERATIVA',
        subtitle: 'Creatividad Sintética',
        desc: 'Modelos de lenguaje y difusión integrados para generar contenido, imágenes y experiencias en tiempo real.',
        fullDesc: 'La creatividad humana amplificada por modelos de difusión. Implementamos pipelines de generación de imágenes en tiempo real y LLMs ajustados para crear contenido dinámico que se adapta al contexto del usuario, transformando cada visita en una experiencia única.',
        humanDesc: 'Imagina tener un diseñador creativo que NUNCA se cansa. Nuestra IA crea imágenes y contenido único para cada visitante. Es como tener un artista trabajando 24/7, haciendo que cada persona sienta que tu marca le habla directamente a ella.',
        services: 'Modelos de Difusión, Integración LLM, APIs en Real-time',
        humanServices: 'Motor que crea imágenes, Chatbots inteligentes, Contenido al instante',
        buttonCopy: 'TRADUCCIÓN A MODO MENOS PAYASO',
        year: '2026',
        img: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop',
        video: iaGenerativaVideo,
        path: '/inteligencia',
        ctaCopy: 'PROBAR INTELIGENCIA'
    },
    {
        id: '03',
        title: 'AUTOMATIZACIÓN',
        subtitle: 'Eficiencia Invisible',
        desc: 'Sistemas que trabajan 24/7. Desde CRMs autónomos hasta agentes de soporte que nunca duermen.',
        fullDesc: 'El verdadero poder es silencioso. Orquestamos sistemas autónomos que conectan CRM, email marketing y atención al cliente. Nuestros agentes de IA operan 24/7, resolviendo consultas complejas y cerrando ventas mientras tu equipo duerme.',
        humanDesc: 'Tu asistente virtual que responde WhatsApp a las 3AM. Conectamos todo (emails, CRM, WhatsApp, redes) y nuestra IA lo maneja 24/7. Responde dudas, agenda citas, cierra ventas. Mientras duermes, ella trabaja. Mientras vacacionas, ella vende.',
        services: 'Orquestación de Flujos, Scripts en Python, Agentes de IA',
        humanServices: 'Robots que ayudan, Conexiones automáticas, Empleado digital',
        buttonCopy: 'TRADUCCIÓN A MODO MENOS NERD',
        year: '2026',
        img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
        video: automationVideo,
        path: '/automatizacion',
        ctaCopy: 'VER SISTEMA EN VIVO'
    },
    {
        id: '04',
        title: 'IDENTIDAD VISUAL',
        subtitle: 'Marcas que Respiran',
        desc: 'Diseño que no solo se ve, se siente. Micro-interacciones y motion graphics que definen personalidad.',
        fullDesc: 'Más allá del logo. Creamos sistemas de diseño vivos que reaccionan a la interacción. Desde tipografías variables hasta micro-animaciones en WebGL, dotamos a las marcas de un lenguaje kinético propio que comunica innovación y sofisticación en cada pixel.',
        humanDesc: 'Tu marca necesita MOVERSE para ser memorable. No hacemos logos que solo "están ahí". Creamos identidades que bailan, respiran y responden cuando las tocas. Cada animación es como un apretón de manos: dice quién eres sin palabras.',
        services: 'WebGL, Animaciones GSAP, Branding Dinámico',
        humanServices: 'Gráficos 3D, Animaciones bonitas, Marca que se mueve',
        buttonCopy: 'TRADUCCIÓN A MODO MENOS PRETENCIOSO',
        year: '2025',
        img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop',
        video: identidadVideo,
        path: '/identidad',
        ctaCopy: 'SENTIR LA EXPERIENCIA'
    }
];

const ShowcaseSlider: React.FC<ShowcaseSliderProps> = ({ initialHash }) => {
    const [activeProject, setActiveProject] = useState<typeof CASES[number] | null>(null); // State for Modal
    const containerRef = useRef<HTMLDivElement>(null);
    const sliderRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    // Fix: Allow both Div and Video elements for the parallax target
    const imagesRef = useRef<(HTMLElement | null)[]>([]);

    const { lenis } = useScroll(); // Need Lenis for precision scrolling

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            if (!sliderRef.current || !containerRef.current) return;

            const mm = gsap.matchMedia();
            let scrollTween: gsap.core.Tween | null = null;
            let totalWidth = 0;
            let viewportWidth = 0;

            // SHARED LOGIC: Horizontal Scroll & Parallax
            const setupScroll = () => {
                totalWidth = sliderRef.current!.scrollWidth;
                viewportWidth = window.innerWidth;

                // 1. HORIZONTAL SCROLL
                scrollTween = gsap.to(sliderRef.current, {
                    x: () => -(totalWidth - viewportWidth),
                    ease: "none",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top top",
                        end: () => `+=${totalWidth}`,
                        pin: true,
                        scrub: 1,
                        invalidateOnRefresh: true,
                        id: 'showcase-scroll' // Named trigger for reference
                    }
                });

                // 2. PARALLAX EFFECT
                imagesRef.current.forEach((img, i) => {
                    if (!img || !cardsRef.current[i]) return;
                    gsap.fromTo(img,
                        { xPercent: -40 },
                        {
                            xPercent: 40,
                            ease: "none",
                            force3D: true,
                            scrollTrigger: {
                                trigger: cardsRef.current[i],
                                containerAnimation: scrollTween as gsap.core.Animation,
                                start: "left right",
                                end: "right left",
                                scrub: true,
                            }
                        }
                    );
                });
            };

            // RESPONSIVE STYLES
            mm.add({
                isMobile: "(max-width: 768px)",
                isDesktop: "(min-width: 769px)"
            }, (context) => {
                const { isMobile } = context.conditions as { isMobile: boolean };

                if (isMobile) {
                    gsap.set('.showcase-card', { minWidth: '85vw', marginRight: '5vw' });
                    gsap.set('.showcase-headline', { minWidth: '90vw', marginRight: '5vw' });
                    gsap.set('.showcase-title', { fontSize: '1.8rem' });
                    gsap.set(sliderRef.current, { paddingLeft: '5vw', gap: 0 });
                } else {
                    gsap.set('.showcase-card', { minWidth: '50vw', marginRight: '0' });
                    gsap.set('.showcase-headline', { minWidth: '40vw', marginRight: '0' });
                    gsap.set('.showcase-title', { fontSize: '2.5rem' });
                    gsap.set(sliderRef.current, { paddingLeft: '10vw', gap: '5vw' });
                }

                setupScroll();
            });

            // --- DEEP LINKING LOGIC ---
            if (initialHash && initialHash.startsWith('#case-') && lenis) {
                // Format: #case-arquitectura -> /arquitectura
                const targetPath = '/' + initialHash.replace('#case-', '');
                const targetIndex = CASES.findIndex(c => c.path === targetPath);

                if (targetIndex !== -1 && containerRef.current) {
                    // Wait for layout to stabilise
                    setTimeout(() => {
                        ScrollTrigger.refresh(); // Ensure measurements are native

                        // CALCULATION:
                        // Vertical Scroll needed = Start + (Progress * Distance)
                        // Progress = Distance to Target X / Total Moveable Distance

                        // 1. Get container start (Y)
                        const st = ScrollTrigger.getById('showcase-scroll');
                        if (!st) return;

                        const startY = st.start;
                        const duration = st.end - st.start;
                        const maxTrans = totalWidth - viewportWidth;

                        // 2. Determine Target X for this Card
                        // We want the card centered roughly.
                        // For first card (index 0), X=0.
                        // For others, we calculate their offsetLeft.

                        const card = cardsRef.current[targetIndex];
                        if (card) {
                            // Calculate where the slider needs to be (translateX)
                            // We want card.offsetLeft + slider_padding to happen
                            // Simple approx: index / (total-1) if equally spaced? No, use pixels.

                            // Real offset of card within slider
                            const cardOffset = card.offsetLeft;

                            // Center it: TargetX brings card center to viewport center
                            // cardCenter = cardOffset + cardWidth/2
                            // viewportCenter = viewportWidth/2
                            // SliderX = viewportCenter - cardCenter
                            // Inverted for Scroll: TargetTranslation = -(cardOffset - (viewportWidth - card.offsetWidth)/2 )

                            let targetTrans = -(cardOffset - (viewportWidth - card.offsetWidth) / 2);

                            // Clamp translation (can't go > 0 or < -maxTrans)
                            if (targetTrans > 0) targetTrans = 0;
                            if (targetTrans < -maxTrans) targetTrans = -maxTrans;

                            // Calculate Progress (0 to 1)
                            // Tween goes 0 -> -maxTrans
                            // Progress = TargetTrans / -maxTrans
                            const progress = targetTrans / -maxTrans;

                            // Final Scroll Y
                            const targetScrollY = startY + (progress * duration);

                            lenis.scrollTo(targetScrollY, {
                                duration: 2,
                                force: true,
                                lock: true // Lock while scrolling
                            });
                        }
                    }, 1000);
                }
            }

        }, containerRef);
        return () => ctx.revert();
    }, [initialHash, lenis]);

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100vh', overflow: 'hidden', backgroundColor: '#FFF' }}>
            <div
                ref={sliderRef}
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
                        CAPACIDADES<br />
                        <span style={{ color: '#CCC' }}>/// 2026</span>
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
                        className="showcase-card"
                        onClick={() => setActiveProject(item)} // OPEN MODAL
                        data-cursor="open" // Custom Cursor Trigger
                        style={{
                            textDecoration: 'none', // Remove link underline
                            // inherit styles
                            minWidth: '50vw',
                            height: '80%',
                            alignSelf: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-start',
                            padding: '2rem',
                            backgroundColor: 'transparent',
                            cursor: 'pointer'
                        }}
                    >
                        {/* PARALLAX IMAGE WINDOW */}
                        <div
                            ref={el => { cardsRef.current[i] = el; }}
                            style={{
                                width: '100%',
                                height: '50vh',
                                overflow: 'hidden',
                                borderRadius: '16px',
                                marginBottom: '2rem',
                                position: 'relative',
                                boxShadow: '0 30px 60px rgba(0,0,0,0.7)',
                                border: '1px solid rgba(0,0,0,0.05)'
                            }}>
                            {/* MEDIA CONTENT (VIDEO OR IMAGE) */}
                            {item.video ? (
                                <video
                                    ref={el => { imagesRef.current[i] = el; }}
                                    src={item.video}
                                    autoPlay
                                    muted
                                    loop
                                    playsInline
                                    style={{
                                        width: '150%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        position: 'absolute',
                                        left: '-25%',
                                        willChange: 'transform'
                                    }}
                                />
                            ) : (
                                <div
                                    ref={el => { imagesRef.current[i] = el; }}
                                    style={{
                                        width: '150%',
                                        height: '100%',
                                        backgroundImage: `url(${item.img})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        position: 'absolute',
                                        left: '-25%'
                                    }}
                                />
                            )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                            <div>
                                <h3 className="showcase-title" style={{
                                    fontSize: '2.5rem',
                                    fontWeight: 800,
                                    margin: '0 0 0.5rem 0',
                                    color: '#000',
                                    textTransform: 'uppercase',
                                    letterSpacing: '-1px'
                                }}>{item.title}</h3>
                                <p className="showcase-subtitle" style={{
                                    fontSize: '1rem',
                                    color: '#888',
                                    margin: 0,
                                    fontFamily: 'var(--font-mono)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '2px'
                                }}>{item.subtitle}</p>
                            </div>
                            <span style={{ fontSize: '4rem', fontWeight: 900, color: '#AAAAAA', lineHeight: 0.8 }}>{item.id}</span>
                        </div>
                        <p style={{
                            marginTop: 'auto',
                            paddingTop: '2rem',
                            fontSize: '1.1rem',
                            lineHeight: 1.6,
                            color: '#444'
                        }}>
                            {item.desc}
                        </p>
                    </div>
                ))}

                {/* END SPACER */}
                <div style={{ minWidth: '10vw' }} />
            </div>

            {/* MODAL SYSTEM */}
            <ProjectModal
                key={activeProject?.id || 'none'}
                project={activeProject}
                onClose={() => setActiveProject(null)}
            />
        </div>
    );
};

export default ShowcaseSlider;
