import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { View, ActivityIndicator, Text } from 'react-native';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import UserHome from './src/screens/UserHome';
import UserBookings from './src/screens/UserBookings';
import AdminDashboard from './src/screens/AdminDashboard';
import AdminDestinationDetails from './src/screens/AdminDestinationDetails';
import AdminBookings from './src/screens/AdminBookings';
import DestinationDetails from './src/screens/DestinationDetails';
import TripDetails from './src/screens/TripDetails';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Admin Tab Navigator
const AdminTabs = () => (
  <Tab.Navigator screenOptions={{
    headerStyle: { backgroundColor: '#FF7F50' },
    headerTintColor: '#fff',
    tabBarActiveTintColor: '#FF7F50'
  }}>
    <Tab.Screen name="Dashboard" component={AdminDashboard} options={{ title: 'Destinations' }} />
    <Tab.Screen name="AdminBookings" component={AdminBookings} options={{ title: 'Reservations' }} />
  </Tab.Navigator>
);

// Admin Stack (Includes Tabs + Detail Screens)
const AdminStack = () => (
  <Stack.Navigator screenOptions={{
    headerStyle: { backgroundColor: '#FF7F50' },
    headerTintColor: '#fff'
  }}>
    <Stack.Screen name="AdminMain" component={AdminTabs} options={{ headerShown: false }} />
    <Stack.Screen name="AdminDestinationDetails" component={AdminDestinationDetails} options={{ title: 'Manage Trips' }} />
  </Stack.Navigator>
);

// User Home Stack (Explore -> Details -> Book)
const UserHomeStack = () => (
  <Stack.Navigator screenOptions={{
    headerStyle: { backgroundColor: '#FF7F50' },
    headerTintColor: '#fff'
  }}>
    <Stack.Screen name="UserHomeList" component={UserHome} options={{ title: 'TravelGo' }} />
    <Stack.Screen name="DestinationDetails" component={DestinationDetails} options={{ title: 'Trips' }} />
    <Stack.Screen name="TripDetails" component={TripDetails} options={{ title: 'Book Trip' }} />
  </Stack.Navigator>
);

// User Tabs
const UserTabs = () => (
  <Tab.Navigator screenOptions={{
    headerStyle: { backgroundColor: '#FF7F50' },
    headerTintColor: '#fff',
    tabBarActiveTintColor: '#FF7F50',
    headerShown: false // Let Stack handle header
  }}>
    <Tab.Screen
      name="Here"
      component={UserHomeStack}
      options={({ navigation }) => ({
        title: 'Explore',
        headerTitle: () => (
          <TouchableOpacity onPress={() => navigation.navigate('UserHomeList')}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>TravelGo</Text>
          </TouchableOpacity>
        )
      })}
    />
    <Tab.Screen name="MyBookings" component={UserBookings} options={{ title: 'Bookings', headerShown: true }} />
  </Tab.Navigator>
);

const AppNav = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF7F50" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        user.role === 'ADMIN' ? <AdminStack /> : <UserTabs />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppNav />
    </AuthProvider>
  );
}
