var _indiceProcessos = 0;   //var que grava a ordem de inserção dos processos
var tempoTotalProcessos=0;  //var que guarda a soma do tempo dos processos
var tempoTotalExecucao=0;   //var que guarda tempo total da execuçao de todos os processos
var mediaTempoExecucao=0;  //var que guarda a media de tempo de execucao
var graficoChart;           //var que contem o grafico de barras
var Processo = new Array(); //array do tipo Processos

// Classe processo
function Processos(_nome, _prioridade, _tempo){
    this.indice = _indiceProcessos++;
    this.nome = _nome;
    this.prioridade = _prioridade;
    this.tempo = _tempo;
    this.tempoDeExecucao;
}


//função que insere um processo
function inserirProcesso() {

    //capturando inputs
    var nome       = document.getElementById('inputNome').value;
    var prioridade = parseInt(document.getElementById('inputPrioridade').value);
    var tempo      = parseInt(document.getElementById('inputTempo').value);

    //zerando inputs visual
    document.getElementById('inputNome').value       = "";
    document.getElementById('inputPrioridade').value = "";
    document.getElementById('inputTempo').value      = "";

    novoProcesso = new Processos(nome, prioridade, tempo);                       //criando novo objeto processo
    Processo.push(novoProcesso);                                                 //atribuindo ao array de processos o novo processo
 
    tempoTotalProcessos += novoProcesso.tempo;                                   //atribuindo o tempo do processo a variavel contadora 
    tempoTotalExecucao += tempoTotalProcessos;                                   //atribuindo o tempo de execucao variavel contadora                        	        
    mediaTempoExecucao = (tempoTotalExecucao/Processo.length).toFixed(1);        //calculando tempo médio da execucao e formatando com uma casa decimal (toFixed(1))
    atualizarGrafico(graficoChart,[novoProcesso.nome], [tempoTotalProcessos]);   //atualizando gráfico com o novo processo
    addProcessoVisual(novoProcesso, tempoTotalProcessos);                        //inserindo visualmente o processo no rodapé da página   
    
}

