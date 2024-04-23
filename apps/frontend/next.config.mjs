const {
  NODE_ENV,
  SENTRY_CSP_REPORT_URI,
} = process.env;

// style-src needs a nonce because NextJS requires unsafe-inline,
// Track the issue here: https://github.com/vercel/next.js/issues/18557
let ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' www.gstatic.com www.googletagmanager.com www.google.com ${NODE_ENV !== 'production' ? '\'unsafe-inline\' \'unsafe-eval\'' : ''};
  child-src 'self';
  style-src 'self' 'unsafe-inline' fonts.googleapis.com;
  font-src 'self' fonts.gstatic.com https: data:;
  frame-ancestors 'self';
  img-src 'self' *.google-analytics.com data: blob:;
  object-src 'self';
  form-action 'self';
  connect-src 'self' *.google-analytics.com;
  media-src 'self';
  manifest-src 'self';
  worker-src 'self';
  base-uri 'self';
  frame-src 'self' www.google.com;
`;

if (SENTRY_CSP_REPORT_URI && SENTRY_CSP_REPORT_URI.length) {
  ContentSecurityPolicy += `\nreport-uri ${SENTRY_CSP_REPORT_URI};`;
}

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim(),
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  {
    key: 'Expect-CT',
    value: 'max-age=0',
  },
];

const remotePatterns = [
  {
    protocol: 'https',
    hostname: 'lh3.googleusercontent.com',
  },
  {
    protocol: 'https',
    hostname: 'avatars.githubusercontent.com',
  },
];

if (process.env.NODE_ENV !== 'production') {
  remotePatterns.push({
    protocol: 'https',
    hostname: 'images.unsplash.com',
  });
}
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers () {
    return [
      {
        // Apply these headers to all routes in your application.
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/discord',
        destination: 'https://discord.gg/mirasaki',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns,
  },
};
 
export default nextConfig;
