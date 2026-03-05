export default function ContactPage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-4xl font-bold tracking-tight text-[#0A3A66]">Contact</h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-700">
          Ready to discuss a program, teaming opportunity, or delivery challenge? Book a call and we’ll follow up quickly.
        </p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-8">
        <h2 className="text-xl font-semibold">Book a call</h2>
        <p className="mt-2 text-slate-700">Use one of the options below. I can wire your preferred scheduling link next.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <a
            href="mailto:hello@innovult.com?subject=Book%20a%20call"
            className="rounded-md bg-[#0A3A66] px-5 py-3 text-center text-sm font-semibold text-white hover:bg-[#072A4A]"
          >
            Email us
          </a>
          <a
            href="#"
            className="rounded-md border border-[#0A3A66]/30 px-5 py-3 text-center text-sm font-semibold text-[#0A3A66] hover:bg-[#0A3A66]/5"
          >
            Book a call
          </a>
        </div>

        <div className="mt-8 text-sm text-slate-600">
          <p>innovult LLC</p>
          <p>Federal modernization services</p>
        </div>
      </section>
    </div>
  );
}
