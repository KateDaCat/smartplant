import React, {useEffect, useMemo, useState, useCallback} from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ADMIN_USER_DETAIL } from '../../navigation/routes';
import {fetchUsers} from '../../../services/api';

export default function AdminUsersScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load users', err);
      setError(err.message ?? 'Unable to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await fetchUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message ?? 'Unable to refresh users');
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleUserUpdate = (updatedUser) => {
    if (!updatedUser || typeof updatedUser.user_id === 'undefined') {
      return;
    }
    setUsers((prev) =>
      prev.map((user) =>
        user.user_id === updatedUser.user_id ? { ...user, ...updatedUser } : user
      )
    );
  };

  const filteredUsers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return users
      .filter((user) => {
        if (!normalizedQuery) return true;
        return (
          user.username.toLowerCase().includes(normalizedQuery) ||
          user.phone.toLowerCase().includes(normalizedQuery) ||
          String(user.user_id).includes(normalizedQuery)
        );
      })
      .sort((a, b) => a.username.localeCompare(b.username));
  }, [searchQuery, users]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>User Directory</Text>
        <Text style={styles.subtitle}>Search, manage access, and review roles.</Text>
      </View>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={16} color="#64748B" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by username, phone, or ID"
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton} accessibilityLabel="Clear search">
            <Ionicons name="close-circle" size={18} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>

        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#1E88E5" />
            <Text style={styles.loaderText}>Loading users…</Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
            }
          >
            {error ? (
              <View style={styles.emptyState}>
                <Ionicons name="warning-outline" size={20} color="#E57373" />
                <Text style={styles.emptyStateText}>{error}</Text>
                <TouchableOpacity onPress={loadUsers} style={styles.retryButton}>
                  <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
              </View>
            ) : filteredUsers.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={20} color="#94A3B8" />
                <Text style={styles.emptyStateText}>
                  No users found. Try a different search.
                </Text>
              </View>
            ) : (
              filteredUsers.map(user => (
                <View key={user.user_id} style={styles.card}>
                  <Text
                    style={[styles.username, !user.is_active && styles.usernameInactive]}
                  >
                    {user.username}
                  </Text>
                  <View style={styles.metaRow}>
                    <View style={styles.metaTextCol}>
                      <Text style={styles.metaId}>User ID: {user.user_id}</Text>
                      {!!user.phone && <Text style={styles.phone}>{user.phone}</Text>}
                    </View>
                    <TouchableOpacity
                      activeOpacity={0.75}
                      style={styles.viewButton}
                      onPress={() =>
                        navigation.navigate(ADMIN_USER_DETAIL, {
                          user,
                          onUpdate: handleUserUpdate,
                        })
                      }
                    >
                      <Text style={styles.viewButtonText}>View</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F5F6F8',
  },
  header: {
    gap: 4,
    marginTop: 4,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E2D3D',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
    list: {
      marginTop: 24,
      paddingBottom: 32,
      gap: 16,
    },
    searchBar: {
      marginTop: 16,
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
      fontSize: 13.5,
      color: '#0F172A',
    },
    clearButton: {
      padding: 4,
    },
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: '#E4E9EE',
      gap: 4,
    },
    username: {
      fontSize: 17,
      fontWeight: '600',
      color: '#23364B',
    },
    usernameInactive: {
      color: '#9CA3AF',
    },
    phone: {
      marginTop: 4,
      fontSize: 12.5,
      color: '#5F6F7E',
    },
    metaId: {
      marginTop: 2,
      fontSize: 11,
      color: '#7A8996',
      letterSpacing: 0.3,
    },
    metaRow: {
      marginTop: 4,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    metaTextCol: {
      gap: 2,
    },
    viewButton: {
      alignSelf: 'flex-end',
      paddingVertical: 6,
      paddingHorizontal: 14,
      borderRadius: 9,
      backgroundColor: '#1E88E5',
    },
    viewButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    emptyState: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      paddingVertical: 32,
      paddingHorizontal: 20,
      borderWidth: 1,
      borderColor: '#E4E9EE',
      alignItems: 'center',
      gap: 10,
    },
    emptyStateText: {
      fontSize: 13,
      color: '#64748B',
      textAlign: 'center',
    },
    loader: {
      marginTop: 48,
      alignItems: 'center',
      gap: 12,
    },
    loaderText: {
      fontSize: 13,
      color: '#64748B',
    },
    retryButton: {
      marginTop: 12,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#1E88E5',
    },
    retryButtonText: {
      color: '#1E88E5',
      fontWeight: '600',
    },
});
