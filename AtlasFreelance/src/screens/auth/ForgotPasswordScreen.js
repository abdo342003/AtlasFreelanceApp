// src/screens/auth/ForgotPasswordScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { theme } from '../../theme';
import { validateForm, validators } from '../../utils/validation';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const validationRules = {
      email: [
        (v) => validators.required(v, 'Email'),
        validators.email
      ],
    };

    const result = validateForm({ email }, validationRules);
    
    if (!result.isValid) {
      setError(result.errors.email || '');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual forgot password API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Email envoyé',
        'Vérifiez votre boîte mail pour réinitialiser votre mot de passe.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (err) {
      Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Mot de passe oublié</Text>
        <Text style={styles.subtitle}>
          Entrez votre email pour recevoir un lien de réinitialisation
        </Text>

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="votre@email.com"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              setError('');
            }}
            error={error}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Button
            title="Envoyer le lien"
            onPress={handleSubmit}
            loading={loading}
            size="lg"
            fullWidth
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>← Retour à la connexion</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  content: {
    flex: 1,
    padding: theme.spacing.xl,
    justifyContent: 'center',
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  description: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing['3xl'],
  },
  form: {
    gap: theme.spacing.lg,
  },
  footer: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  footerLink: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.primary.main,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
});
