import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text , TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { query, collection, where, getDocs } from 'firebase/firestore'; // Import Firestore functions
import { db } from '../../firebase'
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminSignin = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // State to manage loading status


  const handleLogin = async () => {
    setLoading(true);
    try {
      const auth = getAuth();
      // Sign in with email and password
      await signInWithEmailAndPassword(auth, email, password);

      // Retrieve admin's data from Firestore based on email
      const adminQuery = query(collection(db, 'admins'), where('email', '==', email));
      const querySnapshot = await getDocs(adminQuery);
      let adminInfo = {}; // Define adminInfo object to store admin data

      if (!querySnapshot.empty) {
        querySnapshot.forEach(doc => {
          const adminData = doc.data();
          adminInfo = {
            email: adminData.email,
            name: adminData?.name,
            // You can add more admin data here if needed
          };
        });
      }

      console.log(adminInfo);
     
      await AsyncStorage.setItem('userInfo', JSON.stringify(adminInfo));
      await AsyncStorage.setItem('userType', 'admins');


      // Navigate to AdminDashboard or any other admin page with admin information
      navigation.navigate("GenerateQR", { adminInfo: adminInfo });
       

    } catch (error) {
      console.error('Login error:', error);
      setError('Incorrect email or password.'); // Set error message
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
            onPress={() => navigation.navigate('AdminSignup')}
          >
            Sign up here
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: '10%',
  },
  input: {
    height: 50,
    marginBottom: '5%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  signInText: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 60,
    textAlign: 'center',
    color: '#007bff',
  },
  error: {
    color: 'red',
    marginBottom: '5%',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: '5%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginTextContainer: {
    marginTop: '5%',
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

export default AdminSignin;
