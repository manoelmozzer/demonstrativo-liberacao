function pdf(){
  window.jsPDF = window.jspdf.jsPDF; // add this line of code

pegarDados();

// Salva as informações do servidor no localStorage
// Verificar 'servidor.js'
var dadosServidor = [servidor, cargo];
storageServidor(dadosServidor);

// Construir o pdf
const doc = new jsPDF({
  // orientation: "landscape",
  // Tamanho A4
  // unit: "mm",
  // format: [297, 210],
  format: 'a4',
  unit: "mm",
});

// DICIONÁRIO DE TAMANHO DE FONTE
// Valores testados para fonte e tamanho de linha:
// setFontSize: 12; tamanho_linha = 5 // 0,5 cm
// setFontSize: 13; tamanho_linha = 5.5 // 0,55 cm
// setFontSize: 14; tamanho_linha = 6 // 0,6 cm

// Padrão: helvetica
// console.log(doc.getFont());
doc.setFont("helvetica");
// Padrão: 16
// console.log(doc.getFontSize());
doc.setFontSize(13);

// Controle de linhas
tamanho_linha = 5.5 // 0,55 cm
function linha(n) {
  return margem_superior+(n*tamanho_linha);
}
var linha_atual = 0;

// Parâmetro x para centralizar texto
meio = (doc.internal.pageSize.width / 2);

// Margens
margem_superior = 20 // 2 cm
margem_inferior = 20 // 2 cm
margem_esquerda = 15 // 1,5 cm
margem_direita = 15 // 1,5 cm

// Cabeçalho
doc.setFont("helvetica", "bold");
cabecalho = [
  "2ª VARA DO TRABALHO DE PATO BRANCO",
  "Rua Paraná, nº 1.547 - Bairro Sambugaro",
  "85.801-090 - Pato Branco - PR",
  "e-mail: vdt02pbc@trt9.jus.br"];

for (let i = 0; i < cabecalho.length; i++) {
  doc.text(cabecalho[i], meio, linha(i+1), "center");
}

// Contagem de linhas e Espaços em branco
var pular_linhas = 4
var bloco_anterior = cabecalho.length
var linha_atual = linha_atual + bloco_anterior + pular_linhas

// Identificação
doc.setFont("helvetica", "normal");
identificacao_texto = [
  "Processo: ",
  "Exequente: ",
  "Executado: "];
identificacao;// Origem 'dados.js'

for (let i = 0; i < identificacao_texto.length; i++) {
  doc.text(identificacao_texto[i] + identificacao[i], margem_esquerda, linha(linha_atual+i));
}

// Contagem de linhas e Espaços em branco
var pular_linhas = 3
var bloco_anterior = identificacao_texto.length
var linha_atual = linha_atual + bloco_anterior + pular_linhas

// Saldo em conta judicial
doc.setTextColor("red");
conta_texto = "Saldo em conta judicial 4182-042-";
conta;// Origem 'dados.js'
saldo;// Origem 'dados.js'
doc.text(conta_texto + conta, margem_esquerda, linha(linha_atual));
// doc.text("R$ " + saldo, doc.internal.pageSize.width-margem_direita, linha(linha_atual), "right");
doc.text(saldo, doc.internal.pageSize.width-margem_direita, linha(linha_atual), "right");

// Contagem de linhas e Espaços em branco
var pular_linhas = 2
var bloco_anterior = 1
var linha_atual = linha_atual + bloco_anterior + pular_linhas


// Tabela
head = [['Favorecido', 'Valor', 'Percentual']]
body = tabela
// foot = [['Total', 'R$ ' + valor_total_liberado, percentagem_total]]
foot = [['Total', valor_total_liberado, percentagem_total]]

doc.autoTable({
  startY: linha(linha_atual),
  margin: {left: margem_esquerda, right: margem_direita},
  head: head,
  body: body,
  foot: foot,
  styles: {
    font: 'helvetica',
    fontSize: number = 12,
  },
  headStyles: {fillColor: [64,64,64]},// Preenchimento preto 25% transparência
  footStyles: {fillColor: [64,64,64]},// Preenchimento preto 25% transparência
  bodyStyles: {textColor: 0},// Letra preta
  // Alinhamento manual de célular do cabeçalho e rodapé
  // https://stackoverflow.com/questions/66022870/align-text-left-using-jspdf-jspdf-auto-table
  didParseCell: data => {
    if (data.cell.section === 'head' || data.cell.section === 'foot') {
      switch (data.column.index) {
          case 1:
          case 2:
              data.cell.styles.halign = 'right';
              // data.cell.styles.overflow = 'visible';// Não quebra a linha, mesmo que invada a próxima cédula
              data.cell.styles.cellWidth = 'wrap';// Não quebra a linha
        }
      }
    },
  columnStyles: {
    // 0: {minCellWidth: 110},
    1: {halign: 'right'},
    2: {halign: 'right', cellWidth:30},
  },
})

// Posição Y final da última tabela
// console.log(doc.lastAutoTable.finalY);

// Contagem de linhas e Espaços em branco
var pular_linhas = 3
var linha_atual = Math.trunc((doc.lastAutoTable.finalY-margem_superior)/tamanho_linha)+1
var linha_atual = linha_atual + pular_linhas

// Data e local
doc.setTextColor("black");
data_atual = new Date();
data_atual = data_atual.toLocaleDateString('pt-BR',{day: 'numeric', month: 'long', year: "numeric"});
doc.text("Pato Branco, " + data_atual, meio, linha(linha_atual), "center");


// Contagem de linhas e Espaços em branco
var pular_linhas = 2
var bloco_anterior = 1
var linha_atual = linha_atual + bloco_anterior + pular_linhas

// Servidor e função
doc.text(servidor, meio, linha(linha_atual), "center");
doc.text(cargo, meio, linha(linha_atual+1), "center");

// https://stackoverflow.com/questions/17739816/how-to-open-generated-pdf-using-jspdf-in-new-window
doc.save("Demonstrativo de Liberação de Valores.pdf");
// doc.output('dataurlnewwindow');

}