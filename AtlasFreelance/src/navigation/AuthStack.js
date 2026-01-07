// src/navigation/AuthStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import SignupRoleScreen from '../screens/auth/SignupRoleScreen';
import SignupFreelancerScreen from '../screens/auth/SignupFreelancerScreen';
import SignupClientScreen from '../screens/auth/SignupClientScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import VerifyEmailScreen from '../screens/auth/VerifyEmailScreen';
import { theme } from '../theme';

const Auth  = createNativeStackNavigator();

export default function AuthStack(){
    return(
        // @ts-ignore - Ignore Auth.Navigator type mismatch
        <Auth.Navigator
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
          <Auth.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ title: 'Connexion' }}
          />
          <Auth.Screen 
            name="SignupRole" 
            component={SignupRoleScreen} 
            options={{ title: 'Créer un compte' }}
          />
          <Auth.Screen 
            name="SignupFreelancer" 
            component={SignupFreelancerScreen} 
            options={{ title: 'Inscription Freelancer' }}
          />
          <Auth.Screen 
            name="SignupClient" 
            component={SignupClientScreen} 
            options={{ title: 'Inscription Client' }}
          />
          <Auth.Screen 
            name="ForgotPassword" 
            component={ForgotPasswordScreen} 
            options={{ title: 'Mot de passe oublié' }}
          />
          <Auth.Screen 
            name="VerifyEmail" 
            component={VerifyEmailScreen} 
            options={{ title: 'Vérification email' }}
          />
          {/* Keep old register screen for backward compatibility */}
          <Auth.Screen 
            name="Register" 
            component={RegisterScreen} 
            options={{ title: 'Inscription' }}
          />
        </Auth.Navigator>
    )
}
