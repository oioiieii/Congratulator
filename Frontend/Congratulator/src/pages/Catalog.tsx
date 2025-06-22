import React, { useEffect, useState } from "react";
import {
  getAllPersons,
  deletePerson,
  createPerson,
  updatePerson,
  type Person,
} from "../services/personService";
import PersonModal from "../components/PersonModal";
import defaultAvatar from "../assets/default-avatar.png";
import { format } from "date-fns";
const Catalog: React.FC = () => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Для модалки
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  useEffect(() => {
    fetchPersons();
  }, []);

  const fetchPersons = async () => {
    try {
      const data = await getAllPersons();
      setPersons(data);
    } catch (error) {
      console.error(error);
    }
  };

  const onDelete = async (id: string) => {
    if (!window.confirm("Вы уверены, что хотите удалить?")) return;
    try {
      await deletePerson(id);
      fetchPersons();
      if (activeId === id) setActiveId(null);
    } catch (error) {
      console.error(error);
    }
  };

  // Кнопка добавить
  const onAddClick = () => {
    setEditingPerson(null);
    setModalOpen(true);
  };

  // Кнопка редактировать
  const onEditClick = (person: Person) => {
    setEditingPerson(person);
    setModalOpen(true);
  };

  // Подтверждение модального окна
  const onModalSubmit = async (formData: FormData) => {
    try {
      if (editingPerson) {
        // Обновляем
        await updatePerson(editingPerson.id, formData);
      } else {
        // Создаем
        await createPerson(formData);
      }
      setModalOpen(false);
      fetchPersons();
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-[700px] mx-auto my-5 px-4 font-sans">
      <header className="flex justify-center items-center relative mb-5">
        <h2 className="mx-auto font-semibold text-[1.8rem]">
          Все дни рождения:
        </h2>
        <button
          onClick={onAddClick}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 bg-main hover:bg-main/50 text-white rounded-md p-2 flex items-center justify-center transition"
          title="Добавить"
        >
          <svg
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.883 3.007 12 3a1 1 0 0 1 .993.883L13 4v7h7a1 1 0 0 1 .993.883L21 12a1 1 0 0 1-.883.993L20 13h-7v7a1 1 0 0 1-.883.993L12 21a1 1 0 0 1-.993-.883L11 20v-7H4a1 1 0 0 1-.993-.883L3 12a1 1 0 0 1 .883-.993L4 11h7V4a1 1 0 0 1 .883-.993L12 3l-.117.007Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </header>

      <ul className="list-none p-0 m-0">
        {persons.map((p) => (
          <li
            key={p.id}
            className={`flex justify-between items-center p-3 rounded-lg border transition cursor-default ${
              activeId === p.id
                ? "border-gray-300 cursor-pointer"
                : "border-transparent"
            }`}
            onMouseEnter={() => setActiveId(p.id)}
            onMouseLeave={() => setActiveId(null)}
          >
            <div className="flex items-center gap-3">
              <img
                className="w-[50px] h-[50px] rounded-full object-cover"
                src={p.avatarUrl || defaultAvatar}
                alt={p.name}
              />
              <div>
                <div className="font-semibold text-[1.1rem] text-gray-800 dark:text-white flex items-center gap-2">
                  <span>{p.name}</span>
                  <span className="text-gray-500 dark:text-gray-400">
                    – {format(new Date(p.birthDate), "dd.MM")}
                  </span>
                </div>
              </div>
            </div>

            {activeId === p.id && (
              <div className="flex gap-2">
                <button
                  className="bg-transparent w-9 h-9 border-none cursor-pointer text-white hover:bg-gray-200/10 p-1.5 rounded transition"
                  title="Редактировать"
                  onClick={() => onEditClick(p)}
                >
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.94 5 19 10.06 9.062 20a2.25 2.25 0 0 1-.999.58l-5.116 1.395a.75.75 0 0 1-.92-.921l1.395-5.116a2.25 2.25 0 0 1 .58-.999L13.938 5Zm7.09-2.03a3.578 3.578 0 0 1 0 5.06l-.97.97L15 3.94l.97-.97a3.578 3.578 0 0 1 5.06 0Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
                <button
                  className="bg-transparent w-9 h-9  border-none cursor-pointer text-red-400/90 hover:bg-gray-200/10 p-1.5 rounded transition"
                  title="Удалить"
                  onClick={() => onDelete(p.id)}
                >
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21.5 6a1 1 0 0 1-.883.993L20.5 7h-.845l-1.231 12.52A2.75 2.75 0 0 1 15.687 22H8.313a2.75 2.75 0 0 1-2.737-2.48L4.345 7H3.5a1 1 0 0 1 0-2h5a3.5 3.5 0 1 1 7 0h5a1 1 0 0 1 1 1Zm-7.25 3.25a.75.75 0 0 0-.743.648L13.5 10v7l.007.102a.75.75 0 0 0 1.486 0L15 17v-7l-.007-.102a.75.75 0 0 0-.743-.648Zm-4.5 0a.75.75 0 0 0-.743.648L9 10v7l.007.102a.75.75 0 0 0 1.486 0L10.5 17v-7l-.007-.102a.75.75 0 0 0-.743-.648ZM12 3.5A1.5 1.5 0 0 0 10.5 5h3A1.5 1.5 0 0 0 12 3.5Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {modalOpen && (
        <PersonModal
          initialData={editingPerson}
          onCancel={() => setModalOpen(false)}
          onSubmit={onModalSubmit}
        />
      )}
    </div>
  );
};

export default Catalog;
