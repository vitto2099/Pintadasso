import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TelaLogin from '../telas/TelaLogin';
import TelaCadastro from '../telas/TelaCadastro';
import TelaGaleria from '../telas/TelaGaleria';
import TeladeDesenho from '../telas/TeladeDesenho';
import { Cores } from '../styles/tema';

export type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  Galeria: undefined;
  Desenho: { desenho?: any } | undefined;
};

const Pilha = createNativeStackNavigator<RootStackParamList>();

export default function Navegador() {
  return (
    <NavigationContainer>
      <Pilha.Navigator initialRouteName="Login">
        <Pilha.Screen
          name="Login"
          component={TelaLogin}
          options={{ headerShown: false }}
        />
        <Pilha.Screen
          name="Cadastro"
          component={TelaCadastro}
          options={{
            title: 'Criar Conta',
            headerStyle: { backgroundColor: Cores.superficie },
            headerTintColor: Cores.textoBranco,
            headerTitleStyle: { fontWeight: '700' },
          }}
        />
        <Pilha.Screen
          name="Galeria"
          component={TelaGaleria}
          options={{
            title: 'Meus Esboços',
            headerStyle: { backgroundColor: Cores.superficie },
            headerTintColor: Cores.textoBranco,
            headerTitleStyle: { fontWeight: '700' },
          }}
        />
        <Pilha.Screen
          name="Desenho"
          component={TeladeDesenho}
          options={{ headerShown: false }}
        />
      </Pilha.Navigator>
    </NavigationContainer>
  );
}
