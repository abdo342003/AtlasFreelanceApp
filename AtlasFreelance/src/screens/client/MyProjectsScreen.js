import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, TouchableOpacity, ActivityIndicator } from 'react-native';
import ProjectCard from '../../components/client/ProjectCard';
import { projectService } from '../../services/projectService';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../theme';

export default function MyProjectsScreen({ navigation }) {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    if (!refreshing) setIsLoading(true);
    
    try {
      const response = await projectService.getClientProjects(user?.id);
      
      if (response.success) {
        setProjects(response.data);
      } else {
        console.error('Failed to load projects:', response.error);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadProjects();
  };

  const filteredProjects = projects.filter(project => {
    if (filter === 'all') return true;
    return project.status === filter;
  });

  const getFilterLabel = (status) => {
    switch(status) {
      case 'all': return 'Tous';
      case 'open': return 'Ouverts';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminés';
      default: return status;
    }
  };

  return (
    <View style={styles.container}>
      {/* Filter tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['all', 'open', 'in_progress', 'completed'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterButton,
                filter === status && styles.filterButtonActive
              ]}
              onPress={() => setFilter(status)}
            >
              <Text style={[
                styles.filterText,
                filter === status && styles.filterTextActive
              ]}>
                {getFilterLabel(status)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Loading indicator */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
          <Text style={styles.loadingText}>Chargement des projets...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ paddingTop: theme.spacing.sm, paddingBottom: theme.spacing.xl }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {filteredProjects.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>📂</Text>
              <Text style={styles.emptyTitle}>Aucun projet</Text>
              <Text style={styles.emptyDescription}>
                {filter === 'all' 
                  ? "Vous n'avez pas encore créé de projet.\nCréez votre premier projet !"
                  : `Aucun projet ${getFilterLabel(filter).toLowerCase()}`
                }
              </Text>
            </View>
          ) : (
            filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onPress={() => {
                  navigation.getParent()?.navigate('ProjectDetail', { project });
                }}
              />
            ))
          )}
        </ScrollView>
      )}

      {/* Floating action button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('CreateProject')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
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
    paddingVertical: theme.spacing['3xl'],
  },
  loadingText: {
    marginTop: theme.spacing.base,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  filterContainer: {
    backgroundColor: theme.colors.background.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.main,
  },
  filterButton: {
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.border.main,
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  filterText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
  filterTextActive: {
    color: theme.colors.primary.contrast,
  },
  scrollView: {
    flex: 1,
    padding: theme.spacing.base,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing['3xl'] * 2,
  },
  emptyText: {
    fontSize: 64,
    marginBottom: theme.spacing.base,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  emptyDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    right: theme.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadows.lg,
  },
  fabIcon: {
    fontSize: 32,
    color: theme.colors.primary.contrast,
    fontWeight: '300',
  },
});
