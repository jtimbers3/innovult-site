"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  return (
    <form
      className="card max-w-md space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();
        await fetch("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({ name, email, password })
        });
        router.push("/login");
      }}
    >
      <h1 className="text-xl font-semibold">Create account</h1>
      <input className="w-full rounded bg-slate-800 p-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input className="w-full rounded bg-slate-800 p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="w-full rounded bg-slate-800 p-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="rounded bg-gold px-4 py-2 text-black">Create account</button>
    </form>
  );
}
