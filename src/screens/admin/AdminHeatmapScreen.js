import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, Heatmap } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { ADMIN_ENDANGERED } from '../../navigation/routes';

const mockAdminObservations = [
  {
    observation_id: 'OBS-3011',
    user_id: 42,
    species: {
      species_id: 5,
      common_name: 'Rafflesia arnoldii',
      scientific_name: 'Rafflesia arnoldii',
      is_endangered: true,
    },
    location_latitude: 1.4667,
    location_longitude: 110.3333,
    location_name: 'Bako National Park',
    confidence_score: 0.35,
    is_masked: false,
  },
  {
    observation_id: 'OBS-2987',
    user_id: 51,
    species: {
      species_id: 9,
      common_name: 'Nepenthes rajah',
      scientific_name: 'Nepenthes rajah',
      is_endangered: true,
    },
    location_latitude: 1.595,
    location_longitude: 110.345,
    location_name: 'Santubong Forest Reserve',
    confidence_score: 0.62,
    is_masked: true,
  },
  {
    observation_id: 'OBS-2860',
    user_id: 17,
    species: {
      species_id: 14,
      common_name: 'Dendrobium anosmum',
      scientific_name: 'Dendrobium anosmum',
      is_endangered: false,
    },
    location_latitude: 1.522,
    location_longitude: 110.365,
    location_name: 'Semenggoh Nature Reserve',
    confidence_score: 0.81,
    is_masked: false,
  },
];

