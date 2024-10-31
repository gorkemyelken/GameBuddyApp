import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert, TextInput, Button, TouchableOpacity } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { Text, Checkbox } from "react-native-paper";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAuth } from "../AuthContext";
import { useNavigation } from "@react-navigation/native";

const EditProfileScreen = () => {
  const { userData } = useAuth();
  const navigation = useNavigation();

  const [age, setAge] = useState(userData.age.toString());
  const [gender, setGender] = useState(userData.gender);
  const [preferredLanguages, setPreferredLanguages] = useState(userData.preferredLanguages || []);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState(userData.profilePhoto || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleGenderChange = (selectedGender) => setGender(selectedGender);

  const handleLanguageChange = (language) => {
    if (!preferredLanguages.includes(language)) {
      setPreferredLanguages([...preferredLanguages, language]);
    }
  };

  const handleRemoveLanguage = (language) => {
    setPreferredLanguages(preferredLanguages.filter(lang => lang !== language));
  };

  useEffect(() => {
    fetch("https://gamebuddy-user-service-04b8e7746067.herokuapp.com/api/v1/languages/languages")
      .then((response) => response.json())
      .then((data) => setAvailableLanguages(data))
      .catch((error) => console.error("Error fetching languages:", error));
  }, []);

  const handleSaveChanges = async () => {
    if (password && password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    const updatedData = { age: parseInt(age), gender, preferredLanguages };
    if (userData.premium && profilePhoto) {
      updatedData.profilePhoto = profilePhoto;
    }
    if (password) {
      updatedData.password = password;
    }

    try {
      const response = await fetch(`https://gamebuddy-user-service-04b8e7746067.herokuapp.com/api/v1/users/${userData.userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const data = await response.json();

      if (data.success) {
        Alert.alert("Success", "Profile updated successfully!");
        navigation.goBack();
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update profile.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Edit Profile</Text>

        {/* Age Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="calendar" size={24} color="#6A1B9A" />
          <TextInput
            style={styles.input}
            placeholder="Age"
            value={age}
            keyboardType="numeric"
            onChangeText={setAge}
          />
        </View>

        {/* Gender Selection */}
        <Text style={styles.subtitle}>Gender</Text>
        <View style={styles.checkboxContainer}>
          {["MALE", "FEMALE", "OTHER"].map((g) => (
            <View key={g} style={styles.checkboxOption}>
              <Checkbox
                status={gender === g ? "checked" : "unchecked"}
                onPress={() => handleGenderChange(g)}
                color="#6A1B9A"
              />
              <Text>{g}</Text>
            </View>
          ))}
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed" size={24} color="#6A1B9A" />
          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        {/* Confirm Password Input */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed" size={24} color="#6A1B9A" />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        {/* Profile Photo (Premium Users Only) */}
        {userData.premium ? (
          <View style={styles.inputContainer}>
            <Ionicons name="image" size={24} color="#6A1B9A" />
            <TextInput
              style={styles.input}
              placeholder="Profile Photo URL"
              value={profilePhoto}
              onChangeText={setProfilePhoto}
            />
          </View>
        ) : (
          <View style={styles.nonPremiumContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#6A1B9A" />
            <Text style={styles.lockedText}>Profile photo update is for Premium Users only.</Text>
          </View>
        )}

        {/* Preferred Languages Picker */}
        <Text style={styles.subtitle}>Preferred Languages</Text>
        <Picker
          selectedValue={null}
          onValueChange={handleLanguageChange}
          style={styles.dropdown}
          mode="dropdown"
        >
          <Picker.Item label="Select Language" value={null} />
          {availableLanguages.map((lang) => (
            <Picker.Item key={lang} label={lang} value={lang} />
          ))}
        </Picker>

        {/* Display Selected Languages */}
        <View style={styles.selectedLanguagesContainer}>
          <Text>Selected Languages:</Text>
          {preferredLanguages.map((lang) => (
            <View key={lang} style={styles.selectedLanguageContainer}>
              <Text style={styles.selectedLanguage}>{lang}</Text>
              <TouchableOpacity onPress={() => handleRemoveLanguage(lang)}>
                <Ionicons name="trash-bin" size={20} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <Button title="Save Changes" onPress={handleSaveChanges} color="#6A1B9A" />
        </View>
      </ScrollView>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
  },
  checkboxOption: {
    flexDirection: "row",
    alignItems: "center",
    width: "50%",
    marginBottom: 10,
  },
  lockedText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  nonPremiumContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginVertical: 10,
  },
  dropdown: {
    height: 50,
    width: "100%",
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  selectedLanguagesContainer: {
    marginTop: 10,
  },
  selectedLanguageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
  },
  selectedLanguage: {
    fontSize: 16,
    color: "#333",
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default EditProfileScreen;
