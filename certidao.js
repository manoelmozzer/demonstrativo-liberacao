// OPÇÕES DE AUTOTEXTO
// Formato: ["value", "Descrição"]
var autotextoCertidao = [
  ["generico", "Genérico"],
  ["principal", "Principal"],
  ["cont_prev", "Contribuições Previdenciárias"],
  ["custas", "Custas"],
  ["hon_suc_exnte", "Hon. Suc. Adv. Exequente"],
  ["hon_suc_exado", "Hon. Suc. Adv. Executado"],
  ["hon_ass_sind", "Hon. Assist. Sindicato"],
  ["hon_calc", "Hon. Calculista"],
  ["hon_per", "Hon. Perito"],
  ["hon_leil", "Hon. Leiloeiro"],
  ["desp_edt_leil", "Despesas Edital Leilão"],
  ["desp_cart", "Despesas Cartorárias"],
  ["ir", "Imposto de Renda"],
  ["dep_con_fgts", "Depósito Conta FGTS"],
  ["rest_trt", "Restituição TRT-9"],
  ["retencao", "Retenção"],
]

function listarTabelaCertidao() {
  // Pega os dados da tabela (dados.js)
  pegarDadosPDF();
  // tabela = [[favorecido, valor_liberado, percentagem]]
  // valor_retencao = ["R$ xx.xxx,xx"]
  // percentagem = ["x,xxxxxx%"]

  var tableCertidaoBody = document.getElementById("certidao-table").getElementsByTagName('tbody')[0];

  // Deleta todas as linhas da tabela
  while (tableCertidaoBody.rows.length>0) {
    tableCertidaoBody.deleteRow(0);
  }

  // Adiciona as novas linhas na tabela
  for (r=0; r<tabela.length; r++) {

    // Adiciona quantas linhas tiverem na tabela
    var row = tableCertidaoBody.insertRow();
    var c1 = row.insertCell(0);
    var c2 = row.insertCell(1);
    var c3 = row.insertCell(2);

    // c1: Coluna 1: Favorecido
    c1.textContent = tabela[r][0];

    // c2: Coluna 2: Valor
    c2.textContent = tabela[r][1];

    // c3: Coluna 3: Seleção do Autotexto
    var select_sel = document.createElement("select");
    select_sel.classList.add("form-select");
    select_sel.onchange = function(){ atualizaCertidao() };
      // Opções a selecionar
      for (i=0; i<autotextoCertidao.length; i++) {
        // Cria uma opção por vez
        var option_sel = document.createElement("option");
        // Insere value e descrição nos botões
        option_sel.setAttribute("value", autotextoCertidao[i][0]);
        option_sel.textContent = autotextoCertidao[i][1];
        // Adiciona a opção no selecionar
        select_sel.appendChild(option_sel);
      }
    // Adiciona o selecionar na célula
    c3.appendChild(select_sel);

  }

}

// Estilos de texto do PJe
function estiloTitulo2(texto) {
  // return `<p class="ck_paragrafo_simples" style="font-size:12pt;line-height:1;text-align:center;text-indent:0;"><strong>${texto}</strong></p>`
  return `<h3 style="text-align:center;">${texto}</h3>`
}
function estiloTitulo3(texto) {
  return `<h4>${texto}</h4>`
}
function estiloParSimples(texto) {
  return `<p class="ck_paragrafo_simples" style="font-size:12pt;line-height:1;text-align:justify;text-indent:0;">${texto}</p>`
}
function estiloCorpo(texto) {
  return `<p class="corpo" style="font-size:12pt;line-height:1.5;margin-left:0 !important;text-align:justify !important;text-indent:4.5cm;">${texto}</p>`
}
function estiloAssinatura(texto) {
  return `<p class="ck_assinatura" style="font-size:12pt;line-height:1.5;text-align:center;text-indent:0;">${texto}</p>`
}