export default function AdminHeatmapScreen() {
  const [observations, setObservations] = useState(mockAdminObservations);
  const [viewMode, setViewMode] = useState('heatmap');
  const [selectedSpeciesId, setSelectedSpeciesId] = useState(null);
  const navigation = useNavigation();

  const endangeredList = useMemo(
    () => observations.filter((obs) => obs.species.is_endangered),
    [observations]
  );

  const filteredObservations = useMemo(
    () =>
      selectedSpeciesId
        ? observations.filter((obs) => obs.species.species_id === selectedSpeciesId)
        : [],
    [observations, selectedSpeciesId]
  );

  const points = useMemo(
    () =>
      filteredObservations.map((obs) => ({
        latitude: obs.location_latitude,
        longitude: obs.location_longitude,
        weight: obs.species.is_endangered ? 2 : 1,
      })),
    [filteredObservations]
  );

  const toggleMask = (observation_id) => {
    setObservations((prev) =>
      prev.map((item) =>
        item.observation_id === observation_id
          ? { ...item, is_masked: !item.is_masked }
          : item
      )
    );
  };

  const HEATMAP_RADIUS = Platform.OS === 'android' ? 40 : 60;
  const hasSelection = Boolean(selectedSpeciesId);
  const visibleForUser = hasSelection
    ? filteredObservations.some((obs) => !obs.is_masked)
    : true;

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Species Heatmap</Text>
          <Text style={styles.headerSubtitle}>Select a plant to view heatmap distribution.</Text>
        </View>

        <View style={styles.modeRow}>
          <TouchableOpacity
            onPress={() => setViewMode('heatmap')}
            style={[
              styles.modeButton,
              viewMode === 'heatmap' && styles.modeButtonActive,
              !hasSelection && styles.modeButtonDisabled,
            ]}
            disabled={!hasSelection}
          >
            <Ionicons
              name="flame-outline"
              size={16}
              color={!hasSelection ? '#A1A9B6' : viewMode === 'heatmap' ? '#0F4C81' : '#5A6A78'}
            />
            <Text
              style={[
                styles.modeButtonText,
                viewMode === 'heatmap' && styles.modeButtonTextActive,
                !hasSelection && styles.modeButtonTextDisabled,
              ]}
            >
              Heatmap
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setViewMode('markers')}
            style={[
              styles.modeButton,
              viewMode === 'markers' && styles.modeButtonActive,
              !hasSelection && styles.modeButtonDisabled,
            ]}
            disabled={!hasSelection}
          >
            <Ionicons
              name="location-outline"
              size={16}
              color={!hasSelection ? '#A1A9B6' : viewMode === 'markers' ? '#0F4C81' : '#5A6A78'}
            />
            <Text
              style={[
                styles.modeButtonText,
                viewMode === 'markers' && styles.modeButtonTextActive,
                !hasSelection && styles.modeButtonTextDisabled,
              ]}
            >
              Markers
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mapWrapper}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: 1.55,
              longitude: 110.35,
              latitudeDelta: 0.3,
              longitudeDelta: 0.3,
            }}
          >
            {hasSelection && viewMode === 'heatmap' && points.length > 0 && (
                <Heatmap
                  points={points}
                  radius={HEATMAP_RADIUS}
                  opacity={0.7}
                  gradient={{
                    colors: ['#ADFF2F', '#FFFF00', '#FF8C00', '#FF0000'],
                    startPoints: [0.01, 0.25, 0.5, 1],
                    colorMapSize: 256,
                  }}
                />
            )}

            {hasSelection && viewMode === 'markers' &&
              filteredObservations.map((obs) => (
                <Marker
                  key={obs.observation_id}
                  coordinate={{ latitude: obs.location_latitude, longitude: obs.location_longitude }}
                  title={obs.species.common_name}
                  description={obs.location_name}
                  pinColor="#1F5E92"
                />
              ))}
          </MapView>

          {hasSelection && (
            <View
              style={[
                styles.visibilityBadge,
                !visibleForUser && styles.visibilityBadgeBlocked,
              ]}
            >
              <Text
                style={[
                  styles.visibilityText,
                  !visibleForUser && styles.visibilityTextBlocked,
                ]}
              >
                {visibleForUser ? 'Visible for user' : 'Not visible for user'}
              </Text>
            </View>
          )}
        </View>

      <View style={styles.panel}>
        <View style={styles.panelHeader}>
          <Text style={styles.panelTitle}>Endangered Species Controls</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate(ADMIN_ENDANGERED)}
            style={styles.viewAllButton}
          >
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={endangeredList}
          keyExtractor={(item) => item.observation_id}
            renderItem={({ item }) => {
              const isSelected = selectedSpeciesId === item.species.species_id;
              return (
                <View style={[styles.listItem, isSelected && styles.listItemSelected]}>
                  <View style={styles.listItemInfo}>
                    <Text style={styles.speciesName}>{item.species.common_name}</Text>
                    <Text style={styles.metaText}>Observation {item.observation_id}</Text>
                    <Text style={styles.metaText}>{item.location_name}</Text>
                    <Text style={styles.metaText}>Confidence: {(item.confidence_score * 100).toFixed(0)}%</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.selectButton, isSelected && styles.selectButtonActive]}
                    onPress={() => setSelectedSpeciesId(isSelected ? null : item.species.species_id)}
                  >
                    <Text style={[styles.selectButtonText, isSelected && styles.selectButtonTextActive]}>
                      Select
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.maskButton, item.is_masked ? styles.masked : styles.unmasked]}
                    onPress={() => toggleMask(item.observation_id)}
                  >
                    <Ionicons
                      name={item.is_masked ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color={item.is_masked ? '#933d27' : '#0F4C81'}
                    />
                    <Text style={[styles.maskButtonText, item.is_masked ? styles.maskedText : styles.unmaskedText]}>
                      {item.is_masked ? 'Masked' : 'Visible'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F7F9FC' },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E3E8EE',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0F1C2E' },
  headerSubtitle: { fontSize: 12, color: '#5B6C7C', marginTop: 4 },
  modeRow: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E3E8EE',
    flexDirection: 'row',
    gap: 12,
  },
  modeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#EEF2F8',
    gap: 8,
  },
  modeButtonActive: { backgroundColor: '#D7E6F7' },
  modeButtonDisabled: { opacity: 0.7 },
  modeButtonText: { fontSize: 13, fontWeight: '600', color: '#5A6A78' },
  modeButtonTextActive: { color: '#0F4C81' },
  modeButtonTextDisabled: { color: '#A1A9B6' },
  mapWrapper: { flex: 1, position: 'relative' },
  map: { flex: 1 },
  visibilityBadge: {
    position: 'absolute',
    top: 16,
    alignSelf: 'center',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  visibilityBadgeBlocked: {
    backgroundColor: '#FEE2E2',
    shadowColor: '#B91C1C',
  },
  visibilityText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  visibilityTextBlocked: {
    color: '#B91C1C',
  },
  panel: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
    elevation: 6,
  },
  panelTitle: { fontSize: 16, fontWeight: '700', color: '#0F1C2E' },
  viewAllButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#EDF1F5',
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  listItemSelected: {
    backgroundColor: '#F0F6FF',
    borderRadius: 16,
    paddingHorizontal: 12,
  },
  listItemInfo: { flex: 1 },
  speciesName: { fontSize: 15, fontWeight: '600', color: '#0F1C2E' },
  metaText: { fontSize: 12, color: '#5A6A78', marginTop: 2 },
  selectButton: {
    marginRight: 12,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#E3ECF9',
  },
  selectButtonActive: {
    backgroundColor: '#1A54A5',
  },
  selectButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F4C81',
  },
  selectButtonTextActive: {
    color: '#FFFFFF',
  },
  maskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 14,
    gap: 6,
  },
  masked: { backgroundColor: '#FBE4DD' },
  unmasked: { backgroundColor: '#E3ECF9' },
  maskButtonText: { fontSize: 12, fontWeight: '600' },
  maskedText: { color: '#933d27' },
  unmaskedText: { color: '#0F4C81' },
  separator: { height: 1, backgroundColor: '#E8ECF2' },
});
