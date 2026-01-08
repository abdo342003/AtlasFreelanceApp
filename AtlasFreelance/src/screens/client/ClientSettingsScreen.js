import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../../theme';
import { useAuth } from '../../context/AuthContext';

export default function ClientSettingsScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Êtes-vous sûr?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Déconnexion',
        onPress: () => logout(),
        style: 'destructive',
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paramètres</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profil</Text>
        <View style={styles.infoCard}>
          <Text style={styles.label}>Nom</Text>
          <Text style={styles.value}>{user?.name}</Text>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user?.email}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.base,
  },
  title: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.base,
  },
  infoCard: {
    backgroundColor: theme.colors.background.secondary,
    padding: theme.spacing.base,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  value: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
  },
  logoutButton: {
    backgroundColor: theme.colors.status.error,
    padding: theme.spacing.base,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  logoutText: {
    color: 'white',
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
});
