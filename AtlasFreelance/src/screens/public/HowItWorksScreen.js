// src/screens/public/HowItWorksScreen.js
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity } from 'react-native';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { theme } from '../../theme';

export default function HowItWorksScreen({ navigation }) {
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
        <Text style={styles.title}>Comment ça marche ?</Text>
        <Text style={styles.subtitle}>
          Créez, gérez et livrez vos projets en toute simplicité
        </Text>
      </Animated.View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pour les clients</Text>
        
        <TouchableOpacity activeOpacity={0.9}>
          <Card variant="elevated" style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Publiez votre projet</Text>
              <Text style={styles.stepDescription}>
                Décrivez votre besoin, définissez votre budget et vos délais
              </Text>
            </View>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.9}>
          <Card variant="elevated" style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Recevez des propositions</Text>
              <Text style={styles.stepDescription}>
                Les freelancers qualifiés vous envoient leurs offres
              </Text>
            </View>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.9}>
          <Card variant="elevated" style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Choisissez votre freelancer</Text>
              <Text style={styles.stepDescription}>
                Comparez les profils, tarifs et choisissez le meilleur
              </Text>
            </View>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.9}>
          <Card variant="elevated" style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Recevez votre projet</Text>
              <Text style={styles.stepDescription}>
                Collaborez, suivez l'avancement et validez le livrable
              </Text>
            </View>
          </Card>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pour les freelancers</Text>
        
        <TouchableOpacity activeOpacity={0.9}>
          <Card variant="elevated" style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Créez votre profil</Text>
              <Text style={styles.stepDescription}>
                Mettez en avant vos compétences et votre portfolio
              </Text>
            </View>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.9}>
          <Card variant="elevated" style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Trouvez des projets</Text>
            <Text style={styles.stepDescription}>
              Parcourez les opportunités qui correspondent à vos skills
            </Text>
          </View>
        </Card>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.9}>
          <Card variant="elevated" style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Soumettez vos offres</Text>
              <Text style={styles.stepDescription}>
                Proposez vos services avec un tarif compétitif
              </Text>
            </View>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.9}>
          <Card variant="elevated" style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Travaillez et gagnez</Text>
              <Text style={styles.stepDescription}>
                Livrez le projet et recevez votre paiement sécurisé
              </Text>
            </View>
          </Card>
        </TouchableOpacity>
      </View>

      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Prêt à commencer ?</Text>
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
  stepCard: {
    flexDirection: 'row',
    marginBottom: theme.spacing.base,
    padding: theme.spacing.lg,
  },
  stepNumber: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.base,
  },
  stepNumberText: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.inverse,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  stepDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    lineHeight: theme.typography.fontSize.sm * theme.typography.lineHeight.relaxed,
  },
  ctaSection: {
    padding: theme.spacing['3xl'],
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xl,
  },
});
