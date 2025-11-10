import React, {useCallback, useMemo, useState} from 'react';
import {View, Text, TextInput, FlatList, Image, Pressable, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

import {
  MOCK_POSTS,
  MOCK_SPECIES,
  MOCK_SENSOR_DEVICES,
  MOCK_ALERTS,
  MOCK_USERS,
  MOCK_ROLES,
} from '../data/mockPlants';

const TABS = [
  {key: 'observations', label: 'Observations'},
  {key: 'species', label: 'Species'},
  {key: 'devices', label: 'Sensors'},
  {key: 'alerts', label: 'Alerts'},
  {key: 'people', label: 'People'},
];

const CONFIDENCE_OPTIONS = [0, 60, 80];

const SORT_OPTIONS = [
  {key: 'newest', label: 'Newest'},
  {key: 'oldest', label: 'Oldest'},
  {key: 'confidence', label: 'Highest Confidence'},
  {key: 'az', label: 'A-Z'},
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
  const [activeTab, setActiveTab] = useState('observations');

  const [obsEndangeredOnly, setObsEndangeredOnly] = useState(false);
  const [obsFlaggedOnly, setObsFlaggedOnly] = useState(false);
  const [obsSource, setObsSource] = useState('all');
  const [obsMinConfidence, setObsMinConfidence] = useState(0);
  const [obsSort, setObsSort] = useState('newest');

  const [speciesEndangeredOnly, setSpeciesEndangeredOnly] = useState(false);
  const [devicesActiveOnly, setDevicesActiveOnly] = useState(true);
  const [alertsUnresolvedOnly, setAlertsUnresolvedOnly] = useState(true);
  const [peopleRoleFilter, setPeopleRoleFilter] = useState('all');

  const tabLabel = useMemo(
    () => TABS.find(t => t.key === activeTab)?.label ?? 'Results',
    [activeTab],
  );

  const quickStats = useMemo(
    () => [
      {key: 'observations', label: 'Observations', value: MOCK_POSTS.length},
      {
        key: 'endangered',
        label: 'Endangered Species',
        value: MOCK_SPECIES.filter(s => s.isEndangered).length,
      },
      {
        key: 'devices',
        label: 'Active Sensors',
        value: MOCK_SENSOR_DEVICES.filter(d => d.isActive).length,
      },
      {
        key: 'alerts',
        label: 'Open Alerts',
        value: MOCK_ALERTS.filter(a => !a.isResolved).length,
      },
    ],
    [],
  );

  const speciesById = useMemo(() => {
    const map = new Map();
    MOCK_SPECIES.forEach(s => map.set(s.speciesId, s));
    return map;
  }, []);

  const rolesById = useMemo(() => {
    const map = new Map();
    MOCK_ROLES.forEach(r => map.set(r.roleId, r));
    return map;
  }, []);

  const devicesById = useMemo(() => {
    const map = new Map();
    MOCK_SENSOR_DEVICES.forEach(d => map.set(d.deviceId, d));
    return map;
  }, []);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    switch (activeTab) {
      case 'observations': {
        let list = MOCK_POSTS.slice();
        if (term) {
          list = list.filter(item => {
            const haystack = [
              item.speciesName,
              item.commonName,
              item.locationName,
              item.uploadedBy,
            ]
              .filter(Boolean)
              .join(' ')
              .toLowerCase();
            return haystack.includes(term);
          });
        }
        if (obsEndangeredOnly) list = list.filter(item => item.isEndangered);
        if (obsFlaggedOnly) list = list.filter(item => item.flagged);
        if (obsSource !== 'all') {
          list = list.filter(item => item.source === obsSource);
        }
        if (obsMinConfidence > 0) {
          list = list.filter(item => (item.confidence || 0) >= obsMinConfidence);
        }
        switch (obsSort) {
          case 'oldest':
            list = list.slice().sort(
              (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            );
            break;
          case 'confidence':
            list = list.slice().sort(
              (a, b) => (b.confidence || 0) - (a.confidence || 0),
            );
            break;
          case 'az':
            list = list.slice().sort((a, b) =>
              (a.speciesName || '').localeCompare(b.speciesName || ''),
            );
            break;
          default:
            list = list.slice().sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
            );
        }
        return list;
      }
      case 'species': {
        let list = MOCK_SPECIES.slice();
        if (term) {
          list = list.filter(item =>
            `${item.scientificName} ${item.commonName || ''}`
              .toLowerCase()
              .includes(term),
          );
        }
        if (speciesEndangeredOnly) {
          list = list.filter(item => item.isEndangered);
        }
        return list.sort((a, b) =>
          (a.commonName || a.scientificName).localeCompare(
            b.commonName || b.scientificName,
          ),
        );
      }
      case 'devices': {
        let list = MOCK_SENSOR_DEVICES.map(item => ({
          ...item,
          species: speciesById.get(item.speciesId),
        }));
        if (term) {
          list = list.filter(item => {
            const haystack = [
              item.deviceName,
              item.deviceId,
              item.locationName,
              item.species?.commonName,
              item.species?.scientificName,
            ]
              .filter(Boolean)
              .join(' ')
              .toLowerCase();
            return haystack.includes(term);
          });
        }
        if (devicesActiveOnly) {
          list = list.filter(item => item.isActive);
        }
        return list.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
      }
      case 'alerts': {
        let list = MOCK_ALERTS.map(item => ({
          ...item,
          device: devicesById.get(item.deviceId),
        }));
        if (term) {
          list = list.filter(item => {
            const haystack = [
              item.alertType,
              item.alertMessage,
              item.device?.deviceName,
              item.device?.deviceId,
            ]
              .filter(Boolean)
              .join(' ')
              .toLowerCase();
            return haystack.includes(term);
          });
        }
        if (alertsUnresolvedOnly) {
          list = list.filter(item => !item.isResolved);
        }
        return list.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
      }
      case 'people': {
        let list = MOCK_USERS.map(item => ({
          ...item,
          role: rolesById.get(item.roleId),
        }));
        if (peopleRoleFilter !== 'all') {
          list = list.filter(item => String(item.roleId) === peopleRoleFilter);
        }
        if (term) {
          list = list.filter(item => {
            const haystack = [
              item.username,
              item.email,
              item.phone,
              item.role?.roleName,
            ]
              .filter(Boolean)
              .join(' ')
              .toLowerCase();
            return haystack.includes(term);
          });
        }
        return list.sort((a, b) =>
          (a.username || '').localeCompare(b.username || ''),
        );
      }
      default:
        return [];
    }
  }, [
    activeTab,
    query,
    obsEndangeredOnly,
    obsFlaggedOnly,
    obsSource,
    obsMinConfidence,
    obsSort,
    speciesEndangeredOnly,
    devicesActiveOnly,
    alertsUnresolvedOnly,
    peopleRoleFilter,
    speciesById,
    devicesById,
    rolesById,
  ]);

  const renderFiltersForActiveTab = useCallback(() => {
    switch (activeTab) {
      case 'observations':
        return (
          <View style={s.filterSection}>
            <Text style={s.filterLabel}>Quick Filters</Text>
            <View style={s.filterRow}>
              <FilterChip
                label="Endangered only"
                active={obsEndangeredOnly}
                onPress={() => setObsEndangeredOnly(v => !v)}
              />
              <FilterChip
                label="Flagged"
                active={obsFlaggedOnly}
                onPress={() => setObsFlaggedOnly(v => !v)}
              />
            </View>
            <View style={s.filterRow}>
              <FilterChip
                label="Camera"
                active={obsSource === 'camera'}
                onPress={() =>
                  setObsSource(prev => (prev === 'camera' ? 'all' : 'camera'))
                }
              />
              <FilterChip
                label="Library"
                active={obsSource === 'library'}
                onPress={() =>
                  setObsSource(prev => (prev === 'library' ? 'all' : 'library'))
                }
              />
            </View>
            <View style={s.filterRow}>
              {CONFIDENCE_OPTIONS.map(value => (
                <FilterChip
                  key={value}
                  label={value === 0 ? 'Any confidence' : `≥${value}%`}
                  active={obsMinConfidence === value}
                  onPress={() =>
                    setObsMinConfidence(prev =>
                      prev === value ? 0 : value,
                    )
                  }
                />
              ))}
            </View>
            <Text style={s.filterLabel}>Sort by</Text>
            <View style={s.filterRow}>
              {SORT_OPTIONS.map(option => (
                <FilterChip
                  key={option.key}
                  label={option.label}
                  active={obsSort === option.key}
                  onPress={() => setObsSort(option.key)}
                />
              ))}
            </View>
          </View>
        );
      case 'species':
        return (
          <View style={s.filterSection}>
            <Text style={s.filterLabel}>Filters</Text>
            <View style={s.filterRow}>
              <FilterChip
                label="Endangered only"
                active={speciesEndangeredOnly}
                onPress={() => setSpeciesEndangeredOnly(v => !v)}
              />
            </View>
          </View>
        );
      case 'devices':
        return (
          <View style={s.filterSection}>
            <Text style={s.filterLabel}>Filters</Text>
            <View style={s.filterRow}>
              <FilterChip
                label="Active only"
                active={devicesActiveOnly}
                onPress={() => setDevicesActiveOnly(v => !v)}
              />
            </View>
          </View>
        );
      case 'alerts':
        return (
          <View style={s.filterSection}>
            <Text style={s.filterLabel}>Filters</Text>
            <View style={s.filterRow}>
              <FilterChip
                label="Unresolved only"
                active={alertsUnresolvedOnly}
                onPress={() => setAlertsUnresolvedOnly(v => !v)}
              />
            </View>
          </View>
        );
      case 'people':
        return (
          <View style={s.filterSection}>
            <Text style={s.filterLabel}>Role</Text>
            <View style={s.filterRow}>
              <FilterChip
                label="All"
                active={peopleRoleFilter === 'all'}
                onPress={() => setPeopleRoleFilter('all')}
              />
              {MOCK_ROLES.map(role => {
                const roleKey = String(role.roleId);
                const isActive = peopleRoleFilter === roleKey;
                return (
                  <FilterChip
                    key={role.roleId}
                    label={role.roleName}
                    active={isActive}
                    onPress={() =>
                      setPeopleRoleFilter(prev =>
                        prev === roleKey ? 'all' : roleKey,
                      )
                    }
                  />
                );
              })}
            </View>
          </View>
        );
      default:
        return null;
    }
  }, [
    activeTab,
    obsEndangeredOnly,
    obsFlaggedOnly,
    obsSource,
    obsMinConfidence,
    obsSort,
    speciesEndangeredOnly,
    devicesActiveOnly,
    alertsUnresolvedOnly,
    peopleRoleFilter,
  ]);

  const resultWord = results.length === 1 ? 'result' : 'results';

  const renderListHeader = useCallback(() => {
    const noun =
      activeTab === 'people' && results.length === 1
        ? 'person'
        : tabLabel.toLowerCase();

    return (
      <View style={s.header}>
        <Text style={s.sectionTitle}>Snapshot</Text>
        <View style={s.metricsRow}>
          {quickStats.map(stat => (
            <View key={stat.key} style={s.metricCard}>
              <Text style={s.metricValue}>{stat.value}</Text>
              <Text style={s.metricLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={s.searchBox}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={`Search ${tabLabel.toLowerCase()}...`}
            placeholderTextColor="#94A3B8"
            style={s.input}
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>

        <View style={s.tabRow}>
          {TABS.map(tab => (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[
                s.tabChip,
                activeTab === tab.key && s.tabChipActive,
              ]}
            >
              <Text
                style={[
                  s.tabChipText,
                  activeTab === tab.key && s.tabChipTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {renderFiltersForActiveTab()}

        <Text style={s.resultCount}>
          {results.length} {noun} {resultWord}
        </Text>
      </View>
    );
  }, [
    activeTab,
    query,
    quickStats,
    renderFiltersForActiveTab,
    resultWord,
    results.length,
    tabLabel,
  ]);

  const renderEmpty = useCallback(
    () => (
      <View style={s.emptyState}>
        <Text style={s.emptyTitle}>No {tabLabel.toLowerCase()} found</Text>
        <Text style={s.emptySubtitle}>
          Try adjusting your filters or search terms.
        </Text>
      </View>
    ),
    [tabLabel],
  );

  const renderItem = ({item}) => {
    if (activeTab === 'observations') {
      const imgSource =
        typeof item.photoUri === 'string'
          ? {uri: item.photoUri}
          : item.photoUri;
      const confidence =
        typeof item.confidence === 'number'
          ? Math.round(item.confidence)
          : null;

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
          style={s.obsCard}
          android_ripple={{color: '#00000014'}}
        >
          <Image source={imgSource} style={s.obsImage} />
          <View style={s.obsBody}>
            <Text numberOfLines={1} style={s.obsTitle}>
              {item.speciesName || item.commonName || 'Unknown species'}
            </Text>
            <Text style={s.obsMeta}>
              {formatDate(item.createdAt)}
              {confidence !== null ? ` • ${confidence}% confidence` : ''}
            </Text>
            <View style={s.tagRow}>
              {item.isEndangered ? (
                <View style={[s.tagChip, s.tagChipDanger]}>
                  <Text style={[s.tagText, s.tagTextDanger]}>Endangered</Text>
                </View>
              ) : null}
              {item.flagged ? (
                <View style={[s.tagChip, s.tagChipWarn]}>
                  <Text style={[s.tagText, s.tagTextWarn]}>Flagged</Text>
                </View>
              ) : null}
              {item.source ? (
                <View style={s.tagChip}>
                  <Text style={s.tagText}>
                    {item.source === 'camera' ? 'Camera' : 'Library'}
                  </Text>
                </View>
              ) : null}
              {item.locationName ? (
                <View style={s.tagChip}>
                  <Text numberOfLines={1} style={s.tagText}>
                    {item.locationName}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        </Pressable>
      );
    }

    if (activeTab === 'species') {
      return (
        <View style={s.speciesCard}>
          <View style={s.speciesTop}>
            <Image source={{uri: item.imageUrl}} style={s.speciesImage} />
            <View style={s.speciesInfo}>
              <Text numberOfLines={1} style={s.speciesName}>
                {item.commonName || item.scientificName}
              </Text>
              <Text style={s.speciesScientific}>{item.scientificName}</Text>
              <View style={s.tagRow}>
                {item.isEndangered ? (
                  <View style={[s.tagChip, s.tagChipDanger]}>
                    <Text style={[s.tagText, s.tagTextDanger]}>
                      Endangered
                    </Text>
                  </View>
                ) : (
                  <View style={[s.tagChip, s.tagChipNeutral]}>
                    <Text style={s.tagText}>Not endangered</Text>
                  </View>
                )}
              </View>
            </View>
          </View>
          {item.description ? (
            <Text numberOfLines={3} style={s.speciesDescription}>
              {item.description}
            </Text>
          ) : null}
        </View>
      );
    }

    if (activeTab === 'devices') {
      const statusActive = item.isActive;
      return (
        <View style={s.deviceCard}>
          <View style={s.deviceHeader}>
            <Text numberOfLines={1} style={s.deviceName}>
              {item.deviceName}
            </Text>
            <View
              style={[
                s.statusBadge,
                statusActive ? s.statusBadgeOn : s.statusBadgeOff,
              ]}
            >
              <View
                style={[
                  s.statusDot,
                  statusActive ? s.statusDotOn : s.statusDotOff,
                ]}
              />
              <Text
                style={[
                  s.statusText,
                  statusActive ? s.statusTextOn : s.statusTextOff,
                ]}
              >
                {statusActive ? 'Active' : 'Offline'}
              </Text>
            </View>
          </View>
          <Text style={s.deviceId}>{item.deviceId}</Text>
          <View style={s.deviceBody}>
            {item.species ? (
              <Text style={s.deviceMeta}>
                Monitoring: {item.species.commonName || item.species.scientificName}
              </Text>
            ) : null}
            {item.locationName ? (
              <Text style={s.deviceMeta}>Location: {item.locationName}</Text>
            ) : null}
            <Text style={s.deviceMeta}>Installed: {formatDate(item.createdAt)}</Text>
          </View>
        </View>
      );
    }

    if (activeTab === 'alerts') {
      const isResolved = item.isResolved;
      return (
        <View
          style={[
            s.alertCard,
            isResolved ? s.alertCardResolved : s.alertCardActive,
          ]}
        >
          <View style={s.alertHeader}>
            <Text numberOfLines={1} style={s.alertTitle}>
              {item.alertType.replace(/_/g, ' ')}
            </Text>
            <View
              style={[
                s.alertStatus,
                isResolved ? s.alertStatusResolved : s.alertStatusOpen,
              ]}
            >
              <Text
                style={[
                  s.alertStatusText,
                  isResolved
                    ? s.alertStatusTextResolved
                    : s.alertStatusTextOpen,
                ]}
              >
                {isResolved ? 'Resolved' : 'Open'}
              </Text>
            </View>
          </View>
          <Text style={s.alertMessage}>{item.alertMessage}</Text>
          <View style={s.alertMetaRow}>
            {item.device?.deviceName ? (
              <Text style={s.alertMeta}>
                Device: {item.device.deviceName}
              </Text>
            ) : null}
            <Text style={s.alertMeta}>{formatDate(item.createdAt)}</Text>
          </View>
        </View>
      );
    }

    if (activeTab === 'people') {
      const avatarSource = item.avatarUrl ? {uri: item.avatarUrl} : null;
      return (
        <View style={s.personCard}>
          {avatarSource ? (
            <Image source={avatarSource} style={s.personAvatar} />
          ) : (
            <View style={[s.personAvatar, s.personAvatarFallback]}>
              <Text style={s.personAvatarInitial}>
                {item.username?.[0] ?? '?'}
              </Text>
            </View>
          )}
          <View style={s.personBody}>
            <Text numberOfLines={1} style={s.personName}>
              {item.username}
            </Text>
            {item.role?.roleName ? (
              <View style={s.personRoleBadge}>
                <Text style={s.personRoleText}>{item.role.roleName}</Text>
              </View>
            ) : null}
            <Text style={s.personMeta}>{item.email}</Text>
            {item.phone ? <Text style={s.personMeta}>{item.phone}</Text> : null}
            <Text style={s.personMeta}>Joined {formatDate(item.createdAt)}</Text>
          </View>
        </View>
      );
    }

    return null;
  };

  const keyExtractor = item => {
    switch (activeTab) {
      case 'observations':
        return item.id;
      case 'species':
        return String(item.speciesId);
      case 'devices':
        return item.deviceId;
      case 'alerts':
        return String(item.alertId);
      case 'people':
        return String(item.userId);
      default:
        return String(item.id ?? Math.random());
    }
  };

  return (
    <SafeAreaView style={s.container} edges={['top', 'left', 'right']}>
      <FlatList
        data={results}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={s.listContent}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F7F9F6'},
  header: {padding: 16, paddingBottom: 8},
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  metricsRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12},
  metricCard: {
    flexGrow: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 3},
  },
  metricValue: {fontSize: 20, fontWeight: '800', color: '#1E3A29'},
  metricLabel: {marginTop: 4, color: '#64748B', fontWeight: '600'},
  searchBox: {
    marginTop: 20,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  input: {flex: 1, color: '#1F2937', fontSize: 15},
  tabRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 18},
  tabChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#E5EFE9',
  },
  tabChipActive: {backgroundColor: '#335A44'},
  tabChipText: {color: '#335A44', fontWeight: '700'},
  tabChipTextActive: {color: '#FFFFFF'},
  filterSection: {marginTop: 18, gap: 12},
  filterLabel: {fontSize: 13, fontWeight: '700', color: '#6B7280'},
  filterRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#E5EFE9',
  },
  chipActive: {backgroundColor: '#335A44'},
  chipText: {color: '#335A44', fontWeight: '700'},
  chipTextActive: {color: '#FFFFFF'},
  resultCount: {
    marginTop: 18,
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  listContent: {paddingBottom: 32},
  obsCard: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 18,
    marginHorizontal: 16,
    marginTop: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 3},
  },
  obsImage: {
    width: 80,
    height: 80,
    borderRadius: 14,
    backgroundColor: '#D1D5DB',
  },
  obsBody: {flex: 1, justifyContent: 'center'},
  obsTitle: {fontSize: 16, fontWeight: '800', color: '#1F2937'},
  obsMeta: {marginTop: 4, color: '#6B7280', fontSize: 12.5},
  tagRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10},
  tagChip: {
    backgroundColor: '#E5EFE9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tagText: {fontSize: 11.5, fontWeight: '700', color: '#335A44'},
  tagChipDanger: {backgroundColor: '#FEE2E2'},
  tagTextDanger: {color: '#991B1B'},
  tagChipWarn: {backgroundColor: '#FDE68A'},
  tagTextWarn: {color: '#92400E'},
  tagChipNeutral: {backgroundColor: '#E2E8F0'},
  speciesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginHorizontal: 16,
    marginTop: 14,
    padding: 14,
    gap: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
  },
  speciesTop: {flexDirection: 'row', gap: 12},
  speciesImage: {
    width: 84,
    height: 84,
    borderRadius: 14,
    backgroundColor: '#D1D5DB',
  },
  speciesInfo: {flex: 1},
  speciesName: {fontSize: 16, fontWeight: '800', color: '#1F2937'},
  speciesScientific: {
    marginTop: 4,
    color: '#4B5563',
    fontStyle: 'italic',
  },
  speciesDescription: {color: '#374151', lineHeight: 18},
  deviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginHorizontal: 16,
    marginTop: 14,
    padding: 14,
    gap: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
  },
  deviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  deviceName: {fontSize: 16, fontWeight: '800', color: '#1F2937', flex: 1},
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusBadgeOn: {backgroundColor: '#DCFCE7'},
  statusBadgeOff: {backgroundColor: '#FEE2E2'},
  statusDot: {width: 6, height: 6, borderRadius: 3, marginRight: 6},
  statusDotOn: {backgroundColor: '#15803D'},
  statusDotOff: {backgroundColor: '#DC2626'},
  statusText: {fontSize: 12, fontWeight: '700'},
  statusTextOn: {color: '#166534'},
  statusTextOff: {color: '#991B1B'},
  deviceId: {color: '#6B7280', fontWeight: '600'},
  deviceBody: {gap: 4},
  deviceMeta: {color: '#475569', fontSize: 13},
  alertCard: {
    borderRadius: 18,
    marginHorizontal: 16,
    marginTop: 14,
    padding: 14,
  },
  alertCardActive: {backgroundColor: '#FFF7ED', borderLeftWidth: 4, borderLeftColor: '#F97316'},
  alertCardResolved: {backgroundColor: '#ECFDF5', borderLeftWidth: 4, borderLeftColor: '#10B981'},
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  alertTitle: {fontSize: 15, fontWeight: '800', color: '#1F2937', flex: 1},
  alertStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  alertStatusOpen: {backgroundColor: '#FDBA74'},
  alertStatusResolved: {backgroundColor: '#A7F3D0'},
  alertStatusText: {fontSize: 12, fontWeight: '700'},
  alertStatusTextOpen: {color: '#7C2D12'},
  alertStatusTextResolved: {color: '#047857'},
  alertMessage: {marginTop: 8, color: '#4B5563', lineHeight: 18},
  alertMetaRow: {flexDirection: 'row', justifyContent: 'space-between', marginTop: 10},
  alertMeta: {color: '#64748B', fontSize: 12, fontWeight: '600'},
  personCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginHorizontal: 16,
    marginTop: 14,
    padding: 14,
    gap: 14,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
  },
  personAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#CBD5F5',
  },
  personAvatarFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  personAvatarInitial: {fontSize: 22, fontWeight: '800', color: '#334155'},
  personBody: {flex: 1, gap: 4},
  personName: {fontSize: 16, fontWeight: '800', color: '#1F2937'},
  personRoleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#E2F3E9',
  },
  personRoleText: {fontSize: 12, fontWeight: '700', color: '#166534'},
  personMeta: {color: '#475569', fontSize: 13},
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
});

const FilterChip = React.memo(({label, active, onPress}) => (
  <Pressable
    onPress={onPress}
    style={[s.chip, active && s.chipActive]}
    android_ripple={{color: '#00000014'}}
  >
    <Text style={[s.chipText, active && s.chipTextActive]}>{label}</Text>
  </Pressable>
));

FilterChip.displayName = 'FilterChip';