// função que escalona os processos, recebendo como parametro o tipo do escalonamento
function escalonar(modo) {

    tempoTotalProcessos  = 0;                //zerando variavel que armazena tempo total
    tempoTotalExecucao   =0;
    mediaTempoExecucao   =0;
    var ProcessoAuxiliar = new Array();     //criando array de processo auxiliar que recebera os processos ordenados
    

    graficoChart.destroy();                 //destroindo o gráfico para criar um novo ordenado                                                                 
    Criagrafico();                          //criando um novo gráfico ainda vazio
    limparProcessoVisual();                 //limpando os processos do rodapé

    switch (modo) {

        //se fifo
        case "fifo": 
            for (row in Processo) {                                                         //percorrendo os processos
                tempoTotalProcessos = tempoTotalProcessos + Processo[row].tempo;            //somando tempo total dos processos
                tempoTotalExecucao  += tempoTotalProcessos;                                 //calculando tempo total de execução
                mediaTempoExecucao  = (tempoTotalExecucao/Processo.length).toFixed(1);      //calculando a media de tempo de execução dos processos, formatando com uma casa decimal
                addProcessoVisual(Processo[row], tempoTotalProcessos);                      //adicionando processo no rodapé
                atualizarGrafico(graficoChart, Processo[row].nome, tempoTotalProcessos);    //adicionando processo ao gráfico
            }            
        break;

        //se +curto    
        case "maisCurto":
            ProcessoAuxiliar = selectionSortTempo(Processo);                                        //Chamando função de ordenação por tempo, passando o array de processos e atribuindo o retorno para a var auxiliar

            for (row in ProcessoAuxiliar) {                                                         //percorrendo os processos
                tempoTotalProcessos = tempoTotalProcessos + ProcessoAuxiliar[row].tempo;            //somando tempo total dos processos
                tempoTotalExecucao  += tempoTotalProcessos;                                         //calculando tempo total de execução
                mediaTempoExecucao  = (tempoTotalExecucao/Processo.length).toFixed(1);              //calculando a media de tempo de execução dos processos, formatando com uma casa decimal
                addProcessoVisual(Processo[row], tempoTotalProcessos);                              //adicionando processo no rodapé
                atualizarGrafico(graficoChart, ProcessoAuxiliar[row].nome, tempoTotalProcessos);    //adicionando processo ao gráfico
            }
        break;

        //se prioridade    
        case "prioridade":
            ProcessoAuxiliar = selectionSortPrioridade(Processo);                                  //Chamando função de ordenação por tempo, passando o array de processos e atribuindo o retorno para a var auxiliar            

            for (row in ProcessoAuxiliar) {                                                        //percorrendo os processos
                tempoTotalProcessos = tempoTotalProcessos + ProcessoAuxiliar[row].tempo;           //somando tempo total dos processos
                tempoTotalExecucao  += tempoTotalProcessos;                                        //calculando tempo total de execução
                mediaTempoExecucao  = (tempoTotalExecucao/Processo.length).toFixed(1);             //calculando a media de tempo de execução dos processos, formatando com uma casa decimal
                addProcessoVisual(ProcessoAuxiliar[row], tempoTotalProcessos);                     //adicionando processo no rodapé
                atualizarGrafico(graficoChart, ProcessoAuxiliar[row].nome, tempoTotalProcessos);   //adicionando processo ao gráfico
            }
        break;

        case "circular":
            ProcessoAuxiliar = JSON.stringify(Processo)                                            //copiando processos para processo auxiliar em forma de string
            ProcessoAuxiliar = JSON.parse(ProcessoAuxiliar)                                        //transformando a string em onjeto novamente
            ProcessoOrdenadoCircular = new Array();                                                //Array que irá guardar os processos ordenados por circular
            var tempoCircular=0;                                                                   //Variavel que soma os tempos do circular
            var indice=0;                                                                          //indice para controlar a reorganização dos tempos
            var flag = false;                                                                      //flag usada para saber quando excluir um processo do array de processo auxiliar                           
            var indiceExclusao;                                                                    //variavel que armazena o indice de qual posicao de auxiliar dev ser excluida
            var tempoTotal = new Array();                                                          //Array que armazena o tempo total de cada termino de processo
            

            //enquanto existir processos
            while(ProcessoAuxiliar.length > 0){ 

                //percorre os processos
                for (row in ProcessoAuxiliar)
                {
                    ProcessoAuxiliar[row].tempo--;                                                              //diminui o tempo dos processos
                    tempoCircular++;                                                                            //aumenta em 1 tempos o tempo total de execução    
                    mediaTempoExecucao = (tempoCircular/Processo.length).toFixed(1);                            //calcula a média do tempo de execução e formata com uma casa decimal

                    //se o tempo do processo lido chegou a 0
                    if(ProcessoAuxiliar[row].tempo === 0){                       
                        ProcessoOrdenadoCircular.push(ProcessoAuxiliar[row]);                                   //joga o processo pra variavel que contem os processos ordenados por circular
                        tempoTotal.push(tempoCircular);                                                         //inserindo o tempo de término desse processo no array de tempos
                        var flag = true;
                        indiceExclusao = row;                                                                   //guardando posicao do processo que deve ser excluido do array auxiliar
                    }
                    
                }
                if (flag){
                    ProcessoAuxiliar.splice(indiceExclusao,1);                                                  //Excluindo o processo que terminou de executa do array auxliar
                    flag = false;                                          
                }
            }

            //INSERINDO NOVAMENTE O TEMPO DE CADA PROCESSO GUARDADO NO ARRAY DE TEMPOS, DEVIDO AO TEMPO DE CADA PROCESSO TER SIDO ZERADO NO CIRCULAR 
            indice=0;
            while(indice <= Processo.length-1){
                for(row in Processo){
                    if(ProcessoOrdenadoCircular[indice].indice === Processo[row].indice){
                        ProcessoOrdenadoCircular[indice].tempo = Processo[row].tempo;
                        break;                        
                    } 
                }
                addProcessoVisual(ProcessoOrdenadoCircular[indice], tempoTotal[indice]);                      //adicionando processo no rodapé
                atualizarGrafico(graficoChart, ProcessoOrdenadoCircular[indice].nome, tempoTotal[indice]);    //adicionando processo ao gráfico
                indice++;
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

    var tempoMedio = `<h4 id="tempo">Tempo Médio: <strong> ${mediaTempoExecucao} s. </strong></h4>`
    $("#tempoMedio").append(tempoMedio);
    tempoMedio = "";
                
}

function limparProcessoVisual(){ 
    for(row in Processo){  
        $("#teste").remove();    
    }            
}
