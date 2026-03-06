export default function ContactPage() {
  return (
    <div className="space-y-8 fade-up">
      <section>
        <h1 className="text-4xl font-bold tracking-tight text-[#0A3A66]">Contact</h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-700">
          Ready to discuss a program, teaming opportunity, or delivery challenge? Send us an email and we’ll follow up quickly.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold">Email us</h2>
        <p className="mt-2 text-slate-700">Use the button below to open your email client and contact innovult directly.</p>

        <div className="mt-6 max-w-xs">
          <a href="mailto:jtimbers@innovult.com?subject=innovult%20Inquiry" className="btn-primary block px-5 py-3 text-center text-sm">
            Email Us
          </a>
        </div>

        <div className="mt-8 grid gap-4 md:max-w-2xl md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Email</p>
            <a className="mt-1 block text-sm font-medium text-[#0A3A66] hover:underline" href="mailto:jtimbers@innovult.com">
              jtimbers@innovult.com
            </a>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Business Address</p>
            <p className="mt-1 text-sm font-medium text-slate-700">1607 11th St. S., Arlington, VA 22204</p>
          </div>
        </div>
      </section>
    </div>
  );
}
