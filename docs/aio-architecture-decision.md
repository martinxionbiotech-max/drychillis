# AIO Architecture Decision — drychillis.com

## Audit Summary

- URL: https://drychillis.com
- Project: Tenda Peppers / Leling Tenda Chili Products Co., Ltd.
- Framework: Astro 5, static output (`output: 'static'`)
- Build: `npm run build` to `dist/`
- Deployment: Cloudflare-served static site (`server: cloudflare`)
- Canonical domain: `https://drychillis.com/` (non-www)
- WWW behavior: serves the same canonical content rather than redirecting to apex
- Languages: English (`/`), Spanish (`/es/`), Arabic (`/ar/`)
- Related domain: https://docs.drychillis.com (MkDocs-style Knowledge Hub)
- Existing agent surface: `robots.txt`, sitemap, `llms.txt`, Schema.org JSON-LD
- Backend/API/database: none
- Authentication/protected resources: none

## Site Classification

Primary: Content website + Knowledge Hub + structured dataset/database website + lead-generation website.

The site publishes structured editorial/technical content, product specifications,
variety reference pages, and contact/quote calls to action. It is not an API, SaaS,
authenticated app, or agent application.

## Detected Capabilities

Content:
- Homepage and product family pages
- 8 core product pages and 5 variety reference pages (English, plus mirrored ES/AR pages)
- Heat-level reference pages
- Specification and packaging pages
- Technical guides/articles
- Legal and policy pages
- External Knowledge Hub at `docs.drychillis.com`

Data:
- Product specs: form, SHU range, ASTA, mesh, moisture, processing, variety, region
- Variety reference data: SHU, region, fruit type, best use
- Heat-level bands and representative specifications

APIs:
- None discovered; no REST/GraphQL/JSON endpoints, no search/lookup service.

Functions:
- None beyond static browsing/contact links. No search, calculator, booking,
  lookup, recommendation, or interactive tool endpoints.

Agent capabilities:
- No WebMCP, MCP Server, A2A, OAuth/OIDC, or agent endpoints exist.
- `llms.txt`, structured data, sitemap, and AI-crawler-friendly robots rules exist.

## Decision Matrix

| Capability | Decision | Reason |
|---|---|---|
| Semantic HTML | REQUIRED | Static content/marketing pages; already implemented and must be preserved |
| Schema.org | REQUIRED | Entity-rich products, articles, FAQs, organization, website, breadcrumbs; already implemented |
| Markdown Negotiation | RECOMMENDED | Content-heavy multilingual site; Cloudflare Markdown for Agents is the correct architecture |
| Dataset | RECOMMENDED | Structured product/variety specs exist and are useful to machines |
| API | NOT_REQUIRED | No public API exists |
| API Catalog | NOT_REQUIRED | No public API to advertise |
| OpenAPI | NOT_REQUIRED | No service API exists |
| Link Response Headers | RECOMMENDED | A machine-readable dataset will exist, so `describedby` discovery is justified |
| WebMCP | NOT_REQUIRED | No browser-level interactive/query tools |
| MCP Server | NOT_REQUIRED | No backend service/business logic to expose |
| MCP Server Card | NOT_REQUIRED | No MCP Server |
| OAuth / OIDC Discovery | NOT_REQUIRED | No protected resources or delegated actions |
| A2A | NOT_REQUIRED | No genuine agent or task lifecycle |
| A2A Agent Card | NOT_REQUIRED | No A2A agent |

Additional low-risk machine-access layer:

| Capability | Decision | Reason |
|---|---|---|
| Content-Signal header | RECOMMENDED | Static, performance-neutral, explicitly welcomes AI training/search/agent input |
| `llms.txt` correction | REQUIRED | Existing file has outdated redirect-era URLs; keep canonical links accurate |

## Selected Technologies

Implement now:
1. Publish static machine-readable datasets:
   - `/data/products.json`
   - `/data/varieties.json`
2. Correct and expand `/llms.txt` to current canonical URLs.
3. Add Cloudflare Pages `_headers`:
   - `Content-Signal: ai-train=yes, search=yes, ai-input=yes`
   - `Link: </data/products.json>; rel="describedby"` on relevant discovery surface
4. Add missing Product JSON-LD to English product pages that currently have only FAQ schema:
   - `/products/yidu-chilli/`
   - `/products/erjingtiao-chilli/`
   - `/products/tianjin-red-chilli/`
5. Preserve existing Schema.org and HTML, with no route/SEO changes.

Deployment action documented, not code-implementable in this static repo:
- Enable Cloudflare **Markdown for Agents** for `drychillis.com`.
  Reference: https://developers.cloudflare.com/fundamentals/reference/markdown-for-agents/
  Requires Cloudflare Pro/Business or a Configuration Rule; no safe static-code fallback.

## Rejected Technologies

