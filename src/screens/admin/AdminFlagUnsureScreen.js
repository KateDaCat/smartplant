import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ADMIN_FLAG_REVIEW } from '../../navigation/routes';

const MOCK_FLAGGED = [
  {
    observation_id: 'OBS-3011',
    plant_name: 'Unknown Nepenthes',
    confidence: 0.42,
    user: 'field.scout',
    submitted_at: '2025-10-12T10:12:00Z',
    location: 'Gunung Mulu, Sarawak',
    photo: require('../../../assets/pitcher.jpg'),
    is_endangered: true,
  },
  {
    observation_id: 'OBS-2987',
    plant_name: 'Rafflesia ?',
    confidence: 0.35,
    user: 'flora.lens',
    submitted_at: '2025-10-09T08:45:00Z',
    location: 'Mount Kinabalu, Sabah',
    photo: require('../../../assets/rafflesia.jpg'),
    is_endangered: true,
  },
  {
    observation_id: 'OBS-2979',
    plant_name: 'Pitcher Plant Candidate',
    confidence: 0.28,
    user: 'botany.lee',
    submitted_at: '2025-10-08T16:20:00Z',
    location: 'Fraser\'s Hill, Pahang',
    photo: require('../../../assets/pitcher.jpg'),
    is_endangered: true,
  },
];

const toPercent = (score) => `${Math.round(score * 100)}%`;

export default function AdminFlagUnsureScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Flag Unsure Queue</Text>
      <Text style={styles.headerSubtitle}>
        AI low-confidence identifications awaiting manual review.
      </Text>

      <FlatList
        data={MOCK_FLAGGED}
        keyExtractor={(item) => item.observation_id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.plantText}>{item.plant_name}</Text>
              <Text style={styles.confidenceChip}>{toPercent(item.confidence)}</Text>
            </View>
            <View style={styles.metaBlock}>
              <InfoRow label="Observation" value={item.observation_id} />
              <InfoRow label="Location" value={item.location} />
              <InfoRow label="Submitted" value={`${item.user} • ${formatDate(item.submitted_at)}`} />
            </View>
            <TouchableOpacity
              style={styles.reviewButton}
              onPress={() => navigation.navigate(ADMIN_FLAG_REVIEW, { observation: item })}
            >
              <Text style={styles.reviewText}>Review</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

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
    gap: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confidenceChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#EEF2FF',
    fontSize: 12,
    fontWeight: '600',
    color: '#1E40AF',
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
  metaBlock: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    width: 90,
  },
  infoValue: {
    fontSize: 12,
    color: '#1F2937',
    flex: 1,
  },
  reviewButton: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#4338CA',
  },
  reviewText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
