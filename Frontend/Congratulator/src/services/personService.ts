export interface Person {
  id: string; // Guid в виде строки
  name: string;
  birthDate: string; // например, "2025-06-17"
  avatarUrl?: string;
}

export type PersonRequest = FormData;

import { API_BASE_URL } from "../config";
const PERSONS_BASE_URL = API_BASE_URL + "/api/Persons";

export async function getAllPersons(): Promise<Person[]> {
  const res = await fetch(PERSONS_BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch all persons");
  return res.json();
}

export async function getPersonById(id: string): Promise<Person> {
  const res = await fetch(`${PERSONS_BASE_URL}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch person by id");
  return res.json();
}

export async function getPersonsByBirthDate(
  birthDate: string
): Promise<Person[]> {
  // birthDate формат yyyy-MM-dd, например "2025-06-17"
  const res = await fetch(`${PERSONS_BASE_URL}/by-date/${birthDate}`);
  if (!res.ok) throw new Error("Failed to fetch persons by birth date");
  return res.json();
}

export async function getPersonsByMonth(birthMonth: number): Promise<Person[]> {
  if (birthMonth < 1 || birthMonth > 12) throw new Error("Invalid month");
  const res = await fetch(`${PERSONS_BASE_URL}/by-mounth/${birthMonth}`);
  if (!res.ok) throw new Error("Failed to fetch persons by month");
  return res.json();
}

export async function getUpomingBirthdays(
  countBirthdays: number
): Promise<Person[]> {
  const res = await fetch(
    `${PERSONS_BASE_URL}/upcoming-birthdays/${countBirthdays}`
  );
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText);
  }
  return res.json();
}

export async function getApproachingBirthdays(
  daysAhead: number
): Promise<Person[]> {
  if (daysAhead < 1) throw new Error("Days ahead must be more than 0");
  const res = await fetch(
    `${PERSONS_BASE_URL}/upcoming-birthdays/${daysAhead}`
  );
  if (!res.ok) throw new Error("Failed to fetch coming birthdays");
  return res.json();
}

export async function createPerson(request: FormData): Promise<string> {
  const res = await fetch(PERSONS_BASE_URL, {
    method: "POST",
    // Не указываем Content-Type, чтобы fetch сам поставил правильный заголовок с boundary
    body: request,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "Failed to create person");
  }

  return res.json(); // ожидаем, что API возвращает id (Guid)
}

export async function deletePerson(id: string): Promise<void> {
  const res = await fetch(`${PERSONS_BASE_URL}?id=${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete person");
}

export async function updatePerson(
  id: string,
  request: FormData
): Promise<void> {
  const res = await fetch(`${PERSONS_BASE_URL}/${id}`, {
    method: "PUT",
    // НЕ указываем Content-Type, чтобы fetch сам установил multipart/form-data с boundary
    body: request,
  });

  if (!res.ok) throw new Error("Failed to update person");
}
