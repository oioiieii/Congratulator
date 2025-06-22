using Congratulator.Domain.Interfaces;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mime;
using System.Net.Sockets;
using Telegram.Bot.Types;

namespace Congratulator.Infrastructure.Storage
{
    public class SupabaseStorageService : IStorageService
    {
        private readonly HttpClient httpClient;
        public string? BaseUrl { get {
                return _baseUrl;
            } }

        private string? _baseUrl;
        public SupabaseStorageService(HttpClient httpClient)
        {
            this.httpClient = httpClient;
            _baseUrl = $"{httpClient.BaseAddress}storage/v1/object/";
        }

        public async Task<Stream> DownloadFile(string path)
        {
            var client = new HttpClient();
            var response = await client.GetAsync($"storage/v1/object/{path}");

            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStreamAsync();
        }

        public async Task UploadFile(Stream fileStream, string path)
        {
            var content = new StreamContent(fileStream);

            var response = await httpClient.PostAsync($"storage/v1/object/{path}", content);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new Exception($"Ошибка загрузки: {response.StatusCode}, {error}");
            }
        }
    }
}
