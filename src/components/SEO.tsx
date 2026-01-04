import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
}

const SEO: React.FC<SEOProps> = ({
    title,
    description = "Agencia de Transformación Digital. Inteligencia Artificial, Automatización y Diseño Estratégico.",
    keywords = "Agencia IA, Desarrollo Web, Automatización, Diseño, Branding, México, Xalapa, Global",
    image = "/og-image.jpg",
    url = "https://www.agenciamx.app"
}) => {
    const siteTitle = `AgencIA | ${title}`;

    return (
        <Helmet>
            {/* Standard Metrics */}
            <title>{siteTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={siteTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />
        </Helmet>
    );
};

export default SEO;
