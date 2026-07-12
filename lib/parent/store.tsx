"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ActivityItem,
  AppNotification,
  Child,
  Comment,
  NotificationSettings,
  ParentProfile,
} from "./types";
import {
  DEFAULT_NOTIFICATION_SETTINGS,
  PARENT_PROFILE,
} from "./mockData";
import { getToken } from "@/lib/api/client";
import { loginParent as loginParentApi, registerParent, logoutParent } from "@/lib/api/auth";
import * as parentApi from "@/lib/api/parent";
import { setParentEmail } from "@/lib/api/parent";
import { getApiErrorMessage } from "@/lib/api/client";

const STORAGE_KEY = "tobecome_parent_state_v2";

interface PersistedState {
  isAuthenticated: boolean;
  profile: ParentProfile;
  children: Child[];
  notifications: AppNotification[];
  notificationSettings: NotificationSettings;
}

function defaultState(): PersistedState {
  return {
    isAuthenticated: false,
    profile: { ...PARENT_PROFILE, email: "", firstName: "", lastName: "", phone: "" },
    children: [],
    notifications: [],
    notificationSettings: DEFAULT_NOTIFICATION_SETTINGS,
  };
}

export interface AddChildInput {
  matricule: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  hasBirthCertificate: boolean;
}

export type AddChildErrorField = "matricule" | "birthDate" | "identity" | "document" | "general";

export interface AddChildResult {
  ok: boolean;
  error?: string;
  errorField?: AddChildErrorField;
  child?: Child;
}

