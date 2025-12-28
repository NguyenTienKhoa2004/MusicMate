using MediatR;
using Microsoft.EntityFrameworkCore;
using MusicMate.Application.Common.Interfaces;
using MusicMate.Application.Features.Users.DTOs;

namespace MusicMate.Application.Features.Users.Queries
{

    public class GetAllUsersQueryHandler(IMusicMateDbContext db) : IRequestHandler<GetAllUsersQuery, IEnumerable<UserSearchDto>>
    {
        public async Task<IEnumerable<UserSearchDto>> Handle(GetAllUsersQuery request, CancellationToken cancellationToken)
        {
            var query = db.Users.AsNoTracking();
            
            if (request.CurrentUserId.HasValue)
            {
                query = query.Where(u => u.id != request.CurrentUserId.Value);
            }
            
            var users = await query
                .OrderBy(u => u.username) 
                .Take(request.Limit)
                .Select(u => new UserSearchDto 
                {
                    
                    UserId = u.id,
                    Username = u.username,
                    DisplayName = u.display_name ?? u.username, 
                    UserAvatar = u.user_avatar,
                    IsOnline = u.IsOnline
                })
                .ToListAsync(cancellationToken);

            return users;
        }
    }
}