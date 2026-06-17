// src/styles/tema.js

export const Cores = {
  background: '#20242B',      // Cinza escuro (fundo principal do app)
  superficie: '#2A303C',      // Cinza ligeiramente mais claro (para cards, cabeçalhos, painéis)
  superficieClara: '#363E4D', // Para inputs e elementos interativos em repouso
  borda: '#3E4758',           // Cor para divisórias e contornos
  
  // Paleta de Azuis
  azulOceano: '#1E88E5',      // Destaque primário (botões principais, abas ativas)
  azulClaro: '#42A5F5',       // Destaque secundário (links, seleções, ícones ativos)
  azulProfundo: '#0D47A1',    // Tons escuros de destaque (botões pressionados, contrastes)
  
  // Textos
  textoBranco: '#F5F9FF',     // Branco gelo (texto principal em fundos escuros)
  textoMuted: '#9BA6B8',      // Cinza azulado (subtítulos e textos de apoio)
  textoEscuro: '#1A1D24',     // Texto escuro (para usar sobre fundos muito claros)
  
  // Desenho
  canvasFundo: '#F5F9FF',     // Branco gelo (fundo padrão da folha de desenho)
  canvasFundoWarm: '#FFFAED', // Opcional: papel amarelado clássico
};

export const Sombras = {
  leve: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  media: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
};
