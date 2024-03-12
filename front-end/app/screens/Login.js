import axios from "axios";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCustomNavigation } from "../navigation/customNavigationHook";
import { validateEmail } from "../misc/ValidationUtils";

import Constants from 'expo-constants';
const baseUrl = Constants.expoConfig.extra.BASE_URL;

function Login({ navigation }) {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [isEmailValid, setIsEmailValid] = useState(true);

  const handleSubmit = async () => {
    const { email, password } = data;
  
    // Validate email
    const isEmailValid = validateEmail(email);
    setIsEmailValid(isEmailValid);
  
    // Check if email is valid
    if (!isEmailValid) {
      Alert.alert("Error", "Invalid email address.");
      return;
    }
  
    try {
      const response = await axios.post(
        `${baseUrl}/api/users/login`,
        data
      );
  
      if (response.status === 201) {
        Alert.alert("Login Successfully!");
  
        await AsyncStorage.setItem("accessToken", response.data.accessToken);
  
        setData({ email: "", password: "" });
  
        // Navigate to Home screen and pass the token as a parameter
        navigation.navigate("Home", { token: response.data.accessToken });
      }
    } catch (error) {
      // Handle Axios network errors
      if (error.isAxiosError && !error.response) {
        console.error("Axios network error:", error);
        Alert.alert("Error", "Network error occurred during login.");
        return;
      }
  
      // Handle other errors
      if (error.response) {
        switch (error.response.status) {
          case 400:
            Alert.alert("Error", "All fields are mandatory.");
            break;
          case 401:
            Alert.alert("Error", "Invalid password.");
            break;
          case 404:
            Alert.alert("Error", "Email not found.");
            break;
          default:
            console.error("Server error:", error.response.data);
            Alert.alert("Error", "An error occurred.");
            break;
        }
      } else {
        console.error("Other error:", error);
        Alert.alert("Error", "An error occurred during login.");
      }
    }
  };
  


  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Log In</Text>
      <TextInput
        style={[
          styles.input,
          !isEmailValid && { borderColor: "red" }, // Change border color if email is invalid
        ]}
        value={data.email}
        placeholder="Email"
        onChangeText={(text) => {
          setData({ ...data, email: text });
          setIsEmailValid(validateEmail(text)); // Update the email validity state
        }}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={data.password}
        onChangeText={(text) => setData({ ...data, password: text })}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <Text style={styles.subText}>or</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={useCustomNavigation().navigateToSignUp}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  subText: {
    fontSize: 16,
    color: "black",
    margin: 10,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    width: 200,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },
});

export default Login;
