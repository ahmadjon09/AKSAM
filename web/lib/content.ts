// Structured site content (arrays of objects). i18next treats array values
// as plural forms, so lists like stats, steps or testimonials live here as
// typed constants instead of inside the JSON dictionaries.

import type { Lang } from "./types";

export interface Stat {
  value: string;
  label: string;
}

export interface Step {
  title: string;
  text: string;
}

export interface Quote {
  text: string;
  name: string;
  company: string;
}

export interface ValueItem {
  title: string;
  text: string;
}

export interface TeamMember {
  name: string;
  role: string;
  desc: string;
}

export interface HowItem {
  title: string;
  text: string;
}

export function localized<T>(obj: Record<Lang, T>, lang: Lang): T {
  return obj[lang] ?? obj.uz;
}

export const HERO_STATS: Record<Lang, Stat[]> = {
  uz: [
    { value: "6+", label: "yillik tajriba" },
    { value: "1200+", label: "bajarilgan buyurtma" },
    { value: "46+", label: "doimiy mijoz" },
    { value: "99.8%", label: "sifat kafolati" }
  ],
  ru: [
    { value: "6+", label: "лет опыта" },
    { value: "1200+", label: "выполненных заказов" },
    { value: "46+", label: "постоянных клиентов" },
    { value: "99.8%", label: "гарантия качества" }
  ],
  en: [
    { value: "6+", label: "years of experience" },
    { value: "1200+", label: "orders completed" },
    { value: "46+", label: "regular clients" },
    { value: "99.8%", label: "quality guarantee" }
  ]
};

export const MARQUEE_ITEMS: Record<Lang, string[]> = {
  uz: ["Lentalar", "Elastik tasmalar", "Yorliqlar va etiketkalar", "ISO sifat nazorati", "5–20 ish kuni", "Butun O'zbekiston bo'ylab yetkazib berish"],
  ru: ["Ленты", "Эластичные ленты", "Ярлыки и этикетки", "Контроль качества ISO", "5–20 рабочих дней", "Доставка по всему Узбекистану"],
  en: ["Ribbons", "Elastic tapes", "Labels and tags", "ISO quality control", "5–20 working days", "Delivery across Uzbekistan"]
};

export const PROCESS_STEPS: Record<Lang, Step[]> = {
  uz: [
    { title: "Ariza / Bog'lanish", text: "Telefon, Telegram yoki veb-sayt orqali murojaat qiling" },
    { title: "Talabni aniqlash", text: "Mahsulot turi, o'lcham, rang va miqdor birgalikda kelishiladi" },
    { title: "Namuna va dizayn", text: "Namuna tayyorlab taqdim etamiz va birgalikda tasdiqlaymiz" },
    { title: "Ishlab chiqarish", text: "Zamonaviy Yevropa jihozlarida sifatli ishlab chiqarish va yetkazib berish" }
  ],
  ru: [
    { title: "Заявка / Связь", text: "Свяжитесь с нами по телефону, в Telegram или через сайт" },
    { title: "Уточнение требований", text: "Согласуем тип продукции, размер, цвет и количество" },
    { title: "Образец и дизайн", text: "Подготовим образец, покажем вам и вместе утвердим" },
    { title: "Производство", text: "Качественное производство и доставка на современном европейском оборудовании" }
  ],
  en: [
    { title: "Enquiry / Contact", text: "Reach us by phone, Telegram or through the website" },
    { title: "Requirements", text: "We agree on product type, size, colour and quantity" },
    { title: "Sample and design", text: "We prepare a sample, show it to you and approve it together" },
    { title: "Production", text: "Quality manufacturing and delivery on modern European equipment" }
  ]
};

