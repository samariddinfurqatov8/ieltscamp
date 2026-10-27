import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { db, ApplicationStatus, Course, Teacher } from './src/server/db.js';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-memory token storage for admin sessions
interface Session {
  token: string;
  createdAt: number;
  expiresAt: number;
}
const activeSessions = new Map<string, Session>();

// Session cleanup every 30 minutes
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of activeSessions.entries()) {
    if (session.expiresAt < now) {
      activeSessions.delete(token);
    }
  }
}, 30 * 60 * 1000);

// Admin Auth Middleware
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Ruxsat berilmagan. Administrator tokeni talab qilinadi." });
  }

  const token = authHeader.split(' ')[1];
  const session = activeSessions.get(token);

  if (!session || session.expiresAt < Date.now()) {
    if (session) activeSessions.delete(token);
    return res.status(401).json({ error: "Sessiya muddati tugagan yoki token noto'g'ri. Qaytadan kiring." });
  }

  // Refresh session activity
  session.expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
  next();
}

// ---------------- PUBLIC API ROUTES ----------------

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'IELTS Camp Website',
    timestamp: new Date().toISOString()
  });
});

// Get courses list
app.get('/api/courses', (_req: Request, res: Response) => {
  try {
    const courses = db.getCourses().filter(c => c.active !== false);
    res.json({ courses });
  } catch (err: any) {
    res.status(500).json({ error: "Kurslar ro'yxatini yuklashda xatolik yuz berdi" });
  }
});

// Get teacher info
app.get('/api/teachers', (_req: Request, res: Response) => {
  try {
    const teacher = db.getTeacher();
    res.json({ teacher });
  } catch (err: any) {
    res.status(500).json({ error: "O'qituvchi ma'lumotlarini yuklashda xatolik yuz berdi" });
  }
});

// Get center settings & contact details
app.get('/api/settings', (_req: Request, res: Response) => {
  try {
    const settings = db.getSettings();
    res.json({ settings });
  } catch (err: any) {
    res.status(500).json({ error: "Sozlamalarni yuklashda xatolik yuz berdi" });
  }
});

// Submit Application (Public)
app.post('/api/applications', (req: Request, res: Response) => {
  try {
    const { fullName, phone, courseId, gradeOrAge, notes } = req.body;

    // Validation
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 3) {
      return res.status(400).json({
        error: "Iltimos, ism va familiyangizni to'liq kiriting (kamida 3 harf)."
      });
    }

    const cleanPhone = (phone || '').toString().replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      return res.status(400).json({
        error: "Iltimos, to'g'ri telefon raqamingizni kiriting (masalan: +998 90 123 45 67)."
      });
    }

    if (!courseId || typeof courseId !== 'string') {
      return res.status(400).json({
        error: "Iltimos, o'rganmoqchi bo'lgan kursni tanlang."
      });
    }

    if (!gradeOrAge || typeof gradeOrAge !== 'string' || gradeOrAge.trim().length === 0) {
      return res.status(400).json({
        error: "Iltimos, sinf yoki yosh toifangizni ko'rsating."
      });
    }

    // Save to DB
    const newApp = db.createApplication({
      fullName,
      phone,
      courseId,
      gradeOrAge,
      notes: typeof notes === 'string' ? notes : ''
    });

    res.status(201).json({
      success: true,
      message: "Arizangiz muvaffaqiyatli qabul qilindi! Tez orada administrator siz bilan bog'lanadi.",
      application: newApp
    });
  } catch (err: any) {
    console.error('Error creating application:', err);
    res.status(500).json({
      error: "Serverda arizani saqlashda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring."
    });
  }
});

// ---------------- ADMIN API ROUTES ----------------

// Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const expectedUsername = process.env.ADMIN_USERNAME || 'admin';

    if (!username || !password) {
      return res.status(400).json({ error: "Login va parolni kiriting." });
    }

    if (username.trim() !== expectedUsername) {
      return res.status(401).json({ error: "Login yoki parol noto'g'ri." });
    }

    const isValidPassword = db.verifyAdminPassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Login yoki parol noto'g'ri." });
    }

    // Create session token
    const token = crypto.randomBytes(32).toString('hex');
    activeSessions.set(token, {
      token,
      createdAt: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      success: true,
      token,
      admin: {
        username: expectedUsername,
        role: 'administrator'
      }
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: "Kirishda xatolik yuz berdi" });
  }
});

// Admin Verify Token
app.get('/api/admin/verify', requireAdminAuth, (_req: Request, res: Response) => {
  res.json({ valid: true });
});

// Admin Logout
app.post('/api/admin/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    activeSessions.delete(token);
  }
  res.json({ success: true, message: "Muvaffaqiyatli chiqildi" });
});

