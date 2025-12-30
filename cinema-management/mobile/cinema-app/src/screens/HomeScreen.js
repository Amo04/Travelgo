import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context/AuthContext';

const HomeScreen = ({ navigation }) => {
  const [movies, setMovies] = useState([]);
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    const token = await AsyncStorage.getItem('token');
    const res = await axios.get('http://localhost:3000/destinations', { headers: { Authorization: token } });
    setMovies(res.data);
  };

  const handleLogout = () => {
    logout();
    navigation.navigate('Login');
  };

  const deleteMovie = async (id) => {
    const token = await AsyncStorage.getItem('token');
    await axios.delete(`http://localhost:3000/destinations/${id}`, { headers: { Authorization: token } });
    fetchMovies();
  };

  return (
    <View style={styles.container}>
      <Button title="Logout" onPress={handleLogout} />
      <Button title="Add Movie" onPress={() => navigation.navigate('AddMovie')} />
      <Button title="Reservations" onPress={() => navigation.navigate('Reservations')} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  item: { marginBottom: 20 },
});

export default HomeScreen;