import React, { useState } from 'react';
import { Send, Menu, X, Shield, MapPin, GraduationCap } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenTelegram: () => void;
  isAdminOpen: boolean;
  onToggleAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  onOpenTelegram,
  isAdminOpen,
  onToggleAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'bosh-sahifa', label: 'Bosh sahifa' },
    { id: 'kurslar', label: 'Kurslar' },
    { id: 'oqituvchi', label: "O'qituvchi" },
    { id: 'royxatdan-otish', label: "Ro'yxatdan o'tish" },
    { id: 'aloqa', label: 'Aloqa' },
  ];

  const handleNavClick = (id: string) => {
    if (isAdminOpen) {
      onToggleAdmin();
    }
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/85 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('bosh-sahifa')}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 p-0.5 shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-sky-400 group-hover:text-white transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white font-display">
                IELTS <span className="text-sky-400">CAMP</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-sky-950/60 text-sky-300 border border-sky-800/50 rounded-md">
                Zomin • Yom
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1 font-medium">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>Yom qishlog'i o'quv markazi</span>
            </p>
          </div>
        </button>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const isActive = activeSection === item.id && !isAdminOpen;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-all ${
                  isActive
                    ? 'text-white bg-slate-800/90 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenTelegram}
            className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs tracking-wide flex items-center gap-2 shadow-md shadow-sky-500/15 hover:shadow-sky-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Send className="w-4 h-4" />
            <span>Admin bilan bog'lanish</span>
          </button>

          <button
            onClick={onToggleAdmin}
            title="Administrator paneli"
            className={`p-2.5 rounded-xl border transition-all ${
              isAdminOpen
                ? 'bg-sky-600 text-white border-sky-500'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border-slate-800'
            }`}
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={onOpenTelegram}
            className="p-2 rounded-lg bg-sky-500 text-slate-950 font-semibold"
            title="Admin Telegram"
          >
            <Send className="w-4 h-4" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-800 bg-slate-950/98 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
          <div className="px-2 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Menyu
          </div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeSection === item.id && !isAdminOpen
                  ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                  : 'text-slate-200 hover:bg-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}

          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTelegram();
              }}
              className="w-full py-3 rounded-xl bg-sky-500 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Admin bilan bog'lanish (@diyorbek_mirzaolim0v)</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onToggleAdmin();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4 text-sky-400" />
              <span>Administrator paneli</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
