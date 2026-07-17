import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    canonical?: string;
    noindex?: boolean;
}

const toAbsoluteImage = (image: string) => image.startsWith('http') ? image : `https://agenciamx.app${image}`;

const SEO: React.FC<SEOProps> = ({
    title,
    description = "Diseñamos y ponemos a trabajar sistemas y agentes de IA que ejecutan procesos, coordinan operaciones y amplían la capacidad de tu equipo.",
    keywords = "agencIA, fuerza laboral digital, agentes de IA, agentes autónomos, automatización empresarial, inteligencia operativa, sistemas 360, infraestructura digital inteligente, México",
    image = "/og-infraestructura-digital-inteligente.png",
    url = "https://agenciamx.app/",
    canonical,
    noindex = false
}) => {
    const siteTitle = /agencIA/i.test(title) ? title.replace(/AgencIA/g, 'agencIA') : `agencIA | ${title}`;
    const canonicalUrl = canonical || url;
    const imageUrl = toAbsoluteImage(image);

    React.useEffect(() => {
        const cleanup = window.setTimeout(() => {
            const keepLast = (selector: string) => {
                const nodes = Array.from(document.querySelectorAll(selector));
                nodes.slice(0, -1).forEach(node => node.parentElement?.removeChild(node));
            };
            keepLast('meta[name="description"]');
            keepLast('meta[name="keywords"]');
            keepLast('meta[name="robots"]');
            keepLast('link[rel="canonical"]');
        }, 0);

        return () => window.clearTimeout(cleanup);
    }, [description, keywords, canonicalUrl, noindex]);

    return (
        <Helmet>
            {/* Standard Metrics */}
            <title>{siteTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={imageUrl} />
            <meta property="og:image:type" content="image/png" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content="agencIA — La fuerza laboral digital de tu empresa" />
            <meta property="og:site_name" content="agencIA" />
            <meta property="og:locale" content="es_MX" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={canonicalUrl} />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={imageUrl} />
            <meta name="twitter:image:alt" content="agencIA — La fuerza laboral digital de tu empresa" />
        </Helmet>
    );
};

export default SEO;
