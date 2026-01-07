// src/screens/admin/AdminProjectsScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Modal,
  ScrollView,
} from 'react-native';
import AdminFilters from '../../components/admin/AdminFilters';
import { adminProjectService } from '../../services/adminApi';

export default function AdminProjectsScreen() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadProjects();
  }, [page, filters, search]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const response = await adminProjectService.getProjects({
        page,
        limit: 20,
        search,
        ...filters,
      });

      if (response.success) {
        setProjects(response.data.projects);
        setTotal(response.data.total);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      Alert.alert('Erreur', 'Impossible de charger les projets');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    await loadProjects();
    setRefreshing(false);
  }, [filters, search]);

  const handleUpdateStatus = async (projectId, newStatus) => {
    try {
      const response = await adminProjectService.updateProjectStatus(
        projectId,
        newStatus
      );

      if (response.success) {
        await loadProjects();
        Alert.alert('Succès', 'Statut du projet mis à jour');
        setShowProjectDetails(false);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de mettre à jour le statut');
    }
  };

  const handleCancelProject = (project) => {
    Alert.alert(
      'Annuler le projet ?',
      `Êtes-vous sûr de vouloir annuler "${project.title}" ?`,
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui, annuler',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await adminProjectService.cancelProject(
                project.id,
                'Annulé par l\'administrateur'
              );
              
              if (response.success) {
                await loadProjects();
                Alert.alert('Succès', 'Projet annulé');
                setShowProjectDetails(false);
              }
            } catch (error) {
              Alert.alert('Erreur', 'Impossible d\'annuler le projet');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'En cours':
        return '#3b82f6';
      case 'Terminé':
        return '#10b981';
      case 'Annulé':
        return '#ef4444';
      case 'En attente':
        return '#f59e0b';
      default:
        return '#64748b';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Développement':
        return '#3b82f6';
      case 'Design':
        return '#8b5cf6';
      case 'Marketing':
        return '#f59e0b';
      case 'Rédaction':
        return '#10b981';
      default:
        return '#64748b';
    }
  };

  const renderProjectCard = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.projectCard}
        onPress={() => {
          setSelectedProject(item);
          setShowProjectDetails(true);
        }}
      >
        <View style={styles.projectHeader}>
          <View style={styles.projectTitleContainer}>
            <Text style={styles.projectTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text
              style={[
                styles.categoryBadge,
                { backgroundColor: getCategoryColor(item.category) + '20' },
              ]}
            >
              <Text style={{ color: getCategoryColor(item.category) }}>
                {item.category}
              </Text>
            </Text>
          </View>
          
          <Text
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) + '20' },
            ]}
          >
            <Text style={{ color: getStatusColor(item.status) }}>
              {item.status}
            </Text>
          </Text>
        </View>

        <Text style={styles.projectDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.projectMeta}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Client</Text>
            <Text style={styles.metaValue}>{item.clientName}</Text>
          </View>
          
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Freelancer</Text>
            <Text style={styles.metaValue}>{item.freelancerName}</Text>
          </View>
        </View>

        <View style={styles.projectFooter}>
          <Text style={styles.budget}>{item.budget}</Text>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>{item.progress}%</Text>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${item.progress}%` }]}
              />
            </View>
          </View>
        </View>

        <Text style={styles.projectDate}>
          Créé le {new Date(item.createdAt).toLocaleDateString('fr-FR')}
        </Text>
      </TouchableOpacity>
    );
  };

  const ProjectDetailsModal = () => {
    if (!selectedProject) return null;

    return (
      <Modal
        visible={showProjectDetails}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowProjectDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Détails du projet</Text>
              <TouchableOpacity onPress={() => setShowProjectDetails(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Titre</Text>
                <Text style={styles.detailValue}>{selectedProject.title}</Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Description</Text>
                <Text style={styles.detailValue}>
                  {selectedProject.description}
                </Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Statut</Text>
                <Text
                  style={[
                    styles.detailValue,
                    { color: getStatusColor(selectedProject.status) },
                  ]}
                >
                  {selectedProject.status}
                </Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Catégorie</Text>
                <Text
                  style={[
                    styles.detailValue,
                    { color: getCategoryColor(selectedProject.category) },
                  ]}
                >
                  {selectedProject.category}
                </Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Budget</Text>
                <Text style={styles.detailValue}>{selectedProject.budget}</Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Client</Text>
                <Text style={styles.detailValue}>
                  {selectedProject.clientName}
                </Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Freelancer</Text>
                <Text style={styles.detailValue}>
                  {selectedProject.freelancerName}
                </Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Progression</Text>
                <View style={styles.progressContainer}>
                  <Text style={styles.progressText}>
                    {selectedProject.progress}%
                  </Text>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${selectedProject.progress}%` },
                      ]}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Date de création</Text>
                <Text style={styles.detailValue}>
                  {new Date(selectedProject.createdAt).toLocaleDateString(
                    'fr-FR'
                  )}
                </Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Date limite</Text>
                <Text style={styles.detailValue}>
                  {new Date(selectedProject.deadline).toLocaleDateString(
                    'fr-FR'
                  )}
                </Text>
              </View>

              {/* Status Update Section */}
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Changer le statut</Text>
                <View style={styles.statusButtons}>
                  {['En cours', 'Terminé', 'En attente'].map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.statusButton,
                        selectedProject.status === status &&
                          styles.statusButtonActive,
                        {
                          borderColor: getStatusColor(status),
                        },
                      ]}
                      onPress={() =>
                        handleUpdateStatus(selectedProject.id, status)
                      }
                    >
                      <Text
                        style={[
                          styles.statusButtonText,
                          { color: getStatusColor(status) },
                        ]}
                      >
                        {status}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancelProject(selectedProject)}
              >
                <Text style={styles.cancelButtonText}>🗑️ Annuler le projet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Projets {total > 0 && `(${total})`}
        </Text>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Text style={styles.filterButtonText}>🔍 Filtres</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher un projet..."
        value={search}
        onChangeText={setSearch}
      />

      {loading && page === 1 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(item) => item.id}
          renderItem={renderProjectCard}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListFooterComponent={() => (
            <View style={styles.pagination}>
              <TouchableOpacity
                style={[
                  styles.pageButton,
                  page === 1 && styles.pageButtonDisabled,
                ]}
                onPress={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <Text style={styles.pageButtonText}>← Précédent</Text>
              </TouchableOpacity>

              <Text style={styles.pageInfo}>
                Page {page} / {totalPages}
              </Text>

              <TouchableOpacity
                style={[
                  styles.pageButton,
                  page === totalPages && styles.pageButtonDisabled,
                ]}
                onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <Text style={styles.pageButtonText}>Suivant →</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <AdminFilters
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onApply={setFilters}
        options={{
          status: ['En cours', 'Terminé', 'Annulé', 'En attente'],
          category: ['Développement', 'Design', 'Marketing', 'Rédaction'],
        }}
      />

      <ProjectDetailsModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  header: {
    padding: 16,
    paddingTop: 40,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  searchInput: {
    backgroundColor: 'white',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  projectCard: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  projectTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
  },
  projectDescription: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  projectMeta: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 16,
  },
  metaItem: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
  },
  projectFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  budget: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
  },
  progressContainer: {
    flex: 1,
    marginLeft: 16,
  },
  progressText: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
    textAlign: 'right',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 3,
  },
  projectDate: {
    fontSize: 12,
    color: '#94a3b8',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  pageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
  },
  pageButtonDisabled: {
    backgroundColor: '#cbd5e1',
  },
  pageButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  pageInfo: {
    fontSize: 14,
    color: '#64748b',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  modalClose: {
    fontSize: 24,
    color: '#64748b',
  },
  modalContent: {
    padding: 20,
  },
  detailSection: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
  },
  statusButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  statusButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
  },
  statusButtonActive: {
    backgroundColor: '#f8fafc',
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalActions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  cancelButton: {
    padding: 14,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});