export type ApplicationStatus = 'yangi' | 'boglanildi' | 'qabul_qilindi' | 'rad_etildi';

export interface Application {
  id: string;
  fullName: string;
  phone: string;
  courseId: string;
  courseTitle: string;
  gradeOrAge: string;
  notes?: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
  adminComment?: string;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  price: number;
  pricePeriod: string;
  description: string;
  features: string[];
  badge?: string;
  duration: string;
  active: boolean;
  schedule?: string;
}

export interface Teacher {
  id: string;
  name: string;
  role: string;
  level: string;
  experience: string;
  telegramUsername: string;
  telegramUrl: string;
  bio: string;
  achievements: string[];
  phone?: string;
  location?: string;
}

export interface CenterSettings {
  centerName: string;
  address: string;
  district: string;
  region: string;
  telegramUsername: string;
  telegramUrl: string;
  phonePrimary: string;
  phoneSecondary?: string;
  workingHours: string;
}
