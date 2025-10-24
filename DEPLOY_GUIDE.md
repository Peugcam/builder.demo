# 🚀 Guia de Deploy - Builder Hub

Este guia detalha o processo completo de deploy do Builder Hub no Vercel.

---

## 📋 Pré-requisitos

- [ ] Conta no [GitHub](https://github.com)
- [ ] Conta no [Vercel](https://vercel.com)
- [ ] Conta no [Supabase](https://supabase.com)
- [ ] Projeto Builder Hub no seu GitHub

---

## 🗄️ Passo 1: Configurar Supabase

### 1.1 Criar Projeto

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Preencha:
   - **Name:** builder-hub-db
   - **Database Password:** [escolha uma senha forte]
   - **Region:** South America (São Paulo) - Melhor latência para Brasil
4. Aguarde criação (~2 minutos)

### 1.2 Executar Schema SQL

1. No painel do Supabase, vá em **SQL Editor**
2. Clique em "+ New Query"
3. Copie **todo o conteúdo** de `supabase-schema.sql`
4. Cole no editor
5. Clique em **Run** (ou Ctrl+Enter)
6. ✅ Verifique se apareceu "Success"

### 1.3 Obter Credenciais

1. Vá em **Settings** → **API**
2. Copie:
   - **Project URL** (algo como: `https://xxxxx.supabase.co`)
   - **anon public** key (longa string começando com `eyJ...`)

**⚠️ IMPORTANTE:** Guarde essas credenciais - você vai precisar!

---

## 📤 Passo 2: Preparar Repositório Git

### 2.1 Inicializar Git (se ainda não fez)

```bash
cd builder-hub-demo
git init
git add .
git commit -m "🚀 Initial commit - Builder Hub"
```

### 2.2 Criar Repositório no GitHub

1. Acesse [github.com/new](https://github.com/new)
2. Nome: `builder-hub-demo`
3. **Não** inicialize com README (já temos um)
4. Clique em "Create repository"

### 2.3 Push para GitHub

```bash
git remote add origin https://github.com/SEU-USUARIO/builder-hub-demo.git
git branch -M main
git push -u origin main
```

✅ Confirme que o código está no GitHub

---

## ☁️ Passo 3: Deploy no Vercel

### 3.1 Importar Projeto

1. Acesse [vercel.com](https://vercel.com)
2. Clique em **Add New...** → **Project**
3. Conecte sua conta GitHub (se ainda não conectou)
4. Selecione o repositório `builder-hub-demo`
5. Clique em **Import**

### 3.2 Configurar Build

O Vercel detecta automaticamente que é Next.js. Confirme as configurações:

- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

### 3.3 Configurar Environment Variables

⚠️ **CRUCIAL** - Sem isso, o app não funciona!

Clique em **Environment Variables** e adicione:

| Name                            | Value                       |
| ------------------------------- | --------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` (sua chave)   |

**Environment:** Selecione `Production`, `Preview`, e `Development`

### 3.4 Deploy!

1. Clique em **Deploy**
2. Aguarde ~2-3 minutos
3. 🎉 Verá "Congratulations!" quando terminar

---

## ✅ Passo 4: Verificação

### 4.1 Acessar Site

1. Clique no link da Vercel (algo como `builder-hub-demo.vercel.app`)
2. Deve aparecer a homepage do Builder Hub

### 4.2 Testar Funcionalidades

- [ ] Homepage carrega
- [ ] Navegar para /forum
- [ ] Navegar para /projects
- [ ] Navegar para /dashboard
- [ ] Clicar em "Cadastrar"
- [ ] Criar uma conta de teste
- [ ] Fazer login

### 4.3 Resolver Problemas Comuns

**Erro: "Supabase client error"**

- ✅ Verifique se as env vars estão corretas no Vercel
- ✅ Confirme que executou o SQL schema no Supabase

**Erro 500 no cadastro**

- ✅ Certifique-se que a tabela `builder_profiles` existe
- ✅ Verifique RLS policies no Supabase (Table Editor → Policies)

**Página em branco**

- ✅ Veja os logs no Vercel: Dashboard → Deployments → [última] → Functions
- ✅ Abra console do navegador (F12) para ver erros

---

## 🔄 Deploys Futuros (CI/CD Automático)

Após o setup inicial, todo deploy é automático:

```bash
# 1. Faça mudanças no código
# 2. Commit
git add .
git commit -m "✨ Adiciona feature X"

# 3. Push
git push origin main

# 4. Vercel faz deploy automático! 🎉
```

Você receberá:

- ✅ Email de confirmação
- ✅ Preview URL para testar
- ✅ Deploy em produção automático

---

## 🌐 Configurar Domínio Personalizado (Opcional)

### No Vercel:

1. Vá em **Settings** → **Domains**
2. Adicione seu domínio (ex: `builderhub.com`)
3. Siga instruções para atualizar DNS

### DNS Records (exemplo):

```
A     @       76.76.21.21
CNAME www     cname.vercel-dns.com
```

---

## 📊 Monitoramento

### Vercel Analytics

1. Vá em **Analytics** no painel Vercel
2. Veja:
   - Tráfego em tempo real
   - Performance (Web Vitals)
   - Países de origem

### Supabase Metrics

1. Vá em **Database** → **Metrics**
2. Monitore:
   - API requests
   - Database connections
   - Storage usado

---

## 🛡️ Checklist de Segurança

Antes de mostrar para cliente:

- [ ] Variáveis de ambiente configuradas
- [ ] RLS habilitado em todas as tabelas
- [ ] Policies de segurança testadas
- [ ] HTTPS ativado (automático no Vercel)
- [ ] Domínio personalizado configurado (opcional)
- [ ] Analytics habilitado
- [ ] Backup do banco (Supabase faz automático)

---

## 💰 Custos Estimados

### Free Tier (Suficiente para Demo)

- **Vercel:** Grátis até 100GB bandwidth
- **Supabase:** Grátis até 500MB database + 50K users
- **GitHub:** Grátis para repos públicos

### Quando escalar

- **Vercel Pro:** $20/mês (custom domains, mais performance)
- **Supabase Pro:** $25/mês (mais recursos, backup point-in-time)

**Para demo/protótipo:** Free tier é suficiente! ✅

---

## 🆘 Suporte

### Documentação Oficial

- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)

### Comunidades

- [Vercel Discord](https://vercel.com/discord)
- [Supabase Discord](https://discord.supabase.com)

---

## ✅ Checklist Final

Antes de enviar para o cliente:

- [ ] Deploy funcionando em produção
- [ ] Todas as páginas carregam corretamente
- [ ] Cadastro e login funcionam
- [ ] Dashboard mostra estatísticas
- [ ] Fórum e Projetos acessíveis
- [ ] URL pública pronta para compartilhar
- [ ] README atualizado com URL de produção
- [ ] Screenshots tirados para documentação

---

**🎉 Parabéns! Seu Builder Hub está no ar!**

Agora você pode compartilhar:

```
🔗 Demo ao vivo: https://builder-hub-demo.vercel.app
📁 Código fonte: https://github.com/seu-usuario/builder-hub-demo
```

---

Criado com 💙 para demonstração Cultura Builder
