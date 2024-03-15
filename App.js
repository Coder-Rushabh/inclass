
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './App/Screen/Login'

export default function App() {
  return (
    <>
     <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    </NavigationContainer>
    </>
  );
}




/*534547516203-5s4l1147ci9bmgnab3aqn7ngertlkfao.apps.googleusercontent.com
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
*/