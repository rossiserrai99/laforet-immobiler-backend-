export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://laforet-immo.dz';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
