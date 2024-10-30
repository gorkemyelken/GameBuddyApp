import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, Text, RadioButton } from 'react-native-paper'; // Removed Dropdown import
import { Picker } from '@react-native-picker/picker'; // Import Picker for dropdown functionality
import { useAuth } from '../AuthContext'; // Adjust the import based on your folder structure
import Slider from '@react-native-community/slider'; // Ensure to install this package
import axios from 'axios';
import Navbar from '../components/Navbar';

const GAMES_API_URL = 'https://gamebuddy-game-service-1355a6fbfb17.herokuapp.com/api/v1/games';
const RANK_API_URL = (gameId) => `https://gamebuddy-game-service-1355a6fbfb17.herokuapp.com/api/v1/games/${gameId}`;

const HomeScreen = () => {
  const { userData } = useAuth(); // Get user data from AuthContext
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(100);
  const [gender, setGender] = useState(userData?.gender); // Set gender based on user data
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [ranks, setRanks] = useState([]);
  const [selectedRanks, setSelectedRanks] = useState([]); // Track selected ranks for each game

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(GAMES_API_URL);
        setGames(response.data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch games.');
      }
    };
    fetchGames();
  }, []);

  const handleGameChange = async (gameId) => {
    setSelectedGame(gameId);
    try {
      const response = await axios.get(RANK_API_URL(gameId));
      setRanks(response.data.rankSystem);
      setSelectedRanks([]); // Reset selected ranks when game changes
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch ranks for the selected game.');
    }
  };

  const toggleRankSelection = (rank) => {
    setSelectedRanks((prev) => {
      if (prev.includes(rank)) {
        return prev.filter((r) => r !== rank); // Remove rank if already selected
      } else {
        return [...prev, rank]; // Add rank if not selected
      }
    });
  };

  const handleMatch = () => {
    if (!minAge || !maxAge || !selectedGame) {
      Alert.alert('Error', 'Please fill out all fields and select a game.');
      return;
    }

    // Validate age limits
    if (minAge > maxAge) {
      Alert.alert('Error', 'Minimum age cannot be greater than maximum age.');
      return;
    }

    // Prepare data to send to the matching API
    const criteria = {
      minAge,
      maxAge,
      gender: userData.premium ? gender : null, // Only include gender if user is premium
      gameId: selectedGame,
      selectedRanks: selectedRanks, // Include selected ranks directly
    };

    // Replace this with your match API call
    console.log('Matching criteria:', criteria);
    Alert.alert('Match Criteria', JSON.stringify(criteria));
  };

  return (
    <View style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={styles.scrollContainer}>

      <View style={styles.container}>

        <Text style={styles.label}>Select Age Range:</Text>
        <Text>Min Age: {minAge}</Text>
        <Slider
          minimumValue={18}
          maximumValue={100}
          step={1}
          value={minAge}
          onValueChange={value => setMinAge(value)}
          style={styles.slider}
        />
        
        <Text>Max Age: {maxAge}</Text>
        <Slider
          minimumValue={18}
          maximumValue={100}
          step={1}
          value={maxAge}
          onValueChange={value => setMaxAge(value)}
          style={styles.slider}
        />

        {userData.premium && (
          <View style={styles.radioContainer}>
            <Text style={styles.radioLabel}>Gender</Text>
            <RadioButton.Group onValueChange={setGender} value={gender}>
              <View style={styles.radioOption}>
                <RadioButton value="MALE" color="#6A1B9A" />
                <Text>Male</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton value="FEMALE" color="#6A1B9A" />
                <Text>Female</Text>
              </View>
            </RadioButton.Group>
          </View>
        )}

        <Text style={styles.label}>Select Game:</Text>
        <Picker
          selectedValue={selectedGame}
          onValueChange={handleGameChange}
          style={styles.dropdown}
        >
          <Picker.Item label="Select Game" value={null} />
          {games.map(game => (
            <Picker.Item key={game.id} label={game.name} value={game.id} />
          ))}
        </Picker>

        {ranks.length > 0 && (
          <>
            <Text style={styles.label}>Select Rank:</Text>
            {ranks.map(rank => (
              <View key={rank} style={styles.rankOption}>
                <Button 
                  mode={selectedRanks.includes(rank) ? 'contained' : 'outlined'} 
                  onPress={() => toggleRankSelection(rank)}
                  style={styles.rankButton}
                >
                  {rank}
                </Button>
              </View>
            ))}
          </>
        )}

        <Button 
          mode="contained" 
          onPress={handleMatch} 
          style={styles.matchButton}
        >
          MATCH
        </Button>
      </View>

    </ScrollView>
            <Navbar  />
            </View>
    
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  container: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  slider: {
    width: '100%',
    marginBottom: 20,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    marginBottom: 20,
  },
  radioLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  dropdown: {
    width: '100%',
    marginBottom: 20,
  },
  rankOption: {
    width: '100%',
    marginBottom: 10,
  },
  rankButton: {
    width: '100%',
  },
  matchButton: {
    width: '100%',
    marginTop: 20,
    backgroundColor: '#6A1B9A',
  },
});

export default HomeScreen;
