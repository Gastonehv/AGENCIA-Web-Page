import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useScroll } from '../context/ScrollContext'; // Importamos el cerebro del scroll

const MoneyButton = () => {
    const btnRef = useRef(null);
    const { lenis } = useScroll(); // Usamos la instancia de Lenis

    const handleClick = () => {
        // Si Lenis está activo, úsalo para navegar suavemente
        if (lenis) {
            // Lenis usa 'easing' en lugar de 'ease' y la duración suele ser en segundos o ms según versión, 
            // pero el error TS2353 indica que 'ease' no es válido.
            lenis.scrollTo('#contacto', {
                duration: 1.5,
                easing: (t: number) => Math.min(1, 1.001 * Math.pow(2, -10 * t)) // Fallback de easing power4
            });
        } else {
            // Fallback por si acaso
            const element = document.getElementById('contacto');
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        if (btnRef.current) {
            gsap.fromTo(btnRef.current,
                { y: 100, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, delay: 1.5, ease: 'power3.out' }
            );
        }
    }, []);

    return (
        <button
            ref={btnRef}
            onClick={handleClick}
            className="money-button-glass"
            style={{
                position: 'fixed',
                bottom: '2.5rem',
                right: '2.5rem',
                zIndex: 9990,
                padding: '0.8rem 1.8rem',
                backgroundColor: 'rgba(10, 10, 10, 0.7)', // Vidrio oscuro
                backdropFilter: 'blur(10px)', // Efecto borroso detrás
                color: '#FFFFFF',
                border: '1px solid rgba(0, 255, 153, 0.3)', // Borde verde sutil
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                fontFamily: 'system-ui, sans-serif',
                transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 255, 153, 0.9)'; // Verde al pasar mouse
                e.currentTarget.style.color = '#000000';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 255, 153, 0.4)';
                e.currentTarget.style.borderColor = 'transparent';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(10, 10, 10, 0.7)';
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
                e.currentTarget.style.borderColor = 'rgba(0, 255, 153, 0.3)';
            }}
        >
            Iniciar Proyecto
        </button>
    );
};

export default MoneyButton;
