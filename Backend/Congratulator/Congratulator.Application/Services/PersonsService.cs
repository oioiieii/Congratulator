using Congratulator.Domain.Interfaces;
using Congratulator.Domain.Models;

namespace Congratulator.Application.Services
{
    public class PersonsService : IPersonsService
    {
        private readonly IPersonsRepository personsRepository;

        public PersonsService(IPersonsRepository personsRepository)
        {
            this.personsRepository = personsRepository;
        }

        public async Task<IEnumerable<Person>> GetAll()
        {
            return (await personsRepository.GetAll())
                .OrderBy(p => new DateOnly(1, p.BirthDate.Month, p.BirthDate.Day)); ;
        }

        public async Task<Person> GetById(Guid id)
        {
            return await personsRepository.GetById(id);
        }

        //Наступающие дни рождения (daysAhead - максимальная разница в днях)
        public async Task<IEnumerable<Person>> GetApproachingBirthdays(int daysAhead)
        {
            var allPersons = await personsRepository.GetAll();
            var today = DateTime.Today;

            var upcomingDates = Enumerable.Range(0, daysAhead + 1)
                .Select(offset => today.AddDays(offset + 1))
                .Select(date => (date.Month, date.Day)).ToList();

            var comingBirthdayPersons = allPersons
                .Where(p => upcomingDates.Contains((p.BirthDate.Month, p.BirthDate.Day)))
                .OrderBy(p => new DateOnly(1, p.BirthDate.Month, p.BirthDate.Day)) 
                .ToList();

            return comingBirthdayPersons;
        }

        //Ближайшие дни рождения (countBirthdays - сколько ближайших дней рождений вывести)
        public async Task<IEnumerable<Person>> GetUpcomingBirthdays(int countBirthdays)
        {
            var allPersons = (await personsRepository.GetAll())
                .OrderBy(p => new DateOnly(1, p.BirthDate.Month, p.BirthDate.Day));
            var today = DateTime.Today;

            var sortedPersons = allPersons
                .SkipWhile(p => p.BirthDate.Month < today.Month || (p.BirthDate.Month == today.Month && p.BirthDate.Day <= today.Day));

            if(sortedPersons.ToList().Count < countBirthdays)
            {
                foreach (var person in allPersons.TakeWhile(p => p.BirthDate.Month < today.Month || (p.BirthDate.Month == today.Month && p.BirthDate.Day <= today.Day)))
                {
                    sortedPersons.Append(person);
                }
            }

            return sortedPersons.Take(countBirthdays);
        }

        //Если все таки реализую календарь 
        public async Task<IEnumerable<Person>> GetPersonsByBirthDate(DateOnly birthDate)
        {
            var personsByBirthDate = (await personsRepository.GetAll())
                .Where(p => p.BirthDate.Month == birthDate.Month && p.BirthDate.Day == birthDate.Day)
                .OrderBy(p => new DateOnly(1, p.BirthDate.Month, p.BirthDate.Day));

            return personsByBirthDate;
        }

        //Если все таки реализую календарь 
        public async Task<IEnumerable<Person>> GetPersonsByMonth(int birthMonth)
        {
            var personsByMonth = (await personsRepository.GetAll())
                .Where(p => p.BirthDate.Month == birthMonth)
                .OrderBy(p => new DateOnly(1, p.BirthDate.Month, p.BirthDate.Day));

            return personsByMonth;
        }

        public async Task<Guid> Add(Person newPerson)
        {
            return await personsRepository.Add(newPerson);
        }

        public async Task Delete(Guid id)
        {
            await personsRepository.Delete(id);
        }

        public async Task Update(Guid id, string? name, DateOnly? birthDate, string? avatarUrl)
        {
            var person = await personsRepository.GetById(id);

            person.Name = name ?? person.Name;
            person.BirthDate = birthDate ?? person.BirthDate;
            person.AvatarUrl = avatarUrl;

            await personsRepository.Update(person);
        }
    }
}
