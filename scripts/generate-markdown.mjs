// generate-markdown.mjs — post-build: emit clean Markdown mirrors + llms-full.txt
// Maps every sitemap URL to /md/<path>.md so AI crawlers can fetch pure content
// without paying for Cloudflare's Markdown-for-Agents feature.
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { NodeHtmlMarkdown } from 'node-html-markdown';

const SITE = 'https://drychillis.com';
const DIST = 'dist';
const MD_ROOT = path.join(DIST, 'md');
const GENERATED_ON = new Date().toISOString().slice(0, 10);

const nhm = new NodeHtmlMarkdown({ keepDataImages: false, useInlineLinks: true });

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('_') || entry.name === 'md') continue; // skip assets + our own output
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p);
    else yield p;
  }
}

function skeletonFromUrl(url) {
  const u = new URL(url);
  let p = u.pathname.replace(/^\/(es|ar|ru)(?=\/|$)/, '');
  if (!p.endsWith('/')) p += '/';
  return p === '/' ? '/index/' : p;
}

function extractMain(html) {
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (!m) return null;
  return m[1]
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '');
}

function titleFromHtml(html) {
  const t = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (t) return decodeEntities(t[1].replace(/\s+/g, ' ').trim());
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) return decodeEntities(h1[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
  return '';
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x27;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)));
}

async function main() {
  // Read sitemap for canonical URL list
  let urls = [];
  try {
    const sitemapIndex = await readFile(path.join(DIST, 'sitemap-index.xml'), 'utf8');
    const s0 = sitemapIndex.match(/<loc>([^<]+)<\/loc>/)[1];
    const s0xml = await readFile(path.join(DIST, s0.replace(/^\/|\/$/g, '') || path.basename(s0)), 'utf8').catch(async () => {
      // sitemap-0.xml at dist root
      const f = await readdir(DIST);
      const hit = f.find((x) => x.startsWith('sitemap-0'));
      return readFile(path.join(DIST, hit), 'utf8');
    });
    urls = [...s0xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  } catch (e) {
    console.error('[md-gen] sitemap read failed, falling back to file walk:', e.message);
  }

  const pages = [];
  const seen = new Set();
  for await (const file of walk(DIST)) {
    if (!file.endsWith('index.html')) continue;
    const rel = file.slice(DIST.length + 1).replace(/\/index\.html$/, '');
    const url = `${SITE}/${rel}/`;
    const inSitemap = urls.length === 0 || urls.includes(url);
    if (urls.length > 0 && !inSitemap) continue; // only mirror indexed pages
    if (seen.has(url)) continue;
    seen.add(url);
    pages.push({ file, url, rel });
  }

  const fullParts = [`# Tenda Peppers — Full Markdown Corpus\n\n> Source: ${SITE}\n> Generated: ${GENERATED_ON}\n> Language mirrors included: en, es, ar, ru\n`];
  const entries = [];

  for (const { file, url, rel } of pages) {
    const html = await readFile(file, 'utf8');
    const mainHtml = extractMain(html);
    if (!mainHtml) continue;
    const title = titleFromHtml(html);
    const body = nhm.translate(mainHtml).replace(/\n{3,}/g, '\n\n').trim();
    if (body.length < 100) continue; // skip near-empty pages

    const lang = /^\/(es|ar|ru)\//.test(new URL(url).pathname) ? new URL(url).pathname.split('/')[1] : 'en';
    const md = `---\ntitle: ${JSON.stringify(title)}\nsource: ${url}\nlanguage: ${lang}\ngenerated: ${GENERATED_ON}\n---\n\n> Source: ${url}\n\n${body}\n`;
    entries.push({ url, title, lang, rel, md });
  }

  // Write /md/<path>.md
  for (const e of entries) {
    const outPath = path.join(MD_ROOT, e.rel + '.md');
    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, e.md, 'utf8');
  }

  // llms-full.txt: entire corpus in one file
  for (const e of entries) {
    fullParts.push(`\n---\n\n# ${e.title}\n\n> Source: ${e.url} (${e.lang})\n\n${e.md.split('\n').slice(5).join('\n')}`);
  }
  await writeFile(path.join(DIST, 'llms-full.txt'), fullParts.join('\n'), 'utf8');

  console.log(`[md-gen] ${entries.length} markdown mirrors written to /md/ + llms-full.txt (${fullParts.join('').length.toLocaleString()} chars)`);
}

main().catch((e) => {
  console.error('[md-gen] failed:', e);
  process.exit(1);
});
