import Image from "next/image";

const expertise = [
  "ERP modernization programs (SAP, Oracle, and related enterprise systems)",
  "Federal financial management transformation",
  "IT program and project management",
  "Business process and operational design",
  "System implementation oversight and vendor coordination",
  "Change management and user adoption",
  "Data integration and reporting strategy",
];

export default function AboutPage() {
  return (
    <div className="space-y-10">
      <section className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2 md:items-center md:p-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0A3A66]">About Innovult</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">Built for federal modernization outcomes</h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-700">
            Innovult is a specialized consulting firm focused on helping federal agencies modernize financial and
            operational systems. We support complex transformation initiatives involving enterprise resource planning
            (ERP), financial management, and data-driven decision making.
          </p>
        </div>

        <div className="relative h-72 overflow-hidden rounded-xl border border-slate-200">
          <Image
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1400&q=80"
            alt="Team reviewing modernization strategy"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
        <div className="space-y-5 text-slate-700">
          <p className="leading-relaxed">
            Founded in 2025, Innovult brings senior-level expertise to government organizations implementing and
            operating modern platforms such as SAP, Oracle, and other enterprise technologies. Our work spans the full
            lifecycle of modernization efforts—from strategy and planning to implementation, change management, and
            operational support.
          </p>

          <p className="leading-relaxed">
            We focus on programs where financial management, technology, and operations intersect. These initiatives
            often involve large-scale system implementations, process redesign, and the integration of multiple legacy
            systems into modern enterprise platforms.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm md:p-10">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950">Innovult provides expertise in</h2>
        <ul className="mt-5 grid gap-3 md:grid-cols-2">
          {expertise.map((item) => (
            <li key={item} className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-700">
              <span className="mt-1 h-2 w-2 rounded-full bg-[#0A3A66]" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
        <p className="text-lg leading-relaxed text-slate-700">
          Our approach is simple: bring experienced leadership, focus on practical execution, and help agencies deliver
          results on complex programs.
        </p>
        <p className="mt-4 leading-relaxed text-slate-700">
          Innovult works primarily as a trusted partner to government organizations and large system integrators,
          providing targeted expertise where it matters most.
        </p>
      </section>
    </div>
  );
}
