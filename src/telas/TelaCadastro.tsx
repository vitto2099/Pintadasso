import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { autenticacao } from '../servicos/configuracaoFirebase';
import { estilos } from '../styles/TelaCadastroStyles';
import { Cores } from '../styles/tema';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navegacao/Navegador';

type TelaCadastroProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Cadastro'>;
};

export default function TelaCadastro({ navigation }: TelaCadastroProps) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleCadastrar = async () => {
    if (!email.trim() || !senha || !confirmSenha) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }
    if (senha !== confirmSenha) {
      Alert.alert('Atenção', 'As senhas não conferem.');
      return;
    }
    if (senha.length < 6) {
      Alert.alert('Atenção', 'A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    setCarregando(true);
    try {
      await createUserWithEmailAndPassword(autenticacao, email.trim(), senha);
      Alert.alert(
        'Conta criada! ',
        'Bem-vindo ao Pintadasso!',
        [{ text: 'Começar a desenhar', onPress: () => navigation.replace('Galeria') }],
        { cancelable: false }
      );
    } catch (erro: any) {
      const mensagens = {
        'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
        'auth/invalid-email': 'E-mail inválido.',
        'auth/weak-password': 'Senha muito fraca. Use pelo menos 6 caracteres.',
      };
      Alert.alert(
        'Erro ao cadastrar',
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

        <View style={estilos.areaTitulo}>
          <Text style={estilos.emoji}></Text>
          <Text style={estilos.titulo}>Nova Conta</Text>
          <Text style={estilos.subtitulo}>Crie sua conta e comece a esboçar</Text>
        </View>

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
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor={Cores.textoMuted}
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            editable={!carregando}
          />

          <Text style={estilos.rotulo}>Confirmar Senha</Text>
          <TextInput
            style={estilos.campo}
            placeholder="••••••••"
            placeholderTextColor={Cores.textoMuted}
            value={confirmSenha}
            onChangeText={setConfirmSenha}
            secureTextEntry
            editable={!carregando}
          />

          <TouchableOpacity
            style={[estilos.botaoPrincipal, carregando && { opacity: 0.7 }]}
            onPress={handleCadastrar}
            activeOpacity={0.8}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={estilos.textoBotaoPrincipal}>Criar Conta</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={estilos.linkVoltar}
            disabled={carregando}
          >
            <Text style={estilos.textoLinkVoltar}>
              ← Já tenho conta —{' '}
              <Text style={estilos.destaqueLink}>Entrar</Text>
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Os estilos foram movidos para src/styles/TelaCadastroStyles.js
