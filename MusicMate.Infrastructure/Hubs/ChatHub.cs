using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;

namespace MusicMate.Infrastructure.Hubs;

[Authorize] // Bắt buộc đăng nhập mới được kết nối socket
public class ChatHub : Hub
{
    // Hàm này được gọi khi Client (Frontend) muốn tham gia vào một "phòng chat" cụ thể
    // Ví dụ: Khi bấm vào cuộc trò chuyện với user A, Client gửi roomId = "Group_UserA_UserB"
    public async Task JoinChatRoom(string roomId)
    {
        // ConnectionId là ID duy nhất của cái tab trình duyệt đang mở
        await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
    }
    
    // Hàm này chạy khi User vừa kết nối (F5 trang hoặc mở App)
    public override async Task OnConnectedAsync()
    {
        // Có thể lưu trạng thái "Online" vào DB tại đây
        var userId = Context.UserIdentifier;
        await base.OnConnectedAsync();
    }
    
    // Hàm này chạy khi User mất kết nối (Tắt tab, rớt mạng)
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        // Có thể lưu trạng thái "Offline" vào DB tại đây
        await base.OnDisconnectedAsync(exception);
    }
}