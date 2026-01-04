import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert, Modal, ScrollView } from 'react-native';
import api from '../services/api';

const AdminDestinationDetails = ({ route, navigation }) => {
    const { destination } = route.params;
    const [trips, setTrips] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newTrip, setNewTrip] = useState({
        title: '', price: '', start_date: '2026-01-01', end_date: '2026-01-07', available_seats: ''
    });

    useEffect(() => {
        fetchTrips();
        navigation.setOptions({ title: destination.name });
    }, []);

    const fetchTrips = async () => {
        try {
            const res = await api.get(`/trips?destination_id=${destination.id}`);
            setTrips(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddTrip = async () => {
        if (!newTrip.title || !newTrip.price || !newTrip.available_seats) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        try {
            await api.post('/trips', { ...newTrip, destination_id: destination.id });
            setModalVisible(false);
            setNewTrip({ title: '', price: '', start_date: '2026-01-01', end_date: '2026-01-07', available_seats: '' });
            fetchTrips();
            Alert.alert('Success', 'Trip Added');
        } catch (err) {
            Alert.alert('Error', 'Failed to add trip');
        }
    };

    const handleDeleteTrip = async (id) => {
        try {
            await api.delete(`/trips/${id}`);
            fetchTrips();
        } catch (err) {
            Alert.alert('Error', 'Failed to delete trip');
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addButtonText}>+ Add Trip to {destination.name}</Text>
            </TouchableOpacity>

            <FlatList
                data={trips}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.tripTitle}>{item.title}</Text>
                            <Text>${item.price} - Seats: {item.available_seats}</Text>
                            <Text style={{ color: '#666', fontSize: 12 }}>{new Date(item.start_date).toDateString()} - {new Date(item.end_date).toDateString()}</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleDeleteTrip(item.id)} style={styles.deleteButton}>
                            <Text style={{ color: 'white' }}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No Trips Found</Text>}
            />

            <Modal visible={modalVisible} animationType="slide">
                <ScrollView contentContainerStyle={styles.modal}>
                    <Text style={styles.modalTitle}>New Trip</Text>
                    <TextInput placeholder="Trip Title" style={styles.input} value={newTrip.title} onChangeText={t => setNewTrip({ ...newTrip, title: t })} />
                    <TextInput placeholder="Price (USD)" style={styles.input} value={newTrip.price} onChangeText={t => setNewTrip({ ...newTrip, price: t })} keyboardType="numeric" />
                    <TextInput placeholder="Start Date (YYYY-MM-DD)" style={styles.input} value={newTrip.start_date} onChangeText={t => setNewTrip({ ...newTrip, start_date: t })} />
                    <TextInput placeholder="End Date (YYYY-MM-DD)" style={styles.input} value={newTrip.end_date} onChangeText={t => setNewTrip({ ...newTrip, end_date: t })} />
                    <TextInput placeholder="Available Seats" style={styles.input} value={newTrip.available_seats} onChangeText={t => setNewTrip({ ...newTrip, available_seats: t })} keyboardType="numeric" />

                    <View style={styles.modalButtons}>
                        <TouchableOpacity style={[styles.button, { backgroundColor: '#ccc' }]} onPress={() => setModalVisible(false)}><Text>Cancel</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handleAddTrip}><Text style={{ color: 'white' }}>Add Trip</Text></TouchableOpacity>
                    </View>
                </ScrollView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
    addButton: { backgroundColor: '#2196F3', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
    addButtonText: { color: 'white', fontWeight: 'bold' },
    card: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 10, alignItems: 'center', elevation: 2 },
    tripTitle: { fontWeight: 'bold', fontSize: 16 },
    deleteButton: { backgroundColor: 'red', padding: 8, borderRadius: 4 },
    modal: { padding: 40, justifyContent: 'center', flexGrow: 1 },
    modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 15 },
    modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
    button: { padding: 15, borderRadius: 8, backgroundColor: '#FF7F50', width: '45%', alignItems: 'center' },
});

export default AdminDestinationDetails;
