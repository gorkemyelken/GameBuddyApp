import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, Text, Checkbox } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../AuthContext';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons'; // Import Ionicons for lock icon

const GAMES_API_URL = 'https://gamebuddy-game-service-1355a6fbfb17.herokuapp.com/api/v1/games';
const RANK_API_URL = (gameId) => `https://gamebuddy-game-service-1355a6fbfb17.herokuapp.com/api/v1/games/${gameId}`;

const MatchScreen = () => {
  const { userData } = useAuth();
  const [ageRange, setAgeRange] = useState([13, 100]);
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [ranks, setRanks] = useState([]);
  const [selectedRanks, setSelectedRanks] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(GAMES_API_URL);
        setGames(response.data.data);
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
      setRanks(response.data.data.rankSystem);
      setSelectedRanks([]);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch ranks for the selected game.');
    }
  };

  const handleRankChange = (rank) => {
    setSelectedRanks((prev) => {
      if (prev.includes(rank)) {
        return prev.filter((r) => r !== rank);
      } else {
        return [...prev, rank];
      }
    });
  };

  const handleGenderChange = (gender) => {
    setSelectedGenders((prev) => {
      if (prev.includes(gender)) {
        return prev.filter((g) => g !== gender);
      } else {
        return [...prev, gender];
      }
    });
  };

  const handleMatch = () => {
    if (!ageRange[0] || !ageRange[1] || !selectedGame || selectedRanks.length === 0) {
      Alert.alert('Error', 'Please fill out all fields and select a game and at least one rank.');
      return;
    }

    if (ageRange[0] > ageRange[1]) {
      Alert.alert('Error', 'Minimum age cannot be greater than maximum age.');
      return;
    }

    const criteria = {
      minAge: ageRange[0],
      maxAge: ageRange[1],
      gender: userData.premium ? selectedGenders : ['MALE', 'FEMALE', 'OTHER'], // Default for non-premium users
      gameId: selectedGame,
      selectedRanks: selectedRanks,
    };

    console.log('Matching criteria:', criteria);
    Alert.alert('Match Criteria', JSON.stringify(criteria));
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.label}>Select Age Range:</Text>
          <Text>Min Age: {ageRange[0]}</Text>
          <MultiSlider
            values={[ageRange[0], ageRange[1]]}
            sliderLength={280}
            onValuesChange={setAgeRange}
            min={13}
            max={100}
            step={1}
            selectedStyle={{ backgroundColor: '#6A1B9A' }}
            unselectedStyle={{ backgroundColor: '#D1C4E9' }}
            trackStyle={{ height: 5 }}
            containerStyle={{ height: 40 }}
          />
          <Text>Max Age: {ageRange[1]}</Text>

          <View style={styles.genderContainer}>
            <Text style={styles.label}>Select Gender:</Text>
            {userData.premium ? (
              <View style={styles.checkboxContainer}>
                {['MALE', 'FEMALE', 'OTHER'].map((gender) => (
                  <View key={gender} style={styles.checkboxOption}>
                    <Checkbox
                      status={selectedGenders.includes(gender) ? 'checked' : 'unchecked'}
                      onPress={() => handleGenderChange(gender)}
                      color="#6A1B9A"
                    />
                    <Text>{gender}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.nonPremiumGenderContainer}>
                <View style={styles.lockedInfo}>
                  <Icon name="lock-closed-outline" size={20} color="#6A1B9A" />
                  <Text style={styles.lockedText}>For Only Premium Users</Text>
                </View>
                <Text style={styles.radioLabel}>MALE, FEMALE, OTHER</Text>
              </View>
            )}
          </View>

          <Text style={styles.label}>Select Game:</Text>
          <Picker
            selectedValue={selectedGame}
            onValueChange={handleGameChange}
            style={styles.dropdown}
          >
            <Picker.Item label="Select Game" value={null} />
            {games.map(game => (
              <Picker.Item key={game.gameId} label={game.name} value={game.gameId} />
            ))}
          </Picker>

          {ranks.length > 0 && (
            <>
              <Text style={styles.label}>Select Rank:</Text>
              <Picker
                selectedValue={null}
                onValueChange={handleRankChange}
                style={styles.dropdown}
                mode="dropdown"
              >
                <Picker.Item label="Select Rank" value={null} />
                {ranks.map(rank => (
                  <Picker.Item key={rank} label={rank} value={rank} />
                ))}
              </Picker>
              <View style={styles.selectedRanksContainer}>
                <Text>Selected Ranks:</Text>
                {selectedRanks.map(rank => (
                  <Text key={rank} style={styles.selectedRank}>
                    {rank}
                  </Text>
                ))}
              </View>
            </>
          )}

          <View style={styles.matchButtonContainer}>
            <Button 
              mode="contained" 
              onPress={handleMatch} 
              style={styles.matchButton}
            >
              MATCH
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  label: {
    fontSize: 18,
    marginVertical: 10,
    fontWeight: 'bold',
  },
  genderContainer: {
    width: '100%',
    marginVertical: 10,
    alignItems: 'center', // Center the contents
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%', // Ensure it fits within the container
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nonPremiumGenderContainer: {
    marginVertical: 10,
    width: '100%',
    padding: 10,
    alignItems: 'center', // Center the contents
  },
  lockedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  lockedText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#6A1B9A',
  },
  dropdown: {
    width: '100%',
    marginBottom: 20,
  },
  selectedRanksContainer: {
    marginVertical: 10,
    width: '100%',
  },
  selectedRank: {
    padding: 5,
    backgroundColor: '#E1BEE7',
    marginVertical: 2,
    borderRadius: 5,
  },
  matchButtonContainer: {
    width: '100%',
    marginTop: 20,
  },
  matchButton: {
    backgroundColor: '#6A1B9A',
  },
});

export default MatchScreen;
