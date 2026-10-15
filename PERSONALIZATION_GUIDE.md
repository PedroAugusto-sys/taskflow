# 🎯 Guia de Personalização - TaskFlow

Este guia explica o que você, Pedro Augusto, deve personalizar antes de publicar este portfolio.

## 📝 Informações Pessoais

### 1. README.md

**Linha ~6-8** - Atualize seus links:
```markdown
> **Portfolio Project by Pedro Augusto**  
> QA Automation Engineer | .NET Developer  
> 🌐 [pedrodevx.netlify.app](https://pedrodevx.netlify.app) | 💼 [LinkedIn](https://linkedin.com/in/pedro-augusto) | 🐙 [GitHub](https://github.com/pedro-augusto-code)
```

**Substitua por:**
- `pedrodevx.netlify.app` → seu portfolio real
- `linkedin.com/in/pedro-augusto` → seu LinkedIn real
- `github.com/pedro-augusto-code` → seu GitHub real

**Linha ~578-582** - Seção "About Me":
```markdown
- 🌐 Portfolio: [pedrodevx.netlify.app](https://pedrodevx.netlify.app)
- 💼 LinkedIn: [linkedin.com/in/pedro-augusto](https://linkedin.com/in/pedro-augusto)
- 🐙 GitHub: [github.com/pedro-augusto-code](https://github.com/pedro-augusto-code)
```

### 2. Git Configuration

```bash
git config user.name "Seu Nome Real"
git config user.email "seu.email@real.com"
```

### 3. Program.cs (API)

**Linha ~18-22** - Informações do Swagger:
```csharp
Contact = new Microsoft.OpenApi.Models.OpenApiContact
{
    Name = "Pedro Augusto",
    Url = new Uri("https://pedrodevx.netlify.app")
}
```

## 🔗 URLs do Repositório

### 1. README.md Badge

**Linha ~3** - Badge do CI:
```markdown
[![CI Pipeline](https://github.com/pedro-augusto-code/taskflow-portfolio/actions/workflows/ci.yml/badge.svg)]
```

**Substitua:**
- `pedro-augusto-code` → seu username do GitHub
- `taskflow-portfolio` → nome que você deu ao repositório

### 2. Clone Instructions

**Linha ~186** - Instrução de clone:
```bash
git clone https://github.com/pedro-augusto-code/taskflow-portfolio.git
```

## 📸 Screenshots (Opcional)

Se você quiser adicionar screenshots reais da aplicação:

1. Crie a pasta `docs/images/`
2. Tire screenshots:
   - `dashboard.png` - Tela principal com tasks
   - `create-task.png` - Formulário de criação
   - `test-results.png` - Resultados dos testes

3. As referências já estão no README (linhas ~528-543)

**Ou simplesmente remova a seção de screenshots** se preferir não incluir.

## 🚀 Publicar no GitHub

### Passo 1: Criar Repositório

1. Vá para https://github.com/new
2. Nome: `taskflow-portfolio` (ou o que preferir)
3. Descrição: "Full-stack task management system - Portfolio project showcasing .NET, React, and comprehensive test automation"
4. **Público** ✅
5. **NÃO** inicialize com README (já temos um)

### Passo 2: Push para o GitHub

```bash
cd /workspace
git remote add origin https://github.com/SEU-USERNAME/taskflow-portfolio.git
git branch -M main
git push -u origin main
```

### Passo 3: Configurar GitHub Actions

As Actions já estão configuradas em `.github/workflows/ci.yml`.

Elas vão rodar automaticamente no primeiro push!

## ⚙️ Configurações Opcionais

### 1. Repository Settings

Em `Settings` > `General`:
- Topics: `csharp`, `dotnet`, `react`, `typescript`, `playwright`, `qa-automation`, `portfolio`
- Social Preview: Faça upload de uma imagem bonita (1280x640px)

### 2. About Section

Preencha a descrição e website no topo do repositório.

### 3. GitHub Pages (Opcional)

Você pode hospedar o frontend estático com GitHub Pages:

```bash
cd frontend
npm run build
# Deploy a pasta dist/ para o GitHub Pages
```

## 📧 Informações de Contato no Código

Estas referências já estão corretas, mas verifique:

- `appsettings.json` - Não tem info pessoal ✅
- `package.json` (frontend) - Sem autor definido ✅
- `.editorconfig` - Configuração genérica ✅

## ✅ Checklist Final

Antes de publicar, verifique:

- [ ] Todos os links pessoais atualizados
- [ ] Git config com nome e email reais
- [ ] Badge do CI com repo correto
- [ ] Screenshots adicionados OU seção removida
- [ ] Repositório criado no GitHub
- [ ] Push realizado com sucesso
- [ ] GitHub Actions rodando (veja a aba "Actions")
- [ ] README renderizando corretamente no GitHub

## 🎨 Melhorias Futuras (Sugestões)

Depois de publicar, você pode:

1. **Adicionar seu CV** - PDF na pasta `docs/`
2. **GIF animado** - Mostre a aplicação funcionando
3. **Deploy real** - Azure, Heroku, ou Vercel
4. **Badges adicionais**:
   - Code coverage badge
   - License badge (MIT)
   - Version badge

## 📞 Seus Links Devem Ficar

Substitua os placeholders:

```
Portfolio: https://pedrodevx.netlify.app
LinkedIn: https://linkedin.com/in/pedro-augusto
GitHub: https://github.com/pedro-augusto-code
Email: seu.email@exemplo.com
```

---

## 🚨 IMPORTANTE

**NÃO PUBLIQUE** se você tiver:
- Senhas ou secrets no código
- Tokens de API
- Informações sensíveis

Este projeto está limpo, mas sempre verifique!

---

**Boa sorte com seu portfolio! 🚀**
