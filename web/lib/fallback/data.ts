// Bundled demo catalog. This is the single source of truth for local
// development: the API seed script imports this file, and the storefront
// falls back to it whenever the backend is unreachable or returns nothing.
// Keep it dependency-free (no next/* imports) so the API can import it too.

import type { CategoryDto, ProductDto, PublicSettingsDto } from "../types";

export const DEMO_CATEGORIES: CategoryDto[] = [
  {
    id: "cat-lentalar",
    slug: "lentalar",
    name: {
      uz: "Lentalar",
      ru: "Ленты",
      en: "Ribbons"
    },
    description: {
      uz: "Atlas, rep, jakkard va organza lentalar - kiyim-kechak, o'ram va bezak uchun.",
      ru: "Атласные, репсовые, жаккардовые ленты и органза - для одежды, упаковки и декора.",
      en: "Satin, grosgrain, jacquard and organza ribbons for garments, packaging and decor."
    },
    image: "/images/cat-ribbons.jpg",
    isActive: true,
    sortOrder: 1
  },
  {
    id: "cat-elastik",
    slug: "elastik-tasmalar",
    name: {
      uz: "Elastik tasmalar",
      ru: "Эластичные ленты",
      en: "Elastic tapes"
    },
    description: {
      uz: "Kiyim-kechak, tibbiyot va sanoat uchun to'qilgan va trikotaj elastik tasmalar.",
      ru: "Тканые и трикотажные эластичные ленты для одежды, медицины и промышленности.",
      en: "Woven and knitted elastic tapes for apparel, medical and industrial use."
    },
    image: "/images/cat-elastic.jpg",
    isActive: true,
    sortOrder: 2
  },
  {
    id: "cat-yorliqlar",
    slug: "yorliqlar",
    name: {
      uz: "Yorliqlar va etiketkalar",
      ru: "Ярлыки и этикетки",
      en: "Labels and tags"
    },
    description: {
      uz: "Brendingiz uchun individual dizayndagi to'qilgan va osma yorliqlar.",
      ru: "Тканые и навесные ярлыки с индивидуальным дизайном для вашего бренда.",
      en: "Woven and hang tags with fully custom designs for your brand."
    },
    image: "/images/cat-labels.jpg",
    isActive: true,
    sortOrder: 3
  }
];

