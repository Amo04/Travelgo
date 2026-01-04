import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import api from '../services/api';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await api.get('/bookings/all');
            setBookings(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/bookings/${id}`, { status });
            fetchBookings();
            Alert.alert('Success', `Booking ${status}`);
        } catch (err) {
            Alert.alert('Error', 'Failed to update status');
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.title}>{item.full_name}</Text>
                <Text style={[styles.status, { color: item.status === 'CONFIRMED' ? 'green' : item.status === 'CANCELLED' ? 'red' : 'orange' }]}>
                    {item.status}
                </Text>
            </View>
            <Text>Trip: {item.title}</Text>
            <Text>Email: {item.email}</Text>
            <Text>Date: {new Date(item.booking_date).toDateString()}</Text>

            {item.status === 'PENDING' && (
                <View style={styles.actions}>
                    <TouchableOpacity style={[styles.btn, styles.approve]} onPress={() => updateStatus(item.id, 'CONFIRMED')}>
                        <Text style={styles.btnText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btn, styles.reject]} onPress={() => updateStatus(item.id, 'CANCELLED')}>
                        <Text style={styles.btnText}>Reject</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );

    if (loading) return <ActivityIndicator size="large" color="#FF7F50" style={{ flex: 1 }} />;

    return (
        <View style={styles.container}>
            <FlatList
                data={bookings}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No Bookings Found</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f4f4f4', padding: 10 },
    card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, elevation: 2 },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    title: { fontWeight: 'bold', fontSize: 16 },
    status: { fontWeight: 'bold' },
    actions: { flexDirection: 'row', marginTop: 15, justifyContent: 'flex-end' },
    btn: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 5, marginLeft: 10 },
    approve: { backgroundColor: '#4CAF50' },
    reject: { backgroundColor: '#F44336' },
    btnText: { color: '#fff', fontWeight: 'bold' }
});

export default AdminBookings;
