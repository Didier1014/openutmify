# UTMify Clone — Estrutura Completa (Front + Backend)

Cópia funcional da plataforma de trackeamento avançado / server-side tracking do UTMify, reconstruída com base na engenharia reversa do webapp original (app.utmify.com.br).

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Front-end | SvelteKit + Tailwind CSS + Chart.js |
| Back-end | Node.js + TypeScript + Express |
| Banco | PostgreSQL + Prisma ORM |
| Cache/Filas | Redis (preparado para BullMQ) |
| Autenticação | JWT + bcrypt + 2FA (estrutura pronta) |
| Containerização | Docker + Docker Compose |

## Estrutura de Pastas

```
utmify-clone/
├── docker-compose.yml
├── README.md
├── backend/
│   ├── Dockerfile
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   ├── prisma/
│   │   ├── schema.prisma      (modelo de dados completo)
│   │   └── seed.ts            (dados de exemplo)
│   └── src/
│       ├── index.ts           (servidor Express)
│       ├── utils/prisma.ts    (cliente Prisma singleton)
│       ├── middleware/
│       │   ├── auth.ts        (JWT verify + generateToken)
│       │   └── error.ts       (handler global de erros)
│       ├── controllers/
│       │   ├── auth.controller.ts
│       │   ├── campaign.controller.ts
│       │   ├── dashboard.controller.ts
│       │   ├── event.controller.ts
│       │   ├── utm.controller.ts
│       │   └── report.controller.ts
│       ├── services/
│       │   └── auth.service.ts
│       └── routes/
│           ├── auth.routes.ts
│           ├── campaign.routes.ts
│           ├── dashboard.routes.ts
│           ├── event.routes.ts
│           ├── utm.routes.ts
│           └── report.routes.ts
└── frontend/
    ├── Dockerfile
    ├── package.json
    ├── svelte.config.js
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── tsconfig.json
    └── src/
        ├── app.css            (Tailwind + componentes customizados)
        ├── app.html
        ├── routes/
        │   ├── +layout.svelte         (root, importa CSS)
        │   ├── +page.svelte           (login)
        │   └── dashboard/
        │       ├── +layout.svelte     (sidebar + header)
        │       ├── resumo/+page.svelte (dashboard principal)
        │       ├── meta/+page.svelte  (campanhas Meta)
        │       ├── utms/+page.svelte  (relatório de UTMs)
        │       └── eventos/+page.svelte (funil do pixel)
        └── lib/
            ├── components/
            │   ├── Sidebar.svelte
            │   ├── KpiCard.svelte
            │   └── ...
            ├── stores/
            └── utils/
```

## Funcionalidades Implementadas

### Front-end
- [x] Login / autenticação com JWT (armazenado em localStorage)
- [x] Sidebar de navegação (Resumo, Meta, Google, Kwai, TikTok, Taboola, UTMs, Regras, Taxas, Despesas, Relatórios, Pedidos, Eventos, Notificações, Assinatura, Minha conta, Avançado, etc.)
- [x] Dashboard Resumo com KPIs (Faturamento Líquido, Lucro, ROAS, MRR, ARR, Taxa de Churn, Assinantes Ativos, Custo por Lead)
- [x] Gráfico de Lucro por Horário (00:00–23:00)
- [x] Vendas por Pagamento (Pix, Cartão, Boleto)
- [x] Tabela de campanhas Meta com toggle de status (ligar/desligar)
- [x] Filtros: Nome, Status, Período, Conta de Anúncio, Produto
- [x] Relatório de UTMs (agrupado por utm_campaign, fonte, meio, produto, conta)
- [x] Eventos do pixel (PageView, ViewContent, Lead, AddToCart, InitiateCheckout, Purchase)
- [x] Tema escuro por padrão, seletor claro/escuro

### Back-end
- [x] `POST /api/auth/register` — Cadastro
- [x] `POST /api/auth/login` — Login (retorna JWT)
- [x] `GET /api/auth/me` — Perfil do usuário logado
- [x] `GET /api/campaigns` — Listar campanhas (com filtros)
- [x] `GET /api/campaigns/accounts` — Contas de anúncio conectadas
- [x] `GET /api/campaigns/:id` — Detalhe da campanha
- [x] `PATCH /api/campaigns/:id/status` — Ligar/desligar campanha
- [x] `PATCH /api/campaigns/:id/budget` — Atualizar orçamento
- [x] `GET /api/dashboard/summary` — KPIs do resumo
- [x] `GET /api/dashboard/profit-by-hour` — Lucro por hora
- [x] `POST /api/events/track` — Receber evento do pixel (client ou S2S)
- [x] `GET /api/events/` — Listar eventos
- [x] `GET /api/events/funnel` — Funil de eventos
- [x] `GET /api/utms/report` — Relatório de UTMs
- [x] `GET /api/reports/daily` — Relatório diário

### Banco de dados (Prisma)
- [x] User, AdAccount, Campaign, AdSet, Ad
- [x] PixelEvent, Sale, CampaignMetric
- [x] Subscription, Rule, NotificationSetting

## Como Rodar

### Opção 1: Docker Compose (recomendado)

```bash
cd C:/Users/asus/utmify-clone

# Copie o arquivo de ambiente do backend
cp backend/.env.example backend/.env

# Suba todos os serviços
docker-compose up --build
```

Acessos:
- Front-end: http://localhost:5173
- Back-end API: http://localhost:3333
- Health check: http://localhost:3333/health
- Banco (PostgreSQL): localhost:5432 (usuário: utmify, senha: utmify123, banco: utmify)

### Opção 2: Manual (sem Docker)

**Back-end:**
```bash
cd backend
cp .env.example .env
# Edite o DATABASE_URL se necessário
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed   # popula dados de exemplo
npm run dev           # roda na porta 3333
```

**Front-end:**
```bash
cd frontend
npm install
npm run dev           # roda na porta 5173
```

### Credenciais de teste (após seed)

- E-mail: `matuevampiro123@gmail.com`
- Senha: `Didier!semana1973!`

## Próximos Passos Sugeridos

1. Conectar OAuth real das redes (Meta, Google, TikTok, Taboola, Kwai)
2. Implementar webhooks de Conversions API (Meta CAPI, Google Ads, etc.)
3. Adicionar exportação CSV/Excel nos relatórios
4. Implementar notificações push (app móvel / PWA)
5. Adicionar regras de automação (ligar/desligar campanhas por CPA/ROAS)
6. Integrar Stripe ou similar para cobrança de assinaturas

## Licença

Projeto de estudo/reconstrução baseado em engenharia reversa do UTMify. Não é afiliado ao UTMify oficial.
