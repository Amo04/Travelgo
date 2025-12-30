import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthProvider } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import AddMovieScreen from './src/screens/AddMovieScreen';
import EditMovieScreen from './src/screens/EditMovieScreen';
import ReservationsScreen from './src/screens/ReservationsScreen';
import AddReservationScreen from './src/screens/AddReservationScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddMovie" component={AddMovieScreen} />
          <Stack.Screen name="EditMovie" component={EditMovieScreen} />
          <Stack.Screen name="Reservations" component={ReservationsScreen} />
          <Stack.Screen name="AddReservation" component={AddReservationScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