////////////////////////////////////////////////////////////////////////////////
//// MODELO DE CERTIDÃO
////////////////////////////////////////////////////////////////////////////////
function atualizaCertidao() {
  // Pega a área da certidão
  blocoCertidao = document.getElementById("certidao");
  // Pega valores das seleções de autotexto
  tabelaCertidao = document.getElementById("certidao-table");
  // Array que recebe os value das opções
  selecAutotexto = [];

  // Envia os value para o array
  for (r=1; r<tabelaCertidao.rows.length-1; r++) {
    // 'r=1' desconsidera o cabeçalho e 'tabelaCertidao.rows.length-1' o rodapé
    selecAutotexto.push(tabelaCertidao.rows[r].cells[2].children[0].value);
  }

  ////////////////
  // ABERTURA
  ////////////////

  certidao = "";
  certidao += estiloTitulo2("DEMONSTRATIVO DE LIBERAÇÃO");
  certidao += estiloCorpo("&nbsp;");

  // CONTA E VALOR

  // TODO: Identificar automaticamente se é CEF ou BB com base no número da conta judicial
  // TODO: Pegar automaticamente a data de hoje
  certidao += estiloParSimples(`<i>Conta:</i> ${conta} (BB/CEF)`)
  certidao += estiloParSimples(`<i>Saldo disponível em xx/xx/2026:</i> ${saldo}`)

  // RETENÇÃO
  // Verifica se tem ou não Retenção na conta
  if ( selecAutotexto.some((value) => value == "retencao") ) {
    // LIBERAÇÃO PARCIAL (RETENÇÃO)
    // Index dos itens com retenção
    // https://stackoverflow.com/questions/65615217/find-all-elements-indexes-in-an-array-with-predicate-typescript/73197422#73197422
    index_retencao = selecAutotexto.map( (x,index) => { if(x=="retencao") return index } ).filter(i => i !== undefined);
    // SOMA VALORES RETENÇÃO (se houver mais de uma)
    valor_retencao = index_retencao.map(x => toCurrencyDecimal(valor_liberado[x]));
    valor_retencao_total = valor_retencao.reduce((a,b) => Decimal.add(a, b), 0);
    // VALOR PARCIAL LIBERADO
    // Mapeia e soma todos os valores da lista para ter o valor total (antes da retenção)
    valor_total_com_retencao = valor_liberado.map(x => toCurrencyDecimal(x)).reduce((a,b) => Decimal.add(a, b), 0);
    // Liberação Parcial = Total Original - Retenção Total
    valor_liberacao_parcial = Decimal.sub(valor_total_com_retencao, valor_retencao_total);
    // Formata os valores para exibição em dinheiro
    valor_retencao_total = formatarDinheiro(valor_retencao_total);
    valor_liberacao_parcial = formatarDinheiro(valor_liberacao_parcial);
    // SOMA PERCENTAGENS DE RETENÇÃO (se houver mais de uma)
    // Preferível somar com casas limitadas, para ficar exatamente igual a soma da planilha em PDF
    percentagem_retencao = index_retencao.map(x => toPercentDecimal(percentagem[x]));
    percentagem_retencao_total = percentagem_retencao.reduce((a,b) => Decimal.add(a, b), 0);
    // Divide por 100 para ajustar as casas decimais
    percentagem_retencao_total = percentagem_retencao_total.div(100);
    percentagem_retencao_total = formatarPercentagem(percentagem_retencao_total);

    // LIBERAÇÃO COM RETENÇÃO
    certidao += estiloParSimples(`<i>Retenção na conta:</i> ${valor_retencao_total} (${percentagem_retencao_total})`);
    certidao += estiloParSimples(`<i>Liberação parcial:</i> ${valor_liberacao_parcial}`)
  } else {
    // LIBERAÇÃO SEM RETENÇÃO
    certidao += estiloParSimples("<i>Liberação total</i>");
  }

  certidao += estiloCorpo("&nbsp;");

  ////////////////
  // VERBAS
  ////////////////

  // Remove o que for retenção das verificações (não tem item de certidão para retenção)
  // Salva o resultado em um array de index
  index_sem_retencao = selecAutotexto.map( (x,index) => {if(x!="retencao") return index } ).filter(i => i !== undefined);
  // Verifica cada elemento do array de seleção ('value', 'índice do value', 'índice alfabético ordenado')
  index_sem_retencao.forEach((value, index) => verificarAutotexto(selecAutotexto[value], value, index));

  function verificarAutotexto(value, index, indexAlpha) {
    // Pega valores 
    v = valor_liberado[index];
    p = percentagem[index];
    i = toAlphaIndex(indexAlpha);

    switch(value) {
      case 'generico':
        genericoAT(v, p, i); break;
      case 'principal':
        principalAT(v, p, i); break;
      case 'cont_prev':
        cont_prevAT(v, p, i); break;
      case 'custas':
        custasAT(v, p, i); break;
      case 'hon_suc_exnte':
        hon_suc_exnteAT(v, p, i); break;
      case 'hon_suc_exado':
        hon_suc_exadoAT(v, p, i); break;
      case 'hon_ass_sind':
        hon_ass_sindAT(v, p, i); break;
      case 'hon_calc':
        hon_calcAT(v, p, i); break;
      case 'hon_per':
        hon_perAT(v, p, i); break;
      case 'hon_leil':
        hon_leilAT(v, p, i); break;
      case 'desp_edt_leil':
        desp_edt_leilAT(v, p, i); break;
      case 'desp_cart':
        desp_cartAT(v, p, i); break;
      case 'ir':
        irAT(v, p, i); break;
      case 'dep_con_fgts':
        dep_con_fgtsAT(v, p, i); break;
      case 'rest_trt':
        rest_trtAT(v, p, i); break;
      default:
        genericoAT(v, p, i); break;
    }

    // Converte a entrada do índice para alfabético
    // Entrada: '0'. Saída: 'A'
    function toAlphaIndex(index) {
    // https://stackoverflow.com/questions/36129721/convert-number-to-alphabet-letter
    // return String.fromCharCode(index+ + 'a'.charCodeAt(0));
      return (index+10).toString(36).toUpperCase();
    }

  }


  // Genérico
  function genericoAT(valor, percentagem, indexAlpha) {
    certidao += estiloCorpo(`${indexAlpha}) <b>${valor} (${percentagem})</b> a título de <b>XXXXX</b> para <b>XXXXX</b>;`);
  }

  // Principal
  function principalAT(valor, percentagem, indexAlpha) {
    certidao += estiloTitulo3(`${indexAlpha}) PRINCIPAL - DEVIDO AO EXEQUENTE`);
    certidao += estiloCorpo(`<i>Valor:</i> <b>${valor} (${percentagem})</b>`);
    certidao += estiloCorpo("<i>Destinatário:</i> #{processoTrfHome.nomeCpfAutorList}");
    certidao += estiloCorpo("<i>Forma:</i> Conta de sua titularidade e/ou do(s) seu(s) procurador(es) (poderes para \"receber\" e \"dar quitação\": ID. XXXXXXX");
    certidao += estiloCorpo("<i>Procurador(es):</i> #{processo.partes.poloAtivo.advogados.nomesEDocumentos.linhas}, #{processo.partes.poloAtivo.advogados.nomesEOAB.linhas} (conta: XXXX, agência: YYYY, Banco ZZZZ)");
    certidao += estiloCorpo("&nbsp;");
  }

  // Contribuições Previdenciárias
  function cont_prevAT(valor, percentagem, indexAlpha) {
    certidao += estiloTitulo3(`${indexAlpha}) CONTRIBUIÇÕES PREVIDENCIÁRIAS`);
    certidao += estiloCorpo(`<i>Valor:</i> <b>${valor} (${percentagem})</b>`);
    certidao += estiloCorpo("<i>Contribuinte:</i>: #{processo.partes.poloPassivo.nomesEDocumentos}")
    certidao += estiloCorpo("&nbsp;");
  }

  // Honorários de Sucumbência do Advogado do Exequente
  function hon_suc_exnteAT(valor, percentagem, indexAlpha) {
    certidao += estiloCorpo("<b><u>ATENÇÃO - SE FOR CUMPRIMENTO DE SENTENÇA É PRECISO VERIFICAR SE OS HONORÁRIOS DE SUCUMBÊNCIA IRÃO PARA O SINDICATO QUANDO SE TRATA DE HONORÁRIOS ASSISTENCIAIS.</u></b>");
    certidao += estiloTitulo3(`${indexAlpha}) HONORÁRIOS DE SUCUMBÊNCIA - ADV. EXEQUENTE`);
    certidao += estiloCorpo(`<i>Valor:</i> <b>${valor} (${percentagem})</b>`);
    certidao += estiloCorpo("<i>Destinatário:</i> #{processo.partes.poloAtivo.advogados.nomesEDocumentos.linhas}, #{processo.partes.poloAtivo.advogados.nomesEOAB.linhas}");
    certidao += estiloCorpo("<i>Forma:</i> Conta de sua titularidade (<i>vide</i> item \"A\" ou conta: XXXX, agência: YYYY, Banco ZZZZ)");
    certidao += estiloCorpo("&nbsp;");
  }

  // Honorários de Sucumbência do Advogado do Executado
  function hon_suc_exadoAT(valor, percentagem, indexAlpha) {
    certidao += estiloTitulo3(`${indexAlpha}) HONORÁRIOS ASSISTENCIAIS - SINDICATO`);
     // PAREI AQUI: já fiz o próximo item

    certidao += estiloCorpo(`${indexAlpha}) <b>${valor} (${percentagem})</b> a título de <b>honorários de sucumbência</b> para advogado(a) do(a) executado(a) <b>#{processo.partes.poloPassivo.advogados.nomesEDocumentos.linhas}, #{processo.partes.poloPassivo.advogados.nomesEOAB.linhas}</b>;`);
  }

  // Honorários Assistenciais do Sindicato
  function hon_ass_sindAT(valor, percentagem, indexAlpha) {
    certidao += estiloTitulo3(`${indexAlpha}) HONORÁRIOS ASSISTENCIAIS - SINDICATO`);
    certidao += estiloCorpo(`<i>Valor:</i> <b>${valor} (${percentagem})</b>`);
    certidao += estiloCorpo("<i>Destinatário:</i> Substituto processual (Sindicato XXXXXX - Sindicato dos Empregados em Estabelecimentos Bancários de Pato Branco e Região - CNPJ 78.278.710/0001-75)");
    certidao += estiloCorpo("<i>Forma:</i> Conta de sua titularidade e/ou do(s) seu(s) procurador(es) (poderes para \"receber\" e \"dar quitação\": ID. XXXXXXX da Ação Coletiva nº XXXXXXXXX");
    certidao += estiloCorpo("<i>Procurador(es):</i> #{processo.partes.poloAtivo.advogados.nomesEDocumentos.linhas}, #{processo.partes.poloAtivo.advogados.nomesEOAB.linhas} (conta: XXXX, agência: YYYY, Banco ZZZZ)");
    certidao += estiloCorpo("<b>OBS:</b> Verificar se tem procuração atualizada, ou se é necessário intimar para apresentar procuração recente.");
    certidao += estiloCorpo("&nbsp;");
  }

  // Honorários de Calculista
  function hon_calcAT(valor, percentagem, indexAlpha) {
    certidao += estiloCorpo(`${indexAlpha}) <b>${valor} (${percentagem})</b> a título de <b>honorários de calculista</b> para <b>#{processo.partes.terceiros.peritos.nomesEDocumentos}</b>;`)
  }

  // Honorários de Perito
  function hon_perAT(valor, percentagem, indexAlpha) {
    certidao += estiloCorpo(`${indexAlpha}) <b>${valor} (${percentagem})</b> a título de <b>honorários de perito(a)</b> para <b>#{processo.partes.terceiros.peritos.nomesEDocumentos}</b>;`)
  }

  // Custas
  function custasAT(valor, percentagem, indexAlpha) {
    certidao += estiloCorpo(`${indexAlpha}) <b>${valor} (${percentagem})</b> a título de <b>custas processuais</b>, figurando <b>#{processo.partes.poloPassivo.nomesEDocumentos}</b> na condição de <b>contribuinte (representante legal: advogado da causa #{processo.partes.poloPassivo.advogados.nomesEDocumentos.linhas}, #{processo.partes.poloPassivo.advogados.nomesEOAB.linhas})</b>;`)
  }

  // Honorários Leiloeiro
  function hon_leilAT(valor, percentagem, indexAlpha) {
    certidao += estiloCorpo(`${indexAlpha}) <b>${valor} (${percentagem})</b> a título de <b>honorários de leiloeiro para ELTON LUIZ SIMON, CPF: 044.016.329-31</b>, mediante <b>transferência para CEF, Agência 4594, conta poupança 809717171-4, operação 1288</b>;`)
  }

  // Despesas Publicação do Edital do Leilão
  function desp_edt_leilAT(valor, percentagem, indexAlpha) {
    certidao += estiloCorpo(`${indexAlpha}) <b>${valor} (${percentagem})</b> a título de <b>despesas com publicação de edital para a EDITORA JURITI LTDA (CNPJ: 80.192.081/0001-08)</b>, mediante <b>transferência para Banco do Brasil, agência 0495, conta corrente 20255-X</b>;`)
  }

  // Despesas Cartorárias
  function desp_cartAT(valor, percentagem, indexAlpha) {
    certidao += estiloCorpo(`${indexAlpha}) <b>${valor} (${percentagem})</b> a título de <b>despesas cartorárias</b> para <b>CARTÓRIO VIEIRA (CNPJ 77.780.773/0001-62)</b>, mediante <b>transferência para CEF, agência 0602, operação 003, conta 5735-2</b>;`)
  }

  // Imposto de Renda
  function irAT(valor, percentagem, indexAlpha) {
    certidao += estiloCorpo(`${indexAlpha}) <b>${valor} (${percentagem})</b> a título de <b>imposto de renda</b>, figurando <b>XXXXXXXXXX</b>, na condição de <b>contribuinte</b>;`)
  }

  // Depósito na Conta do FGTS
  function dep_con_fgtsAT(valor, percentagem, indexAlpha) {
    certidao += estiloCorpo(`<b>***** QUANDO É PARA CEF</b>`);
    certidao += estiloCorpo(`${indexAlpha}) <b>${valor} (${percentagem})</b> para <b>depósito em conta do FGTS de titularidade de #{processoTrfHome.nomeCpfAutorList}, vinculada a contrato que se estendeu de XXXXXX (admissão) a XXXXXX, na categoria de XXXXXXXXXXXXX, figurando #{processo.partes.poloPassivo.nomesEDocumentos} na condição de depositante</b>;`);
    certidao += estiloCorpo(`<b>******* QUANDO É PARA BB</b>`);
    certidao += estiloCorpo(`${indexAlpha}) <b>${valor} (${percentagem})</b> para <b>depósito em conta do FGTS de titularidade de #{processoTrfHome.nomeCpfAutorList}, PIS XXXXXX, figurando #{processo.partes.poloPassivo.nomesEDocumentos} na condição de depositante</b>;`);
  }

  // Restituição ao TRT-9
  function rest_trtAT(valor, percentagem, indexAlpha) {
    certidao += estiloCorpo(`${indexAlpha}) <b>${valor} (${percentagem})</b> para o <b>TRT DA 9ª REGIÃO</b>, a título de <b>restituição da importância antecipada para a prova pericial</b>;`)
  }

  // Insere a certidão na caixa
  blocoCertidao.innerHTML = certidao;

}

// Trata as entradas dos números
// Entrada 'R$ 1.300.500,50'. Saída: '1300500.50'
function toCurrencyDecimal(v) {
  // Remove o símbolo de dinheiro
  v = v.replace(/R\$\s/g, '');
  // Envia para o restante da formatação decimal
  v = toNumberDecimal(v);
  return v;
}
// Entrada 'x,xxxxxx%'. Saída: 'x.xxxxxx'
function toPercentDecimal(v) {
  // Remove o símbolo de porcentagem
  v = v.replace(/%/g, '');
  // Substitui a ',' por '.'
  v = v.replace(/,/, '.');
  // Envia para um decimal
  v = parseFloat(v);
  return new Decimal(v);
}
