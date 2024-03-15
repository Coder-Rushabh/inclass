import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

const Login = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    GoogleSignin.configure({ webClientId: '534547516203-5s4l1147ci9bmgnab3aqn7ngertlkfao.apps.googleusercontent.com' });
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const usrInfo = await GoogleSignin.signIn();
      setUserInfo(usrInfo);
    } catch (error) {
      console.error('Google sign-in error:', error);
      // Add logic to handle errors and provide user feedback
    }
  };

  return (
    <View>
      <Text onPress={signIn}>Sign in</Text>
      <Text>Sign out</Text>
    </View>
  );
};

export default Login;
