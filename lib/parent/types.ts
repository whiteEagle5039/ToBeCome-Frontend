export type RiasecType = "R" | "I" | "A" | "S" | "E" | "C";

export interface RiasecScore {
  type: RiasecType;
  label: string;
  score: number; // 0-100
}

export interface Domain {
  slug: string;
  name: string;
  icon: string; // key into lib/icons ICONS map
  description: string;
}

export interface Career {
  id: string;
  slug: string;
  title: string;
  domain: string;
  riasec: RiasecType[];
  summary: string;
  description: string;
  videoLength: string;
}

export interface Comment {
  id: string;
  author: string;
  date: string; // ISO
  text: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // key into lib/icons ICONS map
  dateEarned: string; // ISO
}

export type ActivityType =
  | "compte_active"
  | "riasec_started"
  | "riasec_completed"
  | "career_explored"
  | "career_favorited"
  | "mission_started"
  | "mission_completed"
  | "badge_earned";

export interface ActivityItem {
  id: string;
  date: string; // ISO
  type: ActivityType;
  label: string;
  careerId?: string;
}

export interface Child {
  id: string;
  matricule: string;
  firstName: string;
  lastName: string;
  birthDate: string; // ISO
  className: string;
  school: string;
  avatarIcon: string; // key into lib/icons ICONS map
  riasecDominant: RiasecType[];
  riasecScores: RiasecScore[];
  riasecCompleted: boolean;
  suggestedCareerIds: string[];
  exploredCareerIds: string[];
  masteredCareerIds: string[];
  favoriteCareerIds: string[];
  interestPoints: string[];
  progressPercent: number;
  badges: Badge[];
  activity: ActivityItem[];
  comments: Comment[];
  identityVerified: boolean;
}

export type NotificationChannel = "in-app" | "email" | "whatsapp";
export type NotificationFrequency = "instant" | "weekly" | "monthly";

export interface AppNotification {
  id: string;
  childId: string;
  date: string; // ISO
  title: string;
  message: string;
  read: boolean;
}

export interface NotificationSettings {
  frequency: NotificationFrequency;
  channels: NotificationChannel[];
}

export interface ParentProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}
