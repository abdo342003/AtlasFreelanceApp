// src/screens/auth/SignupRoleScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Card from '../../components/ui/Card';
import { theme } from '../../theme';

export default function SignupRoleScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Créer un compte</Text>
        <Text style={styles.subtitle}>
          Choisissez le type de compte qui vous correspond
        </Text>
      </View>

      <View style={styles.cardsContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('SignupFreelancer')}
        >
          <Card style={styles.roleCard}>
            <Text style={styles.roleIcon}>💼</Text>
            <Text style={styles.roleTitle}>Freelancer</Text>
            <Text style={styles.roleDescription}>
              Je souhaite proposer mes services et trouver des missions
            </Text>
            <View style={styles.roleFeatures}>
              <Text style={styles.roleFeature}>✓ Créer mon profil</Text>
              <Text style={styles.roleFeature}>✓ Trouver des projets</Text>
              <Text style={styles.roleFeature}>✓ Recevoir des paiements</Text>
            </View>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('SignupClient')}
        >
          <Card style={styles.roleCard}>
            <Text style={styles.roleIcon}>🏢</Text>
            <Text style={styles.roleTitle}>Client</Text>
            <Text style={styles.roleDescription}>
              Je cherche des freelancers pour mes projets
            </Text>
            <View style={styles.roleFeatures}>
              <Text style={styles.roleFeature}>✓ Publier des projets</Text>
              <Text style={styles.roleFeature}>✓ Trouver des talents</Text>
              <Text style={styles.roleFeature}>✓ Gérer mes équipes</Text>
            </View>
          </Card>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Vous avez déjà un compte ? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerLink}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  contentContainer: {
    padding: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing['3xl'],
    marginTop: theme.spacing['2xl'],
  },
  title: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  cardsContainer: {
    gap: theme.spacing.xl,
  },
  roleCard: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  roleIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.base,
  },
  roleTitle: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  roleDescription: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.relaxed,
  },
  roleFeatures: {
    alignSelf: 'stretch',
    paddingLeft: theme.spacing.xl,
  },
  roleFeature: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing['3xl'],
  },
  footerText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
  },
  footerLink: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.primary.main,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
});
