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

const MyProfileScreen = () => {
  const { userData, updateUserData } = useAuth();
  const navigation = useNavigation();
  const [gameStats, setGameStats] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://gamebuddy-user-service-04b8e7746067.herokuapp.com/api/v1/users/${userData.userId}`
      );
      const data = await response.json();

      if (data.success) {
        updateUserData(data.data);
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

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://gamebuddy-user-service-04b8e7746067.herokuapp.com/api/v1/reviews/users/${userData.userId}`
      );
      const data = await response.json();

      if (data.success) {
        setReviews(data.data);
      } 
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to fetch reviews.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUserData();
      fetchGameStats();
      fetchReviews();
    }, [userData.userId])
  );

  const genderIcon = userData?.gender === 'MALE' ? 'male' : 
                   userData?.gender === 'FEMALE' ? 'female' : 
                   'male-female'; 

  const averageRating = userData?.averageRating || 0; // Fallback to 0 if undefined

  const getRoundedAverage = (rating) => {
    return Math.round(rating * 2) / 2; 
  };

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

          {/* Average Rating Card */}
          <View style={styles.averageRatingCard}>
          <Text style={styles.averageRatingText}>Rating</Text>
          <Text style={styles.averageRatingText}>{getRoundedAverage(averageRating)}</Text>
          </View>

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
              onPress={() => navigation.navigate("EditMyProfileScreen")}
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

        {/* Reviews Section */}
        <View style={styles.reviewsCard}>
          <Text style={styles.reviewsTitle}>Reviews</Text>
          {loading ? (
            <Text style={styles.loadingText}>Loading...</Text>
          ) : reviews.length > 0 ? (
            reviews.map((review) => (
              <ReviewItem key={review.reviewId} review={review} />
            ))
          ) : (
            <Text style={styles.noReviewsText}>No reviews available.</Text>
          )}
        </View>
      </ScrollView>
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
    <View style={styles.statHeader}>
      <Text style={styles.statGameName}>{stat.gameName}</Text>
      <Text style={styles.statRank}>{stat.gameRank}</Text>
    </View>
  </View>
);

const ReviewItem = ({ review }) => {
  const getConfirmationIcon = (confirmationStatus) => {
    switch (confirmationStatus) {
      case "TRUE":
        return { icon: "checkmark-circle", color: "green" };
      case "FALSE":
        return { icon: "close-circle", color: "red" };
      case "UNSURE":
        return { icon: "help-circle", color: "orange" };
      default:
        return { icon: "help-circle", color: "gray" };
    }
  };

  const genderConfirmation = getConfirmationIcon(review.genderConfirmation);
  const ageConfirmation = getConfirmationIcon(review.ageConfirmation);

  // Function to render star ratings
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Ionicons
        key={index}
        name={index < rating ? "star" : "star-outline"}
        size={20}
        color="#FFD700"
      />
    ));
  };

  return (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewRating}>Rating: {review.rating}</Text>
        <View style={styles.starContainer}>{renderStars(review.rating)}</View>
      </View>
      <Text style={styles.reviewComment}>{review.comment}</Text>

      {/* Gender Confirmation Section */}
      <View style={styles.genderConfirmationContainer}>
        <Ionicons
          name={genderConfirmation.icon}
          size={24}
          color={genderConfirmation.color}
        />
        <Text style={styles.reviewGenderConfirmation}>Gender</Text>
      </View>

      {/* Age Confirmation Section */}
      <View style={styles.ageConfirmationContainer}>
        <Ionicons
          name={ageConfirmation.icon}
          size={24}
          color={ageConfirmation.color}
        />
        <Text style={styles.reviewAgeConfirmation}>Age</Text>
      </View>
    </View>
  );
};

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
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  averageRatingCard: {
    borderStyle: "solid",
    borderColor: "black", // Kenar rengi
    borderWidth: 1,       // Kenar kalınlığı
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginBottom: 15,
},
  averageRatingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD700", // Gold color for rating text
  },
  infoContainer: {
    marginVertical: 10,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    marginLeft: 10,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 20,
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
  statGameName: {
    fontSize: 16,
    fontWeight: "bold",
    padding:2,
  },
  statRank: {
    fontSize: 14,
    padding:2,
  },
  statsTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
  },
  noStatsText: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
  },
  reviewsCard: {
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
  reviewsTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  noReviewsText: {
    textAlign: "center",
    fontSize: 16,
    color: "gray",
  },
  reviewItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 10,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reviewRating: {
    fontSize: 16,
    fontWeight: "bold",
  },
  starContainer: {
    flexDirection: "row",
  },
  reviewComment: {
    fontSize: 14,
    color: "#555",
    marginVertical: 5,
  },
  genderConfirmationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewGenderConfirmation: {
    marginLeft: 5,
    fontSize: 14,
  },
  ageConfirmationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewAgeConfirmation: {
    marginLeft: 5,
    fontSize: 14,
  },
});

export default MyProfileScreen;
