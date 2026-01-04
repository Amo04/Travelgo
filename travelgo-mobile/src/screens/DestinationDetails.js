import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import api from '../services/api';

const DestinationDetails = ({ route, navigation }) => {
    const { destination } = route.params;
    const [trips, setTrips] = useState([]);

    useEffect(() => {
        fetchTrips();
    }, []);

    const fetchTrips = async () => {
        try {
            const res = await api.get(`/trips?destination_id=${destination.id}`);
            setTrips(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: destination.image_url }}
                style={styles.headerImage}
            />
            <View style={styles.content}>
                <Text style={styles.title}>{destination.name}, {destination.country}</Text>
                <Text style={styles.desc}>{destination.description}</Text>

                <Text style={styles.sectionTitle}>Available Trips</Text>

                {trips.length === 0 ? (
                    <Text>No trips available yet.</Text>
                ) : (
                    <FlatList
                        data={trips}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.tripCard}
                                onPress={() => navigation.navigate('TripDetails', { trip: item })}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={styles.tripTitle}>{item.title}</Text>
                                    <Text style={styles.price}>${item.price}</Text>
                                </View>
                                <Text style={styles.date}>{new Date(item.start_date).toDateString()} - {new Date(item.end_date).toDateString()}</Text>
                                <Text style={styles.seat}>Seats: {item.available_seats}</Text>
                            </TouchableOpacity>
                        )}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    headerImage: { width: '100%', height: 200 },
    content: { padding: 20, flex: 1 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    desc: { marginVertical: 10, color: '#666', lineHeight: 20 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 10, color: '#FF7F50' },
    tripCard: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 8, marginBottom: 10, borderLeftWidth: 4, borderLeftColor: '#FF7F50' },
    tripTitle: { fontSize: 16, fontWeight: 'bold' },
    price: { fontSize: 16, fontWeight: 'bold', color: '#4CAF50' },
    date: { color: '#888', marginTop: 5 },
    seat: { marginTop: 5, color: '#555' }
});

export default DestinationDetails;
