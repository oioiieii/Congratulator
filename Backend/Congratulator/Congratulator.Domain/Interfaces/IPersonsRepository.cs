using Congratulator.Domain.Models;

namespace Congratulator.Domain.Interfaces
{
    public interface IPersonsRepository
    {
        public Task<IEnumerable<Person>> GetAll();
        public Task<Person> GetById(Guid id);
        public Task<Guid> Add(Person person);
        public Task Update(Person person);
        public Task Delete(Guid id);
    }
}
