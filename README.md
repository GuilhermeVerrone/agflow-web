# AgFlow Web - Frontend

Sistema de agendamento multi-tenant construído com Next.js 15 (App Router), React 19 e TanStack Query.

## 🚀 Stack Tecnológica

- **Next.js 15.1** - Framework React com App Router
- **React 19** - Biblioteca UI
- **TypeScript 5** - Type safety
- **TanStack Query 5.62** - Server state management
- **Axios 1.7** - HTTP client
- **Tailwind CSS 3.4** - Styling
- **date-fns 4.1** - Date manipulation
- **Zod 3.24** - Schema validation
- **lucide-react** - Icons

## 📁 Estrutura do Projeto

```
agflow-web/
├── app/                        # Next.js App Router
│   ├── layout.tsx             # Root layout (providers wrapper)
│   ├── page.tsx               # Home page (redirect to /login)
│   ├── globals.css            # Global styles
│   ├── providers.tsx          # React Query + Auth providers
│   ├── login/
│   │   └── page.tsx           # Login page
│   ├── dashboard/
│   │   ├── layout.tsx         # Dashboard layout (protected)
│   │   └── page.tsx           # Dashboard home
│   └── book/
│       └── [slug]/
│           └── page.tsx       # Public booking page
├── components/                 # React components
├── services/                   # API service layer
│   ├── api.ts                 # Axios client with JWT interceptor
│   ├── auth.service.ts        # Authentication API calls
│   ├── tenant.service.ts      # Tenant management
│   ├── appointment.service.ts # Appointment management
│   └── feature.service.ts     # Feature management
├── hooks/                      # Custom React hooks
│   ├── use-appointments.ts    # Appointment hooks (TanStack Query)
│   ├── use-features.ts        # Feature hooks
│   └── use-tenants.ts         # Tenant hooks
├── store/                      # Global state
│   └── auth-context.tsx       # Auth context + provider
├── types/                      # TypeScript interfaces
│   ├── api.ts                 # API entities (User, Tenant, etc.)
│   └── auth.ts                # Auth types
├── lib/                        # Utility functions
└── .env.local                 # Environment variables
```

## 🔧 Configuração

### 1. Instalar dependências

As dependências já foram instaladas. Se precisar reinstalar:

```bash
npm install
```

### 2. Configurar variáveis de ambiente

O arquivo `.env.local` já está configurado:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

### 3. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:3001

## 🎯 Funcionalidades Implementadas

### Autenticação
- ✅ Login com JWT
- ✅ Context de autenticação (AuthContext)
- ✅ Protected routes (dashboard)
- ✅ Token storage no localStorage
- ✅ Auto-redirect ao expirar token

### Dashboard Administrativo
- ✅ Layout protegido com header + navigation
- ✅ Dashboard home com estatísticas
- ✅ Lista de agendamentos do dia
- ✅ Widgets de métricas (hoje, mês, plano)
- ✅ Ações rápidas (novo agendamento, ver página pública)

### Página Pública de Agendamento
- ✅ Acesso via `/book/[tenant-slug]`
- ✅ Seletor de datas (próximos 7 dias)
- ✅ Lista de horários disponíveis (integração com API)
- ✅ Formulário de agendamento
- ✅ Confirmação visual

### API Service Layer
- ✅ Axios client com interceptors JWT
- ✅ Auto-adiciona `Authorization: Bearer <token>` header
- ✅ Auto-adiciona `x-tenant-id` header (multi-tenant)
- ✅ Logout automático em erro 401
- ✅ Services para: Auth, Tenant, Appointment, Feature

### TanStack Query Hooks
- ✅ `useAppointments()` - Lista agendamentos
- ✅ `useCreateAppointment()` - Criar agendamento
- ✅ `useUpdateAppointment()` - Atualizar agendamento
- ✅ `useDeleteAppointment()` - Deletar agendamento
- ✅ `useAvailableSlots()` - Slots disponíveis (público)
- ✅ `useTenantBySlug()` - Buscar tenant por slug
- ✅ `useFeatures()` - Listar features
- ✅ Cache invalidation automática

## 🧪 Testando o Sistema

### Pré-requisitos

1. **Backend rodando**: `http://localhost:3000`
2. **Database migrada**: Execute `npm run prisma:migrate` no backend
3. **Seed executado**: Popula features padrão e tenant de teste

### Fluxo de Teste

#### 1. Criar Tenant (via API ou Swagger)

