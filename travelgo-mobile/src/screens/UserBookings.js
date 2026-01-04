import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import api from '../services/api';

const UserBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await api.get('/bookings');
            setBookings(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={[styles.status, { color: item.status === 'CONFIRMED' ? 'green' : item.status === 'CANCELLED' ? 'red' : 'orange' }]}>
                    {item.status}
                </Text>
            </View>
            <Text>Destination: {item.destination}, {item.country}</Text>
            <Text>Price: ${item.price}</Text>
            <Text style={{ color: '#666', marginTop: 5 }}>Booked on: {new Date(item.booking_date).toDateString()}</Text>
        </View>
    );

    if (loading) return <ActivityIndicator size="large" color="#FF7F50" style={{ flex: 1 }} />;

    return (
        <View style={styles.container}>
            <FlatList
                data={bookings}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No Bookings Yet</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f4f4f4', padding: 10 },
    card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2 },
    title: { fontWeight: 'bold', fontSize: 16 },
    status: { fontWeight: 'bold' }
});

export default UserBookings;
