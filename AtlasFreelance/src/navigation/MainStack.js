import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/main/HomeScreen';

const Main = createNativeStackNavigator();
export default function MainStack() {
  return (
    <Main.Navigator>
      <Main.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Accueil' }}
      />
    </Main.Navigator>
  );
}