// src/screens/admin/AdminUsersScreen.js
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
import { adminUserService } from '../../services/adminApi';

export default function AdminUsersScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [bulkMode, setBulkMode] = useState(false);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadUsers();
  }, [page, filters, search]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminUserService.getUsers({
        page,
        limit: 20,
        search,
        ...filters,
      });

      if (response.success) {
        setUsers(response.data.users);
        setTotal(response.data.total);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      Alert.alert('Erreur', 'Impossible de charger les utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    await loadUsers();
    setRefreshing(false);
  }, [filters, search]);

  const toggleBlockUser = async (userId) => {
    try {
      const response = await adminUserService.toggleUserBlock(userId);
      
      if (response.success) {
        await loadUsers();
        Alert.alert('Succès', 'Statut de l\'utilisateur mis à jour');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de modifier le statut');
    }
  };

  const confirmBlock = (user) => {
    const isBlocked = user.status === 'Bloqué';
    Alert.alert(
      isBlocked ? 'Débloquer le compte ?' : 'Bloquer le compte ?',
      `${user.name} (${user.email})`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: isBlocked ? 'Débloquer' : 'Bloquer',
          style: isBlocked ? 'default' : 'destructive',
          onPress: () => toggleBlockUser(user.id),
        },
      ]
    );
  };

  const handleVerifyUser = async (userId) => {
    try {
      const response = await adminUserService.verifyUser(userId);
      
      if (response.success) {
        await loadUsers();
        Alert.alert('Succès', 'Utilisateur vérifié');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de vérifier l\'utilisateur');
    }
  };

  const handleDeleteUser = (user) => {
    Alert.alert(
      'Supprimer le compte ?',
      `Êtes-vous sûr de vouloir supprimer ${user.name} ? Cette action est irréversible.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await adminUserService.deleteUser(user.id);
              if (response.success) {
                await loadUsers();
                Alert.alert('Succès', 'Utilisateur supprimé');
              }
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer l\'utilisateur');
            }
          },
        },
      ]
    );
  };

  const handleBulkAction = (action) => {
    if (selectedUsers.length === 0) {
      Alert.alert('Erreur', 'Veuillez sélectionner au moins un utilisateur');
      return;
    }

    Alert.alert(
      'Confirmer l\'action',
      `Appliquer "${action}" à ${selectedUsers.length} utilisateur(s) ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: async () => {
            try {
              const response = await adminUserService.bulkAction(selectedUsers, action);
              if (response.success) {
                setSelectedUsers([]);
                setBulkMode(false);
                await loadUsers();
                Alert.alert('Succès', 'Action appliquée avec succès');
              }
            } catch (error) {
              Alert.alert('Erreur', 'Impossible d\'appliquer l\'action');
            }
          },
        },
      ]
    );
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleExport = async () => {
    try {
      Alert.alert('Export', 'Fonctionnalité d\'export en cours de développement');
      // const response = await adminUserService.exportUsers('csv', filters);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'exporter les données');
    }
  };

  const renderUserCard = ({ item }) => {
    const isBlocked = item.status === 'Bloqué';
    const isSelected = selectedUsers.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.userCard, isSelected && styles.userCardSelected]}
        onPress={() => {
          if (bulkMode) {
            toggleUserSelection(item.id);
          } else {
            setSelectedUser(item);
            setShowUserDetails(true);
          }
        }}
        onLongPress={() => {
          setBulkMode(true);
          toggleUserSelection(item.id);
        }}
      >
        {bulkMode && (
          <View style={styles.checkbox}>
            <View style={[styles.checkboxInner, isSelected && styles.checkboxSelected]}>
              {isSelected && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </View>
        )}

        <View style={styles.userInfo}>
          <View style={styles.userHeader}>
            <Text style={styles.userName}>{item.name}</Text>
            {item.verified && <Text style={styles.verifiedBadge}>✓</Text>}
          </View>
          
          <Text style={styles.userEmail}>{item.email}</Text>
          <Text style={styles.userCity}>📍 {item.city}</Text>
          
          <View style={styles.userMeta}>
            <Text style={styles.userRole}>{item.role}</Text>
            <Text style={styles.userProjects}>
              {item.totalProjects} projets
            </Text>
            {item.rating && (
              <Text style={styles.userRating}>⭐ {item.rating}</Text>
            )}
          </View>
        </View>

        <View style={styles.rightColumn}>
          <Text
            style={[
              styles.statusText,
              isBlocked ? styles.statusBlocked : styles.statusActive,
            ]}
          >
            {item.status}
          </Text>

          {!bulkMode && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                isBlocked ? styles.unblockButton : styles.blockButton,
              ]}
              onPress={(e) => {
                e.stopPropagation();
                confirmBlock(item);
              }}
            >
              <Text style={styles.actionButtonText}>
                {isBlocked ? 'Débloquer' : 'Bloquer'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const UserDetailsModal = () => {
    if (!selectedUser) return null;

    return (
      <Modal
        visible={showUserDetails}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowUserDetails(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Détails de l'utilisateur</Text>
              <TouchableOpacity onPress={() => setShowUserDetails(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Nom</Text>
                <Text style={styles.detailValue}>{selectedUser.name}</Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Email</Text>
                <Text style={styles.detailValue}>{selectedUser.email}</Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Téléphone</Text>
                <Text style={styles.detailValue}>{selectedUser.phone}</Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Ville</Text>
                <Text style={styles.detailValue}>{selectedUser.city}</Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Rôle</Text>
                <Text style={styles.detailValue}>{selectedUser.role}</Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Statut</Text>
                <Text style={styles.detailValue}>{selectedUser.status}</Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Membre depuis</Text>
                <Text style={styles.detailValue}>
                  {new Date(selectedUser.joinedDate).toLocaleDateString('fr-FR')}
                </Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Dernière activité</Text>
                <Text style={styles.detailValue}>
                  {new Date(selectedUser.lastActive).toLocaleDateString('fr-FR')}
                </Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Projets</Text>
                <Text style={styles.detailValue}>{selectedUser.totalProjects}</Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Évaluation</Text>
                <Text style={styles.detailValue}>⭐ {selectedUser.rating}</Text>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              {!selectedUser.verified && (
                <TouchableOpacity
                  style={styles.verifyButton}
                  onPress={() => {
                    handleVerifyUser(selectedUser.id);
                    setShowUserDetails(false);
                  }}
                >
                  <Text style={styles.verifyButtonText}>✓ Vérifier</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  setShowUserDetails(false);
                  handleDeleteUser(selectedUser);
                }}
              >
                <Text style={styles.deleteButtonText}>🗑️ Supprimer</Text>
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
          Utilisateurs {total > 0 && `(${total})`}
        </Text>

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => setShowFilters(true)}
          >
            <Text style={styles.headerButtonText}>🔍 Filtres</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerButton} onPress={handleExport}>
            <Text style={styles.headerButtonText}>📥 Export</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher par nom, email ou ville..."
        value={search}
        onChangeText={setSearch}
      />

      {bulkMode && (
        <View style={styles.bulkActions}>
          <Text style={styles.bulkText}>
            {selectedUsers.length} sélectionné(s)
          </Text>
          <View style={styles.bulkButtons}>
            <TouchableOpacity
              style={styles.bulkButton}
              onPress={() => handleBulkAction('verify')}
            >
              <Text style={styles.bulkButtonText}>Vérifier</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bulkButton}
              onPress={() => handleBulkAction('block')}
            >
              <Text style={styles.bulkButtonText}>Bloquer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setBulkMode(false);
                setSelectedUsers([]);
              }}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {loading && page === 1 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderUserCard}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListFooterComponent={() => (
            <View style={styles.pagination}>
              <TouchableOpacity
                style={[styles.pageButton, page === 1 && styles.pageButtonDisabled]}
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
          role: ['Admin', 'Freelancer', 'Client'],
          status: ['Actif', 'Bloqué', 'Nouveau', 'Vérifié'],
        }}
      />

      <UserDetailsModal />
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  headerButtonText: {
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
  bulkActions: {
    backgroundColor: '#3b82f6',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  bulkText: {
    color: 'white',
    fontWeight: '600',
    marginBottom: 8,
  },
  bulkButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  bulkButton: {
    flex: 1,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 6,
    alignItems: 'center',
  },
  bulkButtonText: {
    color: '#3b82f6',
    fontWeight: '600',
    fontSize: 12,
  },
  cancelButton: {
    padding: 8,
    backgroundColor: '#ef4444',
    borderRadius: 6,
    paddingHorizontal: 16,
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userCard: {
    backgroundColor: 'white',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  userCardSelected: {
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  checkbox: {
    marginRight: 12,
    justifyContent: 'center',
  },
  checkboxInner: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  checkmark: {
    color: 'white',
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
    paddingRight: 8,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  verifiedBadge: {
    marginLeft: 6,
    fontSize: 14,
    color: '#10b981',
  },
  userEmail: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 2,
  },
  userCity: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 8,
  },
  userMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  userRole: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '600',
  },
  userProjects: {
    fontSize: 12,
    color: '#64748b',
  },
  userRating: {
    fontSize: 12,
    color: '#f59e0b',
  },
  rightColumn: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusActive: {
    color: '#16a34a',
    backgroundColor: '#dcfce7',
  },
  statusBlocked: {
    color: '#dc2626',
    backgroundColor: '#fee2e2',
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  blockButton: {
    backgroundColor: '#fef3c7',
  },
  unblockButton: {
    backgroundColor: '#dbeafe',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
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
    maxHeight: '80%',
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
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    gap: 12,
  },
  verifyButton: {
    flex: 1,
    padding: 14,
    backgroundColor: '#10b981',
    borderRadius: 8,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  deleteButton: {
    flex: 1,
    padding: 14,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
