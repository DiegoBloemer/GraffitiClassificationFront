# Graffiti Classification - Frontend

Sistema de classificação e registro de pichações relacionadas a facções criminosas.

## 🚀 Tecnologias Utilizadas

- **React 19** com **Vite** - Framework e build tool
- **React Router DOM** - Roteamento SPA
- **Tailwind CSS v4** - Estilização utility-first
- **Lucide React** - Biblioteca de ícones
- **Recharts** - Gráficos analíticos (pizza, barras e empilhado)
- **React Simple Maps + D3 Scale** - Visualizações geográficas (mapa de calor em desenvolvimento)
- **Context API** - Gerenciamento de estado global

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── dashboard/
│   │   └── DashboardPage.jsx        # Página analítica do dashboard
│   ├── layout/
│   │   ├── Layout.jsx               # Layout principal com sidebar
│   │   └── Sidebar.jsx              # Menu de navegação lateral
│   ├── ui/
│   │   ├── Modal.jsx                # Modal genérico reutilizável
│   │   ├── ConfirmDialog.jsx        # Modal de confirmação
│   │   ├── Toast.jsx                # Componente de notificação
│   │   └── ToastContainer.jsx       # Container de toasts
│   ├── faccoes/
│   │   ├── GangsPage.jsx            # Página de gestão de facções
│   │   └── GangFormModal.jsx        # Modal de formulário de facção
│   └── pichacoes/
│       ├── GraffitisPage.jsx        # Página de listagem de pichações
│       ├── GraffitiFormModal.jsx    # Modal de cadastro de pichação
│       └── GraffitiDetailModal.jsx  # Modal de detalhes e edição
├── contexts/
│   └── ToastContext.jsx             # Context para sistema de notificações
├── hooks/
│   └── useToast.js                  # Custom hook para toasts
├── services/
│   ├── api.js                      # Configuração central da URL da API
│   ├── dashboardService.js         # Serviço de API do dashboard
│   ├── gangService.js              # Serviço de API para facções
│   └── graffitiService.js          # Serviço de API para pichações
├── App.jsx                         # Definição de rotas
├── main.jsx                        # Ponto de entrada
└── index.css                       # Estilos globais e animações
```

## 🎯 Funcionalidades

### Dashboard Analítico (/dashboard)
- ✅ Cards de resumo (pichações, facções, nível predominante)
- ✅ Gráfico de pizza por facção
- ✅ Gráfico de barras por estado
- ✅ Gráfico de barras empilhadas por estado e facção
- ✅ Mapa de calor em desenvolvimento (placeholder informativo)

### Gestão de Facções (/faccoes)
- ✅ Listagem de facções cadastradas
- ✅ Busca/filtro por nome ou sigla
- ✅ Cadastro de nova facção (modal)
- ✅ Edição de facção existente (modal)
- ✅ Exclusão de facção (com confirmação)
- ✅ Validação de exclusão (impede se houver pichações vinculadas)

### Gestão de Pichações (/pichacoes)
- ✅ Listagem em grid com cards visuais
- ✅ Upload de imagem (multipart/form-data)
- ✅ Cadastro completo com localização
- ✅ Visualização de detalhes (modal)
- ✅ Edição inline no modal de detalhes
- ✅ Exclusão de pichação (com confirmação)
- ✅ Exibição de nível de ameaça com cores
- ✅ Vinculação com facção

## 🔧 Instalação e Execução

### Pré-requisitos
- Node.js 18+ instalado
- Backend (.NET 8) rodando em `http://localhost:5219`

### Passos

1. **Instalar dependências** (já instaladas):
```bash
npm install
```

2. **Iniciar o servidor de desenvolvimento**:
```bash
npm run dev
```

3. **Acessar a aplicação**:
```
http://localhost:5173
```

## 🎨 Padrões de Design Implementados

### Sistema de Notificações (Toast)
- Context API para estado global
- Custom Hook `useToast()` para facilitar uso
- Toasts com auto-dismiss (4 segundos)
- Variações: sucesso (verde), erro (vermelho), info (azul)
- Animação de entrada suave

### Modais Reutilizáveis
- Componente `Modal` base genérico
- Backdrop com bloqueio de scroll
- Fechamento via ESC ou clique fora
- Tamanhos configuráveis (sm, md, lg, xl)
- Animação fade-in

### Layout com Sidebar
- Navegação lateral fixa
- Indicação visual de página ativa
- Área de conteúdo responsiva
- Ícones do Lucide em todos os botões

### Dashboard Analítico
- Visualizações responsivas com Recharts
- Estados de carregamento e vazio padronizados
- Paleta consistente para facções e níveis de ameaça

### Comunicação com API
- Serviços centralizados (`gangService`, `graffitiService`, `dashboardService`)
- Base URL centralizada em [GraffitiClassificationFront/src/services/api.js](GraffitiClassificationFront/src/services/api.js) com suporte a `VITE_API_URL`
- Tratamento de erros com mensagens retornadas pela API
- Tratamento de erros consistente
- Upload de arquivos via FormData
- Feedback visual via toasts

## 🔌 Integração com Backend

### Endpoints Utilizados

**Facções (Gangs)**
- `GET /api/gangs` - Listar todas
- `GET /api/gangs/{id}` - Buscar por ID
- `POST /api/gangs` - Criar nova
- `PUT /api/gangs/{id}` - Atualizar
- `DELETE /api/gangs/{id}` - Excluir

**Pichações (Graffitis)**
- `GET /api/graffitis` - Listar todas
- `GET /api/graffitis/{id}` - Buscar por ID
- `POST /api/graffitis` - Criar nova (multipart/form-data)
- `PUT /api/graffitis/{id}` - Atualizar
- `DELETE /api/graffitis/{id}` - Excluir

**Dashboard**
- `GET /api/Dashboard/summary` - Resumo geral
- `GET /api/Dashboard/graffitis-by-gang` - Pichações por facção
- `GET /api/Dashboard/graffitis-by-state` - Pichações por estado
- `GET /api/Dashboard/graffitis-by-gang-and-state` - Pichações por estado e facção

### Configuração da URL da API

Para alterar a URL base da API, edite os arquivos:

- [GraffitiClassificationFront/src/services/api.js](GraffitiClassificationFront/src/services/api.js)

Ou defina a variável de ambiente `VITE_API_URL` conforme necessário.

## 📝 Notas Importantes

1. **Imagens**: O backend retorna o caminho relativo da imagem. O frontend constrói a URL completa usando `API_BASE_URL`.

2. **CORS**: O backend deve ter CORS habilitado para permitir requisições do frontend.

3. **Validações**: O formulário de pichação valida todos os campos obrigatórios antes do envio.

4. **Responsividade**: O layout é responsivo e se adapta a diferentes tamanhos de tela.

## 🚀 Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos.