export const CRAFT_ITEMS: Record<Lang, Step[]> = {
  uz: [
    { title: "Yevropa uskunalari", text: "To'quv va ishlov berish jarayonlari zamonaviy Yevropa dastgohlarida bajariladi" },
    { title: "ISO sifat nazorati", text: "Xomashyodan tayyor mahsulotgacha har bir bosqich tekshiruvdan o'tadi" },
    { title: "Aniq muddatlar", text: "Buyurtma hajmiga qarab 5–20 ish kuni ichida ishlab chiqaramiz" },
    { title: "Butun O'zbekiston", text: "Namangandan respublikaning istalgan hududiga yetkazib beramiz" }
  ],
  ru: [
    { title: "Европейское оборудование", text: "Ткачество и обработка выполняются на современных европейских станках" },
    { title: "Контроль качества ISO", text: "Каждый этап — от сырья до готового изделия — проходит проверку" },
    { title: "Точные сроки", text: "Производим за 5–20 рабочих дней в зависимости от объёма заказа" },
    { title: "Весь Узбекистан", text: "Доставляем из Намангана в любой регион республики" }
  ],
  en: [
    { title: "European equipment", text: "Weaving and finishing are performed on modern European machinery" },
    { title: "ISO quality control", text: "Every stage, from raw material to finished product, is inspected" },
    { title: "Exact lead times", text: "Production within 5–20 working days depending on order volume" },
    { title: "All of Uzbekistan", text: "Delivery from Namangan to any region of the country" }
  ]
};

export const TESTIMONIALS: Record<Lang, Quote[]> = {
  uz: [
    { text: "AKSAM bilan 3 yildan ortiq hamkorlik qilamiz. Sifat va muddatlarni hech qachon buzishmagan.", name: "Shavkat Nurmatov", company: "TexnoTextile MChJ" },
    { text: "Elastik tasmalar va yorliqlar buyurtmasini professional darajada tayyorlashdi. Juda mamnunmiz.", name: "Madina Akbarova", company: "Elegant Fashion" },
    { text: "Katta hajmdagi buyurtmalarni ham qisqa muddatda va yuqori sifatda yetkazib berishadi.", name: "Rustam Xolmatov", company: "UzTextile Group" }
  ],
  ru: [
    { text: "Сотрудничаем с AKSAM более 3 лет. Качество и сроки не подводили ни разу.", name: "Шавкат Нурматов", company: "TexnoTextile MChJ" },
    { text: "Заказ на эластичные ленты и ярлыки выполнили на профессиональном уровне. Очень довольны.", name: "Мадина Акбарова", company: "Elegant Fashion" },
    { text: "Даже крупные объёмы доставляют в короткие сроки и с высоким качеством.", name: "Рустам Холматов", company: "UzTextile Group" }
  ],
  en: [
    { text: "We have worked with AKSAM for over three years. They have never missed a deadline or a quality bar.", name: "Shavkat Nurmatov", company: "TexnoTextile LLC" },
    { text: "Our order of elastic tapes and labels was completed to a professional standard. Very satisfied.", name: "Madina Akbarova", company: "Elegant Fashion" },
    { text: "Even large volumes are delivered quickly and to a high standard.", name: "Rustam Kholmatov", company: "UzTextile Group" }
  ]
};

export const ABOUT_VALUES: Record<Lang, ValueItem[]> = {
  uz: [
    { title: "Sifat", text: "Har bir metrda — ISO nazorati va halol xomashyo" },
    { title: "Aniqlik", text: "Kelishilgan muddat — qat'iy bajariladigan va'da" },
    { title: "Hamkorlik", text: "Kichik ustaxonadan yirik fabrikagacha — har bir mijoz muhim" },
    { title: "Mas'uliyat", text: "Ishlab chiqarishdan yetkazib berishgacha to'liq javobgarlik" }
  ],
  ru: [
    { title: "Качество", text: "В каждом метре — контроль ISO и честное сырьё" },
    { title: "Точность", text: "Согласованный срок — обязательство, которое мы выполняем" },
    { title: "Партнёрство", text: "От небольшой мастерской до крупной фабрики — важен каждый клиент" },
    { title: "Ответственность", text: "Полная ответственность от производства до доставки" }
  ],
  en: [
    { title: "Quality", text: "ISO inspection and honest raw materials in every metre" },
    { title: "Precision", text: "An agreed deadline is a commitment we keep" },
    { title: "Partnership", text: "From a small workshop to a large factory — every client matters" },
    { title: "Responsibility", text: "Full accountability from production to delivery" }
  ]
};

