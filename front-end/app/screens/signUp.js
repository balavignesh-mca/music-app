import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useCustomNavigation } from '../navigation/customNavigationHook';
import { validateEmail, validatePasswordStrength } from '../misc/ValidationUtils';
import Constants from 'expo-constants';

const baseUrl = Constants.expoConfig.extra.BASE_URL;

export default function SignUp({ navigation }) {
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [data, setData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleSubmit = async () => {
    const { username, email, password } = data;

    if (!username || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePasswordStrength(password);

    setIsEmailValid(isEmailValid);
    setIsPasswordValid(isPasswordValid);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    try {
      const response = await axios.post(`${baseUrl}/api/users/register`, data);

      if (response.status === 201) {
        Alert.alert('Account created successfully!');

        // Automatically log in the user upon successful registration
        const loginResponse = await axios.post(`${baseUrl}/api/users/login`, {
          email: data.email,
          password: data.password,
        });

        console.log(loginResponse.data.statusCode);

        if (loginResponse.status === 201 && loginResponse.data.accessToken) {
          await AsyncStorage.setItem('accessToken', loginResponse.data.accessToken);

          setData({ username: '', email: '', password: '' });

          // Navigate to Home screen and pass the token as a parameter
          navigation.navigate('Home', { token: loginResponse.data.accessToken });
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        Alert.alert('Error', 'Email already exists.');
      } else {
        console.error('Axios error:', error);
        Alert.alert('Error', 'An error occurred during registration.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={data.username}
        onChangeText={(text) => setData({ ...data, username: text })}
      />
      <TextInput
        style={[
          styles.input,
          !isEmailValid && { borderColor: 'red' }, // Change border color if email is invalid
        ]}
        placeholder="Email"
        value={data.email}
        onChangeText={(text) => {
          setData({ ...data, email: text });
          setIsEmailValid(validateEmail(text)); // Update the email validity state
        }}
        keyboardType="email-address"
      />

      <TextInput
        style={[
          styles.input,
          !isPasswordValid && { borderColor: 'red' }, // Change border color if password is invalid
        ]}
        placeholder="Password"
        value={data.password}
        onChangeText={(text) => {
          setData({ ...data, password: text });
          setIsPasswordValid(validatePasswordStrength(text)); // Update the password validity state
        }}
        secureTextEntry={true}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.subText}>or</Text>

      <TouchableOpacity style={styles.button} onPress={useCustomNavigation().navigateToLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    width: 200,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 16,
    color: 'black',
    margin: 10,
  },
});
