// src/navigation/PublicStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LandingScreen from '../screens/public/LandingScreen';
import HowItWorksScreen from '../screens/public/HowItWorksScreen';
import AboutScreen from '../screens/public/AboutScreen';
import PricingScreen from '../screens/public/PricingScreen';
import { theme } from '../theme';

const Stack = createNativeStackNavigator();

export default function PublicStack() {
  return (
    // @ts-ignore - Ignore Stack.Navigator type mismatch
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary.main,
        },
        headerTintColor: theme.colors.text.inverse,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name="Landing" 
        component={LandingScreen} 
        options={{ title: 'Atlas Freelance' }}
      />
      <Stack.Screen 
        name="HowItWorks" 
        component={HowItWorksScreen} 
        options={{ title: 'Comment ça marche' }}
      />
      <Stack.Screen 
        name="About" 
        component={AboutScreen} 
        options={{ title: 'À propos' }}
      />
      <Stack.Screen 
        name="Pricing" 
        component={PricingScreen} 
        options={{ title: 'Tarifs' }}
      />
    </Stack.Navigator>
  );
}