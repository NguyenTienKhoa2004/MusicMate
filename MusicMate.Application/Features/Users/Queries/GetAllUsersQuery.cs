using MediatR;
using MusicMate.Application.Features.Users.DTOs; 


namespace MusicMate.Application.Features.Users.Queries
{
    public class GetAllUsersQuery : IRequest<IEnumerable<UserSearchDto>>
    {
        public int Limit { get; set; } = 20; 
        public Guid? CurrentUserId { get; set; } 

        public GetAllUsersQuery(int limit, Guid? currentUserId)
        {
            Limit = limit;
            CurrentUserId = currentUserId;
        }
    }
}