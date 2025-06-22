
namespace Congratulator.Domain.Services
{
    public interface INotifierService
    {
        bool AlreadyRun { get; }
        int DaysBeforeNotiy { get; set; }
        TimeSpan NotifyTime { get; set; }

        Task Start();
        void Stop();
    }
}