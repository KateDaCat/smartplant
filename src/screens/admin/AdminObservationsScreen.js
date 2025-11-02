import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';

const MOCK_OBSERVATIONS = [
  { id: 'OBS-2451', species: 'Rafflesia arnoldii', status: 'Pending review' },
  { id: 'OBS-2448', species: 'Nepenthes rajah', status: 'Flagged by AI' },
  { id: 'OBS-2442', species: 'Monstera deliciosa', status: 'Approved' },
];

export default function AdminObservationsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Plant Observations</Text>
      <Text style={styles.subtitle}>
        Display and triage submissions from the community. Replace this mock list with live data once the API is available.
      </Text>

      <View style={styles.list}>
        {MOCK_OBSERVATIONS.map((item) => (
          <View key={item.id} style={styles.card}>
            <Text style={styles.cardId}>{item.id}</Text>
            <Text style={styles.cardSpecies}>{item.species}</Text>
            <Text style={styles.cardStatus}>{item.status}</Text>
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
  },
  list: {
    marginTop: 24,
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E1E7EB',
  },
  cardId: {
    fontSize: 12,
    color: '#6B7B86',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardSpecies: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: '600',
    color: '#2C4F3F',
  },
  cardStatus: {
    marginTop: 4,
    fontSize: 13,
    color: '#4C7C62',
  },
});
