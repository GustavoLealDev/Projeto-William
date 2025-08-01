import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import OptionsScreen from './OptionsScreen';
import CadastrarProdutos from './CadastrarProdutos';
import ComprarProdutos from './ComprarProdutos';
import ExcluirProdutos from './ExcluirProdutos';
import ControleDeVendas from './ControleDeVendas';

const Stack = createStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Image
        source={require('./src/logo simples.jpeg')}
        style={styles.logo}
      />
      <Text style={styles.text}>Bem-vindo à William GShop!</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Options" 
          component={OptionsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="CadastrarProdutos" 
          component={CadastrarProdutos}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ComprarProdutos" 
          component={ComprarProdutos}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ExcluirProdutos" 
          component={ExcluirProdutos}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ControleDeVendas" 
          component={ControleDeVendas}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#520a92',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#f3a10d",
    width: "80%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: 'bold',
  },
});
