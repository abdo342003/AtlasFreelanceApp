// src/screens/admin/AdminDisputesScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import AdminFilters from '../../components/admin/AdminFilters';
import DisputeResolutionModal from '../../components/admin/DisputeResolutionModal';
import { adminDisputeService } from '../../services/adminApi';

export default function AdminDisputesScreen() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadDisputes();
  }, [page, filters]);

  const loadDisputes = async () => {
    try {
      setLoading(true);
      const response = await adminDisputeService.getDisputes({
        page,
        limit: 20,
        ...filters,
      });

      if (response.success) {
        setDisputes(response.data.disputes);
        setTotal(response.data.total);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('Error loading disputes:', error);
      Alert.alert('Erreur', 'Impossible de charger les litiges');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    await loadDisputes();
    setRefreshing(false);
  }, [filters]);

  const handleResolveDispute = async (resolution) => {
    try {
      const response = await adminDisputeService.resolveDispute(
        resolution.disputeId,
        resolution
      );

      if (response.success) {
        await loadDisputes();
        Alert.alert('Succès', 'Litige résolu avec succès');
      }
    } catch (error) {
      console.error('Error resolving dispute:', error);
      throw error;
    }
  };

  const handleUpdateStatus = async (disputeId, newStatus) => {
    try {
      const response = await adminDisputeService.updateDisputeStatus(
        disputeId,
        newStatus
      );

      if (response.success) {
        await loadDisputes();
        Alert.alert('Succès', 'Statut mis à jour');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de mettre à jour le statut');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Haute':
        return '#ef4444';
      case 'Moyenne':
        return '#f59e0b';
      case 'Basse':
        return '#10b981';
      default:
        return '#64748b';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Ouvert':
        return '#ef4444';
      case 'En cours':
        return '#f59e0b';
      case 'Résolu':
        return '#10b981';
      case 'Fermé':
        return '#64748b';
      default:
        return '#64748b';
    }
  };

  const renderDisputeCard = ({ item }) => {
    return (
      <TouchableOpacity
        style={[
          styles.disputeCard,
          { borderLeftColor: getPriorityColor(item.priority), borderLeftWidth: 4 },
        ]}
        onPress={() => {
          setSelectedDispute(item);
          setShowResolutionModal(true);
        }}
      >
        <View style={styles.disputeHeader}>
          <View style={styles.disputeTitleContainer}>
            <Text style={styles.disputeId}>#{item.id}</Text>
            <Text
              style={[
                styles.priorityBadge,
                { backgroundColor: getPriorityColor(item.priority) + '20' },
              ]}
            >
              <Text style={{ color: getPriorityColor(item.priority) }}>
                {item.priority}
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

        <Text style={styles.projectTitle}>
          📁 {item.projectTitle}
        </Text>

        <Text style={styles.reason}>
          <Text style={styles.reasonLabel}>Raison: </Text>
          {item.reason}
        </Text>

        <View style={styles.partiesContainer}>
          <View style={styles.party}>
            <Text style={styles.partyLabel}>Rapporté par</Text>
            <Text style={styles.partyName}>{item.reportedByName}</Text>
          </View>
          
          <Text style={styles.versus}>VS</Text>
          
          <View style={styles.party}>
            <Text style={styles.partyLabel}>Contre</Text>
            <Text style={styles.partyName}>{item.againstName}</Text>
          </View>
        </View>

        <View style={styles.disputeFooter}>
          <Text style={styles.disputeDate}>
            {new Date(item.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </Text>

          {item.status !== 'Résolu' && item.status !== 'Fermé' && (
            <TouchableOpacity
              style={styles.resolveButton}
              onPress={(e) => {
                e.stopPropagation();
                setSelectedDispute(item);
                setShowResolutionModal(true);
              }}
            >
              <Text style={styles.resolveButtonText}>Résoudre</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderStats = () => {
    const stats = {
      total: disputes.length,
      open: disputes.filter((d) => d.status === 'Ouvert').length,
      inProgress: disputes.filter((d) => d.status === 'En cours').length,
      resolved: disputes.filter((d) => d.status === 'Résolu').length,
    };

    return (
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        
        <View style={[styles.statCard, { borderLeftColor: '#ef4444' }]}>
          <Text style={[styles.statValue, { color: '#ef4444' }]}>
            {stats.open}
          </Text>
          <Text style={styles.statLabel}>Ouverts</Text>
        </View>
        
        <View style={[styles.statCard, { borderLeftColor: '#f59e0b' }]}>
          <Text style={[styles.statValue, { color: '#f59e0b' }]}>
            {stats.inProgress}
          </Text>
          <Text style={styles.statLabel}>En cours</Text>
        </View>
        
        <View style={[styles.statCard, { borderLeftColor: '#10b981' }]}>
          <Text style={[styles.statValue, { color: '#10b981' }]}>
            {stats.resolved}
          </Text>
          <Text style={styles.statLabel}>Résolus</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Litiges {total > 0 && `(${total})`}
        </Text>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(true)}
        >
          <Text style={styles.filterButtonText}>🔍 Filtres</Text>
        </TouchableOpacity>
      </View>

      {!loading && renderStats()}

      {loading && page === 1 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : (
        <FlatList
          data={disputes}
          keyExtractor={(item) => item.id}
          renderItem={renderDisputeCard}
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
          status: ['Ouvert', 'En cours', 'Résolu', 'Fermé'],
          priority: ['Haute', 'Moyenne', 'Basse'],
        }}
      />

      <DisputeResolutionModal
        visible={showResolutionModal}
        dispute={selectedDispute}
        onClose={() => {
          setShowResolutionModal(false);
          setSelectedDispute(null);
        }}
        onResolve={handleResolveDispute}
      />
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
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disputeCard: {
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
  disputeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  disputeTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  disputeId: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748b',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 11,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  reason: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  reasonLabel: {
    fontWeight: '600',
    color: '#475569',
  },
  partiesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  party: {
    flex: 1,
  },
  partyLabel: {
    fontSize: 11,
    color: '#94a3b8',
    marginBottom: 2,
  },
  partyName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  versus: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ef4444',
    marginHorizontal: 8,
  },
  disputeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  disputeDate: {
    fontSize: 12,
    color: '#94a3b8',
  },
  resolveButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#10b981',
    borderRadius: 6,
  },
  resolveButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
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
});