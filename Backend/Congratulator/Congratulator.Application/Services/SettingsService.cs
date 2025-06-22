using Congratulator.Domain.Interfaces;
using Congratulator.Domain.Models;
using System.Text.Json;

namespace Congratulator.Application.Services
{
    public class SettingsService : ISettingsService
    {
        private readonly string FilePath = Path.Combine(AppContext.BaseDirectory, "settings.json");
        private Settings settings;
        public event Action<Settings>? OnSettingsChanged;

        public Settings Settings
        {
            get => settings;
            set
            {
                settings = value;
                SaveSettings();
                OnSettingsChanged?.Invoke(settings);
            }
        }

        public SettingsService()
        {
            LoadSettings();
        }

        private void LoadSettings()
        {
            if (!File.Exists(FilePath))
            {
                Settings = new Settings(3, TimeSpan.Zero, false); // дефолтные значения
                return;
            }

            string json = File.ReadAllText(FilePath);
            Settings = JsonSerializer.Deserialize<Settings>(json, new JsonSerializerOptions()) ?? new Settings(3, TimeSpan.Zero, false);
        }

        private void SaveSettings()
        {
            var json = JsonSerializer.Serialize(Settings, new JsonSerializerOptions
            {
                WriteIndented = true
            });

            File.WriteAllText(FilePath, json);
        }
    }
}
