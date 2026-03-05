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

const DHS_TARGETS = ["TSA", "FEMA", "CBP", "USCIS", "ICE", "USCG", "CISA", "DHS"];
const KEYWORDS = ["financial systems", "financial modernization", "ERP", "finance", "OCFO"];

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

  const postedFrom = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString().slice(0, 10);

  try {
    const url = new URL("https://api.sam.gov/prod/opportunities/v2/search");
    url.searchParams.set("api_key", apiKey);
    url.searchParams.set("postedFrom", postedFrom);
    url.searchParams.set("limit", "50");
    url.searchParams.set("ptype", "o");
    url.searchParams.set("q", "DHS financial systems modernization ERP");

    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: `SAM API error (${res.status})`, opportunities: [] },
        { status: 200 }
      );
    }

    const data = await res.json();
    const raw: SamOpportunity[] = Array.isArray(data?.opportunitiesData) ? data.opportunitiesData : [];

    const opportunities = raw
      .filter((o) => {
        const hay = `${o.title ?? ""} ${o.fullParentPathName ?? ""} ${o.description ?? ""}`.toLowerCase();
        const targetMatch = DHS_TARGETS.some((t) => hay.includes(t.toLowerCase()));
        const keywordMatch = KEYWORDS.some((k) => hay.includes(k.toLowerCase()));
        return targetMatch && keywordMatch;
      })
      .slice(0, 20)
      .map((o) => ({
        id: o.noticeId ?? crypto.randomUUID(),
        title: o.title ?? "Untitled opportunity",
        source: "SAM.gov",
        office: o.fullParentPathName ?? o.organizationType ?? "DHS Component",
        postedDate: o.postedDate ?? null,
        dueDate: o.responseDeadLine ?? null,
        solicitationNumber: o.solicitationNumber ?? null,
        type: o.type ?? null,
        description: o.description ?? "No description provided",
        url: o.uiLink ?? (o.noticeId ? `https://sam.gov/opp/${o.noticeId}/view` : "https://sam.gov/")
      }));

    return NextResponse.json({ ok: true, opportunities, fetchedAt: new Date().toISOString() });
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
