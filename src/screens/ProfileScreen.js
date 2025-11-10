// src/screens/ProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

// ⬇️ NEW: import mock data from a single place
import { MOCK_POSTS, mockUser } from '../data/mockPlants';

function fmt(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default function ProfileScreen() {
  const nav = useNavigation();
  const insets = useSafeAreaInsets();

  const [plants] = useState(MOCK_POSTS);
  const hasPosts = plants.length > 0;
  const user = mockUser;

  const renderItem = ({ item }) => {
    // Accept either remote URL (string) or local require()
    const imgSource =
      typeof item.photoUri === 'string' ? { uri: item.photoUri } : item.photoUri;

    return (
        <Pressable
          onPress={() =>
            nav.navigate('ObservationDetail', {
              id: item.id,
              speciesName: item.speciesName,
              scientificName: item.scientificName,
              commonName: item.commonName,
              isEndangered: item.isEndangered,
              photoUri: item.photoUri,
              createdAt: item.createdAt,
              confidence: item.confidence,
              region: item.region,
              locationName: item.locationName,
              latitude: item.latitude,
              longitude: item.longitude,
              notes: item.notes,
              uploadedBy: item.uploadedBy,
              source: item.source,
            })
          }
          style={s.card}
          android_ripple={{ color: '#00000014' }}
        >
          <Image source={imgSource} style={s.cardImage} />

          <View style={s.cardBody}>
            <Text numberOfLines={1} style={s.cardTitle}>
              {item.speciesName || item.commonName || 'Unknown species'}
            </Text>
            <Text style={s.cardSub}>
              {item.locationName ? item.locationName : 'Location not recorded'}
            </Text>
            <Text style={s.cardMeta}>{fmt(item.createdAt)}</Text>
          </View>
        </Pressable>
    );
  };

  return (
    <SafeAreaView style={s.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 12 }]}>
        <View style={s.headerRow}>
          <View style={s.profileInfo}>
            <Image source={{ uri: user.avatar }} style={s.avatar} />
            <View>
              <Text style={s.name}>{user.username}</Text>
              <Text style={s.uid}>UID: {user.uid}</Text>
            </View>
          </View>
          <Pressable
            style={s.settingsButton}
            onPress={() => nav.navigate('Settings')}
            accessibilityRole="button"
          >
            <Ionicons name="settings-outline" size={22} color="#1F2A37" />
          </Pressable>
        </View>

        <View style={s.statsContainer}>
          <View style={s.statBlock}>
            <Text style={s.statLabel}>Plants</Text>
            <Text style={s.statValue}>{plants.length}</Text>
          </View>
        </View>
      </View>

      <Text style={s.sectionTitle}>My Plants</Text>

      {hasPosts ? (
        <FlatList
          data={plants}
          keyExtractor={(it) => it.id}
          renderItem={renderItem}
          contentContainerStyle={s.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={s.emptyWrap}>
          <Text style={s.emptyText}>No plants yet</Text>
          <Text style={s.emptySub}>Capture or upload a plant to see it here.</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F9F4' },

  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#F6F9F4',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatar: {
    width: 86, height: 86, borderRadius: 43,
    borderWidth: 3, borderColor: '#fff',
    backgroundColor: '#E5E7EB',
  },
  settingsButton: {
    padding: 10,
    borderRadius: 999,
    backgroundColor: '#E5ECF3',
  },
  name: { fontSize: 20, fontWeight: 'bold', color: '#244332' },
  uid: { color: '#2E6A4C', marginTop: 2, opacity: 0.9 },

  statsContainer: {
    marginTop: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DCE9DE',
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  statBlock: {
    alignItems: 'center',
  },
  statLabel: { fontSize: 12, fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.6 },
  statValue: { fontSize: 24, fontWeight: '800', color: '#244332', marginTop: 6 },

  sectionTitle: {
    marginTop: 18,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: '800',
    color: '#335a44',
  },

  listContent: { paddingHorizontal: 0, paddingBottom: 28, paddingTop: 4 },

  card: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    gap: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  cardImage: {
    width: 88,
    height: 88,
    borderRadius: 14,
    backgroundColor: '#D1D5DB',
  },
  cardBody: { flex: 1, gap: 8, justifyContent: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '800', color: '#1F2937' },
  cardSub: { color: '#334155', fontSize: 13, fontWeight: '600' },
  cardMeta: { color: '#64748B', fontSize: 12.5 },

  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 18, fontWeight: '800', color: '#2b2b2b' },
  emptySub: { marginTop: 6, color: '#666' },
});
