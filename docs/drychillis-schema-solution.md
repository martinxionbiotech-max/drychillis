# drychillis.com 结构化数据（Schema.org JSON-LD）方案

> 目标：让 ASTA 色值 / SHU 辣度 / 目数 / 水分等参数表成为 AI 可直接引用、可直接抽取的机器可读数据。
> 适用站点：drychillis.com（Tenda Peppers / Leling Tenda Chili Products Co., Ltd.）
> 生成日期：2026-09-07

---

## 一、方案总览（5 类 Schema，按页面投放）

| Schema 类型 | 投放页面 | 作用 |
|---|---|---|
| `Organization` | 全站（header 注入） | 实体识别：公司/品牌/认证/联系方式 |
| `Product` + `additionalProperty` | 每个产品页 | 产品规格（ASTA/SHU/目数/水分）结构化 |
| `Dataset` + `variableMeasured` | docs 数据页（ASTA/SHU 表、品种表、规格表） | 参数表变成"数据集"，AI 可直接引用数值 |
| `TechArticle` | docs 采购指南页（buying-guide 等） | 技术文章署名/作者/出版日期 |
| `FAQPage` | FAQ 页 + 每个产品页 FAQ | 富摘要 + AI 问答抽取 |

---

## 二、Organization（全站 header 注入一次）

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://drychillis.com/#organization",
  "name": "Tenda Peppers",
  "legalName": "Leling Tenda Chili Products Co., Ltd.",
  "alternateName": "乐陵泰达辣椒制品有限公司",
  "url": "https://drychillis.com/",
  "logo": "https://drychillis.com/logo.png",
  "foundingDate": "2010",
  "description": "China manufacturer of dried chillies and paprika powder for industrial food manufacturing, ISO 9001 & HACCP certified.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Leling",
    "addressRegion": "Shandong",
    "addressCountry": "CN"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "sales",
    "telephone": "+86-000-0000000",
    "availableLanguage": ["en", "es", "ar"]
  },
  "hasCredential": [
    { "@type": "EducationalOccupationalCredential", "name": "ISO 9001:2015" },
    { "@type": "EducationalOccupationalCredential", "name": "HACCP" }
  ],
  "brand": { "@type": "Brand", "name": "Tenda Peppers" }
}
```

> ⚠️ 电话/logo/邮箱需替换为真实值（我抓到的页面未直接暴露 contact 页，需你补）。

---

## 三、Product + additionalProperty（产品页，以 paprika powder 为例）

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": "https://drychillis.com/products/paprika/#product",
  "name": "Paprika Powder",
  "description": "Sweet and low-heat paprika powder made from high-colour sweet peppers, specified by ASTA colour value for natural red colouring.",
  "image": "https://drychillis.com/wp-content/uploads/paprika.jpg",
  "brand": { "@type": "Brand", "name": "Tenda Peppers" },
  "manufacturer": { "@id": "https://drychillis.com/#organization" },
  "countryOfOrigin": "CN",
  "category": "Dehydrated spice ingredient",
  "additionalProperty": [
    {
      "@type": "PropertyValue",
      "name": "ASTA colour value",
      "value": "60-240",
      "unitText": "ASTA",
      "propertyID": "ASTA"
    },
    {
      "@type": "PropertyValue",
      "name": "Heat level",
      "value": "<10000",
      "unitCode": "SHU",
      "propertyID": "Scoville Heat Units"
    },
    {
      "@type": "PropertyValue",
      "name": "Mesh size",
      "value": "60-80",
      "unitText": "mesh"
    },
    {
      "@type": "PropertyValue",
      "name": "Moisture",
      "value": "<13",
      "unitCode": "P1",
      "unitText": "%"
    }
  ]
}
```

**其他产品页照此模板改 `name`/`description`/`additionalProperty`：**
- Dried whole chillies → 品种（Lantern/Jinta/Xiaomi 等）+ SHU 分档
- Chilli flakes → 10,000–20,000 SHU
- Chilli powder → 20,000–50,000 SHU
- Chilli segments → >50,000 SHU

---

## 四、Dataset + variableMeasured（docs 数据页，核心）

这是本次方案的**核心**——把 ASTA/SHU/品种参数表声明为结构化数据集，AI 搜索引擎能直接抽取数值引用。

