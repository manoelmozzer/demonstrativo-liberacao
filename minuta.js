// OPÇÕES DE AUTOTEXTO
// Formato: ["value", "Descrição"]
var autotextoMinuta = [
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

function listarTabela() {
  // Pega os dados da tabela (dados.js)
  pegarDadosPDF();
  // tabela = [[favorecido, valor_liberado, percentagem]]
  // valor_retencao = ["R$ xx.xxx,xx"]
  // percentagem = ["x,xxxxxx%"]

  var tableMinutaBody = document.getElementById("minuta-table").getElementsByTagName('tbody')[0];

  // Deleta todas as linhas da tabela
  while (tableMinutaBody.rows.length>0) {
    tableMinutaBody.deleteRow(0);
  }

  // Adiciona as novas linhas na tabela
  for (r=0; r<tabela.length; r++) {

    // Adiciona quantas linhas tiverem na tabela
    var row = tableMinutaBody.insertRow();
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
    select_sel.onchange = function(){ atualizaMinuta() };
      // Opções a selecionar
      for (i=0; i<autotextoMinuta.length; i++) {
        // Cria uma opção por vez
        var option_sel = document.createElement("option");
        // Insere value e descrição nos botões
        option_sel.setAttribute("value", autotextoMinuta[i][0]);
        option_sel.textContent = autotextoMinuta[i][1];
        // Adiciona a opção no selecionar
        select_sel.appendChild(option_sel);
      }
    // Adiciona o selecionar na célula
    c3.appendChild(select_sel);

  }

}

// Estilos de texto do PJe
function estiloTitulo(texto) {
  return `<p class="ck_paragrafo_simples" style="font-size:12pt;line-height:1;text-align:center;text-indent:0;"><strong>${texto}</strong></p>`
}
function estiloCorpo(texto) {
  return `<p class="corpo" style="font-size:12pt;line-height:1.5;margin-left:0 !important;text-align:justify !important;text-indent:4.5cm;">${texto}</p>`
}
function estiloAssinatura(texto) {
  return `<p class="ck_assinatura" style="font-size:12pt;line-height:1.5;text-align:center;text-indent:0;">${texto}</p>`
}

////////////////////////////////////////////////////////////////////////////////
//// MODELO DE MINUTA
//// ---------------------------------------------------------------------------
//// Nome: "Decisão -> Liberação de valores - não há contrato de honorários"
//// Atualizada em 24.mai.2024 às 15:09 (Revisão 416419)
////////////////////////////////////////////////////////////////////////////////
function atualizaMinuta() {
  // Pega a área da minuta
  blocoMinuta = document.getElementById("minuta");
  // Pega valores das seleções de autotexto
  tabelaMinuta = document.getElementById("minuta-table");
  // Array que recebe os value das opções
  selecAutotexto = [];

  // Envia os value para o array
  for (r=1; r<tabelaMinuta.rows.length-1; r++) {
    // 'r=1' desconsidera o cabeçalho e 'tabelaMinuta.rows.length-1' o rodapé
    selecAutotexto.push(tabelaMinuta.rows[r].cells[2].children[0].value);
  }

  ////////////////
  // ABERTURA
  ////////////////

  minuta = "";
  minuta += estiloTitulo("CONCLUSÃO");
  minuta += estiloCorpo("Autos conclusos em virtude do decurso do prazo para oposição de embargos de embargos pelo executado e da elaboração do demonstrativo de liberações.");
  minuta += estiloAssinatura("#{usuarioLogado.nome}<br>" + cargo);
  minuta += estiloCorpo("&nbsp;");
  minuta += estiloTitulo("DECISÃO");

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
    valor_retencao_total = formatarDinheiro(valor_retencao_total);
    // SOMA PERCENTAGENS DE RETENÇÃO (se houver mais de uma)
    // Preferível somar com casas limitadas, para ficar exatamente igual a soma da planilha em PDF
    percentagem_retencao = index_retencao.map(x => toPercentDecimal(percentagem[x]));
    percentagem_retencao_total = percentagem_retencao.reduce((a,b) => Decimal.add(a, b), 0);
    // Divide por 100 para ajustar as casas decimais
    percentagem_retencao_total = percentagem_retencao_total.div(100);
    percentagem_retencao_total = formatarPercentagem(percentagem_retencao_total);

    minuta += estiloCorpo(`1. Providencie a Gerente da agência 4182 da Caixa Econômica Federal (Justiça do Trabalho) a <b>liberação parcial</b> do valor depositado na <b>conta judicial ${conta} (${saldo}),</b> com a <b>retenção de ${valor_retencao_total} (${percentagem_retencao_total})</b> e remessa dos comprovantes da operação para juntada aos autos no <b>prazo de 24 (vinte e quatro) horas</b>, nas seguintes proporções:`);
    // TODO: Alterar pela Caixa e/ou Banco do Brasil com base no número da conta judicial (modificar também o modelo sem retenção)
    minuta += estiloCorpo("<b>********QUANDO É PARA BB</b>");
    minuta += estiloCorpo(`1. Providencie o(a) Gerente da agência 4974 do Banco do Brasil (PSO Pato Branco) a <b>liberação parcial</b> do valor depositado na <b>conta judicial ${conta} (${saldo}),</b> com a <b>retenção de ${valor_retencao_total} (${percentagem_retencao_total})</b> e remessa dos comprovantes da operação para juntada aos autos no <b>prazo de 24 (vinte e quatro) horas</b>, nas seguintes proporções:`);
  } else {
    // LIBERAÇÃO TOTAL (SEM RETENÇÃO)
    minuta += estiloCorpo(`1. Providencie a Gerente da agência 4182 da Caixa Econômica Federal (Justiça do Trabalho) a <b>liberação total</b> do valor depositado na <b>conta judicial ${conta} (${saldo}),</b> com a remessa dos comprovantes da operação para juntada aos autos no <b>prazo de 24 (vinte e quatro) horas</b>, nas seguintes proporções:`);
    minuta += estiloCorpo("<b>********QUANDO É PARA BB</b>");
    minuta += estiloCorpo(`1. Providencie o(a) Gerente da agência 4974 do Banco do Brasil (PSO Pato Branco) a <b>liberação total</b> do valor depositado na <b>conta judicial ${conta} (${saldo}),</b> com a remessa dos comprovantes da operação para juntada aos autos no <b>prazo de 24 (vinte e quatro) horas</b>, nas seguintes proporções:`);
  }

  ////////////////
  // VERBAS
  ////////////////

  // Remove o que for retenção das verificações (não tem item de minuta para retenção)
  // Salva o resultado em um array de index
  index_minus_retencao = selecAutotexto.map( (x,index) => {if(x!="retencao") return index } ).filter(i => i !== undefined);
  // Verifica cada elemento do array de seleção ('value', 'índice do value', 'índice alfabético ordenado')
  index_minus_retencao.forEach((value, index) => verificarAutotexto(selecAutotexto[value], value, index));

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
    // Entrada: '0'. Saída: 'a'
    function toAlphaIndex(index) {
    // https://stackoverflow.com/questions/36129721/convert-number-to-alphabet-letter
    // return String.fromCharCode(index+ + 'a'.charCodeAt(0));
      return (index+10).toString(36);
    }

  }


  // Genérico
  function genericoAT(valor, percentagem, indexAlpha) {
    minuta += estiloCorpo(`${indexAlpha}) <b>${valor} (${percentagem})</b> a título de <b>XXXXX</b> para <b>XXXXX</b>;`);
  }

  // Principal
  function principalAT(valor, percentagem, indexAlpha) {
    minuta += estiloCorpo(`${indexAlpha}) <b>${valor} (${percentagem})</b> a título de <b>principal</b> para <b>#{processoTrfHome.nomeCpfAutorList}</b>, mediante transferência para`);
    minuta += estiloCorpo(`<b>ATENÇÃO:</b> Verificar situações especiais (J.C.L ou V.O.M.J.) no modelo de liberação: <i>"Decisão -> Liberação de valores - não há contrato de honorários"</i>.`)
    minuta += estiloCorpo(`a <b>conta XXXXX da agência XXXXX do banco XXXXX</b>, de titularidade do(s) seu(s) procurador(es) <b>#{processo.partes.poloAtivo.advogados.nomesEDocumentos.linhas},</b> porquanto <b>detentor(es) de poderes expressos para “receber” e “dar quitação”, conforme instrumento de Id. xxxxx;</b>`)
  }

  // Contribuições Previdenciárias
  function cont_prevAT(valor, percentagem, indexAlpha) {
    minuta += estiloCorpo(`${indexAlpha}) <b>${valor} (${percentagem})</b> a título de <b>contribuições previdenciárias</b>, figurando <b>#{processo.partes.poloPassivo.nomesEDocumentos}</b> na condição de <b>contribuinte</b>;`);
  }

  // Honorários de Sucumbência do Advogado do Exequente
  function hon_suc_exnteAT(valor, percentagem, indexAlpha) {
    minuta += estiloCorpo(`${indexAlpha}) <b>${valor} (${percentagem})</b> a título de <b>honorários de sucumbência</b> para advogado(a) do(a) exequente <b>#{processo.partes.poloAtivo.advogados.nomesEDocumentos.linhas}</b>;`);
    minuta += estiloCorpo(`<b><u>ATENÇÃO - SE FOR CUMPRIMENTO DE SENTENÇA É PRECISO VERIFICAR SE OS HONORÁRIOS DE SUCUMBÊNCIA IRÃO PARA O SINDICATO QUANDO SE TRATA DE HONORÁRIOS ASSISTENCIAIS.</u></b>`);
  }

  // Honorários de Sucumbência do Advogado do Executado
  function hon_suc_exadoAT(valor, percentagem, indexAlpha) {
    minuta += estiloCorpo(`${indexAlpha}) <b>${valor} (${percentagem})</b> a título de <b>honorários de sucumbência</b> para advogado(a) do(a) executado(a) <b>#{processo.partes.poloPassivo.advogados.nomesEDocumentos.linhas}</b>;`);
  }

  // Honorários Assistenciais do Sindicato
  function hon_ass_sindAT(valor, percentagem, indexAlpha) {
    minuta += estiloCorpo(`${indexAlpha}) <b>${valor} (${percentagem})</b> a título de <b>honorários assistenciais</b> para o <b>substituto processual (Sindicato XXXXXX - Sindicato dos Empregados em Estabelecimentos Bancários de Pato Branco e Região - CNPJ 78.278.710/0001-75)</b>;`);
  }

  // Honorários de Calculista
  function hon_calcAT(valor, percentagem, indexAlpha) {
    minuta += estiloCorpo(`${indexAlpha}) <b>${valor} (${percentagem})</b> a título de <b>honorários de calculista</b> para <b>#{processo.partes.terceiros.peritos.nomesEDocumentos}</b>;`)
  }

  // Honorários de Perito
  function hon_perAT(valor, percentagem, indexAlpha) {
    minuta += estiloCorpo(`${indexAlpha}) <b>${valor} (${percentagem})</b> a título de <b>honorários de perito(a)</b> para <b>#{processo.partes.terceiros.peritos.nomesEDocumentos}</b>;`)
  }

  // Custas
  function custasAT(valor, percentagem, indexAlpha) {
    minuta += estiloCorpo(`${indexAlpha}) <b>${valor} (${percentagem})</b> a título de <b>custas processuais</b>, figurando <b>#{processo.partes.poloPassivo.nomesEDocumentos}</b> na condição de <b>contribuinte (representante legal: advogado da causa #{processo.partes.poloPassivo.advogados.nomesEDocumentos.linhas})</b>;`)
  }

  // Honorários Leiloeiro
  function hon_leilAT(valor, percentagem, indexAlpha) {
    minuta += estiloCorpo(`${indexAlpha}) <b>${valor} (${percentagem})</b> a título de <b>honorários de leiloeiro para ELTON LUIZ SIMON, CPF: 044.016.329-31</b>, mediante <b>transferência para CEF, Agência 4594, conta poupança 809717171-4, operação 1288</b>;`)
  }

  // Despesas Publicação do Edital do Leilão
  function desp_edt_leilAT(valor, percentagem, indexAlpha) {
    minuta += estiloCorpo(`${indexAlpha}) <b>${valor} (${percentagem})</b> a título de <b>despesas com publicação de edital para a EDITORA JURITI LTDA (CNPJ: 80.192.081/0001-08)</b>, mediante <b>transferência para Banco do Brasil, agência 0495, conta corrente 20255-X</b>;`)
  }

  // Despesas Cartorárias
  function desp_cartAT(valor, percentagem, indexAlpha) {
    minuta += estiloCorpo(`${indexAlpha}) <b>${valor} (${percentagem})</b> a título de <b>despesas cartorárias</b> para <b>CARTÓRIO VIEIRA (CNPJ 77.780.773/0001-62)</b>, mediante <b>transferência para CEF, agência 0602, operação 003, conta 5735-2</b>;`)
  }

  // Imposto de Renda
  function irAT(valor, percentagem, indexAlpha) {
    minuta += estiloCorpo(`${indexAlpha}) <b>${valor} (${percentagem})</b> a título de <b>imposto de renda</b>, figurando <b>XXXXXXXXXX</b>, na condição de <b>contribuinte</b>;`)
  }

  // Depósito na Conta do FGTS
  function dep_con_fgtsAT(valor, percentagem, indexAlpha) {
    minuta += estiloCorpo(`<b>***** QUANDO É PARA CEF</b>`);
    minuta += estiloCorpo(`${indexAlpha}) <b>${valor} (${percentagem})</b> para <b>depósito em conta do FGTS de titularidade de #{processoTrfHome.nomeCpfAutorList}, vinculada a contrato que se estendeu de XXXXXX (admissão) a XXXXXX, na categoria de XXXXXXXXXXXXX, figurando #{processo.partes.poloPassivo.nomesEDocumentos} na condição de depositante</b>;`);
    minuta += estiloCorpo(`<b>******* QUANDO É PARA BB</b>`);
    minuta += estiloCorpo(`${indexAlpha}) <b>${valor} (${percentagem})</b> para <b>depósito em conta do FGTS de titularidade de #{processoTrfHome.nomeCpfAutorList}, PIS XXXXXX, figurando #{processo.partes.poloPassivo.nomesEDocumentos} na condição de depositante</b>;`);
  }

  // Restituição ao TRT-9
  function rest_trtAT(valor, percentagem, indexAlpha) {
    minuta += estiloCorpo(`${indexAlpha}) <b>${valor} (${percentagem})</b> para o <b>TRT DA 9ª REGIÃO</b>, a título de <b>restituição da importância antecipada para a prova pericial</b>;`)
  }

  ////////////////
  // FECHAMENTO
  ////////////////

  // Verifica se tem honorários assistenciais
  if ( selecAutotexto.some((value) => value == "hon_ass_sind") ) {
    // ITEM ALTERNATIVO - CUMPRSENT COM HONORÁRIOS ASSISTENCIAIS
    minuta += estiloCorpo("<b><u>******** ATENÇÃO ITEM ABAIXO ALTERNATIVO - EM CASO DE CUMPRIMENTO DE SENTENÇA COM HONORÁRIOS ASSISTENCIAIS AO SINDICATO</u></b>");
    minuta += estiloCorpo("2. A fim de agilizar tal procedimento e por economia processual, intimem-se os favorecidos para que indiquem <b>conta bancária para transferência dos seus créditos</b>, aí compreendido o <b>substituto processual (SINDICATO XXXXXXXXX)</b>, mediante intimação para <b>os procuradores constituídos na AÇÃO COLETIVA nº XXXXXXXXX (ID XXXXXX - fl. XXXXXXXX)</b>, inclusive para que <b>anexem procuração atualizada com poderes expressos para receber e dar quitação em nome da entidade sindical, no prazo de 05 (cinco) dias</b>.");
  } else {
    // ITEM SEM HONORÁRIOS ASSISTENCIAIS
    minuta += estiloCorpo("2. A fim de agilizar tal procedimento e por economia processual, intime-se o(a) procurador(a) do(a) exequente para que <b>informe a conta bancária para transferência dos créditos no prazo de 05 (cinco) dias</b>.");
  }

  minuta += estiloCorpo("3. Cumprido, <b>expeçam-se os alvarás</b>.");

  minuta += estiloCorpo("<b>ATENÇÃO - SE O EXECUTADO FOR PESSOA FÍSICA NÃO TEM QUE JUNTAR GFIP</b>");
  // // Redação legada:
  // minuta += estiloCorpo("4. Juntados os comprovantes e zerada a conta judicial, intime(m)-se o(s) executado(s) para que comprove(m) nos autos o encaminhamento das GFIPs e/ou a Declaração de Débitos e Créditos Tributários Federais Previdenciários e de Outras Entidades e Fundos (DCTFWeb) no <b>prazo de 15 (quinze) dias</b>, conforme o caso e nos termos das normas legais pertinentes, sob pena de comunicação à Delegacia da Receita Federal para as providências legais cabíveis (art. 32-A da Lei 8.212/91), <b>observados os procedimentos detalhados na Recomendação nº 1/GCGJT, de 16 de maio de 2024,</b> a saber:");
  // minuta += estiloCorpo("I - <b>nos períodos de apuração de dezembro de 2008 em diante</b>, as contribuições previdenciárias devidas devem ser escrituradas no eSocial (evento S-2500); e,");
  // minuta += estiloCorpo("II - <b>nos períodos de apuração anteriores a dezembro de 2008</b>, as contribuições previdenciárias devidas devem ser escrituradas no eSocial (evento S-2500), acompanhadas da prestação das informações de que trata o art. 32, IV, da Lei nº 8.212/1991, por meio da Guia de Recolhimento do FGTS e Informações à Previdência Social - GFIP.");
  minuta += estiloCorpo("4. Juntados os comprovantes e zerada a conta judicial, intime(m)-se o(s) executado(s) para que, no <b>prazo de 15 (quinze) dias,</b> comprove nos autos o <b>encaminhamento</b> da Declaração de Débitos e Créditos Tributários Federais Previdenciários e de Outras Entidades e Fundos (DCTFWeb), por meio do <b>evento S2500</b>, tendo em vista que as contribuições previdenciárias <b><u>serão recolhidas</u> por meio de DARF</b> gerada nos autos da execução, nos termos das normas legais pertinentes, sob pena de comunicação à Delegacia da Receita Federal para as providências legais cabíveis (art. 32-A da Lei 8.212/91).");
  
  minuta += estiloCorpo("5. Tudo cumprido, retornem para <b>extinção</b>.");

  minuta += estiloCorpo("6. Cópia deste(a), publicada no DEJT, servirá de intimação para todos os efeitos legais, em homenagem aos princípios da celeridade e economia processuais.");

  // Insere a minuta na caixa
  blocoMinuta.innerHTML = minuta;

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