export const DEMO_PRODUCTS: ProductDto[] = [
  {
    id: "pr-atlas",
    slug: "atlas-lentalar",
    category: { slug: "lentalar", name: DEMO_CATEGORIES[0].name },
    name: {
      uz: "Atlas lentalar",
      ru: "Атласные ленты",
      en: "Satin ribbons"
    },
    short: {
      uz: "Yumshoq yaltiroq yuzali klassik lentalar - kiyim-kechak va bezak uchun.",
      ru: "Классические ленты с мягким блеском - для одежды и декора.",
      en: "Classic ribbons with a soft sheen for garments and decor."
    },
    description: {
      uz: "Yuqori sifatli polyester atlasdan to'qilgan lentalar - yumshoq, yorqin yuzali va shaklini yaxshi saqlaydi. Kiyim-kechak bezaklari, o'ramlar, gulchambar va sovg'a bezaklarida keng qo'llanadi. 5 mm dan 100 mm gacha kenglikda, xohlagan rangda ishlab chiqaramiz. Qirralari maxsus termik ishlovdan o'tgani uchun yechilmaydi va uzoq xizmat qiladi.",
      ru: "Ленты из высококачественного полиэфирного атласа - мягкие, с благородным блеском, хорошо держат форму. Применяются для отделки одежды, упаковки, флористики и подарочного декора. Производим в ширинах от 5 до 100 мм, окрашиваем в любой цвет. Кромки проходят термическую обработку, поэтому лента не осыпается и служит долго.",
      en: "Ribbons woven from premium polyester satin - soft, with a refined lustre and excellent shape retention. Widely used for garment finishing, packaging, floristry and gift decor. Produced in widths from 5 mm to 100 mm, dyed in any colour. Edges are heat-sealed, so the ribbon never frays and lasts for years."
    },
    metaTitle: {
      uz: "Atlas lentalar - AKSAM ishlab chiqarishi, Namangan",
      ru: "Атласные ленты - производство AKSAM, Наманган",
      en: "Satin Ribbons - Made by AKSAM, Uzbekistan"
    },
    metaDesc: {
      uz: "5–100 mm kenglikdagi yuqori sifatli atlas lentalar. Pantone bo'yicha bo'yash, 50+ rang, tez ishlab chiqarish muddati. Butun O'zbekiston bo'ylab yetkazib beramiz.",
      ru: "Атласные ленты шириной 5–100 мм от производителя. Окраска по Pantone, 50+ цветов, быстрые сроки. Доставка по всему Узбекистану.",
      en: "Premium satin ribbons 5–100 mm wide, made in Uzbekistan. Pantone dyeing, 50+ colours, fast lead times, nationwide delivery."
    },
    highlights: {
      uz: ["5–100 mm kenglik oralig'i", "50+ rang kartasi, Pantone bo'yicha bo'yash", "Termik ishlovli, yechilmaydigan qirralar", "Katta partiyalar uchun 5–20 ish kuni"],
      ru: ["Ширина от 5 до 100 мм", "Карта из 50+ цветов, окраска по Pantone", "Термообработанные неосыпающиеся кромки", "Крупные партии - 5–20 рабочих дней"],
      en: ["Widths from 5 to 100 mm", "50+ colour card, Pantone dyeing", "Heat-sealed, non-fraying edges", "Bulk orders in 5–20 working days"]
    },
    specs: {"uz": [{"label": "Kenglik", "value": "5 – 100 mm"}, {"label": "Tarkibi", "value": "100% polyester (atlas to'quvi)"}, {"label": "Ranglar", "value": "50+ rang, Pantone bo'yicha bo'yash"}, {"label": "Rulon uzunligi", "value": "50 / 100 m (buyurtma bo'yicha)"}, {"label": "Minimal buyurtma", "value": "100 rulondan"}, {"label": "Ishlab chiqarish muddati", "value": "5 – 20 ish kuni"}, {"label": "Qadoqlash", "value": "Karton g'altak yoki bo'sh o'ram"}], "ru": [{"label": "Ширина", "value": "5 – 100 мм"}, {"label": "Состав", "value": "100% полиэстер (атласное плетение)"}, {"label": "Цвета", "value": "50+ цветов, окраска по Pantone"}, {"label": "Длина рулона", "value": "50 / 100 м (по заказу)"}, {"label": "Минимальный заказ", "value": "от 100 рулонов"}, {"label": "Срок производства", "value": "5 – 20 рабочих дней"}, {"label": "Упаковка", "value": "Картонная катушка или свободный моток"}], "en": [{"label": "Width", "value": "5 – 100 mm"}, {"label": "Composition", "value": "100% polyester (satin weave)"}, {"label": "Colours", "value": "50+ colours, Pantone dyeing"}, {"label": "Roll length", "value": "50 / 100 m (to order)"}, {"label": "Minimum order", "value": "from 100 rolls"}, {"label": "Lead time", "value": "5 – 20 working days"}, {"label": "Packing", "value": "Cardboard spool or loose coil"}]},
    images: ["/images/p-satin.jpg", "/images/cat-ribbons.jpg", "/images/hero-main.jpg"],
    isActive: true,
    sortOrder: 1,
    createdAt: "2024-03-12T00:00:00.000Z",
    updatedAt: "2026-06-02T00:00:00.000Z"
  },
  {
    id: "pr-rep",
    slug: "rep-lentalar",
    category: { slug: "lentalar", name: DEMO_CATEGORIES[0].name },
    name: {
      uz: "Rep lentalar",
      ru: "Репсовые ленты",
      en: "Grosgrain ribbons"
    },
    short: {
      uz: "Zich to'qimali, mat yuzali - sumka, kiyim va aksessuarlar uchun mustahkam lentalar.",
      ru: "Плотные матовые ленты - прочные решения для сумок, одежды и аксессуаров.",
      en: "Dense, matte ribbons - durable solutions for bags, garments and accessories."
    },
    description: {
      uz: "Rep to'qima texnologiyasida ishlab chiqarilgan lentalar - zich, mat yuzali va yuqori mustahkamlikka ega. Sumka tutqichlari, kamarlar, kiyim chetlari va texnik maqsadlar uchun ideal tanlov. Namlikka chidamli, shaklini yo'qotmaydi va qayta yuvishga bardosh beradi. Istalgan rang va kenglikda ishlab chiqaramiz.",
      ru: "Ленты репсового плетения - плотные, матовые, повышенной прочности. Идеальны для ручек сумок, ремней, отделки одежды и технических задач. Устойчивы к влаге, не теряют форму и выдерживают многократные стирки. Изготавливаем в любом цвете и ширине.",
      en: "Grosgrain-woven ribbons - dense, matte and highly durable. The ideal choice for bag handles, belts, garment edging and technical applications. Resistant to moisture, keeps its shape and survives repeated washing. Produced in any colour and width."
    },
    metaTitle: {
      uz: "Rep lentalar - AKSAM ishlab chiqarishi, Namangan",
      ru: "Репсовые ленты - производство AKSAM, Наманган",
      en: "Grosgrain Ribbons - Made by AKSAM, Uzbekistan"
    },
    metaDesc: {
      uz: "Zich va mustahkam rep lentalar: sumka tutqichlari, kamarlar, kiyim bezaklari. O'zbekistonda ishlab chiqariladi, istalgan rangda.",
      ru: "Плотные и прочные репсовые ленты: ручки сумок, ремни, отделка одежды. Производство в Узбекистане, любой цвет.",
      en: "Dense, durable grosgrain ribbons for bag handles, belts and garment trim. Made in Uzbekistan, any colour available."
    },
    highlights: {
      uz: ["Yuqori mustahkamlik, uzoq xizmat muddati", "Mat yuzali, qayta yuvishga chidamli", "Texnik maqsadlar uchun ham mos", "Ommaviy ishlab chiqarish quvvati"],
      ru: ["Высокая прочность, долгий срок службы", "Матовая поверхность, стойкость к стирке", "Подходят для технических задач", "Мощности массового производства"],
      en: ["High tensile strength, long service life", "Matte finish, wash-resistant", "Also suited for technical use", "Mass production capacity"]
    },
    specs: {"uz": [{"label": "Kenglik", "value": "10 – 50 mm"}, {"label": "Tarkibi", "value": "Polyester / paxta (rep to'quvi)"}, {"label": "Ranglar", "value": "30+ rang"}, {"label": "Rulon uzunligi", "value": "50 / 100 m"}, {"label": "Chidamlilik", "value": "Namlikka chidamli, ko'p yuvishga bardoshli"}, {"label": "Minimal buyurtma", "value": "100 rulondan"}, {"label": "Ishlab chiqarish muddati", "value": "5 – 20 ish kuni"}], "ru": [{"label": "Ширина", "value": "10 – 50 мм"}, {"label": "Состав", "value": "Полиэстер / хлопок (репсовое плетение)"}, {"label": "Цвета", "value": "30+ цветов"}, {"label": "Длина рулона", "value": "50 / 100 м"}, {"label": "Прочность", "value": "Влагостойкая, выдерживает многократные стирки"}, {"label": "Минимальный заказ", "value": "от 100 рулонов"}, {"label": "Срок производства", "value": "5 – 20 рабочих дней"}], "en": [{"label": "Width", "value": "10 – 50 mm"}, {"label": "Composition", "value": "Polyester / cotton (grosgrain weave)"}, {"label": "Colours", "value": "30+ colours"}, {"label": "Roll length", "value": "50 / 100 m"}, {"label": "Durability", "value": "Moisture-resistant, survives repeated washing"}, {"label": "Minimum order", "value": "from 100 rolls"}, {"label": "Lead time", "value": "5 – 20 working days"}]},
    images: ["/images/p-grosgrain.jpg", "/images/cat-ribbons.jpg", "/images/hero-main.jpg"],
    isActive: true,
    sortOrder: 2,
    createdAt: "2024-03-12T00:00:00.000Z",
    updatedAt: "2026-06-02T00:00:00.000Z"
  },
  {
    id: "pr-jakkard",
    slug: "jakkard-lentalar",
    category: { slug: "lentalar", name: DEMO_CATEGORIES[0].name },
    name: {
      uz: "Jakkard lentalar",
      ru: "Жаккардовые ленты",
      en: "Jacquard ribbons"
    },
    short: {
      uz: "To'qilgan naqshli premium lentalar - brend va bezak uchun o'ziga xos yechim.",
      ru: "Премиальные ленты с тканым узором - фирменное решение для бренда и декора.",
      en: "Premium pattern-woven ribbons - a distinctive solution for branding and decor."
    },
    description: {
      uz: "Jakkard dastgohlarida to'qilgan naqshli lentalar - har bir naqsh ipdan yasaladi, bosma emas. Logotip, monogramma yoki milliy ornamentlarni to'qib beramiz. Milliy liboslar, interyer bezaklari va sovg'a o'ramlari uchun benazir tanlov. Dizayn buyurtmasi qabul qilinadi, namuna 7–10 kunda tayyor.",
      ru: "Ленты с узором, сотканным на жаккардовых станках - рисунок создаётся нитью, а не печатью. Соткём логотип, монограмму или национальный орнамент. Идеальный выбор для национальных костюмов, интерьерного декора и подарочной упаковки. Принимаем дизайн-заказы, образец готов за 7–10 дней.",
      en: "Ribbons woven on jacquard looms - the pattern is created with thread, not printing. We can weave your logo, monogram or national ornament. An exquisite choice for traditional garments, interior decor and gift packaging. Custom design orders welcome; a sample is ready in 7–10 days."
    },
    metaTitle: {
      uz: "Jakkard lentalar - naqshli lentalar AKSAM, Namangan",
      ru: "Жаккардовые ленты - ленты с узором AKSAM, Наманган",
      en: "Jacquard Ribbons - Pattern Woven by AKSAM, Uzbekistan"
    },
    metaDesc: {
      uz: "Logotip va naqsh to'qilgan jakkard lentalar. Milliy liboslar, interyer va sovg'a bezaklari uchun. Namuna 7–10 kunda.",
      ru: "Жаккардовые ленты с тканым логотипом и узором. Для национальных костюмов, интерьера и подарков. Образец за 7–10 дней.",
      en: "Jacquard ribbons with woven logos and patterns. For traditional dress, interiors and gifts. Samples in 7–10 days."
    },
    highlights: {
      uz: ["Naqsh iplar bilan to'qiladi, o'chmaydi", "Logotip va monogramma to'qish imkoniyati", "Milliy ornamentlar katalogi", "Dizayn bo'yicha namuna 7–10 kunda"],
      ru: ["Узор ткётся нитями, не стирается", "Возможность ткать логотип и монограмму", "Каталог национальных орнаментов", "Образец по дизайну за 7–10 дней"],
      en: ["Pattern woven with threads, never fades", "Logo and monogram weaving available", "Catalogue of national ornaments", "Design samples in 7–10 days"]
    },
    specs: {"uz": [{"label": "Kenglik", "value": "15 – 70 mm"}, {"label": "Tarkibi", "value": "Polyester / viskoza (jakkard to'quvi)"}, {"label": "Naqsh", "value": "Logotip, monogramma, milliy ornament - iplar bilan to'qiladi"}, {"label": "Namuna", "value": "7 – 10 kunda tayyor"}, {"label": "Rulon uzunligi", "value": "50 m"}, {"label": "Minimal buyurtma", "value": "200 m dan"}, {"label": "Ishlab chiqarish muddati", "value": "10 – 20 ish kuni"}], "ru": [{"label": "Ширина", "value": "15 – 70 мм"}, {"label": "Состав", "value": "Полиэстер / вискоза (жаккардовое плетение)"}, {"label": "Узор", "value": "Логотип, монограмма, национальный орнамент - ткётся нитями"}, {"label": "Образец", "value": "готов за 7 – 10 дней"}, {"label": "Длина рулона", "value": "50 м"}, {"label": "Минимальный заказ", "value": "от 200 м"}, {"label": "Срок производства", "value": "10 – 20 рабочих дней"}], "en": [{"label": "Width", "value": "15 – 70 mm"}, {"label": "Composition", "value": "Polyester / viscose (jacquard weave)"}, {"label": "Pattern", "value": "Logo, monogram or national ornament - woven with threads"}, {"label": "Sample", "value": "ready in 7 – 10 days"}, {"label": "Roll length", "value": "50 m"}, {"label": "Minimum order", "value": "from 200 m"}, {"label": "Lead time", "value": "10 – 20 working days"}]},
    images: ["/images/p-jacquard.jpg", "/images/about-loom.jpg", "/images/cat-ribbons.jpg"],
    isActive: true,
    sortOrder: 3,
    createdAt: "2024-03-12T00:00:00.000Z",
    updatedAt: "2026-06-02T00:00:00.000Z"
  },
  {
    id: "pr-organza",
    slug: "organza-lentalar",
    category: { slug: "lentalar", name: DEMO_CATEGORIES[0].name },
    name: {
      uz: "Organza lentalar",
      ru: "Ленты из органзы",
      en: "Organza ribbons"
    },
    short: {
      uz: "Yengil, shaffof va havorang - gulchambar, to'y va dekor uchun nafis lentalar.",
      ru: "Лёгкие, прозрачные и воздушные - изящные ленты для флористики, свадеб и декора.",
      en: "Light, sheer and airy - delicate ribbons for floristry, weddings and decor."
    },
    description: {
      uz: "Shaffof organza tolasidan tayyorlangan lentalar - nihoyatda yengil va shakl berishga oson. Gulchambar, to'y dekoratsiyasi, parda va sovg'a bezaklarida nafis ko'rinish yaratadi. Qirralari termik ishlovdan o'tgan, turli kenglik va ranglarda mavjud.",
      ru: "Ленты из прозрачной органзы - необычайно лёгкие и податливые в драпировке. Создают изящный образ во флористике, свадебном декоре, оформлении штор и подарков. Кромки термически обработаны, доступны разные ширины и цвета.",
      en: "Ribbons made from sheer organza fibre - exceptionally light and easy to shape. They bring a delicate finish to floristry, wedding decor, curtains and gift styling. Edges are heat-sealed; available in various widths and colours."
    },
    metaTitle: {
      uz: "Organza lentalar - AKSAM ishlab chiqarishi, Namangan",
      ru: "Ленты из органзы - производство AKSAM, Наманган",
      en: "Organza Ribbons - Made by AKSAM, Uzbekistan"
    },
    metaDesc: {
      uz: "Yengil va shaffof organza lentalar: gulchambar, to'y va interyer dekoratsiyasi uchun. O'zbekistonda ishlab chiqariladi.",
      ru: "Лёгкие прозрачные ленты из органзы для флористики, свадеб и интерьера. Производство в Узбекистане.",
      en: "Light, sheer organza ribbons for floristry, weddings and interior decor. Made in Uzbekistan."
    },
    highlights: {
      uz: ["Shaffof, havorang to'qima", "Shakl berishga oson, burishmaydi", "Termik ishlovli qirralar", "To'y va tadbir bezaklari uchun qulay"],
      ru: ["Прозрачная воздушная фактура", "Легко драпируется, не мнётся", "Термически обработанные кромки", "Удобны для свадебного и event-декора"],
      en: ["Sheer, airy texture", "Easy to shape, crease-resistant", "Heat-sealed edges", "Convenient for wedding and event styling"]
    },
    specs: {"uz": [{"label": "Kenglik", "value": "5 – 50 mm"}, {"label": "Tarkibi", "value": "100% polyester (organza)"}, {"label": "Tuzilishi", "value": "Shaffof, havorang"}, {"label": "Rulon uzunligi", "value": "90 m"}, {"label": "Minimal buyurtma", "value": "100 rulondan"}, {"label": "Ishlab chiqarish muddati", "value": "5 – 15 ish kuni"}], "ru": [{"label": "Ширина", "value": "5 – 50 мм"}, {"label": "Состав", "value": "100% полиэстер (органза)"}, {"label": "Фактура", "value": "Прозрачная, воздушная"}, {"label": "Длина рулона", "value": "90 м"}, {"label": "Минимальный заказ", "value": "от 100 рулонов"}, {"label": "Срок производства", "value": "5 – 15 рабочих дней"}], "en": [{"label": "Width", "value": "5 – 50 mm"}, {"label": "Composition", "value": "100% polyester (organza)"}, {"label": "Texture", "value": "Sheer, airy"}, {"label": "Roll length", "value": "90 m"}, {"label": "Minimum order", "value": "from 100 rolls"}, {"label": "Lead time", "value": "5 – 15 working days"}]},
    images: ["/images/p-organza.jpg", "/images/cat-ribbons.jpg", "/images/hero-main.jpg"],
    isActive: true,
    sortOrder: 4,
    createdAt: "2024-03-12T00:00:00.000Z",
    updatedAt: "2026-06-02T00:00:00.000Z"
  },
  {
    id: "pr-individual",
    slug: "individual-buyurtma-lentalar",
    category: { slug: "lentalar", name: DEMO_CATEGORIES[0].name },
    name: {
      uz: "Individual buyurtma lentalar",
      ru: "Ленты по индивидуальному заказу",
      en: "Custom-made ribbons"
    },
    short: {
      uz: "Sizning o'lchamingiz, rangingiz va naqshingiz - loyihadan tayyor mahsulotgacha.",
      ru: "Ваш размер, цвет и узор - от эскиза до готового продукта.",
      en: "Your size, colour and pattern - from sketch to finished product."
    },
    description: {
      uz: "Standart katalogdan tashqari, AKSAM to'liq individual buyurtma asosida ham ishlaydi. O'lcham, rang, to'qima va naqsh - hammasi sizning texnik topshirig'ingiz bo'yicha. Texnologlarimiz maslahat beradi, namuna tayyorlab tasdiqlatasiz va shundan keyingina ommaviy ishlab chiqarish boshlanadi. Yevropa uskunalarida to'qilgan har bir partiya ISO standartlari bo'yicha nazorat qilinadi.",
      ru: "Помимо стандартного каталога, AKSAM работает полностью по индивидуальным заказам. Размер, цвет, фактура и узор - всё по вашему техническому заданию. Наши технологи проконсультируют, изготовят образец на утверждение, и только после этого начнётся серийное производство. Каждая партия, сотканная на европейском оборудовании, проходит контроль по стандартам ISO.",
      en: "Beyond the standard catalogue, AKSAM works fully to custom orders. Size, colour, texture and pattern - everything follows your technical brief. Our technologists will advise you, produce a sample for approval, and only then does serial production begin. Every batch woven on European equipment is inspected to ISO standards."
    },
    metaTitle: {
      uz: "Lentalar individual buyurtma - AKSAM, Namangan",
      ru: "Ленты по индивидуальному заказу - AKSAM, Наманган",
      en: "Custom-Made Ribbons - AKSAM, Uzbekistan"
    },
    metaDesc: {
      uz: "O'lcham, rang va naqsh bo'yicha individual lenta ishlab chiqarish. Namuna tayyorlash, Yevropa uskunalari, ISO nazorati.",
      ru: "Производство лент по индивидуальному заказу: размер, цвет, узор. Изготовление образцов, европейское оборудование, контроль ISO.",
      en: "Custom ribbon production by size, colour and pattern. Sample making, European equipment, ISO quality control."
    },
    highlights: {
      uz: ["Texnik topshiriq bo'yicha to'liq ishlab chiqarish", "Texnolog maslahati va namuna tayyorlash", "Yevropa to'quv uskunalari", "Har bir partiyada ISO sifat nazorati"],
      ru: ["Полное производство по техническому заданию", "Консультация технолога и изготовление образца", "Европейское ткацкое оборудование", "Контроль качества ISO в каждой партии"],
      en: ["Full production to your technical brief", "Technologist advice and sample making", "European weaving equipment", "ISO quality control on every batch"]
    },
    specs: {"uz": [{"label": "Kenglik", "value": "Texnik topshiriq bo'yicha"}, {"label": "Tarkibi", "value": "Buyurtma bo'yicha (polyester, paxta, viskoza)"}, {"label": "Rang", "value": "Pantone bo'yicha ixtiyoriy"}, {"label": "Namuna", "value": "Texnolog maslahati bilan 7 – 10 kunda"}, {"label": "Minimal buyurtma", "value": "Namunadan keyin kelishiladi"}, {"label": "Ishlab chiqarish muddati", "value": "Hajmga qarab 10 – 25 ish kuni"}], "ru": [{"label": "Ширина", "value": "по техническому заданию"}, {"label": "Состав", "value": "по заказу (полиэстер, хлопок, вискоза)"}, {"label": "Цвет", "value": "любой по Pantone"}, {"label": "Образец", "value": "за 7 – 10 дней с консультацией технолога"}, {"label": "Минимальный заказ", "value": "согласовывается после образца"}, {"label": "Срок производства", "value": "10 – 25 рабочих дней в зависимости от объёма"}], "en": [{"label": "Width", "value": "to your technical brief"}, {"label": "Composition", "value": "to order (polyester, cotton, viscose)"}, {"label": "Colour", "value": "any Pantone shade"}, {"label": "Sample", "value": "in 7 – 10 days with technologist advice"}, {"label": "Minimum order", "value": "agreed after sampling"}, {"label": "Lead time", "value": "10 – 25 working days depending on volume"}]},
    images: ["/images/about-loom.jpg", "/images/cat-ribbons.jpg", "/images/p-jacquard.jpg"],
    isActive: true,
    sortOrder: 5,
    createdAt: "2024-03-12T00:00:00.000Z",
    updatedAt: "2026-06-02T00:00:00.000Z"
  },
  {
    id: "pr-elastik-toqilgan",
    slug: "toqilgan-elastik-tasma",
    category: { slug: "elastik-tasmalar", name: DEMO_CATEGORIES[1].name },
    name: {
      uz: "To'qilgan elastik tasma",
      ru: "Тканая эластичная лента",
      en: "Woven elastic tape"
    },
    short: {
      uz: "Kiyim-kechak va sanoat uchun mustahkam, bo'ylama qovurg'ali elastik tasma.",
      ru: "Прочная эластичная лента с продольным рубчиком - для одежды и промышленности.",
      en: "Strong, longitudinally ribbed elastic tape for apparel and industry."
    },
    description: {
      uz: "Bo'ylama qovurg'ali to'qilgan elastik tasma - cho'zilishga chidamli, shaklini tez tiklaydi va chetlari yechilmaydi. Belbog', manjet va texnik maqsadlar uchun ideal. Kenglik, qattiqlik darajasi va rang bo'yicha sozlash mumkin. 2020-yildan beri O'zbekiston kiyim-kechak korxonalariga yetkazib beramiz.",
      ru: "Тканая эластичная лента с продольным рубчиком - устойчива к растяжению, быстро восстанавливает форму, края не осыпаются. Идеальна для поясов, манжет и технических задач. Настраивается по ширине, степени жёсткости и цвету. С 2020 года поставляем швейным предприятиям Узбекистана.",
      en: "Woven elastic tape with a longitudinal rib - stretch-resistant, recovers its shape quickly and the edges never fray. Ideal for waistbands, cuffs and technical applications. Customisable by width, firmness and colour. Supplying Uzbek garment manufacturers since 2020."
    },
    metaTitle: {
      uz: "To'qilgan elastik tasma - AKSAM ishlab chiqarishi, Namangan",
      ru: "Тканая эластичная лента - производство AKSAM, Наманган",
      en: "Woven Elastic Tape - Made by AKSAM, Uzbekistan"
    },
    metaDesc: {
      uz: "Kiyim-kechak va sanoat uchun mustahkam to'qilgan elastik tasmalar. Kenglik va qattiqlik sozlanadi, ommaviy partiyalar 5–20 kunda.",
      ru: "Прочные тканые эластичные ленты для одежды и промышленности. Настройка ширины и жёсткости, крупные партии за 5–20 дней.",
      en: "Durable woven elastic tapes for apparel and industry. Width and firmness adjustable, bulk orders in 5–20 days."
    },
    highlights: {
      uz: ["Cho'zilishga yuqori chidamlilik", "Yechilmaydigan mustahkam qirralar", "Kenglik va qattiqlik bo'yicha sozlash", "Kiyim-kechak korxonalari uchun ommaviy yetkazib berish"],
      ru: ["Высокая устойчивость к растяжению", "Прочные неосыпающиеся края", "Настройка по ширине и жёсткости", "Оптовые поставки швейным предприятиям"],
      en: ["High stretch resistance", "Strong, non-fraying edges", "Adjustable width and firmness", "Bulk supply for garment manufacturers"]
    },
    specs: {"uz": [{"label": "Kenglik", "value": "10 – 100 mm"}, {"label": "Tarkibi", "value": "Paxta / polyester + lateks yoki spandeks"}, {"label": "Qattiqlik", "value": "Yumshoq / o'rta / qattiq - sozlanadi"}, {"label": "Ranglar", "value": "30+ rang"}, {"label": "Rulon uzunligi", "value": "50 / 100 m"}, {"label": "Minimal buyurtma", "value": "100 rulondan"}, {"label": "Ishlab chiqarish muddati", "value": "5 – 20 ish kuni"}], "ru": [{"label": "Ширина", "value": "10 – 100 мм"}, {"label": "Состав", "value": "Хлопок / полиэстер + латекс или спандекс"}, {"label": "Жёсткость", "value": "Мягкая / средняя / жёсткая - настраивается"}, {"label": "Цвета", "value": "30+ цветов"}, {"label": "Длина рулона", "value": "50 / 100 м"}, {"label": "Минимальный заказ", "value": "от 100 рулонов"}, {"label": "Срок производства", "value": "5 – 20 рабочих дней"}], "en": [{"label": "Width", "value": "10 – 100 mm"}, {"label": "Composition", "value": "Cotton / polyester + latex or spandex"}, {"label": "Firmness", "value": "Soft / medium / firm - adjustable"}, {"label": "Colours", "value": "30+ colours"}, {"label": "Roll length", "value": "50 / 100 m"}, {"label": "Minimum order", "value": "from 100 rolls"}, {"label": "Lead time", "value": "5 – 20 working days"}]},
    images: ["/images/p-elastic-woven.jpg", "/images/cat-elastic.jpg", "/images/hero-main.jpg"],
    isActive: true,
    sortOrder: 1,
    createdAt: "2024-03-12T00:00:00.000Z",
    updatedAt: "2026-06-02T00:00:00.000Z"
  },
  {
    id: "pr-elastik-trikotaj",
    slug: "trikotaj-elastik-tasma",
    category: { slug: "elastik-tasmalar", name: DEMO_CATEGORIES[1].name },
    name: {
      uz: "Trikotaj elastik tasma",
      ru: "Трикотажная эластичная лента",
      en: "Knitted elastic tape"
    },
    short: {
      uz: "Yumshoq, teriga tegmaydigan - ichki kiyim va bolalar kiyimi uchun qulay tasma.",
      ru: "Мягкая, деликатная к коже - удобная лента для белья и детской одежды.",
      en: "Soft and skin-friendly - comfortable tape for underwear and children's wear."
    },
    description: {
      uz: "Trikotaj usulida to'qilgan elastik tasma - yumshoq, elastik va teriga mutlaqo qulay. Ichki kiyim, sport kiyimi, bolalar kiyimlari va uy tekstili uchun tavsiya etamiz. Cho'zilish darajasi va yumshoqligi buyurtma bo'yicha sozlanadi, rang kartasi keng.",
      ru: "Эластичная лента трикотажного плетения - мягкая, эластичная и комфортная для кожи. Рекомендуем для нижнего белья, спортивной и детской одежды, домашнего текстиля. Степень растяжения и мягкость настраиваются под заказ, широкая карта цветов.",
      en: "Knitted elastic tape - soft, stretchy and completely comfortable against the skin. Recommended for underwear, sportswear, children's clothing and home textiles. Stretch level and softness are adjusted to order, with a wide colour card."
    },
    metaTitle: {
      uz: "Trikotaj elastik tasma - AKSAM ishlab chiqarishi, Namangan",
      ru: "Трикотажная эластичная лента - производство AKSAM, Наманган",
      en: "Knitted Elastic Tape - Made by AKSAM, Uzbekistan"
    },
    metaDesc: {
      uz: "Yumshoq trikotaj elastik tasmalar: ichki kiyim, sport va bolalar kiyimi uchun. O'zbekistonda ishlab chiqariladi.",
      ru: "Мягкие трикотажные эластичные ленты для белья, спорта и детской одежды. Производство в Узбекистане.",
      en: "Soft knitted elastic tapes for underwear, sport and children's wear. Made in Uzbekistan."
    },
    highlights: {
      uz: ["Teriga qulay, yumshoq to'qima", "Yuqori elastiklik, shaklni tiklaydi", "Ichki kiyim va bolalar kiyimi uchun sertifikatlangan", "Keng rang kartasi"],
      ru: ["Мягкая фактура, комфортна для кожи", "Высокая эластичность, восстановление формы", "Сертифицирована для белья и детской одежды", "Широкая карта цветов"],
      en: ["Soft texture, comfortable on skin", "High elasticity with shape recovery", "Certified for underwear and children's wear", "Wide colour card"]
    },
    specs: {"uz": [{"label": "Kenglik", "value": "5 – 80 mm"}, {"label": "Tarkibi", "value": "Paxta / viskoza + spandeks (trikotaj to'quvi)"}, {"label": "Yumshoqlik", "value": "Teriga qulay, tikuv joylarida iz qoldirmaydi"}, {"label": "Ranglar", "value": "40+ rang"}, {"label": "Rulon uzunligi", "value": "50 m"}, {"label": "Minimal buyurtma", "value": "100 rulondan"}, {"label": "Ishlab chiqarish muddati", "value": "5 – 20 ish kuni"}], "ru": [{"label": "Ширина", "value": "5 – 80 мм"}, {"label": "Состав", "value": "Хлопок / вискоза + спандекс (трикотажное плетение)"}, {"label": "Мягкость", "value": "Комфортна для кожи, не оставляет следов на швах"}, {"label": "Цвета", "value": "40+ цветов"}, {"label": "Длина рулона", "value": "50 м"}, {"label": "Минимальный заказ", "value": "от 100 рулонов"}, {"label": "Срок производства", "value": "5 – 20 рабочих дней"}], "en": [{"label": "Width", "value": "5 – 80 mm"}, {"label": "Composition", "value": "Cotton / viscose + spandex (knitted)"}, {"label": "Softness", "value": "Comfortable on skin, leaves no seam marks"}, {"label": "Colours", "value": "40+ colours"}, {"label": "Roll length", "value": "50 m"}, {"label": "Minimum order", "value": "from 100 rolls"}, {"label": "Lead time", "value": "5 – 20 working days"}]},
    images: ["/images/p-knit-elastic.jpg", "/images/cat-elastic.jpg", "/images/hero-main.jpg"],
    isActive: true,
    sortOrder: 2,
    createdAt: "2024-03-12T00:00:00.000Z",
    updatedAt: "2026-06-02T00:00:00.000Z"
  },
  {
    id: "pr-yorliq-toqilgan",
    slug: "toqilgan-yorliqlar",
    category: { slug: "yorliqlar", name: DEMO_CATEGORIES[2].name },
    name: {
      uz: "To'qilgan yorliqlar",
      ru: "Тканые ярлыки",
      en: "Woven labels"
    },
    short: {
      uz: "Brendingiz uchun yumshoq, sifatli to'qilgan yorliqlar - yuvilganda ham o'zgarmaydi.",
      ru: "Мягкие качественные тканые ярлыки для вашего бренда - не меняются после стирок.",
      en: "Soft, quality woven labels for your brand - unchanged after repeated washing."
    },
    description: {
      uz: "Yumshoq ipdan to'qilgan brend yorliqlari - logotip va matn iplar bilan yoziladi, shuning uchun hech qachon o'chmaydi va yuvilganda buzilmaydi. Kiyim brendlari uchun ichki va tashqi yorliqlar, o'lcham va parvarish etiketkalarini tayyorlaymiz. Dizayn faylingiz asosida namuna 5–7 kunda tayyor bo'ladi.",
      ru: "Брендовые ярлыки из мягкой нити - логотип и текст вытканы нитями, поэтому не выцветают и не портятся после стирки. Изготавливаем внутренние и наружные ярлыки, размерные и уходовые этикетки для швейных брендов. Образец по вашему дизайн-файлу готов за 5–7 дней.",
      en: "Brand labels woven from soft thread - the logo and text are woven in, so they never fade or degrade in the wash. We make inside and outside labels, size tabs and care labels for apparel brands. A sample based on your design file is ready in 5–7 days."
    },
    metaTitle: {
      uz: "To'qilgan yorliqlar - brend etiketkalari AKSAM, Namangan",
      ru: "Тканые ярлыки - брендовые этикетки AKSAM, Наманган",
      en: "Woven Labels - Brand Tags by AKSAM, Uzbekistan"
    },
    metaDesc: {
      uz: "Logotip va matn iplar bilan to'qilgan brend yorliqlari. Namuna 5–7 kunda, ommaviy partiya 5–20 kunda. O'zbekistonda ishlab chiqariladi.",
      ru: "Брендовые ярлыки с тканым логотипом и текстом. Образец за 5–7 дней, партия за 5–20 дней. Производство в Узбекистане.",
      en: "Brand labels with woven logo and text. Samples in 5–7 days, batches in 5–20 days. Made in Uzbekistan."
    },
    highlights: {
      uz: ["Matn va logotip iplar bilan to'qiladi", "Yuvilganda o'zgarmaydi, o'chmaydi", "Dizayn bo'yicha namuna 5–7 kunda", "Kichik partiyalardan ommaviygacha"],
      ru: ["Текст и логотип вытканы нитями", "Не меняются после стирок, не выцветают", "Образец по дизайну за 5–7 дней", "От малых партий до массовых"],
      en: ["Text and logo woven with threads", "Unchanged by washing, never fades", "Design samples in 5–7 days", "From small runs to mass production"]
    },
    specs: {"uz": [{"label": "O'lchamlar", "value": "10 × 30 mm dan 60 × 90 mm gacha"}, {"label": "To'quv turlari", "value": "Damask, atlas, tafta"}, {"label": "Qirralar", "value": "Buklangan, kesilgan yoki laser"}, {"label": "Namuna", "value": "Dizayn fayli asosida 5 – 7 kunda"}, {"label": "Minimal buyurtma", "value": "1 000 donadan"}, {"label": "Ishlab chiqarish muddati", "value": "5 – 20 ish kuni"}], "ru": [{"label": "Размеры", "value": "от 10 × 30 мм до 60 × 90 мм"}, {"label": "Типы плетения", "value": "Дамаск, атлас, тафта"}, {"label": "Края", "value": "Сложенные, обрезные или лазерные"}, {"label": "Образец", "value": "по дизайн-файлу за 5 – 7 дней"}, {"label": "Минимальный заказ", "value": "от 1 000 штук"}, {"label": "Срок производства", "value": "5 – 20 рабочих дней"}], "en": [{"label": "Sizes", "value": "from 10 × 30 mm to 60 × 90 mm"}, {"label": "Weave types", "value": "Damask, satin, taffeta"}, {"label": "Edges", "value": "Folded, cut or laser"}, {"label": "Sample", "value": "from your design file in 5 – 7 days"}, {"label": "Minimum order", "value": "from 1,000 pieces"}, {"label": "Lead time", "value": "5 – 20 working days"}]},
    images: ["/images/p-woven-label.jpg", "/images/cat-labels.jpg", "/images/hero-main.jpg"],
    isActive: true,
    sortOrder: 1,
    createdAt: "2024-03-12T00:00:00.000Z",
    updatedAt: "2026-06-02T00:00:00.000Z"
  },
  {
    id: "pr-yorliq-osma",
    slug: "osma-yorliqlar",
    category: { slug: "yorliqlar", name: DEMO_CATEGORIES[2].name },
    name: {
      uz: "Osma yorliqlar",
      ru: "Навесные ярлыки",
      en: "Hang tags"
    },
    short: {
      uz: "Kraft qog'oz, paxta ipi va bosma dizayn - mahsulotingiz uchun yakuniy shtrix.",
      ru: "Крафтовая бумага, хлопковая нить и печатный дизайн - финальный штрих для изделия.",
      en: "Kraft paper, cotton twine and printed design - the finishing touch for your product."
    },
    description: {
      uz: "Osma yorliqlar mahsulotingizning birinchi taassurotini yaratadi. Kraft va dizayner qog'ozlarda, paxta ipi bilan, brend rangingizda bosamiz. Narx etiketi, o'lcham yorlig'i yoki sovg'a kartasi sifatida ishlatiladi. Dizayn xizmati ham mavjud: qisqa vaqt ichida maket tayyorlab beramiz.",
      ru: "Навесные ярлыки создают первое впечатление о вашем изделии. Печатаем на крафтовой и дизайнерской бумаге, с хлопковой нитью, в фирменных цветах бренда. Используются как ценник, размерный ярлык или подарочная карточка. Есть услуга дизайна: макет готовим в короткие сроки.",
      en: "Hang tags create the first impression of your product. Printed on kraft and designer papers with cotton twine in your brand colours. Used as price tags, size tags or gift cards. A design service is available - we prepare the layout quickly."
    },
    metaTitle: {
      uz: "Osma yorliqlar - kraft etiketkalar AKSAM, Namangan",
      ru: "Навесные ярлыки - крафтовые этикетки AKSAM, Наманган",
      en: "Hang Tags - Kraft Labels by AKSAM, Uzbekistan"
    },
    metaDesc: {
      uz: "Brend rangingizda kraft osma yorliqlar: narx etiketi, o'lcham yorlig'i, sovg'a kartasi. Dizayn xizmati bilan.",
      ru: "Крафтовые навесные ярлыки в фирменных цветах: ценники, размерники, подарочные карточки. С услугой дизайна.",
      en: "Kraft hang tags in your brand colours: price tags, size tags, gift cards. Design service included."
    },
    highlights: {
      uz: ["Kraft va dizayner qog'ozlar", "Paxta ipi, brend ranglari", "Bosma va o'yma imkoniyatlari", "Dizayn maketi tez tayyorlanadi"],
      ru: ["Крафтовая и дизайнерская бумага", "Хлопковая нить, фирменные цвета", "Печать и тиснение", "Быстрая подготовка дизайн-макета"],
      en: ["Kraft and designer papers", "Cotton twine, brand colours", "Print and embossing options", "Fast design layout turnaround"]
    },
    specs: {"uz": [{"label": "O'lchamlar", "value": "30 × 50 mm, 50 × 90 mm, 60 × 120 mm"}, {"label": "Qog'oz", "value": "Kraft 250 – 350 g/m², dizayner qog'ozlar"}, {"label": "Ip", "value": "Paxta ipi, brend rangida"}, {"label": "Chop", "value": "Raqamli bosma, folga, o'yma"}, {"label": "Minimal buyurtma", "value": "500 donadan"}, {"label": "Ishlab chiqarish muddati", "value": "5 – 10 ish kuni"}], "ru": [{"label": "Размеры", "value": "30 × 50 мм, 50 × 90 мм, 60 × 120 мм"}, {"label": "Бумага", "value": "Крафт 250 – 350 г/м², дизайнерская бумага"}, {"label": "Нить", "value": "Хлопковая нить в фирменном цвете"}, {"label": "Печать", "value": "Цифровая печать, фольга, тиснение"}, {"label": "Минимальный заказ", "value": "от 500 штук"}, {"label": "Срок производства", "value": "5 – 10 рабочих дней"}], "en": [{"label": "Sizes", "value": "30 × 50 mm, 50 × 90 mm, 60 × 120 mm"}, {"label": "Paper", "value": "Kraft 250 – 350 gsm, designer papers"}, {"label": "Twine", "value": "Cotton twine in your brand colour"}, {"label": "Print", "value": "Digital print, foil, embossing"}, {"label": "Minimum order", "value": "from 500 pieces"}, {"label": "Lead time", "value": "5 – 10 working days"}]},
    images: ["/images/p-hangtag.jpg", "/images/cat-labels.jpg", "/images/hero-main.jpg"],
    isActive: true,
    sortOrder: 2,
    createdAt: "2024-03-12T00:00:00.000Z",
    updatedAt: "2026-06-02T00:00:00.000Z"
  }
];

