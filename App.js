import React from 'react';
import Login from './App/Screen/Login';
import { NavigationContainer } from '@react-navigation/native';
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

