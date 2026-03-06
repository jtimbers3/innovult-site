import Image from "next/image";

export default function ServicesPage() {
  const services = [
    {
      title: "ERP Implementation & Optimization",
      detail:
        "Support planning, deployment, stabilization, and adoption of enterprise platforms in federal environments.",
    },
    {
      title: "Business Intelligence",
      detail:
        "Design executive and operational dashboards, reporting pipelines, and performance metrics that drive action.",
    },
    {
      title: "Financial Business Process Improvement",
      detail:
        "Improve close, reconciliation, controls, and audit readiness through process redesign and automation.",
    },
    {
      title: "AI & Automation Use Cases",
      detail:
        "Identify and operationalize low-risk, high-value AI workflows for federal mission and back-office needs.",
    },
    {
      title: "IT PMO Support",
      detail:
        "Provide governance, schedule management, risk tracking, and stakeholder reporting for complex programs.",
    },
  ];

  return (
    <div className="space-y-10">
      <section className="fade-up grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2 md:items-center md:p-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0A3A66]">Core offerings</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-[#0A3A66] sm:text-5xl">Services</h1>
          <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-700">
            We support agencies and prime contractors with delivery-focused services that improve execution and results.
          </p>
        </div>
        <div className="group relative h-64 overflow-hidden rounded-xl border border-slate-200">
          <Image
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80"
            alt="Digital services dashboard"
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A3A66]/15 via-transparent to-transparent" />
        </div>
      </section>

      <div className="section-divider" />

      <section className="fade-up fade-up-delay-1 grid gap-4 md:grid-cols-2">
        {services.map((item) => (
          <article
            key={item.title}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <h2 className="text-xl font-semibold text-slate-950">{item.title}</h2>
            <p className="mt-2 leading-7 text-slate-700">{item.detail}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
