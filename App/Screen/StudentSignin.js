import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text , TouchableOpacity} from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const StudentSignin = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);

      const user = userCredential.user;
      const userQuery = query(collection(db, 'students'), where('email', '==', email));
      const querySnapshot = await getDocs(userQuery);
      if (!querySnapshot.empty) {
        querySnapshot.forEach(doc => {
          const userData = doc.data();
          const userName = userData.name;
          const userRollNumber = userData.rollNumber;
          
        });
      }

      const userInfo = {
        userName,
        email,
        userRollNumber,
      };


      navigation.navigate('ScanQR', { userInfo: userInfo });
    } catch (error) {
      console.error('Login error:', error);
      setError('Incorrect email or password.');
      navigation.navigate('ScanQR', { userInfo: userInfo });

    }
  };

  return (
    <View style={styles.container}>
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
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>

      <View style={styles.loginTextContainer}>
        <Text style={styles.loginText}>
          Don't have an account?{" "}
          <Text
            style={styles.loginLink}
            onPress={() => navigation.navigate("StudentLogin")}
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

export default StudentSignin;
