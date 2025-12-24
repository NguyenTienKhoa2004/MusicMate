import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Music, Search, Home, Users, Heart, Settings, User, LogOut, TrendingUp, Play, LogIn, Loader2 } from 'lucide-react';

export function HomePage() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeNav, setActiveNav] = useState("home");
    const [currentUser, setCurrentUser] = useState({ id: "", name: "Khách", email: "" });
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const userStr = localStorage.getItem("currentUser");
        if (token && userStr) {
            setIsLoggedIn(true);
            setCurrentUser(JSON.parse(userStr));
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
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

    const trendingSongs = [
        { id: 1, title: "Nơi Này Có Anh", artist: "Sơn Tùng M-TP", plays: "2.5M", image: "🎵" },
        { id: 2, title: "See Tình", artist: "Hoàng Thùy Linh", plays: "1.8M", image: "🎵" },
        { id: 3, title: "Có Chắc Yêu Là Đây", artist: "Sơn Tùng M-TP", plays: "3.2M", image: "🎵" },
        { id: 4, title: "Anh Đã Quen Với Cô Đơn", artist: "Soobin Hoàng Sơn", plays: "1.5M", image: "🎵" },
    ];

    const recentUsers = [
        { id: 1, name: "Minh Anh", status: "online", avatar: "👤" },
        { id: 2, name: "Thuỳ Linh", status: "offline", avatar: "👤" },
        { id: 3, name: "Hoàng Nam", status: "online", avatar: "👤" },
        { id: 4, name: "Mai Phương", status: "online", avatar: "👤" },
    ];

    return (
        <div className="h-screen overflow-hidden bg-gradient-to-br from-black via-gray-900 to-green-950 flex">

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
                    <button onClick={() => setActiveNav("home")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${activeNav === "home" ? "bg-green-500/20 text-green-400" : "text-gray-400 hover:bg-gray-800/50 hover:text-white"}`}>
                        <Home className="w-5 h-5" /> <span className="font-medium">Trang chủ</span>
                    </button>
                    <button onClick={() => setActiveNav("discover")} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800/50 hover:text-white transition">
                        <TrendingUp className="w-5 h-5" /> <span className="font-medium">Khám phá</span>
                    </button>
                    <button onClick={() => setActiveNav("friends")} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800/50 hover:text-white transition">
                        <Users className="w-5 h-5" /> <span className="font-medium">Bạn bè</span>
                    </button>
                    <button onClick={() => setActiveNav("favorites")} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800/50 hover:text-white transition">
                        <Heart className="w-5 h-5" /> <span className="font-medium">Yêu thích</span>
                    </button>
                    <button onClick={() => setActiveNav("settings")} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800/50 hover:text-white transition">
                        <Settings className="w-5 h-5" /> <span className="font-medium">Cài đặt</span>
                    </button>
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

            <div className="flex-1 overflow-y-auto h-full relative">

                <div className="bg-gray-900/80 backdrop-blur-md border-b border-green-500/20 p-8 sticky top-0 z-20">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-white mb-6">Tìm kiếm người dùng</h2>
                        <div className="relative" ref={searchRef}>
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => {
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
                                                    // FIX LỖI KEY: Ưu tiên dùng user.id, nếu không có thì dùng index
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

                <div className="p-8 pb-20">
                    <div className="max-w-6xl mx-auto space-y-8">

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
                                    <div
                                        key={song.id}
                                        className="bg-gray-900/50 backdrop-blur-sm border border-green-500/20 rounded-xl p-4 hover:bg-gray-800/50 hover:border-green-500/40 transition cursor-pointer group"
                                    >
                                        <div className="w-full aspect-square bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-lg flex items-center justify-center mb-3 text-4xl relative overflow-hidden">
                                            {song.image}
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                                <Play className="w-12 h-12 text-green-400" />
                                            </div>
                                        </div>
                                        <h4 className="text-white font-semibold truncate">{song.title}</h4>
                                        <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                                        <p className="text-green-400 text-xs mt-2">{song.plays} lượt nghe</p>
                                    </div>
                                ))}
                            </div>
                        </div>

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
                                    <div
                                        key={user.id}
                                        className="bg-gray-900/50 backdrop-blur-sm border border-green-500/20 rounded-xl p-6 hover:bg-gray-800/50 hover:border-green-500/40 transition cursor-pointer text-center"
                                    >
                                        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-3 shadow-lg shadow-green-500/30">
                                            {user.avatar}
                                        </div>
                                        <h4 className="text-white font-semibold">{user.name}</h4>
                                        <div className="flex items-center justify-center gap-2 mt-2">
                                            <div
                                                className={`w-2 h-2 rounded-full ${
                                                    user.status === "online" ? "bg-green-400" : "bg-gray-500"
                                                }`}
                                            ></div>
                                            <span
                                                className={`text-xs ${
                                                    user.status === "online" ? "text-green-400" : "text-gray-500"
                                                }`}
                                            >
                                                {user.status === "online" ? "Đang hoạt động" : "Không hoạt động"}
                                            </span>
                                        </div>
                                        <button className="mt-4 w-full py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition">
                                            Kết nối
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-500/30 rounded-lg flex items-center justify-center">
                                        <Music className="w-6 h-6 text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">1,234</p>
                                        <p className="text-sm text-gray-400">Bài hát đã nghe</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-500/30 rounded-lg flex items-center justify-center">
                                        <Users className="w-6 h-6 text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">89</p>
                                        <p className="text-sm text-gray-400">Bạn bè</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-500/30 rounded-lg flex items-center justify-center">
                                        <Heart className="w-6 h-6 text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">456</p>
                                        <p className="text-sm text-gray-400">Yêu thích</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}