import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

import AdminOverviewScreen from '../screens/admin/AdminOverviewScreen';
import AdminObservationsScreen from '../screens/admin/AdminObservationsScreen';
import AdminSpeciesScreen from '../screens/admin/AdminSpeciesScreen';
import AdminDevicesScreen from '../screens/admin/AdminDevicesScreen';
import AdminAlertsScreen from '../screens/admin/AdminAlertsScreen';
import AdminUsersScreen from '../screens/admin/AdminUsersScreen';
import AdminSettingsScreen from '../screens/admin/AdminSettingsScreen';
import { ADMIN_OVERVIEW } from './routes';

const Drawer = createDrawerNavigator();

const ADMIN_PROFILE = {
  name: 'Flora Administrator',
  role: 'Super Admin',
  email: 'flora.admin@smartplant.dev',
};

function AdminDrawerContent(props) {
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerScrollContainer}
    >
      <View style={styles.profileContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{ADMIN_PROFILE.name.split(' ')[0][0]}{ADMIN_PROFILE.name.split(' ')[1][0]}</Text>
        </View>
        <Text style={styles.profileName}>{ADMIN_PROFILE.name}</Text>
        <Text style={styles.profileRole}>{ADMIN_PROFILE.role}</Text>
        <Text style={styles.profileEmail}>{ADMIN_PROFILE.email}</Text>
      </View>

      <View style={styles.drawerListWrapper}>
        <DrawerItemList {...props} />
      </View>

      <View style={styles.drawerFooter}>
        <Text style={styles.footerText}>SmartPlant Admin Console</Text>
        <Text style={styles.footerSubtext}>Mock data - backend coming soon</Text>
      </View>
    </DrawerContentScrollView>
  );
}

const drawerScreens = [
  {
    name: ADMIN_OVERVIEW,
    label: 'Overview',
    icon: 'grid-outline',
    component: AdminOverviewScreen,
  },
  {
    name: 'AdminObservations',
    label: 'Observations',
    icon: 'leaf-outline',
    component: AdminObservationsScreen,
  },
  {
    name: 'AdminSpecies',
    label: 'Species Library',
    icon: 'library-outline',
    component: AdminSpeciesScreen,
  },
  {
    name: 'AdminDevices',
    label: 'Sensor Devices',
    icon: 'hardware-chip-outline',
    component: AdminDevicesScreen,
  },
  {
    name: 'AdminAlerts',
    label: 'Alerts',
    icon: 'alert-circle-outline',
    component: AdminAlertsScreen,
  },
  {
    name: 'AdminUsers',
    label: 'Users & Roles',
    icon: 'people-outline',
    component: AdminUsersScreen,
  },
  {
    name: 'AdminSettings',
    label: 'Settings',
    icon: 'settings-outline',
    component: AdminSettingsScreen,
  },
];

export default function AdminNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName={ADMIN_OVERVIEW}
      drawerContent={(props) => <AdminDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: '#F4F6F8' },
        headerTitleStyle: { color: '#1D3A2C', fontSize: 18, fontWeight: '700' },
        headerTintColor: '#1D3A2C',
        sceneContainerStyle: { backgroundColor: '#F4F6F8' },
        drawerType: 'front',
        drawerStyle: { width: 280 },
        drawerInactiveTintColor: '#3F5149',
        drawerActiveTintColor: '#2C8155',
        drawerActiveBackgroundColor: '#E6F3EB',
        drawerLabelStyle: { fontSize: 15, fontWeight: '500', marginLeft: -12 },
        drawerItemStyle: { borderRadius: 12, marginVertical: 4 },
      }}
    >
      {drawerScreens.map((screen) => (
        <Drawer.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={{
            title: screen.label,
            drawerIcon: ({ color, size }) => (
              <Ionicons name={screen.icon} size={size} color={color} />
            ),
          }}
        />
      ))}
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerScrollContainer: {
    flexGrow: 1,
    paddingTop: 0,
    backgroundColor: '#F4F6F8',
  },
  profileContainer: {
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 24,
    backgroundColor: '#1D3A2C',
    borderBottomRightRadius: 32,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#6DAF7A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileRole: {
    marginTop: 4,
    fontSize: 13,
    color: '#C6E4D1',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  profileEmail: {
    marginTop: 6,
    fontSize: 12,
    color: '#E0F1E7',
  },
  drawerListWrapper: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 12,
  },
  drawerFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E3EBE6',
  },
  footerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3F5149',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  footerSubtext: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7B86',
  },
});
