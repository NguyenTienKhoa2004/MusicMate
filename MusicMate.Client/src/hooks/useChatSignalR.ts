import { useEffect, useState, useRef } from 'react';
import * as signalR from '@microsoft/signalr';

export interface MessageDto {
    sender_name: string;
    sender_id?: string;
    content: string;
    timestamp: string;
    isSent: boolean;
}

export const useChatSignalR = (roomId: string | null, currentUserId: string) => {

    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [realtimeMessages, setRealtimeMessages] = useState<MessageDto[]>([]);
    
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5137/hub/chat", {
                accessTokenFactory: () => token || ""
            })
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);
    
    useEffect(() => {
        if (connection && roomId) {
            const startConnection = async () => {
                if (connection.state === signalR.HubConnectionState.Disconnected) {
                    await connection.start();
                    console.log('SignalR Connected!');
                }
                
                if (connection.state === signalR.HubConnectionState.Connected) {
                    console.log("Joining Room:", roomId);
                    await connection.invoke("JoinChatRoom", roomId);
                }
            };

            startConnection();
            
            connection.on("ReceiveMessage", (data: any) => {
                if (data.sender_id.toString() === currentUserId.toString()) {
                    return;
                }
                const newMessage: MessageDto = {
                    sender_name: data.sender_name,
                    content: data.content,
                    timestamp: data.sent_time,
                    isSent: data.sender_id.toString() === currentUserId.toString()
                };
                setRealtimeMessages(prev => [...prev, newMessage]);
            });
            
            return () => {
                connection.off("ReceiveMessage");
            };
        }
    }, [connection, roomId, currentUserId]);

    return { connection, realtimeMessages, setRealtimeMessages };
};