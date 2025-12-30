import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditMovieScreen = ({ route, navigation }) => {
  const { movie } = route.params;
  const [titre, setTitre] = useState(movie.titre);
  const [description, setDescription] = useState(movie.description);
  const [prix, setPrix] = useState(movie.prix.toString());
  const [categorie, setCategorie] = useState(movie.categorie);
  const [localisation, setLocalisation] = useState(movie.localisation);
  const [image, setImage] = useState(movie.image);

  const handleEdit = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      await axios.put(`http://localhost:3000/destinations/${movie.id}`, { titre, description, prix, categorie, localisation, image }, { headers: { Authorization: token } });
      Alert.alert('Success', 'Movie updated');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update movie');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Edit Movie</Text>
      <TextInput placeholder="Titre" value={titre} onChangeText={setTitre} style={styles.input} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />
      <TextInput placeholder="Prix" value={prix} onChangeText={setPrix} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Categorie" value={categorie} onChangeText={setCategorie} style={styles.input} />
      <TextInput placeholder="Localisation" value={localisation} onChangeText={setLocalisation} style={styles.input} />
      <TextInput placeholder="Image URL" value={image} onChangeText={setImage} style={styles.input} />
      <Button title="Update" onPress={handleEdit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, marginBottom: 10, padding: 10 },
});

export default EditMovieScreen;