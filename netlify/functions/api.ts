import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

// Default mock/fallback data for Netlify Serverless execution
const COURSES = [
  {
    id: 'english-cefr',
    title: "Ingliz tili / CEFR",
    category: "Chet tili",
    price: 200000,
    pricePeriod: "oyiga",
    description: "Ingliz tilini noldan C1 darajagacha o'rganish, CEFR va IELTS imtihonlariga tizimli tayyorgarlik. Grammatika, so'z boyligi, listening va speaking darslari.",
    features: [
      "Haftada 3 kun, 2 soatdan to'liq amaliy darslar",
      "Speaking club va munozara darslari bepul",
      "C1 darajadagi malakali o'qituvchidan individual nazorat",
      "Haftalik mock testlar va progress tahlili",
      "Maxsus konspektlar va audio materiallar bilan ta'minlash"
    ],
    badge: "Eng ommabop",
    duration: "3 - 6 oy",
    active: true,
    schedule: "Dushanba, Chorshanba, Juma"
  },
  {
    id: 'history',
    title: "Tarix",
    category: "Gumanitar fan",
    price: 200000,
    pricePeriod: "oyiga",
    description: "O'zbekiston tarixi va Jahon tarixi fanlaridan DTM va oliy ta'lim muassasalariga kirish imtihonlariga chuqurlashtirilgan intensiv tayyorgarlik.",
    features: [
      "Haftada 3 kun, 2 soatdan darslar",
      "Yillik xronologiya va voqealarni yodda saqlash mnemonikasi",
      "DTM standartidagi minglab blok testlar tahlili",
      "Mavzulashtirilgan konspektlar va xaritalar bilan ishlash",
      "Oylik sinov imtihonlari va reyting tizimi"
    ],
    badge: "DTM / Imtihon",
    duration: "6 - 9 oy",
    active: true,
    schedule: "Seshanba, Payshanba, Shanba"
  }
];

const TEACHER = {
  id: 'diyorbek-mirzaolimov',
  name: "Diyorbek Mirzaolimov",
  role: "Ingliz tili va CEFR bosh mutaxassisi",
  level: "C1 Certified Instructor",
  experience: "Ko'p yillik amaliy pedagogik tajriba",
  telegramUsername: "diyorbek_mirzaolim0v",
  telegramUrl: "https://t.me/diyorbek_mirzaolim0v",
  bio: "IELTS va CEFR imtihonlariga o'quvchilarni tizimli tayyorlash bo'yicha katta tajribaga ega mutaxassis. Darslarda zamonaviy interaktiv metodika, individual coaching va real natijaga yo'naltirilgan intensiv yondashuv qo'llaniladi.",
  achievements: [
    "CEFR C1 xalqaro daraja sertifikati",
    "O'nlab o'quvchilari CEFR B2 va C1 sertifikatlarini qo'lga kiritgan",
    "Maxsus speaking va listening metodikasi muallifi",
    "IELTS Camp o'quv markazi asoschisi va bosh o'qituvchisi"
  ],
  phone: "+998 90 000 00 00",
  location: "Jizzax viloyati, Zomin tumani, Yom qishlog'i"
};

const SETTINGS = {
  centerName: "IELTS Camp",
  address: "Yom qishlog'i",
  district: "Zomin tumani",
  region: "Jizzax viloyati",
  telegramUsername: "diyorbek_mirzaolim0v",
  telegramUrl: "https://t.me/diyorbek_mirzaolim0v",
  phonePrimary: "+998 90 000 00 00",
  workingHours: "08:00 – 19:00 (Dushanba – Shanba)"
};

export const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  const path = event.path.replace(/\/\.netlify\/functions\/api/, '').replace(/^\/api/, '');
  const method = event.httpMethod;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  };

  if (method === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    if (path === '/courses' && method === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ courses: COURSES })
      };
    }

    if (path === '/teachers' && method === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ teacher: TEACHER })
      };
    }

    if (path === '/settings' && method === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ settings: SETTINGS })
      };
    }

    if (path === '/applications' && method === 'POST') {
      const data = JSON.parse(event.body || '{}');
      if (!data.fullName || !data.phone || !data.courseId) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "Ism, telefon va kurs maydonlari to'ldirilishi shart." })
        };
      }

      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const newApp = {
        id: `IC-2026-${randomSuffix}`,
        fullName: data.fullName,
        phone: data.phone,
        courseId: data.courseId,
        courseTitle: data.courseId === 'history' ? 'Tarix' : 'Ingliz tili / CEFR',
        gradeOrAge: data.gradeOrAge || 'Katta yoshdagilar',
        notes: data.notes || '',
        status: 'yangi',
        createdAt: new Date().toISOString()
      };

      // If Supabase is configured in environment, insert into Supabase
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey) {
        try {
          await fetch(`${supabaseUrl}/rest/v1/applications`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
              id: newApp.id,
              full_name: newApp.fullName,
              phone: newApp.phone,
              course_id: newApp.courseId,
              course_title: newApp.courseTitle,
              grade_or_age: newApp.gradeOrAge,
              notes: newApp.notes,
              status: newApp.status
            })
          });
        } catch (sbErr) {
          console.error('Supabase write error:', sbErr);
        }
      }

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          message: "Arizangiz muvaffaqiyatli qabul qilindi!",
          application: newApp
        })
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: "Endpoint topilmadi" })
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message || "Server xatosi" })
    };
  }
};
