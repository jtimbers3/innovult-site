"use client";
import { useState } from "react";
import { SiteNav } from "@/components/site-nav";

export default function TeamsPage() {
  const [name, setName] = useState("");
  return (
    <div className="space-y-4">
      <SiteNav />
      <form
        className="card max-w-xl space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          await fetch("/api/teams", { method: "POST", body: JSON.stringify({ name }) });
          setName("");
        }}
      >
        <h1 className="text-xl font-semibold">Create Couple Team</h1>
        <input className="w-full rounded bg-slate-800 p-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Team name" />
        <button className="rounded bg-gold px-4 py-2 text-black">Save team</button>
      </form>
    </div>
  );
}
