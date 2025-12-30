using MediatR;
using MusicMate.Application.Features.Auth.Requests;
using MusicMate.Application.Features.Auth.DTOs; 

namespace MusicMate.Application.Features.Auth.Commands;

public record LoginCommand(LoginRequest LoginRequest) : IRequest<AuthDto>;