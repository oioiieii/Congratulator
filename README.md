# 🥳 Поздравлятор

**Поздравлятор** — это веб-приложение, которое помогает не забыть поздравить друзей и коллег с днём рождения. Добавляешь именинников — получаешь уведомления прямо в Telegram.

---

## 🚀 Используемые технологии

### Backend:
- ASP.NET Core Web API  
- Entity Framework Core (PostgreSQL)  
- Supabase (облачная БД)

### Frontend:
- Vite  
- React  
- Tailwind CSS  
- TypeScript

---

## ⚙️ Как запустить (тестовый режим)

### 🔹 1. Клонировать репозиторий

```bash
git clone https://github.com/your-username/congratulator.git
cd congratulator
```

---

### 🔹 2. Запуск API

- **База данных уже развернута** в Supabase — свою настраивать не нужно.
- Чтобы получать уведомления в Telegram:

  1. Напиши боту [@solarlab_congratulator_bot](https://t.me/solarlab_congratulator_bot) `/start`
  2. Перейди по ссылке (замени `<TOKEN>` на токен бота):

     ```
     https://api.telegram.org/bot<TOKEN>/getUpdates
     ```

     Ссылка для тестового бота:
     ```
     https://api.telegram.org/bot7811136043:AAFqpWyvunufYAqouFQTRido-PxFliv1XZ0/getUpdates
     ```

  3. Найди свой `chat_id` в ответе
  4. Измени `chat_id` в файле `Backend/Congratulator/Congratulator.API/appsettings.json`:
      ```json
      "TelegramBotStrings": {
        "ChatId": "ВАШ_CHAT_ID"
      }
      ```

Больше никаких настроек не требуется.

---

### 🔹 3. Запуск фронтенда

```bash
cd frontend
npm install
npm run dev
```

---

## 🧩 Для личного использования

Для полноценного использования с собственной базой:

1. Зарегистрируйтесь в [Supabase](https://supabase.com) или поднимите PostgreSQL локально
2. Обновите строки подключения в `appsettings.json`
3. Примените миграции базы данных:

```bash
cd Backend/Congratulator
dotnet ef database update
```

