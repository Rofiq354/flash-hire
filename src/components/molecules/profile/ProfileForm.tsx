// src/components/molecules/ProfileForm.tsx
import { Button } from "@/components/atoms/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProfileFormProps {
  profile: any;
  onCancel: () => void;
}

export const ProfileForm = ({ profile, onCancel }: ProfileFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      full_name: formData.get("full_name"),
      job_title: formData.get("job_title"),
      phone_number: formData.get("phone_number"),
      location: formData.get("location"),
    };

    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.refresh();
        onCancel();
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="rounded-3xl border border-border-custom bg-card p-8 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">Edit Profile Details</h2>
        <Button variant="outline" size="sm" onClick={onCancel} type="button">
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted ml-1">
            Email Address (Linked)
          </label>
          <input
            type="email"
            value={profile?.email}
            disabled
            className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border-custom bg-slate-50 text-slate-400 cursor-not-allowed text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Full Name"
            id="full_name"
            defaultValue={profile?.full_name}
          />
          <FormInput
            label="Job Title"
            id="job_title"
            defaultValue={profile?.job_title}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Phone"
            name="phone_number"
            id="phone_number"
            defaultValue={profile?.phone_number}
          />
          <FormInput
            label="Location"
            name="location"
            id="location"
            defaultValue={profile?.location}
          />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted ml-1">
            Job Search Country
          </label>
          <select
            name="country"
            defaultValue={profile?.country || "id"}
            className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border-custom bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm appearance-none"
          >
            <option value="id">Indonesia (ID)</option>
            <option value="sg">Singapore (SG)</option>
            <option value="gb">United Kingdom (GB)</option>
            <option value="us">United States (US)</option>
          </select>
          <p className="text-[10px] text-slate-400 mt-1 ml-1 italic">
            *This affects your job recommendations.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          className="w-full mt-4 cursor-pointer"
          isLoading={loading}
          type="submit"
        >
          Save Changes
        </Button>
      </form>
    </div>
  );
};

function FormInput({ label, defaultValue, type = "text", id }: any) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-[10px] font-bold uppercase tracking-wider text-muted ml-1"
      >
        {label}
      </label>
      <input
        type={type}
        name={id}
        defaultValue={defaultValue}
        id={id}
        className="w-full mt-1.5 px-4 py-3 rounded-xl border border-border-custom bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
        placeholder={`Enter your ${label.toLowerCase()}`}
      />
    </div>
  );
}
