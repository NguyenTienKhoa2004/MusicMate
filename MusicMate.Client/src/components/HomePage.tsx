import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Search, Home, Users, Heart, Settings, User, LogOut, TrendingUp, LogIn, Loader2 } from 'lucide-react';
import { SongCard } from './SongCard'; 
import { UserCard } from './UserCard';
import { CurrentUser, SearchResultUser, Song, RecentUser } from '../types'; // Import types

export function HomePage() {
    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [activeNav, setActiveNav] = useState<string>("home");
    const [currentUser, setCurrentUser] = useState<CurrentUser>({ id: "", name: "Khách", email: "" });
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const [searchResults, setSearchResults] = useState<SearchResultUser[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);

    // REF: Khai báo Ref trỏ vào thẻ DIV
    const searchRef = useRef<HTMLDivElement>(null);

    // DATA MẪU: Khai báo mảng với Type chuẩn
    const trendingSongs: Song[] = [
        { id: 1, title: "Nơi Này Có Anh", artist: "Sơn Tùng M-TP", plays: "2.5M", image: "🎵" },
        { id: 2, title: "See Tình", artist: "Hoàng Thùy Linh", plays: "1.8M", image: "🎵" },
        { id: 3, title: "Có Chắc Yêu Là Đây", artist: "Sơn Tùng M-TP", plays: "3.2M", image: "🎵" },
        { id: 4, title: "Anh Đã Quen Với Cô Đơn", artist: "Soobin Hoàng Sơn", plays: "1.5M", image: "🎵" },
    ];

    const recentUsers: RecentUser[] = [
        { id: 1, name: "Minh Anh", status: "online", avatar: "👤" },
        { id: 2, name: "Thuỳ Linh", status: "offline", avatar: "👤" },
        { id: 3, name: "Hoàng Nam", status: "online", avatar: "👤" },
        { id: 4, name: "Mai Phương", status: "online", avatar: "👤" },
    ];

    // EFFECTS
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const userStr = localStorage.getItem("currentUser");
        if (token && userStr) {
            setIsLoggedIn(true);
            try {
                const parsedUser = JSON.parse(userStr) as CurrentUser;
                setCurrentUser(parsedUser);
            } catch (e) {
                console.error("Lỗi parse user", e);
            }
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            // Kiểm tra type an toàn cho node
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            if (!searchQuery.trim()) {
                setSearchResults([]);
                return;
            }

            setIsSearching(true);
            setShowDropdown(true);

            try {
                const baseUrl = "http://localhost:5137";
                const emptyGuid = "00000000-0000-0000-0000-000000000000";
                const currentUserId = currentUser?.id || emptyGuid;

                const response = await fetch(
                    `${baseUrl}/api/Users/search?searchTerm=${encodeURIComponent(searchQuery)}&currentUserId=${currentUserId}&limit=5`
                );

                if (response.ok) {
                    // Ép kiểu dữ liệu trả về từ API
                    const data = await response.json() as SearchResultUser[];
                    setSearchResults(data);
                }
            } catch (error) {
                console.error("Lỗi tìm kiếm:", error);
            } finally {
                setIsSearching(false);
            }
        };

        const timeoutId = setTimeout(() => {
            if (searchQuery) fetchUsers();
            else {
                setSearchResults([]);
                setShowDropdown(false);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, currentUser.id]);

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("currentUser");
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <div className="h-screen overflow-hidden bg-gradient-to-br from-black via-gray-900 to-green-950 flex">
            {/* SIDEBAR */}
            <div className="w-72 bg-gray-900/50 backdrop-blur-sm border-r border-green-500/20 p-6 flex flex-col shrink-0">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50">
                        <Music className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">MusicMate</h1>
                        <p className="text-xs text-green-400">Find your music besties</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-2 overflow-y-auto">
                    {[
                        { id: 'home', icon: Home, label: 'Trang chủ' },
                        { id: 'discover', icon: TrendingUp, label: 'Khám phá' },
                        { id: 'friends', icon: Users, label: 'Bạn bè' },
                        { id: 'favorites', icon: Heart, label: 'Yêu thích' },
                        { id: 'settings', icon: Settings, label: 'Cài đặt' },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveNav(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeNav === item.id ? "bg-green-500/20 text-green-400" : "text-gray-400 hover:bg-gray-800/50 hover:text-white"}`}
                        >
                            <item.icon className="w-5 h-5" /> <span className="font-medium">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="pt-6 border-t border-gray-800 mt-auto">
                    {isLoggedIn ? (
                        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-800/50">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="text-sm font-medium text-white truncate">{currentUser.name}</p>
                                <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
                            </div>
                            <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 transition" title="Đăng xuất">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => navigate('/login')} className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-green-600 hover:bg-green-500 text-white transition shadow-lg shadow-green-900/20 group">
                            <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            <span className="font-medium">Đăng nhập ngay</span>
                        </button>
                    )}
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 overflow-y-auto h-full relative">

                {/* SEARCH BAR */}
                <div className="bg-gray-900/80 backdrop-blur-md border-b border-green-500/20 p-8 sticky top-0 z-20">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-white mb-6">Tìm kiếm người dùng</h2>
                        <div className="relative" ref={searchRef}>
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    setSearchQuery(e.target.value);
                                    if(e.target.value) setShowDropdown(true);
                                }}
                                onFocus={() => {
                                    if(searchQuery) setShowDropdown(true);
                                }}
                                placeholder="Tìm kiếm theo tên, email hoặc sở thích âm nhạc..."
                                className="w-full pl-14 pr-4 py-4 text-base bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                            />

                            {showDropdown && searchQuery && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-green-500/20 rounded-xl shadow-2xl overflow-hidden z-50">
                                    {isSearching ? (
                                        <div className="p-4 flex items-center justify-center text-green-400">
                                            <Loader2 className="w-6 h-6 animate-spin mr-2" />
                                            Đang tìm kiếm...
                                        </div>
                                    ) : searchResults.length > 0 ? (
                                        <div className="max-h-80 overflow-y-auto">
                                            {searchResults.map((user, index) => (
                                                <div
                                                    key={user.id || index}
                                                    onClick={() => {
                                                        console.log("Selected user:", user);
                                                        setSearchQuery("");
                                                        setShowDropdown(false);
                                                    }}
                                                    className="p-3 hover:bg-gray-800 cursor-pointer flex items-center gap-3 border-b border-gray-800/50 last:border-0 transition"
                                                >
                                                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shrink-0">
                                                        {user.avatarUrl ? (
                                                            <img src={user.avatarUrl} alt={user.username} className="w-full h-full rounded-full object-cover"/>
                                                        ) : (
                                                            <span className="text-white font-bold">{user.username ? user.username.charAt(0).toUpperCase() : "?"}</span>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-white font-medium truncate">{user.username}</h4>
                                                        <p className="text-gray-400 text-xs truncate">{user.email}</p>
                                                    </div>
                                                    <button className="p-2 text-green-400 hover:bg-green-500/20 rounded-full">
                                                        <Users className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 text-center text-gray-500">
                                            Không tìm thấy kết quả nào.
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>
                </div>

                {/* BODY CONTENT */}
                <div className="p-8 pb-20">
                    <div className="max-w-6xl mx-auto space-y-8">

                        {/* SECTION: TRENDING SONGS */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <TrendingUp className="w-6 h-6 text-green-400" />
                                    Bài hát thịnh hành
                                </h3>
                                <button className="text-green-400 hover:text-green-300 text-sm font-medium transition">
                                    Xem tất cả →
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {trendingSongs.map((song) => (
                                    <SongCard
                                        key={song.id}
                                        data={song}
                                        onClick={() => console.log("Play song:", song.title)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* SECTION: RECENT USERS */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                    <Users className="w-6 h-6 text-green-400" />
                                    Người dùng gần đây
                                </h3>
                                <button className="text-green-400 hover:text-green-300 text-sm font-medium transition">
                                    Xem tất cả →
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {recentUsers.map((user) => (
                                    <UserCard
                                        key={user.id}
                                        data={user}
                                        onConnect={() => console.log("Connect with:", user.name)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* STATS SECTION */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { count: "1,234", label: "Bài hát đã nghe", icon: Music },
                                { count: "89", label: "Bạn bè", icon: Users },
                                { count: "456", label: "Yêu thích", icon: Heart },
                            ].map((stat, idx) => (
                                <div key={idx} className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-green-500/30 rounded-lg flex items-center justify-center">
                                            <stat.icon className="w-6 h-6 text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-white">{stat.count}</p>
                                            <p className="text-sm text-gray-400">{stat.label}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}