# 🛡️ Configuração de Branch Protection no GitHub

## ✅ Opções que VOCÊ DEVE MARCAR

Acesse: **Settings → Branches → Add rule**

### 1️⃣ Branch name pattern
```
main
```
*(ou `master` se for o nome da sua branch principal)*

---

### 2️⃣ ✅ MARQUE ESTAS OPÇÕES:

#### **✅ Require a pull request before merging**
- **Marque**: ✅ Require a pull request before merging
- **SUBMARCAÇÕES** (podem deixar os valores padrão):
  - Número de aprovações: 0 ou 1 (se trabalha sozinho, deixe 0)
  - ⚠️ **NÃO marque** "Dismiss stale pull request approvals when new commits are pushed" (só se tiver equipe)

#### **✅ Require status checks to pass before merging** ⭐ MAIS IMPORTANTE
- **Marque**: ✅ Require status checks to pass before merging
- **Marque**: ✅ Require branches to be up to date before merging
- **No campo "Search for status checks"**, adicione:
  - `test` (digite e pressione Enter)
  - `build` (digite e pressione Enter)
  
  *Esses são os nomes dos jobs definidos no arquivo `.github/workflows/ci.yml`*

#### **✅ Block force pushes** (Recomendado)
- **Marque**: ✅ Block force pushes
- Previne que você sobrescreva histórico acidentalmente

---

### 3️⃣ ❌ DEIXE DESMARCADAS (não são necessárias agora):

- ❌ Restrict creations
- ❌ Restrict updates  
- ❌ Restrict deletions
- ❌ Require linear history (só se quiser histórico limpo)
- ❌ Require deployments to succeed (não é necessário para seu caso)
- ❌ Require signed commits (só para segurança extra)
- ❌ Require code scanning results (só se tiver CodeQL configurado)
- ❌ Require code quality results (opcional)
- ❌ Automatically request Copilot code review (opcional)

---

## 📸 Como deve ficar

```
✅ Require a pull request before merging
   └── Required approvals: 0

✅ Require status checks to pass before merging
   └── ✅ Require branches to be up to date before merging
   └── Status checks that are required:
       • test
       • build

✅ Block force pushes
```

---

## 🎯 Resultado Final

### Antes de configurar:
```bash
git push origin main
→ Vai direto para Vercel (mesmo se testes falharem)
```

### Depois de configurar:
```bash
# Opção 1: Criar branch e PR (RECOMENDADO)
git checkout -b feature/nova-funcionalidade
git push origin feature/nova-funcionalidade
# → Criar PR no GitHub
# → Testes rodam automaticamente
# → Se testes passarem → Botão "Merge" fica verde
# → Se testes falharem → Botão "Merge" fica desabilitado ❌

# Opção 2: Push direto na main (BLOQUEADO agora!)
git push origin main
❌ ERROR: The main branch requires status checks to pass before pushing
```

---

## 🚀 Fluxo de Trabalho Após Configurar

### Para trabalhar sozinho (mais simples):

```bash
# 1. Crie uma branch
git checkout -b fix/alguma-coisa

# 2. Faça alterações e commit
git add .
git commit -m "fix: correção importante"

# 3. Push da branch
git push origin fix/alguma-coisa

# 4. Crie PR no GitHub
# Vá no GitHub → Aparecerá botão "Compare & pull request"

# 5. Aguarde os testes (1-2 minutos)
# GitHub Actions roda automaticamente

# 6. Se testes passarem → Clique em "Merge pull request"
# 7. Delete a branch antiga
# 8. Pull das mudanças na main local
git checkout main
git pull origin main
```

### Para emergências (bypass):

Se você for o **dono do repositório**, você pode dar bypass em você mesmo:

1. Settings → Branches → Edite a regra
2. Procure por "Allow specified actors to bypass required pull requests"
3. Adicione você mesmo
4. ⚠️ **Use apenas em emergências!**

---

## ✅ Checklist de Verificação

Após salvar as regras, teste:

- [ ] Tentou fazer `git push origin main` direto → Deve ser bloqueado
- [ ] Criou uma branch → Funcionou
- [ ] Abriu PR → Testes rodaram automaticamente
- [ ] Se testes passarem → Botão merge aparece verde
- [ ] Após merge → Vercel faz deploy automático

---

## 🆘 Problemas Comuns

### ❌ "Status checks not found"
**Causa**: O GitHub Actions ainda não rodou nenhuma vez  
**Solução**: 
1. Faça um push em qualquer branch primeiro
2. Aguarde o workflow rodar
3. Depois configure a branch protection
4. Os checks `test` e `build` aparecerão na lista

### ❌ "Cannot push to protected branch"
**Causa**: As regras estão funcionando! 🎉  
**Solução**: Use o fluxo de PR (branch → PR → merge)

### ❌ Workflow roda mas não aparece no PR
**Causa**: Workflow pode estar configurado para rodar só em `main`  
**Solução**: O arquivo `.github/workflows/ci.yml` já está configurado para rodar em PRs também

---

## 🎓 Quando Usar Cada Modo

### 🟢 MODO NORMAL (Com Branch Protection) - RECOMENDADO
- ✅ Código sempre testado antes de produção
- ✅ Histórico limpo com PRs
- ✅ Você vê exatamente o que está indo para produção
- ⚠️ Um pouco mais de trabalho (criar branches/PRs)

### 🔴 MODO DIRETO (Sem Branch Protection) - ARRISCADO
- ⚠️ Código pode ir para produção com erros
- ⚠️ Histórico bagunçado
- ✅ Mais rápido para prototipar
- ❌ **NÃO recomendado para produção**

---

## 💡 Dica Extra: Atalho para PRs

Configure o git para sempre criar PR ao fazer push:

```bash
# Adicione ao seu .gitconfig
git config --global push.autoSetupRemote true

# Agora basta:
git checkout -b nova-feature
git commit -m "feat: algo novo"
git push
# → Automaticamente cria a branch remota
# → GitHub mostra link direto para criar PR
```

---

## 🎯 Resumo Executivo

| Configuração | Impacto | Recomendado? |
|--------------|---------|--------------|
| **Require status checks** | ⭐⭐⭐⭐⭐ Bloqueia merges se testes falharem | ✅ SIM |
| **Require pull request** | ⭐⭐⭐⭐ Força revisão antes de merge | ✅ SIM |
| **Block force pushes** | ⭐⭐⭐ Previne acidentes | ✅ SIM |
| Outras opções | ⭐ Nice to have | ⚠️ Opcional |

**Configure pelo menos as 3 primeiras! 🎯**
