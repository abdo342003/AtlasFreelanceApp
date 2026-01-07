import React from 'react';
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';

const BookItem = ({ title, author, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={styles.title}>My Loove</Text>
      <Text style={styles.author}>hajar</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  author: {
    fontSize: 14,
    color: '#666',
  },
});

export default BookItem;
