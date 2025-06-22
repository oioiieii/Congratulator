
using Telegram.Bot;
using Congratulator.Domain.Interfaces;
using Microsoft.Extensions.Configuration;
using Telegram.Bot.Types.Enums;

namespace Congratulator.Infrastructure.TelegramBot
{
    public class TelegramSenderService : ISenderService
    {
        private readonly TelegramBotClient _bot;
        private readonly string chatId;

        public TelegramSenderService(IConfiguration configuration)
        {
            var botToken = configuration["TelegramBotStrings:BotToken"];
            var userNickname = configuration["TelegramBotStrings:Nickname"];

            _bot = new TelegramBotClient(botToken!);

            foreach (var update in _bot.GetUpdates().Result)
            {
                // Проверяем, что это обновление содержит нужного пользователя
                if (FindChatIdByUsername(update, userNickname) is long chatId)
                {
                    this.chatId = Convert.ToString(chatId);
                    return; // Выходим из метода, если нашли нужный чат
                }
            }
            
           Console.WriteLine($"Не удалось найти чат с ником @{userNickname}. Проверьте настройки бота и наличие пользователя в чате.");
        }

        private long? FindChatIdByUsername(Telegram.Bot.Types.Update update, string username)
        {
            // Проверяем есть ли сообщение и есть ли у него чат с нужным ником
            if (update.Message?.Chat?.Username != null && update.Message.Chat.Username.Equals(username, StringComparison.OrdinalIgnoreCase))
            {
                return update.Message.Chat.Id;
            }

            return null; 
        }

        public async Task SendMessage(string message)
        {
            try
            {
                await _bot.SendMessage(
                chatId: chatId,
                text: message,
                parseMode: ParseMode.Html);
            }
            catch (Exception ex)
            {
                //Добавить логирование в будущем можно
                throw new Exception(ex.Message);
            }
        }

    }
}
