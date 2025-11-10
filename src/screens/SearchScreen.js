import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

import {MOCK_POSTS} from '../data/mockPlants';

const CONFIDENCE_OPTIONS = [0, 60, 80];
const SORT_OPTIONS = [
  {key: 'newest', label: 'Newest'},
  {key: 'oldest', label: 'Oldest'},
  {key: 'az', label: 'A to Z'},
];

function formatDate(iso) {
  if (!iso) return 'Unknown';
  try {
    const date = new Date(iso);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export default function SearchScreen() {
  const nav = useNavigation();

  const [query, setQuery] = useState('');
  const [endangeredOnly, setEndangeredOnly] = useState(false);
  const [sourceFilter, setSourceFilter] = useState('all');
  const [minConfidence, setMinConfidence] = useState(0);
  const [sort, setSort] = useState('newest');
  const [sortMenuVisible, setSortMenuVisible] = useState(false);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    let list = MOCK_POSTS.slice();

    if (term) {
      list = list.filter(item => {
        const haystack = [
          item.speciesName,
          item.commonName,
          item.scientificName,
          item.locationName,
          item.uploadedBy,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return haystack.includes(term);
      });
    }
    if (endangeredOnly) list = list.filter(item => item.isEndangered);
    if (sourceFilter !== 'all') list = list.filter(item => item.source === sourceFilter);
    if (minConfidence > 0) {
      list = list.filter(item => (item.confidence || 0) >= minConfidence);
    }

    switch (sort) {
      case 'oldest':
        return list.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        );
      case 'az':
        return list.sort((a, b) =>
          (a.speciesName || '').localeCompare(b.speciesName || ''),
        );
      default:
        return list.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
    }
  }, [query, endangeredOnly, sourceFilter, minConfidence, sort]);

  const resultWord = results.length === 1 ? 'result' : 'results';
  const hasActiveSort = sort !== 'newest';
  const hasSearch = Boolean(query.trim());
  const hasFilter =
    endangeredOnly || sourceFilter !== 'all' || minConfidence > 0;
  const showForYou = !hasActiveSort && !hasSearch && !hasFilter;

  const renderItem = ({item}) => {
    const imgSource =
      typeof item.photoUri === 'string' ? {uri: item.photoUri} : item.photoUri;

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
        android_ripple={{color: '#00000014'}}
      >
        <Image source={imgSource} style={s.cardImage} />
        <View style={s.cardBody}>
          <Text numberOfLines={1} style={s.cardTitle}>
            {item.speciesName || item.commonName || 'Unknown species'}
          </Text>
          <Text style={s.cardSub}>
            {item.isEndangered
              ? 'Location hidden to protect species'
              : `Location: ${item.locationName || 'Unknown'}`}
          </Text>
          <Text style={s.cardMeta}>{formatDate(item.createdAt)}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={s.container} edges={['top', 'left', 'right']}>
      <FlatList
        data={results}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={s.listContent}
        ListHeaderComponent={
          <View style={s.header}>
            <Text style={s.title}>Search Plants</Text>
            <Text style={s.subtitle}>
              Discover plants shared by the community. Search by name, sort, or
              filter to find what you need.
            </Text>

            <View style={s.searchBox}>
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search by species, common name, or user"
                placeholderTextColor="#94A3B8"
                style={s.input}
                autoCorrect={false}
                autoCapitalize="none"
              />
            </View>

            <View style={s.filterGroup}>
              <Text style={s.filterLabel}>Filters</Text>
              <View style={s.filterRow}>
                <FilterChip
                  label="Endangered only"
                  active={endangeredOnly}
                  onPress={() => setEndangeredOnly(v => !v)}
                />
              </View>
              <View style={s.filterRow}>
                <FilterChip
                  label="Camera"
                  active={sourceFilter === 'camera'}
                  onPress={() =>
                    setSourceFilter(prev => (prev === 'camera' ? 'all' : 'camera'))
                  }
                />
                <FilterChip
                  label="Library"
                  active={sourceFilter === 'library'}
                  onPress={() =>
                    setSourceFilter(prev =>
                      prev === 'library' ? 'all' : 'library',
                    )
                  }
                />
              </View>
              <View style={s.filterRow}>
                {CONFIDENCE_OPTIONS.map(value => (
                  <FilterChip
                    key={value}
                    label={value === 0 ? 'Any confidence' : `≥${value}%`}
                    active={minConfidence === value}
                    onPress={() =>
                      setMinConfidence(prev => (prev === value ? 0 : value))
                    }
                  />
                ))}
              </View>
            </View>

              <View style={s.filterGroup}>
                <Text style={s.filterLabel}>Sort by</Text>
                <View style={s.dropdown}>
                  <Pressable
                    style={s.pickerButton}
                    onPress={() => setSortMenuVisible(v => !v)}
                    android_ripple={{color: '#00000014'}}
                  >
                    <Text style={s.pickerButtonText}>
                      {SORT_OPTIONS.find(o => o.key === sort)?.label ?? 'Select'}
                    </Text>
                    <Text style={s.pickerButtonChevron}>▼</Text>
                  </Pressable>
                  {sortMenuVisible ? (
                    <View style={s.dropdownMenu}>
                      {SORT_OPTIONS.map(option => {
                        const active = sort === option.key;
                        return (
                          <Pressable
                            key={option.key}
                            style={[
                              s.dropdownItem,
                              active && s.dropdownItemActive,
                            ]}
                            onPress={() => {
                              setSort(option.key);
                              setSortMenuVisible(false);
                            }}
                            android_ripple={{color: '#00000010'}}
                          >
                            <Text
                              style={[
                                s.dropdownItemText,
                                active && s.dropdownItemTextActive,
                              ]}
                            >
                              {option.label}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  ) : null}
                </View>
              </View>

              <Text style={s.resultCount}>
                {results.length} {resultWord}
              </Text>
              <Text style={s.feedTitle}>
                {showForYou ? 'For You' : 'Results'}
              </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={s.emptyState}>
            <Text style={s.emptyTitle}>No plants found</Text>
            <Text style={s.emptySubtitle}>
              Try adjusting your search or filter selections.
            </Text>
          </View>
        }
        keyboardShouldPersistTaps="handled"
        />
    </SafeAreaView>
  );
}

const FilterChip = React.memo(({label, active, onPress}) => (
  <Pressable
    onPress={onPress}
    style={[s.chipBase, active && s.chipBaseActive]}
    android_ripple={{color: '#00000014'}}
  >
    <Text style={[s.chipBaseText, active && s.chipBaseTextActive]}>{label}</Text>
  </Pressable>
));

FilterChip.displayName = 'FilterChip';

const s = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F7F9F6'},
  listContent: {paddingBottom: 32},
  header: {paddingHorizontal: 16, paddingBottom: 16, gap: 16},
  title: {fontSize: 24, fontWeight: '800', color: '#1F2A37'},
  subtitle: {color: '#475569', lineHeight: 20},
  searchBox: {
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  input: {flex: 1, color: '#1F2937', fontSize: 15},
  filterGroup: {gap: 10},
  filterLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filterRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  chipBase: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#DDEEE6',
    borderWidth: 1,
    borderColor: '#B4D6C3',
  },
  chipBaseActive: {
    backgroundColor: '#2F6C4F',
    borderColor: '#2F6C4F',
  },
  chipBaseText: {color: '#2F6C4F', fontWeight: '700'},
  chipBaseTextActive: {color: '#FFFFFF'},
  resultCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  feedTitle: {fontSize: 20, fontWeight: '800', color: '#1F2A37', marginTop: 4},
  dropdown: {position: 'relative'},
  pickerButton: {
    height: 46,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F7FCF9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A9D6BC',
  },
  pickerButtonText: {color: '#1F2937', fontWeight: '700'},
  pickerButtonChevron: {color: '#2F6C4F', fontSize: 12},
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
    shadowOffset: {width: 0, height: 3},
  },
  cardImage: {
    width: 88,
    height: 88,
    borderRadius: 14,
    backgroundColor: '#D1D5DB',
  },
  cardBody: {flex: 1, gap: 8},
  cardTitle: {fontSize: 16, fontWeight: '800', color: '#1F2937'},
  cardSub: {color: '#334155', fontSize: 13, fontWeight: '600'},
  cardMeta: {color: '#64748B', fontSize: 12.5},
  emptyState: {
    marginTop: 32,
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    gap: 6,
  },
  emptyTitle: {fontSize: 16, fontWeight: '800', color: '#1F2937'},
  emptySubtitle: {fontSize: 13, color: '#6B7280', textAlign: 'center'},
  dropdownMenu: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D3E6DB',
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
    elevation: 5,
    zIndex: 10,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  dropdownItemActive: {
    backgroundColor: '#E4F1EA',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  dropdownItemTextActive: {
    color: '#2F6C4F',
  },
});
