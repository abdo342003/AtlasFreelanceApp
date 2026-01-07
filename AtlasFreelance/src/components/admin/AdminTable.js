// src/components/admin/AdminTable.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';

export default function AdminTable({ 
  columns, 
  data, 
  onRowPress,
  loading = false,
  emptyMessage = 'Aucune donnée disponible'
}) {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.table}>
        {/* Header */}
        <View style={styles.headerRow}>
          {columns.map((column, index) => (
            <View 
              key={index} 
              style={[styles.headerCell, { width: column.width || 150 }]}
            >
              <Text style={styles.headerText}>{column.title}</Text>
            </View>
          ))}
        </View>

        {/* Rows */}
        {data.map((row, rowIndex) => (
          <TouchableOpacity
            key={rowIndex}
            style={[
              styles.row,
              rowIndex % 2 === 0 ? styles.rowEven : styles.rowOdd,
            ]}
            onPress={() => onRowPress && onRowPress(row)}
            disabled={!onRowPress}
          >
            {columns.map((column, colIndex) => (
              <View 
                key={colIndex} 
                style={[styles.cell, { width: column.width || 150 }]}
              >
                {column.render ? (
                  column.render(row[column.key], row)
                ) : (
                  <Text style={styles.cellText} numberOfLines={2}>
                    {row[column.key]}
                  </Text>
                )}
              </View>
            ))}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  table: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderBottomWidth: 2,
    borderBottomColor: '#cbd5e1',
  },
  headerCell: {
    padding: 12,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  rowEven: {
    backgroundColor: 'white',
  },
  rowOdd: {
    backgroundColor: '#f8fafc',
  },
  cell: {
    padding: 12,
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 14,
    color: '#475569',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748b',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#94a3b8',
  },
});
