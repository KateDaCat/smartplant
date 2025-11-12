import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ADMIN_IOT_DETAIL } from '../../navigation/routes';
import { fetchAllDeviceData, resolveAlertsForDevice } from '../../../services/api';

export default function AdminIotScreen() {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [newDeviceForm, setNewDeviceForm] = useState(() => ({
    deviceId: '',
    plantSpecies: '',
    plantName: '',
    latitude: '',
    longitude: '',
    locationName: '',
  }));
  const [iotDevices, setIotDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setError(null);
      const deviceData = await fetchAllDeviceData();
      setIotDevices(deviceData || []);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load dashboard data');
    }
  };

  useEffect(() => {
    const initialLoad = async () => {
      setLoading(true);
      await loadData();
      setLoading(false);
    };
    initialLoad();

    const intervalId = setInterval(loadData, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleResolveDeviceAlerts = async deviceId => {
    try {
      await resolveAlertsForDevice(deviceId);
      await loadData();
    } catch (err) {
      console.error('Failed to resolve alert:', err);
    }
  };

  const resetForm = () =>
    setNewDeviceForm({
      deviceId: '',
      plantSpecies: '',
      plantName: '',
      latitude: '',
      longitude: '',
      locationName: '',
    });

  const openAddModal = () => {
    resetForm();
    setAddModalVisible(true);
  };
  const closeAddModal = () => setAddModalVisible(false);

  const handleFormChange = (key, value) =>
    setNewDeviceForm(prev => ({
      ...prev,
      [key]: value,
    }));

  const handleSubmitNewDevice = () => {
    const deviceLabel = newDeviceForm.deviceId.trim() || 'New device';
    Alert.alert(
      'Confirm new device',
      `Confirm to add the device ${deviceLabel}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Confirm',
          style: 'default',
          onPress: () => {
            closeAddModal();
            Alert.alert('Success', `${deviceLabel} is added in IoT Monitor.`);
          },
        },
      ],
      {cancelable: true},
    );
  };

    const filteredDevices = useMemo(() => {
      const normalizedQuery = searchQuery.trim().toLowerCase();
      const list = Array.isArray(iotDevices) ? [...iotDevices] : [];

      return list
        .filter(device => {
          if (!normalizedQuery) return true;
          const haystack = [
            device.device_name,
            device.device_id,
            device.species_name,
            device.species,
            device.location?.name,
          ]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();

          return haystack.includes(normalizedQuery);
        })
        .sort((a, b) => (a.device_name || '').localeCompare(b.device_name || ''));
    }, [searchQuery, iotDevices]);

  const alertDevices = useMemo(
    () =>
      filteredDevices.filter(device => {
        if (!device) return false;
        return Array.isArray(device.alerts) ? device.alerts.length > 0 : Boolean(device.alerts);
      }),
    [filteredDevices],
  );
  const normalDevices = useMemo(
    () =>
      filteredDevices.filter(device => {
        if (!device) return false;
        return Array.isArray(device.alerts) ? device.alerts.length === 0 : !device.alerts;
      }),
    [filteredDevices],
  );
  const noMatches = filteredDevices.length === 0;

  const renderDeviceRow = (item, isAlert = false) => {
    const speciesLabel = item.species_name || item.species || 'N/A';
    const locationLabel =
      item.location?.name || item.location_name || item.region || 'Unknown location';
    const alertsText = Array.isArray(item.alerts)
      ? item.alerts.join(', ')
      : item.alerts || '—';
    const resolveId = item.device_id_raw ?? item.device_id;

    return (
      <View style={[styles.row, isAlert && styles.alertRow]} key={item.device_id}>
        <View style={styles.cellWide}>
          <Text style={[styles.plantText, isAlert && styles.alertPlantText]}>{speciesLabel}</Text>
          <Text style={[styles.metaText, isAlert && styles.alertMetaText]}>{locationLabel}</Text>
          {isAlert && <Text style={styles.alertDetailText}>Alerts: {alertsText}</Text>}
        </View>
        <Text style={[styles.cell, isAlert && styles.alertCellText]}>{item.device_id}</Text>
        <View style={styles.cellAction}>
          {isAlert && (
            <TouchableOpacity
              style={styles.resolveButton}
              onPress={() => handleResolveDeviceAlerts(resolveId)}
            >
              <Text style={styles.resolveButtonText}>Resolve</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => navigation.navigate(ADMIN_IOT_DETAIL, { device: item })}
          >
            <Text style={styles.viewText}>View</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#1E88E5" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>IoT Monitoring</Text>
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by device, plant, or location"
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
              accessibilityLabel="Clear search"
            >
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={openAddModal}
          accessibilityRole="button"
          accessibilityLabel="Add IoT device"
        >
          <Ionicons name="add" size={30} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#1E88E5']}
            tintColor="#1E88E5"
          />
        }
      >
        {noMatches ? (
          <View style={[styles.table, styles.emptyCard]}>
            <Ionicons name="hardware-chip-outline" size={24} color="#94A3B8" />
            <Text style={styles.emptyCardTitle}>No devices found</Text>
            <Text style={styles.emptyCardSubtitle}>
              Try a different search term or clear the filter.
            </Text>
          </View>
        ) : (
          <View style={styles.sectionStack}>
            {alertDevices.length > 0 && (
              <View style={[styles.table, styles.alertTable, styles.sectionItem]}>
                <View style={[styles.row, styles.headerRow, styles.alertHeaderRow]}>
                  <Text style={[styles.cellWide, styles.headerText, styles.alertHeaderText]}>
                    Plant
                  </Text>
                  <Text style={[styles.cell, styles.headerText, styles.alertHeaderText]}>
                    Device ID
                  </Text>
                  <Text style={[styles.cellActionHeader, styles.headerText, styles.alertHeaderText]}>
                    Action
                  </Text>
                </View>
                {alertDevices.map(item => renderDeviceRow(item, true))}
              </View>
            )}

            <View style={[styles.table, alertDevices.length > 0 && styles.tableSpacing]}>
              <View style={[styles.row, styles.headerRow]}>
                <Text style={[styles.cellWide, styles.headerText]}>Plant</Text>
                <Text style={[styles.cell, styles.headerText]}>Device ID</Text>
                <Text style={[styles.cellActionHeader, styles.headerText]}>Action</Text>
              </View>

              <FlatList
                data={normalDevices}
                keyExtractor={item => item.device_id}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                renderItem={({ item }) => renderDeviceRow(item)}
                scrollEnabled={false}
                ListEmptyComponent={() => (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>
                      {alertDevices.length > 0
                        ? 'All matching devices are currently in alert state.'
                        : 'No non-alert devices match your search.'}
                    </Text>
                  </View>
                )}
              />
            </View>
          </View>
        )}
      </ScrollView>

      <Modal
        transparent
        animationType="fade"
        visible={isAddModalVisible}
        onRequestClose={closeAddModal}
      >
        <Pressable style={styles.modalBackdrop} onPress={closeAddModal}>
          <Pressable style={styles.modalCard} onPress={event => event.stopPropagation()}>
            <Text style={styles.modalTitle}>Add IoT Device</Text>
            <Text style={styles.modalSubtitle}>
              Provide the device details so admins can monitor the new sensor in real time.
            </Text>
            <ScrollView
              contentContainerStyle={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              <FormField
                label="Device ID"
                value={newDeviceForm.deviceId}
                placeholder="e.g. DEV-901"
                onChangeText={value => handleFormChange('deviceId', value)}
              />
              <FormField
                label="Plant Species"
                value={newDeviceForm.plantSpecies}
                placeholder="e.g. Nepenthes rafflesiana"
                onChangeText={value => handleFormChange('plantSpecies', value)}
              />
              <FormField
                label="Plant Name"
                value={newDeviceForm.plantName}
                placeholder="Common name (optional)"
                onChangeText={value => handleFormChange('plantName', value)}
              />
              <View style={styles.modalRow}>
                <FormField
                  label="Latitude"
                  value={newDeviceForm.latitude}
                  placeholder="e.g. 1.3521"
                  keyboardType="numeric"
                  onChangeText={value => handleFormChange('latitude', value)}
                  containerStyle={styles.modalRowItem}
                />
                <FormField
                  label="Longitude"
                  value={newDeviceForm.longitude}
                  placeholder="e.g. 103.8198"
                  keyboardType="numeric"
                  onChangeText={value => handleFormChange('longitude', value)}
                  containerStyle={styles.modalRowItem}
                />
              </View>
              <FormField
                label="Location"
                value={newDeviceForm.locationName}
                placeholder="Location description"
                onChangeText={value => handleFormChange('locationName', value)}
              />
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancel]}
                onPress={closeAddModal}
              >
                <Text style={[styles.modalButtonText, styles.modalCancelText]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalPrimary]}
                onPress={handleSubmitNewDevice}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  containerStyle,
}) {
  return (
    <View style={[styles.fieldContainer, containerStyle]}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={styles.fieldInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F9F4',
    padding: 20,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 32,
  },
  sectionStack: {
    flexDirection: 'column',
  },
  sectionItem: {
    marginBottom: 16,
  },
  tableSpacing: {
    marginTop: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2A37',
  },
  table: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  alertTable: {
    marginBottom: 16,
    borderColor: '#FECACA',
    backgroundColor: '#FFF1F2',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  headerRow: {
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  alertHeaderRow: {
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
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
    flex: 1.6,
  },
  cellActionHeader: {
    width: 120,
    textAlign: 'center',
  },
  cellAction: {
    width: 120,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
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
  alertRow: {
    backgroundColor: '#FFE4E6',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#FCA5A5',
  },
  alertPlantText: {
    color: '#7F1D1D',
  },
  alertMetaText: {
    color: '#B91C1C',
  },
  alertCellText: {
    color: '#7F1D1D',
  },
  alertHeaderText: {
    color: '#7F1D1D',
  },
  alertDetailText: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '600',
    color: '#B91C1C',
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
    resolveButton: {
      backgroundColor: '#D1FAE5',
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 12,
    },
    resolveButtonText: {
      color: '#065F46',
      fontSize: 12,
      fontWeight: '600',
    },
  listContent: {
    paddingBottom: 32,
  },
  emptyState: {
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  emptyStateText: {
    fontSize: 13,
    color: '#475467',
    textAlign: 'center',
  },
  searchWrapper: {
    marginTop: 18,
    marginBottom: 16,
    position: 'relative',
    alignItems: 'flex-end',
  },
  searchBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  addButton: {
    position: 'absolute',
    right: 6,
    top: -60,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#0F172A',
  },
  clearButton: {
    padding: 4,
  },
  emptyCard: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 10,
  },
  emptyCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  emptyCardSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    gap: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#475467',
    lineHeight: 18,
  },
  modalContent: {
    gap: 14,
    paddingBottom: 4,
  },
  modalRow: {
    flexDirection: 'row',
    gap: 12,
  },
  modalRowItem: {
    flex: 1,
  },
  fieldContainer: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1F2937',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  fieldInput: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D0D5DD',
    paddingHorizontal: 14,
    backgroundColor: '#F8FAFC',
    fontSize: 14,
    color: '#0F172A',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
  },
  modalCancel: {
    backgroundColor: '#E2E8F0',
  },
  modalPrimary: {
    backgroundColor: '#2563EB',
  },
  modalButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalCancelText: {
    color: '#1F2937',
  },
});
