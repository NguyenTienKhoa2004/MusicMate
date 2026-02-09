export interface CurrentUser {
    id: string;
    name: string;
    email: string;
}

export interface SearchUserResult {
    id: string;
    userId: string;
    displayName: string;
    username: string;
    email?: string;
    userAvatar?: string;
    isOnline?: boolean;
}

export interface MessageDto {
    sender_name: string;
    sender_id?: string;
    content: string;
    timestamp: string;
    isSent: boolean;
}
