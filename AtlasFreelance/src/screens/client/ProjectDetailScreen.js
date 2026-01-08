import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import applicationService from '../../services/applicationService';
import { theme } from '../../theme';
import { formatDate, formatProposalCount } from '../../utils/formatters';
import ApplicationCard from '../../components/client/ApplicationCard';

export const ProjectDetailScreen = ({ route, navigation }) => {
  const { project } = route.params;
  const { user } = useAuth();
  
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showAwardModal, setShowAwardModal] = useState(false);

  const loadApplications = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await applicationService.getProjectApplications(project.id);
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
  }, [project.id]);

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

  const handleAcceptApplication = async (app) => {
    Alert.alert(
      'Accepter la candidature',
      `Accepter la proposition de ${app.freelancerName} ?`,
      [
        { text: 'Annuler', onPress: () => {}, style: 'cancel' },
        {
          text: 'Accepter',
          onPress: async () => {
            try {
              const response = await applicationService.acceptApplication(app.id, app.freelancerId);
              if (response.success) {
                Alert.alert('Succès', response.message);
                loadApplications();
              } else {
                Alert.alert('Erreur', response.error);
              }
            } catch (error) {
              Alert.alert('Erreur', error.message);
            }
          },
        },
      ]
    );
  };

  const handleRejectApplication = async (app) => {
    Alert.alert(
      'Refuser la candidature',
      `Refuser la proposition de ${app.freelancerName} ?`,
      [
        { text: 'Annuler', onPress: () => {}, style: 'cancel' },
        {
          text: 'Refuser',
          onPress: async () => {
            try {
              const response = await applicationService.rejectApplication(app.id);
              if (response.success) {
                Alert.alert('Succès', response.message);
                loadApplications();
              } else {
                Alert.alert('Erreur', response.error);
              }
            } catch (error) {
              Alert.alert('Erreur', error.message);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleSelectForAward = (app) => {
    setSelectedApp(app);
    setShowAwardModal(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Project Header */}
        <View style={{ backgroundColor: '#fff', padding: theme.spacing.lg, paddingBottom: theme.spacing.xl }}>
          <Text style={{ fontSize: 22, fontWeight: '700', color: theme.colors.text.primary }}>
            {project.title}
          </Text>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: theme.spacing.md }}>
            <View
              style={{
                backgroundColor: project.status === 'open' ? theme.colors.status.success + '20' : theme.colors.warning + '20',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: theme.borderRadius.full,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: project.status === 'open' ? theme.colors.status.success : theme.colors.warning,
                }}
              >
                {project.status === 'open' ? 'Ouvert' : 'Fermé'}
              </Text>
            </View>
            <Text style={{ marginLeft: theme.spacing.md, fontSize: 13, color: theme.colors.text.secondary }}>
              Créé le {formatDate(project.createdAt)}
            </Text>
          </View>

          <Text style={{ marginTop: theme.spacing.md, fontSize: 14, color: theme.colors.text.secondary, lineHeight: 20 }}>
            {project.description}
          </Text>

          {/* Budget Section */}
          <View style={{ marginTop: theme.spacing.lg, borderTopWidth: 1, borderTopColor: theme.colors.border, paddingTop: theme.spacing.lg }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ fontSize: 13, color: theme.colors.text.secondary }}>Budget</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.primary }}>
                {project.budgetMin?.toLocaleString()} - {project.budgetMax?.toLocaleString()} MAD
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 13, color: theme.colors.text.secondary }}>Deadline</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text.primary }}>
                {formatDate(project.deadline)}
              </Text>
            </View>
          </View>
        </View>

        {/* Applications Section */}
        <View style={{ marginTop: theme.spacing.lg, paddingHorizontal: theme.spacing.md }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.md }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.text.primary }}>
              Candidatures
            </Text>
            <View
              style={{
                backgroundColor: theme.colors.primary + '20',
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: theme.borderRadius.md,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: theme.colors.primary }}>
                {applications.length}
              </Text>
            </View>
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: theme.spacing.xl }} />
          ) : applications.length === 0 ? (
            <View style={{ alignItems: 'center', paddingVertical: theme.spacing.xl }}>
              <Text style={{ fontSize: 32, marginBottom: theme.spacing.md }}>📭</Text>
              <Text style={{ fontSize: 14, color: theme.colors.text.secondary }}>
                Aucune candidature pour le moment
              </Text>
            </View>
          ) : (
            <View style={{ marginBottom: theme.spacing.xl }}>
              {applications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  onPress={() => handleSelectForAward(app)}
                  onAccept={() => handleAcceptApplication(app)}
                  onReject={() => handleRejectApplication(app)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ProjectDetailScreen;
