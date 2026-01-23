import React from 'react';
import { Link } from 'react-router-dom';
import ScrollProgress from '../components/ScrollProgress';
import SEO from '../components/SEO';

const Privacidad: React.FC = () => {
    return (
        <main style={{ backgroundColor: '#000', color: '#FFF', minHeight: '100vh', padding: '15vh 10vw' }}>
            <ScrollProgress />
            <SEO title="Privacidad | AgencIA" description="Política de privacidad y tratamiento de datos de AgencIA." />

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 800, marginBottom: '4rem', letterSpacing: '-0.02em', color: '#00FF99' }}>
                    PRIVACIDAD
                </h1>

                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', color: '#FFF', marginBottom: '1.5rem' }}>/// 01. EL ALGORITMO Y TÚ</h2>
                    <p style={{ color: '#BBB', lineHeight: 1.8, fontSize: '1.1rem' }}>
                        En AgencIA, la privacidad no es una opción, es un parámetro fundamental de nuestro código. Entendemos que en la era de la Inteligencia Artificial, tus datos son tu activo más valioso. Por ello, procesamos la información mínima necesaria para brindarte una experiencia excepcional.
                    </p>
                </section>

                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', color: '#FFF', marginBottom: '1.5rem' }}>/// 02. DATOS RECOLECTADOS</h2>
                    <p style={{ color: '#BBB', lineHeight: 1.8, fontSize: '1.1rem' }}>
                        Recolectamos únicamente información de contacto que tú decides proporcionarnos a través de nuestros formularios: nombre, correo electrónico y detalles del proyecto. No utilizamos cookies de rastreo intrusivo ni vendemos tu información a terceros.
                    </p>
                </section>

                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', color: '#FFF', marginBottom: '1.5rem' }}>/// 03. PROCESAMIENTO IA</h2>
                    <p style={{ color: '#BBB', lineHeight: 1.8, fontSize: '1.1rem' }}>
                        Nuestros sistemas de IA (incluyendo A.L.M.A.) analizan las solicitudes de proyectos para optimizar nuestra respuesta. Estos datos se procesan de forma segura y no se utilizan para entrenar modelos públicos sin tu consentimiento explícito.
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

export default Privacidad;
