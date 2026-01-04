import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert, Modal } from 'react-native';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = ({ navigation }) => {
    const [destinations, setDestinations] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newDest, setNewDest] = useState({ name: '', country: '', description: '', image_url: '' });
    const { logout } = useContext(AuthContext);

    useEffect(() => {
        fetchDestinations();
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={logout} style={{ marginRight: 15 }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Logout</Text>
                </TouchableOpacity>
            ),
        });
    }, []);

    const fetchDestinations = async () => {
        try {
            const res = await api.get('/destinations');
            setDestinations(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAdd = async () => {
        if (!newDest.name || !newDest.country) return Alert.alert('Error', 'Name and Country required');
        try {
            await api.post('/destinations', newDest);
            setModalVisible(false);
            setNewDest({ name: '', country: '', description: '', image_url: '' });
            fetchDestinations();
        } catch (err) {
            Alert.alert('Error', 'Failed to add destination');
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/destinations/${id}`);
            fetchDestinations();
        } catch (err) {
            Alert.alert('Error', 'Failed to delete');
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addButtonText}>+ Add Destination</Text>
            </TouchableOpacity>

            <FlatList
                data={destinations}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('AdminDestinationDetails', { destination: item })}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text>{item.country}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => navigation.navigate('AdminDestinationDetails', { destination: item })} style={[styles.actionButton, { backgroundColor: '#2196F3', marginRight: 10 }]}>
                                <Text style={styles.actionText}>Trips</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={(e) => { e.stopPropagation(); handleDelete(item.id); }} style={[styles.actionButton, { backgroundColor: 'red' }]}>
                                <Text style={styles.actionText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                )}
            />

            <Modal visible={modalVisible} animationType="slide">
                <View style={styles.modal}>
                    <Text style={styles.modalTitle}>New Destination</Text>
                    <TextInput placeholder="Name" style={styles.input} value={newDest.name} onChangeText={t => setNewDest({ ...newDest, name: t })} />
                    <TextInput placeholder="Country" style={styles.input} value={newDest.country} onChangeText={t => setNewDest({ ...newDest, country: t })} />
                    <TextInput placeholder="Description" style={styles.input} value={newDest.description} onChangeText={t => setNewDest({ ...newDest, description: t })} />
                    <TextInput placeholder="Image URL" style={styles.input} value={newDest.image_url} onChangeText={t => setNewDest({ ...newDest, image_url: t })} />
                    <View style={styles.modalButtons}>
                        <TouchableOpacity style={[styles.button, { backgroundColor: '#ccc' }]} onPress={() => setModalVisible(false)}><Text>Cancel</Text></TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={handleAdd}><Text style={{ color: 'white' }}>Add</Text></TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    addButton: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
    addButtonText: { color: 'white', fontWeight: 'bold' },
    item: { flexDirection: 'row', padding: 15, borderBottomWidth: 1, borderColor: '#eee', alignItems: 'center', justifyContent: 'space-between' },
    name: { fontWeight: 'bold', fontSize: 16 },
    actionButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 4 },
    actionText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
    modal: { flex: 1, padding: 40, justifyContent: 'center' },
    modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 15 },
    modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
    button: { padding: 15, borderRadius: 8, backgroundColor: '#FF7F50', width: '45%', alignItems: 'center' },
});

export default AdminDashboard;
