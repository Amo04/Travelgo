import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, TextInput, ActivityIndicator, useWindowDimensions } from 'react-native';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const UserHome = ({ navigation }) => {
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const { logout } = useContext(AuthContext);

    // Responsive Dimensions Hook
    const { width } = useWindowDimensions();
    const numColumns = width > 1000 ? 4 : width > 700 ? 3 : width > 500 ? 2 : 1;

    useEffect(() => {
        fetchDestinations();
        // Custom Header with Clickable Title
        navigation.setOptions({
            headerTitle: () => (
                <TouchableOpacity onPress={() => navigation.navigate('UserHomeList')}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>TravelGo</Text>
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity onPress={logout} style={{ marginRight: 15 }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Logout</Text>
                </TouchableOpacity>
            ),
        });
    }, [navigation]);

    const fetchDestinations = async () => {
        try {
            const res = await api.get('/destinations');
            setDestinations(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredDestinations = destinations.filter(d =>
        d.country.toLowerCase().includes(search.toLowerCase()) ||
        d.name.toLowerCase().includes(search.toLowerCase())
    );

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.card, { maxWidth: (width / numColumns) - 20 }]}
            onPress={() => navigation.navigate('DestinationDetails', { destination: item })}
        >
            {item.image_url ? (
                <Image source={{ uri: item.image_url }} style={styles.image} resizeMode="cover" />
            ) : (
                <View style={[styles.image, { backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={{ color: '#888' }}>No Image</Text>
                </View>
            )}
            <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.country}>{item.country}</Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) return <ActivityIndicator size="large" color="#FF7F50" style={{ flex: 1 }} />;

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.search}
                    placeholder="Search where you want to go..."
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            <FlatList
                data={filteredDestinations}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                key={numColumns} // Force re-render on column change
                numColumns={numColumns}
                contentContainerStyle={styles.list}
                columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : null}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    searchContainer: { padding: 15, backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.05, elevation: 2 },
    search: { padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 25, fontSize: 16, backgroundColor: '#f5f5f5', paddingHorizontal: 20 },
    list: { padding: 10 },
    columnWrapper: { justifyContent: 'flex-start', gap: 10 },
    card: {
        flex: 1,
        margin: 5,
        borderRadius: 12,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
        overflow: 'hidden',
        minWidth: 150
    },
    image: { width: '100%', height: 140 }, // Slightly taller image
    info: { padding: 12 },
    name: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50' },
    country: { fontSize: 12, color: '#FF7F50', marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
});

export default UserHome;
