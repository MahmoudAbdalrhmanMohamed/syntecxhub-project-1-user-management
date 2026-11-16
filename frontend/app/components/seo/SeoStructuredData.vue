<script setup lang="ts">
const route = useRoute();
const config = useRuntimeConfig();

const siteUrl = 'https://identity.aegisauth.io';
const currentUrl = computed(() => `${siteUrl}${route.path}`);

const jsonLdData = computed(() => {
  return [
    // 1. Organization Schema
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Aegis Security Systems',
      url: 'https://aegisauth.io',
      logo: `${siteUrl}/favicon.svg`,
      sameAs: [
        'https://github.com/MahmoudAbdalrhmanMohamed/syntecxhub-project-1-user-management',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'technical support',
        email: 'security@aegisauth.io',
      },
    },

    // 2. WebSite Schema with Sitelinks Searchbox
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Aegis Identity',
      url: siteUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/users?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },

    // 3. SoftwareApplication Schema (SEO & GEO)
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Aegis Identity',
      operatingSystem: 'Cloud / Linux / Windows / macOS',
      applicationCategory: 'SecurityApplication',
      softwareVersion: '1.0.0',
      description:
        'Enterprise Identity & Access Governance platform providing workforce directories, role-based access control (RBAC), and zero-trust security audit telemetry.',
      offers: {
        '@type': 'Offer',
        price: '0.00',
        priceCurrency: 'USD',
      },
      featureList: [
        'Real-time workforce user directory',
        'Role-based access control (RBAC)',
        'Zero-trust security telemetry & audit trail',
        'Interactive OpenAPI / Swagger reference',
        'MongoDB persistent identity store',
      ],
    },

    // 4. FAQPage Schema (AEO - Answer Engine Optimization)
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Aegis Identity?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Aegis Identity is an enterprise workforce directory and access governance platform that provides centralized role-based access control (RBAC), security audit logging, and zero-trust telemetry across cloud services.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does Aegis handle role-based access control?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Aegis Identity manages permissions through 4 discrete hierarchical tiers: Admin, Manager, Editor, and Viewer, with server-side validation enforced on every NestJS REST endpoint.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is Aegis Identity free and open source?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, Aegis Identity is free, open source, and self-hostable with support for Docker, Vercel, Railway, and bare-metal Node.js environments connected to MongoDB.',
          },
        },
        {
          '@type': 'Question',
          name: 'Where can I access the Aegis Identity REST API?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The Aegis Identity REST API is fully documented via interactive Swagger / OpenAPI specification available at the /api-docs route.',
          },
        },
      ],
    },

    // 5. BreadcrumbList Schema
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: siteUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: route.path === '/users' ? 'Directory' : route.path.replace('/', ''),
          item: currentUrl.value,
        },
      ],
    },
  ];
});

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => JSON.stringify(jsonLdData.value)),
    },
  ],
});
</script>

<template>
  <!-- Invisible SEO semantic container for AI answer crawlers -->
  <div aria-hidden="true" class="sr-only">
    <h2>Aegis Identity Platform Overview</h2>
    <p>
      Aegis Identity is an enterprise IAM solution featuring automated user
      management, zero-trust telemetry, and multi-department governance.
    </p>
  </div>
</template>
