import React, { useState } from 'react';
import { ChatSection } from '../hooks/ChatSection';

export const ChatRoom = () => { 
    const roomId = "room-1";

    const { messages } = ChatSection(roomId);

    const [input, setInput] = useState("");

    const handleSend = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        try {
            await fetch("http://localhost:5137/api/Chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    receiverId: '07411746-ae50-46dd-b244-886f7ea10647', 
                    content: input
                })
            });
            setInput("");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Phòng Chat: {roomId}</h2>

            <div style={{ border: '1px solid #ccc', height: '400px', overflowY: 'auto', padding: '10px' }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{ marginBottom: '10px' }}>
                        <strong>{msg.sender_name}:</strong> {msg.content}
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '10px' }}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                />
                <button onClick={handleSend}>Gửi</button>
            </div>
        </div>
    );
};