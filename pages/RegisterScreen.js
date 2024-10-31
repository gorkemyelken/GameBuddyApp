import React, { useState } from 'react';
import { View, StyleSheet, Alert, Text, ScrollView } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const REGISTER_API_URL = 'https://gamebuddy-auth-service-b40a307cb66b.herokuapp.com/api/v1/auth/register';

const RegisterScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!userName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(REGISTER_API_URL, { userName, email, password });
      if (response.data.success === true) {
        Alert.alert('Success', response.data.message);
        navigation.navigate('LoginScreen');
      } else {
        Alert.alert('Failed', response.data.message);
      }
    } catch (error) {

      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        
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
          <Ionicons name="mail-outline" size={24} color="#6A1B9A" style={styles.icon} />
          <TextInput
            label="Email"
            value={email}
            onChangeText={text => setEmail(text)}
            mode="outlined"
            keyboardType="email-address"
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

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={24} color="#6A1B9A" style={styles.icon} />
          <TextInput
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={text => setConfirmPassword(text)}
            mode="outlined"
            secureTextEntry
            style={styles.input}
          />
        </View>

        <Button 
          mode="contained" 
          onPress={handleRegister} 
          loading={loading}
          style={styles.registerButton}
          contentStyle={styles.buttonContent}
        >
          Register
        </Button>

        <Button 
          mode="text" 
          onPress={() => navigation.navigate('LoginScreen')} 
          style={styles.loginButton}
        >
          Already have an account? Log In
        </Button>
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
  registerButton: {
    width: '100%',
    marginTop: 10,
    backgroundColor: '#6A1B9A',
  },
  buttonContent: {
    paddingVertical: 8,
  },
  loginButton: {
    marginTop: 10,
  },
});

export default RegisterScreen;
