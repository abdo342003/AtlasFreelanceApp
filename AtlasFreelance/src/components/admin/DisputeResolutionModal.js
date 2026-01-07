// src/components/admin/DisputeResolutionModal.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';

export default function DisputeResolutionModal({ 
  visible, 
  dispute, 
  onClose, 
  onResolve 
}) {
  const [resolution, setResolution] = useState('');
  const [favoredParty, setFavoredParty] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResolve = async () => {
    if (!resolution) {
      Alert.alert('Erreur', 'Veuillez sélectionner une résolution');
      return;
    }

    if (resolution === 'refund' && !refundAmount) {
      Alert.alert('Erreur', 'Veuillez saisir le montant du remboursement');
      return;
    }

    setLoading(true);
    
    try {
      await onResolve({
        disputeId: dispute.id,
        resolution,
        favoredParty,
        refundAmount: refundAmount ? parseFloat(refundAmount) : 0,
        notes,
      });
      
      Alert.alert('Succès', 'Le litige a été résolu avec succès');
      handleClose();
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la résolution');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setResolution('');
    setFavoredParty('');
    setRefundAmount('');
    setNotes('');
    onClose();
  };

  if (!dispute) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Résoudre le litige</Text>
            <TouchableOpacity onPress={handleClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Dispute Info */}
            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>Projet</Text>
              <Text style={styles.infoValue}>{dispute.projectTitle}</Text>
              
              <Text style={styles.infoLabel}>Rapporté par</Text>
              <Text style={styles.infoValue}>{dispute.reportedByName}</Text>
              
              <Text style={styles.infoLabel}>Contre</Text>
              <Text style={styles.infoValue}>{dispute.againstName}</Text>
              
              <Text style={styles.infoLabel}>Raison</Text>
              <Text style={styles.infoValue}>{dispute.reason}</Text>
            </View>

            {/* Resolution Type */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Type de résolution</Text>
              
              {['client_favor', 'freelancer_favor', 'refund', 'dismiss'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.resolutionOption,
                    resolution === type && styles.resolutionOptionSelected,
                  ]}
                  onPress={() => setResolution(type)}
                >
                  <Text
                    style={[
                      styles.resolutionText,
                      resolution === type && styles.resolutionTextSelected,
                    ]}
                  >
                    {type === 'client_favor' && 'En faveur du client'}
                    {type === 'freelancer_favor' && 'En faveur du freelancer'}
                    {type === 'refund' && 'Remboursement partiel/total'}
                    {type === 'dismiss' && 'Rejeter le litige'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Refund Amount */}
            {resolution === 'refund' && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Montant du remboursement (MAD)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 500"
                  value={refundAmount}
                  onChangeText={setRefundAmount}
                  keyboardType="numeric"
                />
              </View>
            )}

            {/* Notes */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Notes (optionnel)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Ajoutez des notes ou explications..."
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.resolveButton, loading && styles.resolveButtonDisabled]} 
              onPress={handleResolve}
              disabled={loading}
            >
              <Text style={styles.resolveButtonText}>
                {loading ? 'En cours...' : 'Résoudre'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  closeButton: {
    fontSize: 24,
    color: '#64748b',
  },
  content: {
    padding: 20,
  },
  infoSection: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 8,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 12,
  },
  resolutionOption: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: 'white',
    marginBottom: 8,
  },
  resolutionOptionSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  resolutionText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  resolutionTextSelected: {
    color: 'white',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
  },
  resolveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#16a34a',
    alignItems: 'center',
  },
  resolveButtonDisabled: {
    opacity: 0.5,
  },
  resolveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});
