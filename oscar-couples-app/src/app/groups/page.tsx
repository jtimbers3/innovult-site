"use client";
import { useState } from "react";
import { SiteNav } from "@/components/site-nav";

export default function GroupsPage() {
  const [name, setName] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  return (
    <div className="space-y-4">
      <SiteNav />
      <div className="grid gap-4 md:grid-cols-2">
        <form className="card space-y-3" onSubmit={async (e) => { e.preventDefault(); await fetch('/api/groups', { method: 'POST', body: JSON.stringify({ name }) }); }}>
          <h2 className="font-semibold">Create group</h2>
          <input className="w-full rounded bg-slate-800 p-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Group name" />
          <button className="rounded bg-gold px-4 py-2 text-black">Create</button>
        </form>
        <form className="card space-y-3" onSubmit={async (e) => { e.preventDefault(); await fetch('/api/groups', { method: 'PATCH', body: JSON.stringify({ inviteCode }) }); }}>
          <h2 className="font-semibold">Join group</h2>
          <input className="w-full rounded bg-slate-800 p-2" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} placeholder="Invite code" />
          <button className="rounded border px-4 py-2">Join</button>
        </form>
      </div>
    </div>
  );
}
