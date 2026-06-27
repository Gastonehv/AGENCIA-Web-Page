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
    description = "AgencIA diseña sitios web, apps, automatizaciones con IA y sistemas digitales premium para negocios que quieren crecer.",
    keywords = "Agencia IA, desarrollo web, automatización con IA, apps web, sistemas digitales, SEO técnico, AI SEO, México",
    image = "/og-image.jpg",
    url = "https://agenciamx.app/",
    canonical,
    noindex = false
}) => {
    const siteTitle = title.includes('AgencIA') ? title : `AgencIA | ${title}`;
    const canonicalUrl = canonical || url;
    const imageUrl = toAbsoluteImage(image);

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
            <meta property="og:site_name" content="AgencIA" />
            <meta property="og:locale" content="es_MX" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={canonicalUrl} />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={imageUrl} />
        </Helmet>
    );
};

export default SEO;
