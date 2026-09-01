// Centralized UI translation dictionary — en / es / ar
export type Lang = 'en' | 'es' | 'ar';

export const ui = {
  en: {
    brand: 'Tenda Peppers',
    brandTag: 'Paprika & Dried Chillies',
    nav: {
      home: 'Home',
      paprika: 'Paprika',
      chillies: 'Dried Chillies',
      quality: 'Quality',
      guides: 'Guides',
      about: 'About',
      contact: 'Contact',
    },
    footer: {
      company: 'Company',
      products: 'Products',
      resources: 'Resources',
      legal: 'Legal',
      knowledgeHub: 'Knowledge Hub',
      privacy: 'Privacy Policy',
      terms: 'Terms & Conditions',
    },
    common: {
      requestQuote: 'Request Quotation',
      contactNow: 'Contact Now',
      readGuide: 'Read the guide →',
      viewAll: 'Browse all guides →',
      fromHub: 'From the Tenda Peppers Knowledge Hub.',
      relatedDocs: 'Related Technical Documentation',
      dataNote: 'Specifications are representative ranges. Confirm your target specification with us.',
    },
    dir: 'ltr',
  },
  es: {
    brand: 'Tenda Peppers',
    brandTag: 'Pimentón y Chiles Secos',
    nav: {
      home: 'Inicio',
      paprika: 'Pimentón',
      chillies: 'Chiles Secos',
      quality: 'Calidad',
      guides: 'Guías',
      about: 'Nosotros',
      contact: 'Contacto',
    },
    footer: {
      company: 'Empresa',
      products: 'Productos',
      resources: 'Recursos',
      legal: 'Legal',
      knowledgeHub: 'Centro de Conocimiento',
      privacy: 'Política de Privacidad',
      terms: 'Términos y Condiciones',
    },
    common: {
      requestQuote: 'Solicitar Cotización',
      contactNow: 'Contactar ahora',
      readGuide: 'Leer la guía →',
      viewAll: 'Ver todas las guías →',
      fromHub: 'Del Centro de Conocimiento de Tenda Peppers.',
      relatedDocs: 'Documentación Técnica Relacionada',
      dataNote: 'Las especificaciones son rangos representativos. Confirme su especificación objetivo con nosotros.',
    },
    dir: 'ltr',
  },
  ar: {
    brand: 'تيندا بيبرز',
    brandTag: 'فلفل حلو وفلفل حار مجفف',
    nav: {
      home: 'الرئيسية',
      paprika: 'الفلفل الحلو',
      chillies: 'الفلفل المجفف',
      quality: 'الجودة',
      guides: 'الأدلة',
      about: 'من نحن',
      contact: 'اتصل بنا',
    },
    footer: {
      company: 'الشركة',
      products: 'المنتجات',
      resources: 'الموارد',
      legal: 'قانوني',
      knowledgeHub: 'مركز المعرفة',
      privacy: 'سياسة الخصوصية',
      terms: 'الشروط والأحكام',
    },
    common: {
      requestQuote: 'اطلب عرض سعر',
      contactNow: 'اتصل الآن',
      readGuide: 'اقرأ الدليل ←',
      viewAll: 'تصفح جميع الأدلة ←',
      fromHub: 'من مركز المعرفة الخاص بـ Tenda Peppers.',
      relatedDocs: 'وثائق تقنية ذات صلة',
      dataNote: 'المواصفات نطاقات تمثيلية. يرجى تأكيد المواصفات المستهدفة معنا.',
    },
    dir: 'rtl',
  },
} as const;

export function t(lang: Lang, path: string): string {
  const keys = path.split('.');
  let node: any = ui[lang];
  for (const k of keys) {
    if (node && typeof node === 'object' && k in node) node = node[k];
    else return path;
  }
  return typeof node === 'string' ? node : path;
}
