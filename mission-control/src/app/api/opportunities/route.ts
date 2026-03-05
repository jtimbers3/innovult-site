import { NextResponse } from "next/server";

type SamOpportunity = {
  noticeId?: string;
  title?: string;
  fullParentPathName?: string;
  organizationType?: string;
  type?: string;
  postedDate?: string;
  responseDeadLine?: string;
  solicitationNumber?: string;
  uiLink?: string;
  description?: string;
};

const PRIMARY_KEYWORDS = [
  "erp",
  "business intelligence",
  "financial business process",
  "artificial intelligence",
  "machine learning",
  "ai/ml",
  "it pmo",
  "program management office",
  "enterprise resource planning",
];

const SECONDARY_KEYWORDS = [
  "data",
  "analytics",
  "financial",
  "modernization",
  "integration",
  "automation",
  "cloud",
  "system implementation",
  "digital transformation",
  "systems engineering",
  "application development",
  "software",
  "platform",
  "dashboard",
];

const EXCLUDE_KEYWORDS = [
  "roof",
  "roofing",
  "hvac",
  "air conditioning",
  "ac unit",
  "construction",
  "renovation",
  "facility",
  "facilities",
  "janitorial",
  "landscaping",
  "paving",
  "elevator",
  "painting",
  "plumbing",
  "fire alarm",
  "furniture",
  "generator",
  "asphalt",
  "concrete",
];

const inferScope = (text: string) => {
  const scopes: string[] = [];
  if (/\berp\b|enterprise resource planning/.test(text)) scopes.push("ERP implementation/modernization");
  if (/business intelligence|dashboard|analytics/.test(text)) scopes.push("Business intelligence & analytics");
  if (/financial|accounting|budget|ocfo/.test(text)) scopes.push("Financial management process improvement");
  if (/artificial intelligence|machine learning|ai\/ml/.test(text)) scopes.push("AI/ML use-case delivery");
  if (/program management office|\bit pmo\b|pmo/.test(text)) scopes.push("IT PMO / governance support");
  if (/integration|api|interface/.test(text)) scopes.push("Systems integration / interfaces");
  if (/cloud|aws|azure|google cloud/.test(text)) scopes.push("Cloud migration / cloud operations");
  if (/software|application development|platform/.test(text)) scopes.push("Application/platform development");

  if (scopes.length === 0) return "General IT modernization support";
  return scopes.slice(0, 3).join("; ");
};

const toCard = (o: SamOpportunity, matchType: "strong" | "adjacent") => {
  const text = `${o.title ?? ""} ${o.fullParentPathName ?? ""} ${o.description ?? ""}`.toLowerCase();
  return {
    id: o.noticeId ?? crypto.randomUUID(),
    title: o.title ?? "Untitled opportunity",
    source: "SAM.gov",
    office: o.fullParentPathName ?? o.organizationType ?? "Federal Agency",
    postedDate: o.postedDate ?? null,
    dueDate: o.responseDeadLine ?? null,
    solicitationNumber: o.solicitationNumber ?? null,
    type: o.type ?? null,
    description: o.description ?? "No description provided",
    scope: inferScope(text),
    url: o.uiLink ?? (o.noticeId ? `https://sam.gov/opp/${o.noticeId}/view` : "https://sam.gov/"),
    matchType,
  };
};

const toHaystack = (o: SamOpportunity) =>
  `${o.title ?? ""} ${o.fullParentPathName ?? ""} ${o.description ?? ""}`.toLowerCase();

const hasKeyword = (text: string, keyword: string) => {
  if (keyword.includes("/")) return text.includes(keyword);
  if (keyword.length <= 3) {
    const rx = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}\\b`, "i");
    return rx.test(text);
  }
  return text.includes(keyword);
};

const isExcluded = (text: string) => EXCLUDE_KEYWORDS.some((k) => text.includes(k));

export async function GET() {
  const apiKey = process.env.SAM_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        ok: false,
        error: "SAM_API_KEY is not set. Add it to mission-control/.env.local",
        opportunities: [],
      },
      { status: 200 }
    );
  }

  const formatSamDate = (d: Date) => {
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };

  const postedFrom = formatSamDate(new Date(Date.now() - 1000 * 60 * 60 * 24 * 7));
  const postedTo = formatSamDate(new Date());

  try {
    const url = new URL("https://api.sam.gov/prod/opportunities/v2/search");
    url.searchParams.set("api_key", apiKey);
    url.searchParams.set("postedFrom", postedFrom);
    url.searchParams.set("postedTo", postedTo);
    url.searchParams.set("limit", "150");
    url.searchParams.set("ptype", "o");
    url.searchParams.set(
      "q",
      "federal ERP business intelligence financial business process artificial intelligence IT PMO"
    );

    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: `SAM API error (${res.status})`, opportunities: [] },
        { status: 200 }
      );
    }

    const data = await res.json();
    const raw: SamOpportunity[] = Array.isArray(data?.opportunitiesData) ? data.opportunitiesData : [];

    const strong = raw
      .filter((o) => {
        const hay = toHaystack(o);
        if (isExcluded(hay)) return false;
        const primary = PRIMARY_KEYWORDS.some((k) => hasKeyword(hay, k));
        const secondary = SECONDARY_KEYWORDS.some((k) => hasKeyword(hay, k));
        return primary && secondary;
      })
      .slice(0, 25)
      .map((o) => toCard(o, "strong"));

    const opportunities =
      strong.length > 0
        ? strong
        : raw
            .filter((o) => {
              const hay = toHaystack(o);
              if (isExcluded(hay)) return false;
              return SECONDARY_KEYWORDS.some((k) => hasKeyword(hay, k));
            })
            .slice(0, 25)
            .map((o) => toCard(o, "adjacent"));

    return NextResponse.json({
      ok: true,
      opportunities,
      mode: strong.length > 0 ? "strong" : "adjacent",
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "Unknown error",
        opportunities: [],
      },
      { status: 200 }
    );
  }
}
