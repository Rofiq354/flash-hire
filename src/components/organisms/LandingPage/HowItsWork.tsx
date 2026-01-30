// src/components/organisms/HowItWorks.tsx

const steps = [
  {
    id: "1",
    title: "1. Upload",
    desc: "Simply upload your PDF. We handle the heavy lifting of reading your entire career history.",
    icon: "📄",
    color: "bg-blue-50 text-blue-600",
  },
  {
    id: "2",
    title: "2. AI Extraction",
    desc: "Our neural networks map your hard and soft skills, past experiences, and potential trajectories.",
    icon: "⚙️",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    id: "3",
    title: "3. Get Matched",
    desc: "Instantly view thousands of curated openings that match your unique profile perfectly.",
    icon: "🎯",
    color: "bg-violet-50 text-violet-600",
  },
  {
    id: "4",
    title: "4. Setup Alerts",
    desc: "Set your preferences once and receive real-time notifications for every new high-match opportunity.",
    icon: "🔔",
    color: "bg-purple-50 text-purple-600",
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="px-6 py-24 bg-background">
      <div className="max-w-7xl mx-auto text-center space-y-16">
        <div className="space-y-4">
          <span className="text-xs font-black text-primary uppercase tracking-[0.2em]">
            Our Process
          </span>
          <h2 className="text-5xl font-black text-foreground">How it works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.id}
              className="p-8 bg-card border border-border-custom rounded-4xl text-left space-y-6 hover:shadow-xl transition-all group"
            >
              <div
                className={`w-12 h-12 rounded-2xl ${step.color} flex items-center justify-center text-xl shadow-sm`}
              >
                {step.icon}
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
