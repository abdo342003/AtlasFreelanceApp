// src/components/client/ProjectCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Card from '../ui/Card';
import { theme } from '../../theme';
import { formatBudgetRange, formatDate, formatProposalCount } from '../../utils/formatters';

export default function ProjectCard({ project, onPress }) {
  if (!project) return null;

  // Determine status badge color and label
  const getStatusBadge = (status) => {
    const statusConfig = {
      open: { label: 'Ouvert', color: theme.colors.success.main, bgColor: theme.colors.success.light },
      in_progress: { label: 'En cours', color: theme.colors.info.main, bgColor: theme.colors.info.light },
      completed: { label: 'Terminé', color: theme.colors.primary.main, bgColor: theme.colors.primary.light },
      cancelled: { label: 'Annulé', color: theme.colors.error.main, bgColor: theme.colors.error.light },
      pending: { label: 'En attente', color: theme.colors.warning.main, bgColor: theme.colors.warning.light },
    };

    return statusConfig[status] || statusConfig.open;
  };

  const statusBadge = getStatusBadge(project.status);

  return (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <Card style={styles.card}>
        {/* Header: Title & Status */}
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {project.title || 'Sans titre'}
          </Text>
          <View style={[styles.badge, { backgroundColor: statusBadge.bgColor }]}>
            <Text style={[styles.badgeText, { color: statusBadge.color }]}>
              {statusBadge.label}
            </Text>
          </View>
        </View>

        {/* Description preview */}
        {project.description && (
          <Text style={styles.description} numberOfLines={2}>
            {project.description}
          </Text>
        )}

        {/* Info Row: Budget, Date, Proposals */}
        <View style={styles.infoContainer}>
          {/* Budget */}
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>💰</Text>
            <Text style={styles.infoText}>
              {formatBudgetRange(project.budgetMin, project.budgetMax)}
            </Text>
          </View>

          {/* Date */}
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>📅</Text>
            <Text style={styles.infoText}>
              {formatDate(project.createdAt)}
            </Text>
          </View>

          {/* Proposals count */}
          <View style={styles.infoItem}>
            <Text style={styles.infoIcon}>📝</Text>
            <Text style={styles.infoText}>
              {formatProposalCount(project.proposalCount || 0)}
            </Text>
          </View>
        </View>

        {/* Category tag (optional) */}
        {project.category && (
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryTag}>#{project.category}</Text>
          </View>
        )}
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.base,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  title: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginRight: theme.spacing.sm,
  },
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  badgeText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
  description: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
    lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.sm,
  },
  infoContainer: {
    flexDirection: 'column',
    gap: theme.spacing.xs,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 16,
    marginRight: theme.spacing.xs,
  },
  infoText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    flex: 1,
  },
  categoryContainer: {
    marginTop: theme.spacing.sm,
    flexDirection: 'row',
  },
  categoryTag: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.primary.main,
    fontWeight: theme.typography.fontWeight.medium,
  },
});
