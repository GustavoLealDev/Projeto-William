import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, FlatList, TextInput, ImageBackground } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function ControleDeVendas() {
  const [vendas, setVendas] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [quantidadeVendida, setQuantidadeVendida] = useState({});
  const [totalArrecadado, setTotalArrecadado] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://10.0.2.2:3000/vendas')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setVendas(data);
          calcularTotalArrecadado(data);
        } else {
          console.error('Erro: data não é um array', data);
          setMessage('Erro ao buscar dados de vendas.');
        }
      })
      .catch(error => {
        console.error('Erro ao buscar dados de vendas:', error);
        setMessage('Erro ao buscar dados de vendas. Tente novamente.');
      });

    fetch('http://10.0.2.2:3000/produtos')
      .then(response => response.json())
      .then(data => setProdutos(data))
      .catch(error => {
        console.error('Erro ao buscar produtos:', error);
        setMessage('Erro ao buscar produtos. Tente novamente.');
      });
  }, []);

  const handleVenda = (id) => {
    const quantidade = quantidadeVendida[id] || 0;
    fetch('http://10.0.2.2:3000/vender', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, quantidadeVendida: quantidade }),
    })
    .then(response => response.json())
    .then(data => {
      setMessage(data.message);
      // Atualize a lista de produtos e vendas após a venda
      fetch('http://10.0.2.2:3000/vendas')
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data)) {
            setVendas(data);
            calcularTotalArrecadado(data);
          } else {
            console.error('Erro: data não é um array', data);
            setMessage('Erro ao atualizar lista de vendas.');
          }
        })
        .catch(error => {
          console.error('Erro ao atualizar lista de vendas:', error);
          setMessage('Erro ao atualizar lista de vendas. Tente novamente.');
        });

      fetch('http://10.0.2.2:3000/produtos')
        .then(response => response.json())
        .then(data => setProdutos(data))
        .catch(error => {
          console.error('Erro ao atualizar lista de produtos:', error);
          setMessage('Erro ao atualizar lista de produtos. Tente novamente.');
        });
    })
    .catch(error => {
      console.error('Erro ao registrar venda:', error);
      setMessage('Erro ao registrar venda. Tente novamente.');
    });
  };

  const calcularTotalArrecadado = (data) => {
    const total = data.reduce((acc, venda) => acc + venda.valor, 0);
    setTotalArrecadado(total);
  };

  const handleQuantidadeChange = (id, quantidade) => {
    setQuantidadeVendida(prevState => ({
      ...prevState,
      [id]: quantidade,
    }));
  };

  return (
    <ImageBackground
      source={require('./src/foguete.jpeg')} // Substitua pelo caminho da sua imagem de fundo
      style={styles.backgroundImage}
      imageStyle={styles.imageStyle}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Controle de Vendas</Text>
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <FlatList
          data={vendas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.productContainer}>
              <Text style={styles.productText}>Nome: {item.nome}</Text>
              <Text style={styles.productText}>Descrição: {item.descricao}</Text>
              <Text style={styles.productText}>Quantidade Vendida: {item.quantidade}</Text>
              <Text style={styles.productText}>Valor: R${item.valor.toFixed(2)}</Text>
            </View>
          )}
        />
        <Text style={styles.totalArrecadado}>Total Arrecadado: R${totalArrecadado.toFixed(2)}</Text>
        <Text style={styles.title}>Registrar Nova Venda</Text>
        <FlatList
          data={produtos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.productContainer}>
              <Text style={styles.productText}>Nome: {item.nome}</Text>
              <Text style={styles.productText}>Descrição: {item.descricao}</Text>
              <Text style={styles.productText}>Preço: R${item.preco}</Text>
              <Text style={styles.productText}>Quantidade: {item.quantidade}</Text>
              <TextInput
                placeholder="Quantidade Vendida"
                style={styles.input}
                value={quantidadeVendida[item.id] || ''}
                onChangeText={(text) => handleQuantidadeChange(item.id, text)}
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.button} onPress={() => handleVenda(item.id)}>
                <Text style={styles.buttonText}>Registrar Venda</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </ImageBackground>
  );
}

