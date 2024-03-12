import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SignUp from "../screens/signUp";
import Login from "../screens/Login";
import Welcome from "../screens/Welcome";
import HomeScreen from "../screens/Home";
import { Profile } from "../screens/profile";


const Stack = createStackNavigator();


function Navigation() {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{headerShown:false}}>
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Profile" component={Profile} />
      
       
    </Stack.Navigator>
  );
}

export default Navigation;
