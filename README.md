# Nortem Consultoria — Landing Page

Landing page institucional da **Nortem Consultoria**, focada em captação e qualificação de leads (empresários, com foco em quem fatura acima de R$ 100 mil/mês) para agendamento de diagnóstico financeiro gratuito.

---

## 📁 Estrutura do projeto

```
nortem-lp/
├── index.html
├── README.md
├── google-apps-script.gs       ← cole este código no Apps Script da sua planilha
└── assets/
    ├── css/style.css
    ├── js/script.js            ← edite a URL do Apps Script aqui
    └── img/
        ├── logo.png
        ├── carlos.png
        └── danilo.png
```

---

## 🚀 Como hospedar no GitHub Pages

1. Crie um repositório no GitHub (ex: `nortem-lp`).
2. Faça upload de todos os arquivos desta pasta (ou use `git push`).
3. No repositório, vá em **Settings → Pages**.
4. Em **Source**, selecione a branch `main` e a pasta `/ (root)`.
5. Clique em **Save**. Em alguns minutos, a página estará disponível em:
   `https://SEU-USUARIO.github.io/nortem-lp/`

> Se quiser usar um domínio próprio (ex: `nortemconsultoria.com.br`), configure na mesma página de **Pages** em "Custom domain" e ajuste o DNS do seu provedor.

---

## 📊 Configurar o formulário com Google Sheets (passo a passo)

Os leads serão enviados direto para uma planilha do Google Sheets sua, usando o **Google Apps Script** como ponte. É gratuito, ilimitado, e os dados ficam totalmente sob seu controle.

### Passo 1 — Criar a planilha