export const TEAM: Record<Lang, TeamMember[]> = {
  uz: [
    { name: "Alisher Karimov", role: "Direktor / Asoschi", desc: "Umumiy boshqaruv va strategiya" },
    { name: "Dilshod Rahimov", role: "Ishlab chiqarish bo'limi boshlig'i", desc: "Texnologik jarayonlar nazorati" },
    { name: "Nilufar Azimova", role: "Sifat nazorati bo'limi", desc: "Mahsulot sifati va standartlar" }
  ],
  ru: [
    { name: "Алишер Каримов", role: "Директор / Основатель", desc: "Общее управление и стратегия" },
    { name: "Дилшод Рахимов", role: "Начальник производства", desc: "Контроль технологических процессов" },
    { name: "Нилуфар Азимова", role: "Отдел контроля качества", desc: "Качество продукции и стандарты" }
  ],
  en: [
    { name: "Alisher Karimov", role: "Director / Founder", desc: "Overall management and strategy" },
    { name: "Dilshod Rahimov", role: "Head of production", desc: "Control of manufacturing processes" },
    { name: "Nilufar Azimova", role: "Quality control", desc: "Product quality and standards" }
  ]
};

export const REGIONS: Record<Lang, string[]> = {
  uz: ["Toshkent", "Namangan", "Andijon", "Farg'ona", "Samarqand", "Buxoro", "Qashqadaryo", "Surxondaryo", "Xorazm", "Qoraqalpog'iston"],
  ru: ["Ташкент", "Наманган", "Андижан", "Фергана", "Самарканд", "Бухара", "Кашкадарья", "Сурхандарья", "Хорезм", "Каракалпакстан"],
  en: ["Tashkent", "Namangan", "Andijan", "Fergana", "Samarkand", "Bukhara", "Kashkadarya", "Surkhandarya", "Khorezm", "Karakalpakstan"]
};

export const HOW_ITEMS: Record<Lang, HowItem[]> = {
  uz: [
    { title: "Mashinada", text: "Namangan shahri, Yangi Namangan tumani, Go'zal ko'chasi — «Orzu» kichik sanoat zonasi" },
    { title: "Telefon orqali", text: "Qo'ng'iroq qiling — manzilni xarita havolasi bilan jo'natamiz" },
    { title: "Telegram orqali", text: "Yozing — geolokatsiyani darhol jo'natamiz" }
  ],
  ru: [
    { title: "На машине", text: "г. Наманган, Янгчинаманганский район, улица Гузаль — малая промышленная зона «Орзу»" },
    { title: "По телефону", text: "Позвоните — отправим адрес со ссылкой на карту" },
    { title: "В Telegram", text: "Напишите — сразу отправим геолокацию" }
  ],
  en: [
    { title: "By car", text: "Namangan city, Yangi Namangan district, Guzal street — the Orzu small industrial zone" },
    { title: "By phone", text: "Call us — we will send the address with a map link" },
    { title: "On Telegram", text: "Write to us — we will send the location right away" }
  ]
};

