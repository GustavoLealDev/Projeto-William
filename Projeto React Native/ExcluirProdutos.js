import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, FlatList, Dimensions, ImageBackground, Alert } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function ExcluirProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [senha, setSenha] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://10.0.2.2:3000/produtos')
      .then(response => response.json())
      .then(data => setProdutos(data))
      .catch(error => {
        console.error('Erro ao buscar produtos:', error);
        setMessage('Erro ao buscar produtos. Tente novamente.');
      });
  }, []);

  const handleExcluirProduto = (id) => {
    Alert.alert(
      "Confirmação",
      "Tem certeza de que deseja excluir este produto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "OK", 
          onPress: () => {
            const produtoData = { senha };
            fetch(`http://10.0.2.2:3000/produtos/${id}`, { 
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(produtoData),
            })
            .then(response => response.json().then(data => ({ status: response.status, body: data })))
            .then(({ status, body }) => {
              if (status === 200) {
                setProdutos(produtos.filter(produto => produto.id !== id));
                setMessage(body.message);
              } else {
                throw new Error(body.message);
              }
            })
            .catch(error => {
              console.error('Erro ao excluir produto:', error);
              setMessage('Erro ao excluir produto. Tente novamente.');
            });
          }
        }
      ]
    );
  };

  return (
    <ImageBackground
      source={require('./src/foguete.jpeg')}
      style={styles.backgroundImage}
      imageStyle={styles.imageStyle}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Excluir Produtos</Text>
        {message ? <Text style={styles.feedbackMessage}>{message}</Text> : null}
        <TextInput
          placeholder="Senha"
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />
        <FlatList
          data={produtos}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <Text style={styles.productText}>Nome: {item.nome}</Text>
              <Text style={styles.productText}>Descrição: {item.descricao}</Text>
              <Text style={styles.productText}>Preço: {item.preco}</Text>
              <Text style={styles.productText}>Quantidade: {item.quantidade}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleExcluirProduto(item.id)}
              >
                <Text style={styles.deleteButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </ImageBackground>
  );
}
