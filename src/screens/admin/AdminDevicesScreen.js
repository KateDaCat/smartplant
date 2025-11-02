import React from 'react';
import { SafeAreaView, Text, StyleSheet, View } from 'react-native';

const MOCK_DEVICES = [
  { name: 'Soil Monitor A1', nodeId: 'NODE-001', status: 'Online', location: 'Bukit Timah' },
  { name: 'Weather Station B3', nodeId: 'NODE-014', status: 'Offline', location: 'MacRitchie' },
  { name: 'Trail Camera C2', nodeId: 'NODE-020', status: 'Maintenance', location: 'Pulau Ubin' },
];

export default function AdminDevicesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sensor Devices</Text>
      <Text style={styles.subtitle}>
        Assign sensors to species, monitor uptime, and dispatch maintenance teams here soon.
      </Text>

      <View style={styles.list}>
        {MOCK_DEVICES.map((device) => (
          <View key={device.nodeId} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.deviceName}>{device.name}</Text>
              <Text style={[styles.statusBadge, styles[`status${device.status}`]]}>{device.status}</Text>
            </View>
            <Text style={styles.meta}>Node: {device.nodeId}</Text>
            <Text style={styles.meta}>Location: {device.location}</Text>
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C4F3F',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statusOnline: {
    backgroundColor: '#E3F6ED',
    color: '#2C8155',
  },
  statusOffline: {
    backgroundColor: '#FDECEA',
    color: '#C4473A',
  },
  statusMaintenance: {
    backgroundColor: '#FFF7E6',
    color: '#B27B16',
  },
  meta: {
    marginTop: 8,
    fontSize: 13,
    color: '#4A5C66',
  },
});
