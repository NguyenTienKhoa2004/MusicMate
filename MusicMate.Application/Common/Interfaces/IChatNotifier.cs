namespace MusicMate.Application.Common.Interfaces;

public interface IChatNotifier
{
    Task SendMessageToUserAsync(string userId, object messageContent);
}