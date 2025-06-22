import { useEffect, useState } from "react";
import PersonItem from "../components/PersonItem";
import type { Person } from "../services/personService";
import { format, differenceInCalendarDays, setYear, isBefore } from "date-fns";
import {
  getPersonsByBirthDate,
  getUpomingBirthdays,
} from "../services/personService";

function getDayWord(n: number) {
  const abs = Math.abs(n);
  if (abs % 10 === 1 && abs % 100 !== 11) return "день";
  if ([2, 3, 4].includes(abs % 10) && ![12, 13, 14].includes(abs % 100))
    return "дня";
  return "дней";
}

function UpcomingSection({ comingBirthdays }: { comingBirthdays: Person[] }) {
  const today = new Date();

  // Группируем по дате (строка "yyyy-MM-dd", но без сортировки)
  const grouped = comingBirthdays.reduce<Record<string, Person[]>>(
    (acc, person) => {
      const dateStr = format(new Date(person.birthDate), "yyyy-MM-dd");
      if (!acc[dateStr]) acc[dateStr] = [];
      acc[dateStr].push(person);
      return acc;
    },
    {}
  );

  // Получаем пары [дата, люди] в том порядке, в каком они были в изначальном списке
  const groupedEntries = Object.entries(grouped);

  return (
    <section className="flex-1 p-4 flex flex-col">
      <h2 className="self-start text-white text-xl font-bold inline-block bg-main px-4 py-1 rounded-md shadow">
        Ближайшие:
      </h2>
      <div className="mx-10 my-6 flex-1 flex flex-col gap-6">
        {comingBirthdays.length === 0 ? (
          <div className="flex-grow flex justify-center items-center text-gray-400 text-lg underline">
            Пока пусто
          </div>
        ) : (
          groupedEntries.map(([date, people]) => {
            const dateObj = new Date(date);
            const today = new Date();
            let nextBirthday = setYear(dateObj, today.getFullYear());
            if (isBefore(nextBirthday, today)) {
              nextBirthday = setYear(dateObj, today.getFullYear() + 1);
            }
            const formatted = format(nextBirthday, "dd.MM");
            const daysLeft = differenceInCalendarDays(nextBirthday, today);

            return (
              <div key={date}>
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  – <span className="text-white/80">{formatted}</span>{" "}
                  <span className="italic text-white/60">
                    – через {daysLeft} {getDayWord(daysLeft)}:
                  </span>
                </h3>
                <div className="ml-4 people-list upcoming-list flex flex-wrap gap-3">
                  {people.map((p) => (
                    <PersonItem
                      key={p.id}
                      name={p.name}
                      avatarUrl={p.avatarUrl}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

const Home = () => {
  const [todayPeople, setTodayPeople] = useState<Person[]>([]);
  const [comingBirthdays, setComingBirthdays] = useState<Person[]>([]);

  useEffect(() => {
    const fetchTodayPeople = async () => {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      const formatted = `${yyyy}-${mm}-${dd}`;

      try {
        const data = await getPersonsByBirthDate(formatted);
        setTodayPeople(data);
      } catch (error) {
        console.error("Ошибка при загрузке сегодняшних людей:", error);
      }
    };

    const fetchComingBirthdays = async () => {
      try {
        const data = await getUpomingBirthdays(3);
        setComingBirthdays(data);
      } catch (error) {
        console.error("Ошибка при загрузке ближайших людей:", error);
      }
    };

    fetchTodayPeople();
    fetchComingBirthdays();
  }, []);

  return (
    <div className="flex flex-col h-full justify-between text-white font-sans">
      <section className="flex-1 p-4 flex flex-col">
        <h2 className="self-start text-white text-xl font-bold bg-main px-4 py-1 rounded-md shadow">
          Сегодняшние:
        </h2>
        <div className="people-list today-list flex-1 flex flex-col space-y-2 mx-10 my-6">
          {todayPeople.length === 0 ? (
            <div className="flex-grow flex justify-center items-center text-gray-400 text-lg underline">
              Пока пусто
            </div>
          ) : (
            todayPeople.map((p) => (
              <PersonItem key={p.id} name={p.name} avatarUrl={p.avatarUrl} />
            ))
          )}
        </div>
      </section>

      <hr className="border-t border-white/20" />

      <UpcomingSection comingBirthdays={comingBirthdays} />
    </div>
  );
};

export default Home;