```json
{
  "@context": "https://schema.org",
  "@type": "Dataset",
  "@id": "https://docs.drychillis.com/asta-shu-explained/#dataset",
  "name": "Tenda Peppers ASTA Colour & SHU Heat Reference",
  "description": "Reference dataset of ASTA colour values and Scoville Heat Unit (SHU) ranges for Chinese chilli and paprika varieties produced by Tenda Peppers.",
  "url": "https://docs.drychillis.com/asta-shu-explained/",
  "creator": { "@id": "https://drychillis.com/#organization" },
  "publisher": { "@id": "https://drychillis.com/#organization" },
  "dateModified": "2026-08-31",
  "license": "https://schema.org/InLanguage",
  "isAccessibleForFree": true,
  "keywords": ["ASTA", "Scoville", "SHU", "paprika", "chilli", "colour value", "heat level"],
  "includedInDataCatalog": {
    "@type": "DataCatalog",
    "name": "Tenda Peppers Technical Documentation",
    "url": "https://docs.drychillis.com/"
  },
  "variableMeasured": [
    {
      "@type": "PropertyValue",
      "name": "Sweet paprika ASTA range",
      "description": "Colour strength of sweet paprika (low-heat, high-colour sweet peppers)",
      "value": "8-240",
      "unitText": "ASTA"
    },
    {
      "@type": "PropertyValue",
      "name": "Low heat SHU band",
      "value": "<10000",
      "unitText": "SHU",
      "description": "Yidu red, Wangdu varieties"
    },
    {
      "@type": "PropertyValue",
      "name": "Medium heat SHU band",
      "value": "10000-20000",
      "unitText": "SHU",
      "description": "Xian pepper, Jinta, Erjingtiao varieties"
    },
    {
      "@type": "PropertyValue",
      "name": "High heat SHU band",
      "value": "20000-50000",
      "unitText": "SHU",
      "description": "Sanying, Zidantou, New Generation, Seven-Star varieties"
    },
    {
      "@type": "PropertyValue",
      "name": "Extra hot SHU band",
      "value": ">50000",
      "unitText": "SHU",
      "description": "Jixin, Xiaomi, Chilli King, Shuan Shuan varieties"
    },
    {
      "@type": "PropertyValue",
      "name": "Mesh size",
      "value": "60-80",
      "unitText": "mesh"
    },
    {
      "@type": "PropertyValue",
      "name": "Moisture",
      "value": "<13",
      "unitText": "%"
    }
  ],
  "distribution": {
    "@type": "DataDownload",
    "encodingFormat": "text/markdown",
    "contentUrl": "https://docs.drychillis.com/asta-shu-explained/"
  }
}
```

> 说明：`variableMeasured` 是 Dataset schema 里让 AI 识别"这个数据集里有哪些变量/指标"的关键字段——Google 和 Perplexity 抓取时会把每个 `PropertyValue`（ASTA 区间、SHU 分档）当成可引用的事实点。

---

## 五、TechArticle（docs 采购指南页）

```json
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "Paprika & Chilli Buying Guide",
  "author": { "@type": "Organization", "name": "Tenda Peppers Technical Team" },
  "publisher": { "@id": "https://drychillis.com/#organization" },
  "datePublished": "2026-08-31",
  "dateModified": "2026-08-31",
  "mainEntityOfPage": "https://docs.drychillis.com/buying-guide/",
  "about": ["paprika specification", "chilli heat level", "ASTA colour", "SHU"]
}
```

---

## 六、FAQPage（FAQ 页 + 产品页 FAQ 区块）

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I specify paprika powder?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Specify the product form (sweet or low-heat paprika), target ASTA colour value (typically 60–240), heat level (under 10,000 SHU), mesh size (commonly 60–80) and moisture (under 13%)."
      }
    },
    {
      "@type": "Question",
      "name": "What is the difference between paprika and chilli powder?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Paprika is made from low-heat, high-colour sweet peppers (under 10,000 SHU) for colouring. Chilli powder is made from hotter varieties (20,000–50,000+ SHU) to add heat. They are not interchangeable."
      }
    }
  ]
}
```

---

## 七、实施说明

1. **投放方式**：
   - `Organization` 用全局 `<script type="application/ld+json">` 注入（header/footer 模板，全站一次）。
   - `Product` 放在每个产品页 `<head>`。
   - `Dataset` 放在 docs 子站每个"参数表"页（asta-shu、varieties、specs）。
   - `TechArticle` 放在 docs 每篇指南页。
   - `FAQPage` 放在 FAQ 页 + 产品页 FAQ 区块。
2. **验证**：用 Google Rich Results Test / Schema Markup Validator 逐页验证无报错。
3. **注意**：JSON-LD 里不要出现不存在的数值（比如虚构 ASTA 精确值），必须与页面正文一致，否则 AI 交叉验证会发现矛盾、反而伤信任。
4. **站群隔离**：这个 Organization `@id` 是 drychillis 独有的（`#organization`），不要与 migibio/hjpotatoflakes 等姊妹站的 `@id` 或 sameAs 共享，避免交叉 footprint。
