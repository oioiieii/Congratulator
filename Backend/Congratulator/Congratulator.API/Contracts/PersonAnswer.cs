namespace Congratulator.API.Contracts
{
    public record PersonAnswer(
        Guid Id,
        string Name,
        DateOnly BirthDate,
        string? AvatarUrl);
}
