import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
// import Navbar from './components/Navbar'; // Removed per universal navigation update
import ScrollToTop from './components/ScrollToTop';
import { LanguageProvider } from './context/LanguageProvider';
import { ScrollProvider } from './context/ScrollProvider';
import { SoundProvider } from './context/SoundContext';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Home from './pages/HomeCinematic';
import Cursor from './components/Cursor';
import NotFound from './pages/NotFound';
// import CinematicDev from './pages/CinematicDev'; // Development Environment
import SoundToggle from './components/SoundToggle';

const Identidad = lazy(() => import('./pages/Identidad'));
const Arquitectura = lazy(() => import('./pages/Arquitectura'));
const Automatizacion = lazy(() => import('./pages/Automatizacion'));
const Contacto = lazy(() => import('./pages/Contacto'));
const Privacidad = lazy(() => import('./pages/Privacidad'));
const Terminos = lazy(() => import('./pages/Terminos'));
const Playground = lazy(() => import('./pages/Playground'));

gsap.registerPlugin(ScrollTrigger);

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

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    // Integrar el ciclo de animación de Lenis con el Ticker principal de GSAP
    gsap.ticker.add(raf);

    // Desactivar el suavizado de lag de GSAP para evitar conflictos con Lenis
    gsap.ticker.lagSmoothing(0);

    return () => {
      // Limpiar al desmontar
      lenis.destroy();
      gsap.ticker.remove(raf);
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
              <Suspense fallback={null}>
                <Routes>
                  {/* Development paths disabled for production security
                  <Route path="/cinematic-dev" element={<CinematicDev />} />
                  */}
                  <Route path="/automatizacion" element={<Automatizacion />} />
                  <Route path="/esencia" element={<Home />} />
                  <Route path="/" element={<Home />} />
                  <Route path="/identidad" element={<Identidad />} />
                  <Route path="/infraestructura" element={<Arquitectura />} />
                  <Route path="/contacto" element={<Contacto />} />
                  <Route path="/privacidad" element={<Privacidad />} />
                  <Route path="/terminos" element={<Terminos />} />
                  <Route path="/playground" element={<Playground />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </Layout>
          </Router>
        </ScrollProvider>
      </SoundProvider>
    </LanguageProvider>
  );
}

export default App;
