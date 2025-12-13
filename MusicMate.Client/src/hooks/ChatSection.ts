import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

export interface MessageDto {
    id: number;
    sender_id: number;
    receiver_id: number;
    content: string;
    sent_time: string;
    sender_name: string;
    sender_avatar?: string;
}

export const ChatSection = (roomId: string) => {
    
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [messages, setMessages] = useState<MessageDto[]>([]);

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
        if (connection) {
            connection.start()
                .then(() => {
                    console.log('SignalR Connected!');
                    connection.invoke("JoinChatRoom", roomId).catch(err => console.error(err));
                })
                .catch(err => console.error('SignalR Connection Error: ', err));

            connection.on("ReceiveMessage", (data: MessageDto) => {
                console.log("Msg received:", data);
                setMessages(prev => [...prev, data]);
            });
        }
    }, [connection, roomId]);

    return { messages };
};