- API, OpenAPI, API Catalog: no actual API.
- WebMCP, MCP Server/Card: no backend or interactive tools; adding them would create fake/empty infrastructure.
- OAuth/OIDC: no protected resources; adding auth would be security/complexity overhead.
- A2A/Agent Card: the site is not an agent; advertising an agent would be misleading.

## Security Considerations

- Datasets contain only public marketing/specification data already visible on the site.
- No secrets, admin endpoints, private APIs, database credentials, or internal infrastructure exposed.
- Agent-facing resources are static and publicly readable by design.
- `Content-Signal` is permissive only for the public website and does not grant any private access.

## SEO Considerations

- No route changes, no duplicate indexable pages, no HTML replacement.
- Canonical, hreflang, sitemap, robots, OpenGraph, Twitter, and JSON-LD remain intact.
- `llms.txt` is corrected to canonical URLs already present in the sitemap.
- Dataset JSON files are supplementary machine resources; they do not replace HTML pages.

## Performance Considerations

- All additions are build-time static files or static headers.
- No SSR, Worker, database, client framework, or new dependency is introduced.
- Performance impact is negligible.

## Implementation Plan

1. Add `public/data/products.json` with canonical product records.
2. Add `public/data/varieties.json` with canonical variety records.
3. Replace `public/llms.txt` with accurate, expanded canonical links.
4. Add `public/_headers` with Content-Signal and describedby Link headers.
5. Add Product JSON-LD to three missing English product pages.
6. Run `npm run build` and inspect generated assets.
7. Validate local endpoints and live external scanner.
8. Update this document with actual implementation and validation results.

## Actual Implementation

Files changed:
- `public/data/products.json` — static Schema.org `Dataset` of 10 canonical product records.
- `public/data/varieties.json` — static Schema.org `Dataset` of 5 chilli-variety reference records.
- `public/llms.txt` — corrected stale redirect-era URLs and added canonical product/variety/data links.
- `public/_headers` — Cloudflare Pages headers for `Content-Signal` and `describedby` dataset discovery.
- `src/pages/products/yidu-chilli/index.astro` — added Product JSON-LD.
- `src/pages/products/erjingtiao-chilli/index.astro` — added Product JSON-LD.
- `src/pages/products/tianjin-red-chilli/index.astro` — added Product JSON-LD.

Well-known/discovery resources added:
- `/data/products.json`
- `/data/varieties.json`
- `/llms.txt` (updated)
- `_headers` rules for `Content-Signal` and `Link: </data/products.json>; rel="describedby"`

No new dependency, route, redirect, or HTML content change was introduced.

## Validation Results

Local build:
- `npm run build` completed successfully: 106 pages built.
- `jq empty` passed for `dist/data/products.json` and `dist/data/varieties.json`.
- Astro copied `public/_headers`, `public/llms.txt`, `public/data/products.json`,
  and `public/data/varieties.json` into `dist/` unchanged.
- Generated HTML for Yidu Red, Erjingtiao and Tianjin Red now includes Product JSON-LD.
- `npm run preview` was not executed in this sandbox because binding to `127.0.0.1`
  is blocked; static output was validated directly instead.

Canonical link check:
- All URLs in the updated `llms.txt` were checked against the generated sitemap/route list;
  stale redirect-era slugs are gone. Live HTTP 200 checks require deployed/running access.

External readiness scan:
- A live readiness scan was not re-run in this restricted environment. Expected post-deploy
  results:
  - PASS: robots.txt, sitemap, AI bot rules, Link headers, Content Signals.
  - Not applicable by design: API Catalog, OAuth discovery, MCP Card, A2A Agent Card,
    Agent Skills, WebMCP, ARD.
  - Deferred: Markdown negotiation (Cloudflare dashboard/API setting).
- Architecture interpretation:
  - API Catalog, OAuth, MCP, A2A, Agent Skills, WebMCP, ARD: NOT_REQUIRED for this static content/dataset site.
  - Link headers and Content Signals: implemented in `_headers` and should pass after Cloudflare Pages deploy.
  - Markdown negotiation: blocked on a Cloudflare dashboard/API setting; no static-code implementation is available.

## Remaining Issues

- Deploy the repository changes to Cloudflare Pages, then re-run the readiness scan.
- Enable Cloudflare Markdown for Agents for `drychillis.com`; requires Cloudflare Pro/Business
  or a Configuration Rule.
- Optional: enforce a 301 redirect from `www.drychillis.com` to `https://drychillis.com/` at the edge.
- Optional: publish matching `/data/*.json` datasets for the Spanish and Arabic site content if
  multilingual machine datasets become a requirement.

## Future Recommendations

- If a public quote/search API is ever created, introduce OpenAPI, RFC 9727 API Catalog,
  `service-desc` Link headers, and reconsider MCP/OAuth based on the actual protected resources.
- If interactive product lookup/search is added, reconsider WebMCP as progressive enhancement.
- Keep datasets generated from a single canonical data source if product specifications change often.
