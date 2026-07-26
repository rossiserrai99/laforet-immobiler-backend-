import propertyService from '@/services/property.service';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://laforet-immo.dz';

  // Base static routes
  const staticRoutes = ['', '/properties', '/estimation', '/contact', '/about'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/' ? 'daily' : 'weekly',
    priority: route === '/' ? 1.0 : 0.8,
  }));

  // Dynamic property routes
  let propertyRoutes = [];
  try {
    const res = await propertyService.getAll('?status=Disponible&limit=100');
    const properties = res.data?.properties || [];
    
    propertyRoutes = properties.map((property) => ({
      url: `${baseUrl}/properties/${property.slug}`,
      lastModified: property.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    }));
  } catch (error) {
    console.error('Failed to generate property sitemap routes', error);
  }

  return [...staticRoutes, ...propertyRoutes];
}
