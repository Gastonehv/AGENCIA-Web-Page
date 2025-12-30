import React from 'react';
import { Link } from 'react-router-dom';
import ScrollProgress from '../components/ScrollProgress';
import SEO from '../components/SEO';

const Terminos: React.FC = () => {
    return (
        <main style={{ backgroundColor: '#000', color: '#FFF', minHeight: '100vh', padding: '15vh 10vw' }}>
            <ScrollProgress />
            <SEO title="Términos | AgencIA" description="Términos y condiciones de uso de los servicios de AgencIA." />

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 900, marginBottom: '4rem', letterSpacing: '-0.02em', color: '#00FF99' }}>
                    TÉRMINOS
                </h1>

                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', color: '#FFF', marginBottom: '1.5rem' }}>/// 01. ALCANCE DEL SERVICIO</h2>
                    <p style={{ color: '#BBB', lineHeight: 1.8, fontSize: '1.1rem' }}>
                        Los servicios prestados por AgencIA incluyen diseño estratégico, desarrollo de software y orquestación de sistemas de Inteligencia Artificial. Al navegar por este sitio, aceptas nuestras metodologías disruptivas y el enfoque experimental que define nuestra identidad.
                    </p>
                </section>

                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', color: '#FFF', marginBottom: '1.5rem' }}>/// 02. PROPIEDAD INTELECTUAL</h2>
                    <p style={{ color: '#BBB', lineHeight: 1.8, fontSize: '1.1rem' }}>
                        A.L.M.A. (Algoritmo Lógico de Mente Artificial) y todos los sistemas propietarios de AgencIA son propiedad intelectual exclusiva de la agencia. El uso de nuestros activos sin autorización será procesado bajo las leyes de propiedad intelectual vigentes.
                    </p>
                </section>

                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', color: '#FFF', marginBottom: '1.5rem' }}>/// 03. LIMITACIÓN DE RESPONSABILIDAD</h2>
                    <p style={{ color: '#BBB', lineHeight: 1.8, fontSize: '1.1rem' }}>
                        AgencIA no se hace responsable de las interpretaciones subjetivas de nuestros sistemas de IA. La IA es una herramienta de amplificación, y los resultados finales dependen de la colaboración sinérgica entre el cliente y nuestro ecosistema digital.
                    </p>
                </section>

                <div style={{ marginTop: '8rem', borderTop: '1px solid #333', paddingTop: '2rem' }}>
                    <Link to="/" style={{ color: '#00FF99', textDecoration: 'none', fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>
                        ← VOLVER AL ORIGEN
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default Terminos;
