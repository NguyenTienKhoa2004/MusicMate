// src/types/index.ts

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
    image: string; // Trong ví dụ của bạn là string (emoji), thực tế có thể là URL
}

export interface RecentUser {
    id: number;
    name: string;
    status: "online" | "offline"; // Chỉ cho phép 2 giá trị này
    avatar: string;
}