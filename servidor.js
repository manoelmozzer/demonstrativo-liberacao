// Preenche os campos de servidor e cargo
function addServidor(x){
  nome = x.textContent;// Pega o valor que estiver no texto do botão do servidor. Ex.: Camila
  // dadosServidor = window[nome];// Carrega o array quando o primeiro nome do servidor é o nome do array
  index = opcoesServTabela.map((e) => e[0]).indexOf(nome);
  dadosServidor = opcoesServTabela[index].slice(1);// Seleciona apenas nome completo e cargo: ["NOME COMPLETO", "Cargo"]
  document.getElementById('servidor').value = dadosServidor[0];
  document.getElementById('cargo').value = dadosServidor[1];
  storageServidor(dadosServidor);
}

// LocalStorage
// https://www.w3schools.com/html/tryit.asp?filename=tryhtml5_webstorage_local_clickcount
// https://stackoverflow.com/questions/21199869/chrome-content-scripts-save-to-database
// https://www.w3schools.com/html/html5_webstorage.asp

// Salva os dados do servidor selecionado no Storage
function storageServidor(x) {
  if (typeof(Storage) !== "undefined") {
    localStorage.servidor = x[0];
    localStorage.cargo = x[1];
  }
}
// Carrega a informação do servidor selecionado quando acessa a página
// Aguarda a página ser carregada no DOM (rodar o código no final)
// https://stackoverflow.com/questions/26107125/cannot-read-property-addeventlistener-of-null/26107174#26107174
window.addEventListener("DOMContentLoaded", (event) => {
  // Carrega informações do servidor no storage (se houver)
  if (typeof(Storage) !== "undefined") {
    // Verificar se há informações salvas anteriormente
    if ( typeof(localStorage.servidor) !== "undefined" && typeof(localStorage.servidor) !== "undefined" ) {
      servidor = localStorage.servidor;
      cargo = localStorage.cargo;
      document.getElementById('servidor').value = servidor;
      document.getElementById('cargo').value = cargo;
    }
  }
})

// Cria os botões com a lista de servidores
function listarServidores() {
  var listaServidores = document.getElementById("selecionarServidores");

  // Seleções do dropdown automatizadas
  // Cria os botões
  function funcaoCriarServ (value) {
  // Itens 'li'
  var liServidor = document.createElement("li")
    // Botão Servidor
    var buttonServidor = document.createElement("button")
    buttonServidor.classList.add("dropdown-item")
    buttonServidor.setAttribute("type","button");
    buttonServidor.onclick = function() { addServidor(this) };
      // Adicionar texto
      var textButtonServidor = document.createTextNode(value[0]);
      buttonServidor.appendChild(textButtonServidor);
  // Insere botão construído no li
  liServidor.appendChild(buttonServidor)
  // Retorna o li construído
  return liServidor
  }

  // Aloca os botões contruídos em um array
  var arrLiServidor = opcoesServTabela.map(funcaoCriarServ);
  // Insere os botões construído no span
  arrLiServidor.forEach((element) => 
    listaServidores.appendChild(element));
}

// Modelo da lista de servidores
// <li><button class="dropdown-item" type="button" onclick="addServidor(this)">Camila</button></li>
// <li><button class="dropdown-item" type="button" onclick="addServidor(this)">Daniela</button></li>
