// src/screens/auth/LoginScreen.js
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../../context/AuthContext'

export default function LoginScreen({ navigation }) {
  const {loginAsAdmin,loginAsUser} = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Écran de connexion</Text>
      <Button title="Se connecter en admin" onPress={loginAsAdmin} />
      <Button title="Se connecter en utilisateur" onPress={loginAsUser} />
    </View>

  );
}
