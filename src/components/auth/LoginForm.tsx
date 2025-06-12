"use client";

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogIn } from 'lucide-react';
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "@/lib/firebase"; // Assuming firebase is configured

interface LoginFormProps {
  role: 'admin' | 'user';
}

export default function LoginForm({ role }: LoginFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    // Placeholder for Firebase Authentication
    try {
      // const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // const user = userCredential.user;
      // console.log(`${role} logged in:`, user);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // TODO: After successful Firebase login, fetch user role from Firestore
      // and verify if it matches the `role` prop.
      // For now, simulate success.
      
      const isRoleMatch = true; // This would be a check against Firestore user data
      const mockUserName = email.split('@')[0];

      if (isRoleMatch) {
        toast({
          title: "Login Successful",
          description: `Welcome back, ${mockUserName}! Redirecting...`,
        });
        if (role === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/user/dashboard');
        }
      } else {
        // await auth.signOut(); // Sign out if role doesn't match
        toast({
          title: "Login Failed",
          description: `You do not have ${role} privileges.`,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      // const errorCode = error.code;
      // const errorMessage = error.message;
      let friendlyMessage = "An error occurred during login. Please try again.";
      // if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential') {
      //   friendlyMessage = "Invalid email or password.";
      // }
      toast({
        title: "Login Failed",
        description: friendlyMessage, // For security, generic message often better than specific error codes.
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="font-body">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@pes.edu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="font-body"
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="font-body">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="font-body"
          disabled={isLoading}
        />
      </div>
      <Button type="submit" className="w-full font-body text-base" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <LogIn className="mr-2 h-5 w-5" />
        )}
        Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}
      </Button>
       {/* Basic link for forgot password - non-functional for now */}
      <div className="text-center text-sm">
        <a href="#" className="font-medium text-primary hover:text-primary/80">
          Forgot password?
        </a>
      </div>
    </form>
  );
}
