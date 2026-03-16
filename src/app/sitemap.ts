import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://libraryos-lms.vercel.app'
  const now = new Date()

  const routes = [
    '',
    '/features',
    '/pricing',
    '/demo',
    '/help',
    '/founder',
    '/library-register',
    '/privacy',
    '/refund',
    '/terms',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: (route === '' ? 'daily' : 'weekly') as 'daily' | 'weekly',
    priority: route === '' ? 1.0 : route === '/pricing' || route === '/features' ? 0.8 : 0.5,
  }))
}
