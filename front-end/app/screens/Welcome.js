import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useCustomNavigation } from '../navigation/customNavigationHook';


export default function Welcome() {
  

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../../assets/icon.png')}
      />
      <Text style={styles.text}>play songs.</Text>
      <Text style={styles.subText}>Free on BeatBox</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={ useCustomNavigation().navigateToSignUp} style={styles.button} >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={useCustomNavigation().navigateToLogin} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff', // Dark background color (black)
    // paddingBottom:'130%',
    // marginTop:0,
    
    
  },
  logo: {
    width: 200,
    height: 200,
    // marginTop: "50%",
    marginBottom: "10%",
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  subText: {
    fontSize: 25,
    color: 'black',
    marginBottom: 40,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
        // marginTop:"30%",
        // marginBottom:"23%"
  },
  button: {
    backgroundColor: '#007AFF',
    width: 200,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
