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

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  imageStyle: {
    resizeMode: 'cover',
    opacity: 0.5,
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
  productItem: {
    backgroundColor: '#FFF',
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    width: width * 0.9,
  },
  productText: {
    fontSize: 18,
    color: '#000',
  },
  deleteButton: {
    backgroundColor: 'red',
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  feedbackMessage: {
    fontSize: 18,
    color: 'green',
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
