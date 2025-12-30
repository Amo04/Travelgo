import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';

const ReservationsScreen = ({ navigation }) => {
  const [reservations, setReservations] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    const token = await AsyncStorage.getItem('token');
    const res = await axios.get('http://localhost:3000/reservations', { headers: { Authorization: token } });
    setReservations(res.data);
  };

  return (
    <View style={styles.container}>
      <Button title="Back" onPress={() => navigation.goBack()} />
      <Button title="Add Reservation" onPress={() => navigation.navigate('AddReservation')} />
      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>Destination ID: {item.destination_id}</Text>
            <Text>From: {item.date_debut} To: {item.date_fin}</Text>
            <Text>Persons: {item.nombre_personnes}</Text>
            <Text>Total: {item.prix_total}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  item: { marginBottom: 20 },
});

export default ReservationsScreen;