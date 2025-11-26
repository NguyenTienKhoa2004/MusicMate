using BCrypt.Net;
using MusicMate.Application.Contracts;

namespace MusicMate.Infrastructure.Services;

public class BCryptPasswordHasher : IPasswordHasher
{
    public string HashPassword(string password) 
        => BCrypt.Net.BCrypt.HashPassword(password);

    public bool VerifyPassword(string password, string hash) 
        => BCrypt.Net.BCrypt.Verify(password, hash);
}