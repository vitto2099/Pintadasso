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
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import NetInfo from '@react-native-community/netinfo';
import { Platform } from 'react-native';
import { autenticacao, bancoDeDados } from '../servicos/configuracaoFirebase';
import { estilos } from '../styles/TelaGaleriaStyles';
import { Cores } from '../styles/tema';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navegacao/Navegador';

export type Traco = {
  caminho: string;
  cor: string;
  espessura: number;
  opacidade: number;
};

export type Desenho = {
  id: string;
  nome: string;
  data: string;
  fundo: string;
  tracos: Traco[];
  sincronizado?: boolean;
};

type MiniCanvasProps = {
  tracos: Traco[];
  fundo: string;
};

function MiniCanvas({ tracos, fundo }: MiniCanvasProps) {
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
async function sincronizarDesenho(desenho: Desenho) {
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

type TelaGaleriaProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Galeria'>;
};

export default function TelaGaleria({ navigation }: TelaGaleriaProps) {
  const [desenhos, setDesenhos] = useState<Desenho[]>([]);
  const [online, setOnline] = useState(true);
  const [sincronizando, setSincronizando] = useState(false);

  // Monitor de conexão em tempo real
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setOnline(!!(state.isConnected && state.isInternetReachable));
    });
    return () => unsubscribe();
  }, []);

  // Sincronizar pendentes automaticamente ao voltar online
  const sincronizarPendentes = async (lista: Desenho[]) => {
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

  const handleSair = async () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Deseja encerrar a sessão?')) {
        try { await signOut(autenticacao); } catch {}
        navigation.replace('Login');
      }
    } else {
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
    }
  };

  const baixarDesenhosDaNuvem = async (listaLocal: Desenho[]) => {
    const estado = await NetInfo.fetch();
    if (!estado.isConnected || !estado.isInternetReachable) return listaLocal;
    if (!autenticacao.currentUser) return listaLocal;

    try {
      const ref = collection(bancoDeDados, 'usuarios', autenticacao.currentUser.uid, 'desenhos');
      const snap = await getDocs(ref);
      let houveMudanca = false;
      const novaLista = [...listaLocal];

      snap.forEach(doc => {
        const dados = doc.data();
        const idNuvem = dados.idLocal;
        
        const existeLocal = novaLista.find(d => d.id === idNuvem);
        if (!existeLocal && dados.tracosJson) {
          const desenhoBaixado: Desenho = {
            id: idNuvem,
            nome: dados.nome,
            data: dados.data,
            fundo: dados.fundo,
            tracos: JSON.parse(dados.tracosJson || '[]'),
            sincronizado: true,
          };
          novaLista.push(desenhoBaixado);
          houveMudanca = true;
        }
      });

      if (houveMudanca) {
        novaLista.sort((a, b) => Number(b.id) - Number(a.id));
        await AsyncStorage.setItem('@desenhos', JSON.stringify(novaLista));
        return novaLista;
      }
      return listaLocal;
    } catch {
      return listaLocal;
    }
  };

  const carregarDesenhos = async () => {
    try {
      const json = await AsyncStorage.getItem('@desenhos');
      const lista = json ? JSON.parse(json) : [];
      setDesenhos(lista);
      
      const listaAtualizada = await sincronizarPendentes(lista);
      const listaComNuvem = await baixarDesenhosDaNuvem(listaAtualizada);
      
      setDesenhos(listaComNuvem);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os esboços.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregarDesenhos();
    }, [])
  );

  const handleExcluir = (id: string) => {
    const deletar = async () => {
      const novos = desenhos.filter((d) => d.id !== id);
      setDesenhos(novos);
      await AsyncStorage.setItem('@desenhos', JSON.stringify(novos));
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Tem certeza que deseja excluir este esboço?')) {
        deletar();
      }
    } else {
      Alert.alert('Excluir esboço', 'Tem certeza?', [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: deletar,
        },
      ]);
    }
  };

  const renderItem = ({ item }: { item: Desenho }) => (
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
          <Text style={{ color: Cores.textoMuted, fontSize: 13, marginBottom: 2 }}>
            {autenticacao.currentUser?.email ? `Olá, ${autenticacao.currentUser.email}` : 'Modo Visitante'}
          </Text>
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
