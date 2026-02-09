import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Music, Send, Search, MoreVertical, MessageSquare, ArrowLeft, Users } from 'lucide-react';
import { useChatSignalR } from '../hooks/useChatSignalR';
import { type MessageDto, type CurrentUser, type SearchUserResult } from '../types/chat';

export function ChatRoom() {
    const [input, setInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchUserResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState<any>(null);
    const [currentUser, setCurrentUser] = useState<CurrentUser>({ id: "", name: "Khách", email: "" });
    const [suggestedUsers, setSuggestedUsers] = useState<SearchUserResult[]>([]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const userStr = localStorage.getItem("currentUser");
        if (userStr) {
            try {
                const parsedUser = JSON.parse(userStr) as CurrentUser;
                setCurrentUser(parsedUser);
            } catch (e) {
                console.error("Lỗi parse user:", e);
            }
        }
    }, []);

    const roomId = useMemo(() => {
        if (!selectedFriend || !currentUser.id) return null;
        const ids = [currentUser.id, selectedFriend.id].sort();
        return `${ids[0]}_${ids[1]}`;
    }, [selectedFriend, currentUser]);

    const { realtimeMessages, setRealtimeMessages } = useChatSignalR(roomId, currentUser.id);
    useEffect(() => {

        const emptyGuid = "00000000-0000-0000-0000-000000000000";
        const currentUserId = currentUser?.id || emptyGuid;
        const fetchSuggestedUsers = async () => {
            try {
                const response = await fetch(`/api/Users?currentUserId=${currentUserId}&limit=20`);

                if (response.ok) {
                    const data = await response.json();
                    const filtered = data.filter((u: any) => u.id !== currentUser.id && u.userId !== currentUser.id);
                    setSuggestedUsers(filtered);
                }
            } catch (error) {
                console.error("Lỗi lấy danh sách user mặc định:", error);
            }
        };

        if (currentUser.id) {
            fetchSuggestedUsers();
        }
    }, [currentUser.id]);

    useEffect(() => {
        const emptyGuid = "00000000-0000-0000-0000-000000000000";
        const currentUserId = currentUser?.id || emptyGuid;

        const searchUsers = async () => {
            if (!searchQuery.trim()) {
                setSearchResults([]);
                return;
            }
            setIsSearching(true);
            try {
                const response = await fetch(
                    `/api/Users/search?searchTerm=${encodeURIComponent(searchQuery)}&currentUserId=${currentUserId}&limit=5`
                );
                if (response.ok) {
                    const data = await response.json();
                    setSearchResults(data);
                }
            } catch (error) {
                console.error("Lỗi tìm kiếm:", error);
            } finally {
                setIsSearching(false);
            }
        };

        const timeoutId = setTimeout(() => {
            searchUsers();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, currentUser]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [realtimeMessages]);

    const handleSelectUser = async (user: SearchUserResult) => {
        setSelectedFriend({
            id: user.userId || user.id,
            name: user.displayName || user.username,
            avatar: user.userAvatar || '👤',
            status: user.isOnline ? 'online' : 'offline'
        });

        setSearchQuery("");
        setSearchResults([]);

        setRealtimeMessages([]);

        const token = localStorage.getItem("accessToken");
        if (token && currentUser.id) {
            try {
                const response = await fetch(
                    `/api/Chat/history?otherUserId=${user.userId || user.id}&limit=50`,
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );

                if (response.ok) {
                    const history = await response.json();

                    const formattedMessages: MessageDto[] = history.map((msg: any) => ({
                        sender_name: msg.sender_name,
                        sender_id: msg.sender_id,
                        content: msg.content,
                        timestamp: msg.sent_time,
                        isSent: msg.sender_id === currentUser.id
                    }));

                    setRealtimeMessages(formattedMessages);
                    console.log(`Loaded ${formattedMessages.length} messages from history`);
                } else {
                    console.error("Failed to load chat history");
                }
            } catch (error) {
                console.error("Error loading chat history:", error);
            }
        }
    };

    const handleSend = async () => {
        if (!input.trim() || !selectedFriend) return;

        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("Bạn chưa đăng nhập!");
            return;
        }

        const msgContent = input;

        const optimisticMsg: MessageDto = {
            sender_name: 'Bạn',
            sender_id: currentUser.id,
            content: msgContent,
            timestamp: new Date().toISOString(),
            isSent: true
        };

        setRealtimeMessages(prev => [...prev, optimisticMsg]);
        setInput("");

        try {
            const response = await fetch("/api/Chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    receiverId: selectedFriend.id,
                    content: msgContent
                })
            });

            if (!response.ok) {
                console.error("Gửi tin nhắn thất bại");
            }
        } catch (error) {
            console.error("Lỗi mạng:", error);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-green-950 flex overflow-hidden">

            <div className="w-80 bg-gray-900/50 backdrop-blur-sm border-r border-green-500/20 flex flex-col">

                <div className="p-6 border-b border-gray-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                            <Music className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-white">Tin nhắn</h1>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Tìm người dùng..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {searchQuery ? (
                        <div className="p-2">
                            <p className="px-4 py-2 text-xs text-gray-400 uppercase font-bold">Kết quả tìm kiếm</p>
                            {isSearching ? (
                                <p className="text-center text-gray-500 py-4">Đang tìm...</p>
                            ) : searchResults.length > 0 ? (
                                searchResults.map((user) => (
                                    <button
                                        key={user.id || user.userId}
                                        onClick={() => handleSelectUser(user)}
                                        className="w-full p-3 flex items-center gap-3 hover:bg-gray-800/50 rounded-lg transition"
                                    >
                                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-xl">
                                            {user.userAvatar || '👤'}
                                        </div>
                                        <div className="text-left">
                                            <p className="font-semibold text-white text-sm">
                                                {user.displayName || user.username}
                                            </p>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 py-4">
                                    Không tìm thấy ai tên là "{searchQuery}"
                                </p>
                            )}
                        </div>
                    ) : (

                        <div className="p-2">
                            <div className="flex items-center gap-2 px-4 py-2 mb-2">
                                <Users className="w-4 h-4 text-green-500" />
                                <p className="text-xs text-gray-400 uppercase font-bold">Tất cả mọi người</p>
                            </div>

                            {suggestedUsers.length > 0 ? (
                                suggestedUsers.map((user) => (
                                    <button
                                        key={user.id || user.userId}
                                        onClick={() => handleSelectUser(user)}
                                        className="w-full p-3 flex items-center gap-3 hover:bg-gray-800/50 rounded-lg transition group"
                                    >
                                        <div className="w-10 h-10 bg-gray-800 group-hover:bg-gray-700 rounded-full flex items-center justify-center text-xl border border-gray-700">
                                            {user.userAvatar || '👤'}
                                        </div>
                                        <div className="text-left flex-1">
                                            <p className="font-semibold text-white text-sm group-hover:text-green-400 transition">
                                                {user.displayName || user.username}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {user.email || "Sẵn sàng trò chuyện"}
                                            </p>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center h-40 text-gray-500 text-center">
                                    <p className="text-sm">Không có người dùng nào</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 flex flex-col">
                {selectedFriend ? (
                    <>
                        <div className="h-16 bg-gray-900/30 border-b border-gray-800 flex items-center justify-between px-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-lg">
                                    {selectedFriend.avatar}
                                </div>
                                <div>
                                    <h2 className="font-bold text-white">{selectedFriend.name}</h2>
                                    <div className="flex items-center gap-1">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-xs text-gray-400">Đang hoạt động</span>
                                    </div>
                                </div>
                            </div>
                            <MoreVertical className="text-gray-400 cursor-pointer" />
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {realtimeMessages.length === 0 ? (
                                <div className="text-center text-gray-500 mt-10">
                                    <p>Hãy gửi lời chào tới {selectedFriend.name} 👋</p>
                                </div>
                            ) : (
                                realtimeMessages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${msg.isSent ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div
                                            className={`max-w-md px-4 py-2 rounded-2xl break-words ${msg.isSent
                                                ? 'bg-green-600 text-white'
                                                : 'bg-gray-800 text-gray-200'
                                                }`}
                                        >
                                            <p className="text-sm">{msg.content}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="mx-6 mb-8 p-4 bg-gray-900/80 backdrop-blur-xl border border-white/5 rounded-3xl flex gap-3 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-green-500/15 hover:border-green-500/30 group">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Nhập tin nhắn..."
                                className="flex-1 bg-gray-800/50 text-white px-6 py-3 rounded-2xl focus:outline-none focus:ring-1 focus:ring-green-500/50 border border-white/5 placeholder-gray-500 transition-all"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim()}
                                className="p-4 bg-green-600 rounded-2xl hover:bg-green-500 transition-all duration-300 active:scale-90 disabled:opacity-50 shadow-lg shadow-green-500/20 group-hover:shadow-green-500/40 flex items-center justify-center"
                            >
                                <Send className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                        <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
                        <p>Chọn một người để bắt đầu chat</p>
                    </div>
                )}
            </div>
        </div>
    );
}