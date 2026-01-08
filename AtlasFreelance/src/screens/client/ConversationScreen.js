import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../../theme';

export default function ConversationScreen({ route }) {
  const { threadId, sender } = route.params || {};
  const mockConversation = [
    { id: 'm1', from: sender || 'Freelancer', text: 'Bonjour, je suis intéressé par votre projet.' },
    { id: 'm2', from: 'Vous', text: 'Merci ! Pouvez-vous partager vos références ?' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conversation</Text>
      <Text style={styles.subtitle}>{sender || 'Freelancer'} • Fil #{threadId || 'N/A'}</Text>
      <ScrollView contentContainerStyle={styles.messages}>
        {mockConversation.map((msg) => (
          <View key={msg.id} style={[styles.bubble, msg.from === 'Vous' ? styles.bubbleSelf : styles.bubbleOther]}>
            <Text style={styles.from}>{msg.from}</Text>
            <Text style={styles.text}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  subtitle: {
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  messages: {
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
  },
  bubble: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    maxWidth: '80%',
  },
  bubbleSelf: {
    backgroundColor: theme.colors.primary,
    alignSelf: 'flex-end',
  },
  bubbleOther: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    ...theme.shadows.sm,
  },
  from: {
    color: '#fff',
    fontWeight: '600',
    marginBottom: 4,
  },
  text: {
    color: '#fff',
  },
});
