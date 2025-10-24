#!/bin/bash

# Builder Hub - Script de Setup Automático
# Este script configura o ambiente de desenvolvimento completo

set -e  # Exit on error

echo "🚀 Builder Hub - Setup Automático"
echo "=================================="
echo ""

# Check Node.js version
echo "📦 Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Por favor instale Node.js 20+."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Node.js $NODE_VERSION detectado. Recomendado: Node.js 20+"
fi
echo "✅ Node.js $(node -v)"

# Check npm
echo ""
echo "📦 Verificando npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado."
    exit 1
fi
echo "✅ npm $(npm -v)"

# Install dependencies
echo ""
echo "📦 Instalando dependências..."
npm install

# Setup environment variables
echo ""
echo "🔐 Configurando variáveis de ambiente..."
if [ ! -f .env.local ]; then
    if [ -f .env.example ]; then
        cp .env.example .env.local
        echo "✅ Arquivo .env.local criado a partir de .env.example"
        echo "⚠️  IMPORTANTE: Edite .env.local com suas credenciais do Supabase!"
    else
        echo "⚠️  .env.example não encontrado. Crie .env.local manualmente."
    fi
else
    echo "✅ .env.local já existe"
fi

# Setup Git hooks (Husky)
echo ""
echo "🪝 Configurando Git hooks..."
if [ -d .git ]; then
    npx husky install 2>/dev/null || echo "⚠️  Husky já configurado"
    echo "✅ Git hooks configurados"
else
    echo "⚠️  Git não inicializado. Execute 'git init' primeiro."
fi

# Run type check
echo ""
echo "🔍 Verificando tipos TypeScript..."
npm run type-check

# Run linter
echo ""
echo "🧹 Verificando linting..."
npm run lint

# Build project
echo ""
echo "🏗️  Fazendo build do projeto..."
npm run build

# Success message
echo ""
echo "============================================"
echo "✅ Setup completo!"
echo "============================================"
echo ""
echo "📝 Próximos passos:"
echo ""
echo "1. Edite .env.local com suas credenciais do Supabase"
echo "2. Execute 'npm run dev' para iniciar o servidor"
echo "3. Acesse http://localhost:3000"
echo ""
echo "📚 Documentação:"
echo "   - README.md - Visão geral"
echo "   - CONTRIBUTING.md - Como contribuir"
echo "   - ARCHITECTURE.md - Arquitetura"
echo "   - PROFESSIONAL_SETUP.md - Setup profissional"
echo ""
echo "🚀 Bom desenvolvimento!"
