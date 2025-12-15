import React from 'react';
import { Link } from 'react-router-dom';

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
                    <button
                        style={{
                            padding: '1.2rem 3rem',
                            background: 'transparent',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.5)',
                            borderRadius: '50px',
                            fontWeight: 'bold',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            backdropFilter: 'blur(10px)',
                            letterSpacing: '2px'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.color = 'black';
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 0 30px rgba(255,255,255,0.3)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'white';
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        INICIAR PROYECTO
                    </button>
                </Link>
            </div>
        </section>
    );
};

export default Contact;
