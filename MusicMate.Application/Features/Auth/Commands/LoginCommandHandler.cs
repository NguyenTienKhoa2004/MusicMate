using MediatR;
using Microsoft.EntityFrameworkCore;
using MusicMate.Domain.Entities;
using MusicMate.Application.Common.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration; 
using System.Security.Claims;
using System.Text;
using BCrypt.Net;


namespace MusicMate.Application.Features.Auth.Commands;

public class LoginCommandHandler(IMusicMateDbContext _db, IConfiguration _config) : IRequestHandler<LoginCommand, string>
{
    public async Task<string> Handle(LoginCommand command, CancellationToken cancellationToken)
    {
        var request = command.LoginRequest;
        
        var user = await _db.Users.FirstOrDefaultAsync(u => u.email == request.Email);
        
        if (user == null)
        {
            throw new Exception("User not found / Invalid credentials"); 
        }
        bool isPasswordValid = VerifyPassword(request.Password, user.hashed_password);
        
        if (!isPasswordValid)
        {
            throw new Exception("Invalid credentials");
        }
        string token = GenerateJwtToken(user);

        return token;
    }
    
    private bool VerifyPassword(string inputPassword, string storedHash)
    {
        return BCrypt.Net.BCrypt.Verify(inputPassword, storedHash);
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSettings = _config.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.id.ToString()),
            new Claim(JwtRegisteredClaimNames.UniqueName, user.username),
            new Claim(JwtRegisteredClaimNames.Email, user.email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience: jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.Now.AddDays(30),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}