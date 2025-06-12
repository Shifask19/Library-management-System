
"use client";

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserPlus } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase.ts";
import { doc, setDoc } from "firebase/firestore";
import Link from 'next/link';

export default function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast({
        title: "Signup Failed",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!auth || !db) {
      console.error("SignupForm: Firebase auth or db is not initialized.");
      toast({
        title: "Configuration Error",
        description: "Firebase is not configured correctly. Please contact support.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    console.warn("SignupForm: If you see 'auth/weak-password' or 'auth/email-already-in-use', check Firebase Auth settings and user inputs. Ensure Identity Toolkit API is enabled in Google Cloud and .env.local has correct Firebase config, and server was restarted.");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      console.log(`SignupForm: Firebase Auth user created. UID: ${firebaseUser.uid}`);

      // Update Firebase Auth user profile (optional, but good for display name)
      if (name) {
        await updateProfile(firebaseUser, { displayName: name });
      }

      // Create user document in Firestore
      const userDocRef = doc(db, "users", firebaseUser.uid);
      await setDoc(userDocRef, {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: name || null, // Store name, or null if not provided
        role: "user", // Default role for new signups
        createdAt: new Date().toISOString(),
      });
      console.log(`SignupForm: Firestore user document created for UID: ${firebaseUser.uid}`);

      toast({
        title: "Signup Successful!",
        description: `Welcome, ${name || firebaseUser.email}! Redirecting to your dashboard...`,
      });
      router.push('/user/dashboard');

    } catch (error: any) {
      console.error("SignupForm: Error:", error);
      let friendlyMessage = "An error occurred during signup. Please try again.";
      if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            friendlyMessage = "This email address is already in use. Try logging in.";
            break;
          case 'auth/weak-password':
            friendlyMessage = "Password is too weak. It should be at least 6 characters.";
            break;
          case 'auth/invalid-email':
            friendlyMessage = "The email address is not valid.";
            break;
          case 'auth/operation-not-allowed':
             friendlyMessage = "Email/password accounts are not enabled. Contact support.";
            break;
          default:
            friendlyMessage = `Signup failed: ${error.message}`;
        }
      }
      toast({
        title: "Signup Failed",
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
        <Label htmlFor="name" className="font-body">Full Name (Optional)</Label>
        <Input
          id="name"
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="font-body"
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email-signup" className="font-body">Email Address</Label>
        <Input
          id="email-signup"
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
        <Label htmlFor="password-signup" className="font-body">Password</Label>
        <Input
          id="password-signup"
          type="password"
          placeholder="•••••••• (min. 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="font-body"
          disabled={isLoading}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-password-signup" className="font-body">Confirm Password</Label>
        <Input
          id="confirm-password-signup"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="font-body"
          disabled={isLoading}
        />
      </div>
      <Button type="submit" className="w-full font-body text-base" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <UserPlus className="mr-2 h-5 w-5" />
        )}
        Create Account
      </Button>
      <div className="text-sm text-center">
        <Link href="/login/user" className="font-medium text-primary hover:text-primary/80">
          Already have an account? Sign In
        </Link>
      </div>
    </form>
  );
}
