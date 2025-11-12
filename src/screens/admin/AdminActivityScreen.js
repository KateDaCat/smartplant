import React, { useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TYPE_META = {
  device_add: {
    icon: 'hardware-chip-outline',
    tint: '#2563EB',
    bg: '#DBEAFE',
  },
  device_update: {
    icon: 'construct-outline',
    tint: '#7C3AED',
    bg: '#EDE9FE',
  },
  alert_resolve: {
    icon: 'checkmark-done-outline',
    tint: '#059669',
    bg: '#DCFCE7',
  },
  user_deactivate: {
    icon: 'person-remove-outline',
    tint: '#DC2626',
    bg: '#FEE2E2',
  },
  user_activate: {
    icon: 'person-add-outline',
    tint: '#0EA5E9',
    bg: '#E0F2FE',
  },
  default: {
    icon: 'information-circle-outline',
    tint: '#334155',
    bg: '#E2E8F0',
  },
};

const MOCK_ACTIVITY = [
  {
    id: 'act_008',
    actor: 'Sherlyn Lau',
    type: 'device_add',
    action: 'added device',
    target: 'DEV-909 · Forest Edge Sensor',
    comment: 'Created for new observation zone at Jerantut reserve.',
    createdAt: '2025-11-10T10:15:00Z',
  },
  {
    id: 'act_007',
    actor: 'Ranger Amir',
    type: 'alert_resolve',
    action: 'resolved alert',
    target: 'DEV-512B · Bog Microclimate Station',
    comment: 'Humidity stabilised after on-site valve adjustment.',
    createdAt: '2025-11-10T09:52:00Z',
  },
  {
    id: 'act_006',
    actor: 'Admin Lee',
    type: 'user_deactivate',
    action: 'deactivated user',
    target: 'kelly.then@example.com',
    comment: 'Account suspended after duplicate upload review.',
    createdAt: '2025-11-10T09:20:00Z',
  },
  {
    id: 'act_005',
    actor: 'Sherlyn Lau',
    type: 'device_update',
    action: 'updated device profile',
    target: 'DEV-001 · Soil Monitor A1',
    comment: 'Adjusted safe soil moisture threshold to 28%.',
    createdAt: '2025-11-10T08:05:00Z',
  },
  {
    id: 'act_004',
    actor: 'Ranger Amir',
    type: 'alert_resolve',
    action: 'resolved alert',
    target: 'DEV-409A · Rainforest Edge Camera',
    comment: 'Cleared false motion detection after maintenance check.',
    createdAt: '2025-11-09T19:40:00Z',
  },
  {
    id: 'act_003',
    actor: 'Admin Lee',
    type: 'user_activate',
    action: 'reactivated user',
    target: 'bianca.doe@example.com',
    comment: 'Re-activated following manual verification.',
    createdAt: '2025-11-09T17:18:00Z',
  },
  {
    id: 'act_002',
    actor: 'Sherlyn Lau',
    type: 'device_add',
    action: 'added device',
    target: 'DEV-905 · Canopy Thermal Sensor',
    comment: 'Requested by Kuala Penyu field crew.',
    createdAt: '2025-11-09T13:32:00Z',
  },
  {
    id: 'act_001',
    actor: 'Admin Lee',
    type: 'device_update',
    action: 'edited device metadata',
    target: 'DEV-014 · Weather Station B3',
    comment: 'Updated location details after GPS recalibration.',
    createdAt: '2025-11-09T10:05:00Z',
  },
];

const TIME_LABELS = [
  { limit: 60, format: secs => `${Math.max(1, Math.round(secs))}s ago` },
  { limit: 60 * 60, format: secs => `${Math.round(secs / 60)}m ago` },
  { limit: 60 * 60 * 24, format: secs => `${Math.round(secs / 3600)}h ago` },
];

function formatRelativeTime(iso) {
  try {
    const target = new Date(iso);
    const now = new Date();
    const diffInSeconds = (now.getTime() - target.getTime()) / 1000;

    for (const { limit, format } of TIME_LABELS) {
      if (diffInSeconds < limit) return format(diffInSeconds);
    }

    return target.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

const FILTER_TABS = [
  { key: 'all', label: 'All' },
  { key: 'device', label: 'Devices' },
  { key: 'alerts', label: 'Alerts' },
  { key: 'users', label: 'Users' },
];

const typeToCategory = type => {
  switch (type) {
    case 'device_add':
    case 'device_update':
      return 'device';
    case 'alert_resolve':
      return 'alerts';
    case 'user_activate':
    case 'user_deactivate':
      return 'users';
    default:
      return 'all';
  }
};

function ActivityItem({ entry }) {
  const meta = TYPE_META[entry.type] ?? TYPE_META.default;
  return (
      <View style={styles.activityCard}>
        <View style={styles.activityBody}>
        <View style={styles.activityHeader}>
          <Text style={styles.activityActor}>{entry.actor}</Text>
          <Text style={styles.activityTime}>{formatRelativeTime(entry.createdAt)}</Text>
        </View>
        <Text style={styles.activitySentence}>
          {entry.actor
            ? `${entry.actor.split(' ')[0]} ${entry.action}`
            : entry.action}{' '}
          <Text style={styles.activityTarget}>{entry.target}</Text>
        </Text>
      </View>
    </View>
  );
}

export default function AdminActivityScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('all');

  const results = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return MOCK_ACTIVITY.filter(entry => {
      const matchesFilter =
        filterTab === 'all' || typeToCategory(entry.type) === filterTab;

      if (!matchesFilter) return false;

      if (!normalizedQuery) return true;

      const haystack = [
        entry.actor,
        entry.action,
        entry.target,
        entry.comment,
        entry.type,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [searchQuery, filterTab]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerTitle}>Activity Feed</Text>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={16} color="#64748B" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search activity or comments"
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}
            accessibilityLabel="Clear search"
          >
            <Ionicons name="close-circle" size={18} color="#94A3B8" />
          </Pressable>
        )}
      </View>

      <View style={styles.filterRow}>
        {FILTER_TABS.map(tab => {
          const active = tab.key === filterTab;
          return (
            <Pressable
              key={tab.key}
              onPress={() => setFilterTab(tab.key)}
              style={[styles.filterChip, active && styles.filterChipActive]}
            >
              <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <FlatList
        data={results}
        keyExtractor={item => item.id}
        contentContainerStyle={results.length === 0 ? styles.emptyStateWrapper : styles.listContent}
        renderItem={({ item }) => <ActivityItem entry={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <View style={styles.emptyStateCard}>
            <Ionicons name="calendar-outline" size={28} color="#94A3B8" />
            <Text style={styles.emptyStateTitle}>No matching activity</Text>
            <Text style={styles.emptyStateSubtitle}>
              Try a different search term or switch filters to see more history.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FC',
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },
  searchBar: {
    marginTop: 20,
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
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  clearButton: {
    padding: 4,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#1E88E5',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 32,
    gap: 12,
  },
  activityCard: {
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  activityBody: {
    gap: 6,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  activityActor: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  activityTime: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  activitySentence: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
  },
  activityTarget: {
    fontWeight: '600',
    color: '#0F172A',
  },
  emptyStateWrapper: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  emptyStateSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
});
