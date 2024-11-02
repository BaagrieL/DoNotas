import { Aluno } from "../js/Aluno.js"
import * as PaginaInicial from "../js/script.js";


export function turmaZone() {
    turma = PaginaInicial.carregarTurmaSelecionada()
    // Remove event listeners duplicados
    // necessario porque dá erro de replicar a ação para todas as turmas 
    removerEventListeners();

    // Adicionando os event listeners com as novas funções
    btnInserirAluno.addEventListener("click", handleInserirAluno);
    btnDeletarAluno.addEventListener("click", handleDeletarAluno);

    document.getElementById("turma-header").innerHTML = turma.turmaNome === "guia" ? "<h1>Guia de Turismo</h1>" : `<h1>${turma.turmaNome.charAt(0).toUpperCase() + turma.turmaNome.slice(1)}</h1>`;

    handleListarAlunos();
}
function handleInserirAluno() {
    if (turma) {
        const nomeAlunoInput = document.getElementById("nome-aluno__turma");
        if (nomeAlunoInput.value.trim() !== "") {

            const alunoInserido = turma.insertAluno(nomeAlunoInput.value.trim());
            if (!alunoInserido) {
                return;
            }

            const tabelaCorpo = document.getElementById("tbody");
            const ultimoAluno = turma.alunos[turma.alunos.length - 1];
            renderizarAluno(ultimoAluno, tabelaCorpo); // Reutiliza renderizarAluno

            atualizarTurmaNoLocalStorage(turma);

            nomeAlunoInput.value = "";
            showMyToast("Aluno inserido com sucesso!");
        } else {
            alert("Digite o nome do aluno");
        }
    }
}



let turma = null;

const btnInserirAluno = document.getElementById("btn-inserir-aluno");
const btnDeletarAluno = document.getElementById("btn-deletar-aluno");
const btnListarAlunos = document.getElementById("btn-listar-alunos");

function handleDeletarAluno() {
    if (turma) {
        const nomeAlunoInput = document.getElementById("nome-aluno__turma");
        if (nomeAlunoInput.value.trim() !== "") {
            if (turma.deleteAluno(nomeAlunoInput.value.trim())) {
                atualizarTurmaNoLocalStorage(turma);
                renderizarTabelaCompleta();
                nomeAlunoInput.value = "";
                showMyToast("Aluno deletado com sucesso!");
            } else {
                alert(`Aluno ${nomeAlunoInput.value} não encontrado na turma ${turma.turmaNome}`);
            }
        } else {
            alert("Digite o nome do aluno");
        }
    }
}


function handleListarAlunos() {
    if (turma) {
        const alunos = turma.getAllAlunos();
        const tabelaCorpo = document.getElementById("tbody");
        const tabelaCabecalho = document.getElementById("thead_row");
    
        // Necessário para limpar o conteúdo atual e evitar duplicações
        tabelaCorpo.innerHTML = ""; 
        tabelaCabecalho.innerHTML = ""; 
    
        // Instância temporária para acessar as propriedades
        const alunoExemplo = new Aluno("exemplo"); 
    
        // Cria o cabeçalho da tabela
        for (let [key] of Object.entries(alunoExemplo)) {
            // Lidar com notas somente depois
            if (key === "notas" || key === "turmaEntity") continue;
    
            const thCell = document.createElement("th");
            thCell.textContent = key;
            tabelaCabecalho.appendChild(thCell);
        }
    
        // Adiciona o cabeçalho para cada coluna de nota        
        for (let i = 0; i < turma.avaliacoesTotais; i++) {            
            const thNota = document.createElement("th");
            thNota.textContent = `Nota ${i + 1}`;
            tabelaCabecalho.appendChild(thNota);
        }
        
        alunos.forEach(aluno => {
            console.log(aluno);
    
            const row = document.createElement("tr");
    
            for (let [key, value] of Object.entries(aluno)) {
                if (key === "notas" || key === "turmaEntity") continue;
    
                ;
                row.appendChild(criarCelula(key === "aprovado" ? (value ? "sim" : "não") : value));
            }
    
            // Preenche as colunas de notas com base em turma.avaliacoesTotais
            for (let i = 0; i < turma.avaliacoesTotais; i++) {
                const tdNota = document.createElement("td");
                tdNota.textContent = aluno.notas[i] !== undefined ? aluno.notas[i] : "--";
                row.appendChild(tdNota);
            }
    
            tabelaCorpo.appendChild(row);
        });
    }
    
}

function renderizarTabelaCompleta() {
    const tabelaCorpo = document.getElementById("tbody");
    tabelaCorpo.innerHTML = ""; 

    turma.alunos.forEach(aluno => renderizarAluno(aluno, tabelaCorpo));
}


function renderizarAluno(aluno, tabelaCorpo) {
    const row = document.createElement("tr");

    // Cria células para as propriedades do aluno (exceto notas e turmaEntity)
    for (let [key, value] of Object.entries(aluno)) {
        if (key === "notas" || key === "turmaEntity") continue;

        // Adiciona "sim" ou "não" para o campo "aprovado"
        row.appendChild(criarCelula(key === "aprovado" ? (value ? "sim" : "não") : value));
    }

    // Cria células para as notas com base no total de avaliações da turma
    for (let i = 0; i < aluno.turmaEntity.avaliacoesTotais; i++) {
        const tdNota = document.createElement("td");
        tdNota.textContent = aluno.notas[i] !== undefined ? aluno.notas[i] : "--";
        row.appendChild(tdNota);
    }

    // Adiciona a linha renderizada ao corpo da tabela
    tabelaCorpo.appendChild(row);
}


function criarCelula(texto) {
    const td = document.createElement("td");
    td.textContent = texto;
    return td;
}

/**
 * Insere uma nota em um aluno, desde que o número de notas do aluno
 * seja menor que o total de avaliações da turma.
 * @param {Aluno} aluno - O aluno que receberá a nota.
 */
function insertNota(aluno, nota) {
    if (aluno.notas > turma.avaliacoesTotais) {
        aluno.inserirNovaNota(nota);
        insertAvaliação();
    }

}

function insertAvaliação (turma) {
    turma.avaliacoesTotais += 1;
    atualizarTurmaNoLocalStorage(turma);    
}


function showMyToast(message, duration, color) {
    const toast = new Toastify({
        text: `${message ? message : 'mensagem vazia'} `,
        duration: `${duration ? duration : 1200}`,
        gravity: "bottom",
        position: 'right',
        style: {
            background: `${color ? color : "#4caf50"}`,
            maxHeight: "100vh",
            overflowY: "auto",
            borderRadius: "5px",
        },
        close: true

    }).showToast();
}

function atualizarTurmaNoLocalStorage(turma) {
    const turmaLocalStorage = JSON.parse(localStorage.getItem(turma.turmaNome));

    if (turmaLocalStorage) {
        turmaLocalStorage.alunos = turma.getAllAlunos();
        turmaLocalStorage.avaliacoesTotais = turma.avaliacoesTotais;
        localStorage.setItem(turma.turmaNome, JSON.stringify(turmaLocalStorage));
    } else {
        console.warn("Turma não encontrada no localStorage.");
    }
}



function removerEventListeners() {
    btnInserirAluno.removeEventListener("click", handleInserirAluno);
    btnDeletarAluno.removeEventListener("click", handleDeletarAluno);
}
