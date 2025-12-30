import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddMovieScreen = ({ navigation }) => {
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [prix, setPrix] = useState('');
  const [categorie, setCategorie] = useState('');
  const [localisation, setLocalisation] = useState('');
  const [image, setImage] = useState('');

  const handleAdd = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      await axios.post('http://localhost:3000/destinations', { titre, description, prix, categorie, localisation, image }, { headers: { Authorization: token } });
      Alert.alert('Success', 'Movie added');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to add movie');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Add Movie</Text>
      <TextInput placeholder="Titre" value={titre} onChangeText={setTitre} style={styles.input} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />
      <TextInput placeholder="Prix" value={prix} onChangeText={setPrix} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Categorie" value={categorie} onChangeText={setCategorie} style={styles.input} />
      <TextInput placeholder="Localisation" value={localisation} onChangeText={setLocalisation} style={styles.input} />
      <TextInput placeholder="Image URL" value={image} onChangeText={setImage} style={styles.input} />
      <Button title="Add" onPress={handleAdd} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 10 },
});

export default AddMovieScreen;