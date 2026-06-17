// src/styles/TelaGaleriaStyles.js
import { StyleSheet, Platform } from 'react-native';
import { Cores, Sombras } from './tema';

export const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Cores.background,
  },
  bannerOffline: {
    backgroundColor: '#C0392B', // Mantém vermelho/alerta para offline
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  bannerSincronizando: {
    backgroundColor: Cores.azulOceano,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textoBannerOffline: {
    color: Cores.textoBranco,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  cabecalho: {
    backgroundColor: Cores.superficie,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 44 : 20, // Melhorado padding top
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Cores.borda,
    flexDirection: 'row',
    alignItems: 'center',
    ...Sombras.leve,
  },
  botaoSair: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Cores.borda,
    backgroundColor: Cores.superficieClara,
  },
  textoBotaoSair: {
    color: Cores.azulClaro,
    fontSize: 13,
    fontWeight: '700',
  },
  titulo: {
    color: Cores.textoBranco,
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  subtitulo: {
    color: Cores.textoMuted,
    fontSize: 13,
    marginTop: 2,
  },
  lista: {
    padding: 16,
    paddingBottom: 100,
    gap: 14,
  },
  card: {
    backgroundColor: Cores.superficie,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1.5,
    borderColor: Cores.borda,
    ...Sombras.leve,
  },
  areaPreview: {
    width: 90,
    height: 65,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: Cores.borda,
  },
  miniCanvas: {
    flex: 1,
    backgroundColor: Cores.canvasFundo,
  },
  infoCard: {
    flex: 1,
    paddingHorizontal: 14,
    gap: 4,
  },
  nomeDesenho: {
    color: Cores.textoBranco,
    fontSize: 16,
    fontWeight: '800',
  },
  dataDesenho: {
    color: Cores.azulClaro,
    fontSize: 12,
    fontWeight: '600',
  },
  qtdTracosDesenho: {
    color: Cores.textoMuted,
    fontSize: 12,
  },
  botaoExcluir: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoExcluir: {
    fontSize: 22,
  },
  containerVazio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 40,
  },
  iconeVazio: {
    fontSize: 70,
    marginBottom: 8,
  },
  textoVazio: {
    color: Cores.textoBranco,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtextoVazio: {
    color: Cores.textoMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Cores.azulOceano,
    justifyContent: 'center',
    alignItems: 'center',
    ...Sombras.media,
  },
  textoFab: {
    color: Cores.textoBranco,
    fontSize: 36,
    lineHeight: 38,
    fontWeight: '300',
  },
});
