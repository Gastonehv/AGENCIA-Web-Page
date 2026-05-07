import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
// import Navbar from './components/Navbar'; // Removed per universal navigation update
import ScrollToTop from './components/ScrollToTop';
import { LanguageProvider } from './context/LanguageProvider';
import { ScrollProvider } from './context/ScrollProvider';
import { SoundProvider } from './context/SoundContext';
import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Pages
import Home from './pages/HomeCinematic';
import Identidad from './pages/Identidad';
import Arquitectura from './pages/Arquitectura';
import Automatizacion from './pages/Automatizacion';
import Contacto from './pages/Contacto';
import Privacidad from './pages/Privacidad';
import Terminos from './pages/Terminos';
import Playground from './pages/Playground';
import NarrativePrototype from './pages/NarrativePrototype';
import Cursor from './components/Cursor';
import NotFound from './pages/NotFound';
import CinematicDev from './pages/CinematicDev'; // Development Environment
import SoundToggle from './components/SoundToggle';

function App() {
  // Inicialización de Smooth Scroll (Lenis) sincronizado con GSAP
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Curva suave
      infinite: false,
    });

    // Sincronizar Lenis con ScrollTrigger de GSAP
    lenis.on('scroll', ScrollTrigger.update);

    // Integrar el ciclo de animación de Lenis con el Ticker principal de GSAP
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Desactivar el suavizado de lag de GSAP para evitar conflictos con Lenis
    gsap.ticker.lagSmoothing(0);

    return () => {
      // Limpiar al desmontar
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  return (
    <LanguageProvider>
      <SoundProvider>
        <ScrollProvider>
          <Router>
            <Cursor />
            <SoundToggle />
            <ScrollToTop />
            <Layout>
              {/* <Navbar /> SC: REMOVED as per user request. Gravity Orb is now the Universal Interface. */}
              <Routes>
                <Route path="/cinematic-dev" element={<CinematicDev />} />
                <Route path="/narrativa-v1" element={<NarrativePrototype />} />
                <Route path="/automatizacion" element={<Automatizacion />} />
                <Route path="/esencia" element={<Navigate to="/" replace />} />
                <Route path="/" element={<Home />} />
                <Route path="/identidad" element={<Identidad />} />
                <Route path="/infraestructura" element={<Arquitectura />} />
                <Route path="/contacto" element={<Contacto />} />
                <Route path="/privacidad" element={<Privacidad />} />
                <Route path="/terminos" element={<Terminos />} />
                <Route path="/playground" element={<Playground />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </Router>
        </ScrollProvider>
      </SoundProvider>
    </LanguageProvider>
  );
}

export default App;
