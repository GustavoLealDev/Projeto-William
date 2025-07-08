import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, FlatList, Dimensions, ImageBackground, Alert } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function ProductListScreen() {
  const [produtos, setProdutos] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [quantidadeVendida, setQuantidadeVendida] = useState({});

  useEffect(() => {
    fetch('http://10.0.2.2:3000/produtos')
      .then(response => response.json())
      .then(data => setProdutos(data))
      .catch(error => {
        console.error('Erro ao buscar produtos:', error);
        setErrorMessage('Erro ao buscar produtos. Tente novamente.');
      });
  }, []);

  const handleAlterar = (produto) => {
    setEditingProduct(produto.id);
    setNome(produto.nome);
    setDescricao(produto.descricao);
    setPreco(produto.preco.toString());
    setQuantidade(produto.quantidade.toString());
  };

  const handleSalvarAlteracoes = (id) => {
    const formData = {
      nome,
      descricao,
      preco: parseFloat(preco),
      quantidade: parseInt(quantidade),
    };

    fetch(`http://10.0.2.2:3000/produtos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
    .then(response => response.json())
    .then(data => {
      setProdutos(produtos.map(prod => (prod.id === id ? { ...prod, ...formData } : prod)));
      setEditingProduct(null);
      setNome('');
      setDescricao('');
      setPreco('');
      setQuantidade('');
      alert('Produto atualizado com sucesso!');
    })
    .catch(error => {
      console.error('Erro ao atualizar produto:', error);
      alert('Erro ao atualizar produto. Por favor, tente novamente.');
    });
  };

  const handleCompra = (id) => {
    Alert.prompt(
      'Comprar Produto',
      'Informe a quantidade que deseja comprar:',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: (quantidade) => {
            const quantidadeVendida = parseInt(quantidade, 10);
            if (isNaN(quantidadeVendida) || quantidadeVendida <= 0) {
              alert('Quantidade inválida.');
              return;
            }

            fetch('http://10.0.2.2:3000/vender', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ id, quantidadeVendida }),
            })
            .then(response => response.json())
            .then(data => {
              setProdutos(produtos.map(prod => 
                prod.id === id 
                  ? { ...prod, quantidade: prod.quantidade - quantidadeVendida < 0 ? 0 : prod.quantidade - quantidadeVendida }
                  : prod
              ));
              alert('Compra registrada com sucesso!');
            })
            .catch(error => {
              console.error('Erro ao registrar compra:', error);
              alert('Erro ao registrar compra. Tente novamente.');
            });
          }
        }
      ],
      'plain-text'
    );
  };

  return (
    <ImageBackground
      source={require('./src/foguete.jpeg')}
      style={styles.backgroundImage}
      imageStyle={styles.imageStyle}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Lista de Produtos</Text>
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        <FlatList
          data={produtos}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              {editingProduct === item.id ? (
                <>
                  <TextInput
                    style={styles.input}
                    value={nome}
                    onChangeText={setNome}
                    placeholder="Nome"
                  />
                  <TextInput
                    style={styles.input}
                    value={descricao}
                    onChangeText={setDescricao}
                    placeholder="Descrição"
                  />
                  <TextInput
                    style={styles.input}
                    value={preco}
                    onChangeText={setPreco}
                    placeholder="Preço"
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={styles.input}
                    value={quantidade}
                    onChangeText={setQuantidade}
                    placeholder="Quantidade"
                    keyboardType="numeric"
                  />
                  <TouchableOpacity style={styles.button} onPress={() => handleSalvarAlteracoes(item.id)}>
                    <Text style={styles.buttonText}>Salvar Alterações</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.productText}>Nome: {item.nome}</Text>
                  <Text style={styles.productText}>Descrição: {item.descricao}</Text>
                  <Text style={styles.productText}>Preço: {item.preco}</Text>
                  <Text style={styles.productText}>Quantidade: {item.quantidade}</Text>
                  <TouchableOpacity style={styles.button} onPress={() => handleAlterar(item)}>
                    <Text style={styles.buttonText}>Alterar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={() => handleCompra(item.id)}>
                    <Text style={styles.buttonText}>Comprar</Text>
                  </TouchableOpacity>
                </>
              )}
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
  errorText: {
    fontSize: 18,
    color: 'red',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    backgroundColor: '#FFF',
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  button: {

    backgroundColor: "#f3a10d",
    width: "100%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: 'bold',
  },
});
