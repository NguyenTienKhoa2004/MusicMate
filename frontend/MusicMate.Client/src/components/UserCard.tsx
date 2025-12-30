import React from 'react';
import { RecentUser } from '../types'; // Import interface RecentUser

interface UserCardProps {
    data: RecentUser;
    onConnect?: () => void;
}

export const UserCard = ({ data, onConnect }: UserCardProps) => {
    return (
        <div className="bg-gray-900/50 backdrop-blur-sm border border-green-500/20 rounded-xl p-6 hover:bg-gray-800/50 hover:border-green-500/40 transition cursor-pointer text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-3 shadow-lg shadow-green-500/30">
                {data.avatar}
            </div>
            <h4 className="text-white font-semibold">{data.name}</h4>
            <div className="flex items-center justify-center gap-2 mt-2">
                <div
                    className={`w-2 h-2 rounded-full ${
                        data.status === "online" ? "bg-green-400" : "bg-gray-500"
                    }`}
                ></div>
                <span
                    className={`text-xs ${
                        data.status === "online" ? "text-green-400" : "text-gray-500"
                    }`}
                >
                    {data.status === "online" ? "Đang hoạt động" : "Không hoạt động"}
                </span>
            </div>
            <button
                onClick={(e) => {
                    e.stopPropagation(); // Ngăn click lan ra thẻ cha
                    onConnect?.();
                }}
                className="mt-4 w-full py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition"
            >
                Kết nối
            </button>
        </div>
    );
};