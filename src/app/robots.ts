import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://libraryos-lms.vercel.app'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/lms-admin/', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
