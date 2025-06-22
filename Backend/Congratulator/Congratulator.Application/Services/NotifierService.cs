using Congratulator.Domain.Interfaces;
using Congratulator.Domain.Services;
using Microsoft.Extensions.Configuration;
using System.Text;
using Microsoft.Extensions.DependencyInjection;
using Congratulator.Domain.Models;


namespace Congratulator.Application.Services
{
    public class NotifierService : INotifierService
    {
        private readonly ISettingsService settingsService;
        private readonly ISenderService senderService;
        private readonly IServiceProvider serviceProvider;

        public TimeSpan NotifyTime
        {
            get { return _notifyTime; }
            set
            {
                if (value < TimeSpan.Zero || value >= TimeSpan.FromDays(1))
                {
                    throw new Exception("Invalid value: must be between 00:00 and 23:59!");
                }

                _notifyTime = value;

                if (_alreadyRun)
                {
                    Stop();
                    Task.Run(async () => await Start());
                }
            }
        }
        private TimeSpan _notifyTime = TimeSpan.Zero;

        public int DaysBeforeNotiy
        {
            get { return _daysBeforeNotify; }
            set { _daysBeforeNotify = value; }
        }
        private int _daysBeforeNotify = 3;


        private bool _alreadyRun;
        public bool AlreadyRun
        {
            get { return _alreadyRun; }
        }

        private CancellationTokenSource cts = new CancellationTokenSource();

        public NotifierService(ISettingsService settingsService, ISenderService senderService, IServiceProvider serviceProvider)
        {
            this.settingsService = settingsService;
            this.senderService = senderService;
            this.serviceProvider = serviceProvider;

            OnSettingsChanged(settingsService.Settings);
            settingsService.OnSettingsChanged += OnSettingsChanged;
        }

        private void OnSettingsChanged(Settings settings)
        {
            if (!settings.TgNotifications && _alreadyRun) Stop();
            NotifyTime = settings.NotifyTime;
            DaysBeforeNotiy = settings.DaysBeforeNotify;
            if (settings.TgNotifications && !_alreadyRun) Task.Run(async () => await Start());
        }

        private TimeSpan CalcDelayToNextNotify()
        {
            var nowTimeSpan = DateTime.Now.TimeOfDay;

            var delay = _notifyTime - nowTimeSpan;
            if (delay.Ticks < 0) delay += TimeSpan.FromHours(24);

            return delay;
        }

        public async Task Start()
        {
            if (_alreadyRun)
            {
                //Не запускаем новую задачу так как уже работает
                throw new Exception("This notifier already run!");
            }
            _alreadyRun = true;

            //Ждем первый запуск
            await Task.Delay(CalcDelayToNextNotify(), cts.Token);

            while (!cts.Token.IsCancellationRequested)
            {
                var message = await ConstructMessage();
                if (!string.IsNullOrEmpty(message))
                {
                    await senderService.SendMessage(message);
                }

                //Продолжаем каждые 24 часа
                await Task.Delay(TimeSpan.FromDays(1), cts.Token);
            }
        }

        private async Task<string> ConstructMessage()
        {
            using var scope = serviceProvider.CreateScope();
            var personsService = scope.ServiceProvider.GetRequiredService<IPersonsService>();

            StringBuilder messageSB = new StringBuilder();

            var todaysPersons = (await personsService.GetPersonsByBirthDate(DateOnly.FromDateTime(DateTime.Today))).ToList();
            if (todaysPersons.Count > 0)
            {
                messageSB.AppendLine("<b>🎉 Сегодня день рождения у:</b>");
                foreach (var person in todaysPersons)
                {
                    messageSB.AppendLine($"    🔸 {person.Name}");
                }
                messageSB.AppendLine(); 
            }

            var approachingPersons = (await personsService.GetApproachingBirthdays(DaysBeforeNotiy)).ToList();
            if (approachingPersons.Count > 0)
            {
                messageSB.AppendLine("<b>⏳ Наступающие дни рождения:</b>");
                foreach (var group in approachingPersons.GroupBy(p => p.BirthDate))
                {
                    var diff = group.Key.DayOfYear - DateTime.Today.DayOfYear;
                    if (diff < 0) diff += DateTime.IsLeapYear(DateTime.Today.Year) ? 366 : 365;

                    string formattedDate = $"{group.Key.Day:D2}.{group.Key.Month:D2}";
                    messageSB.AppendLine($"    <b>{formattedDate}</b> <i>(через {diff} дней)</i>:");
                    foreach (var person in group)
                    {
                        messageSB.AppendLine($"        🔸 {person.Name}");
                    }
                    messageSB.AppendLine();
                }
            }

            return messageSB.ToString();
        }

        public void Stop()
        {
            cts.Cancel();
            cts.Dispose();
            cts = new CancellationTokenSource();
            _alreadyRun = false;
        }

        
    }
}
