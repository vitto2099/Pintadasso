# Pintadasso — Caderno de Esboços de Bolso

**Aplicativo mobile de sketchbook digital** desenvolvido em React Native com Expo e Firebase.

---

## Problema e Proposta de Valor

Estudantes de arte, designers e entusiastas do desenho muitas vezes não têm acesso a um caderno físico no momento em que a inspiração bate. O **Pintadasso** resolve isso oferecendo um caderno de esboços digital sempre disponível no bolso — com funcionamento **100% offline** e sincronização automática com a nuvem quando houver internet.

**Público-alvo:** Estudantes de design, ilustradores iniciantes, artistas que querem registrar esboços rápidos no dia a dia.

![Firebase Funcionando](./assets/firebase/firebase.png)

---

## Funcionalidades

- **Autenticação** — Login e cadastro com e-mail/senha via Firebase Authentication  
- **Tela de Desenho** — Canvas SVG com gesto de toque
  - 18 cores artísticas (Tinta da China, Carvão, Sépia, Cobalto, etc.)
  - 5 pincéis com presets de espessura e opacidade (Lápis, Caneta, Pincel, Marcador, Borracha)
  - 4 modos de fundo (Linhas de caderno, Pontilhado, Grade, Limpo)
- **Galeria** — Lista de esboços com preview miniatura SVG, data e status de sincronização (✓/✗)
- **Offline First** — Todos os dados são gravados localmente primeiro e sincronizados com o Firestore quando houver conexão
- **Banner de status** — Avisa ao usuário quando está sem internet ou sincronizando

---

## Estrutura de Pastas

```
src/
├── navegacao/
│   └── Navegador.tsx         # Configuração de rotas tipadas
├── servicos/
│   └── configuracaoFirebase.ts  # Firebase Auth + Firestore
└── telas/
    ├── TelaLogin.tsx         # Login com Firebase Auth
    ├── TelaCadastro.tsx      # Cadastro com Firebase Auth
    ├── TelaGaleria.tsx       # Listagem + sync automático
    └── TeladeDesenho.tsx     # Canvas + lógica Offline-First
```

---

## Estratégia Offline First

```
Usuário salva desenho
        │
        ▼
[1] Salva no AsyncStorage  ←── sempre, com ou sem internet
        │
        ▼
[2] Checa conexão (NetInfo)
        │
   ┌────┴────┐
   │         │
  SIM       NÃO
   │         │
   ▼         ▼
[3a] Envia  [3b] marca sincronizado: false
  Firestore       (fica na fila)
   │
   ▼
[4] marca sincronizado: true
        │
        ▼
[5] Ao abrir a Galeria com internet:
    sincronizarPendentes() varre o AsyncStorage
    e envia automaticamente os que estão na fila
```

---

## Tecnologias

| Tecnologia | Uso |
|---|---|
| React Native + Expo | Interface mobile |
| React Navigation | Navegação entre telas |
| react-native-svg | Canvas de desenho |
| react-native-gesture-handler | Gestos de toque |
| AsyncStorage | Armazenamento local (Offline First) |
| Firebase Authentication | Login e cadastro de usuários |
| Firebase Firestore | Sincronização dos desenhos na nuvem |
| NetInfo | Detecção de conectividade em tempo real |

---

## Como rodar

```bash
# Instalar dependências
npm install

# Iniciar com Expo Go
npm start
```

Escanear o QR code com o aplicativo **Expo Go** no celular.

> **Credenciais de teste:** qualquer e-mail/senha cadastrado no Firebase, ou entre como visitante.

---

## Fluxo de Telas

```
Login → Galeria → Tela de Desenho → Salvar → Galeria
         ↑_______________________________↑
                (sincronização automática)
```

---

## Demonstração Offline

1. Ative o **modo avião** no celular
2. Abra o app → o banner laranja aparece: *"Sem internet"*
3. Desenhe e salve → o esboço é gravado localmente com ❌
4. Desative o modo avião
5. Abra a galeria → o banner azul aparece: *"Sincronizando..."*
6. O ícone vira ✅ — sincronizado com o Firestore!

---

## Equipe

Projeto desenvolvido como trabalho para a disciplina de desenvolvimento mobile pelos alunos:
- **Vitor Camargo Kunicki**
- **Nicolas Urban**
- **Miguel Ribas JR**