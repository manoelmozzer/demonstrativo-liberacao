//// EVENTOS DA CAIXA DE TEXTO

var placeholderEspera = "Cole ou arraste o conteúdo aqui..."

// Evento pela entrada de valor na caixa de texto
function limparEntrada(x) {
  x.value = "";
}

// Evento quando o foco sai da caixa de texto
function focoFora(x) {
  x.placeholder = placeholderEspera;
}

// Pega o valor colado
function pegarColado(e) {
  e.target.placeholder = "Colado!";
  setTimeout(() => {// Tempo para mudar de placeholder
    e.target.placeholder = placeholderEspera;
  }, 4000);// 4 segundos
  var clipboardData, pastedData;
  // Stop data actually being pasted into div
  e.stopPropagation();
  e.preventDefault();
  // Get pasted data via clipboard API
  clipboardData = e.clipboardData || window.clipboardData;
  pastedData = clipboardData.getData('Text');
  // Do whatever with pasteddata
  regex(pastedData);
}

// Pega o valor arrastado
function pegarArrastado (e) {
  e.target.placeholder = "Pego!";
  setTimeout(() => {// Tempo para mudar de placeholder
    e.target.placeholder = placeholderEspera;
  }, 4000);// 4 segundos
  var dropData
  e.stopPropagation();
  e.preventDefault();
  dropData = event.dataTransfer.getData('Text');
  regex(dropData);
}

// Insere as funções no componente
// Atributo 'onpaste' não funciona corretamente
window.addEventListener("DOMContentLoaded", (event) => {// Aguarda o DOM ser construído
  // document.getElementById('campoColar').addEventListener('paste', pegarColado(this));// Não funciona
  document.getElementById('campoColar').addEventListener('paste', pegarColado);
  document.getElementById('campoColar').addEventListener('drop', pegarArrastado);
})


//// REGEX
function regex(x) {

// 1ª Pesquisa de abrangência geral, para determinar em qual regex específico vai ir
// Separa em três saídas: identificação - conta/saldo - cálculo

// Printa entrada em linha única com \n e \t
// console.log(JSON.stringify(x));


//// ÁREA IDENTIFICAÇÃO
// Bugs conhecidos:
// [1] Não lê cabeçalho de carta precatória (meio desnecessário - "CartPrecCiv": "Autor" e "Réu")
// [2] Não lê cabeçalhos com nomes muito grandes, que o nome da partes tem mais de uma linha
// [3] HTE não identifica o polo passivo, pois ambos são "Requerentes"
// ---> Poderia tentar capturar a partir dos dois pontos (:) em dois grupos separados (independe do nome anterior)
// ---> Teria que garantir que os nomes nunca teriam (:), ou pegaria do primeiro até o final da linha?
var exprIdentificacao = [
  "JUSTIÇA DO TRABALHO",
  "PODER JUDICIÁRIO",
  "TRIBUNAL REGIONAL DO TRABALHO DA 9ª REGIÃO",
  "ATOrd", "ATSum", "RECLAMANTE: ", "RECLAMADO: ",
  "CumSen", "EXEQUENTE: ", "EXECUTADO: ",
  "CumPrSe", "REQUERENTE: ", "REQUERIDO: ",
  "ConPag", "CONSIGNANTE", "CONSIGNATÁRIO",
  "ETCiv", "EMBARGANTE", "EMBARGADO",
  "HTE", "REQUERENTES", "REQUERENTES",
]

if ( exprIdentificacao.some((element) => x.includes(element)) ) {
  console.log(x);
  console.log('Função Identificação');
  regexIdentificacao(x);
}

function regexIdentificacao(s) {
  // string.match() x regexp.exec()
  // https://stackoverflow.com/questions/27753246/match-vs-exec-in-javascript

  // Regex para capturar grupo: remova o atributo 'g'
  // https://stackoverflow.com/questions/5264701/javascript-regex-match-capture-is-returning-whole-match-not-group/5264724#5264724
  // Acentos em Regex
  // https://stackoverflow.com/questions/20690499/concrete-javascript-regular-expression-for-accented-characters-diacritics/26900132#26900132

  // Padrão: "0000424-54.2018.5.09.0125"
  regexProcesso = /([0-9]{1,7}\-[0-9]{2}\.[0-9]{4}\.5\.09\.(?:0125|0072|[0-9]{4}))/g
  capturaProcesso = s.match(regexProcesso)
  if ( capturaProcesso !== null ) {// Assegura que o valor não seja vazio
    document.getElementById('processo').value = capturaProcesso[0]
  }

  // Remove valores além da linha
  // Modelo sioyek: substituí a quebra de linha por espaços duplos
  function cortarExcessoSioyek(s) {
    if ( s.includes("  ") ) {
      // Corta o excesso depois do primeiro espaço duplo
      indexCorte = s.search("  ")
      s = s.slice(0,indexCorte)
      // Remove espaços duplos restantes (não vai haver)
      s = s.replace(/\s\s+/g, ' ')
      return s
    } else {
      return s
    }
  }

  // Padrão: "RECLAMANTE: ", "EXEQUENTE: ", "REQUERENTE: ", "CONSIGNANTE: ", "REQUERENTES: " -> "(A|E)NTE(S opcional): "
  regexExequente = /(?:(?:A|E)NTES?:\s)([\wA-zÀ-ÿ\.\ \-\(\)\:\/\,]+(?:\w|\)|\.|[A-zÀ-ÿ]))/
  capturaExequente = s.match(regexExequente)
  if ( capturaExequente !== null ) {// Assegura que o valor não seja vazio
    // Transforma o array em string
    capturaExequente = capturaExequente[1]
    // Confere excesso de entrada pelo sioyek e corta espaços duplos
    capturaExequente = cortarExcessoSioyek(capturaExequente)
    document.getElementById('exequente').value = capturaExequente
  }

  // Padrão: "RECLAMADO: ", "EXECUTADO: ", "REQUERIDO: ", "CONSIGNATÁRIO: " -> "(AD|ID|RI)O: "
  regexExecutado = /(?:(?:AD|ID|RI)O:\s)([\wA-zÀ-ÿ\.\ \-\(\)\:\/\,]+(?:\w|\)|\.|[A-zÀ-ÿ]))/
  capturaExecutado = s.match(regexExecutado)
  if ( capturaExecutado !== null ) {// Assegura que o valor não seja vazio
    // Transforma o array em string
    capturaExecutado = capturaExecutado[1]
    // Confere excesso de entrada pelo sioyek e corta espaços duplos
    capturaExecutado = cortarExcessoSioyek(capturaExecutado)
    document.getElementById('executado').value = capturaExecutado
  }

}


