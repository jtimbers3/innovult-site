"use client";

import { useEffect, useMemo, useState } from "react";
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
import { CheckCircle2, FileText, RefreshCcw, Search, Sparkles, X } from "lucide-react";

type Stage =
  | "sam_gov"
  | "potential"
  | "qualified"
  | "proposal_generation"
  | "review"
  | "submitted";

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
  scope?: string;
  url: string;
  matchType?: "strong" | "adjacent";
  stage: Stage;
  proposalDraft?: string;
  proposalGeneratedAt?: string;
  actionNotes?: string[];
};

type ApiOpportunity = Omit<Opportunity, "stage" | "proposalDraft" | "proposalGeneratedAt" | "actionNotes">;

const STAGES: { id: Stage; title: string; help: string; accent?: string }[] = [
  { id: "sam_gov", title: "SAM.gov", help: "Fresh opportunities" },
  { id: "potential", title: "Potential Opportunities", help: "Worth tracking", accent: "border-[#0A3A66]/35" },
  { id: "qualified", title: "Qualified", help: "Good fit / pursue" },
  {
    id: "proposal_generation",
    title: "Proposal Generation",
    help: "Auto-generates draft on drop",
    accent: "border-[#65DCDF]/45",
  },
  { id: "review", title: "Review", help: "Polish + red-team" },
  { id: "submitted", title: "Submitted", help: "Delivered", accent: "border-[#65DCDF]/45" },
];

const OPP_STORAGE_KEY = "mission-control.pipeline-opportunities.v2";
const OPP_LAST_REFRESH_KEY = "mission-control.pipeline-opportunities.last-refresh";

