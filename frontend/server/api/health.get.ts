export default defineEventHandler(() => {
  const config = useRuntimeConfig();
  return {
    status: 'ok',
    service: 'aegis-identity-nuxt4-gateway',
    upstreamApiBaseUrl: config.public.apiBaseUrl,
    timestamp: new Date().toISOString(),
  };
});
