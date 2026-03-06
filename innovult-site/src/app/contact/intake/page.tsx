"use client";

import { FormEvent, ReactNode, useState } from "react";
import Link from "next/link";

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export default function IntakePage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setStatus("error");
      setError(data.error || "Something went wrong. Please try again.");
      return;
    }

    setStatus("success");
    setForm(initialState);
  }

  return (
    <div className="fade-up space-y-8">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#0A3A66]">Contact Intake</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-[#0A3A66]">Send us a message</h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-700">Complete the form and your message will be delivered to Innovult.</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <form onSubmit={onSubmit} className="grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Name" required>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-[#0A3A66]"
              />
            </Field>
            <Field label="Email" required>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-[#0A3A66]"
              />
            </Field>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Phone">
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-[#0A3A66]"
              />
            </Field>
            <Field label="Subject" required>
              <input
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-[#0A3A66]"
              />
            </Field>
          </div>

          <Field label="Message" required>
            <textarea
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={7}
              className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-[#0A3A66]"
            />
          </Field>

          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={status === "submitting"} className="btn-primary px-5 py-3 text-sm disabled:opacity-60">
              {status === "submitting" ? "Sending..." : "Send Message"}
            </button>
            <Link href="/contact" className="btn-outline px-5 py-3 text-sm">
              Back to Contact
            </Link>
          </div>

          {status === "success" && <p className="text-sm text-emerald-700">Message sent successfully.</p>}
          {status === "error" && <p className="text-sm text-red-700">{error}</p>}
        </form>
      </section>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-slate-700">
        {label} {required ? <span className="text-red-600">*</span> : null}
      </span>
      {children}
    </label>
  );
}
