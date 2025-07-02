import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Dimensions, ImageBackground } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function RegisterScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [idade, setIdade] = useState('');
  const [senha, setSenha] = useState('');
  const [message, setMessage] = useState('');

  const handleCadastro = () => {
    const usuarioData = { nome, email, senha };

    fetch('http://10.0.2.2:3000/usuarios', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(usuarioData),
    })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        alert(data.message);
      } else {
        alert('Erro ao cadastrar usuário. Tente novamente.');
      }
    })
    .catch(error => {
      console.error('Erro ao cadastrar usuário:', error);
      alert('Erro ao cadastrar usuário. Tente novamente.');
    });
};


  return (
    <ImageBackground
      source={require('./src/foguete.jpeg')} // Substitua pelo caminho da sua imagem de fundo
      style={styles.backgroundImage}
      imageStyle={styles.imageStyle}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Realize seu Cadastro!</Text>
        {message ? (
          <Text style={styles.feedbackMessage}>{message}</Text>
        ) : (
          <>
            <TextInput
              placeholder="Nome"
              style={styles.input}
              value={nome}
              onChangeText={setNome}
            />
            <TextInput
              placeholder="Email"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
            <TextInput
              placeholder="Idade"
              style={styles.input}
              value={idade}
              onChangeText={setIdade}
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Senha"
              style={styles.input}
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />
            <TouchableOpacity style={styles.button} onPress={handleCadastro}>
              <Text style={styles.buttonText}>Finalizar</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ImageBackground>
  );
}

