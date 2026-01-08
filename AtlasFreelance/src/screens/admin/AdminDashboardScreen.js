// src/screens/admin/AdminDashboardScreen.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  RefreshControl, 
  TouchableOpacity,
  ActivityIndicator,
  Animated 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import KPICard from '../../components/admin/KPICard';
import { adminAnalyticsService } from '../../services/adminApi';

export default function AdminDashboardScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const [analytics, setAnalytics] = useState({
    kpis: {
      totalUsers: 0,
      activeProjects: 0,
      openDisputes: 0,
      monthlyRevenue: 0,
      newUsers: 0,
      completedProjects: 0,
    },
    charts: {
      userGrowth: [],
      projectsByCategory: [],
    },
    recentActivity: [],
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (!loading) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [loading]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAnalyticsService.getDashboardAnalytics();
      
      if (response && response.success && response.data) {
        setAnalytics({
          kpis: response.data.kpis || {},
          charts: response.data.charts || {},
          recentActivity: response.data.recentActivity || [],
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Chargement du tableau de bord...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorTitle}>Erreur de chargement</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadDashboardData}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { kpis = {}, charts = {}, recentActivity = [] } = analytics || {};

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.title}>Dashboard Admin</Text>
        <Text style={styles.subtitle}>Vue d'ensemble de la plateforme</Text>
      </Animated.View>

      {/* KPI Cards */}
      <Animated.View 
        style={[
          styles.kpiGrid,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.kpiRow}>
          <View style={styles.kpiCol}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('AdminUsers')}>
              <KPICard
                title="Utilisateurs"
                value={kpis.totalUsers || 0}
                change={12}
                color="#3b82f6"
                icon="👥"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.kpiCol}>
            <KPICard
              title="Nouveaux"
              value={kpis.newUsers || 0}
              change={8}
              color="#10b981"
              icon="✨"
            />
          </View>
        </View>

        <View style={styles.kpiRow}>
          <View style={styles.kpiCol}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('AdminProjects')}>
              <KPICard
                title="Projets actifs"
                value={kpis.activeProjects || 0}
                change={5}
                color="#8b5cf6"
                icon="📊"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.kpiCol}>
            <KPICard
              title="Terminés"
              value={kpis.completedProjects || 0}
              change={15}
              color="#06b6d4"
              icon="✅"
            />
          </View>
        </View>

        <View style={styles.kpiRow}>
          <View style={styles.kpiCol}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('AdminDisputes')}>
              <KPICard
                title="Litiges"
                value={kpis.openDisputes || 0}
                change={-2}
                color="#f59e0b"
                icon="⚠️"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.kpiCol}>
            <KPICard
              title="Revenus"
              value={`${(kpis.monthlyRevenue || 0).toLocaleString()} MAD`}
              change={18}
              color="#16a34a"
              icon="💰"
            />
          </View>
        </View>
      </Animated.View>

      {/* Quick Actions */}
      <Animated.View 
        style={[
          styles.section,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Text style={styles.sectionTitle}>Actions rapides</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('AdminUsers')}
          >
            <Text style={styles.actionIcon}>👥</Text>
            <Text style={styles.actionTitle}>Utilisateurs</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('AdminProjects')}
          >
            <Text style={styles.actionIcon}>📁</Text>
            <Text style={styles.actionTitle}>Projets</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('AdminDisputes')}
          >
            <Text style={styles.actionIcon}>⚖️</Text>
            <Text style={styles.actionTitle}>Litiges</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('AdminSettings')}
          >
            <Text style={styles.actionIcon}>⚙️</Text>
            <Text style={styles.actionTitle}>Paramètres</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Recent Activity */}
      <Animated.View 
        style={[
          styles.section,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Text style={styles.sectionTitle}>Activité récente</Text>
        <View style={styles.activityContainer}>
          {recentActivity.slice(0, 5).map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityIconContainer}>
                <Text style={styles.activityIcon}>
                  {activity.type === 'user_joined' && '👤'}
                  {activity.type === 'project_created' && '📄'}
                  {activity.type === 'dispute_opened' && '⚠️'}
                  {activity.type === 'payment_made' && '💳'}
                </Text>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityDescription}>{activity.description}</Text>
                <Text style={styles.activityTime}>
                  {new Date(activity.timestamp).toLocaleString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Animated.View>

      {/* User Growth Chart */}
      {charts.userGrowth && (
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Croissance des utilisateurs (12 mois)</Text>
          <View style={styles.chartContainer}>
            <View style={styles.chartBars}>
              {charts.userGrowth.map((item, index) => (
                <View key={index} style={styles.barColumn}>
                  <View style={styles.barWrapper}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: `${(item.value / Math.max(...charts.userGrowth.map(i => i.value))) * 100}%`,
                          backgroundColor: '#3b82f6',
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.barLabel}>{item.month}</Text>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>
      )}

      {/* Projects by Category */}
      {charts.projectsByCategory && (
        <Animated.View 
          style={[
            styles.section,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Projets par catégorie</Text>
          <View style={styles.categoryContainer}>
            {charts.projectsByCategory.map((item, index) => (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{item.category}</Text>
                  <Text style={styles.categoryCount}>{item.count} projets</Text>
                </View>
                <View style={styles.categoryBarContainer}>
                  <View
                    style={[
                      styles.categoryBar,
                      {
                        width: `${(item.count / Math.max(...charts.projectsByCategory.map(i => i.count))) * 100}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </Animated.View>
      )}

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  kpiGrid: {
    padding: 16,
  },
  kpiRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  kpiCol: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  activityContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
  },
  activityItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityIcon: {
    fontSize: 20,
  },
  activityContent: {
    flex: 1,
  },
  activityDescription: {
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#94a3b8',
  },
  chartContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    height: 200,
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barWrapper: {
    width: '80%',
    height: '85%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  barLabel: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 4,
  },
  categoryContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f8fafc',
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  categoryItem: {
    marginBottom: 16,
  },
  categoryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  categoryCount: {
    fontSize: 14,
    color: '#64748b',
  },
  categoryBarContainer: {
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  categoryBar: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
  bottomPadding: {
    height: 20,
  },
});
