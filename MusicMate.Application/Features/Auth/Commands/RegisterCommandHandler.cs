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

    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, string>
    {
        private readonly IMusicMateDbContext _db;
        private readonly IConfiguration _config;
        private readonly IPasswordHasher _hasher;   

        public RegisterCommandHandler(
            IMusicMateDbContext db, 
            IConfiguration config,
            IPasswordHasher hasher)                 
        {
            _db = db;
            _config = config;
            _hasher = hasher;
        }

        public async Task<string> Handle(RegisterCommand request, CancellationToken ct)
        {
            var req = request.Request;

            bool exists = await _db.Users.AnyAsync(u =>
                u.Username.ToLower() == req.Username.ToLower() ||
                u.Email.ToLower() == req.Email.ToLower(), ct);

            if (exists)
                throw new Exception("Username hoặc Email đã tồn tại");

            var user = new User
            {
                Id = Guid.NewGuid(),
                Username = req.Username.Trim(),
                Email = req.Email.Trim().ToLower(),
                HashedPassword = _hasher.HashPassword(req.Password),
                DisplayName = req.DisplayName?.Trim() ?? req.Username,
                CreatedAt = DateTime.UtcNow
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync(ct);

            return GenerateJwtToken(user);
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _config.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.Username),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
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
    
