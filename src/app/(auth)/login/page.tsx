// src/app/(auth)/login/page.tsx
import { AuthTemplate } from "@/components/templates/AuthTemplate";
import { LoginInfo } from "@/components/organisms/AuthInfoSection";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import Link from "next/link";
import { signIn } from "../actions";
import GoogleAuthButton from "@/components/molecules/GoogleAuthButton";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const errorMessage = searchParams.error;
  const loginForm = (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Welcome Back
        </h2>
        <p className="mt-2 text-slate-600">
          Enter your credentials to access your AI-powered career dashboard.
        </p>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 animate-in fade-in slide-in-from-top-1">
          <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
          </svg>
          <p>{decodeURIComponent(errorMessage)}</p>
        </div>
      )}
      <GoogleAuthButton mode="login" />

      <div className="relative flex items-center justify-center py-2">
        <div className="w-full border-t border-slate-200"></div>
        <span className="absolute bg-white px-4 text-xs font-medium uppercase text-slate-400">
          Or continue with email
        </span>
      </div>

      <form action={signIn} className="space-y-5">
        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="sarah@example.com"
          required
        />

        <div className="relative">
          <Link
            href="#"
            className="absolute right-0 top-0 text-xs font-semibold text-primary hover:underline"
          >
            Forgot password?
          </Link>
          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm text-slate-600">
        Don't have an account?{" "}
        <Link
          href="/register"
          className="font-bold text-primary hover:underline"
        >
          Sign up for free
        </Link>
      </p>
    </div>
  );

  return (
    <AuthTemplate
      formSection={loginForm}
      infoSection={<LoginInfo />}
      reverse={true} // Form di KANAN, Gambar di KIRI
    />
  );
}
