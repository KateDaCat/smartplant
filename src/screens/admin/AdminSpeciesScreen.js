import React from 'react';
import { SafeAreaView, Text, StyleSheet, View } from 'react-native';

const MOCK_SPECIES = [
  { name: 'Nepenthes rafflesiana', category: 'Vulnerable' },
  { name: 'Rafflesia arnoldii', category: 'Endangered' },
  { name: 'Ficus elastica', category: 'Common' },
];

export default function AdminSpeciesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Species Catalogue</Text>
      <Text style={styles.subtitle}>
        Manage scientific metadata, conservation status, and media assets for each species.
      </Text>

      <View style={styles.table}>
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.headerText]}>Scientific Name</Text>
          <Text style={[styles.cell, styles.headerText]}>Status</Text>
        </View>
        {MOCK_SPECIES.map((species) => (
          <View key={species.name} style={styles.row}>
            <Text style={[styles.cell, styles.primaryCell]}>{species.name}</Text>
            <Text style={styles.cell}>{species.category}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F4F6F8',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1D3A2C',
  },
  subtitle: {
    fontSize: 14,
    color: '#5C6C75',
    marginTop: 8,
    lineHeight: 20,
    marginBottom: 24,
  },
  table: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E1E7EB',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F5',
  },
  headerRow: {
    backgroundColor: '#EDF5F0',
  },
  cell: {
    flex: 1,
    fontSize: 14,
    color: '#4A5C66',
  },
  primaryCell: {
    fontWeight: '600',
    color: '#2C4F3F',
  },
  headerText: {
    fontWeight: '700',
    color: '#1D3A2C',
  },
});
