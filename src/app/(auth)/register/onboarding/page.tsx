// src/app/(auth)/register/onboarding/page.tsx
import { AuthTemplate } from "@/components/templates/AuthTemplate";
import { RegisterInfo } from "@/components/organisms/AuthInfoSection";
import { Input } from "@/components/atoms/Input";
import { completeOnboarding } from "../../actions";
import { ErrorCleaner } from "../../login/ErrorCleaner";
import { AuthAlert } from "@/components/molecules/AuthAlert";
import { SubmitButton } from "../../login/SubmitButton";
import { Select } from "@/components/atoms/Select";
import { ADZUNA_COUNTRIES } from "@/constants/countries";

export default function OnboardingPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const formContent = (
    <div className="space-y-8">
      <ErrorCleaner />
      <div>
        <h2 className="text-3xl font-bold text-slate-900">
          Complete Your Profile
        </h2>
        <p className="mt-2 text-slate-600">
          Help us find the right opportunities for you.
        </p>
      </div>

      <AuthAlert error={searchParams.error} />

      <form action={completeOnboarding} className="space-y-5">
        <Input
          label="Job Title"
          id="job_title"
          name="job_title"
          placeholder="e.g. Software Engineer"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Country"
            name="country"
            id="country"
            options={ADZUNA_COUNTRIES}
            required
          />
          <Input
            label="City/Location"
            name="location"
            id="location"
            placeholder="Jakarta"
            required
          />
        </div>
        <Input
          label="Phone Number"
          name="phone_number"
          id="phone_number"
          type="tel"
          placeholder="+62..."
          required
        />

        <SubmitButton className="w-full text-base shadow-indigo-100">
          Finish & Go to Dashboard
        </SubmitButton>
      </form>
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
