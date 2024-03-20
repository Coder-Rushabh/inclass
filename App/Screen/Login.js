import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Login = ({ navigation }) => {
  const handleStudentLogin = () => {
    navigation.navigate('StudentSignin');
  };

  const handleAdminLogin = () => {
    navigation.navigate('AdminSignin');
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/splash.png')} style={styles.logo} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleStudentLogin}>
          <Text style={styles.buttonText}>Student Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleAdminLogin}>
          <Text style={styles.buttonText}>Admin Login</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>© Copyright Rushabh</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: windowHeight * 0.05,
  },
  logo: {
    width: windowWidth * 0.8,
    height: windowWidth * 0.8, // Maintain aspect ratio
    resizeMode: 'contain',
  },
  buttonContainer: {
    width: '80%',
    marginBottom: windowHeight * 0.1,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: windowHeight * 0.05,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 10,
  },
  footerText: {
    color: '#777',
    fontSize: 12,
  },
});

export default Login;
