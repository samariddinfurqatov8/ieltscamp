import React, { useState } from 'react';
import { Course, Application } from '../types';
import { api } from '../services/api';
import { 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Copy, 
  Check, 
  User, 
  Phone, 
  BookOpen, 
  GraduationCap, 
  MessageSquare,
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface RegistrationFormProps {
  courses: Course[];
  selectedCourseId: string;
  onCourseChange: (id: string) => void;
  onOpenTelegram: () => void;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({
  courses,
  selectedCourseId,
  onCourseChange,
  onOpenTelegram,
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [gradeOrAge, setGradeOrAge] = useState('10-sinf');
  const [notes, setNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedApp, setSubmittedApp] = useState<Application | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const gradeOptions = [
    '7-8 sinf',
    '9-sinf',
    '10-sinf',
    '11-sinf',
    'Kollej / Litsey o\'quvchisi',
    'Abituriyent / Katta yoshdagilar'
  ];

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith('+998')) {
      val = '+998 ';
    }
    setPhone(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Frontend validations
    if (fullName.trim().length < 3) {
      setErrorMsg("Iltimos, ism va familiyangizni to'liq kiriting (kamida 3 harf).");
      return;
    }

    const cleanPhone = phone.replace(/\s+/g, '');
    if (cleanPhone.length < 12) {
      setErrorMsg("Iltimos, to'liq telefon raqamingizni kiriting (+998 90 123 45 67).");
      return;
    }

    if (!selectedCourseId) {
      setErrorMsg("Iltimos, o'rganmoqchi bo'lgan kursingizni tanlang.");
      return;
    }

    setLoading(true);

    try {
      const result = await api.submitApplication({
        fullName: fullName.trim(),
        phone: phone.trim(),
        courseId: selectedCourseId,
        gradeOrAge,
        notes: notes.trim()
      });

      if (result.success && result.application) {
        setSubmittedApp(result.application);
      } else {
        throw new Error(result.message || "Arizani qabul qilishda noma'lum xatolik");
      }
    } catch (err: any) {
      console.error('Submission failed:', err);
      setErrorMsg(err.message || "Server bilan aloqa uzildi. Iltimos qaytadan urinib ko'ring yoki admin bilan bog'laning.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyId = () => {
    if (submittedApp?.id) {
      navigator.clipboard.writeText(submittedApp.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleReset = () => {
    setSubmittedApp(null);
    setFullName('');
    setPhone('+998 ');
    setNotes('');
    setErrorMsg(null);
  };

  return (
    <section id="royxatdan-otish" className="py-20 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-semibold text-sky-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Onlayn Ro'yxatdan O'tish</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            IELTS Camp Kurslariga Ariza Topshiring
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Arizangiz to'g'ridan-to'g'ri markazimiz ma'lumotlar bazasida saqlanadi. 
            Administratorimiz qisqa vaqt ichida siz bilan bog'lanib, guruh vaqtlari bo'yicha ma'lumot beradi.
          </p>
        </div>

        {/* Form Container */}
        <div className="mt-12 max-w-2xl mx-auto">
          {submittedApp ? (
            /* Success State */
            <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-2xl shadow-emerald-500/5 text-center space-y-6 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white font-display">
                  Arizangiz Qabul Qilindi!
                </h3>
                <p className="text-slate-300 text-sm max-w-md mx-auto">
                  Hurmatli <strong>{submittedApp.fullName}</strong>, arizangiz IELTS Camp ma'lumotlar bazasida muvaffaqiyatli saqlandi.
                </p>
              </div>

              {/* Unique ID Box */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between max-w-md mx-auto">
                <div className="text-left">
                  <span className="text-[11px] text-slate-400 block font-medium">Sizning ariza raqamingiz (ID):</span>
                  <span className="text-lg font-bold text-sky-400 font-mono">{submittedApp.id}</span>
                </div>
                <button
                  onClick={handleCopyId}
                  className="px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-xs text-slate-300 flex items-center gap-1.5 transition-colors"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId ? "Nusxalandi" : "Nusxalash"}</span>
                </button>
              </div>

              {/* Application Details Summary */}
              <div className="text-left text-xs text-slate-300 bg-slate-800/40 p-4 rounded-2xl border border-slate-800/80 space-y-2 max-w-md mx-auto">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Tanlangan kurs:</span>
                  <span className="font-semibold text-white">{submittedApp.courseTitle}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Telefon:</span>
                  <span className="font-mono text-white">{submittedApp.phone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Sinf / Yosh toifasi:</span>
                  <span className="text-white">{submittedApp.gradeOrAge}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Ariza holati:</span>
                  <span className="text-sky-400 font-semibold uppercase text-[10px] bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/40">
                    Yangi qabul
                  </span>
                </div>
              </div>

              {/* Optional Telegram Fast Track */}
              <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-xs text-slate-300 space-y-3 max-w-md mx-auto">
                <p>
                  Tezroq guruhga yozilishni xohlaysizmi? Ariza raqamingizni <strong>Diyorbek Mirzaolimov</strong> ga Telegram orqali yuborishingiz mumkin:
                </p>
                <a
                  href={`https://t.me/diyorbek_mirzaolim0v?text=${encodeURIComponent(`Salom Diyorbek aka, men IELTS Camp saytida ariza topshirdim. Ariza raqamim: ${submittedApp.id}, Kurs: ${submittedApp.courseTitle}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Admin (@diyorbek_mirzaolim0v) ga yozish</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <button
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-white underline pt-2"
              >
                Yana yangi ariza yuborish
              </button>
            </div>
          ) : (
            /* Form Component */
            <form
              onSubmit={handleSubmit}
              className="p-7 sm:p-9 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl shadow-sky-950/20 space-y-6"
            >
              {/* Error Message banner */}
              {errorMsg && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-start gap-3 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p>{errorMsg}</p>
                </div>
              )}

              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                  <User className="w-4 h-4 text-sky-400" />
                  <span>Ism va familiyangiz *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Sardor Rahimov"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Telefon raqamingiz *</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+998 90 123 45 67"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                />
                <span className="text-[11px] text-slate-500 block">
                  Admin siz bilan ushbu raqam orqali bog'lanadi.
                </span>
              </div>

              {/* Course Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-400" />
                  <span>Tanlangan kurs *</span>
                </label>
                <div className="grid sm:grid-cols-2 gap-3">
                  {courses.map((c) => {
                    const isSelected = selectedCourseId === c.id;
                    return (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => onCourseChange(c.id)}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'bg-sky-500/10 border-sky-500 text-white shadow-md shadow-sky-500/10'
                            : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-white">{c.title}</span>
                          {isSelected && <Check className="w-4 h-4 text-sky-400" />}
                        </div>
                        <div className="mt-1 flex items-center justify-between text-xs text-slate-400">
                          <span>{c.price.toLocaleString('uz-UZ')} so'm</span>
                          <span className="text-[10px] text-sky-400">{c.category}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Grade / Age selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-teal-400" />
                  <span>Sinf yoki yosh toifasi *</span>
                </label>
                <select
                  value={gradeOrAge}
                  onChange={(e) => setGradeOrAge(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                >
                  {gradeOptions.map((opt) => (
                    <option key={opt} value={opt} className="bg-slate-950 text-white">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  <span>Qo'shimcha izoh (ixtiyoriy)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Masalan: Ingliz tilida hozirgi darajam Elementary, dars vaqtlari 14:00 dan keyin ma'qul..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-sky-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Ariza saqlanmoqda...</span>
                  </>
                ) : (
                  <>
                    <span>Arizani yuborish</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[11px] text-slate-500 text-center">
                Arizangiz to'g'ridan-to'g'ri markazning xavfsiz ma'lumotlar bazasida saqlanadi. 
                Uchinchi shaxslarga berilmaydi.
              </p>
            </form>
          )}
        </div>

      </div>
    </section>
  );
};
