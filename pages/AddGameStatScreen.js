// AddGameStatScreen.js
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Button, Alert } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useAuth } from "../AuthContext";
import { useNavigation } from "@react-navigation/native";

const AddGameStatScreen = () => {
  const { userData } = useAuth(); // Get user data from context
  const navigation = useNavigation(); // Hook for navigation
  const [games, setGames] = useState([]);
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [gameRank, setGameRank] = useState("");
  const [rankOptions, setRankOptions] = useState([]);

  // Fetch games on component mount
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('https://gamebuddy-game-service-1355a6fbfb17.herokuapp.com/api/v1/games');
        const data = await response.json();

        if (data.success) {
          setGames(data.data);
        } else {
          Alert.alert("Error", data.message);
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to fetch games.");
      }
    };

    fetchGames();
  }, []);

  // Update rank options when a game is selected
  const handleGameChange = (gameId) => {
    setSelectedGameId(gameId);
    const selectedGame = games.find((game) => game.gameId === gameId);
    setRankOptions(selectedGame ? selectedGame.rankSystem : []);
  };

  const handleAddStat = async () => {
    if (!selectedGameId || !gameRank) {
      Alert.alert("Error", "Please select a game and enter your rank.");
      return;
    }

    const statData = {
      gameId: selectedGameId,
      userId: userData.userId,
      userName: userData.userName,
      gameRank: gameRank,
    };

    try {
      const response = await fetch('https://gamebuddy-game-service-1355a6fbfb17.herokuapp.com/api/v1/gamestats/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '*/*',
        },
        body: JSON.stringify(statData),
      });

      const result = await response.json();

      if (result.success) {
        Alert.alert("Success", "Game statistics added successfully!");
        navigation.navigate('Profile'); // Navigate back to the ProfileScreen
      } else {
        Alert.alert("Error", result.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to add game statistics.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Game Statistics</Text>
      
      <Text style={styles.label}>Select Game:</Text>
      <Picker
        selectedValue={selectedGameId}
        onValueChange={(itemValue) => handleGameChange(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select a game" value={null} />
        {games.map((game) => (
          <Picker.Item key={game.gameId} label={game.name} value={game.gameId} />
        ))}
      </Picker>

      <Text style={styles.label}>Rank:</Text>
      <Picker
        selectedValue={gameRank}
        onValueChange={(itemValue) => setGameRank(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select your rank" value="" />
        {rankOptions.map((rank) => (
          <Picker.Item key={rank} label={rank} value={rank} />
        ))}
      </Picker>

      <View style={styles.buttonContainer}>
        <Button title="Submit" onPress={handleAddStat} color="#6A1B9A" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    marginTop: 20,
    width: '100%',
  },
});

export default AddGameStatScreen;
