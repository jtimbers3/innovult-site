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
  "ai",
  "it pmo",
  "program management office",
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
];

const toCard = (o: SamOpportunity, matchType: "strong" | "adjacent") => ({
  id: o.noticeId ?? crypto.randomUUID(),
  title: o.title ?? "Untitled opportunity",
  source: "SAM.gov",
  office: o.fullParentPathName ?? o.organizationType ?? "Federal Agency",
  postedDate: o.postedDate ?? null,
  dueDate: o.responseDeadLine ?? null,
  solicitationNumber: o.solicitationNumber ?? null,
  type: o.type ?? null,
  description: o.description ?? "No description provided",
  url: o.uiLink ?? (o.noticeId ? `https://sam.gov/opp/${o.noticeId}/view` : "https://sam.gov/"),
  matchType,
});

const toHaystack = (o: SamOpportunity) =>
  `${o.title ?? ""} ${o.fullParentPathName ?? ""} ${o.description ?? ""}`.toLowerCase();

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
        return PRIMARY_KEYWORDS.some((k) => hay.includes(k));
      })
      .slice(0, 25)
      .map((o) => toCard(o, "strong"));

    const opportunities =
      strong.length > 0
        ? strong
        : raw
            .filter((o) => {
              const hay = toHaystack(o);
              return SECONDARY_KEYWORDS.some((k) => hay.includes(k));
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
