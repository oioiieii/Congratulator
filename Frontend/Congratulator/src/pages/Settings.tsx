import { useEffect, useState } from "react";
import * as SettingsService from "../services/SettingsService";

const Settings = () => {
  const [tgNotificationsEnabled, setTgNotificationsEnabled] = useState(false);
  const [notificationTime, setNotificationTime] = useState("00:00");
  const [daysBefore, setDaysBefore] = useState(3);
  const [initialState, setInitialState] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    SettingsService.getSettings()
      .then((data) => {
        const formattedData = {
          tgNotifications: data.tgNotifications,
          notifyTime: data.notifyTime.slice(0, 5) + ":00",
          daysBeforeNotify: data.daysBeforeNotify,
        };

        setTgNotificationsEnabled(formattedData.tgNotifications);
        setNotificationTime(formattedData.notifyTime.slice(0, 5));
        setDaysBefore(formattedData.daysBeforeNotify);
        setInitialState(JSON.stringify(formattedData));
      })
      .catch(() => {
        alert("Ошибка при загрузке настроек");
      });
  }, []);

  const handleSave = () => {
    setSaving(true);
    const payload = {
      tgNotifications: tgNotificationsEnabled,
      notifyTime: notificationTime + ":00",
      daysBeforeNotify: daysBefore,
    };
    SettingsService.updateSettings(payload)
      .then(() => {
        setInitialState(JSON.stringify(payload));
        alert("Настройки сохранены");
      })
      .catch(() => alert("Ошибка при сохранении настроек"))
      .finally(() => setSaving(false));
  };

  const hasChanges =
    JSON.stringify({
      tgNotifications: tgNotificationsEnabled,
      notifyTime: notificationTime + ":00",
      daysBeforeNotify: daysBefore,
    }) !== initialState;

  return (
    <div className="mx-20">
      <h1 className="text-3xl font-bold text-center mb-8 mt-3">Настройки</h1>

      <div className="space-y-6">
        {/* Переключатель */}
        <div className="flex items-center justify-between">
          <label className="text-lg font-medium">Уведомление в TG</label>
          <button
            onClick={() => setTgNotificationsEnabled(!tgNotificationsEnabled)}
            className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${
              tgNotificationsEnabled ? "bg-blue-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                tgNotificationsEnabled ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Настройки уведомлений */}
        <div
          className={`space-y-5 pl-4 border-l-4 ${
            tgNotificationsEnabled ? "border-blue-400" : "border-gray-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <label
              className={`text-md ${
                !tgNotificationsEnabled ? "text-gray-400" : ""
              }`}
            >
              Время уведомления
            </label>
            <input
              type="time"
              className={`border rounded px-2 py-1 text-black ${
                !tgNotificationsEnabled
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : ""
              }`}
              value={notificationTime}
              onChange={(e) => setNotificationTime(e.target.value)}
              disabled={!tgNotificationsEnabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <label
              className={`text-md ${
                !tgNotificationsEnabled ? "text-gray-400" : ""
              }`}
            >
              За сколько дней уведомлять
            </label>
            <input
              type="number"
              min={1}
              className={`border rounded px-2 py-1 w-16 text-center text-black ${
                !tgNotificationsEnabled
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : ""
              }`}
              value={daysBefore}
              onChange={(e) => setDaysBefore(Number(e.target.value))}
              disabled={!tgNotificationsEnabled}
            />
          </div>
        </div>

        {/* Кнопка Сохранить */}
        {hasChanges && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
          >
            {saving ? "Сохранение..." : "Сохранить"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Settings;
