using MediatR;
using MusicMate.Application.Features.Users.DTOs; 
using System.Collections.Generic;

namespace MusicMate.Application.Features.Users.Queries
{
    public class SearchUsersQuery : IRequest<IEnumerable<UserSearchDto>>
    {
        public string SearchTerm { get; set; } 
        public Guid CurrentUserId { get; set; } 
        public int Limit { get; set; } = 20; 
    }
}