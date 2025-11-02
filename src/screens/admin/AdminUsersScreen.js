import React from 'react';
import { SafeAreaView, Text, StyleSheet, View } from 'react-native';

const MOCK_USERS = [
  { username: 'flora_admin', role: 'Super Admin', email: 'flora@smartplant.dev' },
  { username: 'ranger.sam', role: 'Field Researcher', email: 'sam@smartplant.dev' },
  { username: 'data.joy', role: 'Data Analyst', email: 'joy@smartplant.dev' },
];

export default function AdminUsersScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>User Management</Text>
      <Text style={styles.subtitle}>
        Control roles, reset passwords, and audit activity logs from this module when backend endpoints are ready.
      </Text>

      <View style={styles.list}>
        {MOCK_USERS.map((user) => (
          <View key={user.username} style={styles.card}>
            <Text style={styles.username}>{user.username}</Text>
            <Text style={styles.email}>{user.email}</Text>
            <Text style={styles.role}>{user.role}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F4F6F8',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1D3A2C',
  },
  subtitle: {
    fontSize: 14,
    color: '#5C6C75',
    marginTop: 8,
    lineHeight: 20,
  },
  list: {
    marginTop: 24,
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E1E7EB',
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C4F3F',
  },
  email: {
    marginTop: 4,
    fontSize: 13,
    color: '#4A5C66',
  },
  role: {
    marginTop: 6,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#2C8155',
  },
});
