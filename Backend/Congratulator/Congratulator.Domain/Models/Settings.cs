using Congratulator.Domain.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Congratulator.Domain.Models
{
    public class Settings
    {
        public bool TgNotifications { get; set; } = false;
        public TimeSpan NotifyTime { get; set; } = TimeSpan.Zero;
        public int DaysBeforeNotify { get; set; } = 3;

        public Settings(int DaysBeforeNotify, TimeSpan NotifyTime, bool TgNotifications)
        {
            this.DaysBeforeNotify = DaysBeforeNotify;
            this.NotifyTime = NotifyTime;
            this.TgNotifications = TgNotifications;
        }
                

        public static (Settings?, string?) Create(int daysBeforeNotify, TimeSpan notifyTime, bool tgNotification)
        {
            var error = string.Empty;
            Settings? settings = null;

            //Валидация для свойств
            if (daysBeforeNotify < 0)
            {
                error = "Days before notify cannot be negative.";
            }
            else if (notifyTime < TimeSpan.Zero || notifyTime > TimeSpan.FromHours(23).Add(TimeSpan.FromMinutes(59)))
            {
                error = "Notify time must be between 00:00 and 23:59.";
            }
            else
            {
                settings = new Settings(
                    daysBeforeNotify,
                    notifyTime,
                    tgNotification);
            }

            return (settings, error);
        }
    }
}
