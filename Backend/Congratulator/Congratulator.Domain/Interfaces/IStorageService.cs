
namespace Congratulator.Domain.Interfaces
{
    public interface IStorageService
    {
        string? BaseUrl { get; }
        Task<Stream> DownloadFile(string path);
        Task UploadFile(Stream fileStream, string path);
    }
}