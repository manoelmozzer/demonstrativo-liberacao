// CÓDIGO REORDER TABLE
// Reordena e deleta linhas da tabela
// https://bootsnipp.com/snippets/Pa5Wr
// https://web.archive.org/web/20240622232351/https://bootsnipp.com/snippets/Pa5Wr
// Precisa do Bootstrap CSS, jQuery e jQuery UI

$(document).ready(function() {
  //Helper function to keep table row from collapsing when being sorted
  var fixHelperModified = function(e, tr) {
    var $originals = tr.children();
    var $helper = tr.clone();
    $helper.children().each(function(index)
    {
      $(this).width($originals.eq(index).width())
    });
    return $helper;
  };

  //Make diagnosis table sortable
  $("#table tbody").sortable({
      helper: fixHelperModified,
    stop: function(event,ui) {renumber_table('#table')}
  }).disableSelection();

  //Delete button in table rows
  $('table').on('click','.btn-delete',function() {
    tableID = '#' + $(this).closest('table').attr('id');
    // Confirmação para deletar
    // r = confirm('Delete this item?');
    // if(r) {
    //   $(this).closest('tr').remove();
    //   renumber_table(tableID);
    //   }
    $(this).closest('tr').remove();
    renumber_table(tableID);
  });

});

//Renumber table rows
function renumber_table(tableID) {
  $(tableID + " tr").each(function() {
    count = $(this).parent().children().index($(this)) + 1;
    $(this).find('.priority').html(count);
  });
}


// Deleta linhas selecionadas por checkbox da tabela
// function del() {
//   var mytable = document.getElementById("table");
//   var rows = mytable.rows.length;
//   for(var i = rows - 1; i > 0; i--) {
//     if(mytable.rows[i].cells[0].children[0].checked) {
//       mytable.deleteRow(i);
//     }
//   }
// }


// DROPDOWN AO LADO DO INPUT DA TABELA
// Altera o valor da linha da tabela a partir da opção selecionada no dropdown
function alterarDropdownInput(x) {
  // Seleciona o texto da Opção
  opcao = x.textContent;
  // Seleciona o input que recebe o texto
  group_input = x.parentElement.parentElement.parentElement;
  input = group_input.querySelector("input");
  // Altera o valor do input
  input.value = opcao
}


// Elementos HTML no DOM
// https://www.w3schools.com/jsref/dom_obj_all.asp

