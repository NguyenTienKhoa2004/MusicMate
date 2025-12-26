using System;

namespace MusicMate.Application.Features.Users.DTOs
{
    public class UserSearchDto
    {
        public Guid UserId { get; set; } 
        public string Username { get; set; } = string.Empty;
        public string? DisplayName { get; set; } 
        public string? UserAvatar { get; set; } // <--- THÊM DÒNG NÀY
        public bool IsOnline { get; set; }
    }
}