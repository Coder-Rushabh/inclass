import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { query, collection, where, getDocs } from 'firebase/firestore'; // Import Firestore functions
import { db } from '../../firebase';

const StudentSignin = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // State to manage loading status

  const handleLogin = async () => {
    setLoading(true); // Set loading to true when login process starts
    try {
      const auth = getAuth();
      // Sign in with email and password
      await signInWithEmailAndPassword(auth, email, password);

      // Retrieve user's data from Firestore based on email
      const userQuery = query(collection(db, 'students'), where('email', '==', email));
      const querySnapshot = await getDocs(userQuery);
      let userInfo = {}; // Define userInfo object to store user data

      if (!querySnapshot.empty) {
        querySnapshot.forEach(doc => {
          const userData = doc.data();
          userInfo = {
            name: userData.name,
            email: userData.email,
            rollNumber: userData.rollNumber,
          };
        });
      }

      console.log(userInfo);

      // Navigate to ScanQR page with user information
      navigation.navigate("ScanQR", { userInfo: userInfo });
    } catch (error) {
      console.error('Login error:', error);
      setError('Incorrect email or password.'); // Set error message
    } finally {
      setLoading(false); // Set loading to false when login process ends
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.signInText}>Sign In</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
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
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign in</Text>
        )}
      </TouchableOpacity>

      <View style={styles.loginTextContainer}>
        <Text style={styles.loginText}>
          Don't have an account?{' '}
          <Text
            style={styles.loginLink}
            onPress={() => navigation.navigate('StudentSignup')}
          >
            Create here
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  signInText: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 60,
    textAlign: 'center',
    color: '#007bff',
  },
  input: {
    height: 50,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginTextContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    color: '#555',
  },
  loginLink: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});

export default StudentSignin;
