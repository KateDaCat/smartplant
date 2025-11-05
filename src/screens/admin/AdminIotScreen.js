import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ADMIN_IOT_DETAIL } from '../../navigation/routes';

const MOCK_IOT_DEVICES = [
  {
    device_id: 'DEV-001',
    device_name: 'Soil Monitor A1',
    species: 'Rafflesia arnoldii',
    photo: require('../../../assets/rafflesia.jpg'),
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
    photo: require('../../../assets/pitcher.jpg'),
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
    photo: require('../../../assets/monstera.jpg'),
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

export default function AdminIotScreen() {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => navigation.navigate(ADMIN_IOT_DETAIL, { device: item })}
    >
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.deviceName}>{item.device_name}</Text>
          <Text style={styles.deviceMeta}>Device ID: {item.device_id}</Text>
        </View>
        <Image source={item.photo} style={styles.photo} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Plant</Text>
        <Text style={styles.sectionValue}>{item.species}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Location</Text>
        <Text style={styles.sectionValue}>{item.location.name}</Text>
        <Text style={styles.locationCoords}>
          {item.location.latitude.toFixed(4)}, {item.location.longitude.toFixed(4)}
        </Text>
      </View>

      <Text style={styles.updatedText}>Tap to view sensor readings ?</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>IoT Sensor Network</Text>
      <Text style={styles.headerSubtitle}>
        Live environmental data from field sensors. Masking coming soon.
      </Text>

      <FlatList
        data={MOCK_IOT_DEVICES}
        keyExtractor={(item) => item.device_id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        renderItem={renderItem}
      />
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
  listContent: {
    paddingBottom: 24,
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  deviceMeta: {
    marginTop: 2,
    fontSize: 12,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  photo: {
    width: 72,
    height: 72,
    borderRadius: 12,
    marginLeft: 12,
  },
  section: {
    marginTop: 12,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  sectionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2A37',
  },
  locationCoords: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  updatedText: {
    marginTop: 14,
    fontSize: 12,
    fontWeight: '600',
    color: '#1E88E5',
  },
});
