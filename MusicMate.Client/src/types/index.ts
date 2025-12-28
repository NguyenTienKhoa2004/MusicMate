export interface CurrentUser {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
}

export interface SearchResultUser {
    id: string;
    username: string;
    email: string;
    avatarUrl?: string;
}

export interface Song {
    id: number;
    title: string;
    artist: string;
    plays: string;
    image: string; 
}

export interface RecentUser {
    id: number;
    name: string;
    status: "online" | "offline";
    avatar: string;
}