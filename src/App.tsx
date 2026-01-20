import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import { LanguageProvider } from './context/LanguageProvider';
import { ScrollProvider } from './context/ScrollProvider';

// Pages
import Home from './pages/Home';
import Identidad from './pages/Identidad';
import Arquitectura from './pages/Arquitectura';
import Automatizacion from './pages/Automatizacion';
import Contacto from './pages/Contacto';
import Privacidad from './pages/Privacidad';
import Terminos from './pages/Terminos';
import Playground from './pages/Playground';
import NarrativePrototype from './pages/NarrativePrototype';
import Cursor from './components/Cursor';
import EssenceBackground from './components/EssenceBackground';

function App() {
  return (
    <LanguageProvider>
      <ScrollProvider>
        <Router>
          <EssenceBackground />
          <Cursor />
          <ScrollToTop />
          <Layout>
            <Navbar />
            <Routes>
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
            </Routes>
          </Layout>
        </Router>
      </ScrollProvider>
    </LanguageProvider>
  );
}

export default App;
