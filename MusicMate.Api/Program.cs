using MusicMate.Infrastructure.Persistence;
using MusicMate.Application.Common.Interfaces; 
using MusicMate.Application.Features.Auth.Commands; 
using Microsoft.EntityFrameworkCore;
using System.Reflection; 

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<MusicMateDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IMusicMateDbContext>(provider => 
    provider.GetRequiredService<MusicMateDbContext>());

builder.Services.AddMediatR(cfg => {
    cfg.RegisterServicesFromAssembly(typeof(RegisterCommandHandler).Assembly);
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<MusicMateDbContext>();
    db.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();

app.Run();