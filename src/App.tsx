import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
// import Navbar from './components/Navbar'; // Removed per universal navigation update
import ScrollToTop from './components/ScrollToTop';
import { LanguageProvider } from './context/LanguageProvider';
import { ScrollProvider } from './context/ScrollProvider';
import { SoundProvider } from './context/SoundContext';

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
