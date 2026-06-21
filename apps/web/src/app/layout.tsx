import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';

import { Providers } from '@/components/providers';

import '@punch-it/ui/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: {
    default: 'PUNCH.IT — Deploy Anything. Instantly.',
    template: '%s | PUNCH.IT',
  },
  description: 'GitHub to Production in Seconds. The modern AI-powered deployment platform.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
