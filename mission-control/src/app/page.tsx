"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AlertTriangle, CheckCircle2, Circle, Plus, Rocket, Wrench } from "lucide-react";

type Priority = "P1" | "P2" | "P3";
type Status = "todo" | "doing" | "blocked" | "done";

type Task = {
  id: string;
  title: string;
  owner: string;
  priority: Priority;
  status: Status;
};

const seed: Task[] = [
  { id: "1", title: "Daily pipeline review", owner: "James", priority: "P1", status: "todo" },
  { id: "2", title: "SAM.gov target scan", owner: "Agent", priority: "P1", status: "doing" },
  { id: "3", title: "Prime outreach list refresh", owner: "Agent", priority: "P2", status: "todo" },
];

const statusOrder: Status[] = ["todo", "doing", "blocked", "done"];
const STORAGE_KEY = "mission-control.tasks.v1";

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window === "undefined") return seed;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return seed;
      const parsed = JSON.parse(raw) as Task[];
      return Array.isArray(parsed) ? parsed : seed;
    } catch {
      return seed;
    }
  });
  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState("James");
  const [priority, setPriority] = useState<Priority>("P2");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const grouped = useMemo(() => {
    return statusOrder.reduce<Record<Status, Task[]>>(
      (acc, s) => {
        acc[s] = tasks.filter((t) => t.status === s);
        return acc;
      },
      { todo: [], doing: [], blocked: [], done: [] }
    );
  }, [tasks]);

  const addTask = () => {
    const t = title.trim();
    if (!t) return;
    setTasks((prev) => [{ id: crypto.randomUUID(), title: t, owner, priority, status: "todo" }, ...prev]);
    setTitle("");
  };

  const cycleStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const i = statusOrder.indexOf(t.status);
        return { ...t, status: statusOrder[(i + 1) % statusOrder.length] };
      })
    );
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold">Mission Control</h1>
            <p className="text-zinc-400">Innovult local operating dashboard</p>
          </div>
          <div className="flex gap-3 text-sm">
            <Badge icon={<Rocket className="w-4 h-4" />} label="Revenue Ops" />
            <Badge icon={<Wrench className="w-4 h-4" />} label="Tooling Lab" />
          </div>
        </header>

        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <h2 className="font-semibold mb-3">Quick Add Task</h2>
          <div className="grid md:grid-cols-12 gap-3">
            <input
              className="md:col-span-6 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2"
              placeholder="What needs to get done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addTask();
              }}
            />
            <input
              className="md:col-span-2 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="Owner"
            />
            <select
              className="md:col-span-2 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
            >
              <option>P1</option>
              <option>P2</option>
              <option>P3</option>
            </select>
            <button
              onClick={addTask}
              className="md:col-span-2 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-2 font-medium"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </section>

        <section className="grid md:grid-cols-4 gap-4">
          <Column title="To Do" items={grouped.todo} onCycle={cycleStatus} />
          <Column title="Doing" items={grouped.doing} onCycle={cycleStatus} />
          <Column
            title="Blocked"
            items={grouped.blocked}
            onCycle={cycleStatus}
            accent="border-amber-700/60"
            icon={<AlertTriangle className="w-4 h-4 text-amber-400" />}
          />
          <Column title="Done" items={grouped.done} onCycle={cycleStatus} />
        </section>
      </div>
    </main>
  );
}

function Column({
  title,
  items,
  onCycle,
  accent = "border-zinc-800",
  icon,
}: {
  title: string;
  items: Task[];
  onCycle: (id: string) => void;
  accent?: string;
  icon?: ReactNode;
}) {
  return (
    <div className={`bg-zinc-900 border ${accent} rounded-2xl p-4`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="font-semibold">{title}</h3>
        <span className="ml-auto text-xs text-zinc-400">{items.length}</span>
      </div>
      <div className="space-y-2">
        {items.map((t) => (
          <button
            key={t.id}
            onClick={() => onCycle(t.id)}
            className="w-full text-left bg-zinc-800 hover:bg-zinc-700/70 border border-zinc-700 rounded-xl p-3"
          >
            <div className="flex items-start gap-2">
              {t.status === "done" ? (
                <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-400" />
              ) : (
                <Circle className="w-4 h-4 mt-0.5 text-zinc-500" />
              )}
              <div>
                <p className="font-medium">{t.title}</p>
                <p className="text-xs text-zinc-400 mt-1">
                  {t.owner} • {t.priority}
                </p>
              </div>
            </div>
          </button>
        ))}
        {items.length === 0 && <p className="text-sm text-zinc-500">No items</p>}
      </div>
    </div>
  );
}

function Badge({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1">
      {icon}
      {label}
    </span>
  );
}
