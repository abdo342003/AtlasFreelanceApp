import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../../theme';
import { useAuth } from '../../context/AuthContext';

export default function ClientDashboardScreen() {
  const { user } = useAuth();

  const metrics = [
    { label: 'Projets actifs', value: 2, accent: theme.colors.primary },
    { label: 'Candidatures reçues', value: 6, accent: theme.colors.status.success },
    { label: 'Messages non lus', value: 3, accent: theme.colors.warning },
  ];

  const quickActions = [
    'Créer un projet',
    'Voir mes candidatures',
    'Gérer mon budget',
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Bienvenue, {user?.name || 'Client'}</Text>
      </View>

      <View style={styles.metricsRow}>
        {metrics.map((item) => (
          <View key={item.label} style={styles.metricCard}>
            <Text style={styles.metricLabel}>{item.label}</Text>
            <Text style={[styles.metricValue, { color: item.accent }]}>{item.value}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions rapides</Text>
        {quickActions.map((action) => (
          <View key={action} style={styles.actionItem}>
            <Text style={styles.actionText}>• {action}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    backgroundColor: theme.colors.background.secondary,
    gap: theme.spacing.lg,
  },
  header: {
    gap: theme.spacing.xs,
  },
  title: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
    gap: theme.spacing.xs,
  },
  metricLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  metricValue: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.sm,
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
  },
  actionItem: {
    paddingVertical: theme.spacing.xs,
  },
  actionText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.base,
  },
});
