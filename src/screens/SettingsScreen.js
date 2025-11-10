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
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { mockUser } from '../data/mockPlants';
import * as ImagePicker from 'expo-image-picker';

const SUPPORT_CONTACT = {
  name: 'SmartPlant Support',
  email: 'support@smartplant.dev',
};

export default function SettingsScreen() {
  const navigation = useNavigation();

  const [displayName, setDisplayName] = useState(mockUser.username);
  const [avatarUri, setAvatarUri] = useState(mockUser.avatar);
  const [pickerVisible, setPickerVisible] = useState(false);

  const requestLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow photo library access to choose a picture.');
      return false;
    }
    return true;
  };

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Allow camera access to take a new photo.');
      return false;
    }
    return true;
  };

  const handleChoosePhoto = async () => {
    try {
      const allowed = await requestLibraryPermission();
      if (!allowed) return;
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
      if (!result.canceled && result.assets?.length) {
        setAvatarUri(result.assets[0].uri);
      }
      setPickerVisible(false);
    } catch (err) {
      console.warn('choose photo error', err);
      Alert.alert('Error', 'Unable to access your photo library.');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const allowed = await requestCameraPermission();
      if (!allowed) return;
      const result = await ImagePicker.launchCameraAsync({
        quality: 1,
      });
      if (!result.canceled && result.assets?.length) {
        setAvatarUri(result.assets[0].uri);
      }
      setPickerVisible(false);
    } catch (err) {
      console.warn('take photo error', err);
      Alert.alert('Error', 'Unable to open the camera.');
    }
  };

  const handleSaveProfile = () => {
    const trimmedName = displayName.trim();

    if (!trimmedName) {
      Alert.alert('Invalid name', 'Please enter a display name.');
      return;
    }

    mockUser.username = trimmedName;
    if (avatarUri) {
      mockUser.avatar = avatarUri;
    }
    setDisplayName(trimmedName);

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
                source={{ uri: avatarUri || mockUser.avatar }}
                style={styles.avatarImage}
              />
                <TouchableOpacity
                  style={styles.avatarCameraButton}
                  onPress={() => setPickerVisible(true)}
                  accessibilityRole="button"
                >
                  <Ionicons name="camera" size={18} color="#FFFFFF" />
                </TouchableOpacity>
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

      <Modal
        visible={pickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setPickerVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.sheet}>
                <Text style={styles.sheetTitle}>Update avatar</Text>
                <TouchableOpacity
                  style={styles.sheetAction}
                  onPress={handleTakePhoto}
                >
                  <Ionicons name="camera" size={20} color="#0F172A" />
                  <Text style={styles.sheetActionText}>Take a photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.sheetAction}
                  onPress={handleChoosePhoto}
                >
                  <Ionicons name="image" size={20} color="#0F172A" />
                  <Text style={styles.sheetActionText}>Choose from library</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.sheetCancel}
                  onPress={() => setPickerVisible(false)}
                >
                  <Text style={styles.sheetCancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  avatarCameraButton: {
    position: 'absolute',
    bottom: -6,
    right: 8,
    backgroundColor: '#2F6C4F',
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: '#F6F9F4',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    gap: 12,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  sheetAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  sheetActionText: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '600',
  },
  sheetCancel: {
    marginTop: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E2E8F0',
  },
  sheetCancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
});
