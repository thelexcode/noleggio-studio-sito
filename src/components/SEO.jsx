import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title = 'Noleggio Studio TV | Spazi e Regia per Broadcast Professionali',
  description = 'Noleggio studi televisivi professionali a Busto Arsizio (Varese). Regia mobile, live streaming, post-produzione. Attrezzature 4K e supporto tecnico per produzioni broadcast di qualità.',
  keywords = 'noleggio studio televisivo, studio tv, regia mobile, live streaming, noleggio studio Varese, noleggio studio Milano, post produzione, broadcast, streaming professionale, studio 4K, regia video',
  image = '/images/S1.jpg',
  url = 'https://noleggiostudio.tv',
  type = 'website',
  author = 'Noleggio Studio TV'
}) => {
  const siteUrl = 'https://noleggiostudio.tv';
  const fullUrl = url.startsWith('http') ? url : `${siteUrl}${url}`;
  const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content="Noleggio Studio TV" />
      <meta property="og:locale" content="it_IT" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={imageUrl} />

      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="language" content="Italian" />
      <meta name="geo.region" content="IT-VA" />
      <meta name="geo.placename" content="Busto Arsizio" />
      <meta name="geo.position" content="45.6103;8.8528" />
      <meta name="ICBM" content="45.6103, 8.8528" />
    </Helmet>
  );
};

export default SEO;
