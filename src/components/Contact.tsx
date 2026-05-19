import React from 'react';
import { Link } from 'react-router-dom';
import LiquidContactCTA from './LiquidContactCTA';

const Contact: React.FC = () => {
    return (
        <section
            id="contact-cta"
            style={{
                height: '50vh', // Half screen height for footer feel
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 5,
                padding: '2rem'
            }}
        >
            <div style={{ textAlign: 'center', zIndex: 10 }}>
                <h2 style={{
                    color: 'white',
                    fontSize: 'clamp(2rem, 5vw, 4rem)',
                    marginBottom: '2rem',
                    fontFamily: 'var(--font-mono)'
                }}>
                    ¿LISTO PARA LA SINGULARIDAD?
                </h2>

                <Link to="/contacto">
                    <LiquidContactCTA text="INICIAR PROYECTO" />
                </Link>
            </div>
        </section>
    );
};

export default Contact;
