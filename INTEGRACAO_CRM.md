# Integração LP-Nortem com CRM (Google Sheets)

## ✅ Status da Integração

- ✅ Script.js atualizado para usar o CRM Base
- ✅ Mapeamento de campos implementado
- ⏳ **Pendente:** Configurar variáveis de ambiente com valores reais

---

## 🔧 Como Completar a Configuração

### 1️⃣ Obter o DEPLOY_ID do Google Apps Script

O Apps Script já está deployado em Site-Nortem. Precisa-se encontrar o `DEPLOY_ID`:

**No arquivo `.env.vercel` do Site-Nortem:**
```bash
# A URL está em Sites/Site-Nortem/.env.vercel (já configurado no Vercel)
# Ou execute o Site-Nortem para ver a URL em produção

# Formato: https://script.google.com/macros/s/[DEPLOY_ID]/exec
# Copie o [DEPLOY_ID]
```

---

### 2️⃣ Configurar script.js da LP

Abra `LPs/LP-Nortem/assets/js/script.js` e atualize:

```javascript
// Linha 10-12
const CRM_ENDPOINT = "https://script.google.com/macros/s/[DEPLOY_ID]/exec";
const CRM_TOKEN = "[TOKEN_DO_SITE_NORTEM]";
const CRM_CLIENTE_ID = "Dudys";
```

**Valores:**
- `[DEPLOY_ID]` - Copie do Apps Script do Site-Nortem
- `[TOKEN_DO_SITE_NORTEM]` - Mesmo token do Site-Nortem (.env do dashboard)
- `Dudys` - Cliente padrão (ou outro conforme configurado)

---

## 📊 Fluxo de Dados

```
Formulário (LP-Nortem)
        ↓
  Collect form data
        ↓
  Map fields to CRM structure
        ↓
  POST {action: "createLead", ...} 
        ↓
  Google Apps Script (Site-Nortem)
        ↓
  Salva em "CRM Base" do cliente
```

---

## 🗂️ Mapeamento de Campos

| Campo LP | → | Campo CRM Base | Descrição |
|----------|---|----------------|-----------|
| `nome` | → | `nomeContato` | Nome do contato |
| `email` | → | `email` | E-mail do lead |
| `whatsapp` | → | `telefone` | Telefone do contato |
| `empresa` | → | `empresa` | Nome da empresa |
| `segmento` | → | `segmento` | Segmento do negócio |
| `faturamento` | → | `faturamento` | Faixa de faturamento |
| (data atual) | → | `dataLead` | Data do contato |
| (fixo) | → | `origem` | "Landing Page Nortem" |
| (fixo) | → | `status` | "Novo" |
| (fixo) | → | `fase` | "Contato Inicial" |
| Cargo + Tempo + Desafio + Mensagem | → | `observacoes` | Detalhes consolidados |

---

## ✨ Estrutura da Observação

Os campos que não mapeiam diretamente são consolidados em `observacoes`:

```
Cargo: [cargo informado]
Tempo na empresa: [tempo informado]
Desafio principal: [desafio informado]

Mensagem:
[mensagem do formulário]
```

---

## 🧪 Testar a Integração

### Teste Local (sem servidor)
```javascript
// Abra o console do navegador (F12) e execute:
console.log("CRM_ENDPOINT:", CRM_ENDPOINT);
console.log("Configurado:", CRM_ENDPOINT && !CRM_ENDPOINT.startsWith("SEU_DEPLOY_ID"));
```

### Teste com Envio Real
1. Configure corretamente o `CRM_ENDPOINT` e `CRM_TOKEN`
2. Abra a LP em navegador
3. Preencha o formulário com dados de teste
4. Clique em "Agendar diagnóstico"
5. Verifique se a mensagem de sucesso apareceu

**Resposta esperada:**
```json
{
  "data": {
    "id": "lead_abc123def456",
    "nomeContato": "João Silva",
    ...
  }
}
```

### Verificar no Google Sheets
1. Abra a planilha do cliente (ex: Dudys)
2. Aba **"CRM Base"**
3. Deve aparecer uma nova linha com origem = "Landing Page Nortem"

---

## 🔐 Segurança

⚠️ **CURRENT (Frontend):**
- Token está exposto no script.js
- Adequado para prototipagem

✅ **MELHOR (Backend):**
Criar um proxy server que:
1. Recebe dados do formulário
2. Adiciona token seguro
3. Envia para o CRM
4. Retorna resultado

---

## 📝 Checklist Final

- [ ] DEPLOY_ID obtido do Google Apps Script (Site-Nortem)
- [ ] CRM_ENDPOINT configurado no script.js
- [ ] CRM_TOKEN configurado no script.js
- [ ] API_TOKEN no Apps Script corresponde ao CRM_TOKEN
- [ ] Cliente "Dudys" existe em CLIENTES_SHEETS do Code.gs
- [ ] Aba "CRM Base" existe na planilha
- [ ] Formulário testado localmente
- [ ] Lead apareceu na aba CRM Base com origem correta
- [ ] Deploy em produção

---

## ❓ Troubleshooting

**"Erro ao enviar"**
→ Verifique se CRM_ENDPOINT está correto e não começa com "SEU_DEPLOY_ID"

**"token inválido"**
→ Verifique se CRM_TOKEN em script.js é igual ao API_TOKEN do Apps Script

**"cliente ou aba não encontrada"**
→ Verifique se "Dudys" existe em CLIENTES_SHEETS no Code.gs do Site-Nortem

**Lead não aparece no CRM**
→ Confira os logs do Google Apps Script (View > Logs)
→ Verifique se a aba "CRM Base" foi criada automaticamente

---

## 📞 Próximas Melhorias

- [ ] Validação de email antes de enviar
- [ ] Rate limiting para evitar spam
- [ ] Webhook para notificação no WhatsApp
- [ ] Integração com CRM visual (dashboard)
- [ ] Lead scoring automático baseado em faturamento
