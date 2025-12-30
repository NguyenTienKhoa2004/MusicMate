using MediatR;
using Microsoft.EntityFrameworkCore;
using MusicMate.Application.Common.Interfaces;
using MusicMate.Application.Features.Users.DTOs;

namespace MusicMate.Application.Features.Users.Queries
{
    public class SearchUsersQueryHandler(IMusicMateDbContext db) : IRequestHandler<SearchUsersQuery, IEnumerable<UserSearchDto>>
    {
        public async Task<IEnumerable<UserSearchDto>> Handle(SearchUsersQuery request, CancellationToken cancellationToken)
        {
            var searchTerm = request.SearchTerm?.ToLower() ?? string.Empty;

            var users = await db.Users
                .Where(u => u.id != request.CurrentUserId) 
                .Where(u => u.username.ToLower().Contains(searchTerm)) 
                .OrderBy(u => u.username) 
                .Take(request.Limit)
                .Select(u => new UserSearchDto
                {
                    UserId = u.id,
                    Username = u.username,
                    DisplayName = u.display_name, 
                    UserAvatar = u.user_avatar,   
                    IsOnline = u.IsOnline
                })
                .ToListAsync(cancellationToken);

            return users;
        }
    }
}