// Admin Get Applications (with filters)
app.get('/api/admin/applications', requireAdminAuth, (req: Request, res: Response) => {
  try {
    let apps = db.getApplications();

    const { status, courseId, search, dateFrom, dateTo } = req.query;

    if (status && typeof status === 'string' && status !== 'all') {
      apps = apps.filter(a => a.status === status);
    }

    if (courseId && typeof courseId === 'string' && courseId !== 'all') {
      apps = apps.filter(a => a.courseId === courseId);
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      apps = apps.filter(a =>
        a.fullName.toLowerCase().includes(q) ||
        a.phone.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q)
      );
    }

    if (dateFrom && typeof dateFrom === 'string') {
      const fromTime = new Date(dateFrom).getTime();
      apps = apps.filter(a => new Date(a.createdAt).getTime() >= fromTime);
    }

    if (dateTo && typeof dateTo === 'string') {
      const toTime = new Date(dateTo).getTime() + 86400000; // include full day
      apps = apps.filter(a => new Date(a.createdAt).getTime() <= toTime);
    }

    res.json({ applications: apps, totalCount: apps.length });
  } catch (err: any) {
    console.error('Fetch applications error:', err);
    res.status(500).json({ error: "Arizalarni yuklashda xatolik yuz berdi" });
  }
});

// Admin Update Application Status or Comment
app.patch('/api/admin/applications/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, adminComment, notes } = req.body;

    const validStatuses: ApplicationStatus[] = ['yangi', 'boglanildi', 'qabul_qilindi', 'rad_etildi'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: "Noto'g'ri ariza holati" });
    }

    const updated = db.updateApplication(id, {
      ...(status ? { status } : {}),
      ...(adminComment !== undefined ? { adminComment } : {}),
      ...(notes !== undefined ? { notes } : {})
    });

    if (!updated) {
      return res.status(404).json({ error: "Ariza topilmadi" });
    }

    res.json({ success: true, application: updated });
  } catch (err: any) {
    res.status(500).json({ error: "Arizani tahrirlashda xatolik yuz berdi" });
  }
});

// Admin Delete Application
app.delete('/api/admin/applications/:id', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = db.deleteApplication(id);
    if (!deleted) {
      return res.status(404).json({ error: "Ariza topilmadi" });
    }
    res.json({ success: true, message: "Ariza o'chirildi" });
  } catch (err: any) {
    res.status(500).json({ error: "Arizani o'chirishda xatolik yuz berdi" });
  }
});

// Admin Update Courses
app.put('/api/admin/courses', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { courses } = req.body;
    if (!Array.isArray(courses)) {
      return res.status(400).json({ error: "Kurslar ro'yxati noto'g'ri formatda" });
    }
    const updated = db.updateCourses(courses);
    res.json({ success: true, courses: updated });
  } catch (err: any) {
    res.status(500).json({ error: "Kurslarni saqlashda xatolik yuz berdi" });
  }
});

// Admin Update Teacher Info
app.put('/api/admin/teachers', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { teacher } = req.body;
    if (!teacher || typeof teacher !== 'object') {
      return res.status(400).json({ error: "O'qituvchi ma'lumotlari talab qilinadi" });
    }
    const updated = db.updateTeacher(teacher);
    res.json({ success: true, teacher: updated });
  } catch (err: any) {
    res.status(500).json({ error: "O'qituvchi ma'lumotlarini saqlashda xatolik yuz berdi" });
  }
});

// Admin Change Password
app.post('/api/admin/change-password', requireAdminAuth, (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Amaldagi va yangi parolni kiriting." });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: "Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak." });
    }
    const isValid = db.verifyAdminPassword(currentPassword);
    if (!isValid) {
      return res.status(400).json({ error: "Amaldagi parol noto'g'ri." });
    }

    db.changeAdminPassword(newPassword);
    res.json({ success: true, message: "Parol muvaffaqiyatli yangilandi!" });
  } catch (err: any) {
    res.status(500).json({ error: "Parolni almashtirishda xatolik yuz berdi" });
  }
});

// Admin Export CSV
app.get('/api/admin/export-csv', requireAdminAuth, (_req: Request, res: Response) => {
  try {
    const apps = db.getApplications();

    // UTF-8 BOM for Microsoft Excel / Sheets Uzbek characters
    let csv = '\uFEFF';
    csv += 'Ariza ID,F.I.Sh,Telefon,Kurs,Sinf/Yosh toifasi,Holati,Ariza vaqti,Izoh,Admin izohi\r\n';

    const statusLabels: Record<ApplicationStatus, string> = {
      yangi: 'Yangi',
      boglanildi: "Bog'lanildi",
      qabul_qilindi: 'Qabul qilindi',
      rad_etildi: 'Rad etildi'
    };

    apps.forEach(a => {
      const row = [
        `"${a.id}"`,
        `"${a.fullName.replace(/"/g, '""')}"`,
        `"${a.phone.replace(/"/g, '""')}"`,
        `"${a.courseTitle.replace(/"/g, '""')}"`,
        `"${a.gradeOrAge.replace(/"/g, '""')}"`,
        `"${statusLabels[a.status] || a.status}"`,
        `"${new Date(a.createdAt).toLocaleString('uz-UZ')}"`,
        `"${(a.notes || '').replace(/"/g, '""')}"`,
        `"${(a.adminComment || '').replace(/"/g, '""')}"`
      ];
      csv += row.join(',') + '\r\n';
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="ielts-camp-arizalar-${Date.now()}.csv"`);
    res.send(csv);
  } catch (err: any) {
    res.status(500).json({ error: "CSV eksport qilishda xatolik yuz berdi" });
  }
});

// ---------------- VITE & STATIC HANDLING ----------------

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[IELTS Camp Server] running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Server failed to start:', err);
});
