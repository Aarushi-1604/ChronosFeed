import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from '../context/theme-context';
import SettingsPortal from '../components/ui/settings-portal';
import './globals.css';

export const metadata: Metadata = {
  title: 'ChronosFeed | Alternate Reality Simulation Console',
  description: 'Explore timelines, news, and social feeds of history diverted. What if the internet was invented in 1890?',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-text-main" suppressHydrationWarning>
        <ThemeProvider>
          {children}
          <div className="fixed bottom-6 left-6 z-50">
            <SettingsPortal />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
