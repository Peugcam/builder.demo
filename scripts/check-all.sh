#!/bin/bash

# Builder Hub - Verificação Completa de Qualidade
# Executa todos os checks antes de fazer commit/push

set -e

echo "🔍 Builder Hub - Verificação Completa"
echo "====================================="
echo ""

# Lint
echo "1️⃣  Executando ESLint..."
npm run lint
echo "✅ Lint passou"
echo ""

# Type check
echo "2️⃣  Executando type check..."
npm run type-check
echo "✅ Type check passou"
echo ""

# Format check
echo "3️⃣  Verificando formatação..."
npm run format:check
echo "✅ Formatação ok"
echo ""

# Tests
echo "4️⃣  Executando testes..."
npm test -- --passWithNoTests
echo "✅ Testes passaram"
echo ""

# Build
echo "5️⃣  Fazendo build..."
npm run build
echo "✅ Build passou"
echo ""

# Success
echo "==========================================="
echo "✅ Todas as verificações passaram!"
echo "==========================================="
echo ""
echo "🚀 Você está pronto para commit/push!"
