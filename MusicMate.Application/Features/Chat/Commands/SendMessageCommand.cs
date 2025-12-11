using MediatR;
using MusicMate.Application.Features.Chat.Requests;
using MusicMate.Application.Features.Chat.DTOs;

namespace MusicMate.Application.Features.Chat.Commands;

public record SendMessageCommand(SendMessageRequest Request, Guid sender_id) : IRequest<MessageDto>;