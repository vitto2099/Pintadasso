import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navegacao/Navegador';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { autenticacao } from '../servicos/configuracaoFirebase';
import { estilos } from '../styles/TelaLoginStyles';
import { Cores } from '../styles/tema';


type TelaLoginProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export default function TelaLogin({ navigation }: TelaLoginProps) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleEntrar = async () => {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }

    setCarregando(true);
    try {
      await signInWithEmailAndPassword(autenticacao, email, senha);
      navigation.replace('Galeria');
    } catch (erro: any) {
      const mensagens = {
        'auth/user-not-found': 'Usuário não encontrado.',
        'auth/wrong-password': 'Senha incorreta.',
        'auth/invalid-email': 'E-mail inválido.',
        'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
        'auth/invalid-credential': 'E-mail ou senha incorretos.',
      };
      Alert.alert(
        'Erro ao entrar',
        mensagens[erro.code as keyof typeof mensagens] || 'Ocorreu um erro. Tente novamente.'
      );
    } finally {
      setCarregando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={estilos.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={estilos.scroll} keyboardShouldPersistTaps="handled">

        {/* Logo / Título */}
        <View style={estilos.areaTitulo}>
          <Image 
            source={require('../../assets/images/pintadasso.png')} 
            style={{ width: 150, height: 150, resizeMode: 'contain', alignSelf: 'center', marginBottom: 16 }} 
          />
          <Text style={estilos.titulo}>Pintadasso</Text>
          <Text style={estilos.subtitulo}>Seu caderno de esboços de bolso</Text>
        </View>

        {/* Formulário */}
        <View style={estilos.formulario}>
          <Text style={estilos.rotulo}>E-mail</Text>
          <TextInput
            style={estilos.campo}
            placeholder="seu@email.com"
            placeholderTextColor={Cores.textoMuted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!carregando}
          />

          <Text style={estilos.rotulo}>Senha</Text>
          <TextInput
            style={estilos.campo}
            placeholder="••••••••"
            placeholderTextColor={Cores.textoMuted}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            editable={!carregando}
          />

          <TouchableOpacity
            style={[estilos.botaoPrincipal, carregando && { opacity: 0.7 }]}
            onPress={handleEntrar}
            activeOpacity={0.8}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={estilos.textoBotaoPrincipal}>Entrar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={estilos.botaoVisitante}
            onPress={() => navigation.replace('Galeria')}
            activeOpacity={0.8}
            disabled={carregando}
          >
            <Text style={estilos.textoBotaoVisitante}>Entrar como Visitante</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Cadastro')}
            style={estilos.linkCadastro}
            disabled={carregando}
          >
            <Text style={estilos.textoLinkCadastro}>
              Não tem conta?{' '}
              <Text style={estilos.destaqueLink}>Cadastre-se</Text>
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Os estilos foram movidos para src/styles/TelaLoginStyles.js