export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ_ITEMS: Record<Lang, FaqItem[]> = {
  uz: [
    { q: "Minimal buyurtma hajmi qancha?", a: "Lentalar va elastik tasmalar — 100 rulondan, to'qilgan yorliqlar — 1 000 donadan, osma yorliqlar — 500 donadan. Kichik sinov partiyalari uchun individual shartlar taklif qilamiz." },
    { q: "Buyurtma qancha vaqtda tayyor bo'ladi?", a: "Ommaviy partiyalar odatda 5–20 ish kunida tayyor bo'ladi. Dizayn talab qiladigan buyurtmalar (jakkard, yorliqlar) uchun namuna tayyorlashga 5–10 kun qo'shiladi." },
    { q: "O'zimning rangimda buyurtma qila olamanmi?", a: "Albatta. Pantone katalogi bo'yicha istalgan rangda bo'yaymiz, kerak bo'lsa namunaviy bo'yash ham qilamiz. Rang mosligi laboratoriya uskunasida tekshiriladi." },
    { q: "Namunani qanday olish mumkin?", a: "Saytdagi forma, telefon yoki Telegram orqali ariza qoldiring — texnologimiz talablarni aniqlab, namunani 5–10 kunda tayyorlab beradi." },
    { q: "Yetkazib berish qanday tashkil qilingan?", a: "Buyurtmalarni O'zbekistonning barcha viloyatlariga logistika hamkorlarimiz orqali yetkazamiz. Yirik partiyalar uchun yetkazib berish shartlari individual kelishiladi." },
    { q: "Narxlar qanday shakllanadi?", a: "Narx mahsulot turi, kenglik, ranglar soni va partiya hajmiga qarab individual hisoblanadi. Ariza qoldiring — 1 ish kuni ichida batafsil taklif yuboramiz." }
  ],
  ru: [
    { q: "Какой минимальный объём заказа?", a: "Ленты и эластичные ленты — от 100 рулонов, тканые ярлыки — от 1 000 штук, навесные ярлыки — от 500 штук. Для небольших пробных партий предложим индивидуальные условия." },
    { q: "Сколько времени занимает заказ?", a: "Крупные партии обычно готовы за 5–20 рабочих дней. Для заказов с дизайном (жаккард, ярлыки) добавляется 5–10 дней на изготовление образца." },
    { q: "Можно ли заказать в своём цвете?", a: "Конечно. Окрашиваем в любой цвет по каталогу Pantone, при необходимости сделаем пробную окраску. Соответствие цвета проверяется на лабораторном оборудовании." },
    { q: "Как получить образец?", a: "Оставьте заявку через форму на сайте, по телефону или в Telegram — наш технолог уточнит требования и подготовит образец за 5–10 дней." },
    { q: "Как организована доставка?", a: "Доставляем заказы во все регионы Узбекистана через логистических партнёров. Условия доставки крупных партий согласовываются индивидуально." },
    { q: "Как формируются цены?", a: "Цена рассчитывается индивидуально в зависимости от типа продукции, ширины, количества цветов и объёма партии. Оставьте заявку — отправим подробное предложение в течение 1 рабочего дня." }
  ],
  en: [
    { q: "What is the minimum order quantity?", a: "Ribbons and elastic tapes — from 100 rolls, woven labels — from 1,000 pieces, hang tags — from 500 pieces. We offer individual terms for small trial batches." },
    { q: "How long does an order take?", a: "Bulk batches are usually ready in 5–20 working days. Design-based orders (jacquard, labels) add 5–10 days for sample making." },
    { q: "Can I order in my own colour?", a: "Of course. We dye in any Pantone shade and can run a trial dyeing if needed. Colour matching is verified on laboratory equipment." },
    { q: "How can I get a sample?", a: "Leave a request through the website form, by phone or on Telegram — our technologist will clarify the requirements and prepare a sample in 5–10 days." },
    { q: "How is delivery organised?", a: "We deliver orders to every region of Uzbekistan through our logistics partners. Delivery terms for large volumes are agreed individually." },
    { q: "How are prices calculated?", a: "Pricing is individual, based on product type, width, number of colours and batch size. Leave a request and we will send a detailed quote within 1 working day." }
  ]
};

export interface GalleryItem {
  src: string;
  caption: string;
}

export const GALLERY_ITEMS: Record<Lang, GalleryItem[]> = {
  uz: [
    { src: "/images/about-loom.jpg", caption: "Jakkard to'quv dastgohlari" },
    { src: "/images/hero-main.jpg", caption: "Lenta partiyalari tayyor" },
    { src: "/images/cat-ribbons.jpg", caption: "Atlas lentalar kolleksiyasi" },
    { src: "/images/cat-elastic.jpg", caption: "Elastik tasmalar" },
    { src: "/images/cat-labels.jpg", caption: "Brend yorliqlari" },
    { src: "/images/p-hangtag.jpg", caption: "Osma yorliqlar va qadoqlash" }
  ],
  ru: [
    { src: "/images/about-loom.jpg", caption: "Жаккардовые ткацкие станки" },
    { src: "/images/hero-main.jpg", caption: "Готовые партии лент" },
    { src: "/images/cat-ribbons.jpg", caption: "Коллекция атласных лент" },
    { src: "/images/cat-elastic.jpg", caption: "Эластичные ленты" },
    { src: "/images/cat-labels.jpg", caption: "Брендовые ярлыки" },
    { src: "/images/p-hangtag.jpg", caption: "Навесные ярлыки и упаковка" }
  ],
  en: [
    { src: "/images/about-loom.jpg", caption: "Jacquard weaving looms" },
    { src: "/images/hero-main.jpg", caption: "Finished ribbon batches" },
    { src: "/images/cat-ribbons.jpg", caption: "Satin ribbon collection" },
    { src: "/images/cat-elastic.jpg", caption: "Elastic tapes" },
    { src: "/images/cat-labels.jpg", caption: "Brand labels" },
    { src: "/images/p-hangtag.jpg", caption: "Hang tags and packaging" }
  ]
};

export interface TermsSection {
  title: string;
  text: string;
}

