import React, { useRef, useState, useEffect } from "react";
import type { Person } from "../services/personService";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import defaultAvatar from "../assets/default-avatar.png";
import { X } from "lucide-react";

import { ru } from "date-fns/locale/ru";
registerLocale("ru", ru);

type Props = {
  initialData?: Person | null;
  onCancel: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
};

const PersonModal: React.FC<Props> = ({
  initialData = null,
  onCancel,
  onSubmit,
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [birthDate, setBirthDate] = useState<Date | null>(
    initialData?.birthDate ? new Date(initialData.birthDate) : null
  );
  const [avatarPreview, setAvatarPreview] = useState<string>(
    initialData?.avatarUrl || defaultAvatar
  );
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(initialData?.name || "");
    setBirthDate(
      initialData?.birthDate ? new Date(initialData.birthDate) : null
    );
    setAvatarPreview(initialData?.avatarUrl || defaultAvatar);
    setAvatarFile(null);
  }, [initialData]);

  const onAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!name || !birthDate) {
      alert("Заполните имя и дату");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);

    const year = birthDate.getFullYear();
    const month = String(birthDate.getMonth() + 1).padStart(2, "0");
    const day = String(birthDate.getDate()).padStart(2, "0");
    const localDate = `${year}-${month}-${day}`;
    formData.append("birthDate", localDate);

    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Ошибка при отправке формы:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-neutral-900 p-6 pt-3 rounded-xl w-[500px] max-w-full text-white shadow-lg border border-white/20 relative">
        {/* Заголовок + крестик */}
        <div className="relative mb-6">
          <h2 className="text-xl font-semibold w-max mx-auto text-white">
            {initialData ? "Редактирование" : "Добавление"}
          </h2>
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="absolute top-2 right-0 text-gray-300 hover:text-white disabled:opacity-40"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex items-center gap-6">
          {/* Аватар */}
          <div
            className="w-32 h-32 rounded-full overflow-hidden cursor-pointer hover:bg-gray-50/20"
            onClick={onAvatarClick}
            title="Выбрать фото"
          >
            <img
              src={avatarPreview}
              alt="Аватар"
              className="w-full h-full object-cover"
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={onFileChange}
            />
          </div>

          {/* Поля */}
          <div className="flex flex-col gap-5 flex-1">
            {/* Имя */}
            <div className="flex items-center gap-2">
              <label className="w-24 text-sm text-gray-300">Имя:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Имя"
                disabled={isSubmitting}
                className="flex-1 bg-transparent border-b border-white pb-1 text-white placeholder-white focus:outline-none disabled:opacity-50"
              />
            </div>

            {/* Дата рождения */}
            <div className="flex items-center gap-2">
              <label className="w-24 text-sm text-gray-300">
                Дата рождения:
              </label>
              <DatePicker
                selected={birthDate}
                onChange={(date) => setBirthDate(date)}
                dateFormat="dd.MM"
                placeholderText="Выберите дату"
                showYearDropdown={false}
                minDate={new Date(new Date().getFullYear(), 0, 1)}
                maxDate={new Date(new Date().getFullYear(), 11, 31)}
                locale="ru"
                disabled={isSubmitting}
                className="flex-1 bg-transparent border-b border-white text-white placeholder-white/70 focus:outline-none focus:border-blue-400 transition-colors disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex justify-end gap-4 mt-10">
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-md border border-white text-white bg-transparent
               hover:border-red-500 hover:bg-red-500 hover:text-white transition disabled:opacity-40"
          >
            Отменить
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`px-4 py-2 rounded-md border border-white text-white bg-transparent
               hover:border-green-500 hover:bg-green-500  hover:text-white transition disabled:opacity-40
                ${isSubmitting ? "bg-green-500 border-green-500" : ""}`}
          >
            {isSubmitting ? "Сохраняем..." : "Подтвердить"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonModal;
