import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet,Image, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from 'expo-constants';

const baseUrl = Constants.expoConfig.extra.BASE_URL;

export const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");

        if (token) {
          const response = await axios.get(
            `${baseUrl}/api/users/verify`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          setUserData(response.data);
        }

        setLoading(false);
      } catch (error) {
        handleError(error);
      }
    };

    fetchData();
  }, []);

  const handleError = (error) => {
    if (error.isAxiosError && !error.response) {
      console.error("Axios network error:", error);
      Alert.alert("Error", "Network error occurred during data fetching.");
    } else if (error.response) {
      console.error("Other error:", error);
      Alert.alert("Error", "An error occurred during data fetching.");
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");

      if (token) {
        if (!newUsername) {
          Alert.alert("Error", "Username cannot be empty.");
          return;
        }

        if (newPassword && newPassword.length < 8) {
          Alert.alert("Error", "Password must be at least 8 characters long.");
          return;
        }

        const response = await axios.put(
          `${baseUrl}/api/users/update/${userData._id}`,
          { username: newUsername, password: newPassword },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.Status === 'Success') {
          setUserData({ ...userData, username: newUsername });
          setEdit(false);
          Alert.alert("Success", "Profile updated successfully.");
        } else {
          Alert.alert("Error", "Failed to update the profile.");
        }
      }
    } catch (error) {
      handleError(error);
    }
  };

  const logout = async () => {
    await AsyncStorage.clear();
    Alert.alert("User logged out successfully");
    navigation.navigate("Welcome");
  };

  const editing = () => {
    setEdit(true);
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/icon.png')} style={styles.profileImage} />
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
        ) : userData ? (
          <View style={styles.profileContainer}>

          {edit ? (
            <View style={styles.formContainer}>
              <TextInput
                style={styles.editInput}
                placeholder="New Username"
                value={newUsername}
                onChangeText={(text) => setNewUsername(text)}
              />
              <TextInput
                style={styles.editInput}
                placeholder="New Password if needed"
                value={newPassword}
                onChangeText={(text) => setNewPassword(text)}
                secureTextEntry={true}
              />
              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleProfileUpdate}
              >
                <Text style={styles.buttonText}>Update Profile</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.userDataContainer}>
              <Text style={styles.usernameText}>
                Username: {userData.username}
              </Text>
            </View>
          )}
          {!edit && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={editing}
            >
              <Text style={styles.buttonText}>EDIT</Text>
            </TouchableOpacity>
          )}
          {!edit && (
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={logout}
            >
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <Text>No user data available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
  },
  profileContainer: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  formContainer: {
    marginBottom: 20,
  },
  userDataContainer: {
    alignItems: "center",
  },
  usernameText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  editInput: {
    width: "100%",
    height: 40,
    borderColor: "#007AFF",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  updateButton: {
    backgroundColor: "#007AFF",
    width: "100%",
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  editButton: {
    backgroundColor: "#007AFF",
    width: "100%",
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    marginTop:30, 
  },
  logoutButton: {
    backgroundColor: "#ff3b30",
    width: "100%",
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop:30,
  },
  profileImage: {
    width: 200,
    height: 200,
    
  marginTop:-150,
  marginBottom:50,
  },
});
