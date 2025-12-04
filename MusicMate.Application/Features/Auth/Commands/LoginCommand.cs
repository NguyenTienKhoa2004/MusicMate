using MediatR;
using MusicMate.Application.Features.Auth.Requests;

namespace MusicMate.Application.Features.Auth.Commands;

public record LoginCommand(LoginRequest LoginRequest) : IRequest<string>;