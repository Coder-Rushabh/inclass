import React from 'react';
import Login from './App/Screen/Login';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import StudentSignup from './App/Screen/Student/StudentSignup';
import ScanQR from './App/Screen/Student/ScanQR'
import StudentSignin from './App/Screen/Student/StudentSignin';
import Success from './App/Screen/Student/Success';

import AdminSignin from './App/Screen/Admin/AdminSignin'
import AdminSignup from './App/Screen/Admin/AdminSignup'
import GenerateQR from './App/Screen/Admin/GenerateQR';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
           <Stack.Navigator screenOptions={{
            headerShown: false
          }} initialRouteName="Login">
            
            <Stack.Screen name="Login" component={Login} />

            <Stack.Screen name="StudentSignup" component={StudentSignup} />
            <Stack.Screen name="StudentSignin" component={StudentSignin} />
            <Stack.Screen name="ScanQR" component={ScanQR} />
            <Stack.Screen name="Success" component={Success} />

            <Stack.Screen name="AdminSignup" component={AdminSignup} />
            <Stack.Screen name="AdminSignin" component={AdminSignin} />
            <Stack.Screen name="GenerateQR" component={GenerateQR} />

           </Stack.Navigator>
       </NavigationContainer>
  );
}

