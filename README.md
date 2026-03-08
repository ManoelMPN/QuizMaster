# Quiz Master - Guia de Instalação e Hospedagem

Este guia explica como rodar o Quiz Master fora do ambiente de desenvolvimento atual e como hospedá-lo gratuitamente para até 500 pessoas.

## 🚀 Como rodar localmente

1. **Pré-requisitos**:
   - Node.js (v18 ou superior) instalado.
   - NPM ou Yarn.

2. **Instalação**:
   ```bash
   # Clone o repositório ou baixe os arquivos
   cd quiz-master

   # Instale as dependências
   npm install
   ```

3. **Configuração**:
   - Crie um arquivo `.env` na raiz do projeto:
     ```env
     JWT_SECRET=sua_chave_secreta_aqui
     NODE_ENV=production
     ```

4. **Execução**:
   ```bash
   # Para desenvolvimento (com recarregamento automático)
   npm run dev

   # Para produção
   npm run build
   npm start
   ```

---

## ☁️ Hospedagem Gratuita para 500+ Pessoas

Para aguentar 500 pessoas simultâneas com WebSockets (tempo real), você precisa de uma infraestrutura que suporte conexões persistentes.

### 1. Render (Recomendado) - [render.com](https://render.com)
O Render oferece um plano gratuito para Web Services que suporta WebSockets.
- **Vantagem**: Fácil de configurar, suporta Node.js nativamente.
- **Dica para 500 pessoas**: O plano gratuito pode ter limites de memória. Se o quiz for muito pesado, considere o plano "Starter" ($7/mês), mas para 500 conexões simples de WebSocket, o Render costuma performar bem.

### 2. Railway - [railway.app](https://railway.app)
Excelente para apps com WebSockets e Banco de Dados.
- **Vantagem**: Modelo de cobrança por uso. Você ganha $5 de crédito grátis por mês, o que é suficiente para rodar um quiz de grande porte por várias horas.

### 3. Fly.io - [fly.io](https://fly.io)
Roda seu app em "micro-VMs" próximas aos usuários.
- **Vantagem**: Extremamente rápido e baixa latência.
- **Configuração**: Requer um cartão de crédito para verificação, mas tem um nível gratuito generoso.

---

## 🛠️ Dicas de Otimização para Escala

1. **Banco de Dados**: O projeto usa SQLite (`quiz.db`). Para 500 pessoas, o SQLite é excelente pois é rápido e não requer um servidor separado. Apenas certifique-se de que o volume onde o arquivo `.db` reside seja persistente.
2. **WebSockets**: O servidor está configurado para broadcast simples. Para otimizar, evite enviar mensagens muito grandes. O código atual já envia apenas o necessário.
3. **Frontend**: O build do Vite gera arquivos estáticos. Use um CDN (como o que o Render/Railway oferecem automaticamente) para servir esses arquivos, liberando o servidor Node.js para focar apenas nos WebSockets.

---

## 📱 Responsividade do QR Code
O sistema já foi atualizado para que o QR Code se ajuste automaticamente ao tamanho da tela, garantindo que nunca seja cortado em dispositivos móveis.
