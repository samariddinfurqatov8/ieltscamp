import { Application, Course, Teacher, CenterSettings, ApplicationStatus } from '../types';

const API_BASE = '/api';

class ApiService {
  private getToken(): string | null {
    return localStorage.getItem('ielts_camp_admin_token');
  }

  public setToken(token: string): void {
    localStorage.setItem('ielts_camp_admin_token', token);
  }

  public clearToken(): void {
    localStorage.removeItem('ielts_camp_admin_token');
  }

  public hasToken(): boolean {
    return !!this.getToken();
  }

  private authHeaders(): HeadersInit {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  }

  // --- Public APIs ---
  async getCourses(): Promise<Course[]> {
    try {
      const res = await fetch(`${API_BASE}/courses`);
      if (!res.ok) throw new Error('Kurslarni yuklab bo‘lmadi');
      const data = await res.json();
      return data.courses || [];
    } catch (err) {
      console.warn('API error fetching courses, using fallback', err);
      return [
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
    }
  }

  async getTeacher(): Promise<Teacher> {
    try {
      const res = await fetch(`${API_BASE}/teachers`);
      if (!res.ok) throw new Error("O'qituvchi ma'lumotlarini yuklab bo'lmadi");
      const data = await res.json();
      return data.teacher;
    } catch (err) {
      return {
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
    }
  }

  async getSettings(): Promise<CenterSettings> {
    try {
      const res = await fetch(`${API_BASE}/settings`);
      if (!res.ok) throw new Error("Sozlamalarni yuklab bo'lmadi");
      const data = await res.json();
      return data.settings;
    } catch (err) {
      return {
        centerName: "IELTS Camp",
        address: "Yom qishlog'i",
        district: "Zomin tumani",
        region: "Jizzax viloyati",
        telegramUsername: "diyorbek_mirzaolim0v",
        telegramUrl: "https://t.me/diyorbek_mirzaolim0v",
        phonePrimary: "+998 90 000 00 00",
        workingHours: "08:00 – 19:00 (Dushanba – Shanba)"
      };
    }
  }

  async submitApplication(form: {
    fullName: string;
    phone: string;
    courseId: string;
    gradeOrAge: string;
    notes?: string;
  }): Promise<{ success: boolean; message: string; application: Application }> {
    const res = await fetch(`${API_BASE}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Arizani yuborishda xatolik yuz berdi");
    }
    return data;
  }

  // --- Admin APIs ---
  async adminLogin(username: string, password: string): Promise<{ success: boolean; token: string }> {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Login yoki parol noto'g'ri");
    }
    this.setToken(data.token);
    return data;
  }

  async adminVerify(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/admin/verify`, {
        headers: this.authHeaders()
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  async adminLogout(): Promise<void> {
    try {
      await fetch(`${API_BASE}/admin/logout`, {
        method: 'POST',
        headers: this.authHeaders()
      });
    } finally {
      this.clearToken();
    }
  }

  async getAdminApplications(filters?: {
    status?: string;
    courseId?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<Application[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.courseId) params.append('courseId', filters.courseId);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.append('dateTo', filters.dateTo);

    const res = await fetch(`${API_BASE}/admin/applications?${params.toString()}`, {
      headers: this.authHeaders()
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Arizalarni yuklab bo'lmadi");
    }
    return data.applications || [];
  }

  async updateApplication(
    id: string,
    updates: { status?: ApplicationStatus; adminComment?: string; notes?: string }
  ): Promise<Application> {
    const res = await fetch(`${API_BASE}/admin/applications/${id}`, {
      method: 'PATCH',
      headers: this.authHeaders(),
      body: JSON.stringify(updates)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Arizani yangilab bo'lmadi");
    }
    return data.application;
  }

  async deleteApplication(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/admin/applications/${id}`, {
      method: 'DELETE',
      headers: this.authHeaders()
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Arizani o'chirib bo'lmadi");
    }
    return true;
  }

  async updateCourses(courses: Course[]): Promise<Course[]> {
    const res = await fetch(`${API_BASE}/admin/courses`, {
      method: 'PUT',
      headers: this.authHeaders(),
      body: JSON.stringify({ courses })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Kurslarni yangilab bo'lmadi");
    return data.courses;
  }

  async updateTeacher(teacher: Teacher): Promise<Teacher> {
    const res = await fetch(`${API_BASE}/admin/teachers`, {
      method: 'PUT',
      headers: this.authHeaders(),
      body: JSON.stringify({ teacher })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "O'qituvchini yangilab bo'lmadi");
    return data.teacher;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const res = await fetch(`${API_BASE}/admin/change-password`, {
      method: 'POST',
      headers: this.authHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Parolni yangilab bo'lmadi");
  }

  async exportCsv(): Promise<void> {
    const token = this.getToken();
    const res = await fetch(`${API_BASE}/admin/export-csv`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });

    if (!res.ok) throw new Error("CSV faylini yuklab bo'lmadi");

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ielts-camp-arizalar-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}

export const api = new ApiService();
