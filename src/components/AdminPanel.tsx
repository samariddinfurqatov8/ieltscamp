import React, { useState, useEffect, useCallback } from 'react';
import { Application, Course, Teacher, ApplicationStatus } from '../types';
import { api } from '../services/api';
import {
  Shield,
  Lock,
  User,
  LogOut,
  Search,
  Filter,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  ChevronRight,
  Eye,
  Trash2,
  RefreshCw,
  Edit,
  Save,
  KeyRound,
  BookOpen,
  GraduationCap,
  X,
  Phone,
  MessageSquare
} from 'lucide-react';

interface AdminPanelProps {
  onClose: () => void;
  onRefreshData?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, onRefreshData }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  // Login form state
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Active view
  const [activeTab, setActiveTab] = useState<'applications' | 'courses' | 'teacher' | 'security'>('applications');

  // Applications data & filters
  const [applications, setApplications] = useState<Application[]>([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected application for detail view/edit
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [adminCommentInput, setAdminCommentInput] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);

  // Courses management state
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseSuccessMsg, setCourseSuccessMsg] = useState<string | null>(null);

  // Teacher management state
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loadingTeacher, setLoadingTeacher] = useState(false);
  const [teacherSuccessMsg, setTeacherSuccessMsg] = useState<string | null>(null);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Check auth on mount
  useEffect(() => {
    async function check() {
      if (!api.hasToken()) {
        setIsAuthenticated(false);
        setCheckingAuth(false);
        return;
      }
      const valid = await api.adminVerify();
      setIsAuthenticated(valid);
      setCheckingAuth(false);
    }
    check();
  }, []);

  // Fetch applications
  const fetchApplications = useCallback(async () => {
    setLoadingApps(true);
    try {
      const data = await api.getAdminApplications({
        status: statusFilter,
        courseId: courseFilter,
        search: searchQuery
      });
      setApplications(data);
    } catch (err: any) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoadingApps(false);
    }
  }, [statusFilter, courseFilter, searchQuery]);

  // Fetch courses
  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const data = await api.getCourses();
      setCourses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCourses(false);
    }
  };

  // Fetch teacher
  const fetchTeacher = async () => {
    setLoadingTeacher(true);
    try {
      const data = await api.getTeacher();
      setTeacher(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTeacher(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === 'applications') fetchApplications();
      if (activeTab === 'courses') fetchCourses();
      if (activeTab === 'teacher') fetchTeacher();
    }
  }, [isAuthenticated, activeTab, fetchApplications]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);

    try {
      await api.adminLogin(username.trim(), password);
      setIsAuthenticated(true);
      fetchApplications();
    } catch (err: any) {
      setLoginError(err.message || "Login yoki parol noto'g'ri");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await api.adminLogout();
    setIsAuthenticated(false);
  };

  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    if (!selectedApp) return;
    setSavingStatus(true);
    try {
      const updated = await api.updateApplication(selectedApp.id, {
        status: newStatus,
        adminComment: adminCommentInput
      });
      setSelectedApp(updated);
      setApplications(prev => prev.map(a => a.id === updated.id ? updated : a));
    } catch (err: any) {
      alert("Holatni yangilashda xatolik: " + err.message);
    } finally {
      setSavingStatus(false);
    }
  };

  const handleSaveComment = async () => {
    if (!selectedApp) return;
    setSavingStatus(true);
    try {
      const updated = await api.updateApplication(selectedApp.id, {
        adminComment: adminCommentInput
      });
      setSelectedApp(updated);
      setApplications(prev => prev.map(a => a.id === updated.id ? updated : a));
    } catch (err: any) {
      alert("Izohni saqlashda xatolik: " + err.message);
    } finally {
      setSavingStatus(false);
    }
  };

  const handleDeleteApplication = async (id: string) => {
    if (!window.confirm("Rostdan ham ushbu arizani o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.")) {
      return;
    }
    try {
      await api.deleteApplication(id);
      setApplications(prev => prev.filter(a => a.id !== id));
      if (selectedApp?.id === id) {
        setSelectedApp(null);
      }
    } catch (err: any) {
      alert("Arizani o'chirishda xatolik: " + err.message);
    }
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    try {
      const updatedList = courses.map(c => c.id === editingCourse.id ? editingCourse : c);
      await api.updateCourses(updatedList);
      setCourses(updatedList);
      setEditingCourse(null);
      setCourseSuccessMsg("Kurs ma'lumotlari muvaffaqiyatli yangilandi!");
      if (onRefreshData) onRefreshData();
      setTimeout(() => setCourseSuccessMsg(null), 3000);
    } catch (err: any) {
      alert("Kursni saqlashda xatolik: " + err.message);
    }
  };

  const handleSaveTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacher) return;
    try {
      await api.updateTeacher(teacher);
      setTeacherSuccessMsg("O'qituvchi ma'lumotlari saqlandi!");
      if (onRefreshData) onRefreshData();
      setTimeout(() => setTeacherSuccessMsg(null), 3000);
    } catch (err: any) {
      alert("O'qituvchi ma'lumotlarini saqlashda xatolik: " + err.message);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: "Yangi parollar bir-biriga mos kelmadi." });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: "Yangi parol kamida 6 ta belgidan iborat bo'lishi kerak." });
      return;
    }

    setPasswordLoading(true);
    try {
      await api.changePassword(currentPassword, newPassword);
      setPasswordMsg({ type: 'success', text: "Parol muvaffaqiyatli almashtirildi!" });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err.message || "Parolni o'zgartirishda xatolik yuz berdi" });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      await api.exportCsv();
    } catch (err: any) {
      alert("CSV yuklab olishda xatolik: " + err.message);
    }
  };

  // Status badges & text
  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'yangi':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Clock className="w-3 h-3" />
            <span>Yangi</span>
          </span>
        );
      case 'boglanildi':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <MessageSquare className="w-3 h-3" />
            <span>Bog'lanildi</span>
          </span>
        );
      case 'qabul_qilindi':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle className="w-3 h-3" />
            <span>Qabul qilindi</span>
          </span>
        );
      case 'rad_etildi':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
            <XCircle className="w-3 h-3" />
            <span>Rad etildi</span>
          </span>
        );
    }
  };

  if (checkingAuth) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-sky-400 animate-spin" />
      </div>
    );
  }

  // --- Login View ---
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-display">Administrator Kirishi</h3>
              <p className="text-xs text-slate-400">IELTS Camp boshqaruv tizimi</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            {loginError && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Login</span>
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Parol</span>
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
              <p><strong>Standart login ma'lumotlari:</strong></p>
              <p>Login: <code className="text-sky-400 font-mono">admin</code></p>
              <p>Parol: <code className="text-sky-400 font-mono">IeltsCamp2026!</code></p>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.01] disabled:opacity-50"
            >
              {loginLoading ? "Tekshirilmoqda..." : "Tizimga kirish"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- Authenticated Admin Dashboard ---
  const stats = {
    total: applications.length,
    yangi: applications.filter(a => a.status === 'yangi').length,
    boglanildi: applications.filter(a => a.status === 'boglanildi').length,
    qabul: applications.filter(a => a.status === 'qabul_qilindi').length,
    rad: applications.filter(a => a.status === 'rad_etildi').length,
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 overflow-y-auto">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base text-white font-display">IELTS CAMP</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-400 font-semibold border border-sky-800/40">
                ADMIN PANEL
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Jizzax, Zomin, Yom qishlog'i</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="hidden md:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'applications' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Arizalar ({stats.total})
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'courses' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Kurslar & Narxlar
          </button>
          <button
            onClick={() => setActiveTab('teacher')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'teacher' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            O'qituvchi
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'security' ? 'bg-sky-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Xavfsizlik
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Chiqish</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            title="Saytga qaytish"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Tab switcher */}
      <div className="md:hidden flex items-center justify-around bg-slate-900/90 border-b border-slate-800 px-2 py-2 text-xs">
        <button
          onClick={() => setActiveTab('applications')}
          className={`py-1.5 px-3 rounded-lg font-medium ${activeTab === 'applications' ? 'bg-sky-500 text-slate-950' : 'text-slate-400'}`}
        >
          Arizalar
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`py-1.5 px-3 rounded-lg font-medium ${activeTab === 'courses' ? 'bg-sky-500 text-slate-950' : 'text-slate-400'}`}
        >
          Kurslar
        </button>
        <button
          onClick={() => setActiveTab('teacher')}
          className={`py-1.5 px-3 rounded-lg font-medium ${activeTab === 'teacher' ? 'bg-sky-500 text-slate-950' : 'text-slate-400'}`}
        >
          Ustoz
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`py-1.5 px-3 rounded-lg font-medium ${activeTab === 'security' ? 'bg-sky-500 text-slate-950' : 'text-slate-400'}`}
        >
          Parol
        </button>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ================= APPLICATIONS TAB ================= */}
        {activeTab === 'applications' && (
          <div className="space-y-6">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 block">Jami arizalar</span>
                <span className="text-2xl font-extrabold text-white font-display">{stats.total}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-sky-500/20">
                <span className="text-xs text-sky-400 block">Yangi</span>
                <span className="text-2xl font-extrabold text-sky-400 font-display">{stats.yangi}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/20">
                <span className="text-xs text-amber-400 block">Bog'lanildi</span>
                <span className="text-2xl font-extrabold text-amber-400 font-display">{stats.boglanildi}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/20">
                <span className="text-xs text-emerald-400 block">Qabul qilindi</span>
                <span className="text-2xl font-extrabold text-emerald-400 font-display">{stats.qabul}</span>
              </div>
              <div className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-slate-900 border border-red-500/20">
                <span className="text-xs text-red-400 block">Rad etildi</span>
                <span className="text-2xl font-extrabold text-red-400 font-display">{stats.rad}</span>
              </div>
            </div>

            {/* Controls Bar: Search, Filters, CSV Export */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
              
              <div className="flex-1 flex flex-col sm:flex-row gap-2.5">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Ism, telefon yoki ID bo'yicha qidirish..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                  >
                    <option value="all">Barcha holatlar</option>
                    <option value="yangi">Yangi</option>
                    <option value="boglanildi">Bog'lanildi</option>
                    <option value="qabul_qilindi">Qabul qilindi</option>
                    <option value="rad_etildi">Rad etildi</option>
                  </select>
                </div>

                {/* Course Filter */}
                <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                >
                  <option value="all">Barcha kurslar</option>
                  <option value="english-cefr">Ingliz tili / CEFR</option>
                  <option value="history">Tarix</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchApplications}
                  className="p-2 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Yangilash"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingApps ? 'animate-spin text-sky-400' : ''}`} />
                </button>

                <button
                  onClick={handleExportCsv}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>CSV Yuklab olish</span>
                </button>
              </div>

            </div>

            {/* Applications Table */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">ID</th>
                      <th className="py-3 px-4">O'quvchi (F.I.Sh)</th>
                      <th className="py-3 px-4">Telefon</th>
                      <th className="py-3 px-4">Tanlangan kurs</th>
                      <th className="py-3 px-4">Sinf / Yosh</th>
                      <th className="py-3 px-4">Holati</th>
                      <th className="py-3 px-4">Kelgan vaqti</th>
                      <th className="py-3 px-4 text-right">Amallar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-normal">
                    {loadingApps ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-400">
                          <RefreshCw className="w-6 h-6 animate-spin mx-auto text-sky-400 mb-2" />
                          <span>Arizalar yuklanmoqda...</span>
                        </td>
                      </tr>
                    ) : applications.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-500">
                          Hech qanday ariza topilmadi.
                        </td>
                      </tr>
                    ) : (
                      applications.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-sky-400">
                            {app.id}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-white">
                            {app.fullName}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-300">
                            {app.phone}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-medium text-slate-200">{app.courseTitle}</span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-400">
                            {app.gradeOrAge}
                          </td>
                          <td className="py-3.5 px-4">
                            {getStatusBadge(app.status)}
                          </td>
                          <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                            {new Date(app.createdAt).toLocaleDateString('uz-UZ', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                            <button
                              onClick={() => {
                                setSelectedApp(app);
                                setAdminCommentInput(app.adminComment || '');
                              }}
                              className="p-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 transition-colors"
                              title="Batafsil ko'rish"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteApplication(app.id)}
                              className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                              title="O'chirish"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Application Detail Modal */}
            {selectedApp && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-sky-400 font-bold">{selectedApp.id}</span>
                        {getStatusBadge(selectedApp.status)}
                      </div>
                      <h3 className="text-xl font-bold text-white mt-1">{selectedApp.fullName}</h3>
                    </div>
                    <button
                      onClick={() => setSelectedApp(null)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-slate-400">Telefon:</span>
                      <p className="font-mono text-base font-bold text-white flex items-center gap-2">
                        <Phone className="w-4 h-4 text-emerald-400" />
                        <a href={`tel:${selectedApp.phone}`} className="hover:underline">{selectedApp.phone}</a>
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-slate-400">Tanlangan kurs:</span>
                      <p className="text-sm font-bold text-white">{selectedApp.courseTitle}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-slate-400">Sinf / Yosh toifasi:</span>
                      <p className="text-sm font-semibold text-white">{selectedApp.gradeOrAge}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-slate-400">Kelgan vaqti:</span>
                      <p className="text-sm text-slate-300">
                        {new Date(selectedApp.createdAt).toLocaleString('uz-UZ')}
                      </p>
                    </div>
                  </div>

                  {/* Student note */}
                  <div className="space-y-1 text-xs">
                    <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                      O'quvchi qoldirgan izoh:
                    </span>
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200">
                      {selectedApp.notes || "Izoh qoldirilmagan."}
                    </div>
                  </div>

                  {/* Status Changer */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-300">Ariza holatini o'zgartirish:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        onClick={() => handleStatusChange('yangi')}
                        disabled={savingStatus}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                          selectedApp.status === 'yangi'
                            ? 'bg-sky-500 text-slate-950 border-sky-400'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        Yangi
                      </button>
                      <button
                        onClick={() => handleStatusChange('boglanildi')}
                        disabled={savingStatus}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                          selectedApp.status === 'boglanildi'
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        Bog'lanildi
                      </button>
                      <button
                        onClick={() => handleStatusChange('qabul_qilindi')}
                        disabled={savingStatus}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                          selectedApp.status === 'qabul_qilindi'
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        Qabul qilindi
                      </button>
                      <button
                        onClick={() => handleStatusChange('rad_etildi')}
                        disabled={savingStatus}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                          selectedApp.status === 'rad_etildi'
                            ? 'bg-red-500 text-slate-950 border-red-400'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        Rad etildi
                      </button>
                    </div>
                  </div>

                  {/* Admin Internal Comment */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-300">
                      Administrator izohi (faqat admin ko'radi):
                    </span>
                    <textarea
                      rows={3}
                      value={adminCommentInput}
                      onChange={(e) => setAdminCommentInput(e.target.value)}
                      placeholder="Masalan: Telefon orqali gaplashildi, 1-guruhga yozildi..."
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                    />
                    <button
                      onClick={handleSaveComment}
                      disabled={savingStatus}
                      className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition-colors"
                    >
                      {savingStatus ? "Saqlanmoqda..." : "Izohni saqlash"}
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {/* ================= COURSES TAB ================= */}
        {activeTab === 'courses' && (
          <div className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-white font-display">Kurslar va Narxlarni Boshqarish</h3>
                <p className="text-xs text-slate-400">Saytda ko'rsatiladigan kurslar narxlari va tavsiflarini o'zgartiring</p>
              </div>
              <button
                onClick={fetchCourses}
                className="p-2 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <RefreshCw className={`w-4 h-4 ${loadingCourses ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {courseSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>{courseSuccessMsg}</span>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              {courses.map((c) => (
                <div key={c.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-sky-400 uppercase">{c.id}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Faol
                    </span>
                  </div>

                  <h4 className="text-xl font-bold text-white">{c.title}</h4>
                  
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                    <span className="text-xs text-slate-400 block">Kurs narxi:</span>
                    <span className="text-2xl font-extrabold text-emerald-400 font-display">
                      {c.price.toLocaleString('uz-UZ')} so'm
                    </span>
                    <span className="text-xs text-slate-400 ml-1.5">/ {c.pricePeriod}</span>
                  </div>

                  <p className="text-xs text-slate-300">{c.description}</p>

                  <button
                    onClick={() => setEditingCourse({ ...c })}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Kursni tahrirlash</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Course Edit Drawer/Modal */}
            {editingCourse && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <form
                  onSubmit={handleSaveCourse}
                  className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h4 className="text-lg font-bold text-white">Kursni Tahrirlash: {editingCourse.title}</h4>
                    <button
                      type="button"
                      onClick={() => setEditingCourse(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <label className="text-slate-300 font-semibold">Kurs nomi:</label>
                    <input
                      type="text"
                      required
                      value={editingCourse.title}
                      onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <label className="text-slate-300 font-semibold">Oylik narx (so'mda):</label>
                    <input
                      type="number"
                      required
                      value={editingCourse.price}
                      onChange={(e) => setEditingCourse({ ...editingCourse, price: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500 font-mono"
                    />
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <label className="text-slate-300 font-semibold">Tavsif:</label>
                    <textarea
                      rows={3}
                      required
                      value={editingCourse.description}
                      onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <label className="text-slate-300 font-semibold">Dars jadvali:</label>
                    <input
                      type="text"
                      value={editingCourse.schedule || ''}
                      onChange={(e) => setEditingCourse({ ...editingCourse, schedule: e.target.value })}
                      placeholder="Dushanba, Chorshanba, Juma"
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="pt-3 flex gap-2">
                    <button
                      type="submit"
                      className="flex-1 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>O'zgarishlarni saqlash</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingCourse(null)}
                      className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                    >
                      Bekor qilish
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ================= TEACHER TAB ================= */}
        {activeTab === 'teacher' && teacher && (
          <div className="space-y-6 max-w-3xl">
            <div className="pb-4 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white font-display">O'qituvchi Ma'lumotlarini Yangilash</h3>
              <p className="text-xs text-slate-400">Diyorbek Mirzaolimov haqidagi ma'lumotlarni tahrirlash</p>
            </div>

            {teacherSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>{teacherSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveTeacher} className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="space-y-1.5 text-xs">
                <label className="text-slate-300 font-semibold">O'qituvchi F.I.Sh:</label>
                <input
                  type="text"
                  required
                  value={teacher.name}
                  onChange={(e) => setTeacher({ ...teacher, name: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-xs">
                  <label className="text-slate-300 font-semibold">Lavozimi / Yo'nalishi:</label>
                  <input
                    type="text"
                    required
                    value={teacher.role}
                    onChange={(e) => setTeacher({ ...teacher, role: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div className="space-y-1.5 text-xs">
                  <label className="text-slate-300 font-semibold">Sertifikat darajasi:</label>
                  <input
                    type="text"
                    required
                    value={teacher.level}
                    onChange={(e) => setTeacher({ ...teacher, level: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-xs">
                  <label className="text-slate-300 font-semibold">Admin Telegram Username:</label>
                  <input
                    type="text"
                    required
                    value={teacher.telegramUsername}
                    onChange={(e) => {
                      const val = e.target.value.replace('@', '');
                      setTeacher({
                        ...teacher,
                        telegramUsername: val,
                        telegramUrl: `https://t.me/${val}`
                      });
                    }}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-sky-400 font-mono text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div className="space-y-1.5 text-xs">
                  <label className="text-slate-300 font-semibold">Manzil:</label>
                  <input
                    type="text"
                    value={teacher.location || ''}
                    onChange={(e) => setTeacher({ ...teacher, location: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="text-slate-300 font-semibold">Biografiya va o'qitish metodikasi:</label>
                <textarea
                  rows={4}
                  required
                  value={teacher.bio}
                  onChange={(e) => setTeacher({ ...teacher, bio: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20"
              >
                <Save className="w-4 h-4" />
                <span>O'qituvchi ma'lumotlarini saqlash</span>
              </button>
            </form>
          </div>
        )}

        {/* ================= SECURITY TAB ================= */}
        {activeTab === 'security' && (
          <div className="space-y-6 max-w-xl">
            <div className="pb-4 border-b border-slate-800">
              <h3 className="text-xl font-bold text-white font-display">Xavfsizlik Sozlamalari</h3>
              <p className="text-xs text-slate-400">Administrator parolini xavfsiz tarzda almashtiring</p>
            </div>

            {passwordMsg && (
              <div
                className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
                  passwordMsg.type === 'success'
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                    : 'bg-red-500/10 border border-red-500/30 text-red-300'
                }`}
              >
                {passwordMsg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="space-y-1.5 text-xs">
                <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                  <span>Amaldagi parol:</span>
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Amaldagi parolni kiriting"
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Yangi parol:</span>
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Kamida 6 ta belgi"
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Yangi parolni takrorlang:</span>
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Yangi parolni tasdiqlang"
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>{passwordLoading ? "Yangilanmoqda..." : "Parolni yangilash"}</span>
              </button>
            </form>
          </div>
        )}

      </main>

    </div>
  );
};
