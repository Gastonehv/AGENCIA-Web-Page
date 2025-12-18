
import ScrambleText from './ScrambleText';
import AsciiRipple from './AsciiRipple';

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
        title: "NO BUSCAMOS CLIENTES. BUSCAMOS CÓMPLICES.",
        body: ["Si buscas lo seguro", "el mundo está lleno de opciones.", "Pero si buscas redefinir las reglas...", "bienvenido a casa."],
    }
];

const SoulManifesto = () => {
    // FINAL STATE: STATIC & CLEAN
    // User requested to stop animating due to issues.
    // This layout provides maximum readability and stability.
    return (
        <section className="manifesto-section" style={{
            position: 'relative',
            backgroundColor: '#000',
            color: '#FFF',
            padding: '10vh 0',
            width: '100%',
            overflow: 'hidden'
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
                            minHeight: '60vh', // Reduced for mobile friendliness
                            width: '90%',
                            maxWidth: '1200px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            padding: 'clamp(1rem, 5vw, 2rem)' // Responsive padding
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
