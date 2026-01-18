import { useHead } from '@vueuse/head'
import { computed } from 'vue'

export interface SEOConfig {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: string
  keywords?: string[]
  author?: string
  publishedTime?: string
  modifiedTime?: string
}

const defaultConfig: Required<Omit<SEOConfig, 'keywords' | 'author' | 'publishedTime' | 'modifiedTime'>> & {
  keywords: string[]
} = {
  title: 'HG Alumni - Alumni-Verein des Hainberg-Gymnasiums Göttingen',
  description: 'HG Alumni Verein - Alumni-Verein des Hainberg-Gymnasiums Göttingen e.V. Verbinden Sie sich mit ehemaligen Schülern des Hainberg Gymnasiums und bleiben Sie in Kontakt.',
  image: '/images/hglogo.png',
  url: 'https://alumni-hg.de',
  type: 'website',
  keywords: [
    'HG Alumni', 
    'Hainberg Gymnasium Alumni', 
    'Hainberg-Gymnasium Alumni',
    'HG Göttingen Alumni',
    'Alumni HG',
    'Alumni Hainberg',
    'Alumni Hainberg-Gymnasium',
    'Hainberg Gymnasium',
    'Hainberg-Gymnasium',
    'HG Göttingen',
    'Alumni-Verein',
    'Alumni Verein',
    'Ehemalige Schüler Hainberg',
    'Ehemalige Schüler HG',
    'Göttingen Alumni',
    'Hainberg Gymnasium Göttingen'
  ]
}

export function useSEO(config: SEOConfig = {}) {
  const siteUrl = import.meta.env.VITE_SITE_URL || defaultConfig.url
  const baseTitle = defaultConfig.title
  
  const title = computed(() => {
    if (!config.title) return baseTitle
    return config.title.includes(baseTitle) 
      ? config.title 
      : `${config.title} | ${baseTitle}`
  })

  const description = computed(() => config.description || defaultConfig.description)
  const image = computed(() => {
    if (config.image) {
      return config.image.startsWith('http') ? config.image : `${siteUrl}${config.image}`
    }
    return `${siteUrl}${defaultConfig.image}`
  })
  const url = computed(() => config.url || siteUrl)
  const type = computed(() => config.type || defaultConfig.type)
  const keywords = computed(() => config.keywords || defaultConfig.keywords)

  useHead({
    title: title.value,
    meta: [
      // Basis Meta-Tags
      {
        name: 'description',
        content: description.value
      },
      {
        name: 'keywords',
        content: keywords.value.join(', ')
      },
      {
        name: 'author',
        content: config.author || 'Alumni-Verein des Hainberg-Gymnasiums'
      },
      
      // Open Graph Meta-Tags
      {
        property: 'og:title',
        content: title.value
      },
      {
        property: 'og:description',
        content: description.value
      },
      {
        property: 'og:image',
        content: image.value
      },
      {
        property: 'og:url',
        content: url.value
      },
      {
        property: 'og:type',
        content: type.value
      },
      {
        property: 'og:site_name',
        content: baseTitle
      },
      {
        property: 'og:locale',
        content: 'de_DE'
      },
      
      // Twitter Card Meta-Tags
      {
        name: 'twitter:card',
        content: 'summary_large_image'
      },
      {
        name: 'twitter:title',
        content: title.value
      },
      {
        name: 'twitter:description',
        content: description.value
      },
      {
        name: 'twitter:image',
        content: image.value
      },
      
      // Artikel-spezifische Meta-Tags
      ...(config.publishedTime ? [{
        property: 'article:published_time',
        content: config.publishedTime
      }] : []),
      ...(config.modifiedTime ? [{
        property: 'article:modified_time',
        content: config.modifiedTime
      }] : []),
      ...(config.keywords ? config.keywords.map(keyword => ({
        property: 'article:tag',
        content: keyword
      })) : [])
    ],
    link: [
      {
        rel: 'canonical',
        href: url.value
      }
    ]
  })

  // JSON-LD Structured Data
  const jsonLd = computed(() => {
    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': type.value === 'article' ? 'Article' : 'Organization',
      name: baseTitle,
      alternateName: ['HG Alumni', 'Hainberg Gymnasium Alumni', 'Alumni-Verein HG', 'Alumni Hainberg-Gymnasium'],
      url: siteUrl,
      logo: `${siteUrl}${defaultConfig.image}`,
      description: description.value,
      keywords: keywords.value.join(', ')
    }

    if (type.value === 'article') {
      return {
        ...baseSchema,
        '@type': 'Article',
        headline: title.value,
        description: description.value,
        image: image.value,
        datePublished: config.publishedTime,
        dateModified: config.modifiedTime || config.publishedTime,
        author: {
          '@type': 'Organization',
          name: config.author || baseTitle
        },
        publisher: {
          '@type': 'Organization',
          name: baseTitle,
          logo: {
            '@type': 'ImageObject',
            url: `${siteUrl}${defaultConfig.image}`
          }
        }
      }
    }

    return baseSchema
  })

  // JSON-LD zum Head hinzufügen
  useHead({
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify(jsonLd.value)
      }
    ]
  })
}