export default function Page() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(OPP_STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as Opportunity[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [oppLoading, setOppLoading] = useState(false);
  const [oppError, setOppError] = useState<string | null>(null);
  const [oppMode, setOppMode] = useState<"strong" | "adjacent" | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  useEffect(() => {
    localStorage.setItem(OPP_STORAGE_KEY, JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const lastRefresh = localStorage.getItem(OPP_LAST_REFRESH_KEY);
    if (lastRefresh !== today) void refreshOpportunities();
  }, []);

  const byStage = useMemo(() => {
    return STAGES.reduce<Record<Stage, Opportunity[]>>(
      (acc, stage) => {
        acc[stage.id] = opportunities.filter((o) => o.stage === stage.id);
        return acc;
      },
      {
        sam_gov: [],
        potential: [],
        qualified: [],
        proposal_generation: [],
        review: [],
        submitted: [],
      }
    );
  }, [opportunities]);

  const activeCard = activeId ? opportunities.find((o) => o.id === activeId) ?? null : null;

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

      const incoming: Opportunity[] = ((data.opportunities ?? []) as ApiOpportunity[]).map((o) => ({
        ...o,
        stage: "sam_gov",
      }));

      setOpportunities((prev) => {
        const map = new Map(prev.map((o) => [o.id, o]));
        for (const next of incoming) {
          const existing = map.get(next.id);
          if (existing) {
            map.set(next.id, {
              ...existing,
              ...next,
              stage: existing.stage,
              proposalDraft: existing.proposalDraft,
              proposalGeneratedAt: existing.proposalGeneratedAt,
              actionNotes: existing.actionNotes,
            });
          } else {
            map.set(next.id, next);
          }
        }
        return Array.from(map.values());
      });

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
    setActiveId(null);
    if (!over) return;

    const oppId = String(active.id);
    const nextStage = String(over.id) as Stage;
    if (!STAGES.some((s) => s.id === nextStage)) return;

    setOpportunities((prev) =>
      prev.map((o) => {
        if (o.id !== oppId) return o;
        const moved = { ...o, stage: nextStage };
        return runStageActions(moved, nextStage);
      })
    );
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 p-6">
      <div className="max-w-[1700px] mx-auto space-y-6">
        <header className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold">Pursuit Tracker</h1>
            <p className="text-slate-600">SAM.gov opportunity pipeline + proposal actions</p>
          </div>
          <button
            onClick={refreshOpportunities}
            className="inline-flex items-center gap-2 rounded-lg bg-[#65DCDF] hover:bg-[#4ecfd2] text-[#0A3A66] px-4 py-2 text-sm font-semibold"
          >
            <RefreshCcw className={`w-4 h-4 ${oppLoading ? "animate-spin" : ""}`} />
            {oppLoading ? "Refreshing..." : "Refresh from SAM.gov"}
          </button>
        </header>

        {oppError && <p className="text-sm text-amber-300">{oppError}</p>}
        {oppMode === "adjacent" && (
          <p className="text-xs text-[#0A3A66]">
            No strong matches today — showing closest adjacent live federal opportunities.
          </p>
        )}

        <DndContext
          sensors={sensors}
          onDragStart={(event) => setActiveId(String(event.active.id))}
          onDragEnd={onDragEnd}
          onDragCancel={() => setActiveId(null)}
        >
          <section className="grid xl:grid-cols-6 md:grid-cols-2 gap-4">
            {STAGES.map((stage) => (
              <StageColumn
                key={stage.id}
                id={stage.id}
                title={stage.title}
                help={stage.help}
                items={byStage[stage.id]}
                accent={stage.accent}
                onOpen={setSelectedOpportunity}
              />
            ))}
          </section>

          <DragOverlay>
            {activeCard ? (
              <div className="w-[280px]">
                <OpportunityCard opportunity={activeCard} onOpen={() => {}} dragging />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {selectedOpportunity && (
        <OpportunityModal
          opportunity={selectedOpportunity}
          onClose={() => setSelectedOpportunity(null)}
          onRegenerate={() => {
            setOpportunities((prev) =>
              prev.map((o) =>
                o.id === selectedOpportunity.id ? runStageActions({ ...o }, "proposal_generation", true) : o
              )
            );
          }}
        />
      )}
    </main>
  );
}

function runStageActions(opportunity: Opportunity, stage: Stage, forceProposal = false): Opportunity {
  const notes = [...(opportunity.actionNotes ?? [])];

  if (stage === "proposal_generation" && (forceProposal || !opportunity.proposalDraft)) {
    const generatedAt = new Date().toISOString();
    notes.unshift(`Proposal draft generated ${new Date(generatedAt).toLocaleString()}`);
    return {
      ...opportunity,
      stage,
      proposalDraft: buildProposalDraft(opportunity),
      proposalGeneratedAt: generatedAt,
      actionNotes: notes.slice(0, 6),
    };
  }

  if (stage === "review") {
    notes.unshift(`Moved to review ${new Date().toLocaleString()}`);
    return { ...opportunity, stage, actionNotes: notes.slice(0, 6) };
  }

  if (stage === "submitted") {
    notes.unshift(`Marked submitted ${new Date().toLocaleString()}`);
    return { ...opportunity, stage, actionNotes: notes.slice(0, 6) };
  }

  return { ...opportunity, stage, actionNotes: notes.slice(0, 6) };
}

function buildProposalDraft(opp: Opportunity): string {
  return [
    `# Proposal Draft - ${opp.title}`,
    "",
    `Solicitation: ${opp.solicitationNumber ?? "N/A"}`,
    `Agency/Office: ${opp.office}`,
    `Due Date: ${opp.dueDate ?? "TBD"}`,
    "",
    "## 1) Executive Summary",
    `Innovult proposes a delivery approach aligned to ${opp.scope ?? "IT modernization support"}. We will deliver measurable mission outcomes, rapid onboarding, and low-risk implementation in line with the solicitation objectives.`,
    "",
    "## 2) Technical Approach",
    "- Discovery and mobilization in the first 2 weeks",
    "- Architecture and implementation plan tied to agency constraints",
    "- Iterative delivery with demos and acceptance criteria",
    "- Integration, reporting, and knowledge transfer",
    "",
    "## 3) Management Plan",
    "- Program lead, solution architect, and functional SMEs",
    "- Weekly governance cadence with risk/issue tracking",
    "- Quality management and schedule controls",
    "",
    "## 4) Past Performance Themes",
    "- Federal ERP and financial modernization",
    "- BI/analytics delivery for executive reporting",
    "- Cross-system integration and PMO support",
    "",
    "## 5) Compliance Checklist (Initial)",
    "- [ ] Confirm submission instructions and format",
    "- [ ] Validate page limits and attachment requirements",
    "- [ ] Validate reps/certs and SAM registration status",
    "- [ ] Build price narrative and assumptions",
    "",
    `Source URL: ${opp.url}`,
  ].join("\n");
}

function StageColumn({
  id,
  title,
  help,
  items,
  accent = "border-slate-200",
  onOpen,
}: {
  id: Stage;
  title: string;
  help: string;
  items: Opportunity[];
  accent?: string;
  onOpen: (opportunity: Opportunity) => void;
}) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`bg-white border ${accent} rounded-2xl p-4 min-h-[420px] transition ${
        isOver ? "ring-2 ring-[#65DCDF]/70" : ""
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        {id === "sam_gov" ? <Search className="w-4 h-4 text-[#0A3A66]" /> : null}
        {id === "proposal_generation" ? <Sparkles className="w-4 h-4 text-[#0A3A66]" /> : null}
        {id === "submitted" ? <CheckCircle2 className="w-4 h-4 text-[#0A3A66]" /> : null}
        <h3 className="font-semibold text-sm">{title}</h3>
        <span className="ml-auto text-xs text-slate-600">{items.length}</span>
      </div>
      <p className="text-[11px] text-slate-500 mb-3">{help}</p>

      <div className="space-y-2">
        {items.map((o) => (
          <DraggableOpportunityCard key={o.id} opportunity={o} onOpen={onOpen} />
        ))}
        {items.length === 0 && <p className="text-sm text-slate-500">Drop opportunities here</p>}
      </div>
    </div>
  );
}

function DraggableOpportunityCard({
  opportunity,
  onOpen,
}: {
  opportunity: Opportunity;
  onOpen: (opportunity: Opportunity) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: opportunity.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <OpportunityCard opportunity={opportunity} onOpen={() => onOpen(opportunity)} />
    </div>
  );
}

function OpportunityCard({
  opportunity,
  onOpen,
  dragging = false,
}: {
  opportunity: Opportunity;
  onOpen: () => void;
  dragging?: boolean;
}) {
  return (
    <button
      onClick={() => !dragging && onOpen()}
      className="w-full text-left bg-white hover:bg-slate-50 border border-slate-300 rounded-xl p-3 cursor-grab active:cursor-grabbing shadow-sm"
    >
      <p className="font-medium text-sm line-clamp-2">{opportunity.title}</p>
      <p className="text-xs text-slate-600 mt-1 line-clamp-1">{opportunity.office}</p>
      <p className="text-xs text-slate-600 mt-1">Due: {opportunity.dueDate ?? "TBD"}</p>
      {opportunity.proposalDraft ? (
        <p className="text-[10px] uppercase tracking-wide text-[#0A3A66] mt-2 inline-flex items-center gap-1">
          <FileText className="w-3 h-3" /> Draft Ready
        </p>
      ) : null}
    </button>
  );
}

function OpportunityModal({
  opportunity,
  onClose,
  onRegenerate,
}: {
  opportunity: Opportunity;
  onClose: () => void;
  onRegenerate: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white border border-slate-300 rounded-2xl p-5 space-y-4 max-h-[90vh] overflow-auto">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold">{opportunity.title}</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm text-slate-700">
          <p>
            <span className="text-slate-500">Office:</span> {opportunity.office}
          </p>
          <p>
            <span className="text-slate-500">Due:</span> {opportunity.dueDate ?? "TBD"}
          </p>
          <p>
            <span className="text-slate-500">Type:</span> {opportunity.type ?? "N/A"}
          </p>
          <p>
            <span className="text-slate-500">Solicitation:</span> {opportunity.solicitationNumber ?? "N/A"}
          </p>
        </div>

        <p className="text-sm text-slate-700 whitespace-pre-wrap">{opportunity.description}</p>

        <div className="rounded-lg border border-[#0A3A66]/25 bg-[#0A3A66]/5 p-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs uppercase tracking-wide text-[#0A3A66]">Proposal Draft</p>
            <button
              onClick={onRegenerate}
              className="rounded-md bg-[#0A3A66] hover:bg-[#072a4a] px-2 py-1 text-xs font-medium"
            >
              Regenerate Draft
            </button>
          </div>
          {opportunity.proposalDraft ? (
            <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono leading-relaxed">
              {opportunity.proposalDraft}
            </pre>
          ) : (
            <p className="text-sm text-slate-600">Move this card to “Proposal Generation” to auto-create a draft.</p>
          )}
        </div>

        {!!opportunity.actionNotes?.length && (
          <div className="rounded-lg border border-slate-300 bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-600 mb-2">Action Log</p>
            <ul className="text-xs text-slate-700 space-y-1 list-disc pl-4">
              {opportunity.actionNotes.map((note, i) => (
                <li key={`${note}-${i}`}>{note}</li>
              ))}
            </ul>
          </div>
        )}

        <a
          href={opportunity.url}
          target="_blank"
          rel="noreferrer"
          className="inline-block rounded-lg bg-[#0A3A66] hover:bg-[#072a4a] px-3 py-2 text-sm font-medium"
        >
          Open on SAM.gov
        </a>
      </div>
    </div>
  );
}

