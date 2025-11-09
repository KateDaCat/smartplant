import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const formatDate = (iso) => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleString();
};

const SensorCard = ({ icon, title, value, unit, helper, alert }) => (
  <View style={[styles.sensorCard, alert ? styles.sensorCardAlert : styles.sensorCardOk]}>
    <View style={styles.sensorCardHeader}>
      <View
        style={[styles.sensorIconWrapper, alert ? styles.sensorIconAlert : styles.sensorIconOk]}
      >
        <Ionicons
          name={icon}
          size={18}
          color={alert ? '#991B1B' : '#166534'}
        />
      </View>
      <Text style={[styles.sensorTitle, alert ? styles.sensorTitleAlert : styles.sensorTitleOk]}>{title}</Text>
    </View>
    <Text style={[styles.sensorValue, alert ? styles.sensorValueAlert : styles.sensorValueOk]}>
      {value}
      {!!unit && <Text style={styles.sensorUnit}>{unit}</Text>}
    </Text>
    {!!helper && (
      <Text style={[styles.sensorHelper, alert ? styles.sensorHelperAlert : styles.sensorHelperOk]}>
        {helper}
      </Text>
    )}
  </View>
);

export default function AdminIotDetailScreen({ route }) {
  const device = route?.params?.device;
  const [historyVisible, setHistoryVisible] = useState(false);

  if (!device) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>No device data provided.</Text>
      </SafeAreaView>
    );
  }

  const alerts = Array.isArray(device.alerts) ? device.alerts : [];

  const historySeries = useMemo(() => {
    if (Array.isArray(device.history) && device.history.length > 0) {
      return device.history;
    }

    return [
      {
        timestamp: '2025-10-21T11:45:00Z',
        temperature: 27.6,
        humidity: 82,
        soil_moisture: 44,
        motion_detected: false,
      },
      {
        timestamp: '2025-10-21T10:40:00Z',
        temperature: 27.2,
        humidity: 80,
        soil_moisture: 46,
        motion_detected: false,
      },
      {
        timestamp: '2025-10-21T09:30:00Z',
        temperature: 26.4,
        humidity: 77,
        soil_moisture: 48,
        motion_detected: true,
      },
      {
        timestamp: '2025-10-21T08:15:00Z',
        temperature: 25.9,
        humidity: 74,
        soil_moisture: 52,
        motion_detected: false,
      },
    ];
  }, [device]);

  const formatNumber = (val, digits = 1) => {
    if (typeof val !== 'number' || Number.isNaN(val)) return '--';
    return val.toFixed(digits);
  };

  const sensorCards = [
    {
      key: 'temperature',
      icon: 'thermometer-outline',
      title: 'Temperature',
      value: formatNumber(device.readings.temperature, 1),
      unit: '?C',
      helper: alerts.includes('Temperature')
        ? 'Temperature exceeds the optimal window.'
        : 'Within optimal range.',
      alert: alerts.includes('Temperature'),
    },
    {
      key: 'humidity',
      icon: 'water-outline',
      title: 'Humidity',
      value: formatNumber(device.readings.humidity, 0),
      unit: '%',
      helper: alerts.includes('Humidity')
        ? 'High humidity detected. Inspect shelter.'
        : 'Air moisture is stable.',
      alert: alerts.includes('Humidity'),
    },
    {
      key: 'soil_moisture',
      icon: 'leaf-outline',
      title: 'Soil Moisture',
      value: formatNumber(device.readings.soil_moisture, 0),
      unit: '%',
      helper: alerts.includes('Soil Moisture')
        ? 'Soil moisture outside safe band.'
        : 'Root zone moisture is healthy.',
      alert: alerts.includes('Soil Moisture'),
    },
    {
      key: 'motion_detected',
      icon: 'walk-outline',
      title: 'Motion',
      value: device.readings.motion_detected ? 'Detected' : 'None',
      unit: '',
      helper: alerts.includes('Motion')
        ? 'Unexpected movement near this device.'
        : 'No unusual activity reported.',
      alert: alerts.includes('Motion'),
    },
  ];

  const imageSource = device.photo ? device.photo : require('../../../assets/pitcher.jpg');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image source={imageSource} style={styles.photo} resizeMode="cover" />

        <Text style={styles.title}>{device.device_name}</Text>
        <Text style={styles.subtitle}>Device ID: {device.device_id}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plant</Text>
          <Text style={styles.sectionValue}>{device.species}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <Text style={styles.sectionValue}>{device.location.name}</Text>
          <Text style={styles.sectionMeta}>
            {device.location.latitude.toFixed(4)}, {device.location.longitude.toFixed(4)}
          </Text>
        </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sensor Readings</Text>
            <View style={styles.sensorGrid}>
              {sensorCards.map(({ key: sensorKey, ...cardProps }) => (
                <SensorCard key={sensorKey} {...cardProps} />
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={styles.historyButton}
            activeOpacity={0.85}
            onPress={() => setHistoryVisible(true)}
          >
            <Ionicons name="time-outline" size={18} color="#FFFFFF" />
            <Text style={styles.historyButtonText}>View Previous Data</Text>
          </TouchableOpacity>

        <Text style={styles.updatedText}>Last updated {formatDate(device.last_updated)}</Text>
      </ScrollView>

        <Modal
          visible={historyVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setHistoryVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Historical Sensor Data</Text>
                  <Text style={styles.modalSubtitle}>
                    Quick snapshot of recent trends. Hook up to real analytics when ready.
                  </Text>
                </View>
                <TouchableOpacity
                  accessibilityLabel="Close historical data view"
                  onPress={() => setHistoryVisible(false)}
                >
                  <Ionicons name="close" size={22} color="#0F172A" />
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={styles.historyList}>
                {historySeries.map((entry, index) => (
                  <View key={`${entry.timestamp}-${index}`} style={styles.historyEntry}>
                    <View style={styles.historyEntryHeader}>
                      <Ionicons name="calendar-outline" size={14} color="#1E3A8A" />
                      <Text style={styles.historyTimestamp}>{formatDate(entry.timestamp)}</Text>
                    </View>
                    <View style={styles.historyMetricsRow}>
                      <View style={[styles.historyMetricChip, styles.metricTemperature]}>
                        <Ionicons name="thermometer-outline" size={14} color="#B91C1C" />
                        <Text style={styles.historyMetricText}>{formatNumber(entry.temperature, 1)}°C</Text>
                      </View>
                      <View style={[styles.historyMetricChip, styles.metricHumidity]}>
                        <Ionicons name="water-outline" size={14} color="#0369A1" />
                        <Text style={styles.historyMetricText}>{formatNumber(entry.humidity, 0)}%</Text>
                      </View>
                      <View style={[styles.historyMetricChip, styles.metricSoil]}>
                        <Ionicons name="leaf-outline" size={14} color="#15803D" />
                        <Text style={styles.historyMetricText}>{formatNumber(entry.soil_moisture, 0)}%</Text>
                      </View>
                      <View style={[styles.historyMetricChip, styles.metricMotion, entry.motion_detected && styles.metricMotionActive]}>
                        <Ionicons
                          name={entry.motion_detected ? 'walk' : 'walk-outline'}
                          size={14}
                          color={entry.motion_detected ? '#1E40AF' : '#475569'}
                        />
                        <Text style={styles.historyMetricText}>{entry.motion_detected ? 'Motion' : 'No motion'}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>

              <View style={styles.modalFooter}>
                <Ionicons name="analytics-outline" size={16} color="#2563EB" />
                <Text style={styles.modalFooterText}>
                  Tip: integrate a chart kit (e.g. victory-native or react-native-chart-kit) once backend data streams are available.
                </Text>
              </View>
            </View>
          </View>
        </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F9F4',
  },
  content: {
    padding: 20,
    gap: 18,
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2A37',
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  sectionValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2A37',
  },
  sectionMeta: {
    fontSize: 12,
    color: '#6B7280',
  },
  sensorGrid: {
    gap: 12,
  },
  sensorCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    gap: 12,
  },
  sensorCardOk: {
    backgroundColor: '#ECFDF3',
    borderColor: '#BBF7D0',
  },
  sensorCardAlert: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  sensorCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sensorIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sensorIconOk: {
    backgroundColor: '#DCFCE7',
  },
  sensorIconAlert: {
    backgroundColor: '#FEE2E2',
  },
  sensorTitle: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  sensorTitleOk: {
    color: '#166534',
  },
  sensorTitleAlert: {
    color: '#991B1B',
  },
  sensorValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  sensorValueOk: {
    color: '#064E3B',
  },
  sensorValueAlert: {
    color: '#B91C1C',
  },
  sensorUnit: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 4,
    color: '#6B7280',
  },
  sensorHelper: {
    fontSize: 12,
  },
  sensorHelperOk: {
    color: '#15803D',
  },
  sensorHelperAlert: {
    color: '#B91C1C',
  },
  updatedText: {
    fontSize: 12,
    color: '#4B5563',
  },
  errorText: {
    fontSize: 14,
    color: '#B91C1C',
    textAlign: 'center',
    marginTop: 40,
  },
    historyButton: {
      marginTop: 4,
      alignSelf: 'stretch',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      paddingVertical: 12,
      borderRadius: 16,
      backgroundColor: '#2563EB',
      shadowColor: '#2563EB',
      shadowOpacity: 0.2,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 4,
    },
    historyButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
      letterSpacing: 0.2,
      textTransform: 'uppercase',
    },
    modalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(15, 23, 42, 0.45)',
      padding: 20,
      justifyContent: 'flex-end',
    },
    modalCard: {
      borderTopLeftRadius: 22,
      borderTopRightRadius: 22,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 28,
      backgroundColor: '#FFFFFF',
      gap: 18,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 16,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#0F172A',
    },
    modalSubtitle: {
      marginTop: 4,
      fontSize: 12,
      color: '#64748B',
      lineHeight: 18,
    },
    historyList: {
      gap: 14,
    },
    historyEntry: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#E2E8F0',
      padding: 14,
      backgroundColor: '#F9FAFB',
      gap: 10,
    },
    historyEntryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    historyTimestamp: {
      fontSize: 13,
      fontWeight: '600',
      color: '#1E293B',
    },
    historyMetricsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    historyMetricChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 12,
    },
    historyMetricText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#1F2937',
    },
    metricTemperature: {
      backgroundColor: '#FEE2E2',
    },
    metricHumidity: {
      backgroundColor: '#DBEAFE',
    },
    metricSoil: {
      backgroundColor: '#DCFCE7',
    },
    metricMotion: {
      backgroundColor: '#E2E8F0',
    },
    metricMotionActive: {
      backgroundColor: '#E0E7FF',
    },
    modalFooter: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      padding: 14,
      borderRadius: 16,
      backgroundColor: '#EEF2FF',
    },
    modalFooterText: {
      flex: 1,
      fontSize: 12,
      color: '#1E3A8A',
      lineHeight: 18,
    },
});
