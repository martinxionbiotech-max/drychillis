# AIO Architecture Decision — drychillis.com

## Site Overview

- URL: https://drychillis.com
- Brand: Tenda Peppers / Leling Tenda Chili Products Co., Ltd.
- Purpose: B2B lead generation for Chinese-manufactured paprika powder and dried chillies.
- Audience: food manufacturers, importers, distributors, spice brands and industrial buyers.
- Languages: English (`/`), Spanish (`/es/`), Arabic (`/ar/`).
- Related domain: https://docs.drychillis.com (MkDocs Knowledge Hub with `/llms.txt`).
- Framework: Astro 5, fully static output (`output: 'static'`).
- Hosting: Cloudflare Pages/CDN; no Worker, function, API, database or auth backend.
- Canonical domain: `https://drychillis.com/` (non-www).
- WWW behavior: `www.drychillis.com` currently serves the same content instead of issuing an apex 301.

## Architecture

- Build-time static generation from Astro pages.
- `public/_headers` provides Cloudflare Pages static headers.
- `public/_redirects` provides edge-level 301s for legacy slugs.
- `public/robots.txt` declares AI crawler access and Content Signals.
- `public/llms.txt` provides a human/AI-readable site index.
- `public/data/products.json` and `public/data/varieties.json` are Schema.org `Dataset` files.
- Generated sitemap is post-processed at build time to add hreflang alternates.
- No SSR, Node runtime, database, serverless function, Worker, OAuth, MCP server or A2A agent exists.

## Capability Graph

- MAIN SITE
  - Homepage and corporate trust pages
  - Products hub: paprika, dried chillies, product-form pages, three English-only variety-product pages
  - Variety reference pages
  - Heat-level reference pages
  - Specification and packaging pages
  - Technical guides
  - Legal/policy pages
  - Contact/quote conversion pages
- DATA
  - `products.json` (10 product records)
  - `varieties.json` (5 variety records)
- DISCOVERY
  - `robots.txt`
  - sitemap index
  - `llms.txt`
  - Content Signals
  - `describedby` Link headers
- RELATED DOMAIN
  - `docs.drychillis.com` technical Knowledge Hub with its own `llms.txt`
- API: none
- AGENT INTERFACES: none beyond static machine-readable files
- AUTH: none

## SEO Audit

- HTTPS, canonical tags, semantic HTML, structured data and sitemap are present.
- `robots.txt` explicitly allows search and AI crawlers.
- In-page hreflang is present for localized page clusters.
- English-only product pages no longer advertise non-existent `es`/`ar` translations.
- Legacy routes issue edge-level 301s through `_redirects`.
- Previously, `/es/products/` and `/ar/products/` were missing and served the English homepage
  with a 200 status and a canonical pointing to `/`. This run fixes that soft-404/duplicate-content risk.
- Sitemap now carries `xhtml:link` hreflang alternates for every translated URL cluster.
- Remaining SEO item: enforce a `www` to apex redirect at the Cloudflare edge.

## AIO Audit

- Content is indexed by a single `llms.txt` file with canonical links and localized discovery links.
- Structured product and variety data are available as static JSON-LD datasets.
- The homepage advertises both datasets with `describedby` Link headers.
- Content Signals are declared in both the HTTP header and `robots.txt`.
- Markdown content negotiation is not implemented; `llms.txt` plus JSON datasets already provide
  the machine-consumable discovery surface without adding runtime complexity.
- No public API, so no OpenAPI, API Catalog or API-specific Link relations are justified.

## Agent Audit

- No WebMCP, MCP Server, MCP Server Card, OAuth/OIDC, A2A or Agent Card exist.
- These are intentionally not implemented because the site has no interactive query tool,
  backend service, protected resource, delegated action or genuine autonomous agent.
- The static machine-readable layer (`llms.txt`, JSON datasets, Link headers, Content Signals)
  is the correct agent-discovery surface for this architecture.

## Decision Matrix

| Capability | Exists | Value | Complexity | Decision | Reason |
|---|---|---:|---:|---|---|
| Semantic HTML | Yes | High | Very Low | REQUIRED | Static content pages must remain crawlable and accessible |
| Schema.org JSON-LD | Yes | High | Low | REQUIRED | Organization, WebSite, Product, FAQ, Article, Breadcrumb and Dataset entities |
| Canonical architecture | Yes | High | Very Low | REQUIRED | Prevents duplicate host/route indexation risk |
| `llms.txt` | Yes | Medium | Very Low | RECOMMENDED | Low-cost AI/content discovery index |
| Static Markdown content | No | Low | Medium | OPTIONAL | `llms.txt` and HTML source already satisfy discovery; avoid manual duplication |
| Markdown Negotiation | No | Low | Medium | DEFER | Cloudflare dashboard feature; not required while `llms.txt` and datasets exist |
| Dataset files | Yes | High | Low | REQUIRED | Product and variety specs have real machine-consumption value |
| Public API | No | None | High | NOT_REQUIRED | No backend or transactional service exists |
| OpenAPI | No | None | High | NOT_REQUIRED | No public API |
| API Catalog | No | None | High | NOT_REQUIRED | No public API to advertise |
| Link Response Headers | Yes | Medium | Very Low | RECOMMENDED | `describedby` points agents to the two static datasets |
| WebMCP | No | Low | Medium | NOT_REQUIRED | No browser-level interactive/query capability |
| MCP Server | No | Low | High | NOT_REQUIRED | No shared server-side business logic or database |
| MCP Server Card | No | Low | Very Low | NOT_REQUIRED | No MCP server exists |
| OAuth/OIDC Discovery | No | Low | High | NOT_REQUIRED | No protected or user-specific resources |
| A2A | No | None | High | NOT_REQUIRED | No autonomous agent or task lifecycle |
| Agent Card | No | None | High | NOT_REQUIRED | No agent to describe |
| Localized Products hub | Yes | High | Low | REQUIRED | Fixes `/es/products/` and `/ar/products/` soft-404/duplicate homepage |
| Translation-aware language switcher | Yes | High | Very Low | REQUIRED | Prevents language links to non-existent routes |
| Sitemap hreflang alternates | Yes | Medium | Low | RECOMMENDED | Build-time enrichment improves multilingual crawl understanding |
| Content Signals | Yes | Medium | Very Low | RECOMMENDED | Explicitly permits AI training, search and input in HTTP header + robots.txt |

