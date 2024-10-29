import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';

const UserListScreen = () => {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation(); // Navigasyon objesini al

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://gamebuddy-user-service-04b8e7746067.herokuapp.com/api/v1/users', {
          method: 'GET',
          headers: {
            'accept': '*/*',
          },
        });
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.userCard}>
      {item.profilePhoto ? (
        <Image 
          source={{ uri: item.profilePhoto }} 
          style={styles.profilePhoto}
        />
      ) : (
        <View style={styles.profilePhotoPlaceholder} />
      )}
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.userName}</Text>
        <Text style={styles.userDetail}>E-posta: {item.email}</Text>
        <Text style={styles.userDetail}>Yaş: {item.age || 'N/A'}</Text>
        <Text style={styles.userDetail}>Cinsiyet: {item.gender}</Text>
        <Text style={styles.userDetail}>Premium: {item.premium ? 'Evet' : 'Hayır'}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kullanıcı Listesi</Text>
      <FlatList 
        data={users}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
      
      {/* Modern Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={24} color="#6A1B9A" />
          <Text style={styles.navText}>Anasayfa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Profile')}>
          <Ionicons name="person" size={24} color="#6A1B9A" />
          <Text style={styles.navText}>Profil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Game List')}>
          <Ionicons name="game-controller" size={24} color="#6A1B9A" />
          <Text style={styles.navText}>Oyunlar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6A1B9A',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 60, // Navbar için yeterli alan bırak
  },
  userCard: {
    flexDirection: 'row',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    elevation: 1,
  },
  profilePhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  profilePhotoPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
    marginRight: 15,
  },
  userInfo: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userDetail: {
    fontSize: 14,
    color: '#555',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    position: 'absolute',
    bottom: 0,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#6A1B9A',
  },
});

export default UserListScreen;