export const DEMO_SETTINGS: PublicSettingsDto = {
  siteName: "AKSAM",
  tagline: {
    uz: "Lentalar, elastik tasmalar va yorliqlar ishlab chiqaruvchisi",
    ru: "Производитель лент, эластичных лент и ярлыков",
    en: "Manufacturer of ribbons, elastic tapes and labels"
  },
  phone: "+998 91 183 80 08",
  phone2: "",
  email: "abdullaxodjayev@mail.ru",
  address: {
    uz: "Namangan viloyati, Namangan sh., Yangi Namangan tumani, Go'zal MFY, 5-o'tish yo'li, Go'zal ko'chasi, 3-uy",
    ru: "Наманганская область, г. Наманган, Янгчинаманганский район, махалля Гузаль, 5-й проезд, ул. Гузаль, дом 3",
    en: "Namangan region, Namangan city, Yangi Namangan district, Guzal neighbourhood, 5th passage, Guzal street, 3"
  },
  workHours: {
    uz: "Du–Shan:  08:00 - 19:00",
    ru: "Пн–Сб:  08:00 - 19:00",
    en: "Mon–Sat:  08:00 - 19:00"
  },
  mapLat: 41.0249587,
  mapLng: 71.557402,
  mapLabel: {
    uz: "NAM AKSAM TEXTILE MChJ - ishlab chiqarish",
    ru: "NAM AKSAM TEXTILE - производство",
    en: "NAM AKSAM TEXTILE - production"
  },
  instagram: "https://www.instagram.com/aksametiket/",
  telegram: "https://t.me/namaksam",
  facebook: "https://www.facebook.com/people/AKSAM-Labels-and-Accessories/100083607540935/?sk=about"
};

export const DEMO_PRODUCTS_BY_SLUG = new Map(DEMO_PRODUCTS.map((p) => [p.slug, p]));
export const DEMO_CATEGORIES_BY_SLUG = new Map(DEMO_CATEGORIES.map((c) => [c.slug, c]));
