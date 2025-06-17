
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Compass } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Oidemase Japan',
  description: 'AI-powered travel assistant for Japan',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col">
        <header className="bg-primary text-primary-foreground p-4 shadow-md">
          <div className="container mx-auto">
            <div className="flex items-center gap-2">
              <Compass size={28} />
              <div>
                <p className="text-xs text-primary-foreground/80">"Oidemase" means "Welcome!"</p>
                <h1 className="text-2xl font-headline font-bold">Oidemase Japan</h1>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
        <Toaster />
        <footer className="bg-muted text-muted-foreground p-4 text-center text-sm">
          © {new Date().getFullYear()} Oidemase Japan. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
