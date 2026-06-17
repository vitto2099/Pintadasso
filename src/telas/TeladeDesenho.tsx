import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Svg, { Path, Line, Circle, Rect } from 'react-native-svg';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { autenticacao, bancoDeDados } from '../servicos/configuracaoFirebase';
import { estilos } from '../styles/TeladeDesenhoStyles';
import { Cores } from '../styles/tema';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navegacao/Navegador';

export type Traco = {
  caminho: string;
  cor: string;
  espessura: number;
  opacidade: number;
};

// ── Paleta de cores artísticas ──────────────────────────────────────────────
const PALETA_CORES = [
  { cor: '#1a1a2e', nome: 'Tinta da China' },
  { cor: '#2d2d2d', nome: 'Carvão' },
  { cor: '#5c4033', nome: 'Sépia' },
  { cor: '#7b3f00', nome: 'Marrom Terra' },
  { cor: '#4a4e69', nome: 'Ardósia' },
  { cor: '#6b4226', nome: 'Mogno' },
  { cor: '#ffffff', nome: 'Branco' },
  { cor: '#f5f0e8', nome: 'Creme' },
  { cor: '#b0b0b0', nome: 'Grafite' },
  { cor: '#c0392b', nome: 'Carmim' },
  { cor: '#e67e22', nome: 'Laranja Queimado' },
  { cor: '#f1c40f', nome: 'Ocre' },
  { cor: '#27ae60', nome: 'Verde Musgo' },
  { cor: '#2980b9', nome: 'Azul Cobalto' },
  { cor: '#8e44ad', nome: 'Violeta' },
  { cor: '#e91e8c', nome: 'Rosa' },
  { cor: '#00bcd4', nome: 'Ciano' },
  { cor: '#ff7043', nome: 'Terracota' },
];

// ── Pincéis ─────────────────────────────────────────────────────────────────
const PINCEIS = [
  { id: 'lapis', nome: 'Lápis', espessura: 1.5, opacidade: 0.8, icone: '✏️' },
  { id: 'caneta', nome: 'Caneta', espessura: 3, opacidade: 1.0, icone: '✒️' },
  { id: 'pincel', nome: 'Pincel', espessura: 8, opacidade: 0.85, icone: '🖌️' },
  { id: 'marcador', nome: 'Marcador', espessura: 18, opacidade: 0.45, icone: '🖊️' },
  { id: 'borracha', nome: 'Borracha', espessura: 20, opacidade: 1.0, icone: '◻️' },
];

// ── Tipos de fundo ───────────────────────────────────────────────────────────
const FUNDOS = [
  { id: 'linhas', nome: 'Linhas' },
  { id: 'pontilhado', nome: 'Pontos' },
  { id: 'grade', nome: 'Grade' },
  { id: 'limpo', nome: 'Limpo' },
];

// ── Tenta sincronizar um desenho com o Firestore ─────────────────────────────
async function sincronizarComNuvem(desenho: any) {
  const usuario = autenticacao.currentUser;
  if (!usuario) return false; // visitante não sincroniza

  try {
    const ref = collection(bancoDeDados, 'usuarios', usuario.uid, 'desenhos');
    await addDoc(ref, {
      nome: desenho.nome,
      data: desenho.data,
      fundo: desenho.fundo,
      // Traços SVG salvos como string para economizar espaço no Firestore
      tracosJson: JSON.stringify(desenho.tracos),
      criadoEm: serverTimestamp(),
      idLocal: desenho.id,
    });
    return true;
  } catch (e: any) {
    console.log('Erro ao sincronizar:', e.message);
    return false;
  }
}

type TeladeDesenhoProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Desenho'>;
};

