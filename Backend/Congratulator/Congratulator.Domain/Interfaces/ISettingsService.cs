using Congratulator.Domain.Models;

namespace Congratulator.Domain.Interfaces
{
    public interface ISettingsService
    {
        Settings Settings { get; set; }
        event Action<Settings> OnSettingsChanged;
    }
}