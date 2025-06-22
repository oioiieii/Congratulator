using Congratulator.Application.Services;
using Congratulator.Domain.Interfaces;
using Congratulator.Domain.Services;
using Congratulator.Infrastructure.Database.Context;
using Congratulator.Infrastructure.Database.Repositories;
using Congratulator.Infrastructure.Storage;
using Congratulator.Infrastructure.TelegramBot;
using Microsoft.EntityFrameworkCore;
using System.Net.Http.Headers;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddDbContext<CongratulatorDBContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IPersonsRepository, PersonsRepository>();
builder.Services.AddScoped<IPersonsService, PersonsService>();

builder.Services.AddHttpClient<IStorageService, SupabaseStorageService>(client =>
{
    client.BaseAddress = new Uri(builder.Configuration["StorageStrings:Url"] ?? "");
    client.DefaultRequestHeaders.Authorization =
        new AuthenticationHeaderValue("Bearer", builder.Configuration["StorageStrings:API_Keys"] ?? "");
});

builder.Services.AddSingleton<ISenderService, TelegramSenderService>();
builder.Services.AddSingleton<INotifierService, NotifierService>();
builder.Services.AddSingleton<ISettingsService, SettingsService>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");

app.UseAuthorization();

app.MapControllers();

var notifierService = app.Services.GetRequiredService<INotifierService>();

app.Run();

//Я так и не понял надо остановить сервис перед завершением или нет
/*app.Lifetime.ApplicationStopping.Register(() =>
{
    app.Services.GetRequiredService<INotifierService>().Stop();
});*/
