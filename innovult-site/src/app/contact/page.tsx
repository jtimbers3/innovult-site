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
        <p className="mt-2 text-slate-700">Use the button below to contact Innovult directly.</p>

        <div className="mt-6 max-w-xs">
          <a
            href="mailto:jtimbers@innovult.com?subject=Innovult%20Inquiry"
            className="btn-primary block px-5 py-3 text-center text-sm"
          >
            Email Us
          </a>
        </div>

        <div className="mt-8 text-sm text-slate-600">
          <p>Innovult LLC</p>
          <p>Federal modernization services</p>
          <p className="mt-2">1607 11th St. S., Arlington, VA 22204</p>
        </div>
      </section>
    </div>
  );
}
