import React from 'react';
import { SafeAreaView, Text, StyleSheet, View } from 'react-native';

const MOCK_ALERTS = [
  { id: 'AL-1022', severity: 'High', message: 'Soil moisture critical (NODE-014)', timestamp: '2m ago' },
  { id: 'AL-1018', severity: 'Medium', message: 'AI flagged observation OBS-2448', timestamp: '1h ago' },
  { id: 'AL-1010', severity: 'Low', message: 'Device NODE-020 maintenance overdue', timestamp: '1d ago' },
];

const SEVERITY_COLORS = {
  High: '#C4473A',
  Medium: '#B27B16',
  Low: '#2C8155',
};

export default function AdminAlertsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>System Alerts</Text>
      <Text style={styles.subtitle}>
        Track real-time conditions from sensors and AI. Hook this feed up to the backend alerts endpoint later.
      </Text>

      <View style={styles.list}>
        {MOCK_ALERTS.map((alert) => (
          <View key={alert.id} style={styles.card}>
            <View style={styles.headerRow}>
              <Text style={styles.alertId}>{alert.id}</Text>
              <Text style={[styles.severity, { color: SEVERITY_COLORS[alert.severity] }]}>{alert.severity}</Text>
            </View>
            <Text style={styles.message}>{alert.message}</Text>
            <Text style={styles.timestamp}>{alert.timestamp}</Text>
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
    padding: 18,
    borderWidth: 1,
    borderColor: '#E1E7EB',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alertId: {
    fontSize: 12,
    color: '#6B7B86',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  severity: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  message: {
    fontSize: 15,
    color: '#2C4F3F',
    fontWeight: '500',
  },
  timestamp: {
    marginTop: 6,
    fontSize: 12,
    color: '#8596A1',
  },
});
