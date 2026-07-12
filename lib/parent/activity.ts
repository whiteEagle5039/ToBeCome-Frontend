import { ActivityType } from "./types";

export const ACTIVITY_META: Record<ActivityType, { icon: string; tone: "teal" | "yellow" | "slate" }> = {
  compte_active: { icon: "sparkles", tone: "teal" },
  riasec_started: { icon: "compass", tone: "slate" },
  riasec_completed: { icon: "sparkles", tone: "yellow" },
  career_explored: { icon: "compass", tone: "teal" },
  career_favorited: { icon: "star", tone: "yellow" },
  mission_started: { icon: "flame", tone: "slate" },
  mission_completed: { icon: "target", tone: "teal" },
  badge_earned: { icon: "trophy", tone: "yellow" },
};
