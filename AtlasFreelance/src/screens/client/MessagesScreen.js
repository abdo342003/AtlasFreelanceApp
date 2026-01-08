import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { theme } from '../../theme';

const mockMessages = [
  { id: '1', sender: 'Freelancer 1', preview: 'Bonjour, je suis intéressé...', time: '10:30' },
  { id: '2', sender: 'Freelancer 2', preview: 'Voici mon devis...', time: '09:15' },
];

export default function MessagesScreen({ navigation }) {
  const renderMessage = ({ item }) => (
    <TouchableOpacity
      style={styles.messageCard}
      onPress={() => navigation.getParent()?.navigate('Conversation', { threadId: item.id, sender: item.sender })}
      activeOpacity={0.8}
    >
      <View>
        <Text style={styles.senderName}>{item.sender}</Text>
        <Text style={styles.messagePreview}>{item.preview}</Text>
      </View>
      <Text style={styles.messageTime}>{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Messages</Text>
      {mockMessages.length === 0 ? (
        <Text style={styles.emptyText}>Aucun message pour le moment</Text>
      ) : (
        <FlatList
          data={mockMessages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={{ height: theme.spacing.sm }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.base,
  },
  messageCard: {
    backgroundColor: theme.colors.background.secondary,
    padding: theme.spacing.base,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.base,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  senderName: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semiBold,
    color: theme.colors.text.primary,
  },
  messagePreview: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.xs,
  },
  messageTime: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
  },
});
