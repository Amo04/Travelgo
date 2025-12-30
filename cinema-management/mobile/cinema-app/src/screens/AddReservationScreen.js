import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddReservationScreen = ({ navigation }) => {
  const [destinationId, setDestinationId] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [nombrePersonnes, setNombrePersonnes] = useState('');
  const [prixTotal, setPrixTotal] = useState('');

  const handleAdd = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      await axios.post('http://localhost:3000/reservations', {
        destination_id: destinationId,
        date_debut: dateDebut,
        date_fin: dateFin,
        nombre_personnes: nombrePersonnes,
        prix_total: prixTotal
      }, { headers: { Authorization: token } });
      Alert.alert('Success', 'Reservation added');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to add reservation');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Add Reservation</Text>
      <TextInput placeholder="Destination ID" value={destinationId} onChangeText={setDestinationId} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Date Debut (YYYY-MM-DD)" value={dateDebut} onChangeText={setDateDebut} style={styles.input} />
      <TextInput placeholder="Date Fin (YYYY-MM-DD)" value={dateFin} onChangeText={setDateFin} style={styles.input} />
      <TextInput placeholder="Nombre Personnes" value={nombrePersonnes} onChangeText={setNombrePersonnes} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Prix Total" value={prixTotal} onChangeText={setPrixTotal} keyboardType="numeric" style={styles.input} />
      <Button title="Add" onPress={handleAdd} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 10 },
});

export default AddReservationScreen;