
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
            var chatId = configuration["TelegramBotStrings:ChatId"];

            _bot = new TelegramBotClient(botToken!);
            this.chatId = chatId!;
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
