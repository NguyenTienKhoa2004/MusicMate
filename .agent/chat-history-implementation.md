# Chat History Feature Implementation

## Overview
Implemented chat history loading functionality so that when users reload the page or select a friend to chat with, they can see their previous conversation history from the database.

## What Was Added

### Backend Changes

#### 1. Query Handler (`GetChatHistoryQuery.cs`)
- **Location**: `MusicMate.Application/Features/Chat/Queries/`
- **Purpose**: MediatR query to request chat history between two users
- **Parameters**:
  - `UserId1`: First user ID
  - `UserId2`: Second user ID
  - `Limit`: Maximum number of messages to retrieve (default: 50)

#### 2. Query Handler Implementation (`GetChatHistoryQueryHandler.cs`)
- **Location**: `MusicMate.Application/Features/Chat/Queries/`
- **Purpose**: Handles the query and fetches messages from database
- **Logic**:
  - Queries messages where either user is sender/receiver
  - Includes sender information for display names and avatars
  - Orders messages chronologically (oldest first)
  - Maps to MessageDto format
  - Limits results to prevent performance issues

#### 3. API Endpoint (`ChatController.cs`)
- **Route**: `GET /api/Chat/history`
- **Authorization**: Required (Bearer token)
- **Query Parameters**:
  - `otherUserId`: The ID of the other user in the conversation
  - `limit`: Optional, defaults to 50 messages
- **Response**: List of MessageDto objects

### Frontend Changes

#### Updated `ChatRoom.tsx`
- **Function**: `handleSelectUser` is now async
- **New Behavior**:
  1. Clears current messages
  2. Fetches chat history from `/api/Chat/history` endpoint
  3. Maps backend response to frontend MessageDto format
  4. Loads messages into state
  5. Logs success/errors to console

## How It Works

### Flow Diagram
```
User selects friend to chat
    ↓
Frontend: handleSelectUser() called
    ↓
① Clear current messages
    ↓
② Call GET /api/Chat/history?otherUserId=xxx
    ↓
Backend: ChatController receives request
    ↓
③ Validate authentication
    ↓
④ Send GetChatHistoryQuery via MediatR
    ↓
⑤ Query database for messages between users
    ↓
⑥ Map to MessageDto with sender info
    ↓
⑦ Return JSON response
    ↓
Frontend: Receive history
    ↓
⑧ Format messages (set isSent flag)
    ↓
⑨ Load into realtimeMessages state
    ↓
✅ Chat history displayed!
```

## Database Query
The handler executes this query:
```sql
SELECT m.*, u.display_name, u.username, u.user_avatar
FROM Messages m
INNER JOIN Users u ON m.sender_id = u.id
WHERE (m.sender_id = @UserId1 AND m.receiver_id = @UserId2)
   OR (m.sender_id = @UserId2 AND m.receiver_id = @UserId1)
ORDER BY m.create_time ASC
LIMIT @Limit
```

## Message Format
Messages are returned in this format:
```json
{
  "id": 123,
  "sender_id": "guid-here",
  "receiver_id": "guid-here",
  "content": "Hello!",
  "sent_time": "2026-02-09T12:00:00Z",
  "sender_name": "John Doe",
  "sender_avatar": "👤"
}
```

## Testing
To test the feature:
1. Send some messages between two users
2. Reload the page
3. Select the same friend again
4. ✅ Previous messages should now appear!

## Benefits
- ✅ Messages persist across page reloads
- ✅ Users can see conversation history
- ✅ Follows existing CQRS pattern
- ✅ Properly authorized (requires login)
- ✅ Performance optimized (limited results)
- ✅ Includes sender information for proper display

## Future Enhancements
Consider adding:
- Pagination for very long conversations
- "Load more" button for older messages
- Message search functionality
- Date separators in chat UI
- Unread message indicators
