using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Congratulator.Domain.Models
{
    public class Person
    {
        public const int MAX_LENGTH_NAME = 255;
        public Person(Guid Id, string Name, DateOnly BirthDate)
        {
            this.Id = Id;
            this.Name = Name;
            this.BirthDate = BirthDate;
        }

        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateOnly BirthDate { get; set; } = DateOnly.FromDateTime(DateTime.Today);

        public string? AvatarUrl { get; set; }

        public static (Person?, string?) Create(Guid Id, string Name, DateOnly BirthDate)
        {
            var error = string.Empty;
            Person? person = null;

            //Валидация для свойств
            if (string.IsNullOrEmpty(Name) || Name.Length > MAX_LENGTH_NAME)
            {
                error = $"Name can't be empty or higher than {MAX_LENGTH_NAME} characters!";
            }
            else
            {
                person = new Person(
                    Id,
                    Name,
                    BirthDate);
            }

            return (person, error);
        }
    }
}
