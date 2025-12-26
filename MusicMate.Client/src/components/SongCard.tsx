import React from 'react';
import { Play } from 'lucide-react';
import { Song } from '../types'; // Import interface Song từ file types

interface SongCardProps {
    data: Song;
    onClick?: () => void;
}

export const SongCard = ({ data, onClick }: SongCardProps) => {
    return (
        <div
            onClick={onClick}
            className="bg-gray-900/50 backdrop-blur-sm border border-green-500/20 rounded-xl p-4 hover:bg-gray-800/50 hover:border-green-500/40 transition cursor-pointer group"
        >
            <div className="w-full aspect-square bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-lg flex items-center justify-center mb-3 text-4xl relative overflow-hidden">
                {data.image}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                    <Play className="w-12 h-12 text-green-400" />
                </div>
            </div>
            <h4 className="text-white font-semibold truncate">{data.title}</h4>
            <p className="text-gray-400 text-sm truncate">{data.artist}</p>
            <p className="text-green-400 text-xs mt-2">{data.plays} lượt nghe</p>
        </div>
    );
};