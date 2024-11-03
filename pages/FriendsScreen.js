import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Alert,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Text } from "react-native-paper";
import { useAuth } from "../AuthContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const FRIENDS_API_URL = "https://gamebuddy-user-service-04b8e7746067.herokuapp.com/api/v1/users/getFriends";

const FriendsScreen = () => {
  const { userData } = useAuth();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const fetchFriends = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${FRIENDS_API_URL}?userId=${userData.userId}`);
      const data = await response.json();

      if (data.success) {
        setFriends(data.data);
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      console.error("Error fetching friends:", error);
      Alert.alert("Error", "Failed to fetch friends.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFriends();
  }, [userData.userId]);

  const openChat = (friendId) => {
    navigation.navigate("ChatScreen", { recipientId: friendId });
  };

  const renderFriendItem = ({ item }) => {
    const averageRating = item.averageRating || "N/A";

    return (
      <View style={styles.friendCard}>
        <Image source={{ uri: item.profilePhoto || "https://via.placeholder.com/100" }} style={styles.avatar} />
        <View style={styles.infoContainer}>
          <Text style={styles.userName}>{item.userName}</Text>
          <Text>Age: {item.age}</Text>
          <Text>Rating: {averageRating}</Text>
          <View style={styles.languageContainer}>
            <Ionicons name="globe" size={18} color="#6A1B9A" />
            <Text>{item.preferredLanguages.join(", ")}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => openChat(item.userId)} style={styles.chatIconContainer}>
          <Ionicons name="chatbubble-outline" size={24} color="#6A1B9A" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : (
        <FlatList
          data={friends}
          keyExtractor={(item) => item.userId}
          renderItem={renderFriendItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  friendCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  infoContainer: {
    marginLeft: 10,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
  },
  languageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  chatIconContainer: {
    padding: 8,
    justifyContent: "center",
  },
});

export default FriendsScreen;
