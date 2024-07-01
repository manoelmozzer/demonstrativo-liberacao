function pegarDados() {

// Identificação
processo = document.getElementById('processo');
  processo = processo.value;
exequente = document.getElementById('exequente');
  exequente = exequente.value;
executado = document.getElementById('executado');
  executado = executado.value;
identificacao = [processo, exequente, executado];

// Trata as entradas dos números
// Entrada '1.300.500,50'. Saída: '1300500.50'
function toNumberDecimal(v) {
  // Ajusta as pontuações de entrada
  v = v.replace(/\./g, '');
  v = v.replace(/,/, '.');
  // Converte para float antes de passar para a biblioteca decimal
  // Gera erro se não fizer a conversão
  v = parseFloat(v);
  // Envia para um decimal
  return new Decimal(v);
}

// Saldo em conta judicial
conta = document.getElementById('conta');
  conta = conta.value;
saldo = document.getElementById('saldo');
  saldo = saldo.value;
  saldo = toNumberDecimal(saldo);

// Servidor e Cargo
servidor = document.getElementById('servidor');
  servidor = servidor.value;
cargo = document.getElementById('cargo');
  cargo = cargo.value;

// Tabela
//// Inicializações
table = document.getElementById('table');
favorecido = [];
valor = [];
valor_liberado = [];
valor_total_liberado = [];
percentagem = [];
percentagem_total = [];
tabela = [];

//// Construir arrays
for (var r = 1, n = table.rows.length; r < n; r++) {
  for (var c = 2, m = table.rows[r].cells.length; c < m; c++) {
    favorecido.push(table.rows[r].cells[1].children[0].children[2].value);
    valor.push(table.rows[r].cells[2].children[0].value);
  }
}

//// Converter array para número e decimais
// Envia map para funçao toNumberDecimal();
valor = valor.map(toNumberDecimal);
//// Somar os valores
// valor_total = valor_total((a,b) => a + b, 0);
valor_total = valor.reduce((a,b) => Decimal.add(a, b), 0);

// CÁLCULOS
// Cria a variável resto para alocar as sobras
var resto = new Decimal(0.00);

// Verifica se o total dos valores da tabela é igual saldo da conta
if ( valor_total.toString() == saldo.toString() ) {

  // Se for, distribui exatamente conforme a entrada
  // Evita bug do centavo espúrio ser distribuído para outra linha
  // Ex: 0000324-60.2022.5.09.0125 (demonstrativo liberação 01.jul.2024)
  for (i=0; i<valor.length; i++) {
    // Percentual
    percentagem.push(Decimal.div(valor[i],valor_total));// valor[i] / valor_total
    // Distribuição
    valor_liberado.push(valor[i]);
  }

} else {

  // Se não for, distribui conforme a propocionalidade
  for (i=0; i<valor.length; i++) {
    // Percentual
    // percentagem.push(valor[i]/valor_total);
    percentagem.push(Decimal.div(valor[i],valor_total));// valor[i] / valor_total
    // Distribuição
    //// Somente valor correto
    divisao = Decimal.mul(saldo, percentagem[i]);// saldo * percentagem[i]
    divisao_trunc = divisao.mul(100).trunc().div(100)// Math.trunc(divisao *100) / 100
    // Aloca sobras do trunc
    resto = resto.add(divisao.sub(divisao_trunc));// resto + ((saldo*percentagem[i]) - divisao_trunc)
    valor_liberado.push(divisao_trunc);
  }

  //// Distribuição dos centavos restantes (espúrios)
  if (resto !== 0) {
    // Arrendonda o resto: integra as mili frações perdidas nas últimas casas decimais
    resto = resto.mul(100).round().div(100);// Math.round(resto * 100) / 100;
    i = 0;
    while (resto > 0.00 ) {
      valor_liberado[i] = valor_liberado[i].add(0.01);// valor_liberado[i] + 0.01;
      resto = resto.sub(0.01);// resto -= 0.01;
      i++
    }
  }

}

//// Valores totais
valor_total_liberado = valor_liberado.reduce((a,b) => Decimal.add(a, b), 0);
percentagem_total = percentagem.reduce((a,b) => Decimal.add(a, b), 0);

//// Conferência dos totais
if (saldo.toString() != valor_total_liberado.toString() || resto.toString() != 0) {
  alert("Há campos de valores sem preencher ou preenchidos inadequadamente!")
}// else {console.log('OK')}

//// Formatação
function formatarDinheiro(v) {
  // return new Intl.NumberFormat('pt-br', {minimumFractionDigits: 2, maximumFractionDigits: 2,}).format(v);
  return new Intl.NumberFormat('pt-br', {style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2,}).format(v);
}
valor_liberado = valor_liberado.map(formatarDinheiro);
valor_total_liberado = formatarDinheiro(valor_total_liberado);
saldo = formatarDinheiro(saldo);

function formatarPercentagem(v) {
  return Number(v).toLocaleString('pt-br',{style: 'percent', minimumFractionDigits:6});
}
percentagem = percentagem.map(formatarPercentagem);
percentagem_total = formatarPercentagem(percentagem_total);

//// Contruir array da tabela
for (i=0; i<valor.length; i++) {
  tabela.push([favorecido[i], valor_liberado[i], percentagem[i]]);
}

}