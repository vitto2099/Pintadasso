// src/styles/TelaCadastroStyles.js
import { StyleSheet } from 'react-native';
import { Cores, Sombras } from './tema';

export const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Cores.background,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 40,
  },
  areaTitulo: {
    alignItems: 'center',
    marginBottom: 36,
  },
  emoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  titulo: {
    color: Cores.textoBranco,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  subtitulo: {
    color: Cores.textoMuted,
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
  },
  formulario: {
    backgroundColor: Cores.superficie,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Cores.borda,
    gap: 8,
    ...Sombras.media,
  },
  rotulo: {
    color: Cores.azulClaro,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
    marginTop: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  campo: {
    backgroundColor: Cores.superficieClara,
    borderWidth: 1.5,
    borderColor: Cores.borda,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    color: Cores.textoBranco,
    fontSize: 15,
  },
  botaoPrincipal: {
    backgroundColor: Cores.azulOceano,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 22,
    ...Sombras.leve,
  },
  textoBotaoPrincipal: {
    color: Cores.textoBranco,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  linkVoltar: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 6,
  },
  textoLinkVoltar: {
    color: Cores.textoMuted,
    fontSize: 14,
  },
  destaqueLink: {
    color: Cores.azulClaro,
    fontWeight: '700',
  },
});
