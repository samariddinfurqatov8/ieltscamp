import React, { useState } from 'react';
import { Send, MapPin, Clock, ShieldCheck, ChevronDown, MessageSquare, ExternalLink, Navigation } from 'lucide-react';

interface ContactSectionProps {
  onTelegramClick: () => void;
  telegramUsername?: string;
  telegramUrl?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  onTelegramClick,
  telegramUsername = 'diyorbek_mirzaolim0v',
  telegramUrl = 'https://t.me/diyorbek_mirzaolim0v',
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "O'quv markazi qayerda joylashgan?",
      a: "IELTS Camp o'quv markazi Jizzax viloyati, Zomin tumani, Yom qishlog'ida joylashgan. Qulay lokatsiya va tinch o'quv muhiti bilan ta'minlangan."
    },
    {
      q: "Kurslar narxi qancha va to'lov qachon amalga oshiriladi?",
      a: "Har bir kurs (Ingliz tili / CEFR yoki Tarix) uchun to'lov oylik 200 000 so'm. To'lov darslar boshlanganidan so'ng, sinov darsidan keyin to'lanadi."
    },
    {
      q: "Darslar haftada necha kun va necha soatdan?",
      a: "Har bir yo'nalish bo'yicha darslar haftada 3 kun, 2 soatdan to'liq amaliyot shaklida o'tiladi. Qo'shimcha ravishda speaking club va mock testlar tashkil etiladi."
    },
    {
      q: "Guruhda nechta o'quvchi bo'ladi?",
      a: "Darslar sifatini kafolatlash maqsadida guruhlarda ko'pi bilan 10-12 nafar o'quvchi o'qiydi. Har bir o'quvchiga ustoz alohida vaqt ajratadi."
    },
    {
      q: "Saytdan ariza yuborsam nima bo'ladi?",
      a: "Arizangiz to'g'ridan-to'g'ri tizim bazasiga tushadi va unga noyob ID raqam beriladi. Administrator qisqa vaqtda siz bilan telefon orqali bog'lanadi."
    },
    {
      q: "Admin bilan qanday bog'lansam bo'ladi?",
      a: "Saytimizdagi 'Admin bilan bog'lanish' tugmasi orqali to'g'ridan-to'g'ri Diyorbek Mirzaolimov ning shaxsiy Telegram profiliga (@diyorbek_mirzaolim0v) o'tib yozishingiz mumkin. Bot ishlatilmaydi, faqat jonli muloqot."
    }
  ];

  return (
    <section id="aloqa" className="py-20 bg-slate-950/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-xs font-semibold text-sky-400">
            <Navigation className="w-3.5 h-3.5" />
            <span>Manzil va Aloqa</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            Biz Bilan Bog'laning
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            IELTS Camp markaziga tashrif buyuring yoki savollaringiz bo'yicha 
            administrator Diyorbek Mirzaolimov bilan to'g'ridan-to'g'ri aloqaga chiqing.
          </p>
        </div>

        {/* Content Grid */}
        <div className="mt-14 grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Details Card */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="p-7 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
              <h3 className="text-xl font-bold text-white font-display">
                IELTS Camp Ta'lim Markazi
              </h3>

              <div className="space-y-4">
                {/* Location */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">Rasmiy manzil:</span>
                    <p className="text-sm font-semibold text-white">
                      Jizzax viloyati, Zomin tumani, Yom qishlog'i
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Markaziy yo'nalish, qulay transport qatnovi
                    </p>
                  </div>
                </div>

                {/* Working hours */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">Ish vaqti:</span>
                    <p className="text-sm font-semibold text-white">
                      08:00 – 19:00 (Dushanba – Shanba)
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">Yakshanba: Dam olish kuni</p>
                  </div>
                </div>

                {/* Telegram Admin */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">Telegram aloqa:</span>
                    <p className="text-sm font-semibold text-white font-mono">
                      @{telegramUsername}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Diyorbek Mirzaolimov (Shaxsiy profil)
                    </p>
                  </div>
                </div>
              </div>

              {/* Telegram Primary Button */}
              <div className="pt-2">
                <button
                  onClick={onTelegramClick}
                  className="w-full py-4 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-sky-500/20 transition-all hover:scale-[1.01]"
                >
                  <Send className="w-4 h-4" />
                  <span>Admin bilan Telegram'da bog'lanish</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
                <span className="text-[11px] text-slate-400 text-center block mt-2">
                  Bot emas • Shaxsiy chatda savollaringizni yozing
                </span>
              </div>
            </div>

            {/* Trust box */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center gap-3.5">
              <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
              <div className="text-xs text-slate-300">
                <p className="font-semibold text-white">Xavfsiz va Ishonchli</p>
                <p className="text-slate-400 mt-0.5">
                  Barcha arizalar markaz ma'lumotlar bazasida maxfiy saqlanadi.
                </p>
              </div>
            </div>

          </div>

          {/* FAQ Accordion */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-xl font-bold text-white font-display mb-4">
              Ko'p Beriladigan Savollar (FAQ)
            </h3>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-slate-900 border border-slate-800/90 overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 focus:outline-none"
                    >
                      <span className="font-semibold text-sm sm:text-base text-white">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${
                          isOpen ? 'rotate-180 text-sky-400' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3 animate-in fade-in duration-150">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
