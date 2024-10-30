import React from 'react';
import { View, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { Text } from 'react-native-paper'; 
import { useAuth } from '../AuthContext'; 
import { useNavigation } from '@react-navigation/native'; 
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import Navbar from '../components/Navbar';

const ProfileScreen = () => {
  const { userData } = useAuth(); 
  const navigation = useNavigation(); 

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.profileCard}>
            <Image 
              source={{ uri: userData?.avatar || 'https://via.placeholder.com/100' }} // Placeholder avatar
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
                <Text style={styles.label}>Premium: {userData?.premium ? 'Yes' : 'No'}</Text>
              </View>
            </View>
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
    backgroundColor: '#f5f5f5',
  },
  container: {
    alignItems: 'center',
    width: '100%',
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoContainer: {
    width: '100%',
    marginTop: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  label: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
