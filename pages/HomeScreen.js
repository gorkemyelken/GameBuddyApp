import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.upcomingFeatures}>
          <Text style={styles.sectionTitle}>Upcoming Features</Text>
          <Text style={styles.featureItem}>✨ Matchmaking improvements</Text>
          <Text style={styles.featureItem}>✨ Enhanced user profiles</Text>
          <Text style={styles.featureItem}>✨ New game integrations</Text>
          <Text style={styles.featureItem}>✨ Voice Chat</Text>
        </View>

        <View style={styles.recentActivity}>
          <Text style={styles.sectionTitle}>Recent Activity DUZENLENECEK!!!</Text>
          <Text style={styles.activityItem}>You matched with Gorkem!</Text>
          <Text style={styles.activityItem}>You played Fortnite on Oct 28.</Text>
        </View>

        <View style={styles.notifications}>
          <Text style={styles.sectionTitle}>Notifications DUZENLENECEK!!!</Text>
          <Text style={styles.notificationItem}>You have a new message from Gorkem 2.</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  upcomingFeatures: {
    marginVertical: 20,
    padding: 20,
    backgroundColor: '#fff', 
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 24, 
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#6A1B9A', 
  },
  featureItem: {
    fontSize: 16,
    marginVertical: 5,
  },
  recentActivity: {
    marginVertical: 20,
    padding: 20,
    backgroundColor: '#fff', 
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  activityItem: {
    fontSize: 16,
    marginVertical: 5,
  },
  notifications: {
    marginVertical: 20,
    padding: 20,
    backgroundColor: '#fff', 
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  notificationItem: {
    fontSize: 16,
    marginVertical: 5,
  },
});

export default HomeScreen;