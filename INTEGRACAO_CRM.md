# Integração LP → CRM (Site-Nortem)

## Como funciona

```
Formulário da LP  →  POST https://dash.nortemconsultoria.com.br/api/public/lead  →  Supabase (crm_leads)
```

O `assets/js/script.js` envia os campos do formulário para a rota pública
`/api/public/lead` do Site-Nortem (`Sites/Site-Nortem/src/app/api/public/lead/route.ts`).

**Não existe token no navegador.** A rota só sabe criar lead, e o servidor impõe:

| Campo | Valor |
|---|---|
| Tenant | `dudys` |
| Unidade | `Nortem` |
| Status | `Lead` |
| Fase | `Novo Lead` |
| Origem | `Landing Page` (campo `fonte: "lp-nortem"`) |
| Data do lead | data de hoje (fuso de São Paulo) |

Proteções da rota: Origin em allowlist (`LEAD_ORIGENS_PERMITIDAS` no Vercel, ou o
padrão `www.nortemconsultoria.com.br` / `nortemconsultoria.com.br` /
`lp-nortem-fable.vercel.app`), honeypot `website`, rate limit por IP e limite de
tamanho em cada campo.

## Campos enviados

| Campo LP | Campo CRM |
|---|---|
| `nome` | `nomeContato` |
| `email` | `email` |
| `whatsapp` | `telefone` |
| `empresa` | `empresa` |
| `segmento` | `segmento` |
| `faturamento` | `faturamento` |
| cargo + tempo + desafio + mensagem | `observacoes` |

## ⚠️ Regra

**Nunca** colocar token, senha ou URL `/exec` de Apps Script neste repositório:
ele é público e o `script.js` é baixado por qualquer visitante. Até 29/09/2026 a
LP enviava direto ao Apps Script com o `SHEETS_API_TOKEN` embutido — esse token
dava acesso a todas as ações do backend e foi revogado.

## Domínio novo da LP?

Adicionar o domínio em `LEAD_ORIGENS_PERMITIDAS` (Vercel do Site-Nortem, separado
por vírgula) — senão a rota recusa com 403.
