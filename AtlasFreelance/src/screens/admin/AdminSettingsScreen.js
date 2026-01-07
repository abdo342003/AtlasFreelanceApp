// src/screens/admin/AdminSettingsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { adminSettingsService } from '../../services/adminApi';

export default function AdminSettingsScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    platform: {
      siteName: 'Atlas Freelance',
      siteUrl: 'https://atlasfreelance.ma',
      supportEmail: 'support@atlasfreelance.ma',
      currency: 'MAD',
      timezone: 'Africa/Casablanca',
      language: 'fr',
    },
    fees: {
      platformFeePercentage: 10,
      withdrawalFeeFlat: 5,
      minimumWithdrawal: 100,
    },
    registration: {
      requireEmailVerification: true,
      requirePhoneVerification: false,
      autoApproveFreelancers: false,
      autoApproveClients: true,
    },
    security: {
      enableTwoFactor: false,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordMinLength: 8,
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      adminAlerts: true,
    },
    payment: {
      enableStripe: true,
      enablePayPal: false,
      enableBankTransfer: true,
      autoReleasePayment: false,
      paymentHoldDays: 7,
    },
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await adminSettingsService.getSettings();
      
      if (response.success && response.data) {
        setSettings((prev) => ({ ...prev, ...response.data }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      const response = await adminSettingsService.updateSettings(settings);
      
      if (response.success) {
        Alert.alert('Succès', 'Paramètres enregistrés avec succès');
      } else {
        Alert.alert('Erreur', 'Impossible d\'enregistrer les paramètres');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Erreur', 'Une erreur est survenue');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (category, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Chargement des paramètres...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Paramètres</Text>
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSaveSettings}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? '...' : '💾 Enregistrer'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Platform Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌐 Plateforme</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Nom du site</Text>
            <TextInput
              style={styles.input}
              value={settings.platform.siteName}
              onChangeText={(value) => updateSetting('platform', 'siteName', value)}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>URL du site</Text>
            <TextInput
              style={styles.input}
              value={settings.platform.siteUrl}
              onChangeText={(value) => updateSetting('platform', 'siteUrl', value)}
              keyboardType="url"
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Email de support</Text>
            <TextInput
              style={styles.input}
              value={settings.platform.supportEmail}
              onChangeText={(value) => updateSetting('platform', 'supportEmail', value)}
              keyboardType="email-address"
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Devise</Text>
            <TextInput
              style={styles.input}
              value={settings.platform.currency}
              onChangeText={(value) => updateSetting('platform', 'currency', value)}
            />
          </View>
        </View>

        {/* Fee Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💰 Frais de plateforme</Text>
          
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Commission de la plateforme (%)</Text>
            <TextInput
              style={styles.input}
              value={String(settings.fees.platformFeePercentage)}
              onChangeText={(value) =>
                updateSetting('fees', 'platformFeePercentage', parseFloat(value) || 0)
              }
              keyboardType="numeric"
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Frais de retrait (MAD)</Text>
            <TextInput
              style={styles.input}
              value={String(settings.fees.withdrawalFeeFlat)}
              onChangeText={(value) =>
                updateSetting('fees', 'withdrawalFeeFlat', parseFloat(value) || 0)
              }
              keyboardType="numeric"
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Retrait minimum (MAD)</Text>
            <TextInput
              style={styles.input}
              value={String(settings.fees.minimumWithdrawal)}
              onChangeText={(value) =>
                updateSetting('fees', 'minimumWithdrawal', parseFloat(value) || 0)
              }
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Registration Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Inscription</Text>
          
          <View style={styles.settingItemRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Vérification email requise</Text>
              <Text style={styles.settingDescription}>
                Les nouveaux utilisateurs doivent vérifier leur email
              </Text>
            </View>
            <Switch
              value={settings.registration.requireEmailVerification}
              onValueChange={(value) =>
                updateSetting('registration', 'requireEmailVerification', value)
              }
            />
          </View>

          <View style={styles.settingItemRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Vérification téléphone requise</Text>
              <Text style={styles.settingDescription}>
                Les nouveaux utilisateurs doivent vérifier leur téléphone
              </Text>
            </View>
            <Switch
              value={settings.registration.requirePhoneVerification}
              onValueChange={(value) =>
                updateSetting('registration', 'requirePhoneVerification', value)
              }
            />
          </View>

          <View style={styles.settingItemRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Approbation auto freelancers</Text>
              <Text style={styles.settingDescription}>
                Approuver automatiquement les nouveaux freelancers
              </Text>
            </View>
            <Switch
              value={settings.registration.autoApproveFreelancers}
              onValueChange={(value) =>
                updateSetting('registration', 'autoApproveFreelancers', value)
              }
            />
          </View>

          <View style={styles.settingItemRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Approbation auto clients</Text>
              <Text style={styles.settingDescription}>
                Approuver automatiquement les nouveaux clients
              </Text>
            </View>
            <Switch
              value={settings.registration.autoApproveClients}
              onValueChange={(value) =>
                updateSetting('registration', 'autoApproveClients', value)
              }
            />
          </View>
        </View>

        {/* Security Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔒 Sécurité</Text>
          
          <View style={styles.settingItemRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Authentification à deux facteurs</Text>
              <Text style={styles.settingDescription}>
                Activer la 2FA pour tous les utilisateurs
              </Text>
            </View>
            <Switch
              value={settings.security.enableTwoFactor}
              onValueChange={(value) =>
                updateSetting('security', 'enableTwoFactor', value)
              }
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Timeout de session (minutes)</Text>
            <TextInput
              style={styles.input}
              value={String(settings.security.sessionTimeout)}
              onChangeText={(value) =>
                updateSetting('security', 'sessionTimeout', parseInt(value) || 30)
              }
              keyboardType="numeric"
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Tentatives de connexion max</Text>
            <TextInput
              style={styles.input}
              value={String(settings.security.maxLoginAttempts)}
              onChangeText={(value) =>
                updateSetting('security', 'maxLoginAttempts', parseInt(value) || 5)
              }
              keyboardType="numeric"
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Longueur min du mot de passe</Text>
            <TextInput
              style={styles.input}
              value={String(settings.security.passwordMinLength)}
              onChangeText={(value) =>
                updateSetting('security', 'passwordMinLength', parseInt(value) || 8)
              }
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Notification Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔔 Notifications</Text>
          
          <View style={styles.settingItemRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Notifications email</Text>
              <Text style={styles.settingDescription}>
                Envoyer des notifications par email
              </Text>
            </View>
            <Switch
              value={settings.notifications.emailNotifications}
              onValueChange={(value) =>
                updateSetting('notifications', 'emailNotifications', value)
              }
            />
          </View>

          <View style={styles.settingItemRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Notifications SMS</Text>
              <Text style={styles.settingDescription}>
                Envoyer des notifications par SMS
              </Text>
            </View>
            <Switch
              value={settings.notifications.smsNotifications}
              onValueChange={(value) =>
                updateSetting('notifications', 'smsNotifications', value)
              }
            />
          </View>

          <View style={styles.settingItemRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Notifications push</Text>
              <Text style={styles.settingDescription}>
                Envoyer des notifications push mobiles
              </Text>
            </View>
            <Switch
              value={settings.notifications.pushNotifications}
              onValueChange={(value) =>
                updateSetting('notifications', 'pushNotifications', value)
              }
            />
          </View>

          <View style={styles.settingItemRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Alertes admin</Text>
              <Text style={styles.settingDescription}>
                Recevoir des alertes administrateur
              </Text>
            </View>
            <Switch
              value={settings.notifications.adminAlerts}
              onValueChange={(value) =>
                updateSetting('notifications', 'adminAlerts', value)
              }
            />
          </View>
        </View>

        {/* Payment Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💳 Paiements</Text>
          
          <View style={styles.settingItemRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Stripe</Text>
              <Text style={styles.settingDescription}>
                Activer les paiements par Stripe
              </Text>
            </View>
            <Switch
              value={settings.payment.enableStripe}
              onValueChange={(value) =>
                updateSetting('payment', 'enableStripe', value)
              }
            />
          </View>

          <View style={styles.settingItemRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>PayPal</Text>
              <Text style={styles.settingDescription}>
                Activer les paiements par PayPal
              </Text>
            </View>
            <Switch
              value={settings.payment.enablePayPal}
              onValueChange={(value) =>
                updateSetting('payment', 'enablePayPal', value)
              }
            />
          </View>

          <View style={styles.settingItemRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Virement bancaire</Text>
              <Text style={styles.settingDescription}>
                Activer les virements bancaires
              </Text>
            </View>
            <Switch
              value={settings.payment.enableBankTransfer}
              onValueChange={(value) =>
                updateSetting('payment', 'enableBankTransfer', value)
              }
            />
          </View>

          <View style={styles.settingItemRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Libération auto des paiements</Text>
              <Text style={styles.settingDescription}>
                Libérer automatiquement les paiements après la période
              </Text>
            </View>
            <Switch
              value={settings.payment.autoReleasePayment}
              onValueChange={(value) =>
                updateSetting('payment', 'autoReleasePayment', value)
              }
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Période de rétention (jours)</Text>
            <TextInput
              style={styles.input}
              value={String(settings.payment.paymentHoldDays)}
              onChangeText={(value) =>
                updateSetting('payment', 'paymentHoldDays', parseInt(value) || 7)
              }
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#10b981',
    borderRadius: 8,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  settingItem: {
    marginBottom: 16,
  },
  settingItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingInfo: {
    flex: 1,
    marginRight: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: '#64748b',
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1e293b',
    marginTop: 4,
  },
  bottomPadding: {
    height: 20,
  },
});