namespace Congratulator.API.Contracts
{
    public record PersonRequest(
        string Name,
        DateOnly BirthDate,
        IFormFile? Avatar);
}
