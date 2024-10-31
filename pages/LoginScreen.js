import React, { useState } from 'react';
import { View, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { useAuth } from '../AuthContext'; 

const LOGIN_API_URL = 'https://gamebuddy-auth-service-b40a307cb66b.herokuapp.com/api/v1/auth/login';

const LoginScreen = ({ navigation }) => {
  const { updateUserData } = useAuth(); 
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!userName || !password) {
      Alert.alert('Error', 'Please enter your username and password.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(LOGIN_API_URL, { userName, password });
      if (response.data.success === true) {
        console.log(response.data.data)
        updateUserData(response.data.data); 
        navigation.navigate('HomeScreen');
      } else {
        Alert.alert('Error', response.data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image 
          source={{ uri: 'https://yyamimarlik.s3.eu-north-1.amazonaws.com/gamebuddy-logo.png' }}
          style={styles.logo} 
        />
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={24} color="#6A1B9A" style={styles.icon} />
          <TextInput
            label="Username"
            value={userName}
            onChangeText={text => setUserName(text)}
            mode="outlined"
            style={styles.input}
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={24} color="#6A1B9A" style={styles.icon} />
          <TextInput
            label="Password"
            value={password}
            onChangeText={text => setPassword(text)}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />
        </View>
        <Button 
          mode="contained" 
          onPress={handleLogin} 
          loading={loading}
          style={styles.loginButton}
          contentStyle={styles.buttonContent}
        >
          Log In
        </Button>
        <Button 
          mode="text" 
          onPress={() => navigation.navigate('RegisterScreen')} 
          style={styles.registerButton}
        >
          Don't have an account? Register
        </Button>
        <Text style={styles.title}>Developed by Görkem Yelken.</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
    tintColor: '#6A1B9A',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
  },
  loginButton: {
    width: '100%',
    marginTop: 10,
    backgroundColor: '#6A1B9A',
  },
  buttonContent: {
    paddingVertical: 8,
  },
  registerButton: {
    marginTop: 10,
  },
});

export default LoginScreen;
