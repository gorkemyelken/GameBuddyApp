import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  Button,
} from "react-native";
import { Text } from "react-native-paper";
import { useAuth } from "../AuthContext";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Navbar from "../components/Navbar";

const ProfileScreen = () => {
  const { userData, updateUserData } = useAuth();
  const navigation = useNavigation();
  const [gameStats, setGameStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://gamebuddy-user-service-04b8e7746067.herokuapp.com/api/v1/users/${userData.userId}`
      );
      const data = await response.json();

      if (data.success) {
        updateUserData(data.data); // User data context'i güncelle
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      Alert.alert("Error", "Failed to fetch user data.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUserData();
    }, [userData.userId])
  );


  const fetchGameStats = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://gamebuddy-game-service-1355a6fbfb17.herokuapp.com/api/v1/gamestats/user/${userData.userId}`
      );
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

  useFocusEffect(
    React.useCallback(() => {
      fetchGameStats();
    }, [userData.userId])
  );

  const genderIcon = userData?.gender === 'MALE' ? 'male' : 
                   userData?.gender === 'FEMALE' ? 'female' : 
                   'male-female'; 

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileCard}>
          <Image
            source={{
              uri: userData?.profilePhoto || "https://via.placeholder.com/100",
            }}
            style={styles.avatar}
          />
          <Text style={styles.title}>Profile Information</Text>
          <View style={styles.infoContainer}>
            <ProfileInfoItem icon="person" label={userData?.userName} />
            <ProfileInfoItem icon="mail" label={userData?.email} />
            <ProfileInfoItem icon="calendar" label={userData?.age || "Age undefined"} />
            <ProfileInfoItem icon={genderIcon} label={userData?.gender || "Gender undefined"} />
            <ProfileInfoItem
              icon="star"
              label={userData?.premium ? "Premium User" : "Standard User"}
            />
            <ProfileInfoItem
              icon="globe"
              label={userData?.preferredLanguages?.join(", ") || "Preferred Languages undefined"}
            />
          </View>
          {/* Edit Profile Button */}
          <View style={styles.buttonContainer}>
            <Button
              title="Edit Profile"
              onPress={() => navigation.navigate("EditProfileScreen")}
              color="#6A1B9A"
            />
          </View>
        </View>

        {/* Game Statistics Section */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Game Statistics</Text>
          {loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : gameStats.length > 0 ? (
            gameStats.map((stat) => (
              <GameStatItem key={stat.gameStatId} stat={stat} />
            ))
          ) : (
            <Text style={styles.noStatsText}>
              No game statistics available.
            </Text>
          )}

          {/* Add Game Stat Button */}
          <View style={styles.buttonContainer}>
            <Button
              title="Add Game"
              onPress={() => navigation.navigate("AddGameStatScreen")}
              color="#6A1B9A"
            />
          </View>
        </View>
      </ScrollView>
      <Navbar />
    </View>
  );
};

const ProfileInfoItem = ({ icon, label }) => (
  <View style={styles.infoItem}>
    <Ionicons name={icon} size={24} color="#6A1B9A" />
    <Text style={styles.label}>{label}</Text>
  </View>
);

const GameStatItem = ({ stat }) => (
  <View style={styles.statItem}>
    <Ionicons name="game-controller" size={24} color="#6A1B9A" />
    <View style={styles.statTextContainer}>
      <Text style={styles.statGameName}>{stat.gameName}</Text>
      <Text style={styles.statRank}>{stat.gameRank}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
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
    alignItems: "flex-start",
    marginVertical: 10,
  },
  statTextContainer: {
    flexDirection: "column",
    marginLeft: 10,
  },
  statGameName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statRank: {
    fontSize: 16,
    color: "#555",
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
});

export default ProfileScreen;
