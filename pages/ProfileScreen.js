import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Alert, Image } from "react-native";
import { Text } from "react-native-paper";
import { useAuth } from "../AuthContext";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Navbar from "../components/Navbar";

const ProfileScreen = () => {
  const { userData } = useAuth();
  const navigation = useNavigation();
  const [gameStats, setGameStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGameStats = async () => {
      try {
        const response = await fetch(`https://gamebuddy-game-service-1355a6fbfb17.herokuapp.com/api/v1/gamestats/user/${userData.userId}`);
        const data = await response.json();

        if (data.success) {
          setGameStats(data.data);
        } else {
          Alert.alert("Error", data.message);
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to fetch game statistics.");
      } finally {
        setLoading(false);
      }
    };

    fetchGameStats();
  }, [userData.userId]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.profileCard}>
            <Image
              source={{
                uri: userData?.avatar || "https://via.placeholder.com/100",
              }}
              style={styles.avatar}
            />
            <Text style={styles.title}>Profile Information</Text>
            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <Ionicons name="person" size={24} color="#6A1B9A" />
                <Text style={styles.label}>{userData?.userName}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="mail" size={24} color="#6A1B9A" />
                <Text style={styles.label}>{userData?.email}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="calendar" size={24} color="#6A1B9A" />
                <Text style={styles.label}>{userData?.age}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="male-female" size={24} color="#6A1B9A" />
                <Text style={styles.label}>{userData?.gender}</Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="star" size={24} color="#6A1B9A" />
                <Text style={styles.label}>
                  {userData?.premium ? "Premium User" : "Standard User"}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="globe" size={24} color="#6A1B9A" />
                <Text style={styles.label}>
                  {userData?.preferredLanguages?.join(", ")}
                </Text>
              </View>
            </View>
          </View>

          {/* Game Statistics Section */}
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>Game Statistics</Text>
            {loading ? (
              <Text style={styles.loadingText}>Loading...</Text>
            ) : gameStats.length > 0 ? (
              gameStats.map((stat) => (
                <View key={stat.gameStatId} style={styles.statItem}>
                  <Ionicons name="game-controller" size={24} color="#6A1B9A" />
                  <Text style={styles.statGameName}>{stat.gameName}</Text>
                  <Text style={styles.statRank}>{stat.gameRank}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noStatsText}>No game statistics available.</Text>
            )}
          </View>
        </View>
      </ScrollView>
      <Navbar />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  container: {
    alignItems: "center",
    width: "100%",
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: 20,
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoContainer: {
    width: "100%",
    marginTop: 10,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  label: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "bold",
  },
  statsCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
  },
  noStatsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  statGameName: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    marginLeft: 10,
  },
  statRank: {
    fontSize: 16,
    color: "#555",
    textAlign: "right",
  },
});

export default ProfileScreen;
