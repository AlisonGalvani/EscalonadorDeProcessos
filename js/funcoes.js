var _indiceProcessos = 0;   //var que grava a ordem de inserção dos processos
var mediaTempoProcessos=0;  //var que guarda a media de tempo dos processos
var tempoTotalProcessos=0;  //var que guarda a soma do tempo dos processos
var graficoChart;           //var que contem o grafico de barras
var Processo = new Array(); //array do tipo Processos

// Classe processo
function Processos(_nome, _prioridade, _tempo){
    this.indice = _indiceProcessos++;
    this.nome = _nome;
    this.prioridade = _prioridade;
    this.tempo = _tempo
}


//função que insere um processo
function inserirProcesso() {

    //capturando inputs
    var nome = document.getElementById('inputNome').value;
    var prioridade = parseInt(document.getElementById('inputPrioridade').value);
    var tempo = parseInt(document.getElementById('inputTempo').value);

    //zerando inputs visual
    document.getElementById('inputNome').value = "";
    document.getElementById('inputPrioridade').value = "";
    document.getElementById('inputTempo').value = "";

    novoProcesso = new Processos(nome, prioridade, tempo);                       //criando novo objeto processo
    Processo.push(novoProcesso);                                                 //atribuindo ao array de processos o novo processo
 
    tempoTotalProcessos += novoProcesso.tempo;                                   //atribuindo o tempo do processo a variavel contadora  	        
    mediaTempoProcessos = (tempoTotalProcessos/Processo.length).toFixed(1);      //calculando tempo médio do processo e formatando com uma casa decimal (toFixed(1))

    atualizarGrafico(graficoChart,[novoProcesso.nome], [tempoTotalProcessos]);   //atualizando gráfico com o novo processo
    addProcessoVisual(novoProcesso, tempoTotalProcessos);                        //inserindo visualmente o processo no rodapé da página   
    
}

// função que escalona os processos, recebendo como parametro o tipo do escalonamento
function escalonar(modo) {

    tempoTotalProcessos = 0;     //zerando variavel que armazena tempo total

    graficoChart.destroy();     //destroindo o gráfico para criar um novo ordenado                                                                 
    Criagrafico();              //criando um novo gráfico ainda vazio
    limparProcessoVisual();     //limpando os processos do rodapé

    switch (modo) {

        //se fifo
        case "fifo":
            for (row in Processo) {                                                         //percorrendo os processos
                tempoTotalProcessos = tempoTotalProcessos + Processo[row].tempo;            //somando tempo total dos processos
                addProcessoVisual(Processo[row], tempoTotal);                               //adicionando processo no rodapé
                atualizarGrafico(graficoChart, Processo[row].nome, tempoTotalProcessos);    //adicionando processo ao gráfico
            }            
        break;

        //se +curto    
        case "maisCurto":
            var ProcessoAuxiliar = new Array();                                                     //criando array de processo auxiliar que recebera os processos ordenados
            ProcessoAuxiliar = selectionSortTempo(Processo);                                        //Chamando função de ordenação por tempo, passando o array de processos e atribuindo o retorno para a var auxiliar

            for (row in ProcessoAuxiliar) {                                                         //percorrendo os processos
                tempoTotalProcessos = tempoTotalProcessos + ProcessoAuxiliar[row].tempo;            //somando tempo total dos processos
                addProcessoVisual(Processo[row], tempoTotal);                                       //adicionando processo no rodapé
                atualizarGrafico(graficoChart, ProcessoAuxiliar[row].nome, tempoTotalProcessos);    //adicionando processo ao gráfico
            }
        break;

        //se prioridade    
        case "prioridade":
            var ProcessoAuxiliar = new Array();                                                    //criando array de processo auxiliar que recebera os processos ordenados
            ProcessoAuxiliar = selectionSortPrioridade(Processo);                                  //Chamando função de ordenação por tempo, passando o array de processos e atribuindo o retorno para a var auxiliar

            for (row in ProcessoAuxiliar) {                                                        //percorrendo os processos
                tempoTotalProcessos = tempoTotalProcessos + ProcessoAuxiliar[row].tempo;           //somando tempo total dos processos

                addProcessoVisual(ProcessoAuxiliar[row], tempoTotal);                              //adicionando processo no rodapé
                atualizarGrafico(graficoChart, ProcessoAuxiliar[row].nome, tempoTotalProcessos);   //adicionando processo ao gráfico
            }
        break;
    }

}

//Selection sorte para ordenação por tempo
function selectionSortTempo(array) {
    for (var i = 0; i < array.length; i++) {
        var min = i;
        for (var j = i + 1; j < array.length; j++) {
            if (array[j].tempo < array[min].tempo) {
                min = j;
            }
        }
        var temp = array[i];
        array[i] = array[min];
        array[min] = temp;
    }
    return array;
};

//Selection sorte para ordenação por Prioridade
function selectionSortPrioridade(array) {
    for (var i = 0; i < array.length; i++) {
        var min = i;
        for (var j = i + 1; j < array.length; j++) {
            if (array[j].prioridade > array[min].prioridade) {
                min = j;
            }
        }
        var temp = array[i];
        array[i] = array[min];
        array[min] = temp;
    }
    return array;
};

//Função que cria o gráfico com todo os parametros necessario e instancia na variavel global graficoChart
function Criagrafico() {
    graficoChart = new Chart(document.getElementById("grafico-barra"), {
        type: 'bar',
        data: {
            datasets: [{
                backgroundColor: '#2d78b9',
                borderColor: 'white',
                borderWidth: 2,
            
            },
            ]
        },
        options: {
            legend: {
                display: false,
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        color: '#414141',

                    },
                    ticks: {
                        fontColor: "white",
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Processos',
                        fontColor: 'white'
                    }
                }],
                yAxes: [{
                    gridLines: {
                        color: '#414141',

                    },
                    ticks: {
                        fontColor: "white",
                        min: 0
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Tempo em S.',
                        fontColor: 'white'
                    }
                }],

            }
        },



    });
}

//função que atualiza os valores do gráfico
function atualizarGrafico(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}


function addProcessoVisual(processoNovo, tempo){

    var input = '<fieldset class="fieldProcesso" id="teste">';
        input +=`<h6>Processo: ${processoNovo.nome}</h6>`
        input += `<label>Prioridade: ${processoNovo.prioridade}</label>`;
        input += `<label>Tempo: ${processoNovo.tempo}</label>`;
        input += `<label>T. execução: ${tempo}</label>`;
        input += '</fieldset>'

    $("#nomes").append(input);
    input = "";

    $("#tempo").remove();

    var tempoMedio = `<h2 id="tempo">Tempo Médio: <strong> ${mediaTempoProcessos} s. </strong></h2>`
    $("#tempoMedio").append(tempoMedio);
    tempoMedio = "";
                
}

function limparProcessoVisual(){ 
    for(row in Processo){  
        $("#teste").remove();    
    }            
}
