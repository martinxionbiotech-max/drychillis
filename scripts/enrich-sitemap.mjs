import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const SITE = 'https://drychillis.com';
const LOCALES = ['en', 'es', 'ar', 'ru'];

function localizedUrl(lang, skeleton) {
  const base = lang === 'en' ? '' : `/${lang}`;
  return `${SITE}${base}${skeleton}`;
}

function skeletonFromPath(pathname) {
  return pathname.replace(/^\/(es|ar|ru)(?=\/|$)/, '');
}

const target = process.argv[2] || 'dist/sitemap-0.xml';
let xml;
try {
  xml = await readFile(target, 'utf8');
} catch {
  console.error(`[enrich-sitemap] ${target} not found; skipping.`);
  process.exit(0);
}

xml = xml.replace(/\s*<xhtml:link[^>]*\/>/g, '');

const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
const urlSet = new Set(urls);
const pathSet = new Set(
  urls.map((url) => {
    try {
      return new URL(url).pathname;
    } catch {
      return url;
    }
  })
);

let enriched = 0;
const output = xml.replace(/<url>([\s\S]*?)<\/url>/g, (block) => {
  const locMatch = block.match(/<loc>(.*?)<\/loc>/);
  if (!locMatch) return block;
  const loc = locMatch[1];
  let pathname;
  try {
    pathname = new URL(loc).pathname;
  } catch {
    return block;
  }

  const skeleton = skeletonFromPath(pathname);
  const alternates = LOCALES.map((lang) => ({ lang, url: localizedUrl(lang, skeleton) }))
    .filter(({ url }) => {
      try {
        return pathSet.has(new URL(url).pathname);
      } catch {
        return false;
      }
    });

  if (alternates.length === 0) return block;

  const links = alternates
    .map(({ lang, url }) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${url}" />`)
    .join('\n');

  const en = alternates.find(({ lang }) => lang === 'en');
  const xDefault = en ? en.url : alternates[0].url;
  const xDefaultLink = `    <xhtml:link rel="alternate" hreflang="x-default" href="${xDefault}" />`;

  enriched += 1;
  return block.replace('</url>', `\n${links}\n${xDefaultLink}\n  </url>`);
});

await writeFile(target, output, 'utf8');
console.log(`[enrich-sitemap] Enriched ${enriched} URLs with hreflang alternates in ${path.resolve(target)}`);
