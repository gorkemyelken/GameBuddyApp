import React, { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from "react-native";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAuth } from "../AuthContext";

const SOCKET_URL = "https://gamebuddy-chat-service-446d857b5e76.herokuapp.com/ws-chat";
const CONVERSATION_API_URL = "https://gamebuddy-chat-service-446d857b5e76.herokuapp.com/api/v1/conversations";
const MESSAGES_API_URL = "https://gamebuddy-chat-service-446d857b5e76.herokuapp.com/api/v1/messages";

const ChatScreen = ({ route }) => {
    const { userData } = useAuth();
    const { recipientId } = route.params;
    const [conversationId, setConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isConnected, setIsConnected] = useState(false);

    const clientRef = useRef(null);

    // Konuşmayı başlat veya mevcut konuşmayı bul
    useEffect(() => {
        fetch(`${CONVERSATION_API_URL}/getByUsers?user1Id=${userData.userId}&user2Id=${recipientId}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setConversationId(data.data.conversationId);

                    // Eğer conversationId varsa, eski mesajları al
                    fetch(`${MESSAGES_API_URL}/${data.data.conversationId}`)
                        .then((response) => response.json())
                        .then((data) => {
                            if (data.success) {
                                setMessages(data.data);
                            }
                        })
                        .catch((error) => console.error("Eski mesajları yükleme hatası:", error));
                }
            })
            .catch((error) => console.error("Konuşmayı alma hatası:", error));
    }, [userData.userId, recipientId]);

    useEffect(() => {
        if (clientRef.current) return;

        const stompClient = new Client({
            webSocketFactory: () => new SockJS(SOCKET_URL),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("Connected to WebSocket");
                setIsConnected(true);

                // Mesajları dinlemek için abone ol
                stompClient.subscribe("/topic/public", (message) => {
                    const receivedMessage = JSON.parse(message.body);

                    setMessages((prevMessages) => {
                        const isDuplicate = prevMessages.some(
                            (msg) => msg.messageId === receivedMessage.messageId
                        );

                        if (!isDuplicate) {
                            return [...prevMessages, receivedMessage];
                        }
                        return prevMessages;
                    });
                });

                stompClient.publish({
                    destination: "/app/chat.addUser",
                    body: JSON.stringify({ senderId: userData.userId }),
                });
            },
            onDisconnect: () => {
                console.log("Disconnected from WebSocket");
                setIsConnected(false);
            },
            onStompError: (frame) => {
                console.error("STOMP error:", frame);
            },
        });

        stompClient.activate();
        clientRef.current = stompClient;

        return () => {
            stompClient.deactivate();
        };
    }, [userData.userId]);

    const sendMessage = () => {
        if (clientRef.current && isConnected && newMessage.trim() !== "" && conversationId) {
            const messagePayload = {
                senderId: userData.userId,
                recipientId,
                content: newMessage,
                conversationId,
                messageId: `${Date.now()}-${userData.userId}`,
            };

            clientRef.current.publish({
                destination: "/app/chat.sendMessage",
                body: JSON.stringify(messagePayload),
            });

            setMessages((prevMessages) => [
                ...prevMessages,
                { ...messagePayload },
            ]);

            setNewMessage("");
        } else {
            Alert.alert("Error", "Conversation not found.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chat with {recipientId}</Text>

            <FlatList
                data={messages}
                keyExtractor={(item) => item.messageId}
                renderItem={({ item }) => (
                    <View style={styles.messageContainer}>
                        <Text style={styles.messageSender}>{item.senderId}:</Text>
                        <Text style={styles.messageContent}>{item.content}</Text>
                    </View>
                )}
            />

            <TextInput
                style={styles.input}
                placeholder="Type a message"
                value={newMessage}
                onChangeText={setNewMessage}
            />

            <Button title="Send Message" onPress={sendMessage} disabled={!isConnected} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    messageContainer: {
        flexDirection: "row",
        marginBottom: 10,
        padding: 10,
        backgroundColor: "#e1e1e1",
        borderRadius: 5,
    },
    messageSender: {
        fontWeight: "bold",
        marginRight: 5,
    },
    messageContent: {
        flexShrink: 1,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
});

export default ChatScreen;
