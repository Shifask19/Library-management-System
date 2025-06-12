
"use client";

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogIn } from 'lucide-react';
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase.ts"; // Assuming firebase is configured
import { doc, getDoc } from "firebase/firestore";

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
    console.log(`LoginForm: Attempting login for role: ${role} with email: ${email}`);

    if (!auth || !db) {
      console.error("LoginForm: Firebase auth or db is not initialized. Check firebase.ts and .env.local.");
      toast({
        title: "Configuration Error",
        description: "Firebase is not configured correctly. Please contact support.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(`LoginForm: Firebase Auth successful. User UID: ${user.uid}`);

      // Fetch user role from Firestore
      const userDocRef = doc(db, "users", user.uid);
      console.log(`LoginForm: Fetching user document from Firestore: users/${user.uid}`);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("LoginForm: User document found in Firestore:", userData);
        if (userData.role === role) {
          console.log(`LoginForm: Role match successful (${userData.role}). Redirecting...`);
          toast({
            title: "Login Successful",
            description: `Welcome back, ${userData.name || user.email}! Redirecting...`,
          });
          if (role === 'admin') {
            router.push('/admin/dashboard');
          } else {
            router.push('/user/dashboard');
          }
        } else {
          console.warn(`LoginForm: Role mismatch. Expected role: ${role}, but found: ${userData.role}. Signing out.`);
          await signOut(auth); // Sign out if role doesn't match
          toast({
            title: "Login Failed",
            description: `You do not have ${role} privileges. Access denied.`,
            variant: "destructive",
          });
        }
      } else {
        console.warn(`LoginForm: User document not found in Firestore for UID: ${user.uid}. Signing out.`);
        await signOut(auth); // Sign out if user document not found in Firestore
        toast({
          title: "Login Failed",
          description: "User profile not found in database. Please contact support.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("LoginForm: Login error:", error);
      let friendlyMessage = "An error occurred during login. Please try again.";
      if (error.code) {
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            friendlyMessage = "Invalid email or password.";
            break;
          case 'auth/invalid-api-key':
            friendlyMessage = "Firebase API Key is invalid. Please check configuration.";
            break;
          case 'auth/configuration-not-found':
             friendlyMessage = "Firebase configuration not found. Please check Firebase setup and ensure Identity Toolkit API is enabled.";
            break;
          default:
            friendlyMessage = `Login failed: ${error.message}`;
        }
      }
      toast({
        title: "Login Failed",
        description: friendlyMessage,
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
