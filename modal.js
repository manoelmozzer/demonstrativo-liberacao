// TIPOS DE MODALS
// Formato: arr = [titulo, placeholder]

var planilhaCalculo = [
"Colar - Planilha de Cálculo",
"Valor Esperado:\n\n\
LÍQUIDO DEVIDO AO RECLAMANTE 73.684,66\n\
CONTRIBUIÇÃO SOCIAL SOBRE SALÁRIOS DEVIDOS 8.750,17\n\
..."]


// Modelo para reaproveitar o mesmo modal
// https://getbootstrap.com/docs/5.0/components/modal/#varying-modal-content
// 
// Aguarda a página ser carregada no DOM (rodar o código no final)
// https://stackoverflow.com/questions/26107125/cannot-read-property-addeventlistener-of-null/26107174#26107174
// window.addEventListener("DOMContentLoaded", (event) => { CONTENT })
// 
function carregarModals() {
  var pasteModal = document.getElementById('pasteModal')
  pasteModal.addEventListener('show.bs.modal', function (event) {
    // Button that triggered the modal
    var button = event.relatedTarget
    // Extract info from data-bs-* attributes
    var tipo = button.getAttribute('data-bs-tipo')
    // Pega o array com o nome do tipo informado como string
    // https://stackoverflow.com/questions/16282045/javascript-array-name-as-string-need-it-to-reference-the-actual-array/16282110#16282110
    // https://stackoverflow.com/questions/14431432/create-javascript-variable-with-name-of-a-variable-and-string-combined
    var dados = window[tipo]
    // Update the modal's content.
    var modalTitle = pasteModal.querySelector('.modal-title')
    var modalBodyInput = pasteModal.querySelector('.modal-body textarea')
    var buttonEnviar = pasteModal.querySelector('#enviar')

    // Atualizar as informações do modal
    modalTitle.textContent = dados[0]
    modalBodyInput.placeholder = dados[1]
    // Mudar o evento onclick
    // https://www.w3schools.com/jsref/event_onclick.asp
    // https://stackoverflow.com/questions/42824309/how-to-change-onclick-using-javascript/42824347#42824347
    // https://stackoverflow.com/questions/5303899/change-onclick-action-with-a-javascript-function/5303931#5303931
    // 
    // Executar uma função com o nome de uma string
    // https://www.geeksforgeeks.org/how-to-execute-a-function-when-its-name-as-a-string-in-javascript/
    // https://stackoverflow.com/questions/359788/how-to-execute-a-javascript-function-when-i-have-its-name-as-a-string
    buttonEnviar.onclick = function() {window[tipo + "_regex"]()}

  })
}


function planilhaCalculo_regex() {
  console.log("estou aqui, dentro do regex")
}