export default function TeladeDesenho({ navigation }: TeladeDesenhoProps) {
  const [tracos, setTracos] = useState<Traco[]>([]);
  const [tracoAtual, setTracoAtual] = useState<Traco | null>(null);
  const [corAtual, setCorAtual] = useState(PALETA_CORES[0].cor);
  const [pincelAtual, setPincelAtual] = useState(PINCEIS[1]);
  const [fundoAtual, setFundoAtual] = useState('linhas');
  const [abaAtiva, setAbaAtiva] = useState('cores');
  const [salvando, setSalvando] = useState(false);

  const corDesenho = pincelAtual.id === 'borracha' ? Cores.canvasFundo : corAtual;

  // ── Gesto de desenho ───────────────────────────────────────────────────────
  const gestoPan = Gesture.Pan()
    .runOnJS(true)
    .minDistance(0)
    .onStart((e: any) => {
      setTracoAtual({
        caminho: `M ${e.x.toFixed(1)} ${e.y.toFixed(1)}`,
        cor: corDesenho,
        espessura: pincelAtual.espessura,
        opacidade: pincelAtual.opacidade,
      });
    })
    .onChange((e: any) => {
      setTracoAtual((prev) =>
        prev
          ? { ...prev, caminho: `${prev.caminho} L ${e.x.toFixed(1)} ${e.y.toFixed(1)}` }
          : prev
      );
    })
    .onEnd(() => {
      if (tracoAtual) {
        setTracos((prev) => [...prev, tracoAtual]);
        setTracoAtual(null);
      }
    });

  // ── Salvar: sempre local primeiro, depois tenta nuvem ─────────────────────
  const handleSalvar = async () => {
    if (tracos.length === 0) {
      Alert.alert('Aviso', 'Desenhe algo antes de salvar!');
      return;
    }

    setSalvando(true);

    try {
      // 1. Salvar sempre localmente primeiro (Offline First)
      const existentes = await AsyncStorage.getItem('@desenhos');
      const lista = existentes ? JSON.parse(existentes) : [];

      const novoDesenho = {
        id: Date.now().toString(),
        nome: `Esboço ${lista.length + 1}`,
        data: new Date().toLocaleDateString('pt-BR'),
        tracos,
        fundo: fundoAtual,
        sincronizado: false, // começa como não sincronizado
      };

      const listaAtualizada = [novoDesenho, ...lista];
      await AsyncStorage.setItem('@desenhos', JSON.stringify(listaAtualizada));

      // 2. Verificar se há internet e tentar sincronizar
      const estado = await NetInfo.fetch();
      let foiSincronizado = false;

      if (estado.isConnected && estado.isInternetReachable) {
        foiSincronizado = await sincronizarComNuvem(novoDesenho);

        if (foiSincronizado) {
          // Atualizar o AsyncStorage marcando como sincronizado
          novoDesenho.sincronizado = true;
          const listaSync = listaAtualizada.map((d) =>
            d.id === novoDesenho.id ? { ...d, sincronizado: true } : d
          );
          await AsyncStorage.setItem('@desenhos', JSON.stringify(listaSync));
        }
      }

      // 3. Feedback ao usuário
      const mensagem = foiSincronizado
        ? 'Salvo localmente e na nuvem'
        : 'Salvo no dispositivo. Será enviado à nuvem quando houver internet';

      if (Platform.OS === 'web') {
        const irParaGaleria = window.confirm(`${mensagem}\n\nDeseja ir para a Galeria? (Cancele para continuar desenhando)`);
        if (irParaGaleria) {
          navigation.navigate('Galeria');
        }
      } else {
        Alert.alert('Salvo!', mensagem, [
          { text: 'Ver Galeria', onPress: () => navigation.navigate('Galeria') },
          { text: 'Continuar desenhando' },
        ]);
      }
    } catch (e: any) {
      Alert.alert('Erro', 'Não foi possível salvar o esboço.');
    } finally {
      setSalvando(false);
    }
  };

  const handleDesfazer = () => setTracos((prev) => prev.slice(0, -1));
  const handleLimpar = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Tem certeza? Isso apagará tudo.')) {
        setTracos([]);
      }
    } else {
      Alert.alert('Limpar tela', 'Tem certeza? Isso apagará tudo.', [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Limpar', style: 'destructive', onPress: () => setTracos([]) },
      ]);
    }
  };

  // ── Elementos de fundo ─────────────────────────────────────────────────────
  const renderFundo = () => {
    const elementos = [];
    if (fundoAtual === 'linhas') {
      for (let y = 35; y < 900; y += 28) {
        elementos.push(
          <Line key={`h${y}`} x1="0" y1={y} x2="2000" y2={y} stroke="#c9daf8" strokeWidth="0.7" />
        );
      }
      elementos.push(
        <Line key="margem" x1="48" y1="0" x2="48" y2="2000" stroke="#f4a9a8" strokeWidth="1.2" />
      );
    } else if (fundoAtual === 'pontilhado') {
      for (let y = 30; y < 900; y += 25) {
        for (let x = 30; x < 2000; x += 25) {
          elementos.push(<Circle key={`p${x}${y}`} cx={x} cy={y} r="1" fill="#b8c9e0" />);
        }
      }
    } else if (fundoAtual === 'grade') {
      for (let y = 0; y < 900; y += 25) {
        elementos.push(
          <Line key={`gh${y}`} x1="0" y1={y} x2="2000" y2={y} stroke="#c9daf8" strokeWidth="0.5" />
        );
      }
      for (let x = 0; x < 2000; x += 25) {
        elementos.push(
          <Line key={`gv${x}`} x1={x} y1="0" x2={x} y2="2000" stroke="#c9daf8" strokeWidth="0.5" />
        );
      }
    }
    return elementos;
  };

  // ── Render das abas ─────────────────────────────────────────────────────────
  const renderAbaCores = () => (
    <View style={estilos.gridCores}>
      {PALETA_CORES.map(({ cor }) => (
        <TouchableOpacity
          key={cor}
          onPress={() => {
            setCorAtual(cor);
            if (pincelAtual.id === 'borracha') setPincelAtual(PINCEIS[1]);
          }}
          style={[
            estilos.botaoCor,
            { backgroundColor: cor },
            corAtual === cor && pincelAtual.id !== 'borracha' && estilos.corSelecionada,
            cor === '#ffffff' && { borderColor: '#ccc' },
          ]}
        />
      ))}
    </View>
  );

  const renderAbaPinceis = () => (
    <View style={estilos.fileiraPinceis}>
      {PINCEIS.map((pincel) => (
        <TouchableOpacity
          key={pincel.id}
          onPress={() => setPincelAtual(pincel)}
          style={[estilos.botaoPincel, pincelAtual.id === pincel.id && estilos.pincelSelecionado]}
        >
          <Text style={estilos.iconePincel}>{pincel.icone}</Text>
          <Text style={[estilos.nomePincel, pincelAtual.id === pincel.id && { color: Cores.azulClaro, fontWeight: '700' }]}>
            {pincel.nome}
          </Text>
          <View style={{
            width: Math.min(pincel.espessura, 18),
            height: Math.min(pincel.espessura, 18),
            borderRadius: pincel.espessura,
            backgroundColor: pincel.id === 'borracha' ? Cores.borda : corAtual,
            borderWidth: 1,
            borderColor: '#ccc',
            marginTop: 3,
          }} />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderAbaFundo = () => (
    <View style={estilos.fileiraPinceis}>
      {FUNDOS.map((f) => (
        <TouchableOpacity
          key={f.id}
          onPress={() => setFundoAtual(f.id)}
          style={[estilos.botaoFundo, fundoAtual === f.id && estilos.fundoSelecionado]}
        >
          <Text style={estilos.nomeFundo}>{f.nome}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <GestureHandlerRootView style={estilos.container}>

      {/* ── Barra superior ── */}
      <View style={estilos.barraSuperior}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={estilos.botaoIcone}>
          <Text style={estilos.textoIcone}>←</Text>
        </TouchableOpacity>

        <View style={estilos.centroBarra}>
          <Text style={estilos.tituloBarra}> Pintadasso</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={[estilos.previewCor, { backgroundColor: pincelAtual.id === 'borracha' ? '#e0d5c5' : corAtual }]} />
            <Text style={estilos.textoPincelAtivo}>{pincelAtual.icone} {pincelAtual.nome}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 6 }}>
          <TouchableOpacity
            onPress={handleDesfazer}
            style={[estilos.botaoAcao, tracos.length === 0 && { opacity: 0.35 }]}
            disabled={tracos.length === 0 || salvando}
          >
            <Text style={estilos.textoAcao}>↩</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLimpar}
            style={[estilos.botaoAcao, tracos.length === 0 && { opacity: 0.35 }]}
            disabled={tracos.length === 0 || salvando}
          >
            <Text style={estilos.textoAcao}>🗑</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSalvar}
            style={[estilos.botaoSalvar, salvando && { opacity: 0.7 }]}
            disabled={salvando}
          >
            {salvando
              ? <ActivityIndicator size="small" color="#fff" />
              : <Text style={estilos.textoSalvar}>Salvar</Text>
            }
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Canvas ── */}
      <GestureDetector gesture={gestoPan}>
        <View style={estilos.containerCanvas}>
          <Svg style={estilos.canvas}>
            <Rect x="0" y="0" width="2000" height="2000" fill={Cores.canvasFundo} />
            {renderFundo()}
            {tracos.map((t, i) => (
              <Path key={i} d={t.caminho} stroke={t.cor} strokeWidth={t.espessura}
                strokeOpacity={t.opacidade} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            ))}
            {tracoAtual && (
              <Path d={tracoAtual.caminho} stroke={tracoAtual.cor} strokeWidth={tracoAtual.espessura}
                strokeOpacity={tracoAtual.opacidade} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </Svg>
        </View>
      </GestureDetector>

      {/* ── Painel de ferramentas inferior ── */}
      <View style={estilos.painelFerramentas}>
        <View style={estilos.abas}>
          {[
            { id: 'cores', label: ' Cores' },
            { id: 'pinceis', label: ' Pincéis' },
            { id: 'fundo', label: ' Fundo' },
          ].map((aba) => (
            <TouchableOpacity
              key={aba.id}
              onPress={() => setAbaAtiva(aba.id)}
              style={[estilos.aba, abaAtiva === aba.id && estilos.abaAtiva]}
            >
              <Text style={[estilos.textoAba, abaAtiva === aba.id && estilos.textoAbaAtiva]}>
                {aba.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={estilos.conteudoAba}>
          {abaAtiva === 'cores' && renderAbaCores()}
          {abaAtiva === 'pinceis' && renderAbaPinceis()}
          {abaAtiva === 'fundo' && renderAbaFundo()}
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

// Os estilos foram movidos para src/styles/TeladeDesenhoStyles.js
