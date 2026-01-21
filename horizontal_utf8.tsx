
import { useRef, useLayoutEffect } from 'react'; // Added useLayoutEffect
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrambleText from './ScrambleText';
import AsciiRipple from './AsciiRipple';

gsap.registerPlugin(ScrollTrigger);

const MANIFESTO = [
    {
        title: "EN LA ERA DEL RUIDO INFINITO",
        body: ["La tecnolog├¡a ha democratizado la creaci├│n,", "pero ha mercantilizado el alma,", "En este frenes├¡ de velocidad,", "hemos olvidado por qu├® creamos."],
    },
    {
        title: "EL ALGORITMO NO TIENE PULSO",
        body: ["La IA es el pincel m├ís poderoso,", "pero sigue siendo solo eso: un pincel.", "Buscamos 'el error hermoso',", "esa chispa que la l├│gica pura jam├ís descubrir├¡a."],
    },
    {
        title: "ARQUITECTOS DE LA NUEVA REALIDAD",
        body: ["Fusionamos sensibilidad art├¡stica visceral", "con potencia de c├ílculo masiva.", "Donde otros ven simples 'prompts',", "nosotros vemos partituras complejas."],
    },
    {
        title: "NO BUSCAMOS CLIENTES. BUSCAMOS C├ôMPLICES.",
        body: ["Si buscas lo seguro", "el mundo est├í lleno de opciones.", "Pero si buscas redefinir las reglas...", "bienvenido a casa."],
    }
];

const SoulManifesto = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // TARGET THE LAST ITEM FOR A BRAKE
            // We pin pieces independently to ensure smoother flow in flex container if needed,
            // but pinning the specific item works best.
            const lastItem = document.querySelector(`.manifesto-item-${MANIFESTO.length - 1}`);

            if (lastItem) {
                ScrollTrigger.create({
                    trigger: lastItem,
                    start: "center center", // When content hits center
                    end: "+=106%", // USER REQUEST: Specific timing "106%"
                    pin: true,     // STOP MOVEMENT
                    pinSpacing: true, // Ensure next section pushes it (displaces), doesn't overlap
                    scrub: true,   // Smooth
                    id: "manifesto-brake"
                });
            }

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="manifesto-section" style={{
            position: 'relative',
            backgroundColor: '#000',
            color: '#FFF',
            padding: '10vh 0 15vh', // REDUCED BUFFER: Faster transition to next chapter (Orig 80vh)
            width: '100%',
            overflow: 'hidden' // Important for pinning context
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0',
                width: '100%',
                alignItems: 'center'
            }}>
                {MANIFESTO.map((item, i) => (
                    <div
                        key={i}
                        className={`manifesto-item manifesto-item-${i}`}
                        style={{
                            minHeight: '100vh',
                            width: '90%',
                            maxWidth: '1200px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            padding: 'clamp(1rem, 5vw, 2rem)', // Responsive padding
                            // Debug border removed
                        }}
                    >
                        <h2 style={{
                            fontSize: 'clamp(1.8rem, 8vw, 7rem)', // Lowered min size
                            lineHeight: 0.9,
                            textTransform: 'uppercase',
                            marginBottom: '3rem',
                            color: '#FFF', // High Contrast
                            fontFamily: 'var(--font-heading, sans-serif)',
                            fontWeight: 900,
                            maxWidth: '100%',
                            letterSpacing: '-0.02em',
                        }}>
                            <ScrambleText
                                text={item.title}
                                speed={1.5}
                                iridescent={true}
                                finalColor="#FFFFFF"
                            // Self-triggering is more reliable here
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
                                    <AsciiRipple text={line} />
                                </p>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default SoulManifesto;
