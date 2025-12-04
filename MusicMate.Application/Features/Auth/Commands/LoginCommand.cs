using MediatR;
using MusicMate.Application.Features.Auth.Requests;

namespace MusicMate.Application.Features.Auth.Commands;

// Command nhận vào LoginRequest và trả về string (JWT Token)
public record LoginCommand(LoginRequest LoginRequest) : IRequest<string>;