// Usa a biblioteca 'clipboard.js'
// https://clipboardjs.com/ (https://github.com/zenorocha/clipboard.js)

window.addEventListener("DOMContentLoaded", (event) => {// Aguarda o DOM carregar
  // Pega os botões copiar por id
  // var btn = document.getElementById('copiar-minuta');
  // var clipboard = new ClipboardJS(btn);

  // Pega os botões copiar por classe
  var clipboard = new ClipboardJS('.copiar-minuta');

  clipboard.on('success', function(e) {
    // console.log(e);
    // console.log("Sucesso ao copiar");
    // Limpa a seleção do elemento copiado
    clearSelection();
    // Esconde o tooltip
    hideTooltip(e.trigger);
    // Verifica se o elemento contém a classe 'copiar-icon'
    if ( e.trigger.classList.contains("copiar-icon") ) {
      // Altera o ícone
      mudarIcon();
    }
  });

  clipboard.on('error', function(e) {
    // console.log(e);
    console.log("Erro ao copiar");
  });

});

// Limpa a seleção dos valores copiados
// https://stackoverflow.com/questions/6562727/is-there-a-function-to-deselect-all-text-using-javascript
function clearSelection() {
  if (window.getSelection) {window.getSelection().removeAllRanges();}
  else if (document.selection) {document.selection.empty();}
}

// Esconde o tooltip após um tempo
// https://stackoverflow.com/questions/37381640/tooltips-highlight-animation-with-clipboard-js-click/37395225#37395225
function hideTooltip(btn) {
  setTimeout(function() {
    $(btn).tooltip('hide');
  }, 3000);
}

// Muda o ícone temporariamente após clicar em copiar
function mudarIcon() {
  btn = document.getElementsByClassName('copiar-icon')[0];
  // Altera o ícone
  btn.innerHTML = '<i class="bi bi-clipboard-check"></i>';
  // Retorna o ícone após o tempo encerrar
  setTimeout(function() {
    btn.innerHTML = '<i class="bi bi-clipboard"></i>';
  }, 3000)
}
