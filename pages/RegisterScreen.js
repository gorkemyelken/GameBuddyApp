import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Alert } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('MALE');
  const navigation = useNavigation(); // Navigation hook

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Şifreler eşleşmiyor!", "Lütfen şifrelerinizi kontrol edin.");
      return;
    }

    const userData = {
      userName,
      email,
      password,
      gender,
      age: parseInt(age), // Yaşı sayıya dönüştür
    };

    try {
      const response = await fetch('https://gamebuddy-auth-service-b40a307cb66b.herokuapp.com/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': '*/*',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        // Başarılı kayıt
        Alert.alert("Kayıt başarılı!", "Giriş sayfasına yönlendiriliyorsunuz.");
        navigation.navigate('Login'); // Giriş sayfasına yönlendir
      } else {
        const errorData = await response.json();
        Alert.alert("Kayıt başarısız!", errorData.message || "Bir hata oluştu.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Hata!", "Kayıt işlemi sırasında bir hata oluştu.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register</Text>
      
      <TextInput
        label="Username"
        mode="outlined"
        style={styles.input}
        value={userName}
        onChangeText={setUserName}
      />
      <TextInput
        label="Email"
        mode="outlined"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        label="Password"
        mode="outlined"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        label="Confirm Password"
        mode="outlined"
        secureTextEntry
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      
      <TextInput
        label="Age"
        mode="outlined"
        keyboardType="numeric" // Sayı girişi için
        style={styles.input}
        value={age}
        onChangeText={setAge}
      />
      
      {/* Gender Picker at the bottom */}
      <Picker
        selectedValue={gender}
        style={styles.picker}
        onValueChange={(itemValue) => setGender(itemValue)}
      >
        <Picker.Item label="Male" value="MALE" />
        <Picker.Item label="Female" value="FEMALE" />
        <Picker.Item label="Other" value="OTHER" />
      </Picker>

      <Button 
        mode="contained" 
        style={styles.button}
        onPress={handleRegister} // Kayıt işlemini başlat
      >
        Register
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
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
  picker: {
    width: '100%',
    marginBottom: 10,
  },
  button: {
    width: '100%',
    marginVertical: 10,
  },
});

export default RegisterScreen;
