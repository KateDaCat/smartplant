import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ADMIN_IOT_DETAIL } from '../../navigation/routes';

const MOCK_IOT_DEVICES = [
  {
    device_id: 'DEV-001',
    device_name: 'Soil Monitor A1',
    species: 'Rafflesia arnoldii',
    location: {
      latitude: 1.4667,
      longitude: 110.3333,
      name: 'Bako National Park',
    },
    readings: {
      temperature: 28.4,
      humidity: 78,
      soil_moisture: 42,
      motion_detected: false,
    },
    last_updated: '2025-10-21T12:45:00Z',
  },
  {
    device_id: 'DEV-014',
    device_name: 'Weather Station B3',
    species: 'Nepenthes rajah',
    location: {
      latitude: 1.595,
      longitude: 110.345,
      name: 'Santubong Forest Reserve',
    },
    readings: {
      temperature: 24.9,
      humidity: 91,
      soil_moisture: 65,
      motion_detected: true,
    },
    last_updated: '2025-10-21T12:41:00Z',
  },
  {
    device_id: 'DEV-020',
    device_name: 'Trail Camera C2',
    species: 'Dipterocarpus sarawakensis',
    location: {
      latitude: 1.285,
      longitude: 110.523,
      name: 'Lambir Hills',
    },
    readings: {
      temperature: 26.8,
      humidity: 84,
      soil_moisture: 55,
      motion_detected: false,
    },
    last_updated: '2025-10-21T12:36:00Z',
  },
];

const formatDate = (iso) => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleString();
};

export default function AdminIotScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>IoT Sensor Network</Text>
      <Text style={styles.headerSubtitle}>
        Real-time status of field sensors. Tap any row to inspect full analytics.
      </Text>

      <View style={styles.table}>
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cellWide, styles.headerText]}>Plant</Text>
          <Text style={[styles.cell, styles.headerText]}>Device ID</Text>
          <Text style={[styles.cell, styles.headerText]}>Temp (?C)</Text>
          <Text style={[styles.cell, styles.headerText]}>Humidity (%)</Text>
          <Text style={[styles.cell, styles.headerText]}>Soil (%)</Text>
          <Text style={[styles.cell, styles.headerText]}>Motion</Text>
          <Text style={[styles.cellAction, styles.headerText]}>Last Update</Text>
          <Text style={[styles.cellAction, styles.headerText]}>Action</Text>
        </View>

        <FlatList
          data={MOCK_IOT_DEVICES}
          keyExtractor={(item) => item.device_id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={styles.cellWide}>
                <Text style={styles.plantText}>{item.species}</Text>
                <Text style={styles.metaText}>{item.location.name}</Text>
              </View>
              <Text style={styles.cell}>{item.device_id}</Text>
              <Text style={styles.cell}>{item.readings.temperature.toFixed(1)}</Text>
              <Text style={styles.cell}>{item.readings.humidity}%</Text>
              <Text style={styles.cell}>{item.readings.soil_moisture}%</Text>
              <Text style={styles.cell}>{item.readings.motion_detected ? 'Detected' : 'None'}</Text>
              <Text style={styles.cellActionSmall}>{formatDate(item.last_updated)}</Text>
              <View style={styles.cellAction}>
                <TouchableOpacity
                  style={styles.viewButton}
                  onPress={() => navigation.navigate(ADMIN_IOT_DETAIL, { device: item })}
                >
                  <Text style={styles.viewText}>View</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F9F4',
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2A37',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 4,
    marginBottom: 16,
  },
  table: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  headerRow: {
    backgroundColor: '#F1F5F9',
  },
  separator: {
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  cell: {
    flex: 1,
    fontSize: 13,
    color: '#334155',
  },
  cellWide: {
    flex: 1.5,
  },
  cellAction: {
    width: 110,
    alignItems: 'flex-end',
  },
  cellActionSmall: {
    width: 140,
    fontSize: 12,
    color: '#475569',
  },
  headerText: {
    fontWeight: '700',
    color: '#0F172A',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  plantText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  metaText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  viewButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#1E88E5',
  },
  viewText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
