import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import api from '../services/api';

const TripDetails = ({ route, navigation }) => {
    const { trip } = route.params;
    const [loading, setLoading] = useState(false);
    const [isBooked, setIsBooked] = useState(false);

    useEffect(() => {
        checkBookingStatus();
    }, []);

    const checkBookingStatus = async () => {
        try {
            const res = await api.get('/bookings');
            const booked = res.data.some(b => b.trip_id === trip.id);
            setIsBooked(booked);
        } catch (err) {
            console.error(err);
        }
    };

    const handleBooking = async () => {
        setLoading(true);
        try {
            await api.post('/bookings', { trip_id: trip.id });
            setIsBooked(true);
            Alert.alert('Success', 'Trip booked successfully!', [
                { text: 'OK', onPress: () => navigation.navigate('UserHome') }
            ]);
        } catch (err) {
            Alert.alert('Error', err.response?.data?.message || 'Booking failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>{trip.title}</Text>
                <Text style={styles.price}>Price: ${trip.price}</Text>

                <View style={styles.row}>
                    <Text style={styles.label}>Start Date:</Text>
                    <Text style={styles.value}>{new Date(trip.start_date).toDateString()}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>End Date:</Text>
                    <Text style={styles.value}>{new Date(trip.end_date).toDateString()}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Available Seats:</Text>
                    <Text style={styles.value}>{trip.available_seats}</Text>
                </View>

                {isBooked ? (
                    <View style={[styles.button, { backgroundColor: '#4CAF50' }]}>
                        <Text style={styles.buttonText}>✓ Booked</Text>
                    </View>
                ) : trip.available_seats > 0 ? (
                    <TouchableOpacity
                        style={[styles.button, loading && { opacity: 0.7 }]}
                        onPress={handleBooking}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Book Now</Text>}
                    </TouchableOpacity>
                ) : (
                    <View style={[styles.button, { backgroundColor: '#ccc' }]}>
                        <Text style={styles.buttonText}>Fully Booked</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f0f0f0' },
    card: { backgroundColor: '#fff', padding: 20, borderRadius: 10, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 5 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#333' },
    price: { fontSize: 22, color: '#4CAF50', fontWeight: 'bold', marginBottom: 20 },
    row: { flexDirection: 'row', marginBottom: 10 },
    label: { fontWeight: 'bold', width: 120, color: '#555' },
    value: { color: '#333' },
    button: { backgroundColor: '#FF7F50', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default TripDetails;
