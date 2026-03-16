"use client";
import { SiteNav } from "@/components/site-nav";
import { useState } from "react";

export default function AdminPage() {
  const [categoryId, setCategoryId] = useState("");
  const [nomineeId, setNomineeId] = useState("");

  return (
    <div className="space-y-4">
      <SiteNav />
      <h1 className="text-2xl font-semibold">Admin Results Entry</h1>
      <form className="card max-w-xl space-y-3" onSubmit={async (e) => {
        e.preventDefault();
        await fetch('/api/admin/result', { method: 'POST', body: JSON.stringify({ categoryId, nomineeId }) });
      }}>
        <input className="w-full rounded bg-slate-800 p-2" placeholder="Category ID" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} />
        <input className="w-full rounded bg-slate-800 p-2" placeholder="Winner Nominee ID" value={nomineeId} onChange={(e) => setNomineeId(e.target.value)} />
        <div className="flex gap-2">
          <button className="rounded bg-gold px-4 py-2 text-black">Save winner</button>
          <button type="button" className="rounded border px-4 py-2" onClick={async () => { await fetch('/api/admin/recalculate', { method: 'POST' }); }}>
            Recalculate Scores
          </button>
        </div>
      </form>
    </div>
  );
}
