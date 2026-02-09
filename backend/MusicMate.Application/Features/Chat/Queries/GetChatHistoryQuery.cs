using MediatR;
using MusicMate.Application.Features.Chat.DTOs;

namespace MusicMate.Application.Features.Chat.Queries;

public record GetChatHistoryQuery(Guid UserId1, Guid UserId2, int Limit = 50) : IRequest<List<MessageDto>>;
