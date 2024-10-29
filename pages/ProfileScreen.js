import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../AuthContext'; // AuthContext'ten kullanıcı bilgilerini almak için hook'u kullan

const ProfileScreen = () => {
  const { userData } = useAuth(); // AuthContext'ten kullanıcı verilerini al
  const navigation = useNavigation(); // Navigasyon objesini al

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil Bilgileri</Text>
      {userData?.profilePhoto ? (
        <Image 
          source={{ uri: userData.profilePhoto }} // Kullanıcı fotoğrafı varsa göster
          style={styles.profilePhoto}
        />
      ) : (
        <View style={styles.profilePhotoPlaceholder} /> // Yoksa yer tutucu
      )}
      <Text style={styles.label}>Kullanıcı Adı: {userData?.userName}</Text>
      <Text style={styles.label}>E-posta: {userData?.email}</Text>
      <Text style={styles.label}>Yaş: {userData?.age}</Text>
      <Text style={styles.label}>Cinsiyet: {userData?.gender}</Text>
      <Text style={styles.label}>Premium: {userData?.premium ? 'Evet' : 'Hayır'}</Text>

      {/* Modern Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('User List')}>
          <Ionicons name="people" size={24} color="#6A1B9A" />
          <Text style={styles.navText}>Kullanıcılar</Text>
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
    justifyContent: 'flex-start', // İçeriği üstte başlat
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 50
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6A1B9A',
    marginBottom: 20,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  profilePhotoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  footer: {
    marginTop: 20,
    fontSize: 14,
    color: '#888',
  },
  navbar: {
    position: 'absolute', // Sabit konum
    bottom: 0, // En alt kısımda
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%', // Genişliği %100
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#6A1B9A',
  },
});

export default ProfileScreen;
