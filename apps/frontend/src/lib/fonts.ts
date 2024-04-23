import { JetBrains_Mono as FontMono, Inter as FontSans, Inter } from 'next/font/google';

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const fontMono = FontMono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const fontInter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});
