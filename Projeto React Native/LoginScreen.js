import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [message, setMessage] = useState('');
  const navigation = useNavigation();

  const handleLogin = () => {
    const loginData = { email, senha };

    fetch('http://10.0.2.2:3000/login', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    })
    .then(response => response.json())
    .then(data => {
      if (data.usuario) {
        setMessage('Login realizado com sucesso!');
        navigation.navigate('Options'); // Navega para OptionsScreen após login bem-sucedido
      } else {
        setMessage(data.message || 'Erro ao fazer login. Tente novamente.');
      }
    })
    .catch(error => {
      console.error('Erro ao fazer login:', error);
      setMessage('Erro ao fazer login. Tente novamente.');
    });
  };

  return (
    <ImageBackground
      source={require('./src/foguete.jpeg')}
      style={styles.backgroundImage}
      imageStyle={styles.imageStyle}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Senha"
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Fazer Login</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  imageStyle: {
    resizeMode: 'cover',
    opacity: 5,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(82, 10, 146, 0.5)', // Mantém a sobreposição roxa translúcida
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
  },
  input: {
    width: width * 0.8,
    height: 50,
    backgroundColor: '#FFF',
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  button: {
    backgroundColor: "#f3a10d",
    width: "80%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginBottom: 18,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 16,
    color: 'red',
    marginBottom: 20,
  },
});
