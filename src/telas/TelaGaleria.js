import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Svg, { Path, Rect, Line } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import NetInfo from '@react-native-community/netinfo';
import { autenticacao, bancoDeDados } from '../servicos/configuracaoFirebase';
import { estilos } from '../styles/TelaGaleriaStyles';
import { Cores } from '../styles/tema';

function MiniCanvas({ tracos, fundo }) {
  const escala = 0.12;

  const renderFundoMini = () => {
    if (fundo === 'linhas') {
      const linhas = [];
      for (let y = 10; y < 110; y += 8) {
        linhas.push(
          <Line key={y} x1="0" y1={y} x2="160" y2={y} stroke="#c9daf8" strokeWidth="0.5" />
        );
      }
      return linhas;
    }
    return null;
  };

  return (
    <View style={estilos.miniCanvas}>
      <Svg width="100%" height="100%" viewBox="0 0 160 110">
        <Rect x="0" y="0" width="160" height="110" fill={Cores.canvasFundo} />
        {renderFundoMini()}
        {(tracos || []).map((t, i) => (
          <Path
            key={i}
            d={t.caminho}
            stroke={t.cor}
            strokeWidth={t.espessura * escala + 1}
            strokeOpacity={t.opacidade}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform={`scale(${escala})`}
          />
        ))}
      </Svg>
    </View>
  );
}

// ── Sincroniza um desenho pendente com o Firestore ──────────────────────────
async function sincronizarDesenho(desenho) {
  const usuario = autenticacao.currentUser;
  if (!usuario) return false;
  try {
    const ref = collection(bancoDeDados, 'usuarios', usuario.uid, 'desenhos');
    await addDoc(ref, {
      nome: desenho.nome,
      data: desenho.data,
      fundo: desenho.fundo,
      tracosJson: JSON.stringify(desenho.tracos),
      criadoEm: serverTimestamp(),
      idLocal: desenho.id,
    });
    return true;
  } catch {
    return false;
  }
}

export default function TelaGaleria({ navigation }) {
  const [desenhos, setDesenhos] = useState([]);
  const [online, setOnline] = useState(true);
  const [sincronizando, setSincronizando] = useState(false);

  // Monitor de conexão em tempo real
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setOnline(state.isConnected && state.isInternetReachable);
    });
    return () => unsubscribe();
  }, []);

  // Sincronizar pendentes automaticamente ao voltar online
  const sincronizarPendentes = async (lista) => {
    const estado = await NetInfo.fetch();
    if (!estado.isConnected || !estado.isInternetReachable) return lista;
    if (!autenticacao.currentUser) return lista;

    setSincronizando(true);
    const pendentes = lista.filter((d) => !d.sincronizado);
    if (pendentes.length === 0) { setSincronizando(false); return lista; }

    let listaAtualizada = [...lista];
    for (const desenho of pendentes) {
      const ok = await sincronizarDesenho(desenho);
      if (ok) {
        listaAtualizada = listaAtualizada.map((d) =>
          d.id === desenho.id ? { ...d, sincronizado: true } : d
        );
      }
    }
    await AsyncStorage.setItem('@desenhos', JSON.stringify(listaAtualizada));
    setSincronizando(false);
    return listaAtualizada;
  };

  const handleSair = () => {
    Alert.alert('Sair', 'Deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut(autenticacao);
          } catch {
            // visitante não tem sessão Firebase — apenas navega
          }
          navigation.replace('Login');
        },
      },
    ]);
  };

  const carregarDesenhos = async () => {
    try {
      const json = await AsyncStorage.getItem('@desenhos');
      const lista = json ? JSON.parse(json) : [];
      setDesenhos(lista);
      // Tenta sincronizar pendentes ao carregar
      const listaAtualizada = await sincronizarPendentes(lista);
      setDesenhos(listaAtualizada);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os esboços.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarDesenhos();
    }, [])
  );

  const handleExcluir = (id) => {
    Alert.alert('Excluir esboço', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          const novos = desenhos.filter((d) => d.id !== id);
          setDesenhos(novos);
          await AsyncStorage.setItem('@desenhos', JSON.stringify(novos));
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={estilos.card}>
      <TouchableOpacity
        style={estilos.areaPreview}
        onPress={() => navigation.navigate('Desenho', { desenho: item })}
        activeOpacity={0.85}
      >
        <MiniCanvas tracos={item.tracos} fundo={item.fundo} />
      </TouchableOpacity>
      <View style={estilos.infoCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={estilos.nomeDesenho}>{item.nome}</Text>
          <Text style={{ fontSize: 14 }}>{item.sincronizado ? '✓' : '✗'}</Text>
        </View>
        <Text style={estilos.dataDesenho}>📅 {item.data}</Text>
        <Text style={estilos.qtdTracosDesenho}>
          🖊 {item.tracos?.length || 0} traços
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => handleExcluir(item.id)}
        style={estilos.botaoExcluir}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={estilos.textoExcluir}>🗑</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={estilos.container}>

      {/* Banner de status de rede */}
      {!online && (
        <View style={estilos.bannerOffline}>
          <Text style={estilos.textoBannerOffline}> Sem internet — desenhos serão sincronizados quando conectar</Text>
        </View>
      )}
      {sincronizando && (
        <View style={estilos.bannerSincronizando}>
          <Text style={estilos.textoBannerOffline}> Sincronizando esboços...</Text>
        </View>
      )}

      {/* Cabeçalho */}
      <View style={estilos.cabecalho}>
        <View style={{ flex: 1 }}>
          <Text style={estilos.titulo}> Meus Esboços</Text>
          <Text style={estilos.subtitulo}>{desenhos.length} desenho{desenhos.length !== 1 ? 's' : ''} salvos</Text>
        </View>
        <TouchableOpacity onPress={handleSair} style={estilos.botaoSair}>
          <Text style={estilos.textoBotaoSair}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Lista */}
      {desenhos.length === 0 ? (
        <View style={estilos.containerVazio}>
          <Text style={estilos.iconeVazio}>📒</Text>
          <Text style={estilos.textoVazio}>Sua galeria está vazia</Text>
          <Text style={estilos.subtextoVazio}>Toque no botão abaixo para criar seu primeiro esboço!</Text>
        </View>
      ) : (
        <FlatList
          data={desenhos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={estilos.lista}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB — Novo Desenho */}
      <TouchableOpacity
        style={estilos.fab}
        onPress={() => navigation.navigate('Desenho')}
        activeOpacity={0.85}
      >
        <Text style={estilos.textoFab}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

// Os estilos foram movidos para src/styles/TelaGaleriaStyles.js
