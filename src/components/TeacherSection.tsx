import React from 'react';
import { Teacher } from '../types';
import { Send, Award, CheckCircle, GraduationCap, MapPin, Sparkles, MessageCircle } from 'lucide-react';

interface TeacherSectionProps {
  teacher: Teacher;
  onTelegramClick: () => void;
  onRegisterClick: () => void;
}

export const TeacherSection: React.FC<TeacherSectionProps> = ({
  teacher,
  onTelegramClick,
  onRegisterClick,
}) => {
  return (
    <section id="oqituvchi" className="py-20 relative overflow-hidden">
      {/* Decorative ambient gradient */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Malakali Pedagog</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            Ustoz Haqida
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Natijaga erishishning eng muhim omili — bu kuchli va tajribali ustoz. 
            IELTS Camp ta'lim markazida darslarni xalqaro darajadagi mutaxassis olib boradi.
          </p>
        </div>

        {/* Teacher Card Grid */}
        <div className="mt-14 max-w-5xl mx-auto rounded-3xl bg-slate-900/80 border border-slate-800 p-8 sm:p-12 shadow-2xl overflow-hidden relative">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            
            {/* Visual avatar and quick stats */}
            <div className="lg:col-span-5 flex flex-col items-center text-center">
              <div className="relative">
                <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl bg-gradient-to-tr from-sky-600 via-indigo-600 to-teal-500 p-1 shadow-2xl shadow-sky-500/20">
                  <div className="w-full h-full rounded-[22px] bg-slate-950 flex flex-col items-center justify-center p-4">
                    <span className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-sky-400 to-teal-200 font-display">
                      DM
                    </span>
                    <span className="text-xs text-slate-400 mt-2 font-mono">Diyorbek M.</span>
                  </div>
                </div>

                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-sky-500 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg whitespace-nowrap flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>CEFR C1 Certified</span>
                </div>
              </div>

              <div className="mt-6 space-y-1">
                <h3 className="text-2xl font-bold text-white font-display">
                  {teacher.name}
                </h3>
                <p className="text-sm font-semibold text-sky-400">{teacher.role}</p>
                <p className="text-xs text-slate-400 flex items-center justify-center gap-1 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{teacher.location || "Jizzax viloyati, Zomin tumani, Yom qishlog'i"}</span>
                </p>
              </div>

              {/* Direct Telegram Handle button */}
              <button
                onClick={onTelegramClick}
                className="mt-5 w-full max-w-xs py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300 font-mono text-xs border border-slate-700 flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-sky-400" />
                <span>@{teacher.telegramUsername}</span>
              </button>
            </div>

            {/* Teacher Details & Bio */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Pedagogik Yondashuv</span>
                </div>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {teacher.bio}
                </p>
              </div>

              {/* Achievements & Credentials */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Asosiy Yutuqlar va Afzalliklar:
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  {teacher.achievements.map((ach, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start gap-2.5"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-200 leading-snug">{ach}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onTelegramClick}
                  className="px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.02]"
                >
                  <Send className="w-4 h-4" />
                  <span>Diyorbek Mirzaolimov bilan bog'lanish</span>
                </button>

                <button
                  onClick={onRegisterClick}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center"
                >
                  Kursga yozilish
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
