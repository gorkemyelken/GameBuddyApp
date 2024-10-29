import React, { useState } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { useAuth } from '../AuthContext'; // AuthContext'ten kullanıcı bilgilerini almak için hook'u kullan

const LoginScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { setUserData } = useAuth(); // AuthContext'ten setUserData'yı al

  const handleLogin = async () => {
    try {
      const response = await fetch('https://gamebuddy-auth-service-b40a307cb66b.herokuapp.com/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);
        setUserData(data); // Kullanıcı verilerini güncelle
        navigation.navigate('Profile'); // ProfileScreen'e yönlendirme
      } else {
        console.error('Login failed:', data);
        setErrorMessage('Kullanıcı adı veya şifre yanlış');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('Bir hata oluştu, lütfen tekrar deneyin');
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register'); // Kayıt olma sayfasına yönlendir
  };

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://yyamimarlik.s3.eu-north-1.amazonaws.com/gamebuddy-logo.png' }}
        style={styles.logo}
      />
      <Text style={styles.title}>GameBuddy</Text>
      <TextInput
        label="Kullanıcı Adı"
        mode="outlined"
        style={styles.input}
        value={userName}
        onChangeText={setUserName} // Kullanıcı adı için değişiklikleri kaydet
      />
      <TextInput
        label="Şifre"
        mode="outlined"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword} // Şifre için değişiklikleri kaydet
      />
      {errorMessage ? (
        <Text style={styles.error}>{errorMessage}</Text> // Hata mesajı
      ) : null}
      <Button 
        mode="contained" 
        onPress={handleLogin} 
        style={styles.button}
      >
        Giriş Yap
      </Button>
      <Button 
        mode="outlined" 
        onPress={handleRegister} 
        style={styles.button}
      >
        Kayıt Ol
      </Button>
      <Text style={styles.footer}>Created by Görkem Yelken</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6A1B9A',
    backgroundColor: '#FFFFFF',
    padding: 5,
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    marginBottom: 10,
  },
  button: {
    width: '100%',
    marginVertical: 10,
  },
  footer: {
    marginTop: 20,
    fontSize: 14,
    color: '#888',
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default LoginScreen;
