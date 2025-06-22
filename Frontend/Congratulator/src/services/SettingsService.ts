export interface Settings {
  tgNotifications: boolean;
  notifyTime: string; // формат: "HH:mm:ss"
  daysBeforeNotify: number;
}

import { API_BASE_URL } from "../config";

// services/SettingsService.ts
export async function getSettings() {
  // Здесь внутренняя логика — fetch, axios и т.п.
  const res = await fetch(API_BASE_URL + "/api/settings");
  if (!res.ok) throw new Error("Ошибка при загрузке настроек");
  return res.json();
}

export async function updateSettings(settings: {
  tgNotifications: boolean;
  notifyTime: string;
  daysBeforeNotify: number;
}) {
  const res = await fetch(API_BASE_URL + "/api/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
  });
  if (!res.ok) throw new Error("Ошибка при сохранении настроек");
}
