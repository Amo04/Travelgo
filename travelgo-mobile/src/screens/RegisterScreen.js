import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const RegisterScreen = ({ navigation }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const { register } = useContext(AuthContext);

    const handleRegister = async () => {
        if (!fullName || !email || !password || !phone) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        const result = await register(fullName, email, password, phone);
        if (result.success) {
            Alert.alert('Success', 'Account created! Please login.', [
                { text: 'OK', onPress: () => navigation.navigate('Login') }
            ]);
        } else {
            Alert.alert('Registration Failed', result.error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    value={fullName}
                    onChangeText={setFullName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Phone"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.link}>
                    <Text style={styles.linkText}>Already have an account? Login</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 },
    title: { fontSize: 32, fontWeight: 'bold', color: '#FF7F50', marginBottom: 40 },
    inputContainer: { width: '100%' },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 15, marginBottom: 15, fontSize: 16 },
    button: { backgroundColor: '#FF7F50', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    link: { alignItems: 'center' },
    linkText: { color: '#FF7F50', fontSize: 16 }
});

export default RegisterScreen;
