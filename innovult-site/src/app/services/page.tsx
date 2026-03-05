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
    <div className="space-y-8">
      <section className="grid gap-6 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-[#0A3A66]">Services</h1>
          <p className="mt-3 max-w-3xl text-lg text-slate-700">
            We support agencies and prime contractors with delivery-focused services that improve execution and results.
          </p>
        </div>
        <div className="relative h-64 overflow-hidden rounded-xl border border-slate-200">
          <Image
            src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80"
            alt="Digital services dashboard"
            fill
            className="object-cover"
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {services.map((item) => (
          <article key={item.title} className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-slate-950">{item.title}</h2>
            <p className="mt-2 text-slate-700">{item.detail}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
