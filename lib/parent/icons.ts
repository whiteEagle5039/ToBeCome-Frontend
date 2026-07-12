import {
  Award,
  BookOpen,
  Briefcase,
  Circle,
  Compass,
  Cpu,
  Feather,
  Flame,
  Gem,
  HardHat,
  HeartPulse,
  Leaf,
  Medal,
  Music,
  Palette,
  Puzzle,
  Rocket,
  Sparkles,
  Star,
  Sun,
  Target,
  Trophy,
  Zap,
  type LucideIcon,
} from "lucide-react";

// Central icon registry: string keys are stored in data (mock or persisted state)
// and resolved to a Lucide component here. This keeps data serializable while
// avoiding any emoji usage in the UI.
export const ICONS: Record<string, LucideIcon> = {
  sun: Sun,
  zap: Zap,
  palette: Palette,
  bookOpen: BookOpen,
  rocket: Rocket,
  star: Star,
  music: Music,
  puzzle: Puzzle,
  feather: Feather,
  compass: Compass,
  cpu: Cpu,
  leaf: Leaf,
  heartPulse: HeartPulse,
  briefcase: Briefcase,
  hardHat: HardHat,
  award: Award,
  medal: Medal,
  trophy: Trophy,
  sparkles: Sparkles,
  flame: Flame,
  gem: Gem,
  target: Target,
};

export function getIcon(key: string | undefined): LucideIcon {
  if (!key) return Circle;
  return ICONS[key] ?? Circle;
}

// Rotation pool used to assign a fresh, non-emoji avatar icon to newly added children.
export const AVATAR_ICON_POOL = [
  "sun",
  "zap",
  "palette",
  "rocket",
  "star",
  "music",
  "puzzle",
  "feather",
  "compass",
  "bookOpen",
];
