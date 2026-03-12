# Innovult DHS Pursuit Tracker (Baseline)

_Last updated: 2026-03-10 (EDT)_

| Opportunity | Component | Source Link | Posted/Updated | Due Date | Fit Rationale | Prime Targets | Owner | Next Action | Status |
|---|---|---|---|---|---|---|---|---|---|
| CISA Industry Engagement Platform (Capability Meetings + Tech of Interest) | CISA | https://www.cisa.gov/doing-business-cisa ; https://myservices.cisa.gov/iep | Updated site (accessed 2026-03-10) | Rolling | Strong alignment with Innovult cyber/AI/data capabilities and mission-focused demos. Good near-term path to program-level introductions before formal RFPs. | Booz Allen, Nightwing, GDIT, Leidos | Innovult BD (TBD) | Submit IEP profile + request first capability meeting mapped to AI and IT Security Controls use cases. | Action Now |
| DHS S&T SBIR (Phases I/II) | DHS S&T | https://www.dhs.gov/science-and-technology/sbir | Active program page (accessed 2026-03-10) | Topic-specific; monitor release windows | Best fit for non-dilutive R&D funding and prototype maturation; supports transition to DHS components and Phase III pathways. | Amentum, Battelle, MITRE-engaged integrators | Innovult CTO + Capture (TBD) | Prepare reusable SBIR package (quad chart, commercialization plan, past performance) and set weekly topic watch. | Action Now |
| DHS Contract Opportunities (SAM.gov, Department/Agency = DHS) | DHS (department-wide) | https://sam.gov/opportunities | Continuously updated | Opportunity-specific | Direct pipeline for RFIs, Sources Sought, and RFPs; required channel for actionable federal pursuits. | Per opportunity (identify by NAICS/PSC) | Capture Lead (TBD) | Stand up saved searches for DHS + CISA + CBP + FEMA + ICE, NAICS aligned to Innovult; include business process improvement/documentation/re-engineering keywords for finance + procurement workflows; triage daily. | Action Now |
| CISA Future Forward / Industry Days / Panels (pre-solicitation shaping) | CISA | https://www.cisa.gov/doing-business-cisa | Updated site (accessed 2026-03-10) | Event-specific | Early influence and requirement shaping opportunity; useful for teaming and identifying incumbent gaps before procurement drops. | Deloitte, Accenture Federal, SAIC, ECS | Partnerships Lead (TBD) | Build 1-page capability statement tailored to CISA “Technologies of Interest”; request panel/industry-day participation. | Qualifying |
| DHS S&T mission transition opportunities (commercialization/Phase III adjacency) | DHS S&T / Components | https://www.dhs.gov/science-and-technology ; https://www.dhs.gov/science-and-technology/sbir | Program-level pages accessed 2026-03-10 | Rolling / component dependent | High fit for Innovult if positioning innovation to operational transition (USCG, border, critical infrastructure missions). | Leidos, Parsons, Peraton | Strategy + BD (TBD) | Identify 2 mission-aligned use cases and map to likely component sponsors; initiate teaming outreach. | Watchlist |

## Top Actionable Pursuits (Next 10 Business Days)

1. **CISA IEP submission + meeting request**
   - Fastest path to qualified dialogue.
   - Deliverable: completed profile, capability deck, 3 mission use-cases.

2. **SAM.gov DHS saved-search pipeline**
   - Build repeatable intake for RFIs/Sources Sought/RFPs.
   - Deliverable: search strings, owners, daily triage SLA, bid/no-bid checklist.

3. **DHS S&T SBIR readiness package**
   - Prepare before topic windows open so response time is short.
   - Deliverable: reusable technical narrative skeleton + commercialization artifacts.

## SAM.gov Expanded Search Focus (Added 2026-03-10)

Use these keyword clusters in DHS/component saved searches (Notice Type: Sources Sought, Presolicitation, Solicitation, Combined Synopsis):

- **Business Process Improvement:**
  - "business process improvement" OR BPI OR "process optimization" OR "process improvement"
- **Documentation / SOP / Policy Artifacts:**
  - documentation OR SOP OR "standard operating procedures" OR "as-is" OR "to-be" OR "CONOPS"
- **Re-engineering / Transformation:**
  - "business process re-engineering" OR BPR OR reengineering OR "operating model" OR "transformation"
- **Financial + Procurement Process Terms (pair with above):**
  - "financial management" OR "financial systems" OR ERP OR UFMS OR "Momentum" OR "core financial"
  - procurement OR acquisition OR "contract writing" OR PRISM OR purchase OR obligation OR invoicing

### Suggested query pattern

`(DHS OR CISA OR TSA OR FEMA OR CBP OR USCIS OR ICE OR USCG) AND ("business process improvement" OR "business process re-engineering" OR documentation OR SOP) AND ("financial management" OR procurement OR acquisition)`

### Triage rule

Prioritize notices that include at least **2 of 3 signals**:
1. Explicit component sponsor (TSA/FEMA/CBP/USCIS/ICE/USCG/CISA/DHS HQ)
2. Workflow modernization language (BPI/BPR/as-is/to-be)
3. Finance or procurement system/process scope

## Refresh Logic Patch (Applied 2026-03-10)

**Architecture update:** SAM.gov direct is now primary. Brave/web search is optional enrichment only.

Use this refresh order to avoid empty-result runs:

1. **Primary source (required):** SAM.gov opportunities search page + direct query URLs
   - https://sam.gov/opportunities
2. **Secondary source (optional enrichment):** web search (Brave) if key exists
3. **Tertiary source (adjacent context):** component procurement entry pages (only if HTTP 200)
   - CISA Doing Business: https://www.cisa.gov/doing-business-cisa
   - DHS S&T SBIR: https://www.dhs.gov/science-and-technology/sbir
4. **Skip on failure:** Any endpoint returning 404/503 is skipped for that run (do not fail entire refresh).

### Failure-handling rules
- If one source fails, continue with remaining sources.
- If all non-SAM sources fail, return **SAM-only** results and mark run as `Partial Success`.
- If Brave/web search is unavailable, continue with SAM direct (no hard fail).
- Never return zero solely due to optional enrichment failure.

### Fallback keyword bundles (broad → narrow)

**Bundle A (broad intake):**
- financial
- procurement
- acquisition
- business process

**Bundle B (process-focused):**
- "business process improvement"
- "business process re-engineering"
- documentation
- SOP
- "as-is" "to-be"

**Bundle C (financial/procurement modernization):**
- "financial management"
- ERP
- "contract writing"
- PRISM
- invoicing
- obligations

### Minimum-return safeguard
A refresh run should return the first available set meeting any of these:
- 5+ items from Bundle A in last 90 days, or
- 3+ items from Bundle B in last 180 days, or
- 3+ items from Bundle C in last 180 days.

If below threshold, output: **"Low-confidence run: broadened filters applied"** and include nearest adjacent live items.

## Notes

- Several legacy DHS URLs returned intermittent 404/503 during baseline pull; links above are validated, currently reachable entry points.
- For precise due dates and solicitation numbers, treat this baseline as **intake** and populate from specific SAM notices once identified.

Last refresh run: 2026-03-12 12:58:43 -04:00 (resilient mode)







