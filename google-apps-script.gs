/**
 * ============================================================================
 * NORTEM CONSULTORIA — Receptor de Leads (Google Apps Script)
 * ============================================================================
 *
 * COMO USAR:
 * 1. Abra https://sheets.google.com e crie uma planilha nova
 *    (sugestão de nome: "Leads Nortem")
 * 2. No menu da planilha, clique em: Extensões → Apps Script
 * 3. Apague todo o código que aparecer e cole ESTE arquivo inteiro
 * 4. Clique no botão "Salvar" (ícone de disquete)
 * 5. Clique em "Implantar" → "Nova implantação"
 *      - Em "Selecionar tipo" (ícone de engrenagem) escolha: "App da Web"
 *      - Descrição: "Nortem Leads"
 *      - Executar como: "Eu"
 *      - Quem pode acessar: "Qualquer pessoa"
 * 6. Clique em "Implantar"
 *      - Autorize o acesso à sua conta Google quando pedir
 *      - (Pode aparecer "Google não verificou este app" → clique em
 *         "Avançado" → "Acessar [nome do projeto] (não seguro)" → "Permitir"
 *         Isso é normal para scripts próprios.)
 * 7. Copie a URL do "App da Web" que vai aparecer
 *    (algo como: https://script.google.com/macros/s/AKfyc.../exec)
 * 8. Cole essa URL em /assets/js/script.js da LP,
 *    na variável SHEETS_ENDPOINT (logo no topo)
 *
 * Pronto! Toda vez que alguém preencher o formulário,
 * um novo lead aparecerá automaticamente na planilha.
 *
 * ============================================================================
 */

// Nome da aba que vai receber os leads. Se não existir, será criada.
const SHEET_NAME = "Leads";

// Cabeçalhos das colunas (na ordem em que aparecerão na planilha)
const HEADERS = [
  "Data/Hora",
  "Nome",
  "E-mail",
  "WhatsApp",
  "Empresa",
  "Cargo",
  "Segmento",
  "Tempo de empresa",
  "Faturamento",
  "Faixa (label)",
  "Desafio principal",
  "Mensagem",
  "Qualificado?",
  "Origem",
  "Página"
];

// Faixas de faturamento abaixo de R$ 100 mil → não qualificadas
const UNDER_QUALIFIED = ["ate_30k", "31k_50k", "51k_70k", "71k_100k"];

// Mapa de valores técnicos → rótulos legíveis para exibir na planilha
const FATURAMENTO_LABEL = {
  "ate_30k": "Até R$ 30 mil",
  "31k_50k": "De R$ 31 mil a R$ 50 mil",
  "51k_70k": "De R$ 51 mil a R$ 70 mil",
  "71k_100k": "De R$ 71 mil a R$ 100 mil",
  "100k_300k": "De R$ 100 mil a R$ 300 mil",
  "301k_1m": "De R$ 301 mil a R$ 1 milhão",
  "1m_5m": "De R$ 1 milhão a R$ 5 milhões",
  "acima_5m": "Acima de R$ 5 milhões"
};

/**
 * Recebe os dados do formulário via POST e grava na planilha.
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();

    const faturamento = data.faturamento || "";
    const isQualified = !UNDER_QUALIFIED.includes(faturamento);

    const row = [
      new Date(),                                  // Data/Hora
      data.nome || "",
      data.email || "",
      data.whatsapp || "",
      data.empresa || "",
      data.cargo || "",
      data.segmento || "",
      data.tempo_empresa || "",
      faturamento,                                 // valor técnico
      FATURAMENTO_LABEL[faturamento] || faturamento, // valor legível
      data.desafio || "",
      data.mensagem || "",
      isQualified ? "SIM" : "NÃO",
      data._origem || "Landing Page Nortem",
      data._pagina || ""
    ];

    sheet.appendRow(row);

    // Destaca leads qualificados com fundo verde claro
    if (isQualified) {
      const lastRow = sheet.getLastRow();
      sheet.getRange(lastRow, 1, 1, HEADERS.length)
           .setBackground("#e8f5e9");
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true, qualified: isQualified }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log("Erro: " + err);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Resposta amigável caso alguém abra a URL no navegador.
 */
function doGet() {
  return ContentService
    .createTextOutput("Endpoint Nortem ativo. Use POST para enviar leads.")
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Pega a aba "Leads" (ou cria, se não existir) e garante o cabeçalho.
 */
function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  // Se a primeira linha está vazia, escreve o cabeçalho
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    const header = sheet.getRange(1, 1, 1, HEADERS.length);
    header.setFontWeight("bold")
          .setBackground("#0a0a0a")
          .setFontColor("#d4a24c");
    sheet.setFrozenRows(1);

    // Largura sugerida
    const widths = [140, 180, 220, 140, 180, 140, 140, 140, 100, 200, 200, 280, 110, 160, 220];
    widths.forEach((w, i) => sheet.setColumnWidth(i + 1, w));
  }

  return sheet;
}

/**
 * (OPCIONAL) Teste manual: rode esta função uma vez no editor
 * para autorizar o script e ver um lead de exemplo na planilha.
 */
function testarComLeadFalso() {
  const fakeEvent = {
    postData: {
      contents: JSON.stringify({
        nome: "Teste da Silva",
        email: "teste@exemplo.com",
        whatsapp: "(87) 99999-9999",
        empresa: "Empresa Teste LTDA",
        cargo: "Sócio",
        segmento: "Restaurantes",
        tempo_empresa: "De 3 a 5 anos",
        faturamento: "300k_1m",
        desafio: "Margens em queda",
        mensagem: "Mensagem de teste enviada via testarComLeadFalso()",
        _origem: "Teste manual",
        _pagina: "(executado no Apps Script)"
      })
    }
  };
  const result = doPost(fakeEvent);
  Logger.log(result.getContent());
}
