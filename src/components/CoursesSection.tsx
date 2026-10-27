import React from 'react';
import { Course } from '../types';
import { Check, Send, Sparkles, Clock, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

interface CoursesSectionProps {
  courses: Course[];
  onSelectCourse: (courseId: string) => void;
  onTelegramClick: () => void;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({
  courses,
  onSelectCourse,
  onTelegramClick,
}) => {
  return (
    <section id="kurslar" className="py-20 bg-slate-950/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-semibold text-sky-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bizning Yo'nalishlar</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            Sifatli Ta'lim — Ochiq va Halol Narxlarda
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            IELTS Camp markazida barcha kurslar zamonaviy darsliklar va maxsus metodika asosida o'tiladi. 
            Hech qanday yashirin to'lovlarsiz — har bir kurs oyiga aniq <strong>200 000 so'm</strong>.
          </p>
        </div>

        {/* Courses Cards Grid */}
        <div className="mt-14 grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {courses.map((course) => {
            const isEnglish = course.id === 'english-cefr';

            return (
              <div
                key={course.id}
                className={`relative flex flex-col justify-between rounded-3xl p-7 sm:p-9 border transition-all duration-300 hover:-translate-y-1 ${
                  isEnglish
                    ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-sky-500/40 shadow-xl shadow-sky-500/10'
                    : 'bg-gradient-to-b from-slate-900 to-slate-950 border-slate-800 hover:border-slate-700 shadow-xl shadow-slate-950/40'
                }`}
              >
                {/* Badge if present */}
                {course.badge && (
                  <div className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-[11px] uppercase tracking-wider shadow-md">
                    {course.badge}
                  </div>
                )}

                <div>
                  {/* Category & Title */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
                      {course.category}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
                      {course.title}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed pt-1">
                      {course.description}
                    </p>
                  </div>

                  {/* Price Box */}
                  <div className="mt-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block">Oylik to'lov</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-extrabold text-white font-display">
                          {course.price.toLocaleString('uz-UZ')}
                        </span>
                        <span className="text-sm font-semibold text-sky-400">so'm</span>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                      {course.pricePeriod}
                    </span>
                  </div>

                  {/* Schedule details */}
                  <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-slate-300">
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-sky-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-500 block">Dars kunlari</span>
                        <span className="font-medium text-slate-200">{course.schedule || 'Haftada 3 kun'}</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-500 block">Davomiyligi</span>
                        <span className="font-medium text-slate-200">{course.duration}</span>
                      </div>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="mt-6 space-y-3">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Kurs tarkibida:
                    </h4>
                    <ul className="space-y-2.5">
                      {course.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                          <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card CTA Buttons */}
                <div className="mt-8 pt-6 border-t border-slate-800/80 space-y-3">
                  <button
                    onClick={() => onSelectCourse(course.id)}
                    className="w-full py-3.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/15 hover:shadow-sky-500/25 transition-all hover:scale-[1.01]"
                  >
                    <span>Ushbu kursga yozilish</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={onTelegramClick}
                    className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-700/80 text-slate-300 hover:text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5 text-sky-400" />
                    <span>Admin orqali savol berish</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom guarantee strip */}
        <div className="mt-14 max-w-4xl mx-auto p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-semibold text-white text-sm">Birinchi sinov darsi bepul!</h5>
              <p className="text-xs text-slate-400">Dars sifatini ko'rib, keyin to'lov qilishingiz mumkin.</p>
            </div>
          </div>
          <button
            onClick={() => onSelectCourse(courses[0]?.id || 'english-cefr')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            Sinov darsiga yozilish
          </button>
        </div>

      </div>
    </section>
  );
};
