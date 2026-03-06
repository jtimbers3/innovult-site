export default function ContactPage() {
  const reasons = [
    "ERP modernization program support",
    "Federal financial system transformation initiatives",
    "Prime contractor teaming opportunities",
    "Program and PMO delivery support",
    "Data and reporting modernization",
  ];

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold tracking-tight text-[#0A3A66] sm:text-4xl">Contact</h1>
        <p className="mt-3 max-w-4xl text-base leading-7 text-slate-700 sm:text-lg">
          Interested in partnering on a federal ERP or financial system modernization program? Reach out to discuss
          teaming opportunities or program support.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-8">
        <h2 className="text-xl font-semibold text-[#0A3A66]">Common reasons to contact innovult</h2>
        <ul className="mt-4 space-y-2 text-slate-700">
          {reasons.map((reason) => (
            <li key={reason} className="flex items-start gap-2">
              <span className="mt-1 h-2 w-2 rounded-full bg-[#0A3A66]" aria-hidden />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-8">
        <h2 className="text-xl font-semibold text-[#0A3A66]">Contact innovult</h2>
        <p className="mt-2 text-slate-700">
          innovult works with federal agencies and prime contractors supporting ERP, financial systems, and enterprise
          data modernization programs.
        </p>
        <p className="mt-3 text-slate-700">
          The best way to reach innovult is by email. We typically respond within one business day.
        </p>

        <div className="mt-6">
          <a
            href="mailto:jtimbers@innovult.com?subject=innovult%20Inquiry"
            className="inline-flex rounded-md bg-[#0A3A66] px-5 py-3 text-sm font-semibold text-white hover:bg-[#072A4A]"
          >
            Email jtimbers@innovult.com
          </a>
        </div>

        <div className="mt-8 space-y-3 text-sm text-slate-600">
          <p>
            <span className="font-semibold text-slate-700">Email</span>
            <br />
            jtimbers@innovult.com
          </p>
          <p>
            <span className="font-semibold text-slate-700">Business Address</span>
            <br />
            Arlington, VA
          </p>
        </div>
      </section>
    </div>
  );
}
