
import { useRef, useLayoutEffect, useState } from 'react'; // Added useLayoutEffect, useState
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrambleText from './ScrambleText';
import AsciiRipple from './AsciiRipple';

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

const SoulManifesto = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const [activeItem, setActiveItem] = useState(0); // Track active slide

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            if (!containerRef.current) return;

            const items = gsap.utils.toArray<HTMLElement>('.manifesto-item');

            // Stack items absolutely via GSAP set
            gsap.set(items, {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                opacity: 0,
                scale: 1.5, // Start large (coming to camera)
                filter: 'blur(20px)',
                pointerEvents: 'none' // SC: Fix - Prevent invisible items from blocking mouse
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: `+=${items.length * 250}%`, // SC: 250% per item = MUCH Slower Scroll
                    pin: true,
                    scrub: 1,
                    id: "manifesto-void"
                }
            });

            items.forEach((item, i) => {
                // A. Item appears from "behind" the camera or abyss
                tl.to(item, {
                    opacity: 1,
                    scale: 1,
                    filter: 'blur(0px)',
                    duration: 1,
                    pointerEvents: 'all', // ENABLE INTERACTION
                    ease: "power2.inOut",
                    onStart: () => setActiveItem(i), // TRIGGER ANIMATION ON START
                    onReverseComplete: () => setActiveItem(i - 1) // Optional: Handle reverse
                })
                    // B. Item stays for a bit (READING PAUSE)
                    .to(item, { duration: 3 }) // SC: Increased from 0.5 to 3 (6x longer pause)
                    // C. Item vanishes into the "Void" (scale down + blur)
                    .to(item, {
                        opacity: 0,
                        scale: 0.5,
                        filter: 'blur(30px)',
                        duration: 1,
                        pointerEvents: 'none', // DISABLE INTERACTION
                        ease: "power2.inOut"
                    });
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="manifesto-section" id="manifesto" style={{
            position: 'relative',
            backgroundColor: '#000',
            color: '#FFF',
            width: '100%',
            height: '100vh',
            overflow: 'hidden'
        }}>
            <div
                ref={trackRef}
                style={{
                    position: 'relative',
                    height: '100%',
                    width: '100%',
                }}
            >
                {/* MANIFESTO ITEMS */}
                {MANIFESTO.map((item, i) => (
                    <div
                        key={item.title}
                        className={`manifesto-item manifesto-item-${i}`}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            padding: 'clamp(1rem, 5vw, 2rem)',
                        }}
                    >
                        <h2 style={{
                            fontSize: 'clamp(1.8rem, 8vw, 7rem)',
                            lineHeight: 0.9,
                            textTransform: 'uppercase',
                            marginBottom: '3rem',
                            color: '#FFF',
                            fontFamily: 'var(--font-heading, sans-serif)',
                            fontWeight: 900,
                            maxWidth: '90%',
                            letterSpacing: '-0.02em',
                        }}>
                            <ScrambleText
                                text={item.title}
                                speed={1.5}
                                iridescent={true}
                                finalColor="#FFFFFF"
                                trigger={activeItem === i} // REPLAY WHEN ACTIVE
                            />
                        </h2>

                        <div className="manifesto-body" style={{
                            fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                            lineHeight: 1.6,
                            color: '#BBB',
                            fontFamily: 'var(--font-mono, monospace)',
                            maxWidth: '700px'
                        }}>
                            {item.body.map((line, j) => (
                                <p key={j} style={{ margin: '0 0 0.8rem 0' }}>
                                    <AsciiRipple
                                        text={line}
                                        autoTrigger={true}
                                        trigger={activeItem === i} // FORCE WAVE WHEN ACTIVE
                                    />
                                </p>
                            ))}
                        </div>
                    </div>
                ))}

                {/* FINAL BUFFER FOR TRANSITION */}
                <div style={{ width: '30vw', flexShrink: 0 }} />
            </div>
        </section>
    );
};

export default SoulManifesto;
