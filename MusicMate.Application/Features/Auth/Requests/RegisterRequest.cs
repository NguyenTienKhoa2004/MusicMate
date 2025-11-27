using System.ComponentModel.DataAnnotations;

namespace MusicMate.Application.Features.Auth.Requests;

public record RegisterRequest(
    [Required] string Username,
    [Required] [EmailAddress] string Email,
    [Required] [MinLength(6)] string Password,
    string? DisplayName = null
);

