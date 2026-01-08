import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import applicationService from '../../services/applicationService';
import { theme } from '../../theme';
import { formatDate } from '../../utils/formatters';
import ApplicationCard from '../../components/client/ApplicationCard';

export const ApplicationsScreen = ({ navigation }) => {
  const { user } = useAuth();
  
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const loadApplications = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await applicationService.getClientApplications(user?.id);
      if (response.success) {
        setApplications(response.data);
      } else {
        Alert.alert('Erreur', response.error || 'Impossible de charger les candidatures');
      }
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadApplications();
    }, [loadApplications])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadApplications();
    setRefreshing(false);
  };

  const filteredApplications =
    filterStatus === 'all'
      ? applications
      : applications.filter((app) => app.status === filterStatus);

  const filterOptions = [
    { id: 'all', label: 'Toutes' },
    { id: 'pending', label: 'En attente' },
    { id: 'accepted', label: 'Acceptées' },
    { id: 'rejected', label: 'Refusées' },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.secondary }}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingTop: theme.spacing.lg, paddingBottom: theme.spacing.xl }}
      >
        {/* Header */}
        <View style={{ backgroundColor: '#fff', paddingVertical: theme.spacing.lg, paddingHorizontal: theme.spacing.lg, ...theme.shadows.sm, marginHorizontal: theme.spacing.md, borderRadius: theme.borderRadius.lg }}>
          <Text style={{ fontSize: 20, fontWeight: '700', color: theme.colors.text.primary }}>
            Mes candidatures
          </Text>
          <Text style={{ fontSize: 13, color: theme.colors.text.secondary, marginTop: 4 }}>
            Total: {applications.length} candidature{applications.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.md }}
          contentContainerStyle={{ gap: theme.spacing.sm }}
        >
          {filterOptions.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              onPress={() => setFilterStatus(filter.id)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: theme.borderRadius.full,
                backgroundColor: filterStatus === filter.id ? theme.colors.primary : '#fff',
                borderWidth: 1,
                borderColor: filterStatus === filter.id ? theme.colors.primary : theme.colors.border,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: filterStatus === filter.id ? '#fff' : theme.colors.text.secondary,
                }}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Applications List */}
        {isLoading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: theme.spacing.xl }} />
        ) : filteredApplications.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: theme.spacing.xl }}>
            <Text style={{ fontSize: 32, marginBottom: theme.spacing.md }}>📭</Text>
            <Text style={{ fontSize: 14, color: theme.colors.text.secondary }}>
              Aucune candidature avec ce filtre
            </Text>
          </View>
        ) : (
          <View style={{ paddingHorizontal: theme.spacing.md }}>
            {filteredApplications.map((app) => (
              <TouchableOpacity
                key={app.id}
                onPress={() => navigation.getParent()?.navigate('ProjectDetail', { project: { id: app.projectId, title: app.projectTitle } })}
              >
                <View style={{
                  backgroundColor: '#fff',
                  marginBottom: theme.spacing.md,
                  borderRadius: theme.borderRadius.lg,
                  padding: theme.spacing.lg,
                  ...theme.shadows.md,
                }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.text.primary }}>
                        {app.projectTitle}
                      </Text>
                      <Text style={{ fontSize: 14, color: theme.colors.text.secondary, marginTop: 4 }}>
                        {app.freelancerName}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                        <Text style={{ fontSize: 12, color: theme.colors.primary }}>⭐ {app.freelancerRating}</Text>
                        <Text style={{ fontSize: 12, color: theme.colors.text.secondary, marginLeft: 8 }}>
                          {formatDate(app.submittedDate)}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        backgroundColor:
                          app.status === 'pending'
                            ? theme.colors.warning + '20'
                            : app.status === 'accepted'
                            ? theme.colors.status.success + '20'
                            : theme.colors.status.error + '20',
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: theme.borderRadius.md,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: '600',
                          color:
                            app.status === 'pending'
                              ? theme.colors.warning
                              : app.status === 'accepted'
                              ? theme.colors.status.success
                              : theme.colors.status.error,
                        }}
                      >
                        {app.status === 'pending' ? 'En attente' : app.status === 'accepted' ? 'Acceptée' : 'Refusée'}
                      </Text>
                    </View>
                  </View>
                  <View style={{ marginTop: theme.spacing.md, paddingTop: theme.spacing.md, borderTopWidth: 1, borderTopColor: theme.colors.border }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.primary }}>
                      {app.proposedBudget?.toLocaleString()} MAD
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ApplicationsScreen;
