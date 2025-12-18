import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';
import { LanguageProvider } from './context/LanguageProvider';
import { ScrollProvider } from './context/ScrollProvider';

// Pages
import Home from './pages/Home';
import Esencia from './pages/Esencia';
import Identidad from './pages/Identidad';
import Arquitectura from './pages/Arquitectura';
import Inteligencia from './pages/Inteligencia';
import Automatizacion from './pages/Automatizacion';
import Contacto from './pages/Contacto';

import Cursor from './components/Cursor';

function App() {
  return (
    <LanguageProvider>
      <ScrollProvider>
        <Router>
          <Cursor />
          <ScrollToTop />
          <Layout>
            <Navbar />
            <Routes>
              <Route path="/automatizacion" element={<Automatizacion />} />
              <Route path="/" element={<Home />} />
              <Route path="/esencia" element={<Esencia />} />
              <Route path="/identidad" element={<Identidad />} />
              <Route path="/arquitectura" element={<Arquitectura />} />
              <Route path="/inteligencia" element={<Inteligencia />} />
              <Route path="/contacto" element={<Contacto />} />
            </Routes>
          </Layout>
        </Router>
      </ScrollProvider>
    </LanguageProvider>
  );
}

export default App;
