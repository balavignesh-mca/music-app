import React, { useState, useEffect } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native"; // Import navigation hook
import Welcome from "./Welcome";
import AudioProvider from "../context/AudioProvider";
import AppNavigator from "../navigation/AppNavigator";
import axios from "axios";
import Constants from 'expo-constants';
const baseUrl = Constants.expoConfig.extra.BASE_URL;

export default function HomeScreen() {
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // State to manage loading indicator
  const navigation = useNavigation(); // Initialize navigation hook

  useEffect(() => {
    const fetchToken = async () => {
      try {
        // Retrieve the access token from AsyncStorage
        let get_token = await AsyncStorage.getItem("accessToken");
        console.log(get_token);

        if (get_token) {
          // Make an authenticated GET request with the access token
          const response = await axios.get(
            `${baseUrl}/api/users/verify`,
            {
              headers: { Authorization: `Bearer ${get_token}` },
            }
          );

          // Set the fetched user data in the component's state
          setUserData(response.data);
            // console.log("HOME",response.data);
          // Set the token in your component's state
          setToken(get_token);
        } else {
          // Redirect to the "Welcome" screen when the token is not available
          navigation.replace("Welcome");
        }
      } catch (error) {
        if (error.response) {
          // The server responded with a non-2xx status code
          console.error("Server Error:", error.response.data);
        } else if (error.request) {
          // The request was made, but no response was received
          console.error("No Response from Server:", error.request);
        } else {
          // Something happened while setting up the request
          console.error("Error:", error.message);
        }
      } finally {
        // Set loading to false when the token retrieval is complete
        setLoading(false);
      }
    };

    fetchToken();
  }, [navigation]);

  if (loading) {
    // Show loading indicator while waiting for token
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  } else if (token) {
    return (
      <AudioProvider>
        <AppNavigator userData={userData} />
      </AudioProvider>
    );
  } else {
    setTimeout(() => {
      return <Welcome />;
    }, 3000);
  }
}
