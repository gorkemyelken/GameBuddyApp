// components/Navbar.js
import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../AuthContext'; // Assuming you have an AuthContext for user authentication

const Navbar = () => {
  const navigation = useNavigation();
  const { logout } = useAuth(); // Destructure the logout function from context

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          onPress: () => {
            logout(); // Call the logout function from context
            navigation.navigate('LoginScreen'); // Navigate to LoginScreen
          } 
        },
      ]
    );
  };

  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')} style={styles.button}>
        <Icon name="home-outline" size={24} color="#fff" />
        <Text style={styles.label}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.button}>
        <Icon name="person-outline" size={24} color="#fff" />
        <Text style={styles.label}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('MatchScreen')} style={styles.button}>
        <Icon name="barcode-outline" size={24} color="#fff" />
        <Text style={styles.label}>Match</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Friends')} style={styles.button}>
        <Icon name="people-outline" size={24} color="#fff" />
        <Text style={styles.label}>Friends</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout} style={styles.button}>
        <Icon name="log-out-outline" size={24} color="#fff" />
        <Text style={styles.label}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#6A1B9A', // Customize your navbar color
  },
  button: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    color: '#fff', // Text color
    fontSize: 12, // Text size
    marginTop: 4, // Space between icon and text
  },
});

export default Navbar;
