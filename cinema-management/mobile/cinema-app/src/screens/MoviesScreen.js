import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import MoviesComponent from '../components/MoviesComponent';

const MoviesScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Button title="Add Movie" onPress={() => navigation.navigate('AddMovie')} />
      <MoviesComponent navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
});

export default MoviesScreen;