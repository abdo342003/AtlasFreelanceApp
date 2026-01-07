// src/screens/public/LandingScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { theme } from '../../theme';

export default function LandingScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>
          Trouvez les meilleurs{'\n'}
          <Text style={styles.heroHighlight}>talents freelances</Text>
          {'\n'}au Maroc
        </Text>
        <Text style={styles.heroSubtitle}>
          La plateforme qui connecte entreprises et freelancers qualifiés
        </Text>
        
        <View style={styles.heroButtons}>
          <Button
            title="Commencer"
            onPress={() => navigation.navigate('Auth')}
            size="lg"
            fullWidth
          />
          <Button
            title="En savoir plus"
            onPress={() => navigation.navigate('HowItWorks')}
            variant="outline"
            size="lg"
            fullWidth
          />
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pourquoi Atlas Freelance ?</Text>
        
        <Card style={styles.featureCard}>
          <Text style={styles.featureIcon}>🎯</Text>
          <Text style={styles.featureTitle}>Talents vérifiés</Text>
          <Text style={styles.featureDescription}>
            Tous nos freelancers sont sélectionnés et vérifiés pour garantir la qualité
          </Text>
        </Card>

        <Card style={styles.featureCard}>
          <Text style={styles.featureIcon}>💰</Text>
          <Text style={styles.featureTitle}>Paiements sécurisés</Text>
          <Text style={styles.featureDescription}>
            Système de paiement escrow pour protéger clients et freelancers
          </Text>
        </Card>

        <Card style={styles.featureCard}>
          <Text style={styles.featureIcon}>⚡</Text>
          <Text style={styles.featureTitle}>Livraison rapide</Text>
          <Text style={styles.featureDescription}>
            Des projets livrés dans les délais avec suivi en temps réel
          </Text>
        </Card>

        <Card style={styles.featureCard}>
          <Text style={styles.featureIcon}>🛡️</Text>
          <Text style={styles.featureTitle}>Support 24/7</Text>
          <Text style={styles.featureDescription}>
            Une équipe dédiée pour vous accompagner à chaque étape
          </Text>
        </Card>
      </View>

      {/* Stats Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nos chiffres</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>1,234+</Text>
            <Text style={styles.statLabel}>Freelancers</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>567+</Text>
            <Text style={styles.statLabel}>Projets réalisés</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>98%</Text>
            <Text style={styles.statLabel}>Satisfaction client</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>24/7</Text>
            <Text style={styles.statLabel}>Support disponible</Text>
          </View>
        </View>
      </View>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Prêt à commencer ?</Text>
        <Text style={styles.ctaText}>
          Rejoignez des milliers de freelancers et clients satisfaits
        </Text>
        <Button
          title="Créer un compte"
          onPress={() => navigation.navigate('Auth')}
          size="lg"
        />
      </View>

      <View style={styles.footer}>
        <Button
          title="À propos"
          onPress={() => navigation.navigate('About')}
          variant="ghost"
        />
        <Button
          title="Tarifs"
          onPress={() => navigation.navigate('Pricing')}
          variant="ghost"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  hero: {
    backgroundColor: theme.colors.primary.main,
    paddingTop: theme.spacing['4xl'],
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing['3xl'],
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: theme.typography.fontSize['4xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.inverse,
    textAlign: 'center',
    marginBottom: theme.spacing.base,
  },
  heroHighlight: {
    color: '#fbbf24',
  },
  heroSubtitle: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.background.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing['2xl'],
  },
  heroButtons: {
    width: '100%',
    gap: theme.spacing.md,
  },
  content: {
    padding: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  featureCard: {
    marginBottom: theme.spacing.base,
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  featureIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  featureTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.relaxed,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    ...theme.shadows.md,
  },
  statValue: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  ctaSection: {
    backgroundColor: theme.colors.primary.main,
    padding: theme.spacing['3xl'],
    marginHorizontal: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.inverse,
    marginBottom: theme.spacing.sm,
  },
  ctaText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.background.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.base,
    paddingBottom: theme.spacing['2xl'],
  },
});
