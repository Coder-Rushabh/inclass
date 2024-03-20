import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text , TouchableOpacity, ActivityIndicator} from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from "firebase/firestore";
import { db } from '../../firebase'
import AsyncStorage from '@react-native-async-storage/async-storage';


const AdminSignup = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // State to manage loading status


  const handleSignup = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const user = userCredential.user;

      await setDoc(doc(db, "admins", user.uid), {
        name,
        email,
      });

      const adminInfo = {
        name,
        email,
      };
      await AsyncStorage.setItem('userType', 'admin');

      await AsyncStorage.setItem('userInfo', JSON.stringify(adminInfo));
      await AsyncStorage.setItem('userType', 'admin');

    } catch (error) {
      console.error('Signup error:', error);
      setError('Signup failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.signUpText}>Sign Up</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
     <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign up</Text>
        )}
      </TouchableOpacity>

      <View style={styles.loginTextContainer}>
        <Text style={styles.loginText}>
          Already have an account?{' '}
          <Text
            style={styles.loginLink}
            onPress={() => navigation.navigate('AdminSignin')}
          >
            Log in 
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: "10%",
  },
  signUpText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#007bff",
  },
  input: {
    width: "100%",
    height: 50,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  button: {
    width: "100%",
    backgroundColor: "#007bff",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: 20,
  },
  loginTextContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  loginText: {
    fontSize: 16,
    color: "#555",
  },
  loginLink: {
    color: "#007bff",
    fontWeight: "bold",
  },
});

export default AdminSignup;