// ADICIONAR LINHA
// Adiciona linha na tabela
var counter = 0;// Contar linhas adicionadas
function addLine(fav_value, val_value) {
  // Determinar valores padrão para os parâmetros
  if(typeof(fav_value)==='undefined') fav_value='';
  if(typeof(val_value)==='undefined') val_value='';
  // Formas alternativas
  // fav_value = fav_value || '';
  // val_value = val_value || '';

  // var mytable = document.getElementById("table");
  // var rows = mytable.rows.length;
  var mytableBody = document.getElementById("table").getElementsByTagName('tbody')[0];
  var r = mytableBody.insertRow();
  var c1 = r.insertCell(0);
  var c2 = r.insertCell(1);
  var c3 = r.insertCell(2);

  // Gestão de id
  counter++;

  // r: Linha
  // r.classList.add("ui-sortable-handle");

  // c1: Coluna 1: botões
  c1.classList.add("botoes");
    // Botão lixeira
    var button_del = document.createElement("button");
    button_del.classList.add("btn", "btn-delete", "btn-outline-danger", "btn-lg", "p-0", "px-2");
      // Ícone da lixeira
      var icon_del = document.createElement("i");
      icon_del.classList.add("bi", "bi-trash");
      button_del.appendChild(icon_del);// Adicionar no botão
    // Botão reordenar
    var span_reorder = document.createElement("span");
    var button_reorder = document.createElement("button");
    button_reorder.classList.add("btn", "reordenar", "btn-lg", "p-0", "px-1");
    button_reorder.tabIndex = "-1"// Não fica selecionável com tab
    span_reorder.appendChild(button_reorder);// Colocar o botão ao redor de <span>
      // Ícone do reordenar
      var icon_reorder = document.createElement("i");
      icon_reorder.classList.add("bi", "bi-arrows-vertical");
      button_reorder.appendChild(icon_reorder);// Adicionar no botão
  // Adicionar elementos
  c1.appendChild(button_del);
  c1.appendChild(span_reorder);

  // c2: Coluna 2: Favorecido
  // Div de input group
  var div_fav = document.createElement("div");
  div_fav.classList.add("input-group");
    // Botão dropdown
    var button_fav = document.createElement("button");
    button_fav.classList.add("btn", "btn-outline-secondary", "dropdown-toggle", "dropdown-toggle-split", "botaoGrupoInput")
    button_fav.setAttribute("data-bs-toggle", "dropdown");
      // Span seta para baixo
      var span_fav = document.createElement("span");
      span_fav.classList.add("visually-hidden");
      button_fav.appendChild(span_fav);
    // Opções dropdown
    var ul_fav = document.createElement("ul");
    ul_fav.classList.add("dropdown-menu");
      // Seleções do dropdown automatizadas
      function funcaoCriarOpcoes (value) {
        var li_fav = document.createElement("li");
        var button_opcoes_fav = document.createElement("button");
          button_opcoes_fav.classList.add("dropdown-item");
          button_opcoes_fav.setAttribute("type","button");
          // button_opcoes_fav.setAttribute("onclick","alterarDropdownInput(this)");
          button_opcoes_fav.onclick = function() { alterarDropdownInput(this) };
            // Adicionar texto
            var text_button_opcoes_fav = document.createTextNode(value);
            button_opcoes_fav.appendChild(text_button_opcoes_fav);
        // Insere o botão no li
        li_fav.appendChild(button_opcoes_fav);
        // Retorna o botão construído
        return li_fav;
      }
      // Aloca os botões contruídos em um array
      var arr_li_fav = opcoesFavTabela.map(funcaoCriarOpcoes);
      // Insere os botões construído no ul
      arr_li_fav.forEach((element) => 
        ul_fav.appendChild(element));
    // Caixa de texto
    var input_fav = document.createElement("input");
    input_fav.classList.add("form-control","text-uppercase");
    input_fav.id = "fav-" + counter;
    // input_fav.value = "A";
    input_fav.value = fav_value;
  // Juntar elementos
  div_fav.appendChild(button_fav);
  div_fav.appendChild(ul_fav);
  div_fav.appendChild(input_fav);
  // Adicionar tudo no tr
  c2.appendChild(div_fav);

  // c3: Coluna 3: Valor
  var input_val = document.createElement("input");
  input_val.classList.add("form-control", "maskDinheiro", "text-end");
  input_val.id = "val-" + counter;
  // input_val.value = "100,00";
  input_val.value = val_value;
  c3.appendChild(input_val);

}


// Modelo da tabela (sem botão dropdown)
// Cédula dos botões tem espaço indesejado na quebra de linha do código. Formato é útil para debug
// <tr>
//   <td class="botoes">
//     <button class="btn btn-delete btn-outline-danger btn-lg p-0 px-2"><i class="bi bi-trash"></i></button>
//     <span><button class="btn reordenar btn-lg p-0 px-1"><i class="bi bi-arrows-vertical"></i></button></span>
//   </td>
//   <td><input value="A" class="form-control"></td>
//   <td><input value="320,00" class="form-control maskDinheiro text-end"></td>
// </tr>

// Modelo da tabela (com botão dropdown)
// Cédula dos botões tem espaço indesejado na quebra de linha do código. Formato é útil para debug
// <tr>
//   <td class="botoes">
//     <button class="btn btn-delete btn-outline-danger btn-lg p-0 px-2"><i class="bi bi-trash"></i></button>
//     <span><button class="btn reordenar btn-lg p-0 px-1"><i class="bi bi-arrows-vertical"></i></button></span>
//   </td>
//   <td>
//   <div class="input-group">
//     <button class="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split botaoGrupoInput" data-bs-toggle="dropdown"><span class="visually-hidden">Opções</span></button>
//     <ul class="dropdown-menu">
//       <li><button class="dropdown-item" type="button" onclick="addServidor(this)">LÍQUIDO DEVIDO AO EXEQUENTE</button></li>
//       <li><button class="dropdown-item" type="button" onclick="addServidor(this)">CONTRIBUIÇÕES PREVIDENCIÁRIAS</button></li>
//     </ul>
//     <input class="form-control" value="A">
//   </td>
//   </div>
//   <td><input value="320,00" class="form-control maskDinheiro text-end"></td>
// </tr>

