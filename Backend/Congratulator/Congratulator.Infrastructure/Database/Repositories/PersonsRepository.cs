using Congratulator.Domain.Interfaces;
using Congratulator.Domain.Models;
using Congratulator.Infrastructure.Database.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Congratulator.Infrastructure.Database.Repositories
{
    public class PersonsRepository : IPersonsRepository
    {
        public PersonsRepository(CongratulatorDBContext context)
        {
            this.context = context;
        }

        private readonly CongratulatorDBContext context;

        public async Task<Guid> Add(Person person)
        {
            await context.AddAsync(person);
            await context.SaveChangesAsync();

            return person.Id;
        }

        public async Task Delete(Guid id)
        {
            Person person = await context.Persons
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id) 
                ?? throw new Exception("Person not find");

            context.Remove(person);
            await context.SaveChangesAsync();
        }

        public async Task<IEnumerable<Person>> GetAll()
        {
            return await context.Persons
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Person> GetById(Guid id)
        {
            return await context.Persons
                .AsNoTracking()
                .FirstOrDefaultAsync(e => e.Id == id)
                ?? throw new Exception($"Person with ID {id} not found.");
        }

        public async Task Update(Person person)
        {
            context.Update(person);
            await context.SaveChangesAsync();
        }
    }
}
