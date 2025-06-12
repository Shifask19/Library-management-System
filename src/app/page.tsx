
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, ShieldCheck, UserCircle, UserPlus } from 'lucide-react';
import { AppLogo } from '@/components/navigation/AppLogo';
import { COLLEGE_NAME, APP_NAME } from '@/lib/constants';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4">
      <header className="absolute top-6 left-6">
        <AppLogo textSize="text-2xl" iconSize={32}/>
      </header>
      
      <main className="flex flex-col items-center text-center space-y-12">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-headline font-bold text-primary tracking-tight">
            Welcome to <span className="text-accent">{APP_NAME}</span>
          </h1>
          <p className="text-xl text-foreground/80 font-body">
            Your digital gateway to knowledge at {COLLEGE_NAME}.
          </p>
        </div>

        <Image 
          src="https://placehold.co/600x400.png" 
          alt="Library illustration"
          data-ai-hint="library students"
          width={600} 
          height={400} 
          className="rounded-lg shadow-xl object-cover"
          priority
        />

        <div className="flex flex-col items-center gap-4 w-full max-w-2xl">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg w-full sm:w-auto">
            <Link href="/signup">
              <UserPlus className="mr-2 h-5 w-5" /> New User? Register Here
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl font-headline text-primary">
                <UserCircle className="w-7 h-7" />
                User Login
              </CardTitle>
              <CardDescription>
                Access your issued books, donate, and manage your library account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/login/user">
                  Proceed to User Portal <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
               <p className="text-sm text-muted-foreground">
                No account?{' '}
                <Link href="/signup" className="font-medium text-primary hover:underline">
                  Create one
                </Link>
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl font-headline text-accent">
                <ShieldCheck className="w-7 h-7" />
                Admin Login
              </CardTitle>
              <CardDescription>
                Manage library resources, users, and book circulation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/login/admin">
                  Access Admin Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="absolute bottom-6 text-center text-sm text-foreground/60 font-body">
        &copy; {new Date().getFullYear()} {APP_NAME}, {COLLEGE_NAME}. All rights reserved.
      </footer>
    </div>
  );
}
