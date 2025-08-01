'use client';

import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/ThemeProvider';
import { useRef } from 'react';

// This is a client component, so we can't use the metadata export.
// export const metadata: Metadata = {
//   title: 'Paster',
//   description: 'Create and share encrypted, auto-expiring text pastes.',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <title>Paster</title>
        <meta name="description" content="Create and share encrypted, auto-expiring text pastes." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body 
        className={cn(
          "font-body antialiased bg-background"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div 
            className="relative min-h-screen bg-background"
            style={{
              backgroundImage: `linear-gradient(to right, hsl(var(--primary)/0.1), hsl(var(--secondary)/0.1), hsl(var(--primary)/0.1))`,
              backgroundSize: '200% auto',
              animation: 'background-pan 15s linear infinite',
            } as React.CSSProperties}
          >
            {children}
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
