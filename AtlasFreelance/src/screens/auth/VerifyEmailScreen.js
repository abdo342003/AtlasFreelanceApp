// src/screens/auth/VerifyEmailScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Button from '../../components/ui/Button';
import { theme } from '../../theme';

export default function VerifyEmailScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  const handleResendEmail = async () => {
    setLoading(true);
    try {
      // TODO: Implement actual resend verification email API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert('Email renvoyé', 'Vérifiez votre boîte mail.');
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>📧</Text>
        <Text style={styles.title}>Vérifiez votre email</Text>
        <Text style={styles.subtitle}>
          Nous avons envoyé un lien de vérification à votre adresse email.
          Cliquez sur le lien pour activer votre compte.
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 Pensez à vérifier vos spams si vous ne recevez pas l'email.
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            title="Renvoyer l'email"
            onPress={handleResendEmail}
            loading={loading}
            variant="outline"
            size="lg"
            fullWidth
          />

          <Button
            title="Retour à l'accueil"
            onPress={() => navigation.navigate('Login')}
            variant="ghost"
            size="lg"
            fullWidth
          />
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
    alignItems: 'center',
  },
  icon: {
    fontSize: 80,
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.base,
    textAlign: 'center',
  },
  description: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.relaxed,
  },
  infoBox: {
    backgroundColor: theme.colors.info.light + '20',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.base,
    marginBottom: theme.spacing['2xl'],
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.info.main,
  },
  infoText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.info.dark,
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    gap: theme.spacing.md,
  },
});
