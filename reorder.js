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

// Adicionar linha na tabela
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
    span_reorder.appendChild(button_reorder);// Colocar o botão ao redor de <span>
      // Ícone do reordenar
      var icon_reorder = document.createElement("i");
      icon_reorder.classList.add("bi", "bi-arrows-vertical");
      button_reorder.appendChild(icon_reorder);// Adicionar no botão
  // Adicionar elementos
  c1.appendChild(button_del);
  c1.appendChild(span_reorder);

  // c2: Coluna 2: Favorecido
  var input_fav = document.createElement("input");
  input_fav.classList.add("form-control");
  input_fav.id = "fav-" + counter;
  // input_fav.value = "A";
  input_fav.value = fav_value;
  c2.appendChild(input_fav);

  // c3: Coluna 3: Valor
  var input_val = document.createElement("input");
  input_val.classList.add("form-control", "text-end");
  input_val.id = "val-" + counter;
  // input_val.value = "100,00";
  input_val.value = val_value;
  c3.appendChild(input_val);

}

// Modelo da tabela
// <tr>
//   <td class="botoes">
//     <button class="btn btn-delete btn-outline-danger btn-lg p-0 px-2"><i class="bi bi-trash"></i></button>
//     <span><button class="btn reordenar btn-lg p-0 px-1"><i class="bi bi-arrows-vertical"></i></button></span>
//   </td>
//   <td><input value="A" class="form-control"></td>
//   <td><input value="320,00" class="form-control text-end"></td>
// </tr>

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
