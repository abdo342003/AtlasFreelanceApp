// src/components/admin/KPICard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function KPICard({ title, value, change, color, icon, onPress }) {
  const isPositive = change >= 0;
  
  return (
    <TouchableOpacity 
      style={[styles.card, { borderLeftColor: color, borderLeftWidth: 4 }]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {icon && <Text style={styles.icon}>{icon}</Text>}
      </View>
      
      <Text style={[styles.value, { color }]}>{value}</Text>
      
      {change !== undefined && (
        <View style={styles.changeContainer}>
          <Text style={[styles.change, isPositive ? styles.positive : styles.negative]}>
            {isPositive ? '↑' : '↓'} {Math.abs(change)}%
          </Text>
          <Text style={styles.period}>vs mois dernier</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  icon: {
    fontSize: 20,
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  change: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
  },
  positive: {
    color: '#16a34a',
  },
  negative: {
    color: '#dc2626',
  },
  period: {
    fontSize: 12,
    color: '#94a3b8',
  },
});
