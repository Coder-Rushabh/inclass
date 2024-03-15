import {View, Text } from 'react-native'
import React, {useEffect, useState} from 'react'
import { GoogleSignin , statusCodes } from '@react-native-google-signin/google-signin'

export default function Login() {

    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        GoogleSignin.configure({webClientId:'534547516203-5s4l1147ci9bmgnab3aqn7ngertlkfao.apps.googleusercontent.com'});
    }, [])

    const signIn = async () => {
        try {
          await GoogleSignin.hasPlayServices();
          const usrInfo = await GoogleSignin.signIn();
          setUserInfo(usrInfo)
        } catch (error) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
          } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (e.g. sign in) is in progress already
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // play services not available or outdated
          } else {
            // some other error happened
          }
        }
      };

    return (
        <>
        <View>
            <Text onPress={() => signIn()}>Sigin</Text>
            <Text>Signout</Text>
        </View>
        </>
    );
}