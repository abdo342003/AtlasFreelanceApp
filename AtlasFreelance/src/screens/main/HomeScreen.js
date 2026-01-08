// src/screens/main/HomeScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { projectService } from '../../services/projectService';
import { theme } from '../../theme';
import Card from '../../components/ui/Card';

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      
      const statsResponse = await userService.getUserStats(user?.id, user?.token);
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      const projectsResponse = await projectService.getAllProjects({ limit: 5 });
      if (projectsResponse.success) {
        setProjects(projectsResponse.data.slice(0, 5));
      }

      const notifResponse = await userService.getNotifications(user?.id, user?.token);
      if (notifResponse.success) {
        setNotifications(notifResponse.data);
      }
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHomeData();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour,</Text>
          <Text style={styles.userName}>{user?.name || 'Utilisateur'}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutIcon}>🚪</Text>
        </TouchableOpacity>
      </View>

      {stats && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vos statistiques</Text>
          <View style={styles.statsGrid}>
            <Card variant="elevated" style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalProjects || 0}</Text>
              <Text style={styles.statLabel}>Projets totaux</Text>
            </Card>
            <Card variant="elevated" style={styles.statCard}>
              <Text style={styles.statValue}>{stats.activeProjects || 0}</Text>
              <Text style={styles.statLabel}>En cours</Text>
            </Card>
            <Card variant="elevated" style={styles.statCard}>
              <Text style={[styles.statValue, { color: theme.colors.success.main }]}>
                {stats.averageRating || 0}⭐
              </Text>
              <Text style={styles.statLabel}>Note moyenne</Text>
            </Card>
            <Card variant="elevated" style={styles.statCard}>
              <Text style={[styles.statValue, { color: theme.colors.primary.main }]}>
                {(stats.totalEarnings || 0).toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>Revenus (MAD)</Text>
            </Card>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Projets récents</Text>
          <TouchableOpacity onPress={() => Alert.alert('Navigation', 'Voir tous les projets')}>
            <Text style={styles.seeAll}>Voir tout →</Text>
          </TouchableOpacity>
        </View>
        {projects.map((project) => (
          <TouchableOpacity
            key={project.id}
            activeOpacity={0.7}
            onPress={() => Alert.alert(project.title, project.description)}
          >
            <Card style={styles.projectCard} variant="elevated">
              <View style={styles.projectHeader}>
                <Text style={styles.projectTitle}>{project.title}</Text>
                <View style={[styles.statusBadge, { backgroundColor: theme.colors.success.light }]}>
                  <Text style={styles.statusText}>{project.status}</Text>
                </View>
              </View>
              <Text style={styles.projectDescription} numberOfLines={2}>
                {project.description}
              </Text>
              <View style={styles.projectMeta}>
                <Text style={styles.projectBudget}>💰 {project.budget} MAD</Text>
                <Text style={styles.projectCategory}>📁 {project.category}</Text>
              </View>
              <View style={styles.projectFooter}>
                <Text style={styles.projectDate}>📅 {new Date(project.postedDate).toLocaleDateString('fr-FR')}</Text>
                <Text style={styles.projectProposals}>✉️ {project.proposals} propositions</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      {notifications.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications récentes</Text>
          {notifications.slice(0, 3).map((notif) => (
            <Card key={notif.id} style={styles.notificationCard}>
              <View style={styles.notificationHeader}>
                <Text style={styles.notificationIcon}>
                  {notif.type === 'message' && '💬'}
                  {notif.type === 'project' && '📁'}
                  {notif.type === 'payment' && '💰'}
                  {notif.type === 'review' && '⭐'}
                </Text>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>{notif.title}</Text>
                  <Text style={styles.notificationMessage} numberOfLines={2}>
                    {notif.message}
                  </Text>
                  <Text style={styles.notificationTime}>
                    {new Date(notif.timestamp).toLocaleString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
                {!notif.read && <View style={styles.unreadDot} />}
              </View>
            </Card>
          ))}
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions rapides</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📋</Text>
            <Text style={styles.actionText}>Mes projets</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>💼</Text>
            <Text style={styles.actionText}>Trouver un projet</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionText}>Messages</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>👤</Text>
            <Text style={styles.actionText}>Profil</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.primary.main,
  },
  greeting: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.inverse,
    opacity: 0.9,
  },
  userName: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.inverse,
    marginTop: theme.spacing.xs,
  },
  logoutButton: {
    padding: theme.spacing.sm,
  },
  logoutIcon: {
    fontSize: 24,
  },
  section: {
    padding: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  seeAll: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary.main,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -theme.spacing.xs,
  },
  statCard: {
    width: '48%',
    margin: theme.spacing.xs,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  projectCard: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: 12,
  },
  statusText: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
    color: '#fff',
  },
  projectTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
    flex: 1,
  },
  projectDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
    lineHeight: 20,
  },
  projectMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  projectBudget: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.primary.main,
  },
  projectCategory: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginLeft: theme.spacing.sm,
  },
  projectFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  projectDate: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
  },
  projectProposals: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
  },
  notificationCard: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  notificationMessage: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  notificationTime: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary.main,
    marginLeft: theme.spacing.sm,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -theme.spacing.xs,
  },
  actionButton: {
    width: '48%',
    aspectRatio: 1.5,
    margin: theme.spacing.xs,
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: theme.spacing.sm,
  },
  actionText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  bottomSpacing: {
    height: theme.spacing.xl,
  },
});
