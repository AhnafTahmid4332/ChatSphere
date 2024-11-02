"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Github } from "lucide-react";
import Link from "next/link";
import {
  auth,
  googleProvider,
  signInWithPopup,
  githubProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "../lib/firebase"; // Adjust path if necessary
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function Component() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Google Sign-In successful:", user);
      router.push("/chat");
    } catch (error: any) {
      console.error("Error during Google Sign-In:", error.message);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;
      console.log("GitHub Sign-In successful:", user);
      router.push("/chat");
    } catch (error: any) {
      console.error("Error during GitHub Sign-In:", error.message);
    }
  };

  const handleEmailSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        console.log("Email Sign-In successful:", user);
        router.push("/chat");
      } else {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        console.log("Account created successfully:", user);
        router.push("/chat");
      }
    } catch (error: any) {
      console.error("Error during email authentication:", error.message);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm bg-zinc-950 border-zinc-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-zinc-50">
            {isLogin ? "Sign In" : "Create an Account"}
          </CardTitle>
          <CardDescription className="text-zinc-400">
            {isLogin
              ? "Enter your email and password to continue."
              : "Enter your email below to create your account."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="bg-zinc-950 border-zinc-800 text-zinc-50"
              onClick={handleGithubSignIn}
            >
              <Github className="mr-2 h-4 w-4" />
              Github
            </Button>
            <Button
              variant="outline"
              className="bg-zinc-950 border-zinc-800 text-zinc-50"
              onClick={handleGoogleSignIn}
            >
              <svg
                className="mr-2 h-4 w-4"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              >
                <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
              </svg>
              Google
            </Button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-zinc-950 px-2 text-zinc-400">
                or continue with
              </span>
            </div>
          </div>
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-50">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-zinc-950 border-zinc-800 text-zinc-50 focus-visible:ring-zinc-500"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-50">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-950 border-zinc-800 text-zinc-50 focus-visible:ring-zinc-500"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-zinc-50 text-zinc-900 hover:bg-zinc-200"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-zinc-400 text-sm text-center w-full">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={toggleForm}
              className="text-zinc-50 hover:underline"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
