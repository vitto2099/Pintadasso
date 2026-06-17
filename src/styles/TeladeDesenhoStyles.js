// src/styles/TeladeDesenhoStyles.js
import { StyleSheet, Platform } from 'react-native';
import { Cores, Sombras } from './tema';

export const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Cores.background,
  },
  barraSuperior: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Cores.superficie,
    paddingHorizontal: 12,
    paddingVertical: 10,
    paddingTop: Platform.OS === 'android' ? 44 : 14, // Padding ajustado
    borderBottomWidth: 1,
    borderBottomColor: Cores.borda,
    ...Sombras.leve,
  },
  centroBarra: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  tituloBarra: {
    color: Cores.textoBranco,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  previewCor: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: Cores.textoBranco,
  },
  textoPincelAtivo: {
    color: Cores.azulClaro,
    fontSize: 11,
    fontWeight: '600',
  },
  botaoIcone: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Cores.superficieClara,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoIcone: {
    color: Cores.textoBranco,
    fontSize: 18,
    fontWeight: 'bold',
  },
  botaoAcao: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Cores.superficieClara,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoAcao: {
    color: Cores.textoBranco,
    fontSize: 16,
  },
  botaoSalvar: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Cores.azulOceano,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
    ...Sombras.leve,
  },
  textoSalvar: {
    color: Cores.textoBranco,
    fontWeight: '700',
    fontSize: 13,
  },
  containerCanvas: {
    flex: 1,
    margin: 10,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Cores.borda,
    ...Sombras.media,
  },
  canvas: {
    flex: 1,
  },
  painelFerramentas: {
    backgroundColor: Cores.superficie,
    borderTopWidth: 1,
    borderTopColor: Cores.borda,
    paddingBottom: Platform.OS === 'android' ? 12 : 24,
  },
  abas: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Cores.borda,
  },
  aba: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  abaAtiva: {
    borderBottomWidth: 2.5,
    borderBottomColor: Cores.azulOceano,
  },
  textoAba: {
    color: Cores.textoMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  textoAbaAtiva: {
    color: Cores.textoBranco,
  },
  conteudoAba: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    minHeight: 80,
    justifyContent: 'center',
  },
  gridCores: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  botaoCor: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: Cores.borda,
  },
  corSelecionada: {
    borderWidth: 3,
    borderColor: Cores.textoBranco,
    transform: [{ scale: 1.2 }],
    ...Sombras.leve,
  },
  fileiraPinceis: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  botaoPincel: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    minWidth: 58,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  pincelSelecionado: {
    backgroundColor: Cores.superficieClara,
    borderColor: Cores.azulOceano,
  },
  iconePincel: {
    fontSize: 22,
  },
  nomePincel: {
    color: Cores.textoMuted,
    fontSize: 10,
    marginTop: 2,
    fontWeight: '600',
  },
  botaoFundo: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Cores.borda,
    minWidth: 65,
    alignItems: 'center',
  },
  fundoSelecionado: {
    backgroundColor: Cores.superficieClara,
    borderColor: Cores.azulOceano,
  },
  nomeFundo: {
    color: Cores.textoMuted,
    fontSize: 12,
    fontWeight: '700',
  },
});
