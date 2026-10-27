import React, { useState, useEffect } from 'react';
import { Course, Teacher } from './types';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CoursesSection } from './components/CoursesSection';
import { TeacherSection } from './components/TeacherSection';
import { RegistrationForm } from './components/RegistrationForm';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { TelegramModal } from './components/TelegramModal';
import { AdminPanel } from './components/AdminPanel';
import { Send } from 'lucide-react';

export default function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('english-cefr');
  
  const [activeSection, setActiveSection] = useState<string>('bosh-sahifa');
  const [telegramModalOpen, setTelegramModalOpen] = useState<boolean>(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState<boolean>(false);

  const loadData = async () => {
    try {
      const [fetchedCourses, fetchedTeacher] = await Promise.all([
        api.getCourses(),
        api.getTeacher(),
      ]);
      setCourses(fetchedCourses);
      setTeacher(fetchedTeacher);
      if (fetchedCourses.length > 0) {
        setSelectedCourseId(fetchedCourses[0].id);
      }
    } catch (err) {
      console.error('Error loading initial data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    if (sectionId === 'bosh-sahifa') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    scrollToSection('royxatdan-otish');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onOpenTelegram={() => setTelegramModalOpen(true)}
        isAdminOpen={adminPanelOpen}
        onToggleAdmin={() => setAdminPanelOpen(!adminPanelOpen)}
      />

      {/* Main Content */}
      <main className="flex-1">
        <Hero
          onRegisterClick={() => scrollToSection('royxatdan-otish')}
          onTelegramClick={() => setTelegramModalOpen(true)}
        />

        <CoursesSection
          courses={courses}
          onSelectCourse={handleSelectCourse}
          onTelegramClick={() => setTelegramModalOpen(true)}
        />

        {teacher && (
          <TeacherSection
            teacher={teacher}
            onTelegramClick={() => setTelegramModalOpen(true)}
            onRegisterClick={() => scrollToSection('royxatdan-otish')}
          />
        )}

        <RegistrationForm
          courses={courses}
          selectedCourseId={selectedCourseId}
          onCourseChange={setSelectedCourseId}
          onOpenTelegram={() => setTelegramModalOpen(true)}
        />

        <ContactSection
          onTelegramClick={() => setTelegramModalOpen(true)}
          telegramUsername={teacher?.telegramUsername || 'diyorbek_mirzaolim0v'}
          telegramUrl={teacher?.telegramUrl || 'https://t.me/diyorbek_mirzaolim0v'}
        />
      </main>

      {/* Footer */}
      <Footer
        onNavigate={scrollToSection}
        onOpenTelegram={() => setTelegramModalOpen(true)}
        onOpenAdmin={() => setAdminPanelOpen(true)}
      />

      {/* Telegram Modal */}
      <TelegramModal
        isOpen={telegramModalOpen}
        onClose={() => setTelegramModalOpen(false)}
        telegramUsername={teacher?.telegramUsername || 'diyorbek_mirzaolim0v'}
        telegramUrl={teacher?.telegramUrl || 'https://t.me/diyorbek_mirzaolim0v'}
      />

      {/* Admin Panel Modal / View */}
      {adminPanelOpen && (
        <AdminPanel
          onClose={() => setAdminPanelOpen(false)}
          onRefreshData={loadData}
        />
      )}

      {/* Floating Action Button for Telegram Contact */}
      <div className="fixed bottom-6 right-6 z-30">
        <button
          onClick={() => setTelegramModalOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs tracking-wide shadow-2xl shadow-sky-500/30 transition-all hover:scale-105 active:scale-95 border border-sky-400/40"
          title="Admin bilan bog'lanish (@diyorbek_mirzaolim0v)"
        >
          <Send className="w-4 h-4 transition-transform group-hover:rotate-12" />
          <span className="hidden sm:inline">Admin bilan bog'lanish</span>
        </button>
      </div>
    </div>
  );
}
