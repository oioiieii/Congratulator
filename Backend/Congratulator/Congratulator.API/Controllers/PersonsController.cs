using Congratulator.API.Contracts;
using Congratulator.Domain.Interfaces;
using Congratulator.Domain.Models;
using Congratulator.Domain.Services;
using Microsoft.AspNetCore.Mvc;
using System;
using Telegram.Bot.Types;

namespace Congratulator.API.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class PersonsController : ControllerBase
    {
        private readonly IPersonsService personsService;
        private readonly IStorageService storageService;

        public PersonsController(IPersonsService personsService, IStorageService storageService)
        {
            this.personsService = personsService;
            this.storageService = storageService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<PersonAnswer>>> GetAll()
        {
            var persons = await personsService.GetAll();
            var answers = persons.Select(MapToAnswer);
            return Ok(answers);
        }

        [HttpGet("{id}")]
        public async Task<PersonAnswer> GetById(Guid id)
        {
            var person = await personsService.GetById(id);
            return MapToAnswer(person);
        }

        [HttpGet("by-date/{birthDate}")]
        public async Task<ActionResult<IEnumerable<PersonAnswer>>> GetPersonsByBirthDate(DateOnly birthDate)
        {
            var persons = await personsService.GetPersonsByBirthDate(birthDate);
            var answers = persons.Select(MapToAnswer);
            return Ok(answers);
        }

        [HttpGet("by-mounth/{birthMounth}")]
        public async Task<ActionResult<IEnumerable<Person>>> GetPersonsByMonth(int birthMounth)
        {
            if(birthMounth < 1 || birthMounth > 12)
            {
                return BadRequest("Uncorrect num of mounth!");
            }

            var persons = await personsService.GetPersonsByMonth(birthMounth);
            var answers = persons.Select(MapToAnswer);
            return Ok(answers);
        }

        [HttpGet("approaching-birthdays/{daysAhead}")]
        public async Task<ActionResult<IEnumerable<Person>>> GetApproachingBirthdays(int daysAhead)
        {
            if(daysAhead < 1)
            {
                BadRequest("Days ahead must be more than 0!");
            }

            var persons = await personsService.GetApproachingBirthdays(daysAhead);
            var answers = persons.Select(MapToAnswer);
            return Ok(answers);
        }

        [HttpGet("upcoming-birthdays/{countBirthdays}")]
        public async Task<ActionResult<IEnumerable<Person>>> GetUpcomingBirthdays(int countBirthdays)
        {
            if (countBirthdays < 1)
            {
                BadRequest("Count persons must be more than 0!");
            }

            var persons = await personsService.GetUpcomingBirthdays(countBirthdays);
            var answers = persons.Select(MapToAnswer);
            return Ok(answers);
        }

        [HttpPost]
        public async Task<ActionResult<Guid>> Create([FromForm] PersonRequest request)
        {
            var (person, error) = Person.Create(
                Guid.NewGuid(),
                request.Name,
                request.BirthDate);

            if (!string.IsNullOrEmpty(error))
            {
                return BadRequest(error);
            }

            //Если аватар не пустой то мы загружаем сначала его в Supabase,
            if(request.Avatar != null)
            {
                string path = $"/avatar-persons/avatar{person!.Id}.png";
                await storageService.UploadFile(request.Avatar.OpenReadStream(), path);
                person.AvatarUrl = path;
            }

            return Ok(await personsService.Add(person!));
        }

        [HttpDelete]
        public async Task Delete(Guid id)
        {
            await personsService.Delete(id);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(Guid id, [FromForm] PersonRequest request)
        {
            //Если аватар не пустой то мы загружаем сначала его в Supabase,
            string? avatarUrl = null;
            if (request.Avatar != null)
            {
                string path = $"/avatar-persons/avatar{id}.png";
                await storageService.UploadFile(request.Avatar.OpenReadStream(), path);
                avatarUrl = path;
            }

            await personsService.Update(id, request.Name, request.BirthDate, avatarUrl);

            return Ok();
        }

        private PersonAnswer MapToAnswer(Person person)
        {
            return new PersonAnswer(person.Id,person.Name, person.BirthDate, string.IsNullOrEmpty(person.AvatarUrl)
                    ? null
                    : $"{storageService.BaseUrl}{person.AvatarUrl.TrimStart('/')}");
        }
    }
}
