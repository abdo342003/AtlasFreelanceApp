import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { theme } from '../../theme';

export const ApplicationCard = ({ application, onPress, onAccept, onReject }) => {
  const {
    freelancerName,
    freelancerAvatar,
    freelancerRating,
    freelancerReviews,
    proposedBudget,
    proposedDuration,
    submittedDate,
    status,
  } = application;

  const getStatusColor = () => {
    switch (status) {
      case 'pending':
        return theme.colors.warning;
      case 'accepted':
        return theme.colors.status.success;
      case 'rejected':
        return theme.colors.status.error;
      default:
        return theme.colors.primary;
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'accepted':
        return 'Acceptée';
      case 'rejected':
        return 'Refusée';
      default:
        return status;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        backgroundColor: '#fff',
        borderRadius: theme.borderRadius.lg,
        marginHorizontal: theme.spacing.md,
        marginBottom: theme.spacing.md,
        padding: theme.spacing.lg,
        ...theme.shadows.md,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: theme.colors.primary + '20',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: theme.spacing.md,
            }}
          >
            <Text style={{ fontSize: 32 }}>{freelancerAvatar}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: theme.colors.text.primary,
              }}
            >
              {freelancerName}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <Text style={{ fontSize: 13, color: theme.colors.primary }}>⭐ {freelancerRating}</Text>
              <Text style={{ fontSize: 12, color: theme.colors.text.secondary, marginLeft: 4 }}>
                ({freelancerReviews} avis)
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            backgroundColor: getStatusColor() + '20',
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: theme.borderRadius.md,
          }}
        >
          <Text style={{ fontSize: 11, color: getStatusColor(), fontWeight: '600' }}>
            {getStatusLabel()}
          </Text>
        </View>
      </View>

      <View style={{ marginTop: theme.spacing.md, borderTopWidth: 1, borderTopColor: theme.colors.border, paddingTop: theme.spacing.md }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontSize: 13, color: theme.colors.text.secondary }}>Budget proposé</Text>
          <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.primary }}>
            {proposedBudget.toLocaleString()} MAD
          </Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 13, color: theme.colors.text.secondary }}>Durée estimée</Text>
          <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text.primary }}>
            {proposedDuration}
          </Text>
        </View>
      </View>

      {status === 'pending' && (
        <View
          style={{
            flexDirection: 'row',
            gap: theme.spacing.sm,
            marginTop: theme.spacing.md,
          }}
        >
          <TouchableOpacity
            onPress={onReject}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: theme.borderRadius.md,
              borderWidth: 1,
              borderColor: theme.colors.border,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: theme.colors.text.secondary, fontWeight: '600' }}>Refuser</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onAccept}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: theme.borderRadius.md,
              backgroundColor: theme.colors.primary,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>Accepter</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ApplicationCard;
