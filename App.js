import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Login from './App/Screen/Login';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import StudentLogin from './App/Screen/StudentLogin';
import ScanQR from './App/Screen/ScanQR'


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
           <Stack.Navigator screenOptions={{
            headerShown: false
          }} initialRouteName="Login">
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="StudentLogin" component={StudentLogin} />
            <Stack.Screen name="ScanQR" component={ScanQR} />

           </Stack.Navigator>
       </NavigationContainer>
  );
}

