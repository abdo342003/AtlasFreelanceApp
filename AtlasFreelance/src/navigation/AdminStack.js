import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminDisputesScreen from '../screens/admin/AdminDisputesScreen';
import AdminProjectsScreen from '../screens/admin/AdminProjectsScreen';
import AdminSettingsScreen from '../screens/admin/AdminSettingsScreen';
import AdminUsersScreen from '../screens/admin/AdminUsersScreen';

const Stack = createNativeStackNavigator();

export default function AdminStack(){
    return (
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
            <Stack.Screen name="AdminDisputes" component={AdminDisputesScreen} />
            <Stack.Screen name="AdminProjects" component={AdminProjectsScreen} />
            <Stack.Screen name="AdminSettings" component={AdminSettingsScreen} />
            <Stack.Screen name="AdminUsers" component={AdminUsersScreen} />
        </Stack.Navigator>
    );
}