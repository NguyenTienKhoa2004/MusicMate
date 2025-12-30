using MediatR;
using MusicMate.Application.Features.Auth.Requests;

namespace MusicMate.Application.Features.Auth.Commands;

public record RegisterCommand(RegisterRequest Request) : IRequest<string>; 