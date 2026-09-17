// 价格区间真相源（业主给定，2026-09-17）—— 一处修改，全站 21 个 Product 节点（en/es/ar/ru）同步生效。
// 口径：USD / 公吨（MT），FOB 青岛。页面可见价格与本文件同源，保证结构化数据与可见内容逐字一致。
export type OfferRange = { low: number; high: number };

export const PRICE_RANGES: Record<string, OfferRange> = {
  // 甜椒粉
  "paprika-powder": { low: 1400, high: 1800 },
  // 干辣椒整/碎/粉/段（同一区间）
  "dried-chillies": { low: 1500, high: 1800 },
  "whole-dried-chillies": { low: 1500, high: 1800 },
  "chilli-flakes": { low: 1500, high: 1800 },
  "chilli-powder": { low: 1500, high: 1800 },
  "chilli-segments": { low: 1500, high: 1800 },
  // 四川/华北品种
  "erjingtiao-chilli": { low: 1500, high: 1800 },
  "sanying-chilli": { low: 1500, high: 1800 },
  "tianjin-red-chilli": { low: 1500, high: 1800 },
  "yidu-chilli": { low: 1500, high: 1800 },
  // 其余品种
  "jinta-chilli": { low: 1500, high: 1700 },
  "jixin-chilli": { low: 1500, high: 1700 },
  "lantern-chilli": { low: 1500, high: 1700 },
  "xiaomi-chilli": { low: 1500, high: 1700 },
  "zidantou-chilli": { low: 1500, high: 1700 },
};

export const PRICE_UNIT = "per metric ton (MT), FOB Qingdao";

const SELLER = "https://drychillis.com/#organization";

export function buildOffers(slug: string, url: string) {
  const r = PRICE_RANGES[slug];
  if (!r) return null;
  return {
    "@type": "AggregateOffer",
    "@id": `${url}#offer`,
    "url": url,
    "priceCurrency": "USD",
    "lowPrice": r.low,
    "highPrice": r.high,
    // GSC 要求 offers 里有 price 或 priceSpecification.price；区间由 AggregateOffer.lowPrice/highPrice
    // 与 UnitPriceSpecification.minPrice/maxPrice 共同表达，unitText/referenceQuantity 标明"每公吨、FOB 青岛"。
    "priceSpecification": {
      "@type": "UnitPriceSpecification",
      "price": r.low,
      "priceCurrency": "USD",
      "minPrice": r.low,
      "maxPrice": r.high,
      "unitText": PRICE_UNIT,
      "referenceQuantity": { "@type": "QuantitativeValue", "value": 1, "unitCode": "TNE" },
    },
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition",
    "businessFunction": "http://purl.org/goodrelations/v1#Sell",
    "seller": { "@id": SELLER },
  };
}

// 可见价格文案（各语言），与上面区间同源
export function priceLine(slug: string, locale: "en" | "es" | "ar" | "ru" = "en"): string | null {
  const r = PRICE_RANGES[slug];
  if (!r) return null;
  const n = { en: `${r.low.toLocaleString("en-US")}–${r.high.toLocaleString("en-US")}`,
              es: `${r.low.toLocaleString("es-ES")}–${r.high.toLocaleString("es-ES")}`,
              ar: `${r.low.toLocaleString("en-US")}–${r.high.toLocaleString("en-US")}`,
              ru: `${r.low}–${r.high}` }[locale];
  if (locale === "es") return `Precio indicativo: USD ${n} por tonelada métrica, FOB Qingdao — el MOQ, el envasado y la especificación se confirman en la cotización.`;
  if (locale === "ar") return `السعر الإرشادي: ${n} دولار أمريكي للطن المتري، FOB تشينغداو — يُحدَّد الحد الأدنى للطلب والتعبئة والمواصفات عند طلب العرض.`;
  if (locale === "ru") return `Ориентировочная цена: ${n} USD за метрическую тонну, FOB Циндао — MOQ, упаковка и спецификация подтверждаются в коммерческом предложении.`;
  return `Indicative price: USD ${n} per metric ton, FOB Qingdao — MOQ, packing and specification confirmed on quotation.`;
}
