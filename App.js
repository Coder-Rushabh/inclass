import React, { useEffect } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Login from "./App/Screen/Login";
import StudentSignup from "./App/Screen/Student/StudentSignup";
import ScanQR from "./App/Screen/Student/ScanQR";
import StudentSignin from "./App/Screen/Student/StudentSignin";
import Success from "./App/Screen/Student/Success";
import AdminSignin from "./App/Screen/Admin/AdminSignin";
import AdminSignup from "./App/Screen/Admin/AdminSignup";
import GenerateQR from "./App/Screen/Admin/GenerateQR";
import ShowData from "./App/Screen/Admin/ShowData";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
}

const AppNavigator = () => {
  const navigation = useNavigation();

  useEffect(() => {
    async function checkUserTypeAndNavigate() {
      try {
        const userType = await AsyncStorage.getItem('userType');
        if (userType === 'student') {
          const userInfoString = await AsyncStorage.getItem('userInfo');
          const userInfo = JSON.parse(userInfoString);
          if (userInfo) {
            navigation.navigate('ScanQR', { userInfo });
          } else {
            console.log('No userInfo found in AsyncStorage');
            navigation.navigate('Login');
          }
        } else if (userType === 'admin') {
          const adminInfoString = await AsyncStorage.getItem('adminInfo');
          const adminInfo = JSON.parse(adminInfoString);
          if (adminInfo) {
            navigation.navigate('GenerateQR', { adminInfo });
          } else {
            console.log('No adminInfo found in AsyncStorage');
            navigation.navigate('Login');
          }
        } else {
          console.log('Invalid userType:', userType);
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Error checking user type:', error);
      }
    }
  
    checkUserTypeAndNavigate();
  }, [navigation]);
  
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Login"
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="StudentSignup" component={StudentSignup} />
      <Stack.Screen name="StudentSignin" component={StudentSignin} />
      <Stack.Screen name="ScanQR" component={ScanQR} />
      <Stack.Screen name="Success" component={Success} />
      <Stack.Screen name="AdminSignup" component={AdminSignup} />
      <Stack.Screen name="AdminSignin" component={AdminSignin} />
      <Stack.Screen name="GenerateQR" component={GenerateQR} />
      <Stack.Screen name="ShowData" component={ShowData} />
    </Stack.Navigator>
  );
};