## Implemented

- `src/pages/es/products/index.astro` — new localized products hub page.
- `src/pages/ar/products/index.astro` — new localized products hub page.
- `src/pages/products/index.astro` — restored the full en/es/ar hreflang cluster now that translations exist.
- `src/components/Header.astro` — accepts `multilingual` and renders only existing language options.
- `src/layouts/BaseLayout.astro` — passes `multilingual` through to the Header.
- `scripts/enrich-sitemap.mjs` — post-build sitemap enrichment for `xhtml:link` hreflang alternates.
- `package.json` — build now runs `astro build && node scripts/enrich-sitemap.mjs`.

## Not Implemented

- Markdown Negotiation — DEFER; requires a Cloudflare dashboard/plan feature and adds runtime content
  negotiation that this static site does not need because `llms.txt` and JSON datasets are present.
- Public API, OpenAPI, API Catalog — NOT_REQUIRED; no API exists.
- WebMCP — NOT_REQUIRED; no interactive browser tool.
- MCP Server and MCP Server Card — NOT_REQUIRED; no backend service or reusable server-side tools.
- OAuth/OIDC — NOT_REQUIRED; no private resources or delegated actions.
- A2A and Agent Card — NOT_REQUIRED; no autonomous agent or agent-to-agent task lifecycle.
- Agent Skills and ARD — NOT_REQUIRED; no capability surface that those manifests would describe.
- Multilingual datasets for `/es/` and `/ar/` — DEFER; English datasets cover the canonical reference
  records and localized page content remains crawlable via HTML and hreflang.

## Validation

- `npm run build` completed successfully: 108 static pages built.
- `scripts/enrich-sitemap.mjs` enriched 108 URLs with hreflang alternates.
- `dist/sitemap-0.xml` and `dist/sitemap-index.xml` parse as well-formed XML.
- `public/data/products.json` and `public/data/varieties.json` pass `jq empty`.
- Local preview returned HTTP 200 for `/`, `/products/`, `/es/products/`, `/ar/products/`,
  `/robots.txt`, `/llms.txt`, `/data/products.json`, `/data/varieties.json`,
  `/sitemap-index.xml` and `/sitemap-0.xml`.
- Crawl of all 108 sitemap URLs returned HTTP 200 locally with zero bad URLs.
- Crawl of 218 unique internal links found in generated HTML returned zero broken links.
- Generated English-only product pages show only `hreflang="en"` and `x-default`.
- Generated localized products hubs show the correct en/es/ar hreflang cluster and canonical URLs.
- `isitagentready.com` live scan result: Level 2 "Bot-Aware".
  - PASS: robots.txt, sitemap, Link headers, AI bot rules, Content Signals.
  - FAIL, intentionally accepted: Markdown Negotiation, DNS-AID, API Catalog, OAuth, auth.md,
    MCP Server Card, A2A Agent Card, Agent Skills, WebMCP, ARD.
  - Neutral/informational: Web Bot Auth and commerce discovery checks.

## Security

- Public interfaces are limited to static HTML, `robots.txt`, `llms.txt`, sitemap XML and two JSON datasets.
- No admin, debug, private, database or authentication endpoints are exposed.
- No secrets, environment variables or internal service URLs are present in public files.
- No new runtime surface was introduced.

## Performance

- The site remains fully static.
- No Worker, function, database or server runtime was added.
- Sitemap hreflang enrichment is build-time only and does not affect page latency.
- Headers remain static Cloudflare Pages headers.
- No content negotiation was introduced, so no `Vary`/cache-partitioning risk was added.

## SEO Impact

- The localized products soft-404/duplicate-homepage issue is fixed, removing a high-risk internal-linking defect.
- The language switcher no longer points to non-existent routes from English-only product pages.
- Sitemap hreflang alternates give search engines a stronger multilingual URL mapping.
- Existing canonical, structured data, internal-linking and machine-readability surfaces are preserved.
- No ranking guarantees are made.

## Future Opportunities

- P0: Configure a `www.drychillis.com` to `https://drychillis.com/` 301 at the Cloudflare edge.
- P0: Deploy this build to Cloudflare Pages and re-run `isitagentready.com`.
- P1: Generate localized `/data/*.json` datasets if Spanish/Arabic machine data becomes a requirement.
- P1: If Markdown for Agents is available on the Cloudflare plan, enable it as an optional convenience.
- P2: Add a public quote/spec API and OpenAPI only if a real transactional backend is introduced.
- P3: Add WebMCP only if a browser-level product lookup/calculator is added.
- P3: Add MCP/OAuth/A2A only after protected resources or genuine agent workflows exist.
