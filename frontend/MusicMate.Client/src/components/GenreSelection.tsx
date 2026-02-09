import React, { useState, useEffect } from 'react';
import { Music, Check, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; 

export function GenreSelection() {
    const [genres, setGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 

    useEffect(() => {
        fetchGenres();
    }, []);

    const fetchGenres = async () => {
        try {
            const response = await fetch("/api/Genres");
            const data = await response.json();
            setGenres(data);
        } catch (err) {
            setError("Không thể tải danh sách thể loại");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleGenre = (genreId) => {
        setSelectedGenres(prev => {
            if (prev.includes(genreId)) {
                return prev.filter(id => id !== genreId);
            } else {
                return [...prev, genreId];
            }
        });
    };

    const handleSubmit = async () => {
        if (selectedGenres.length === 0) {
            setError("Vui lòng chọn ít nhất một thể loại");
            return;
        }

        setIsSaving(true);
        setError(null);

        try {
            const token = localStorage.getItem("accessToken");
            const response = await fetch("/api/Genres/set-favorites", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(selectedGenres)
            });

            if (!response.ok) {
                throw new Error("Không thể lưu sở thích");
            }

            const data = await response.json();
            console.log(data.message);

            navigate("/home");
            alert("Đã lưu sở thích thành công! Chuyển đến trang chủ.");
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Đang tải...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-green-950 flex items-center justify-center p-8">
            <div className="w-full max-w-5xl">
                {/* Header */}
                <div className="text-center mb-12 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-6 shadow-lg shadow-green-500/50">
                        <Sparkles className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-5xl font-bold text-white mb-4">
                        Chọn thể loại yêu thích
                    </h1>
                    <p className="text-xl text-gray-400">
                        Chọn ít nhất một thể loại để chúng tôi gợi ý nhạc phù hợp với bạn
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full">
                        <Music className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-green-400">
                            Đã chọn: <span className="font-bold">{selectedGenres.length}</span> thể loại
                        </span>
                    </div>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-center">
                        <p className="text-red-400">{error}</p>
                    </div>
                )}

                <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-green-500/20 mb-8">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {genres.map((genre) => {
                            const isSelected = selectedGenres.includes(genre.id);
                            return (
                                <button
                                    key={genre.id}
                                    onClick={() => toggleGenre(genre.id)}
                                    className={`relative p-6 rounded-xl border-2 transition-all transform hover:scale-105 ${
                                        isSelected
                                            ? 'bg-gradient-to-br from-green-500/30 to-green-600/30 border-green-500 shadow-lg shadow-green-500/30'
                                            : 'bg-gray-800/30 border-gray-700 hover:border-green-500/50 hover:bg-gray-800/50'
                                    }`}
                                >
                                    {isSelected && (
                                        <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                            <Check className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                    <div className="text-center">
                                        <div className="text-3xl mb-3">
                                            {getGenreEmoji(genre.name)}
                                        </div>
                                        <p className={`font-semibold ${
                                            isSelected ? 'text-green-400' : 'text-white'
                                        }`}>
                                            {genre.name}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => setSelectedGenres([])}
                        className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-lg transition"
                        disabled={selectedGenres.length === 0}
                    >
                        Xóa tất cả
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={selectedGenres.length === 0 || isSaving}
                        className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg shadow-lg shadow-green-500/30 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Đang lưu...
                            </>
                        ) : (
                            <>
                                Tiếp tục
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>

                <div className="text-center mt-6">
                    <button
                        onClick={() => navigate("/home")}
                        className="text-gray-400 hover:text-green-400 text-sm transition"
                    >
                        Bỏ qua bước này →
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }
            `}</style>
        </div>
    );
}

function getGenreEmoji(genreName) {
    const emojiMap = {
        'Pop': '🎤',
        'Rock': '🎸',
        'Jazz': '🎷',
        'Classical': '🎻',
        'Hip Hop': '🎤',
        'EDM': '🎧',
        'Country': '🤠',
        'R&B': '🎵',
        'Blues': '🎺',
        'Metal': '🤘',
        'Indie': '🎸',
        'Folk': '🪕',
        'Reggae': '🌴',
        'Soul': '💫',
        'Disco': '🪩',
        'Funk': '🕺',
        'Electronic': '🔊',
        'Rap': '🎤',
        'Latin': '💃',
        'K-Pop': '🌟'
    };

    return emojiMap[genreName] || '🎵';
}