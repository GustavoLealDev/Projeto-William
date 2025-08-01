import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Dimensions, ImageBackground } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function ProductScreen() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [message, setMessage] = useState('');

  const handleAdicionarProduto = () => {
    const produtoData = { nome, descricao, preco, quantidade };

    fetch('http://10.0.2.2:3000/produtos', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(produtoData),
    })
    .then(response => response.json())
    .then(data => {
      setNome('');
      setDescricao('');
      setPreco('');
      setQuantidade('');
      setMessage('Produto adicionado com sucesso!');
    })
    .catch(error => {
      console.error('Erro ao adicionar produto:', error);
      setMessage('Erro ao adicionar produto. Tente novamente.');
    });
  };

  return (
    <ImageBackground
      source={require('./src/foguete.jpeg')} // Substitua pelo caminho da sua imagem de fundo
      style={styles.backgroundImage}
      imageStyle={styles.imageStyle}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Adicionar Produtos</Text>
        {message ? <Text style={styles.successMessage}>{message}</Text> : null}
        <TextInput
          placeholder="Nome"
          style={styles.input}
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          placeholder="Descrição"
          style={styles.input}
          value={descricao}
          onChangeText={setDescricao}
        />
        <TextInput
          placeholder="Preço"
          style={styles.input}
          value={preco}
          onChangeText={setPreco}
          keyboardType="decimal-pad"
        />
        <TextInput
          placeholder="Quantidade"
          style={styles.input}
          value={quantidade}
          onChangeText={setQuantidade}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.button} onPress={handleAdicionarProduto}>
          <Text style={styles.buttonText}>Adicionar Produto</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

