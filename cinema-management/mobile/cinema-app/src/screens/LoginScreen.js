import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      await login(email, password);
      navigation.navigate('Home');
    } catch (err) {
      setError('Login failed');
      Alert.alert('Error', 'Login failed');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: 'https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500' }}
          style={styles.logo}
        />
        <Text style={styles.title}>Sign in to your account</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.passwordHeader}>
            <Text style={styles.label}>Password</Text>
            <TouchableOpacity>
              <Text style={styles.link}>Forgot password?</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>
          Not a member? <Text style={styles.link}>Start a 14 day free trial</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
    backgroundColor: '#111827', // Mimicking bg-gray-900
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    height: 40,
    width: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  formContainer: {
    maxWidth: 384, // Mimicking sm:max-w-sm
    width: '100%',
    alignSelf: 'center',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#f3f4f6', // Mimicking text-gray-100
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)', // Mimicking outline-white/10
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.05)', // Mimicking bg-white/5
    color: 'white',
    fontSize: 16,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  link: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1', // Mimicking text-indigo-400
  },
  button: {
    backgroundColor: '#6366f1', // Mimicking bg-indigo-500
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 40,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    textAlign: 'center',
    fontSize: 14,
    color: '#9ca3af', // Mimicking text-gray-400
  },
});

export default LoginScreen;