# Pintadasso — Caderno de Esboços Digital

Projeto desenvolvido como trabalho para a disciplina de desenvolvimento mobile pelos alunos:
- **Vitor Camargo Kunicki**
- **Nicolas Urban**
- **Miguel Ribas JR**

---

## 🎯 Tema e Problema
**Problema:** Estudantes de arte, designers e entusiastas muitas vezes não têm um caderno físico no momento em que a inspiração bate.  
**Proposta de Valor:** Oferecer um caderno de esboços digital de bolso, com ferramentas de desenho, que funciona **100% offline** e sincroniza automaticamente com a nuvem quando a conexão é restabelecida.

![Firebase Funcionando](./assets/firebase/firebase.png)

---

## ✅ Atendimento aos Requisitos do Projeto

O Pintadasso foi construído com foco na arquitetura **Offline First**, cumprindo todos os requisitos e objetivos propostos para o MVP:

### 1. Implementação no React Native com Expo
A interface foi totalmente desenvolvida em React Native (usando TypeScript), garantindo navegação fluida entre telas (Login, Cadastro, Galeria e Desenho) com `react-navigation`. O Canvas de desenho utiliza `react-native-svg` aliado a captura de gestos (`react-native-gesture-handler`).

### 2. Integração com Firebase
- **Autenticação:** O sistema possui login e cadastro integrados com o Firebase Authentication.
- **Persistência Remota:** Os dados dos desenhos são salvos no banco de dados Firestore (Firebase) vinculados à conta de cada usuário. O Firebase também envia os desenhos salvos anteriormente na nuvem de volta ao dispositivo, garantindo continuidade do fluxo de trabalho em outros aparelhos.

### 3. Persistência Local e Offline First
O pilar do aplicativo. Mesmo sem internet (modo avião ativado), o aplicativo mantém 100% de sua utilidade primária:
- **Armazenamento:** Todo desenho é salvo primariamente de forma local usando o `AsyncStorage`.
- **Offline First:** O aplicativo não trava sem conexão; ele salva o dado localmente e altera o ícone de status do desenho para pendente de sincronização (❌).

### 4. Estratégia de Sincronização
A regra de sincronização implementada (bidirecional) funciona da seguinte forma:
1. Ao salvar um desenho offline, ele entra em uma "fila" no AsyncStorage.
2. Sempre que a tela da Galeria é aberta, o app detecta a conexão em tempo real (`NetInfo`).
3. Existindo conexão, o app automaticamente lê a fila local, faz o envio pro Firebase, altera o status visual para ✅ e atualiza o cache local.
4. Ele também faz o *download* automático de esboços do Firestore que ainda não estavam na memória local.

### 5. Tratamento Básico de Estados
Foram previstos alertas visuais para os diferentes estados do ciclo de vida:
- **Carregamento:** *Spinners* (ActivityIndicator) durante salvamentos e bloqueio de botões.
- **Ausência de Conexão:** Banners informativos no topo da Galeria ("Sem internet", "Sincronizando...").
- **Sucesso e Erro:** Alertas/pop-ups para confirmar exclusão, limpeza da tela e avisos de falhas.

---

## 🚀 Como rodar o projeto

```bash
# 1. Instale as dependências
npm install

# 2. Inicie o servidor do Expo
npm start
```
No terminal, pressione `w` para abrir no navegador web ou leia o QRCode com o aplicativo **Expo Go** no seu celular.