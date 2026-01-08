// src/screens/public/PricingScreen.js
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity } from 'react-native';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { theme } from '../../theme';

export default function PricingScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.title}>Tarifs simples et transparents</Text>
        <Text style={styles.subtitle}>
          Choisissez l'option qui vous convient le mieux
        </Text>
      </Animated.View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pour les clients</Text>
        
        <TouchableOpacity activeOpacity={0.9}>
          <Card variant="elevated" style={styles.pricingCard}>
            <Text style={styles.planName}>Gratuit</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>0 DH</Text>
              <Text style={styles.period}>/mois</Text>
            </View>
            <View style={styles.featuresList}>
              <Text style={styles.feature}>✓ Publication illimitée de projets</Text>
              <Text style={styles.feature}>✓ Accès à tous les freelancers</Text>
              <Text style={styles.feature}>✓ Support par email</Text>
              <Text style={styles.feature}>✓ Paiement sécurisé</Text>
            </View>
            <Text style={styles.commission}>Commission: 5% sur chaque projet</Text>
            <Button
              title="Commencer gratuitement"
              onPress={() => navigation.navigate('Auth')}
              variant="primary"
            />
          </Card>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.9}>
          <Card variant="elevated" style={styles.pricingCard}>
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>POPULAIRE</Text>
            </View>
            <Text style={styles.planName}>Pro</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>299 DH</Text>
              <Text style={styles.period}>/mois</Text>
            </View>
            <View style={styles.featuresList}>
              <Text style={styles.feature}>✓ Tout du plan Gratuit</Text>
              <Text style={styles.feature}>✓ Support prioritaire 24/7</Text>
              <Text style={styles.feature}>✓ Gestionnaire de compte dédié</Text>
              <Text style={styles.feature}>✓ Facturation automatisée</Text>
              <Text style={styles.feature}>✓ Statistiques avancées</Text>
            </View>
            <Text style={styles.commission}>Commission: 2% sur chaque projet</Text>
            <Button
              title="Passer au Pro"
              onPress={() => navigation.navigate('Auth')}
              variant="primary"
            />
          </Card>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pour les freelancers</Text>
        
        <TouchableOpacity activeOpacity={0.9}>
          <Card variant="elevated" style={styles.pricingCard}>
            <Text style={styles.planName}>Gratuit</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>0 DH</Text>
              <Text style={styles.period}>/mois</Text>
            </View>
            <View style={styles.featuresList}>
              <Text style={styles.feature}>✓ Profil freelance</Text>
              <Text style={styles.feature}>✓ Soumission de propositions</Text>
              <Text style={styles.feature}>✓ Portfolio en ligne</Text>
              <Text style={styles.feature}>✓ 3 projets simultanés max</Text>
            </View>
            <Text style={styles.commission}>Commission: 10% sur chaque projet</Text>
            <Button
              title="Créer mon profil"
              onPress={() => navigation.navigate('Auth')}
              variant="outline"
            />
          </Card>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.9}>
          <Card variant="elevated" style={styles.pricingCard}>
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>RECOMMANDÉ</Text>
            </View>
            <Text style={styles.planName}>Premium</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>199 DH</Text>
              <Text style={styles.period}>/mois</Text>
            </View>
            <View style={styles.featuresList}>
              <Text style={styles.feature}>✓ Tout du plan Gratuit</Text>
              <Text style={styles.feature}>✓ Badge vérifié</Text>
            <Text style={styles.feature}>✓ Projets illimités</Text>
            <Text style={styles.feature}>✓ Visibilité améliorée</Text>
            <Text style={styles.feature}>✓ Propositions prioritaires</Text>
            <Text style={styles.feature}>✓ Statistiques détaillées</Text>
          </View>
          <Text style={styles.commission}>Commission: 5% sur chaque projet</Text>
          <Button
            title="Devenir Premium"
            onPress={() => navigation.navigate('Auth')}
            variant="primary"
          />
        </Card>
        </TouchableOpacity>
      </View> 

      <View style={styles.faqSection}>
        <Text style={styles.sectionTitle}>Questions fréquentes</Text>
        
        <Card style={styles.faqCard}>
          <Text style={styles.faqQuestion}>Puis-je changer de plan ?</Text>
          <Text style={styles.faqAnswer}>
            Oui, vous pouvez passer à un plan supérieur ou annuler votre abonnement à tout moment.
          </Text>
        </Card>

        <Card style={styles.faqCard}>
          <Text style={styles.faqQuestion}>Comment sont calculées les commissions ?</Text>
          <Text style={styles.faqAnswer}>
            Les commissions sont automatiquement déduites du montant total du projet lors du paiement.
          </Text>
        </Card>

        <Card style={styles.faqCard}>
          <Text style={styles.faqQuestion}>Y a-t-il des frais cachés ?</Text>
          <Text style={styles.faqAnswer}>
            Non, tous nos tarifs sont transparents. Aucun frais caché ou surprise.
          </Text>
        </Card>
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
    padding: theme.spacing['3xl'],
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.inverse,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.background.secondary,
    textAlign: 'center',
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
  pricingCard: {
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.xl,
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    right: 20,
    backgroundColor: theme.colors.secondary.main,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  popularText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.inverse,
  },
  planName: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.base,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: theme.spacing.xl,
  },
  price: {
    fontSize: theme.typography.fontSize['4xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.main,
  },
  period: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.xs,
  },
  featuresList: {
    marginBottom: theme.spacing.lg,
  },
  featureItem: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
    lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.relaxed,
  },
  commission: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    fontStyle: 'italic',
  },
  faqSection: {
    padding: theme.spacing.xl,
  },
  faqCard: {
    marginBottom: theme.spacing.base,
    padding: theme.spacing.lg,
  },
  faqQuestion: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semiBold ,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  faqAnswer: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.relaxed,
  },
});
