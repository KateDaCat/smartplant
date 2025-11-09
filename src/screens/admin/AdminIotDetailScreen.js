import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryScatter,
} from 'victory-native';

const formatDate = (iso) => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleString();
};

const formatTime = (iso) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '--';
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

  const formatMetricValue = (val, digits, unit) => {
    if (typeof val !== 'number' || Number.isNaN(val)) return '--';
    return `${formatNumber(val, digits)}${unit}`;
  };

  const chartMetrics = useMemo(() => {
    const configs = [
      {
        key: 'temperature',
        label: 'Temperature',
        unit: '°C',
        color: '#F97316',
        digits: 1,
        getValue: (entry) => entry.temperature,
      },
      {
        key: 'humidity',
        label: 'Humidity',
        unit: '%',
        color: '#0EA5E9',
        digits: 0,
        getValue: (entry) => entry.humidity,
      },
      {
        key: 'soil',
        label: 'Soil Moisture',
        unit: '%',
        color: '#22C55E',
        digits: 0,
        getValue: (entry) => entry.soil_moisture,
      },
    ];

    return configs.map((config) => {
      const points = historySeries.reduce((acc, entry, index) => {
        const raw = config.getValue(entry);
        if (typeof raw === 'number' && !Number.isNaN(raw)) {
          acc.push({
            key: `${config.key}-${index}`,
            raw,
            timestamp: entry.timestamp,
            index: index + 1,
            label: formatTime(entry.timestamp),
          });
        }
        return acc;
      }, []);

      const values = points.map((point) => point.raw);
      const min = values.length > 0 ? Math.min(...values) : null;
      const max = values.length > 0 ? Math.max(...values) : null;
      const span = min !== null && max !== null ? max - min : null;
      const padding = span !== null && span !== 0 ? span * 0.2 : 1;
      const domain =
        min !== null && max !== null
          ? { min: min - padding, max: max + padding }
          : { min: 0, max: 1 };

      return {
        ...config,
        min,
        max,
        domain,
        data: points.map((point) => ({
          x: point.index,
          y: point.raw,
          label: point.label,
        })),
        ticks: points.map((point) => ({
          value: point.index,
          label: point.label,
        })),
        latest: points.length > 0 ? points[points.length - 1].raw : null,
      };
    });
  }, [historySeries]);

  const motionTimeline = useMemo(
    () =>
      historySeries.map((entry, index) => ({
        key: `motion-${index}`,
        timestamp: entry.timestamp,
        detected: Boolean(entry.motion_detected),
      })),
    [historySeries]
  );

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

              <ScrollView contentContainerStyle={styles.chartList}>
                {chartMetrics.map((metric) => {
                  const latestLabel = metric.latest !== null
                    ? formatMetricValue(metric.latest, metric.digits, metric.unit)
                    : 'No data yet';
                  const peakLabel = formatMetricValue(metric.max, metric.digits, metric.unit);
                  const lowLabel = formatMetricValue(metric.min, metric.digits, metric.unit);
                  const tickValues =
                    metric.ticks.length > 4
                      ? metric.ticks
                          .filter((_, index, arr) =>
                            index === 0 ||
                            index === arr.length - 1 ||
                            index === Math.floor(arr.length / 2)
                          )
                          .map((tick) => tick.value)
                      : metric.ticks.map((tick) => tick.value);
                  const labelForTick = (value) => {
                    const tick = metric.ticks.find((item) => item.value === value);
                    return tick ? tick.label : value;
                  };

                  return (
                    <View key={metric.key} style={styles.chartCard}>
                      <View style={styles.chartHeader}>
                        <View style={[styles.chartLegendDot, { backgroundColor: metric.color }]} />
                        <View style={styles.chartHeaderText}>
                          <Text style={styles.chartTitle}>{metric.label}</Text>
                          <Text style={styles.chartSubtitle}>Latest {latestLabel}</Text>
                        </View>
                      </View>
                      <Text style={styles.chartRange}>
                        Peak {peakLabel} • Low {lowLabel}
                      </Text>
                        {metric.data.length > 0 ? (
                        <VictoryChart
                          height={220}
                          padding={{ top: 18, bottom: 54, left: 54, right: 20 }}
                          domain={{ y: [metric.domain.min, metric.domain.max] }}
                        >
                          <VictoryAxis
                            dependentAxis
                            style={{
                              axis: { stroke: '#E2E8F0' },
                              grid: { stroke: '#E2E8F0', strokeDasharray: '4,6' },
                              tickLabels: { fontSize: 11, fill: '#475467' },
                            }}
                            tickFormat={(value) => formatNumber(value, metric.digits)}
                          />
                          <VictoryAxis
                            tickValues={tickValues}
                            tickFormat={labelForTick}
                            style={{
                              axis: { stroke: '#E2E8F0' },
                              tickLabels: {
                                fontSize: 10,
                                fill: '#64748B',
                                angle: -35,
                                padding: 18,
                                textAnchor: 'end',
                              },
                              grid: { stroke: 'transparent' },
                            }}
                          />
                          <VictoryArea
                            data={metric.data}
                            interpolation="monotoneX"
                            style={{
                              data: {
                                fill: `${metric.color}22`,
                                stroke: 'transparent',
                              },
                            }}
                          />
                          <VictoryLine
                            data={metric.data}
                            interpolation="monotoneX"
                            style={{
                              data: {
                                stroke: metric.color,
                                strokeWidth: 2,
                              },
                            }}
                          />
                          <VictoryScatter
                            data={metric.data}
                            size={3.5}
                            style={{
                              data: { fill: metric.color },
                            }}
                          />
                        </VictoryChart>
                      ) : (
                        <Text style={styles.chartEmpty}>Not enough readings to chart yet.</Text>
                      )}
                    </View>
                  );
                })}

                {motionTimeline.length > 0 && (
                  <View style={styles.motionSection}>
                    <Text style={styles.motionTitle}>Motion detections</Text>
                    <View style={styles.motionChips}>
                      {motionTimeline.map((slot) => (
                        <View
                          key={slot.key}
                          style={[
                            styles.motionChip,
                            slot.detected ? styles.motionChipActive : styles.motionChipMuted,
                          ]}
                        >
                          <Ionicons
                            name={slot.detected ? 'walk' : 'walk-outline'}
                            size={14}
                            color={slot.detected ? '#1E3A8A' : '#94A3B8'}
                          />
                          <Text style={styles.motionChipText}>{formatTime(slot.timestamp)}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </ScrollView>

                <View style={styles.modalFooter}>
                  <Ionicons name="analytics-outline" size={16} color="#2563EB" />
                  <Text style={styles.modalFooterText}>
                    Tip: hook these Victory charts up to your real telemetry API once the backend endpoints are live.
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
      alignItems: 'center',
      justifyContent: 'center',
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
    chartList: {
      paddingBottom: 12,
      gap: 16,
    },
    chartCard: {
      borderRadius: 18,
      borderWidth: 1,
      borderColor: '#E2E8F0',
      backgroundColor: '#F8FBFF',
      padding: 16,
      gap: 12,
      shadowColor: '#000',
      shadowOpacity: 0.03,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    chartHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    chartLegendDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    chartHeaderText: {
      flex: 1,
      gap: 2,
    },
    chartTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: '#0F172A',
    },
    chartSubtitle: {
      fontSize: 12,
      color: '#475467',
    },
    chartRange: {
      fontSize: 12,
      color: '#5B6C7C',
    },
    chartEmpty: {
      paddingVertical: 36,
      textAlign: 'center',
      fontSize: 12,
      color: '#64748B',
    },
    motionSection: {
      marginTop: 8,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: '#E2E8F0',
      backgroundColor: '#FFFFFF',
      padding: 16,
      gap: 12,
    },
    motionTitle: {
      fontSize: 12,
      fontWeight: '700',
      color: '#0F172A',
      textTransform: 'uppercase',
      letterSpacing: 0.6,
    },
    motionChips: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    motionChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
    },
    motionChipActive: {
      backgroundColor: '#EEF2FF',
      borderColor: '#C7D2FE',
    },
    motionChipMuted: {
      backgroundColor: '#F1F5F9',
      borderColor: '#E2E8F0',
    },
    motionChipText: {
      fontSize: 12,
      fontWeight: '600',
      color: '#334155',
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
