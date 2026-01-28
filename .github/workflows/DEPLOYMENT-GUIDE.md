# 🚀 Guia de Deploy com Testes Automáticos

## Situação Atual vs Nova Configuração

### ❌ ANTES (Situação Atual)
```
git push → Vercel Deploy Automático → Produção
```
**Problema**: Código vai direto para produção sem validação

### ✅ DEPOIS (Nova Configuração)
```
git push → GitHub Actions (CI) → Testes + Build → Vercel Deploy → Produção
                ↓
            Se falhar, você vê no GitHub
```

---

## 📋 Como Funciona Agora

### 1. **Quando você faz push para `main` ou `develop`:**
   - GitHub Actions roda automaticamente
   - Executa todos os testes (`npm test`)
   - Verifica se o build funciona (`npm run build`)
   - Gera relatório de cobertura

### 2. **Resultados:**
   - ✅ **Testes passam**: Deploy continua normal no Vercel
   - ❌ **Testes falham**: Você vê o erro no GitHub, mas Vercel ainda faz deploy

### 3. **Proteção Extra (Opcional):**
   Você pode configurar o Vercel para **bloquear deploys** se os testes falharem.

---

## ⚙️ Como Configurar Proteção no Vercel

### Opção 1: Via Dashboard do Vercel (Recomendado)

1. **Acesse**: https://vercel.com/dashboard
2. **Selecione seu projeto** (listagem)
3. **Vá em**: Settings → Git
4. **Encontre**: "Ignored Build Step"
5. **Configure**: 
   ```bash
   # Só faz deploy se os checks do GitHub passarem
   git diff HEAD^ HEAD --quiet -- '*.ts' '*.tsx' '*.js' '*.jsx' || exit 1
   ```

### Opção 2: Configurar GitHub Branch Protection

1. **Vá no GitHub**: Settings → Branches
2. **Add rule** para `main`
3. **Marque**:
   - ✅ Require status checks to pass before merging
   - ✅ CI - Tests and Quality / test
   - ✅ CI - Tests and Quality / build
4. **Salve**

---

## 🔄 Fluxo de Trabalho Recomendado

### Para Desenvolvimento Local
```bash
# 1. Trabalhe em uma branch
git checkout -b feature/nova-funcionalidade

# 2. Faça suas alterações
# ... código ...

# 3. Rode os testes localmente
npm test

# 4. Verifique se o build funciona
npm run build

# 5. Se tudo passar, commit e push
git add .
git commit -m "feat: nova funcionalidade"
git push origin feature/nova-funcionalidade
```

### Para Deploy em Produção
```bash
# Opção A: Pull Request (Mais Seguro)
1. Crie um PR no GitHub
2. GitHub Actions roda automaticamente
3. Revise os resultados dos testes
4. Se tudo passar, faça o merge
5. Vercel faz deploy automático

# Opção B: Push Direto (Atual)
git push origin main
# GitHub Actions roda testes em paralelo
# Vercel faz deploy (mas você vê se testes falharam no GitHub)
```

---

## 📊 Visualizando Resultados dos Testes

### No GitHub
1. Vá no repositório
2. Clique na aba **"Actions"**
3. Veja todos os testes executados:
   - ✅ Verdinho = Passou
   - ❌ Vermelho = Falhou
4. Clique em qualquer execução para ver detalhes

### Notificações
- **Email**: GitHub envia email se testes falharem
- **Status Badges**: Adicione ao README:
  ```markdown
  ![CI Status](https://github.com/seu-usuario/listagem/actions/workflows/ci.yml/badge.svg)
  ```

---

## 🛡️ Proteção Atual Implementada

### ✅ O que já está funcionando:
- Testes rodam automaticamente em cada push
- Workflow valida testes + build
- Relatório de cobertura gerado
- Logs disponíveis no GitHub Actions

### ⚠️ O que ainda não bloqueia deploy:
- Vercel ainda faz deploy mesmo se testes falharem
- Você precisa **manualmente** verificar o GitHub Actions

### 🎯 Para Bloquear Deploy Automático:
Siga as instruções em "⚙️ Como Configurar Proteção no Vercel" acima.

---

## 📝 Variáveis de Ambiente Necessárias

### No GitHub (Secrets)
Para os testes rodarem no CI, adicione no GitHub:

1. **Vá em**: Settings → Secrets and variables → Actions
2. **Adicione**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `CODECOV_TOKEN` (opcional, para relatórios de cobertura)

### Como adicionar:
```
Settings → Secrets and variables → Actions → New repository secret
```

---

## 🚨 Troubleshooting

### Problema: Testes passam local mas falham no CI
**Solução**: Verifique se as variáveis de ambiente estão configuradas no GitHub Secrets

### Problema: Build falha no CI
**Solução**: Rode `npm run build` localmente primeiro para ver o erro

### Problema: Workflow não roda
**Solução**: Verifique se o arquivo `.github/workflows/ci.yml` foi commitado corretamente

### Problema: Vercel ainda faz deploy com testes falhando
**Solução**: Configure branch protection ou ignored build step (veja seção "⚙️ Como Configurar")

---

## 📚 Próximos Passos Recomendados

1. ✅ **Agora**: Testes rodam, mas não bloqueiam
2. 🎯 **Próximo**: Configure branch protection no GitHub
3. 🔒 **Opcional**: Adicione mais testes críticos
4. 📊 **Futuro**: Configure E2E tests com Playwright

---

## 💡 Dicas

- **Sempre rode** `npm test` localmente antes de push
- **Use branches** para features novas
- **Crie PRs** para revisar código e ver testes rodarem
- **Monitore** a aba Actions no GitHub
- **Mantenha** os testes rápidos (<30s) para feedback rápido

---

## 🆘 Precisa de Ajuda?

- **Ver logs**: GitHub → Actions → Clique na execução que falhou
- **Rodar local**: `npm test` para ver o mesmo que o CI vê
- **Debug**: `npm test -- --reporter=verbose` para mais detalhes
