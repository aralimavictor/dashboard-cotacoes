# 💰 Dashboard de Cotações
 
Dashboard financeiro em tempo real com cotações de moedas e criptomoedas, alimentado por automação via n8n e banco de dados Supabase.
 
## 🔗 Demo
 
[dashboard-cotacoes.vercel.app](https://dashboard-cotacoes.vercel.app)
 
---
 
## ✨ Funcionalidades
 
- 📈 Cotações em tempo real de USD, EUR, BTC e ETH
- ⚡ Atualização instantânea via Supabase Realtime
- 📊 Gráficos históricos separados por moedas e cripto
- 📉 Indicadores de máxima e mínima do dia
- 📰 Aba de notícias financeiras internacionais
- 🌙 Modo escuro / claro
- 📱 Layout responsivo para mobile e desktop
- 🤖 Automação com n8n buscando dados a cada 5 minutos
---
 
## 🛠️ Stack
 
| Camada | Tecnologia |
|---|---|
| Frontend | React + TypeScript + Vite + Tailwind CSS |
| Gráficos | Recharts |
| Banco de dados | Supabase (PostgreSQL) |
| Realtime | Supabase Realtime (WebSocket) |
| Automação | n8n |
| Notícias | NewsData.io API |
| Deploy Frontend | Vercel |
| Deploy n8n | Railway |
 
---
 
## 🏗️ Arquitetura
 
```
[n8n - Railway]
    ├── CoinGecko API  →  BTC, ETH
    └── Frankfurter API →  USD, EUR
           ↓ (a cada 5 minutos)
      [Supabase DB]
           ↓ (Realtime WebSocket)
   [React Dashboard - Vercel]
```
 
---
 
## 📁 Estrutura do projeto
 
```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── AbaNoticias.tsx       # Aba de notícias financeiras
│   │   ├── CotacaoCard.tsx       # Card com valor, variação, max/min
│   │   ├── GraficoHistorico.tsx  # Gráficos separados moedas/cripto
│   │   └── TabelaCotacoes.tsx    # Tabela de últimos registros
│   ├── hooks/
│   │   └── useDarkMode.ts        # Hook de modo escuro
│   ├── lib/
│   │   └── supabase.ts           # Cliente Supabase
│   ├── types/
│   │   └── cotacao.ts            # Interface Cotacao
│   ├── App.tsx
│   └── index.css
├── .env
├── index.html
├── package.json
└── vite.config.ts
```
 
---
 
## 🗄️ Banco de dados
 
```sql
create table cotacoes (
  id uuid default gen_random_uuid() primary key,
  moeda text not null,       -- 'USD', 'EUR', 'BTC', 'ETH'
  valor numeric not null,    -- valor em BRL
  variacao numeric,          -- variação percentual
  criado_em timestamptz default now()
);
```
 
---
 
## ⚙️ Variáveis de ambiente
 
Crie um arquivo `.env` na raiz do `frontend/`:
 
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon
VITE_GNEWS_API_KEY=sua_chave_newsdata
```
 
---
 
## 🚀 Como rodar localmente
 
### Pré-requisitos
 
- Node.js 18+
- Docker (para o n8n)
- Conta no Supabase
### Frontend
 
```bash
cd frontend
npm install
npm run dev
```
 
Acesse em `http://localhost:5173`
 
### n8n (automação)
 
```bash
docker compose up -d
```
 
Acesse em `http://localhost:5678`
 
---
 
## 🤖 Workflow n8n
 
O workflow roda automaticamente a cada 5 minutos:
 
```
[Schedule Trigger - 5min]
    ├── HTTP Request → CoinGecko (BTC, ETH)
    └── HTTP Request → Frankfurter (USD, EUR)
           ↓
      [Merge - Append]
           ↓
   [Code - formata os dados]
           ↓
   [Supabase - Insert na tabela cotacoes]
```
 
---
 
## 📦 Deploy
 
### Frontend → Vercel
 
1. Conecta o repositório no [vercel.com](https://vercel.com)
2. Adiciona as variáveis de ambiente
3. Deploy automático a cada push na branch `main`
### n8n → Railway
 
1. Deploy da imagem `n8nio/n8n:latest` no [railway.app](https://railway.app)
2. Configura as variáveis de ambiente:
```
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=sua_senha
GENERIC_TIMEZONE=America/Sao_Paulo
N8N_HOST=seu-dominio.up.railway.app
WEBHOOK_URL=https://seu-dominio.up.railway.app/
```
