import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ImageBackground } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function OptionsScreen({ navigation }) {
  return (
    <ImageBackground
      source={require('./src/foguete.jpeg')}
      style={styles.backgroundImage}
      imageStyle={styles.imageStyle}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Escolha uma opção:</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CadastrarProdutos')}>
          <Text style={styles.buttonText}>Adicionar Produto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ComprarProdutos')}>
          <Text style={styles.buttonText}>Editar Produtos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ExcluirProdutos')}>
          <Text style={styles.buttonText}>Excluir Produto</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ControleDeVendas')}>
          <Text style={styles.buttonText}>Controle de Vendas</Text>
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
    opacity: 0.5,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(82, 10, 146, 0.5)', // Mantém a sobreposição roxa translúcida
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#f3a10d",
    width: "80%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: 'bold',
  },
});
