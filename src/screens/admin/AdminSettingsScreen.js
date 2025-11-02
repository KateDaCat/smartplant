import React from 'react';
import { SafeAreaView, Text, StyleSheet, View, Switch } from 'react-native';

const MOCK_SETTINGS = [
  { key: 'enableNotifications', label: 'Push notifications for critical alerts', enabled: true },
  { key: 'autoApproveLowRisk', label: 'Auto-approve low risk observations', enabled: false },
  { key: 'weeklyDigest', label: 'Email weekly activity digest', enabled: true },
];

export default function AdminSettingsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Admin Settings</Text>
      <Text style={styles.subtitle}>
        Toggle platform-wide preferences. Wire these switches up to backend config endpoints later.
      </Text>

      <View style={styles.card}>
        {MOCK_SETTINGS.map((setting, index) => (
          <View
            key={setting.key}
            style={[styles.row, index !== MOCK_SETTINGS.length - 1 && styles.rowDivider]}
          >
            <View style={styles.textGroup}>
              <Text style={styles.settingLabel}>{setting.label}</Text>
            </View>
            <Switch value={setting.enabled} trackColor={{ true: '#6DAF7A' }} thumbColor="#FFFFFF" disabled />
          </View>
        ))}
      </View>

      <View style={styles.placeholderPanel}>
        <Text style={styles.panelTitle}>Coming soon</Text>
        <Text style={styles.panelBody}>
          Add fine-grained role permissions, audit log retention, and environment toggles here once APIs are defined.
        </Text>
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
  card: {
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E1E7EB',
    paddingHorizontal: 18,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F5',
  },
  textGroup: {
    flex: 1,
    paddingRight: 16,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#2C4F3F',
  },
  placeholderPanel: {
    marginTop: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E1E7EB',
  },
  panelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C4F3F',
    marginBottom: 6,
  },
  panelBody: {
    fontSize: 14,
    color: '#5C6C75',
    lineHeight: 20,
  },
});
