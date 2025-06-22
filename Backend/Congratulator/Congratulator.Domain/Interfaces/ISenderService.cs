
namespace Congratulator.Domain.Interfaces
{
    public interface ISenderService
    {
        Task SendMessage(string message);
    }
}