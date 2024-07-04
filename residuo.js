// Input de valores na tabela
function atualizaValores() {
  // printTotal();
  distribuirResiduo();
}

// Selecionar o checkbox do resíduo
function selResiduo(checkbox) {
  // Confere se o botão foi selecionado
  if (checkbox.checked) {
    input_valor = checkbox.closest('tr').children[2].children[0];
    // Insere os bloqueios de edição
    input_valor.setAttribute("disabled", "");
    input_valor.setAttribute("readonly", "");
    // Chama a função para distribuir o valor residual
    distribuirResiduo();
  }
  // Confere se o botão foi desselecionado
  if (checkbox.checked == false) {
    input_valor = checkbox.closest('tr').children[2].children[0];
    // Remove os bloqueios de edição
    input_valor.removeAttribute("disabled");
    input_valor.removeAttribute("readonly");
    // Deixa o valor vazio
    input_valor.value = "";
    distribuirResiduo();
  }
}


// Pega o total dos valores na tabela
function getTotal() {
  // Inicializações
  table = document.getElementById('table');
  valor = [];
  //// Pega todos os valores atuais inseridos na tabela e insere no array.
  for (var r = 1, n = table.rows.length-1; r < n; r++) {
  // n: diminui 1 para descontar o rodarpé da tabela
    if ( table.rows[r].cells[2].children[0].value == "" ) {
      // Insere zero se o valor for vazio
      valor.push("0,00");
    } else {
      valor.push(table.rows[r].cells[2].children[0].value);
    }
  }
  //// Converter array para número e decimais
  // Envia map para funçao toNumberDecimal() (dados.js);
  valor = valor.map(toNumberDecimal);
  //// Somar os valores
  // valor_total = valor_total((a,b) => a + b, 0);
  valor_total = valor.reduce((a,b) => Decimal.add(a, b), 0);
  return valor_total
}

// Pega o total apenas dos valores informados na tabela
// Remove os valores distribuídos
function getTotalInformado() {
  // Inicializações
  table = document.getElementById('table');
  valor_infomado = [];
  //// Pega todos os valores atuais inseridos na tabela e insere no array.
  for (var r = 1, n = table.rows.length-1; r < n; r++) {
  // n: diminui 1 para descontar o rodarpé da tabela
    // Verifica se o valor é informado (não é selecionado)
    if ( table.rows[r].cells[0].children[1].children[0].checked == false ) {
      if ( table.rows[r].cells[2].children[0].value == "" ) {
        // Insere zero se o valor for vazio
        valor_infomado.push("0,00");
      } else {
        valor_infomado.push(table.rows[r].cells[2].children[0].value);
      }
    }
  }
  //// Converter array para número e decimais
  // Envia map para funçao toNumberDecimal() (dados.js);
  valor_infomado = valor_infomado.map(toNumberDecimal);
  //// Somar os valores
  // valor_total = valor_total((a,b) => a + b, 0);
  valor_total_informado = valor_infomado.reduce((a,b) => Decimal.add(a, b), 0);
  return valor_total_informado
}


// Imprime o valor total na cédula correspondente
function printTotal(decimal) {
  // Verifica se há argumento informado e se ele é um decimal
  if ( ( decimal !== undefined ) && ( decimal.constructor.name == "Decimal" ) ) {
    valor_total = decimal
  } else {
    valor_total = getTotal()
  }
  // Formata o valor total para dinheiro: 10.000,00
  valor_total_formatado = new Intl.NumberFormat(
    'pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 2,}
    ).format(valor_total);
  // Pega a cédula que totaliza a tabela
  cedula_total = table.rows[table.rows.length-1].cells[2]
  // Insere o valor formatado
  cedula_total.textContent = valor_total_formatado
}
// Imprime o total com valores iniciais (se houver)
window.addEventListener("DOMContentLoaded", (event) => {// Aguarda o DOM carregar
  printTotal();
})


// Pega o valor informado no saldo
function getSaldo() {
  saldo = document.getElementById('saldo');
  saldo = saldo.value;
  saldo = toNumberDecimal(saldo);
  return saldo
}


