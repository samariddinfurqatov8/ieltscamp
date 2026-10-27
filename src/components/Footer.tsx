import React from 'react';
import { Send, Shield, MapPin, GraduationCap } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenTelegram: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenTelegram,
  onOpenAdmin,
}) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-sky-400" />
              </div>
              <span className="font-extrabold text-lg text-white font-display tracking-tight">
                IELTS <span className="text-sky-400">CAMP</span>
              </span>
            </div>

            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              Jizzax viloyati, Zomin tumani, Yom qishlog'ida joylashgan zamonaviy o'quv markazi. 
              Ingliz tili (CEFR / IELTS) va Tarix (DTM) kurslari bo'yicha professional ta'lim.
            </p>

            <div className="flex items-center gap-2 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zomin tumani, Yom qishlog'i</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
              Bo'limlar
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('bosh-sahifa')}
                  className="hover:text-white transition-colors"
                >
                  Bosh sahifa
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('kurslar')}
                  className="hover:text-white transition-colors"
                >
                  Kurslar va Narxlar (200 000 so'm)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('oqituvchi')}
                  className="hover:text-white transition-colors"
                >
                  O'qituvchi: Diyorbek Mirzaolimov (C1)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('royxatdan-otish')}
                  className="hover:text-white transition-colors"
                >
                  Onlayn ro'yxatdan o'tish
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('aloqa')}
                  className="hover:text-white transition-colors"
                >
                  Aloqa va Manzil
                </button>
              </li>
            </ul>
          </div>

          {/* Admin & Direct Contact */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
              Aloqa & Boshqaruv
            </h4>
            <div className="space-y-2.5">
              <button
                onClick={onOpenTelegram}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-sky-400 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Admin (@diyorbek_mirzaolim0v)</span>
              </button>

              <button
                onClick={onOpenAdmin}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                <span>Administrator paneli</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-500 pt-1">
              Saytda Telegram bot ishlatilmaydi. Ma'lumotlar bazada xavfsiz saqlanadi.
            </p>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} IELTS Camp. Barcha huquqlar himoyalangan.</p>
          <div className="flex items-center gap-3">
            <span>Repository: samariddinfurqatov8/ielts-camp-website</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
