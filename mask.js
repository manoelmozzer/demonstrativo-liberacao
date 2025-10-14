// Inputmask
// https://github.com/RobinHerbots/Inputmask
// https://robinherbots.github.io/Inputmask/
// https://www.jqueryscript.net/form/Easy-jQuery-Input-Mask-Plugin-inputmask.html

// Outras bibliotecas
//
// [1] imaskjs
//     https://imask.js.org/ (https://github.com/uNmAnNeR/imaskjs)
//     * Precisa dos eventos "mask.updateValue();" e "mask.updateControl();" (https://github.com/uNmAnNeR/imaskjs/issues/386)
//     * Não funcionou corretamente com o floating label
//
// [2] jQuery Mask Plugin
//     https://igorescobar.github.io/jQuery-Mask-Plugin/ (https://github.com/igorescobar/jQuery-Mask-Plugin)
//     * Não testei a fundo


window.addEventListener("DOMContentLoaded", (event) => {// Aguarda o DOM carregar


//// MÁSCARA PROCESSO
maskProcesso = document.getElementById('processo');

// Inputmask({
//   mask: "9999999-99.9999.5.0\\9.9999",
//   placeholder: "0000000-__.____.5.09.____",
//   // placeholder: "       -  .    .5.09.    ",
// }).mask(maskProcesso);

// O foco é copiar e colar. Não vale a pena otimizar para a digitação
// Comportamento: [Input vazio] -> digita números -> [123] -> digita '-' -> [0000123-|__.____.5.09.____]
// Bugs conhecidos:
// [1] Depois número digitado, deletar um número antes do traço faz engolir um número do final e aparece placeholder: [000004-15.2020.5.09.072_]
// --> Possível solução: múltiplos placeholders ou tratar placeholders diferentes após onKeyDown
// [2] Depois do número digitado, deletar o número antes do traço e digitar '-' refaz o número apenas com os valores de antes do cursor
// --> Possível solução: Tratamento melhor em 'onKeyValidation'
Inputmask({
  mask: ["9{1,7}", "9{1,7}-99.9999.5.0\\9.9999"],
  placeholder: " ______-__.____.5.09.____",
  keepStatic: true,
  // jitMasking: true,
  // staticDefinitionSymbol: "-",
  // onKeyDown: function (event, buffer, caretPos, mask) {
  //   console.log (event); console.log (buffer);
  //   console.log (caretPos); console.log (mask);
  // },
  onKeyValidation: function (key, result) {
    // Verifica se a entrada '-' é válida
    // Segundo condicional funciona com uma única entrada. Primeiro nos demais casos.
    if ( result.c == '-' || ( key == '-' && typeof result == "object" ) ) {
      valorEntrada = maskProcesso.value;// '0000000-__.____.5.09.____'
      // Limpa as entradas posteriores ao '-'
      valorLimpo = valorEntrada.slice(0,result.pos+1);
      zerosFrente = 7 - result.pos;
      // Adiciona zeros no valor digitado
      for(i=0; i<zerosFrente; i++) {
        valorLimpo = "0" + valorLimpo
      }
      // Substitui o valor do input
      maskProcesso.value = valorLimpo;
    }
  }
}).mask(maskProcesso);


//// MÁSCARA CONTA
maskConta = document.getElementById('conta');

//// TODO: Ajutar conforme o modelo do Banco do Brasil. Atual só aceita o formato da Caixa:
// Inputmask({
//   mask: "9{8}-9",
//   placeholder: "________-_",
// }).mask(maskConta);


//// MÁSCARA DINHEIRO
cfgMaskDinheiro = new Inputmask({
  alias: 'decimal',
  //// ESCREVE DECIMAL DA DIREITA PARA ESQUERDA
  //// https://robinherbots.github.io/Inputmask/#/documentation#numericinput
  //// Bug: Não digita nada se o cursos estiver na direita do decimal: "0,|00"
  numericInput: true,
  allowMinus: false,
  groupSeparator: '.',
  radixPoint: ",",
  digits: 2,
  placeholder: '0',
  // _radixDance: false,
  // digitsOptional: false,
  // positionCaretOnClick: 'lvp',
  //// DESATIVA OPÇÃO STEP (ctrl-up, ctrl-down)
  //// Limpa a chamada no código (linha 1892)
  // step: 1,
  onKeyDown: function(e,t,n,i){
    if(e.ctrlKey) {}// https://github.com/RobinHerbots/Inputmask/blob/5.x/dist/inputmask.js#L1892
  }
});

// Aplica em todos os campos atuais com a classe 'maskDinheiro'
cfgMaskDinheiro.mask(document.querySelectorAll(".maskDinheiro"));

// Reaplica em todos os campos a cada vez que um novo campo é criado
// Função criada dentro do 'DOMContentLoaded': deve ser definida diretamente no window (global)
// https://stackoverflow.com/questions/5067887/function-is-not-defined-uncaught-referenceerror/5067939#5067939
// https://stackoverflow.com/questions/29514382/global-functions-in-javascript/59027086#59027086
window.reaplicarMaskDinheiro = function(){
  cfgMaskDinheiro.mask(document.querySelectorAll(".maskDinheiro"));
}


})