// Distribuir valores 
function distribuirResiduo() {
  // Índices das linhas selecionadas
  var arr_index_selec = [];

  // Pega o índice de todos os botões selecionados
  for ( i=1; i<table.rows.length-1; i++ ) {
    linha_checkbox = table.rows[i].cells[0].children[1].children[0]
    if ( linha_checkbox.checked ) {
      arr_index_selec.push(i);
    }
  }

  // Verifica se há algo a ser distribuído (algum botão selecionado)
  if ( arr_index_selec.length != 0 ) {

    // Inicializações
    table = document.getElementById('table');
    valor_total = getTotal();
    valor_total_informado = getTotalInformado();
    saldo = getSaldo();

    // Função saldo vazio
    function saldoVazio() {
      // Deixa vazio o valor das células selecionadas
      for (i=0; i<arr_index_selec.length; i++) {
        index_selecionado = arr_index_selec[i];
        input_valor_selecionado = table.rows[index_selecionado].cells[2].children[0];
        input_valor_selecionado.value = "";
      }
    }

    // Função saldo menor que o valor total (saldo < valor_total)
    function saldoMenorTotal() {
      // Insere '0,00' no valor das células selecionadas
      for (i=0; i<arr_index_selec.length; i++) {
        index_selecionado = arr_index_selec[i];
        input_valor_selecionado = table.rows[index_selecionado].cells[2].children[0];
        input_valor_selecionado.value = "0,00";
      }
    }

    // Função saldo maior ou igual que o valor total (saldo >= valor_total)
    function saldoMaiorIgualTotal() {
      // Cálculos de distribuição

      // Inicializações
      valor_distribuir = saldo.minus(valor_total_informado); // valor_distribuir = saldo - valor total
      quant = arr_index_selec.length;
      // Divisão em partes iguais para cada linha selecionada
      divisao = valor_distribuir.div(quant); // divisao = valor_distribuir / quant

      // Encontra quantos centavos espuríos serão distribuídos
      divisao_espurios = divisao;
      quant_centavo_espurio = 0;
      // Verifica quantas vezes a divisão tem mais de duas casas decimais
      // Representa quantos centavos espúrios precisam ser distribuídos
      while ( divisao_espurios.dp() > 2 ) {
        // Arredonda o valor da divisão para cima nas casas decimais
        divisao_espurios = divisao_espurios.toDP(2, Decimal.ROUND_UP)
        // Readequa os restantes em uma parcela a menos
        valor_distribuir = valor_distribuir.minus(divisao_espurios)
        quant -= 1
        // Faz a divisão entre os restantes
        divisao_espurios = valor_distribuir.div(quant);
        // Registra quantos centavos espúrios precisarão ser distribuídos
        quant_centavo_espurio++
      }

      // Distribui a divisão entre os selecionados
      for (i=0; i<arr_index_selec.length; i++) {
        index_selecionado = arr_index_selec[i];
        input_valor_selecionado = table.rows[index_selecionado].cells[2].children[0];
        // Distribuição considerando os centavos espúrios
        if ( quant_centavo_espurio>0 ) {// Se tiver centavo espúrio, arredonda para cima
          divisao_formatado = divisao.toDP(2, Decimal.ROUND_UP).toString();
          quant_centavo_espurio -= 1;
        } else {// Se não tiver mais, arredonda para baixo
          divisao_formatado = divisao.toDP(2, Decimal.ROUND_DOWN).toString();
        }
        // Formata e insere o valor na célula
        divisao_formatado = new Intl.NumberFormat('pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 2,}).format(divisao_formatado);
        input_valor_selecionado.value = divisao_formatado;
      }

    }

    // Confere a relação do saldo com o valor total
    if ( isNaN(saldo.toString()) ) {// Saldo vazio
      saldoVazio();
    } else if ( saldo.lt(valor_total_informado) ) {// Saldo menor que valor total (saldo < valor_total)
      saldoMenorTotal();
    } else if ( saldo.gte(valor_total_informado) ) {// Saldo maior ou igual que valor total (saldo >= valor_total)
      saldoMaiorIgualTotal();
    }

  }// Termino da verificação se há botão a ser distribuído

  // Atualiza e imprime o valor total (em qualquer condição)
  printTotal();

}