//// ÁREA CONTA/SALDO
var exprContaSaldo = [
  "BACENJUD/SERPRO\t",
  "SIF\t",
  "\tR$ ",
  // "\t",
]

if ( exprContaSaldo.some((element) => x.includes(element)) ) {
  console.log(x);
  console.log('Função Conta/Saldo');
  regexContaSaldo(x);
}

function regexContaSaldo(s) {

  // Padrão: "4182.042.01529386-3"
  regexConta = /(?:\d{1,4}\.?\d{1,3}\.?)?(\d{8}\-\d{1})/
  capturaConta = s.match(regexConta)
  if ( capturaConta !== null ) {// Assegura que o valor não seja vazio
    document.getElementById('conta').value = capturaConta[1]
  }

  // Padrão: "R$ 14.767,00"
  regexSaldo = /(?:R\$\ )((?:\d{1,3}\.)*\d{1,3}\,\d{2})/
  capturaSaldo = s.match(regexSaldo)
  if ( capturaSaldo !== null ) {// Assegura que o valor não seja vazio
    document.getElementById('saldo').value = capturaSaldo[1]
  }

  // Atualiza os valores da tabela (residuo.js)
  atualizaValores();

}


//// ÁREA CÁLCULO
var exprCalculo = [
  "LÍQUIDO DEVIDO AO RECLAMANTE",
  "DEVIDO AO RECLAMANTE",
  "CONTRIBUIÇÃO SOCIAL",
  "HONORÁRIOS LÍQUIDOS",
  "CUSTAS JUDICIAIS",
]

if ( exprCalculo.some((element) => x.includes(element)) ) {
  console.log(x);
  console.log('Função Calculo');
  regexCalculo(x);
}

function regexCalculo(s) {

  // Padrão: "LÍQUIDO DEVIDO AO RECLAMANTE 73.684,66"
  regexCalculo = /((?:\d{1,3}\.)*\d{1,3}?,\d{2})/
  capturaCalculo = s.split(regexCalculo)
  // Formato array:
  // ["Descrição (ou vazio)","10,00",...,"Descrição","10,00","(vazio)"]// Último item match
  // ["Descrição (ou vazio)","10,00",...,"Descrição"]// Último item não match
  // (*) "Descrição (ou vazio)": descrição com valor antes do match e vazio com match logo no começo da string

  // Deleta os valores zerados
  // while é mais aconselhável, pois slice atualiza o tamanho do array a cada remoção
  var i=1
  while (i < capturaCalculo.length ) {
    if ( capturaCalculo[i] == "0,00" ) {
      capturaCalculo.splice(i-1, 2)// Remove a descrição e o valor zerado
    } else {
      i+=2
    }
  }
  // Verifica se o último elemento é vazio o deleta se for
  // Ou se o último valor for um espaço em branco (sioyek)
  if ( capturaCalculo[capturaCalculo.length-1] == "" | capturaCalculo[capturaCalculo.length-1] == " " ) {
    capturaCalculo.pop()// Remove o último elemento
  }
  // Verifica se o tamanho do array é impar e insere um elemento vazio se for
  if ( capturaCalculo.length % 2 != 0 ) {
    capturaCalculo.push("")
  }
  // Corrige o formato dos textos dos elementos
  capturaCalculo = capturaCalculo.map((x) => {
    x = x.replace("\r","").replace("\n","").trim()
    return x
  })
  // Insere os valores nos campos
  if ( capturaCalculo !== null ) {// Assegura que o valor não seja vazio
    for (i=0; i<(capturaCalculo.length/2); i++) {
      addLine(capturaCalculo[2*i],capturaCalculo[(2*i)+1]);
    }
  }

}


}


// ACESSAR O CONTEÚDO COPIADO DO USUÁRIO AUTOMATICAMENTE
// 
// https://stackoverflow.com/questions/50633601/is-it-possible-to-paste-from-clipboard-onclick-in-javascript
// Precisa de permissão do usuário
// Só funciona no Chrome
// Firefox demanda que o usuário altere configurações (editáveis no computador do Tribunal)
// -> dom.events.testing.asyncClipboard
// -> dom.events.asyncClipboard.readText
// https://stackoverflow.com/questions/67440036/navigator-clipboard-readtext-is-not-working-in-firefox
// 
// Link: https://jsfiddle.net/zm490d6a/
// async function paste(input) {
//   const text = await navigator.clipboard.readText();
//   input.value = text;
// }
