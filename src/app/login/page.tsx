'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/icons/logo";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth, useUser } from "@/firebase/provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { signInWithEmailAndPassword, AuthError } from "firebase/auth";

const formSchema = z.object({
  email: z.string().email("Invalid email address.").min(1, "Email is required."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export default function LoginPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "demo@example.com",
      password: "password",
    },
  });

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!auth) return;
    setIsSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({
        title: "Signed In",
        description: "Welcome back!",
      });
      // On success, the useEffect will handle the redirect
    } catch (error) {
        const authError = error as AuthError;
        let errorMessage = "An unknown error occurred.";
        if (authError.code) {
            switch(authError.code) {
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                case 'auth/invalid-credential':
                    errorMessage = "Invalid email or password. Please try again.";
                    break;
                case 'auth/too-many-requests':
                    errorMessage = "Too many sign-in attempts. Please try again later.";
                    break;
                default:
                    errorMessage = "An unexpected error occurred during sign-in.";
            }
        }
        
        toast({
            variant: "destructive",
            title: "Sign In Failed",
            description: errorMessage,
        });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isUserLoading || user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-bold">ExecuDash</CardTitle>
          <CardDescription>
            Your AI-Powered Executive Dashboard
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="demo@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                <p>
                  Use <span className="font-semibold text-foreground">demo@example.com</span> and <span className="font-semibold text-foreground">password</span>
                </p>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
