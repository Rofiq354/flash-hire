// src/app/(auth)/register/page.tsx
import { AuthTemplate } from "@/components/templates/AuthTemplate";
import { RegisterInfo } from "@/components/organisms/AuthInfoSection";
import { AuthAlert } from "@/components/molecules/AuthAlert";
import { Input } from "@/components/atoms/Input";
import { signUp } from "../actions";
import Link from "next/link";
import GoogleAuthButton from "@/components/molecules/GoogleAuthButton";
import { ErrorCleaner } from "../login/ErrorCleaner";
import { SubmitButton } from "../login/SubmitButton";

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const formContent = (
    <div className="space-y-8">
      <ErrorCleaner />;
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
        <p className="mt-2 text-slate-600">
          Start your career journey with AI today.
        </p>
      </div>
      <AuthAlert error={searchParams.error} />
      <GoogleAuthButton mode="register" />
      <div className="relative flex items-center justify-center py-2">
        <div className="w-full border-t border-slate-200"></div>
        <span className="absolute bg-white px-4 text-xs font-medium uppercase text-slate-400">
          Or continue with email
        </span>
      </div>
      <form action={signUp} className="space-y-5">
        <Input
          label="Full Name"
          id="full_name"
          name="full_name"
          placeholder="Alex Rivera"
          required
        />
        <Input
          label="Email Address"
          id="email"
          name="email"
          type="email"
          placeholder="alex@example.com"
          autoComplete="email"
          required
        />
        <Input
          label="Password"
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          required
        />

        <SubmitButton className="w-full text-base shadow-indigo-100">
          Create Account
        </SubmitButton>
      </form>
      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-primary hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );

  return (
    <AuthTemplate
      formSection={formContent}
      infoSection={<RegisterInfo />}
      reverse={false}
    />
  );
}
