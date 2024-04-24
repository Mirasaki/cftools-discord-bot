import type { Metadata, Viewport } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { fontSans } from '@/lib/fonts';
import { ThemeProvider } from '@/components/theme/theme-provider';
import Header from '@/components/navigation/animated-header';
import Footer from '@/components/footer/footer';
import { config } from '../../config';

export const runtime = config.runtime;

export const viewport: Viewport = {
  themeColor: config.themeColor,
};

export async function generateMetadata(): Promise<Metadata> {
  const sharedMetadata: Metadata = {
    metadataBase: new URL(config.site.url),
    creator: 'Mirasaki Development',
    alternates: { canonical: '/' },
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
    twitter: {
      card: config.site.twitter?.card ?? 'summary_large_image',
      site: config.site.twitter?.site ?? '@site',
      creator: config.site.twitter?.creator ?? '@creator',
      images: [],
    },
  };
  if (config.site.twitter?.images) {
    if (!sharedMetadata.twitter) sharedMetadata.twitter = { images: [] };
    sharedMetadata.twitter.images = config.site.twitter.images.map(({ url, alt }) => ({
      url: sharedMetadata.metadataBase
        ? new URL(url, sharedMetadata.metadataBase).href
        : url,
      alt,
    }));
  }
  return {
    ...sharedMetadata,
    title: {
      default: config.pages.home.title,
      template: config.site.titleTemplate ?? `%s | ${config.site.title}`,
    },
    description: config.pages.home.description,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        'min-h-screen bg-background font-sans antialiased',
        fontSans.variable
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
          forcedTheme='dark'
        >
          <div className="flex min-h-screen flex-col">
            <div id="anchor-top" aria-hidden />
            <Header />
            <div className="flex flex-1 flex-grow items-center justify-center relative">
              {children}
            </div>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
