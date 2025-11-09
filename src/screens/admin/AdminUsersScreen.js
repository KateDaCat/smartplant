import React, { useMemo, useState } from 'react';
import { SafeAreaView, Text, StyleSheet, View, Switch, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ADMIN_USER_DETAIL } from '../../navigation/routes';

const INITIAL_USERS = [
  {
    user_id: 1,
    username: 'flora_admin',
    role: 'Admin',
    email: 'flora@smartplant.dev',
    phone: '+60 12-345 6789',
    active: true,
    created_at: '2024-06-10T09:45:00Z',
  },
  {
    user_id: 2,
    username: 'ranger.sam',
    role: 'Plant Researcher',
    email: 'sam@smartplant.dev',
    phone: '+60 13-222 1111',
    active: false,
    created_at: '2024-08-21T14:20:00Z',
  },
  {
    user_id: 3,
    username: 'data.joy',
    role: 'User',
    email: 'joy@smartplant.dev',
    phone: '+60 17-555 6666',
    active: true,
    created_at: '2025-01-04T11:05:00Z',
  },
];

const ROLE_OPTIONS = ['Plant Researcher', 'Admin', 'User'];

export default function AdminUsersScreen() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [openRoleId, setOpenRoleId] = useState(null);
  const navigation = useNavigation();

  const handleToggle = (username) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.username === username ? { ...user, active: !user.active } : user
      )
    );
  };

  const updateRole = (user_id, role) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.user_id === user_id ? { ...user, role } : user
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
          user.email.toLowerCase().includes(normalizedQuery) ||
          user.phone.toLowerCase().includes(normalizedQuery)
        );
      })
      .sort((a, b) => a.username.localeCompare(b.username));
  }, [searchQuery, users]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>User Directory</Text>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={16} color="#64748B" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by username, email, or phone"
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

      <View style={styles.list}>
        {filteredUsers.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={20} color="#94A3B8" />
            <Text style={styles.emptyStateText}>No users found. Try a different search.</Text>
          </View>
        )}
        {filteredUsers.map((user) => (
          <View key={user.user_id} style={styles.card}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.username}>{user.username}</Text>
                <Text style={styles.metaId}>User ID: {user.user_id}</Text>
                <Text style={styles.email}>{user.email}</Text>
                <Text style={styles.phone}>{user.phone}</Text>
              </View>
              <View style={styles.statusGroup}>
                <Text style={[styles.statusLabel, user.active ? styles.statusActive : styles.statusInactive]}>
                  {user.active ? 'Active' : 'Inactive'}
                </Text>
                <Switch
                  value={user.active}
                  onValueChange={() => handleToggle(user.username)}
                  trackColor={{ false: '#D0D7DD', true: '#3AA272' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>

            <View style={styles.metaRow}>
              <TouchableOpacity
                activeOpacity={0.75}
                style={styles.viewButton}
                onPress={() => navigation.navigate(ADMIN_USER_DETAIL, { user })}
              >
                <Text style={styles.viewButtonText}>View Profile</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.assignContainer}>
              <Text style={styles.assignLabel}>Assign Role</Text>
              <TouchableOpacity
                style={styles.roleButton}
                onPress={() => setOpenRoleId(openRoleId === user.user_id ? null : user.user_id)}
                activeOpacity={0.7}
              >
                <Text style={styles.roleButtonText}>{user.role}</Text>
                <Ionicons
                  name={openRoleId === user.user_id ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color="#1F2A37"
                />
              </TouchableOpacity>
            </View>
            {openRoleId === user.user_id && (
              <View style={styles.dropdown}>
                {ROLE_OPTIONS.map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={styles.dropdownItem}
                    onPress={() => {
                      updateRole(user.user_id, role);
                      setOpenRoleId(null);
                    }}
                  >
                    <Text style={styles.dropdownText}>{role}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F5F6F8',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E2D3D',
  },
    list: {
    marginTop: 24,
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
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E4E9EE',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    color: '#23364B',
  },
  email: {
    marginTop: 4,
    fontSize: 13,
    color: '#5F6F7E',
  },
    phone: {
      marginTop: 2,
      fontSize: 12,
      color: '#7A8996',
    },
  metaId: {
    marginTop: 2,
    fontSize: 11,
    color: '#7A8996',
    letterSpacing: 0.3,
  },
  statusGroup: {
    alignItems: 'flex-end',
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  statusActive: {
    color: '#3AA272',
  },
  statusInactive: {
    color: '#B03A2E',
  },
    metaRow: {
      marginTop: 16,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    viewButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 10,
      backgroundColor: '#1E88E5',
    },
    viewButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    assignContainer: {
      marginTop: 16,
    },
    assignLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: '#4E5D6A',
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      marginBottom: 6,
    },
    roleButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 12,
      backgroundColor: '#E5ECF3',
    },
    roleButtonText: {
      fontSize: 13,
      fontWeight: '600',
      color: '#1F2A37',
    },
    dropdown: {
      marginTop: 8,
      borderWidth: 1,
      borderColor: '#D4DBE3',
      borderRadius: 12,
      backgroundColor: '#FFFFFF',
      overflow: 'hidden',
    },
    dropdownItem: {
      paddingVertical: 10,
      paddingHorizontal: 16,
    },
    dropdownText: {
      fontSize: 13,
      color: '#1F2A37',
      fontWeight: '500',
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
});
