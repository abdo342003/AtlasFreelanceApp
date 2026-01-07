// src/screens/public/AboutScreen.js
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity } from 'react-native';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { theme } from '../../theme';

export default function AboutScreen({ navigation }) {
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
        <Text style={styles.title}>À propos d'Atlas Freelance</Text>
        <Text style={styles.subtitle}>
          La plateforme de référence pour le freelancing au Maroc
        </Text>
      </Animated.View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notre mission</Text>
        <Card style={styles.card}>
          <Text style={styles.text}>
            Atlas Freelance a pour mission de connecter les meilleurs talents freelances du Maroc
            avec des entreprises qui recherchent des compétences de qualité. Nous croyons en un
            écosystème digital où chacun peut réussir grâce à ses compétences.
          </Text>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nos valeurs</Text>
        
        <TouchableOpacity activeOpacity={0.8}>
          <Card variant="elevated" style={styles.valueCard}>
            <Text style={styles.valueIcon}>🤝</Text>
            <Text style={styles.valueTitle}>Confiance</Text>
            <Text style={styles.valueDescription}>
              Nous vérifions tous nos freelancers et assurons la sécurité des paiements
            </Text>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8}>
          <Card variant="elevated" style={styles.valueCard}>
            <Text style={styles.valueIcon}>⭐</Text>
            <Text style={styles.valueTitle}>Excellence</Text>
            <Text style={styles.valueDescription}>
              Nous ne travaillons qu'avec des freelancers qualifiés et expérimentés
            </Text>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8}>
          <Card variant="elevated" style={styles.valueCard}>
            <Text style={styles.valueIcon}>🚀</Text>
            <Text style={styles.valueTitle}>Innovation</Text>
            <Text style={styles.valueDescription}>
              Nous améliorons constamment notre plateforme pour une meilleure expérience
            </Text>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8}>
          <Card variant="elevated" style={styles.valueCard}>
            <Text style={styles.valueIcon}>💡</Text>
            <Text style={styles.valueTitle}>Transparence</Text>
            <Text style={styles.valueDescription}>
              Tarifs clairs, pas de frais cachés, communication ouverte
            </Text>
          </Card>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notre équipe</Text>
        <Card style={styles.card}>
          <Text style={styles.text}>
            Notre équipe passionnée travaille chaque jour pour améliorer l'expérience de nos
            utilisateurs. Composée d'experts en technologie, en design et en service client,
            nous sommes dédiés à votre succès.
          </Text>
        </Card>
      </View>

      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Rejoignez-nous</Text>
        <Text style={styles.ctaText}>
          Faites partie de la communauté Atlas Freelance
        </Text>
        <Button
          title="Créer un compte"
          onPress={() => navigation.navigate('Auth')}
          size="lg"
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
  missionCard: {
    padding: theme.spacing.lg,
  },
  missionText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.relaxed,
    textAlign: 'center',
  },
  valueCard: {
    marginBottom: theme.spacing.base,
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  valueIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  valueTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  valueDescription: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.relaxed,
  },
  ctaSection: {
    padding: theme.spacing['3xl'],
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  ctaText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
});
