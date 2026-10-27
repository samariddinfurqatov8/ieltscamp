import React from 'react';
import { Send, X, ExternalLink, Check, Copy, MessageSquare, ShieldCheck } from 'lucide-react';

interface TelegramModalProps {
  isOpen: boolean;
  onClose: () => void;
  telegramUsername?: string;
  telegramUrl?: string;
}

export const TelegramModal: React.FC<TelegramModalProps> = ({
  isOpen,
  onClose,
  telegramUsername = 'diyorbek_mirzaolim0v',
  telegramUrl = 'https://t.me/diyorbek_mirzaolim0v',
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(`@${telegramUsername}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow accent */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-white">Admin bilan bog'lanish</h3>
              <p className="text-xs text-slate-400">To'g'ridan-to'g'ri shaxsiy profil</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">
              DM
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-white text-sm truncate">Diyorbek Mirzaolimov</span>
                <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
              </div>
              <p className="text-xs text-sky-400 font-mono truncate">@{telegramUsername}</p>
              <p className="text-xs text-slate-400">Ingliz tili (C1) va Bosh Administrator</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-300 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-start gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p>
                <strong>Eslatma:</strong> Saytda Telegram bot ishlatilmaydi. Havola orqali bevosita adminning shaxsiy Telegram profiliga o'tasiz va xabarni o'zingiz yozasiz.
              </p>
            </div>
            <p className="text-slate-400 pl-6">
              Kurslar, guruh vaqtlari, narxlar yoki ro'yxatdan o'tish bo'yicha barcha savollaringizga shaxsan javob beriladi.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              {copied ? "Nusxalandi!" : "Username nusxalash"}
            </button>

            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs text-center flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.02]"
            >
              <span>Telegram'da ochish</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
