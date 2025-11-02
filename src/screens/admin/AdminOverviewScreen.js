import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';

const MOCK_METRICS = {
  pendingObservations: 12,
  devicesOnline: 8,
  alertsOpen: 3,
};

export default function AdminOverviewScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome back, Admin!</Text>
      <Text style={styles.subtitle}>Here is a quick snapshot of the system.</Text>

      <View style={styles.cardGrid}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Pending Observations</Text>
          <Text style={styles.cardValue}>{MOCK_METRICS.pendingObservations}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Devices Online</Text>
          <Text style={styles.cardValue}>{MOCK_METRICS.devicesOnline}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Open Alerts</Text>
          <Text style={styles.cardValue}>{MOCK_METRICS.alertsOpen}</Text>
        </View>
      </View>

      <View style={styles.placeholderPanel}>
        <Text style={styles.placeholderTitle}>Insights coming soon</Text>
        <Text style={styles.placeholderBody}>
          We will plug in real-time analytics, recent activities, and AI recommendations here once the backend is ready.
        </Text>
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
    fontSize: 24,
    fontWeight: '700',
    color: '#1D3A2C',
  },
  subtitle: {
    fontSize: 14,
    color: '#5C6C75',
    marginTop: 6,
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 24,
  },
  card: {
    flexBasis: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  cardLabel: {
    fontSize: 13,
    color: '#6B7B86',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C4F3F',
  },
  placeholderPanel: {
    marginTop: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E1E7EB',
  },
  placeholderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C4F3F',
    marginBottom: 6,
  },
  placeholderBody: {
    fontSize: 14,
    color: '#5C6C75',
    lineHeight: 20,
  },
});
