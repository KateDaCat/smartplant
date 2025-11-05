import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
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
    location_latitude: 1.6667,
    location_longitude: 110.4667,
    location_name: 'Bako National Park',
    confidence_score: 0.74,
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
    location_latitude: 1.7672,
    location_longitude: 110.3336,
    location_name: 'Santubong Forest Reserve',
    confidence_score: 0.68,
    is_masked: true,
  },
  {
    observation_id: 'OBS-2944',
    user_id: 63,
    species: {
      species_id: 12,
      common_name: 'Nepenthes lowii',
      scientific_name: 'Nepenthes lowii',
      is_endangered: true,
    },
    location_latitude: 6.075,
    location_longitude: 116.5588,
    location_name: 'Mount Kinabalu',
    confidence_score: 0.61,
    is_masked: false,
  },
  {
    observation_id: 'OBS-2921',
    user_id: 74,
    species: {
      species_id: 16,
      common_name: 'Vanda coerulea',
      scientific_name: 'Vanda coerulea',
      is_endangered: true,
    },
    location_latitude: 5.381,
    location_longitude: 116.1159,
    location_name: 'Crocker Range Park',
    confidence_score: 0.57,
    is_masked: false,
  },
  {
    observation_id: 'OBS-2899',
    user_id: 17,
    species: {
      species_id: 14,
      common_name: 'Dendrobium anosmum',
      scientific_name: 'Dendrobium anosmum',
      is_endangered: true,
    },
    location_latitude: 1.353,
    location_longitude: 110.315,
    location_name: 'Semenggoh Nature Reserve',
    confidence_score: 0.81,
    is_masked: false,
  },
  {
    observation_id: 'OBS-2885',
    user_id: 91,
    species: {
      species_id: 21,
      common_name: 'Nepenthes villosa',
      scientific_name: 'Nepenthes villosa',
      is_endangered: true,
    },
    location_latitude: 6.258,
    location_longitude: 116.658,
    location_name: 'Tambuyukon',
    confidence_score: 0.65,
    is_masked: true,
  },
  {
    observation_id: 'OBS-2850',
    user_id: 102,
    species: {
      species_id: 24,
      common_name: 'Paphiopedilum rothchildianum',
      scientific_name: 'Paphiopedilum rothchildianum',
      is_endangered: true,
    },
    location_latitude: 6.05,
    location_longitude: 116.6667,
    location_name: 'Mount Kinabalu',
    confidence_score: 0.54,
    is_masked: false,
  },
  {
    observation_id: 'OBS-2833',
    user_id: 118,
    species: {
      species_id: 28,
      common_name: 'Rafflesia keithii',
      scientific_name: 'Rafflesia keithii',
      is_endangered: true,
    },
    location_latitude: 6.05,
    location_longitude: 116.682,
    location_name: 'Poring Hot Springs',
    confidence_score: 0.6,
    is_masked: false,
  },
  {
    observation_id: 'OBS-2799',
    user_id: 133,
    species: {
      species_id: 33,
      common_name: 'Nepenthes bicalcarata',
      scientific_name: 'Nepenthes bicalcarata',
      is_endangered: true,
    },
    location_latitude: 4.05,
    location_longitude: 114.8,
    location_name: 'Gunung Mulu',
    confidence_score: 0.73,
    is_masked: false,
  },
  {
    observation_id: 'OBS-2764',
    user_id: 144,
    species: {
      species_id: 37,
      common_name: 'Dipterocarpus sarawakensis',
      scientific_name: 'Dipterocarpus sarawakensis',
      is_endangered: true,
    },
    location_latitude: 4.2,
    location_longitude: 114.03,
    location_name: 'Lambir Hills',
    confidence_score: 0.66,
    is_masked: false,
  },
  {
    observation_id: 'OBS-2720',
    user_id: 155,
    species: {
      species_id: 40,
      common_name: 'Hopea beccariana',
      scientific_name: 'Hopea beccariana',
      is_endangered: true,
    },
    location_latitude: 1.2,
    location_longitude: 111.9,
    location_name: 'Batang Ai National Park',
    confidence_score: 0.49,
    is_masked: false,
  },
  {
    observation_id: 'OBS-2698',
    user_id: 166,
    species: {
      species_id: 44,
      common_name: 'Nepenthes truncata',
      scientific_name: 'Nepenthes truncata',
      is_endangered: true,
    },
    location_latitude: 4.93,
    location_longitude: 117.75,
    location_name: 'Danum Valley',
    confidence_score: 0.58,
    is_masked: false,
  },
];

export default function AdminHeatmapScreen() {
  const [observations, setObservations] = useState(mockAdminObservations);
  const [viewMode, setViewMode] = useState('heatmap');
  const [selectedSpeciesId, setSelectedSpeciesId] = useState(null);
  const [focusedObservationId, setFocusedObservationId] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const mapRef = useRef(null);

  const endangeredList = useMemo(() => {
    const endangered = observations.filter((obs) => obs.species.is_endangered);
    if (!selectedSpeciesId) {
      return endangered;
    }
    return endangered
      .slice()
      .sort((a, b) => {
        if (a.species.species_id === selectedSpeciesId) return -1;
        if (b.species.species_id === selectedSpeciesId) return 1;
        return 0;
      });
  }, [observations, selectedSpeciesId]);

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

  const routeSelectedSpeciesId = route?.params?.selectedSpeciesId;
  const routeFocusObservationId = route?.params?.focusObservationId;

  useEffect(() => {
    if (routeSelectedSpeciesId && routeSelectedSpeciesId !== selectedSpeciesId) {
      setSelectedSpeciesId(routeSelectedSpeciesId);
      setFocusedObservationId(routeFocusObservationId ?? null);
      setViewMode('heatmap');
    } else if (!routeSelectedSpeciesId && routeFocusObservationId) {
      setFocusedObservationId(routeFocusObservationId);
    }
  }, [routeSelectedSpeciesId, routeFocusObservationId, selectedSpeciesId]);

  useEffect(() => {
    if (!hasSelection || filteredObservations.length === 0 || !mapRef.current) {
      return;
    }

    const targetObservation =
      (focusedObservationId &&
        filteredObservations.find((obs) => obs.observation_id === focusedObservationId)) ||
      filteredObservations[0];

    if (targetObservation) {
      mapRef.current.animateToRegion(
        {
          latitude: targetObservation.location_latitude,
          longitude: targetObservation.location_longitude,
          latitudeDelta: 0.25,
          longitudeDelta: 0.25,
        },
        600
      );
    }
  }, [hasSelection, filteredObservations, focusedObservationId]);

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
            ref={mapRef}
            style={styles.map}
            initialRegion={{
            latitude: 2.5,
            longitude: 113.5,
            latitudeDelta: 12,
            longitudeDelta: 12,
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
                  onPress={() => {
                    if (isSelected) {
                      setSelectedSpeciesId(null);
                      setFocusedObservationId(null);
                    } else {
                      setSelectedSpeciesId(item.species.species_id);
                      setFocusedObservationId(item.observation_id);
                      setViewMode('heatmap');
                    }
                  }}
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
