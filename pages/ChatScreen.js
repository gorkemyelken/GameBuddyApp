import React, { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, Keyboard, Platform } from "react-native";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useAuth } from "../AuthContext";
import Ionicons from "react-native-vector-icons/Ionicons";

const SOCKET_URL = "https://gamebuddy-chat-service-446d857b5e76.herokuapp.com/ws-chat";
const CONVERSATION_API_URL = "https://gamebuddy-chat-service-446d857b5e76.herokuapp.com/api/v1/conversations";
const MESSAGES_API_URL = "https://gamebuddy-chat-service-446d857b5e76.herokuapp.com/api/v1/messages";

const ChatScreen = ({ route }) => {
    const { userData } = useAuth();
    const { recipientId, recipientName } = route.params;
    const [conversationId, setConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isConnected, setIsConnected] = useState(false);

    const clientRef = useRef(null);
    const flatListRef = useRef(null);

    useEffect(() => {
        fetch(`${CONVERSATION_API_URL}/getByUsers?user1Id=${userData.userId}&user2Id=${recipientId}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    setConversationId(data.data.conversationId);

                    fetch(`${MESSAGES_API_URL}/${data.data.conversationId}`)
                        .then((response) => response.json())
                        .then((data) => {
                            if (data.success) {
                                setMessages(data.data);
                                flatListRef.current?.scrollToEnd({ animated: false });
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
                    flatListRef.current?.scrollToEnd({ animated: true });
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

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
            flatListRef.current?.scrollToEnd({ animated: true });
        });

        return () => {
            keyboardDidShowListener.remove();
        };
    }, []);

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

            setNewMessage("");
        } else {
            Alert.alert("Error", "Conversation not found.");
        }
    };

    const renderMessageItem = ({ item }) => {
        const isMyMessage = item.senderId === userData.userId;
        const isSystemMessage = item.content.startsWith("User joined") || item.content.startsWith("Welcome");

        return (
            <View style={isSystemMessage ? styles.systemMessageContainer : styles.messageWrapper}>
                {!isSystemMessage && (
                    <Text style={[styles.messageSender, isMyMessage ? styles.myMessageSender : styles.theirMessageSender]}>
                        {isMyMessage ? userData.userName : recipientName}
                    </Text>
                )}
                <View style={[styles.messageContainer, isMyMessage ? styles.myMessage : styles.theirMessage]}>
                    <Text style={styles.messageContent}>{item.content}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chat with {recipientName}</Text>
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.messageId}
                renderItem={renderMessageItem}
                contentContainerStyle={styles.messagesList}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message"
                    value={newMessage}
                    onChangeText={setNewMessage}
                    onFocus={() => flatListRef.current?.scrollToEnd({ animated: true })}
                />
                <TouchableOpacity onPress={sendMessage} disabled={!isConnected || !newMessage.trim()}>
                    <Ionicons name="send" size={24} color={isConnected ? "#6A1B9A" : "#ddd"} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e5e5e5",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
        color: "#6A1B9A",
    },
    messagesList: {
        paddingHorizontal: 10,
        paddingVertical: 20,
    },
    messageWrapper: {
        marginVertical: 8,
    },
    messageSender: {
        fontWeight: "bold",
        marginBottom: 3,
        color: "#6A1B9A",
    },
    myMessageSender: {
        alignSelf: "flex-end",
    },
    theirMessageSender: {
        alignSelf: "flex-start",
    },
    messageContainer: {
        padding: 10,
        borderRadius: 15,
        maxWidth: "80%",
    },
    myMessage: {
        backgroundColor: "#E1D5F1",
        alignSelf: "flex-end",
        borderColor: "#6A1B9A",
        borderWidth: 1,
    },
    theirMessage: {
        backgroundColor: "#FFF",
        alignSelf: "flex-start",
        borderColor: "#6A1B9A",
        borderWidth: 1,
    },
    systemMessageContainer: {
        alignItems: "center",
        marginVertical: 10,
    },
    messageContent: {
        fontSize: 16,
        color: "#333",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: "#fff",
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: "#6A1B9A",
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 10,
        backgroundColor: "#f9f9f9",
    },
});

export default ChatScreen;
