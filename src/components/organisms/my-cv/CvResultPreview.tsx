import { FileText, Briefcase, GraduationCap, Award, Mail } from "lucide-react";

export const CvResultPreview = ({ data }: { data: any }) => {
  const info = data.parsed_data || {};

  // Fungsi untuk grouping experience berdasarkan Perusahaan + Role
  const groupedExperience = info.experience?.reduce((acc: any[], curr: any) => {
    const existing = acc.find(
      (item) => item.company === curr.company && item.role === curr.role,
    );

    if (existing) {
      existing.descriptions.push(curr.description);
    } else {
      acc.push({
        ...curr,
        descriptions: [curr.description],
      });
    }
    return acc;
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* SIDEBAR: Profile & Skills */}
      <div className="lg:col-span-1 space-y-6">
        {/* Profile Card */}
        <div className="bg-white p-8 rounded-4xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <FileText size={80} />
          </div>

          <div className="h-16 w-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg shadow-indigo-200">
            {info.full_name?.[0]}
          </div>

          <h3 className="text-2xl font-black text-slate-900 leading-tight">
            {info.full_name}
          </h3>

          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2 text-slate-500 text-sm">
              <Mail size={14} />
              <span>{info.email}</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold">
              <Award size={14} />
              <span>Match Power: {info.match_power}%</span>
            </div>
          </div>
        </div>

        {/* Skills Card */}
        <div className="bg-white p-8 rounded-4xl border border-slate-200 shadow-sm">
          <h4 className="font-bold mb-5 text-sm uppercase tracking-[0.2em] text-slate-400">
            Expertise
          </h4>
          <div className="flex flex-wrap gap-2">
            {info.skills?.map((skill: string) => (
              <span
                key={skill}
                className="bg-slate-50 text-slate-700 border border-slate-100 px-3 py-1.5 rounded-xl text-xs font-medium hover:border-indigo-200 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT: Experience & Education */}
      <div className="lg:col-span-2 space-y-6">
        {/* Summary */}
        <div className="bg-white p-8 rounded-4xl border border-slate-200 shadow-sm">
          <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
            Summary
          </h4>
          <p className="text-slate-600 leading-relaxed text-sm italic">
            "{info.summary}"
          </p>
        </div>

        {/* Work Experience */}
        <div className="bg-white p-8 rounded-4xl border border-slate-200 shadow-sm">
          <h4 className="text-lg font-bold mb-8 flex items-center gap-2">
            <Briefcase className="text-indigo-600" size={20} />
            Professional Experience
          </h4>

          <div className="space-y-10">
            {groupedExperience?.map((exp: any, i: number) => (
              <div
                key={i}
                className="relative pl-8 border-l-2 border-slate-100"
              >
                <div className="absolute w-4 h-4 bg-white border-4 border-indigo-600 rounded-full -left-2.25 top-1" />

                <div className="mb-4">
                  <h5 className="font-black text-slate-900 text-base">
                    {exp.role}
                  </h5>
                  <p className="text-sm font-bold text-indigo-600">
                    {exp.company} <span className="text-slate-300 mx-2">•</span>{" "}
                    {exp.duration}
                  </p>
                </div>

                <ul className="list-disc list-outside ml-4 space-y-2">
                  {exp.descriptions.map((desc: string, idx: number) => (
                    <li
                      key={idx}
                      className="text-sm text-slate-600 leading-relaxed"
                    >
                      {desc}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="bg-white p-8 rounded-4xl border border-slate-200 shadow-sm">
          <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
            <GraduationCap className="text-indigo-600" size={20} />
            Education
          </h4>
          <div className="space-y-6">
            {info.education?.map((edu: any, i: number) => (
              <div key={i}>
                <h5 className="font-bold text-slate-800 text-sm">
                  {edu.degree}
                </h5>
                <p className="text-xs text-slate-500">
                  {edu.institution} • {edu.year}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