1. Acesse [https://sheets.google.com](https://sheets.google.com)
2. Crie uma planilha em branco
3. Renomeie para **"Leads Nortem"** (ou o nome que preferir)

### Passo 2 — Colar o Apps Script

1. Com a planilha aberta, vá no menu: **Extensões → Apps Script**
2. Vai abrir um editor de código com um arquivo `Code.gs` (ou `Código.gs`) vazio
3. **Apague tudo** que estiver lá
4. Abra o arquivo `google-apps-script.gs` deste projeto, copie **todo o conteúdo** e cole no editor
5. Clique no ícone de **disquete** (Salvar projeto) e dê um nome ao projeto (ex: "Nortem Leads")

### Passo 3 — Autorizar o script (apenas uma vez)

1. Ainda no editor do Apps Script, no menu superior selecione a função **`testarComLeadFalso`** no dropdown
2. Clique em **"Executar"**
3. O Google vai pedir autorização → clique em **"Revisar permissões"** → escolha sua conta Google
4. Se aparecer "**O Google não verificou este app**":
   - Clique em **"Avançado"**
   - Clique em **"Acessar Nortem Leads (não seguro)"**
   - Clique em **"Permitir"**

   _(Isso é normal — você está autorizando seu próprio script a escrever na sua própria planilha.)_

5. Volte na planilha e confira: deve ter aparecido uma aba **"Leads"** com cabeçalhos pretos e dourados, e uma linha de teste em verde claro.

### Passo 4 — Publicar como Web App

1. No editor do Apps Script, clique em **"Implantar" → "Nova implantação"** (canto superior direito)
2. Clique no ícone de **engrenagem** ao lado de "Selecionar tipo" e escolha **"App da Web"**
3. Preencha:
   - **Descrição:** Nortem Leads (opcional)
   - **Executar como:** Eu (seu e-mail)
   - **Quem pode acessar:** **Qualquer pessoa** ← isso é importante
4. Clique em **"Implantar"**
5. **Copie a URL do App da Web** que vai aparecer. Formato:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```

### Passo 5 — Colar a URL na LP

1. Abra `assets/js/script.js`
2. Logo no topo, substitua o placeholder:
   ```js
   const SHEETS_ENDPOINT = "COLE_AQUI_A_URL_DO_APPS_SCRIPT";
   ```
   pela URL que você copiou:
   ```js
   const SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycb.../exec";
   ```
3. Salve, faça commit e push para o GitHub.

### Passo 6 — Testar

Acesse sua LP publicada, preencha o formulário com dados de teste e clique em enviar. Em menos de 5 segundos, o lead deve aparecer na planilha.

> **TODOS os leads são gravados na planilha**, inclusive os de empresas com faturamento abaixo de R$ 100 mil. A coluna "Qualificado?" marca **SIM** (acima de R$ 100k) ou **NÃO** (abaixo). Leads qualificados são destacados com fundo verde claro automaticamente.

---

## ⚙️ Outras configurações importantes

### Número de WhatsApp

Em `assets/js/script.js`, troque o número placeholder pelo seu, no formato internacional sem o `+`:

```js
const WHATSAPP_NUMBER = "5587999999999"; // Exemplo: Pernambuco, DDD 87
```

Isso atualiza automaticamente o botão flutuante e os links de contato no rodapé.

### Vídeo do YouTube

Para trocar o vídeo da seção "Conheça a Nortem", abra `index.html`, procure por:

```html
src="https://www.youtube.com/embed/NqZeYBWg4_Y?rel=0&modestbranding=1"
```

E troque o ID `NqZeYBWg4_Y` pelo ID do novo vídeo (a parte após `watch?v=` na URL do YouTube).

### Contato no rodapé

Em `index.html`, dentro de `<footer>`, atualize:
- `mailto:contato@nortemconsultoria.com.br` → e-mail real
- Links de Instagram e LinkedIn
- CNPJ

---

## 🎨 Personalização rápida

### Trocar cor de acento

No `style.css`, no topo, ajuste:

```css
--accent: #d4a24c;       /* atual: âmbar/dourado */
--accent-soft: #b88a39;
```

Sugestões alternativas alinhadas à área financeira:
- Verde-musgo: `#7a8c5c`
- Azul-petróleo: `#2d5a6b`
- Bordô: `#7a3d3d`

### Trocar fotos dos consultores

Substitua os arquivos em `assets/img/carlos.png` e `assets/img/danilo.png`. Recomendo proporção **4:5 (vertical)**, mínimo **800x1000 px**.

### Editar textos

Tudo está em `index.html`. Os textos foram escritos para conversão — qualquer ajuste, basta editar diretamente o HTML.

---

## 🧩 Campos coletados pelo formulário

| Coluna na planilha    | Campo do form        | Uso                                   |
| --------------------- | -------------------- | ------------------------------------- |
| Data/Hora             | (automático)         | Quando o lead foi recebido            |
| Nome                  | nome                 | Identificação                         |
| E-mail                | email                | Contato e CRM                         |
| WhatsApp              | whatsapp             | Contato principal                     |
| Empresa               | empresa              | Contexto comercial                    |
| Cargo                 | cargo                | Decisor ou influenciador?             |
| Segmento              | segmento             | Especialização                        |
| Tempo de empresa      | tempo_empresa        | Maturidade                            |
| Faturamento           | faturamento (código) | Para filtros/automação                |
| Faixa (label)         | (derivado)           | Versão legível, ex: "Acima de R$ 5M"  |
| Desafio principal     | desafio              | Personalização do pitch               |
| Mensagem              | mensagem             | Informações extras (opcional)         |
| **Qualificado?**      | (derivado)           | **SIM/NÃO** — separa leads acima/abaixo de R$ 100k |
| Origem                | _origem              | "Landing Page Nortem"                 |
| Página                | _pagina              | URL exata onde o form foi enviado     |

---

## 🧪 Testar localmente

Você pode abrir o `index.html` direto no navegador (clique duplo), ou usar um servidor local:

```bash
# Com Python 3
python3 -m http.server 8080

# Ou com Node (http-server)
npx http-server -p 8080
```

Acesse `http://localhost:8080`.

> **Importante:** o formulário só envia leads de verdade após configurar o `SHEETS_ENDPOINT`. Sem isso, o submit funciona em modo demo (mostra a mensagem de sucesso mas nada é gravado).

---

## 📋 Checklist antes de publicar

- [ ] Criar planilha no Google Sheets + colar `google-apps-script.gs` no Apps Script
- [ ] Implantar como App da Web e copiar a URL
- [ ] Colar URL em `assets/js/script.js` → `SHEETS_ENDPOINT`
- [ ] Configurar `WHATSAPP_NUMBER` em `assets/js/script.js`
- [ ] Atualizar e-mail, redes sociais e CNPJ no rodapé do `index.html`
- [ ] Trocar o vídeo do YouTube (se quiser usar outro)
- [ ] Testar envio do formulário (ver se aparece na planilha)
- [ ] Testar em mobile (Chrome DevTools → modo responsivo)
- [ ] Configurar GitHub Pages
- [ ] (Opcional) Configurar domínio próprio
- [ ] (Opcional) Adicionar Google Analytics ou Meta Pixel

---

## 📊 Adicionar Meta Pixel ou Google Analytics

Cole o script de tracking no `<head>` do `index.html`, logo após a tag `<meta name="theme-color">`.

Para rastrear conversões do formulário, dentro do bloco `try` em `script.js` (após o envio bem-sucedido), adicione:

```js
// Meta Pixel
if (window.fbq) fbq("track", "Lead");

// Google Analytics 4
if (window.gtag) gtag("event", "generate_lead", { value: 1 });
```

---

## 🔄 Atualizar o Apps Script depois de publicado

Se você precisar mudar algo no script (adicionar coluna, notificação por e-mail, etc.):

1. Edite o código no Apps Script e salve
2. Vá em **Implantar → Gerenciar implantações**
3. Clique no lápis (editar) da implantação ativa
4. Em "Versão", selecione **"Nova versão"**
5. Clique em **"Implantar"**

A URL continua a mesma — não precisa mexer no `script.js` da LP.

---

Qualquer dúvida na configuração, é só chamar. 🚀
