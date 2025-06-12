import type { ReactNode } from 'react';
import { AppLogo } from '@/components/navigation/AppLogo';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { COLLEGE_NAME } from '@/lib/constants';

interface AuthLayoutProps {
  children: ReactNode;
  pageTitle: string;
  pageDescription: string;
}

export default function AuthLayout({ children, pageTitle, pageDescription }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/30 p-4 selection:bg-primary/20">
      <div className="absolute top-6 left-6">
        <AppLogo textSize="text-2xl" iconSize={32} />
      </div>
      <main className="w-full max-w-6xl flex items-center justify-center">
        <div className="grid md:grid-cols-2 gap-8 items-center w-full">
          <div className="hidden md:flex flex-col items-center justify-center p-8">
            <Image 
              src="https://placehold.co/500x500.png" 
              alt="Library study illustration" 
              data-ai-hint="library study"
              width={500} 
              height={500} 
              className="rounded-lg shadow-2xl object-contain"
            />
            <p className="mt-6 text-center text-lg text-foreground/80 font-body">
              Empowering learning at {COLLEGE_NAME}.
            </p>
          </div>
          <Card className="w-full max-w-md shadow-2xl bg-card/90 backdrop-blur-sm">
            <CardContent className="p-8 space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-headline font-bold text-primary">{pageTitle}</h1>
                <p className="text-muted-foreground font-body">{pageDescription}</p>
              </div>
              {children}
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="absolute bottom-6 text-center text-sm text-foreground/60 font-body">
        &copy; {new Date().getFullYear()} {COLLEGE_NAME}. All rights reserved.
      </footer>
    </div>
  );
}
