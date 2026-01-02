import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MoviesComponent = ({ navigation }) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    const token = await AsyncStorage.getItem('token');
    const res = await axios.get('http://localhost:3000/destinations', { headers: { Authorization: token } });
    setMovies(res.data);
  };

  const deleteMovie = async (id) => {
    const token = await AsyncStorage.getItem('token');
    await axios.delete(`http://localhost:3000/destinations/${id}`, { headers: { Authorization: token } });
    fetchMovies();
  };

  return (
    <FlatList
      data={movies}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text>{item.titre}</Text>
          <Text>{item.description}</Text>
          <Button title="Edit" onPress={() => navigation.navigate('EditMovie', { movie: item })} />
          <Button title="Delete" onPress={() => deleteMovie(item.id)} />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  item: { marginBottom: 20, padding: 10, borderWidth: 1 },
});

export default MoviesComponent;