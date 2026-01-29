import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useScroll } from '../context/ScrollContext';

const MoneyButton = () => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const { lenis } = useScroll();

  const handleClick = () => {
    if (lenis) {
      lenis.scrollTo('#contacto', { duration: 1.5, ease: 'power4.inOut' });
    } else {
      document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Animación de entrada: Sube desde abajo con elegancia
    if (btnRef.current) {
      gsap.fromTo(btnRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, delay: 0.5, ease: 'power3.out' }
      );
    }
  }, []);

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      style={{
        // POSICIONAMIENTO
        position: 'fixed',
        bottom: '3rem', // Un poco más arriba para dar aire
        left: '50%',
        transform: 'translateX(-50%)', // Centrado perfecto
        zIndex: 9990,

        // ESTÉTICA DE CÁPSULA
        padding: '0.8rem 2.5rem',
        backgroundColor: '#000000', // Negro absoluto
        color: '#FFFFFF',
        border: '1px solid rgba(255,255,255,0.1)', // Borde casi invisible
        borderRadius: '100px', // Full redondeado

        // TIPOGRAFÍA DE LUJO
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: '0.75rem', // Pequeño y elegante
        fontWeight: '600',
        letterSpacing: '0.2em', // Mucho aire entre letras
        textTransform: 'uppercase',

        // INTERACCIÓN
        cursor: 'pointer',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)', // Sombra suave
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' // Animación Apple-like
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateX(-50%) scale(1.05)'; // Zoom sutil
        e.currentTarget.style.borderColor = '#00FF99'; // El borde se enciende verde
        e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 255, 153, 0.3)'; // Resplandor verde
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateX(-50%) scale(1)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
      }}
    >
      Iniciar Proyecto
    </button>
  );
};

export default MoneyButton;
