import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClientDashboardScreen from '../screens/client/ClientDashboardScreen';
import MyProjectsScreen from '../screens/client/MyProjectsScreen';
import MessagesScreen from '../screens/client/MessagesScreen';
import ClientSettingsScreen from '../screens/client/ClientSettingsScreen';
import CreateProjectScreen from '../screens/client/CreateProjectScreen';
import ProjectDetailScreen from '../screens/client/ProjectDetailScreen';
import ApplicationsScreen from '../screens/client/ApplicationsScreen';
import TeamScreen from '../screens/client/TeamScreen';
import BudgetTrackingScreen from '../screens/client/BudgetTrackingScreen';
import ConversationScreen from '../screens/client/ConversationScreen';
import { theme } from '../theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ProjectsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="MyProjectsList" 
        component={MyProjectsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="CreateProject" 
        component={CreateProjectScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function TabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text.secondary,
      }}
    >
      <Tab.Screen
        name="ClientDashboard"
        component={ClientDashboardScreen}
        options={{
          title: 'Dashboard',
          tabBarLabel: 'Accueil',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📊</Text>,
        }}
      />
      <Tab.Screen
        name="MyProjects"
        component={ProjectsStack}
        options={{
          title: 'Mes Projets',
          tabBarLabel: 'Projets',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📁</Text>,
        }}
      />
      <Tab.Screen
        name="Applications"
        component={ApplicationsScreen}
        options={{
          title: 'Candidatures',
          tabBarLabel: 'Candidatures',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>👥</Text>,
        }}
      />
      <Tab.Screen
        name="Budget"
        component={BudgetTrackingScreen}
        options={{
          title: 'Budget',
          tabBarLabel: 'Budget',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>💰</Text>,
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          title: 'Messages',
          tabBarLabel: 'Messages',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>💬</Text>,
        }}
      />
      <Tab.Screen
        name="Team"
        component={TeamScreen}
        options={{
          title: 'Équipe',
          tabBarLabel: 'Équipe',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>👨‍💼</Text>,
        }}
      />
      <Tab.Screen
        name="ClientSettings"
        component={ClientSettingsScreen}
        options={{
          title: 'Paramètres',
          tabBarLabel: 'Paramètres',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>⚙️</Text>,
        }}
      />
    </Tab.Navigator>
  );
}
export default function ClientTabs() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Group>
        <Stack.Screen name="TabsGroup" component={TabsNavigator} options={{ headerShown: false }} />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'card', headerShown: false }}>
        <Stack.Screen 
          name="ProjectDetail" 
          component={ProjectDetailScreen}
        />
        <Stack.Screen 
          name="Conversation" 
          component={ConversationScreen}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}