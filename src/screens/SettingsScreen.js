import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { mockUser } from '../data/mockPlants';

const SUPPORT_CONTACT = {
  name: 'SmartPlant Support',
  email: 'support@smartplant.dev',
};

export default function SettingsScreen() {
  const navigation = useNavigation();

  const [displayName, setDisplayName] = useState(mockUser.username);
  const [avatarUrl, setAvatarUrl] = useState(mockUser.avatar);

  const handleSaveProfile = () => {
    const trimmedName = displayName.trim();
    const trimmedAvatar = avatarUrl.trim();

    if (!trimmedName) {
      Alert.alert('Invalid name', 'Please enter a display name.');
      return;
    }

    Alert.alert('Profile saved', 'Your profile has been updated.');
  };

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Account Settings</Text>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Profile</Text>
            <View style={styles.avatarPreview}>
              <Image
                source={{ uri: avatarUrl || mockUser.avatar }}
                style={styles.avatarImage}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Display name</Text>
              <TextInput
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Enter your name"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Avatar URL</Text>
              <TextInput
                value={avatarUrl}
                onChangeText={setAvatarUrl}
                placeholder="https://example.com/image.jpg"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                style={styles.input}
              />
              <Text style={styles.helperText}>
                Paste a direct image link (PNG/JPG). Leave blank to keep your current avatar.
              </Text>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
              <Ionicons name="save-outline" size={20} color="#FFFFFF" />
              <Text style={styles.saveButtonText}>Save profile</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Support</Text>
            <View style={styles.supportCard}>
              <Ionicons name="help-circle-outline" size={20} color="#155E75" />
              <View style={styles.supportTextBlock}>
                <Text style={styles.supportTitle}>{SUPPORT_CONTACT.name}</Text>
                <Text style={styles.supportSub}>{SUPPORT_CONTACT.email}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            style={styles.logoutButton}
            accessibilityRole="button"
          >
            <Ionicons name="log-out-outline" size={20} color="#B91C1C" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F9F4',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1F2A37',
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  avatarPreview: {
    alignItems: 'center',
    marginBottom: 18,
  },
  avatarImage: {
    width: 92,
    height: 92,
    borderRadius: 46,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    backgroundColor: '#E5E7EB',
  },
  field: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 14,
    paddingVertical: Platform.select({ ios: 12, android: 10 }),
    fontSize: 15,
    color: '#1F2937',
  },
  helperText: {
    marginTop: 6,
    fontSize: 12,
    color: '#64748B',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2F6C4F',
    paddingVertical: 14,
    borderRadius: 16,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  supportCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#E0F2FE',
    gap: 14,
  },
  supportTextBlock: {
    flex: 1,
  },
  supportTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  supportSub: {
    fontSize: 13,
    color: '#334155',
    marginTop: 2,
  },
  logoutButton: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEE2E2',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#B91C1C',
  },
});
