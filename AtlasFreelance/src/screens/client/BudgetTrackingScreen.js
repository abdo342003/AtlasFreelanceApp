import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import paymentService from '../../services/paymentService';
import { theme } from '../../theme';
import { formatCurrency } from '../../utils/formatters';

const { width } = Dimensions.get('window');

const BudgetChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <View style={{ paddingVertical: theme.spacing.lg }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text.primary, marginBottom: theme.spacing.sm }}>
          Dépenses mensuelles
        </Text>
        <Text style={{ color: theme.colors.text.secondary }}>Pas encore de données de dépenses.</Text>
      </View>
    );
  }

  const maxValue = Math.max(...data.map(d => d.amount), 1);
  
  return (
    <View style={{ paddingVertical: theme.spacing.lg }}>
      <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text.primary, marginBottom: theme.spacing.md }}>
        Dépenses mensuelles
      </Text>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: theme.spacing.md, height: 150 }}>
        {data.map((item, idx) => (
          <View key={idx} style={{ flex: 1, alignItems: 'center' }}>
            <View
              style={{
                width: '100%',
                height: (item.amount / maxValue) * 100,
                backgroundColor: theme.colors.primary,
                borderRadius: theme.borderRadius.md,
              }}
            />
            <Text style={{ fontSize: 11, color: theme.colors.text.secondary, marginTop: theme.spacing.sm }}>
              {item.month}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const MilestoneCard = ({ milestone }) => {
  const progress = (milestone.spent / milestone.budget) * 100;
  
  return (
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
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text.primary }}>
            {milestone.title}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
            <View
              style={{
                backgroundColor:
                  milestone.status === 'completed'
                    ? theme.colors.status.success + '20'
                    : milestone.status === 'in_progress'
                    ? theme.colors.primary + '20'
                    : theme.colors.border,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: theme.borderRadius.md,
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '600',
                  color:
                    milestone.status === 'completed'
                      ? theme.colors.status.success
                      : milestone.status === 'in_progress'
                      ? theme.colors.primary
                      : theme.colors.text.secondary,
                }}
              >
                {milestone.status === 'completed'
                  ? '✓ Complété'
                  : milestone.status === 'in_progress'
                  ? 'En cours'
                  : 'En attente'}
              </Text>
            </View>
          </View>
        </View>
        <Text style={{ fontSize: 14, fontWeight: '700', color: theme.colors.primary }}>
          {formatCurrency(milestone.spent)}/{formatCurrency(milestone.budget)}
        </Text>
      </View>

      {/* Progress Bar */}
      <View
        style={{
          height: 6,
          backgroundColor: theme.colors.border,
          borderRadius: theme.borderRadius.full,
          marginTop: theme.spacing.md,
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            height: '100%',
            width: `${Math.min(progress, 100)}%`,
            backgroundColor: progress > 100 ? theme.colors.status.error : theme.colors.primary,
          }}
        />
      </View>
    </View>
  );
};

const PaymentItem = ({ payment }) => {
  const getStatusColor = () => {
    switch (payment.status) {
      case 'released':
        return theme.colors.status.success;
      case 'pending_approval':
        return theme.colors.warning;
      case 'pending_release':
        return theme.colors.primary;
      default:
        return theme.colors.text.secondary;
    }
  };

  const getStatusLabel = () => {
    switch (payment.status) {
      case 'released':
        return 'Libéré';
      case 'pending_approval':
        return 'En attente d\'approbation';
      case 'pending_release':
        return 'Prêt à libérer';
      default:
        return payment.status;
    }
  };

  return (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
        ...theme.shadows.sm,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.text.primary }}>
            {payment.projectTitle}
          </Text>
          <Text style={{ fontSize: 12, color: theme.colors.text.secondary, marginTop: 4 }}>
            {payment.freelancerName}
          </Text>
          <Text style={{ fontSize: 11, color: theme.colors.text.secondary, marginTop: 6 }}>
            {payment.description}
          </Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: theme.colors.primary }}>
            {formatCurrency(payment.amount)}
          </Text>
          <View
            style={{
              marginTop: theme.spacing.sm,
              paddingHorizontal: 8,
              paddingVertical: 4,
              backgroundColor: getStatusColor() + '20',
              borderRadius: theme.borderRadius.md,
            }}
          >
            <Text style={{ fontSize: 10, fontWeight: '600', color: getStatusColor() }}>
              {getStatusLabel()}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export const BudgetTrackingScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [clientBudgetSummary, setClientBudgetSummary] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadBudgetData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const [budgetRes, paymentRes] = await Promise.all([
        paymentService.getClientBudgetSummary(user?.id),
        paymentService.getPaymentHistory(user?.id),
      ]);

      if (budgetRes.success) {
        const enriched = {
          ...budgetRes.data,
          monthlySpending: budgetRes.data?.monthlySpending?.length
            ? budgetRes.data.monthlySpending
            : [
                { month: 'Nov', amount: 1200 },
                { month: 'Déc', amount: 1800 },
                { month: 'Jan', amount: 900 },
              ],
        };
        setClientBudgetSummary(enriched);
      } else {
        Alert.alert('Erreur', budgetRes.error);
      }

      if (paymentRes.success) {
        setPaymentHistory(paymentRes.data);
      } else {
        Alert.alert('Erreur', paymentRes.error);
      }
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(
    useCallback(() => {
      loadBudgetData();
    }, [loadBudgetData])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBudgetData();
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Header */}
      <View style={{ backgroundColor: '#fff', padding: theme.spacing.lg, ...theme.shadows.sm }}>
        <Text style={{ fontSize: 20, fontWeight: '700', color: theme.colors.text.primary }}>
          Budget & Paiements
        </Text>
      </View>

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingTop: theme.spacing.lg, paddingBottom: theme.spacing.xl }}
        style={{ flex: 1 }}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginVertical: theme.spacing.xl }} />
        ) : (
          <>
            {/* Summary Cards */}
            {clientBudgetSummary && (
              <View style={{ padding: theme.spacing.lg }}>
                <View style={{ flexDirection: 'row', gap: theme.spacing.md, marginBottom: theme.spacing.lg }}>
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: '#fff',
                      borderRadius: theme.borderRadius.lg,
                      padding: theme.spacing.md,
                      ...theme.shadows.sm,
                    }}
                  >
                    <Text style={{ fontSize: 12, color: theme.colors.text.secondary, marginBottom: 4 }}>
                      Total dépensé
                    </Text>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.primary }}>
                      {formatCurrency(clientBudgetSummary.totalSpent)}
                    </Text>
                    <Text style={{ fontSize: 11, color: theme.colors.text.secondary, marginTop: 4 }}>
                      sur {formatCurrency(clientBudgetSummary.totalBudgeted)}
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: '#fff',
                      borderRadius: theme.borderRadius.lg,
                      padding: theme.spacing.md,
                      ...theme.shadows.sm,
                    }}
                  >
                    <Text style={{ fontSize: 12, color: theme.colors.text.secondary, marginBottom: 4 }}>
                      Projets actifs
                    </Text>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: theme.colors.primary }}>
                      {clientBudgetSummary.activeProjects}
                    </Text>
                    <Text style={{ fontSize: 11, color: theme.colors.text.secondary, marginTop: 4 }}>
                      {clientBudgetSummary.completedProjects} complétés
                    </Text>
                  </View>
                </View>

                {/* Chart */}
                <View style={{ backgroundColor: '#fff', borderRadius: theme.borderRadius.lg, padding: theme.spacing.lg, ...theme.shadows.sm }}>
                  <BudgetChart data={clientBudgetSummary.monthlySpending} />
                </View>
              </View>
            )}

            {/* Payment History */}
            <View style={{ padding: theme.spacing.lg, paddingTop: 0 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.text.primary, marginBottom: theme.spacing.md }}>
                Historique des paiements
              </Text>
              {paymentHistory.length === 0 ? (
                <View style={{ alignItems: 'center', paddingVertical: theme.spacing.xl }}>
                  <Text style={{ fontSize: 32, marginBottom: theme.spacing.md }}>💰</Text>
                  <Text style={{ fontSize: 14, color: theme.colors.text.secondary }}>
                    Aucun paiement enregistré
                  </Text>
                </View>
              ) : (
                paymentHistory.map((payment) => (
                  <PaymentItem key={payment.id} payment={payment} />
                ))
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default BudgetTrackingScreen;
