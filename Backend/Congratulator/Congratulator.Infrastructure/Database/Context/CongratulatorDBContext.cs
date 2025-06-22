using Congratulator.Domain.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Congratulator.Infrastructure.Database.Context
{
    public class CongratulatorDBContext: DbContext
    {
        public CongratulatorDBContext(DbContextOptions<CongratulatorDBContext> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Person>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.BirthDate).IsRequired();
            });

            base.OnModelCreating(modelBuilder);
            //modelBuilder.ApplyConfigurationsFromAssembly(typeof(CongratulatorDBContext).Assembly);
        }
        public DbSet<Person> Persons { get; set; }
    }
}