interface StoreContextValue extends PersistedState {
  hydrated: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signup: (profile: ParentProfile, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  addChild: (input: AddChildInput) => Promise<AddChildResult>;
  addComment: (childId: string, text: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  updateNotificationSettings: (settings: NotificationSettings) => void;
  updateProfile: (profile: ParentProfile) => void;
  toggleFavorite: (childId: string, careerId: string) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(defaultState());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    async function hydrateStore() {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? { ...defaultState(), ...JSON.parse(raw) } : defaultState();

        if (getToken("parent")) {
          try {
            const stored = parsed.profile?.email ?? "";
            if (stored) setParentEmail(stored);
            const [profile, children, notifications, notificationSettings] = await Promise.all([
              parentApi.fetchParentProfile(),
              parentApi.fetchChildren(),
              parentApi.fetchNotifications(),
              parentApi.fetchNotificationSettings(),
            ]);
            setState({
              isAuthenticated: true,
              profile,
              children,
              notifications,
              notificationSettings,
            });
          } catch {
            setState({ ...parsed, isAuthenticated: !!getToken("parent") });
          }
        } else {
          setState(parsed);
        }
      } catch {
        setState(defaultState());
      } finally {
        setHydrated(true);
      }
    }
    hydrateStore();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const login = useCallback(async (email: string, password: string) => {
    if (!email || !password) {
      return { ok: false, error: "Renseigne ton email et ton mot de passe." };
    }
    try {
      await loginParentApi(email, password);
      setParentEmail(email);
      const [profile, children, notifications, notificationSettings] = await Promise.all([
        parentApi.fetchParentProfile(),
        parentApi.fetchChildren(),
        parentApi.fetchNotifications(),
        parentApi.fetchNotificationSettings(),
      ]);
      setState((s) => ({
        ...s,
        isAuthenticated: true,
        profile: { ...profile, email },
        children,
        notifications,
        notificationSettings,
      }));
      return { ok: true };
    } catch (err) {
      return { ok: false, error: getApiErrorMessage(err, "Connexion impossible.") };
    }
  }, []);

  const signup = useCallback(async (profile: ParentProfile, password: string) => {
    if (!profile.email || !profile.firstName || password.length < 4) {
      return { ok: false, error: "Merci de compléter tous les champs (mot de passe : 4 caractères min)." };
    }
    try {
      await registerParent({ ...profile, password });
      setParentEmail(profile.email);
      const children = await parentApi.fetchChildren();
      setState((s) => ({ ...s, isAuthenticated: true, profile, children }));
      return { ok: true };
    } catch (err) {
      return { ok: false, error: getApiErrorMessage(err) };
    }
  }, []);

  const logout = useCallback(() => {
    logoutParent();
    setState((s) => ({ ...s, isAuthenticated: false }));
  }, []);

  const addChild = useCallback(async (input: AddChildInput): Promise<AddChildResult> => {
    if (!input.hasBirthCertificate) {
      return {
        ok: false,
        errorField: "document",
        error: "Merci de joindre une photo de l'acte de naissance de l'enfant.",
      };
    }

    try {
      const child = await parentApi.addChildApi(input);
      setState((s) => {
        if (s.children.some((c) => c.id === child.id)) return s;
        return { ...s, children: [...s.children, child] };
      });
      return { ok: true, child };
    } catch (err) {
      const msg = getApiErrorMessage(err);
      if (msg.includes("Matricule")) return { ok: false, errorField: "matricule", error: msg };
      if (msg.includes("naissance")) return { ok: false, errorField: "birthDate", error: msg };
      if (msg.includes("Nom") || msg.includes("prénom"))
        return { ok: false, errorField: "identity", error: msg };
      return { ok: false, error: msg };
    }
  }, []);

  const addComment = useCallback(async (childId: string, text: string) => {
    if (!text.trim()) return;
    try {
      const comment = await parentApi.addCommentApi(childId, text);
      setState((s) => ({
        ...s,
        children: s.children.map((c) =>
          c.id === childId ? { ...c, comments: [comment, ...c.comments] } : c,
        ),
      }));
    } catch {
      setState((s) => ({
        ...s,
        children: s.children.map((c) => {
          if (c.id !== childId) return c;
          const comment: Comment = {
            id: `cm-${Date.now()}`,
            author: s.profile.firstName,
            date: new Date().toISOString(),
            text: text.trim(),
          };
          return { ...c, comments: [comment, ...c.comments] };
        }),
      }));
    }
  }, []);

  const markNotificationRead = useCallback(async (id: string) => {
    try {
      await parentApi.markNotificationReadApi(id);
    } catch {
      // fallback local
    }
    setState((s) => ({
      ...s,
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  }, []);

  const markAllNotificationsRead = useCallback(async () => {
    try {
      await parentApi.markAllNotificationsReadApi();
    } catch {
      // fallback local
    }
    setState((s) => ({
      ...s,
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
    }));
  }, []);

  const updateNotificationSettings = useCallback(async (settings: NotificationSettings) => {
    try {
      const updated = await parentApi.updateNotificationSettingsApi(settings);
      setState((s) => ({ ...s, notificationSettings: updated }));
    } catch {
      setState((s) => ({ ...s, notificationSettings: settings }));
    }
  }, []);

  const updateProfile = useCallback((profile: ParentProfile) => {
    setState((s) => ({ ...s, profile }));
  }, []);

  const toggleFavorite = useCallback((childId: string, careerId: string) => {
    setState((s) => ({
      ...s,
      children: s.children.map((c) => {
        if (c.id !== childId) return c;
        const has = c.favoriteCareerIds.includes(careerId);
        return {
          ...c,
          favoriteCareerIds: has
            ? c.favoriteCareerIds.filter((id) => id !== careerId)
            : [...c.favoriteCareerIds, careerId],
        };
      }),
    }));
  }, []);

  const value = useMemo<StoreContextValue>(
    () => ({
      ...state,
      hydrated,
      login,
      signup,
      logout,
      addChild,
      addComment,
      markNotificationRead,
      markAllNotificationsRead,
      updateNotificationSettings,
      updateProfile,
      toggleFavorite,
    }),
    [state, hydrated, login, signup, logout, addChild, addComment, markNotificationRead, markAllNotificationsRead, updateNotificationSettings, updateProfile, toggleFavorite]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
