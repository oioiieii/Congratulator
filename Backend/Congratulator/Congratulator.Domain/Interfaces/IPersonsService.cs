using Congratulator.Domain.Models;

namespace Congratulator.Domain.Interfaces
{
    public interface IPersonsService
    {
        Task<Guid> Add(Person newPerson);
        Task Delete(Guid id);
        Task<IEnumerable<Person>> GetAll();
        Task<Person> GetById(Guid id);
        Task<IEnumerable<Person>> GetApproachingBirthdays(int daysAhead);
        Task<IEnumerable<Person>> GetUpcomingBirthdays(int countBirthdays);
        Task<IEnumerable<Person>> GetPersonsByBirthDate(DateOnly birthDate);
        Task<IEnumerable<Person>> GetPersonsByMonth(int birthMonth);
        Task Update(Guid id, string? name, DateOnly? birthDate, string? avatarUrl);
    }
}