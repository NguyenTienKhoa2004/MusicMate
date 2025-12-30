namespace MusicMate.Application.Features.Matching.DTOs;

public class MatchCandidateDto
{
    public Guid UserId { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public string? UserAvatar { get; set; } 
    public int MatchPercentage { get; set; } 
    public List<string> CommonGenres { get; set; } = new(); 
}