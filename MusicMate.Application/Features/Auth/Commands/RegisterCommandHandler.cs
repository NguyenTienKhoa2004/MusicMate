using MusicMate.Application.Contracts;
using MediatR;
using Microsoft.EntityFrameworkCore;
using MusicMate.Domain.Entities;
using MusicMate.Application.Common.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration; 
using System.Security.Claims;
using System.Text;


namespace MusicMate.Application.Features.Auth.Commands;

    public class RegisterCommandHandler(IMusicMateDbContext db, IConfiguration config, IPasswordHasher hasher) : IRequestHandler<RegisterCommand, string>
    {
        public async Task<string> Handle(RegisterCommand request, CancellationToken ct)
        {
            var req = request.Request;

            bool exists = await db.Users.AnyAsync(u =>
                u.username.ToLower() == req.Username.ToLower() ||
                u.email.ToLower() == req.Email.ToLower(), ct);

            if (exists)
                throw new Exception("Username hoặc Email đã tồn tại");

            var user = new User
            {
                id = Guid.NewGuid(),
                username = req.Username.Trim(),
                email = req.Email.Trim().ToLower(),
                hashed_password = hasher.HashPassword(req.Password),
                display_name = req.DisplayName?.Trim() ?? req.Username,
                create_time = DateTime.UtcNow
            };

            db.Users.Add(user);
            await db.SaveChangesAsync(ct);

            return GenerateJwtToken(user);
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = config.GetSection("Jwt");
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
    
