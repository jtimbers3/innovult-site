"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { AlertTriangle, CheckCircle2, Circle, Plus, Rocket, Search, Wrench, X } from "lucide-react";

type Priority = "P1" | "P2" | "P3";
type Status = "todo" | "doing" | "blocked" | "done";

type Task = {
  id: string;
  title: string;
  owner: string;
  priority: Priority;
  status: Status;
};

type Opportunity = {
  id: string;
  title: string;
  source: string;
  office: string;
  postedDate: string | null;
  dueDate: string | null;
  solicitationNumber: string | null;
  type: string | null;
  description: string;
  url: string;
  matchType?: "strong" | "adjacent";
};

const seed: Task[] = [
  { id: "1", title: "Daily pipeline review", owner: "James", priority: "P1", status: "todo" },
  { id: "2", title: "SAM.gov target scan", owner: "Agent", priority: "P1", status: "doing" },
  { id: "3", title: "Prime outreach list refresh", owner: "Agent", priority: "P2", status: "todo" },
];

const statusOrder: Status[] = ["todo", "doing", "blocked", "done"];
const TASK_STORAGE_KEY = "mission-control.tasks.v1";
const OPP_STORAGE_KEY = "mission-control.opportunities.v1";
const OPP_LAST_REFRESH_KEY = "mission-control.opportunities.last-refresh";

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window === "undefined") return seed;
    try {
      const raw = window.localStorage.getItem(TASK_STORAGE_KEY);
      if (!raw) return seed;
      const parsed = JSON.parse(raw) as Task[];
      return Array.isArray(parsed) ? parsed : seed;
    } catch {
      return seed;
    }
  });
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(OPP_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as Opportunity[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState("James");
  const [priority, setPriority] = useState<Priority>("P2");
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [oppLoading, setOppLoading] = useState(false);
  const [oppError, setOppError] = useState<string | null>(null);
  const [oppMode, setOppMode] = useState<"strong" | "adjacent" | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  useEffect(() => {
    localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(OPP_STORAGE_KEY, JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const lastRefresh = localStorage.getItem(OPP_LAST_REFRESH_KEY);
    if (lastRefresh !== today) {
      void refreshOpportunities();
    }
  }, []);

  const grouped = useMemo(() => {
    return statusOrder.reduce<Record<Status, Task[]>>(
      (acc, s) => {
        acc[s] = tasks.filter((t) => t.status === s);
        return acc;
      },
      { todo: [], doing: [], blocked: [], done: [] }
    );
  }, [tasks]);

  const activeTask = activeTaskId ? tasks.find((t) => t.id === activeTaskId) ?? null : null;

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

  const refreshOpportunities = async () => {
    setOppLoading(true);
    setOppError(null);
    try {
      const res = await fetch("/api/opportunities", { cache: "no-store" });
      const data = await res.json();
      if (!data?.ok) {
        setOppError(data?.error ?? "Could not fetch opportunities");
        return;
      }
      setOpportunities(data.opportunities ?? []);
      setOppMode(data.mode ?? null);
      localStorage.setItem(OPP_LAST_REFRESH_KEY, new Date().toISOString().slice(0, 10));
    } catch {
      setOppError("Network error while fetching opportunities");
    } finally {
      setOppLoading(false);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTaskId(null);
    if (!over) return;

    const taskId = String(active.id);
    const overId = String(over.id);
    const nextStatus = statusOrder.includes(overId as Status)
      ? (overId as Status)
      : tasks.find((t) => t.id === overId)?.status;

    if (!nextStatus) return;

    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: nextStatus } : t)));
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6">
      <div className="max-w-[1400px] mx-auto space-y-6">
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

        <DndContext
          sensors={sensors}
          onDragStart={(event) => setActiveTaskId(String(event.active.id))}
          onDragEnd={onDragEnd}
          onDragCancel={() => setActiveTaskId(null)}
        >
          <section className="grid xl:grid-cols-5 md:grid-cols-2 gap-4">
            <Column id="todo" title="To Do" items={grouped.todo} onCycle={cycleStatus} />
            <Column id="doing" title="Doing" items={grouped.doing} onCycle={cycleStatus} />
            <Column
              id="blocked"
              title="Blocked"
              items={grouped.blocked}
              onCycle={cycleStatus}
              accent="border-amber-700/60"
              icon={<AlertTriangle className="w-4 h-4 text-amber-400" />}
            />
            <Column id="done" title="Done" items={grouped.done} onCycle={cycleStatus} />

            <OpportunityLane
              opportunities={opportunities}
              loading={oppLoading}
              error={oppError}
              mode={oppMode}
              onRefresh={refreshOpportunities}
              onOpen={setSelectedOpportunity}
            />
          </section>

          <DragOverlay>
            {activeTask ? (
              <div className="w-[280px]">
                <TaskCard task={activeTask} onCycle={() => {}} dragging />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {selectedOpportunity && (
        <OpportunityModal opportunity={selectedOpportunity} onClose={() => setSelectedOpportunity(null)} />
      )}
    </main>
  );
}

function OpportunityLane({
  opportunities,
  loading,
  error,
  mode,
  onRefresh,
  onOpen,
}: {
  opportunities: Opportunity[];
  loading: boolean;
  error: string | null;
  mode: "strong" | "adjacent" | null;
  onRefresh: () => void;
  onOpen: (opportunity: Opportunity) => void;
}) {
  return (
    <div className="bg-zinc-900 border border-indigo-700/60 rounded-2xl p-4 min-h-[300px]">
      <div className="flex items-center gap-2 mb-3">
        <Search className="w-4 h-4 text-indigo-300" />
        <h3 className="font-semibold">Opportunities</h3>
        <span className="ml-auto text-xs text-zinc-400">{opportunities.length}</span>
      </div>

      <button
        onClick={onRefresh}
        className="w-full mb-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3 py-2 text-sm font-medium"
      >
        {loading ? "Refreshing…" : "Refresh from SAM.gov"}
      </button>

      {error && <p className="text-xs text-amber-300 mb-2">{error}</p>}
      {mode === "adjacent" && (
        <p className="text-xs text-indigo-300 mb-2">
          No strong matches today — showing closest adjacent live DHS opportunities.
        </p>
      )}

      <div className="space-y-2">
        {opportunities.map((opp) => (
          <button
            key={opp.id}
            onClick={() => onOpen(opp)}
            className="w-full text-left bg-zinc-800 hover:bg-zinc-700/70 border border-zinc-700 rounded-xl p-3"
          >
            <p className="font-medium text-sm line-clamp-2">{opp.title}</p>
            <p className="text-xs text-zinc-400 mt-1 line-clamp-1">{opp.office}</p>
            <p className="text-xs text-zinc-400 mt-1">Due: {opp.dueDate ?? "TBD"}</p>
            {opp.matchType === "adjacent" && (
              <p className="text-[10px] uppercase tracking-wide text-indigo-300 mt-1">Adjacent</p>
            )}
          </button>
        ))}
        {opportunities.length === 0 && <p className="text-sm text-zinc-500">No opportunities yet</p>}
      </div>
    </div>
  );
}

function OpportunityModal({ opportunity, onClose }: { opportunity: Opportunity; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded-2xl p-5 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold">{opportunity.title}</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-zinc-800">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm text-zinc-300">
          <p><span className="text-zinc-500">Source:</span> {opportunity.source}</p>
          <p><span className="text-zinc-500">Office:</span> {opportunity.office}</p>
          <p><span className="text-zinc-500">Posted:</span> {opportunity.postedDate ?? "Unknown"}</p>
          <p><span className="text-zinc-500">Due:</span> {opportunity.dueDate ?? "TBD"}</p>
          <p><span className="text-zinc-500">Type:</span> {opportunity.type ?? "N/A"}</p>
          <p><span className="text-zinc-500">Solicitation:</span> {opportunity.solicitationNumber ?? "N/A"}</p>
        </div>
        <p className="text-sm text-zinc-300 whitespace-pre-wrap max-h-56 overflow-auto">{opportunity.description}</p>
        <a
          href={opportunity.url}
          target="_blank"
          rel="noreferrer"
          className="inline-block rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-2 text-sm font-medium"
        >
          Open on SAM.gov
        </a>
      </div>
    </div>
  );
}

function Column({
  id,
  title,
  items,
  onCycle,
  accent = "border-zinc-800",
  icon,
}: {
  id: Status;
  title: string;
  items: Task[];
  onCycle: (id: string) => void;
  accent?: string;
  icon?: ReactNode;
}) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`bg-zinc-900 border ${accent} rounded-2xl p-4 min-h-[300px] transition ${
        isOver ? "ring-2 ring-emerald-500/70" : ""
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="font-semibold">{title}</h3>
        <span className="ml-auto text-xs text-zinc-400">{items.length}</span>
      </div>
      <div className="space-y-2">
        {items.map((t) => (
          <DraggableTaskCard key={t.id} task={t} onCycle={onCycle} />
        ))}
        {items.length === 0 && <p className="text-sm text-zinc-500">Drop tasks here</p>}
      </div>
    </div>
  );
}

function DraggableTaskCard({ task, onCycle }: { task: Task; onCycle: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <TaskCard task={task} onCycle={onCycle} />
    </div>
  );
}

function TaskCard({
  task,
  onCycle,
  dragging = false,
}: {
  task: Task;
  onCycle: (id: string) => void;
  dragging?: boolean;
}) {
  return (
    <button
      onClick={() => !dragging && onCycle(task.id)}
      className="w-full text-left bg-zinc-800 hover:bg-zinc-700/70 border border-zinc-700 rounded-xl p-3 cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-start gap-2">
        {task.status === "done" ? (
          <CheckCircle2 className="w-4 h-4 mt-0.5 text-emerald-400" />
        ) : (
          <Circle className="w-4 h-4 mt-0.5 text-zinc-500" />
        )}
        <div>
          <p className="font-medium">{task.title}</p>
          <p className="text-xs text-zinc-400 mt-1">
            {task.owner} • {task.priority}
          </p>
        </div>
      </div>
    </button>
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
