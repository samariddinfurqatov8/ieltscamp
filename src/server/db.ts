import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export type ApplicationStatus = 'yangi' | 'boglanildi' | 'qabul_qilindi' | 'rad_etildi';

export interface Application {
  id: string;
  fullName: string;
  phone: string;
  courseId: string;
  courseTitle: string;
  gradeOrAge: string;
  notes?: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  adminComment?: string;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  price: number;
  pricePeriod: string;
  description: string;
  features: string[];
  badge?: string;
  duration: string;
  active: boolean;
  schedule?: string;
}

export interface Teacher {
  id: string;
  name: string;
  role: string;
  level: string;
  experience: string;
  telegramUsername: string;
  telegramUrl: string;
  bio: string;
  achievements: string[];
  phone?: string;
  location?: string;
}

export interface CenterSettings {
  centerName: string;
  address: string;
  district: string;
  region: string;
  telegramUsername: string;
  telegramUrl: string;
  phonePrimary: string;
  phoneSecondary?: string;
  workingHours: string;
  adminPasswordHash?: string;
  adminSalt?: string;
}

export interface DatabaseSchema {
  applications: Application[];
  courses: Course[];
  teacher: Teacher;
  settings: CenterSettings;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const DEFAULT_COURSES: Course[] = [
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

const DEFAULT_TEACHER: Teacher = {
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

const DEFAULT_SETTINGS: CenterSettings = {
  centerName: "IELTS Camp",
  address: "Yom qishlog'i",
  district: "Zomin tumani",
  region: "Jizzax viloyati",
  telegramUsername: "diyorbek_mirzaolim0v",
  telegramUrl: "https://t.me/diyorbek_mirzaolim0v",
  phonePrimary: "+998 90 000 00 00",
  workingHours: "08:00 – 19:00 (Dushanba – Shanba)"
};

const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'IC-2026-1001',
    fullName: "Sardor Rahimov",
    phone: "+998 90 123 45 67",
    courseId: "english-cefr",
    courseTitle: "Ingliz tili / CEFR",
    gradeOrAge: "10-sinf",
    notes: "Ingliz tilida grammatikam yaxshi, lekin speaking va CEFR B2 olish uchun kuchli tayyorgarlik kerak.",
    status: "yangi",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    adminComment: ""
  },
  {
    id: 'IC-2026-1002',
    fullName: "Madina Karimova",
    phone: "+998 94 987 65 43",
    courseId: "english-cefr",
    courseTitle: "Ingliz tili / CEFR",
    gradeOrAge: "11-sinf",
    notes: "Universitetga kirish uchun C1 daraja kerak. Dars vaqtlari tushdan keyin bo'lsa yaxshi bo'lardi.",
    status: "boglanildi",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    adminComment: "Telefon orqali bog'lanildi. Chorshanba kuni sinov darsiga taklif qilindi."
  },
  {
    id: 'IC-2026-1003',
    fullName: "Javohir Toshpulatov",
    phone: "+998 99 555 44 33",
    courseId: "history",
    courseTitle: "Tarix",
    gradeOrAge: "Katta yoshdagilar (Abituriyent)",
    notes: "Yuridik institutga topshiraman. Tarixdan DTM testlarini 100% yechishga tayyorlanmoqchiman.",
    status: "qabul_qilindi",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    adminComment: "Guruhga qabul qilindi. 1-guruhga biriktirildi."
  }
];

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

class Database {
  private cache: DatabaseSchema | null = null;

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (!fs.existsSync(DB_FILE)) {
        const salt = crypto.randomBytes(16).toString('hex');
        const defaultPassword = process.env.ADMIN_PASSWORD || 'IeltsCamp2026!';
        const hash = hashPassword(defaultPassword, salt);

        const initialData: DatabaseSchema = {
          applications: INITIAL_APPLICATIONS,
          courses: DEFAULT_COURSES,
          teacher: DEFAULT_TEACHER,
          settings: {
            ...DEFAULT_SETTINGS,
            adminSalt: salt,
            adminPasswordHash: hash
          }
        };

        fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
        this.cache = initialData;
      } else {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.cache = JSON.parse(raw);
      }
    } catch (err) {
      console.error('Failed to initialize database file:', err);
      // Fallback in-memory
      const salt = crypto.randomBytes(16).toString('hex');
      this.cache = {
        applications: INITIAL_APPLICATIONS,
        courses: DEFAULT_COURSES,
        teacher: DEFAULT_TEACHER,
        settings: {
          ...DEFAULT_SETTINGS,
          adminSalt: salt,
          adminPasswordHash: hashPassword('IeltsCamp2026!', salt)
        }
      };
    }
  }

  private persist() {
    if (!this.cache) return;
    try {
      const tempPath = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tempPath, JSON.stringify(this.cache, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('Failed to persist database:', err);
    }
  }

  // --- Applications ---
  public getApplications(): Application[] {
    return this.cache?.applications || [];
  }

  public getApplicationById(id: string): Application | undefined {
    return this.cache?.applications.find(a => a.id === id);
  }

  public createApplication(data: {
    fullName: string;
    phone: string;
    courseId: string;
    courseTitle?: string;
    gradeOrAge: string;
    notes?: string;
  }): Application {
    const course = this.cache?.courses.find(c => c.id === data.courseId);
    const courseTitle = data.courseTitle || course?.title || data.courseId;

    // Generate unique ID IC-2026-XXXX
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `IC-2026-${randomSuffix}`;

    const newApp: Application = {
      id: newId,
      fullName: data.fullName.trim(),
      phone: data.phone.trim(),
      courseId: data.courseId,
      courseTitle,
      gradeOrAge: data.gradeOrAge.trim(),
      notes: data.notes?.trim() || '',
      status: 'yangi',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      adminComment: ''
    };

    if (!this.cache) this.init();
    this.cache!.applications.unshift(newApp);
    this.persist();

    return newApp;
  }

  public updateApplication(
    id: string,
    updates: Partial<Pick<Application, 'status' | 'adminComment' | 'notes'>>
  ): Application | null {
    if (!this.cache) return null;
    const index = this.cache.applications.findIndex(a => a.id === id);
    if (index === -1) return null;

    const existing = this.cache.applications[index];
    const updated: Application = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.cache.applications[index] = updated;
    this.persist();
    return updated;
  }

  public deleteApplication(id: string): boolean {
    if (!this.cache) return false;
    const index = this.cache.applications.findIndex(a => a.id === id);
    if (index === -1) return false;

    this.cache.applications.splice(index, 1);
    this.persist();
    return true;
  }

  // --- Courses ---
  public getCourses(): Course[] {
    return this.cache?.courses || DEFAULT_COURSES;
  }

  public updateCourses(courses: Course[]): Course[] {
    if (!this.cache) this.init();
    this.cache!.courses = courses;
    this.persist();
    return courses;
  }

  // --- Teacher ---
  public getTeacher(): Teacher {
    return this.cache?.teacher || DEFAULT_TEACHER;
  }

  public updateTeacher(teacher: Teacher): Teacher {
    if (!this.cache) this.init();
    this.cache!.teacher = teacher;
    this.persist();
    return teacher;
  }

  // --- Settings ---
  public getSettings(): CenterSettings {
    if (!this.cache) this.init();
    const settings = { ...this.cache!.settings };
    // strip sensitive hashes
    delete settings.adminPasswordHash;
    delete settings.adminSalt;
    return settings;
  }

  public verifyAdminPassword(password: string): boolean {
    if (!this.cache) this.init();
    const { adminSalt, adminPasswordHash } = this.cache!.settings;
    if (!adminSalt || !adminPasswordHash) {
      // Check env or fallback
      const defaultPassword = process.env.ADMIN_PASSWORD || 'IeltsCamp2026!';
      return password === defaultPassword;
    }
    const computed = hashPassword(password, adminSalt);
    return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(adminPasswordHash));
  }

  public changeAdminPassword(newPassword: string): boolean {
    if (!this.cache) this.init();
    const newSalt = crypto.randomBytes(16).toString('hex');
    const newHash = hashPassword(newPassword, newSalt);
    this.cache!.settings.adminSalt = newSalt;
    this.cache!.settings.adminPasswordHash = newHash;
    this.persist();
    return true;
  }
}

export const db = new Database();
