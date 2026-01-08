import { StatusBar } from 'expo-status-bar';
import { StyleSheet, 
  Text, Button,
   View, Image,
   TouchableHighlight, ScrollView,
    TextInput, Pressable } from 'react-native';
import React ,{useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScreenStackHeaderSearchBarView } from 'react-native-screens';

// App.js
import AuthStack from './src/navigation/AuthStack';
import AdminStack from './src/navigation/AdminStack';
import MainStack from './src/navigation/MainStack';
import ClientTabs from './src/navigation/ClientTabs';
import PublicStack from './src/navigation/PublicStack';
import {useAuth,AuthProvider} from './src/context/AuthContext';

const Root = createNativeStackNavigator();
export function RootNavigator() {
  const {user} = useAuth();
  return (
    <NavigationContainer>
      <Root.Navigator screenOptions={{ headerShown: false }}>
        {!user && (
          <>
            <Root.Screen name="Public" component={PublicStack} />
            <Root.Screen name="Auth" component={AuthStack} />
          </>
        )}
        {user && user.role === 'admin'&&(
          <Root.Screen name="Admin" component={AdminStack} />
        )}
        {user && user.role === 'user' &&(
          <Root.Screen name="Main" component={MainStack}/>
        )}
        {user && user.role === 'client' &&(
          <Root.Screen name="Client" component={ClientTabs}/>
        )}
      </Root.Navigator>
    </NavigationContainer>
  );
}

export default function App(){
  return(
    <AuthProvider>
      <RootNavigator/>
    </AuthProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1, <-- ZOWLHA (DELETE IT)
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40, // Bach l-content ma-ylsa9ch f l-bord
  },
  avatar: {
    width: 150,   // Darouri
    height: 150,  // Darouri
    borderRadius: 75,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
  },
});