export const TERMS_SECTIONS: Record<Lang, TermsSection[]> = {
  uz: [
    { title: "Umumiy qoidalar", text: "Ushbu shartlar AKSAM veb-saytidan foydalanish va AKSAM orqali buyurtma berish tartibini belgilaydi. Saytdan foydalanish yoki ariza qoldirish orqali siz ushbu shartlarga rozilik bildirasiz. Shartlar o'zgartirilishi mumkin; joriy tahrir har doim shu sahifada e'lon qilinadi." },
    { title: "Mahsulotlar haqidagi ma'lumotlar", text: "Saytdagi tavsiflar, rasmlar va texnik ko'rsatkichlar namuna sifatida taqdim etiladi. Tabiiy xomashyo va bo'yash jarayoni sababli rang va to'qima ishlab chiqarish partiyasiga qarab biroz farq qilishi mumkin. Aniq talablar har bir buyurtma uchun texnik topshiriqda qayd etiladi." },
    { title: "Buyurtma berish tartibi", text: "Buyurtma saytdagi forma (ism va telefon raqami), telefon yoki Telegram orqali qabul qilinadi. Mutaxassisimiz siz bilan bog'lanib, mahsulot turi, o'lcham, rang va miqdorni kelishadi. Dizayn talab qiladigan buyurtmalar uchun namuna tayyorlanadi va faqat siz tasdiqlaganingizdan keyin ommaviy ishlab chiqarish boshlanadi." },
    { title: "Narxlar va to'lov", text: "Saytda narxlar ko'rsatilmaydi: har bir buyurtma uchun narx mahsulot turi, kenglik, ranglar soni va partiya hajmiga qarab individual hisoblanadi. To'lov shartlari (oldindan to'lov miqdori, muddatlari) buyurtmani tasdiqlash bosqichida yozma ravishda kelishiladi." },
    { title: "Ishlab chiqarish muddatlari", text: "Standart partiyalar odatda 5–20 ish kunida ishlab chiqariladi. Dizayn va namuna bosqichini talab qiladigan buyurtmalarga qo'shimcha 5–10 kun kiradi. Fors-major holatlarida muddatlar o'zgarishi mumkin — bu haqda mijoz darhol xabardor qilinadi." },
    { title: "Yetkazib berish", text: "Buyurtmalar O'zbekistonning barcha viloyatlariga logistika hamkorlarimiz orqali yetkaziladi. Mahsulot qabul qilingan paytdan boshlab unga egalik huquqi va javobgarlik mijozga o'tadi. Qabul paytida partiyani tekshirib olish tavsiya etiladi." },
    { title: "Intellektual mulk", text: "Mijoz taqdim etgan logotip, dizayn va matnlar bo'yicha huquqlar mijozga tegishli va ular faqat buyurtmani bajarish uchun ishlatiladi. Saytdagi matnlar, rasmlar va AKSAM savdo belgisi himoyalangan; yozma ruxsatsiz nusxalash taqiqlanadi." },
    { title: "Maxfiylik", text: "Ariza orqali qoldirilgan shaxsiy ma'lumotlar (ism, telefon raqami) faqat buyurtmani qayta ishlash va siz bilan bog'lanish uchun ishlatiladi. Ma'lumotlar uchinchi shaxslarga berilmaydi va sotilmaydi." },
    { title: "Javobgarlik cheklovi", text: "AKSAM saytdagi ma'lumotlarning aniqligini ta'minlashga harakat qiladi, biroq texnik uzilishlar yoki ma'lumotlarning yangilanib turishi bo'yicha kafolat bermaydi. Saytdan foydalanish natijasida yuzaga kelishi mumkin bo'lgan bilvosita zararlar uchun AKSAM qonun doirasida javobgar bo'ladi." },
    { title: "Nizolarni hal qilish", text: "Ushbu shartlar O'zbekiston Respublikasi qonunchiligi bilan tartibga solinadi. Yuzaga keladigan nizolar dastlab muzokaralar yo'li bilan hal qilinadi; kelishuvga erishilmaganda O'zbekiston Respublikasi sudlari vakolatli hisoblanadi." }
  ],
  ru: [
    { title: "Общие положения", text: "Настоящие условия определяют порядок использования сайта AKSAM и размещения заказов. Используя сайт или оставляя заявку, вы соглашаетесь с этими условиями. Условия могут изменяться; актуальная редакция всегда публикуется на этой странице." },
    { title: "Информация о продукции", text: "Описания, изображения и технические характеристики на сайте носят ознакомительный характер. Из-за натурального сырья и процесса окраски цвет и фактура могут незначительно отличаться от партии к партии. Точные требования фиксируются в техническом задании для каждого заказа." },
    { title: "Порядок оформления заказа", text: "Заказы принимаются через форму на сайте (имя и номер телефона), по телефону или в Telegram. Наш специалист свяжется с вами и согласует тип продукции, размер, цвет и количество. Для заказов с дизайном изготавливается образец, и серийное производство начинается только после вашего утверждения." },
    { title: "Цены и оплата", text: "Цены на сайте не указываются: стоимость каждого заказа рассчитывается индивидуально в зависимости от типа продукции, ширины, количества цветов и объёма партии. Условия оплаты (размер предоплаты, сроки) согласовываются письменно на этапе подтверждения заказа." },
    { title: "Сроки производства", text: "Стандартные партии обычно изготавливаются за 5–20 рабочих дней. Заказы, требующие этапа дизайна и образца, включают дополнительно 5–10 дней. В случае форс-мажорных обстоятельств сроки могут измениться — клиент незамедлительно уведомляется." },
    { title: "Доставка", text: "Заказы доставляются во все регионы Узбекистана через наших логистических партнёров. Право собственности и ответственность переходят к клиенту с момента приёмки продукции. Рекомендуем проверять партию при получении." },
    { title: "Интеллектуальная собственность", text: "Права на предоставленные клиентом логотипы, дизайн и тексты принадлежат клиенту и используются только для выполнения заказа. Тексты, изображения и товарный знак AKSAM на сайте защищены; копирование без письменного разрешения запрещено." },
    { title: "Конфиденциальность", text: "Персональные данные, оставленные в заявке (имя, номер телефона), используются только для обработки заказа и связи с вами. Данные не передаются и не продаются третьим лицам." },
    { title: "Ограничение ответственности", text: "AKSAM стремится к точности информации на сайте, но не гарантирует отсутствие технических сбоев или своевременность обновлений. Ответственность AKSAM за возможные косвенные убытки ограничена рамками законодательства." },
    { title: "Разрешение споров", text: "Настоящие условия регулируются законодательством Республики Узбекистан. Споры разрешаются путём переговоров; при отсутствии соглашения компетентны суды Республики Узбекистан." }
  ],
  en: [
    { title: "General provisions", text: "These terms govern the use of the AKSAM website and the ordering process. By using the site or submitting a request you agree to these terms. The terms may be updated; the current version is always published on this page." },
    { title: "Product information", text: "Descriptions, images and technical specifications on the site are provided for reference. Due to natural raw materials and the dyeing process, colour and texture may vary slightly between production batches. Exact requirements are recorded in a technical brief for every order." },
    { title: "How orders work", text: "Orders are accepted through the website form (name and phone number), by phone or on Telegram. Our specialist will contact you to agree on the product type, size, colour and quantity. Design-based orders include a sample stage, and bulk production starts only after your approval." },
    { title: "Prices and payment", text: "Prices are not shown on the site: the cost of every order is calculated individually based on product type, width, number of colours and batch size. Payment terms (prepayment amount, schedule) are agreed in writing at the order confirmation stage." },
    { title: "Production lead times", text: "Standard batches are usually produced within 5–20 working days. Orders requiring a design and sampling stage add 5–10 days. In force-majeure circumstances lead times may change and the client is notified immediately." },
    { title: "Delivery", text: "Orders are delivered to every region of Uzbekistan through our logistics partners. Ownership and responsibility pass to the client upon acceptance of the goods. We recommend checking the batch on receipt." },
    { title: "Intellectual property", text: "Rights to logos, designs and texts provided by the client belong to the client and are used solely to fulfil the order. The texts, images and the AKSAM trademark on this site are protected; copying without written permission is prohibited." },
    { title: "Privacy", text: "Personal data submitted in a request (name, phone number) is used only to process the order and contact you. Data is never shared with or sold to third parties." },
    { title: "Limitation of liability", text: "AKSAM strives to keep the information on the site accurate but does not guarantee the absence of technical outages or the timeliness of updates. AKSAM's liability for possible indirect damages is limited within the bounds of the law." },
    { title: "Dispute resolution", text: "These terms are governed by the laws of the Republic of Uzbekistan. Disputes are resolved through negotiation first; failing agreement, the courts of the Republic of Uzbekistan have jurisdiction." }
  ]
};
