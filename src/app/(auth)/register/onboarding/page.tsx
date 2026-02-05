// src/app/(auth)/register/onboarding/page.tsx
import { AuthTemplate } from "@/components/templates/AuthTemplate";
import { RegisterInfo } from "@/components/organisms/AuthInfoSection";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { completeOnboarding } from "../../actions";

export default function OnboardingPage() {
  const formContent = (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">
          Complete Your Profile
        </h2>
        <p className="mt-2 text-slate-600">
          Help us find the right opportunities for you.
        </p>
      </div>

      <form action={completeOnboarding} className="space-y-5">
        <Input
          label="Job Title"
          id="job_title"
          name="job_title"
          placeholder="e.g. Software Engineer"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Country"
            name="country"
            id="country"
            placeholder="Indonesia"
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

        <Button type="submit" className="w-full">
          Finish & Go to Dashboard
        </Button>
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