```bash
# Via API
curl -X POST http://localhost:3000/api/v1/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Empresa Teste",
    "slug": "empresa-teste",
    "plan": "SILVER"
  }'

# Ou acesse: http://localhost:3000/api/docs (Swagger UI)
```

Guarde o `id` do tenant criado.

#### 2. Registrar Usuário

Na página de login (`http://localhost:3001/login`), clique em "Criar conta" (ou via API):

```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@teste.com",
    "name": "Admin Teste",
    "password": "senha123",
    "tenantId": "<ID_DO_TENANT>",
    "role": "ADMIN"
  }'
```

#### 3. Fazer Login

Acesse `http://localhost:3001/login` e preencha:
- **Tenant ID**: `<ID_DO_TENANT>`
- **E-mail**: `admin@teste.com`
- **Senha**: `senha123`

Você deve ser redirecionado para `/dashboard`.

#### 4. Testar Dashboard

- Visualize as métricas (agendamentos hoje, total mês, plano)
- Clique em "Ver Página Pública" para acessar `/book/empresa-teste`

#### 5. Testar Agendamento Público

Acesse: `http://localhost:3001/book/empresa-teste`

- Selecione uma data
- Escolha um horário disponível
- Preencha o formulário
- Clique em "Confirmar Agendamento"

Volte ao dashboard para ver o agendamento criado.

## 🔗 Integração com Backend

### Endpoints Consumidos

#### Autenticação
- `POST /auth/register` - Registrar usuário
- `POST /auth/login` - Login e obtenção de token JWT
- `GET /auth/profile` - Buscar perfil do usuário logado

#### Tenants
- `GET /tenants/slug/:slug` - Buscar tenant por slug (público)
- `GET /tenants/:id` - Buscar tenant por ID
- `GET /tenants` - Listar tenants

#### Agendamentos
- `GET /scheduling` - Listar agendamentos (autenticado)
- `POST /scheduling` - Criar agendamento (autenticado)
- `PATCH /scheduling/:id` - Atualizar agendamento
- `DELETE /scheduling/:id` - Deletar agendamento
- `GET /scheduling/public/:slug/available-slots` - Slots disponíveis (público)
- `POST /scheduling/public/:slug/appointments` - Criar agendamento (público)

#### Features
- `GET /features` - Listar features
- `GET /features/tenant/:tenantId/features` - Features do tenant
- `GET /features/tenant/:tenantId/check/:featureCode` - Verificar feature
- `POST /features/enable-for-tenant` - Habilitar feature
- `POST /features/disable-for-tenant` - Desabilitar feature

## 📦 Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento (porta 3001)
npm run build    # Build de produção
npm run start    # Inicia servidor de produção
npm run lint     # Executa ESLint
```

## 🎨 Customização

### Cores Tailwind

Edite `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: '#3b82f6',  // Azul
      secondary: '#64748b', // Cinza
    }
  }
}
```

### API URL

Edite `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://api.seudominio.com/api/v1
```

## 🔐 Segurança

- **JWT Storage**: Token armazenado no localStorage
- **Protected Routes**: Middleware de autenticação no layout do dashboard
- **Auto Logout**: Interceptor remove token em erro 401
- **CORS**: Configurado no backend (NestJS)

## 🚧 Próximos Passos

- [ ] Página de registro de usuário (app/register/page.tsx)
- [ ] Lista completa de agendamentos (app/dashboard/appointments/page.tsx)
- [ ] Formulário de criação de agendamento (app/dashboard/appointments/new/page.tsx)
- [ ] Gerenciamento de features (app/dashboard/features/page.tsx)
- [ ] Configurações do tenant (app/dashboard/settings/page.tsx)
- [ ] Notificações em tempo real (WebSocket)
- [ ] Dark mode
- [ ] Testes E2E (Playwright)

## 📚 Documentação Backend

- API Docs: http://localhost:3000/api/docs
- Architecture: `/agflow-general-api/README_ARCHITECTURE.md`
- Quickstart: `/agflow-general-api/QUICKSTART.md`

## 🔍 Troubleshooting

### Erro "Cannot find module '@tanstack/react-query-devtools'"

Devtools removidos do código. Sem ação necessária.

### Erro 401 ao fazer requisição

Verifique se:
1. Backend está rodando em `http://localhost:3000`
2. Token JWT está válido (check localStorage)
3. TenantId está correto

### Página pública não carrega horários

Verifique se:
1. Tenant com slug correto existe e está ativo
2. Backend tem a feature 'scheduling' habilitada para o tenant

## 📞 Contato

Para dúvidas ou sugestões, consulte a documentação do backend ou abra uma issue.
