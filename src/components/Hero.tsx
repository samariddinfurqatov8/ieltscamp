import React from 'react';
import { Send, ArrowRight, Award, CheckCircle2, MapPin, Users, BookOpen } from 'lucide-react';

interface HeroProps {
  onRegisterClick: () => void;
  onTelegramClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onRegisterClick, onTelegramClick }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
      {/* Background radial gradient mesh */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-sky-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 space-y-7 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-sky-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Yangi qabul mavsumi ochiq • 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] font-display">
              Xalqaro sertifikat va oliygoh sari <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-400">ishonchli qadam</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              <strong>IELTS Camp</strong> — Jizzax viloyati, Zomin tumani, Yom qishlog'ida joylashgan zamonaviy o'quv markazi. 
              <strong> Ingliz tili (CEFR / IELTS)</strong> va <strong>Tarix (DTM)</strong> kurslari orqali orzuingizdagi talabalik va yuqori darajaga erishing.
            </p>

            {/* Price & Location summary badge */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2">
                <span className="text-xs text-slate-400">Har bir kurs narxi:</span>
                <span className="text-sm font-bold text-emerald-400">200 000 so'm / oyiga</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span className="text-xs text-slate-300 font-medium">Zomin tumani, Yom qishlog'i</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onRegisterClick}
                className="px-6 py-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-sky-500/20 hover:shadow-sky-500/30 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Kursga ariza topshirish</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onTelegramClick}
                className="px-6 py-4 rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-700/80 hover:border-slate-600 text-slate-100 font-semibold text-sm flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Send className="w-4 h-4 text-sky-400" />
                <span>Admin bilan bog'lanish</span>
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-sky-400 font-bold text-lg font-display">
                  <Award className="w-4 h-4" />
                  <span>CEFR C1</span>
                </div>
                <p className="text-xs text-slate-400">Malakali bosh ustoz</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-lg font-display">
                  <Users className="w-4 h-4" />
                  <span>10 - 12 nafar</span>
                </div>
                <p className="text-xs text-slate-400">Kichik guruhlar</p>
              </div>

              <div className="col-span-2 sm:col-span-1 space-y-1">
                <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-lg font-display">
                  <BookOpen className="w-4 h-4" />
                  <span>Haftada 3 kun</span>
                </div>
                <p className="text-xs text-slate-400">2 soatdan intensiv darslar</p>
              </div>
            </div>

          </div>

          {/* Hero Visual Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer decorative card */}
              <div className="relative rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 shadow-2xl shadow-sky-950/40">
                
                {/* Header card badge */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center font-black text-sky-400 text-lg">
                      IC
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">IELTS Camp Yom</h4>
                      <p className="text-xs text-slate-400">Zamonaviy o'quv muhiti</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Faol
                  </span>
                </div>

                {/* Teacher preview banner inside hero */}
                <div className="mt-6 p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                      DM
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">Diyorbek Mirzaolimov</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300">C1</span>
                      </div>
                      <p className="text-xs text-slate-400">Ingliz tili va CEFR bosh o'qituvchisi</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 italic">
                    "Har bir o'quvchining potensialini ochib, qisqa muddatda yuqori sertifikat olishiga amaliy kafolat beramiz."
                  </p>
                </div>

                {/* Active courses quick list */}
                <div className="mt-5 space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm text-white flex items-center gap-2">
                        <span>Ingliz tili / CEFR</span>
                        <span className="text-[10px] text-sky-400 font-mono">B1 / B2 / C1</span>
                      </div>
                      <span className="text-xs text-slate-400">Grammatika, Speaking club & Mock</span>
                    </div>
                    <span className="font-bold text-xs text-emerald-400 bg-emerald-950/40 px-2 py-1 rounded-md border border-emerald-800/30">
                      200 000 so'm
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm text-white flex items-center gap-2">
                        <span>Tarix</span>
                        <span className="text-[10px] text-indigo-400 font-mono">DTM Blok</span>
                      </div>
                      <span className="text-xs text-slate-400">O'zbekiston va Jahon tarixi</span>
                    </div>
                    <span className="font-bold text-xs text-emerald-400 bg-emerald-950/40 px-2 py-1 rounded-md border border-emerald-800/30">
                      200 000 so'm
                    </span>
                  </div>
                </div>

                {/* Features tick list */}
                <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Haqiqiy ma'lumotlar bazasida saqlanuvchi shaxsiy ariza</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Telegram botlarsiz, to'g'ridan-to'g'ri admin bilan aloqa</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
