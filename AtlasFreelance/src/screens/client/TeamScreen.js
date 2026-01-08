import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import teamService from '../../services/teamService';
import { theme } from '../../theme';
import { validateEmail } from '../../utils/validation';

const TeamMemberCard = ({ member, onRemove }) => (
  <View
    style={{
      backgroundColor: '#fff',
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      ...theme.shadows.sm,
    }}
  >
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: theme.colors.primary + '20',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ fontSize: 28 }}>{member.avatar}</Text>
        </View>
        <View style={{ marginLeft: theme.spacing.md, flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text.primary }}>
            {member.name}
          </Text>
          <Text style={{ fontSize: 12, color: theme.colors.text.secondary }}>
            {member.email}
          </Text>
          <View style={{ marginTop: 4 }}>
            <Text style={{ fontSize: 11, color: theme.colors.primary, fontWeight: '500' }}>
              {member.role === 'project_manager'
                ? 'Chef de projet'
                : member.role === 'assistant'
                ? 'Assistant'
                : 'Comptable'}
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity onPress={() => onRemove(member.id)}>
        <Text style={{ fontSize: 20, color: theme.colors.status.error }}>✕</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export const TeamScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('project_manager');
  const [isInviting, setIsInviting] = useState(false);

  const loadTeamMembers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await teamService.getTeamMembers(user?.id);
      if (response.success) {
        setMembers(response.data);
      } else {
        Alert.alert('Erreur', response.error || 'Impossible de charger l\'équipe');
      }
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadTeamMembers();
    }, [loadTeamMembers])
  );

  const handleInviteMember = async () => {
    if (!inviteEmail) {
      Alert.alert('Erreur', 'Veuillez entrer une adresse email');
      return;
    }

    if (!validateEmail(inviteEmail)) {
      Alert.alert('Erreur', 'Email invalide');
      return;
    }

    try {
      setIsInviting(true);
      const response = await teamService.inviteTeamMember(inviteEmail, selectedRole);
      if (response.success) {
        Alert.alert('Succès', response.message);
        setInviteEmail('');
        setSelectedRole('project_manager');
        setShowInviteModal(false);
        loadTeamMembers();
      } else {
        Alert.alert('Erreur', response.error);
      }
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveMember = (memberId) => {
    Alert.alert(
      'Supprimer le membre',
      'Êtes-vous sûr de vouloir supprimer ce membre ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await teamService.removeTeamMember(memberId);
              if (response.success) {
                Alert.alert('Succès', response.message);
                loadTeamMembers();
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

  const availableRoles = teamService.getAvailableRoles();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Header */}
      <View style={{ backgroundColor: '#fff', padding: theme.spacing.lg, ...theme.shadows.sm }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 20, fontWeight: '700', color: theme.colors.text.primary }}>
              Mon équipe
            </Text>
            <Text style={{ fontSize: 13, color: theme.colors.text.secondary, marginTop: 4 }}>
              {members.length} membre{members.length !== 1 ? 's' : ''}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowInviteModal(true)}
            style={{
              backgroundColor: theme.colors.primary,
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.sm,
              borderRadius: theme.borderRadius.md,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '600', fontSize: 12 }}>+ Inviter</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Members List */}
      <ScrollView style={{ flex: 1, padding: theme.spacing.lg }}>
        {isLoading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: theme.spacing.xl }} />
        ) : members.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: theme.spacing.xl }}>
            <Text style={{ fontSize: 32, marginBottom: theme.spacing.md }}>👥</Text>
            <Text style={{ fontSize: 14, color: theme.colors.text.secondary }}>
              Aucun membre dans votre équipe
            </Text>
            <Text style={{ fontSize: 12, color: theme.colors.text.secondary, marginTop: 8 }}>
              Invitez votre première collaboratrice
            </Text>
          </View>
        ) : (
          members.map((member) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              onRemove={handleRemoveMember}
            />
          ))
        )}
      </ScrollView>

      {/* Invite Modal */}
      <Modal
        visible={showInviteModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowInviteModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderTopLeftRadius: theme.borderRadius.lg,
              borderTopRightRadius: theme.borderRadius.lg,
              padding: theme.spacing.lg,
              paddingBottom: theme.spacing.xl,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: theme.spacing.lg }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.text.primary }}>
                Inviter un membre
              </Text>
              <TouchableOpacity onPress={() => setShowInviteModal(false)}>
                <Text style={{ fontSize: 24, color: theme.colors.text.secondary }}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={{ fontSize: 13, fontWeight: '600', color: theme.colors.text.primary, marginBottom: theme.spacing.sm }}>
              Email
            </Text>
            <TextInput
              placeholder="nom@example.com"
              value={inviteEmail}
              onChangeText={setInviteEmail}
              keyboardType="email-address"
              style={{
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderRadius: theme.borderRadius.md,
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.md,
                marginBottom: theme.spacing.lg,
              }}
            />

            <Text style={{ fontSize: 13, fontWeight: '600', color: theme.colors.text.primary, marginBottom: theme.spacing.sm }}>
              Rôle
            </Text>
            <View style={{ gap: theme.spacing.sm, marginBottom: theme.spacing.lg }}>
              {availableRoles.map((role) => (
                <TouchableOpacity
                  key={role.id}
                  onPress={() => setSelectedRole(role.id)}
                  style={{
                    paddingVertical: theme.spacing.md,
                    paddingHorizontal: theme.spacing.md,
                    borderWidth: 1,
                    borderColor: selectedRole === role.id ? theme.colors.primary : theme.colors.border,
                    borderRadius: theme.borderRadius.md,
                    backgroundColor: selectedRole === role.id ? theme.colors.primary + '10' : '#fff',
                  }}
                >
                  <Text
                    style={{
                      color: selectedRole === role.id ? theme.colors.primary : theme.colors.text.primary,
                      fontWeight: '600',
                    }}
                  >
                    {role.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={handleInviteMember}
              disabled={isInviting}
              style={{
                backgroundColor: theme.colors.primary,
                paddingVertical: theme.spacing.md,
                borderRadius: theme.borderRadius.md,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: isInviting ? 0.6 : 1,
              }}
            >
              {isInviting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>
                  Envoyer l'invitation
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TeamScreen;
