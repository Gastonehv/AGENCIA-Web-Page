import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useScroll } from '../context/ScrollContext';

const ScrollToTop = () => {
    const { pathname, hash } = useLocation();
    const { lenis } = useScroll();

    useEffect(() => {
        if (lenis) {
            if (hash) {
                // If hash exists, scroll to it (Lenis handles selectors)
                lenis.scrollTo(hash, { immediate: true });
            } else {
                // Otherwise scroll to top
                lenis.scrollTo(0, { immediate: true });
            }
        } else {
            if (!hash) {
                window.scrollTo(0, 0);
            }
            // Logic for native hash scroll if needed, but Lenis is primary
        }
    }, [pathname, hash, lenis]);

    return null;
};

export default ScrollToTop;
