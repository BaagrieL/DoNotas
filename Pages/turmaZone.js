import { Aluno } from "../js/Aluno.js"
import * as PaginaInicial from "../js/script.js";

let turma = null;

const btnInserirAluno = document.getElementById("btn-inserir-aluno");
const nomeAlunoInput = document.getElementById("nome-aluno__turma");

export function turmaZone() {
    turma = PaginaInicial.carregarTurmaSelecionada()
    // Remove event listeners duplicados
    // Necessario porque dá erro de replicar a ação para todas as turmas 
    removerEventListeners();

    btnInserirAluno.addEventListener("click", handleInserirAluno);
    nomeAlunoInput.addEventListener("keyup", keyUpHandler);

    // Necessário porque no LocalStorage tá escrito guia ao invés de Guia de Turismo kkkk
    document.getElementById("turma-header").innerHTML = turma.turmaNome === "guia" ? "<h1>Guia de Turismo</h1>" : `<h1>${turma.turmaNome.charAt(0).toUpperCase() + turma.turmaNome.slice(1)}</h1>`;

    handleListarAlunos();

    // Evento de clique no botão de editar
    document.querySelectorAll("td:nth-child(n+4)").forEach(td => {
        td.addEventListener("dblclick", (event) => {
            const alunoNome = td.parentNode.cells[0].textContent;
            const aluno = turma.getAllAlunos().find(aluno => aluno.nome === alunoNome);
            if (aluno) {
                handleEditarAluno(aluno);
            }
            event.target.innerText = "";
            event.target.focus();
        });
    });
}

function keyUpHandler(event) {
    if (event.key === "Enter") {
        handleInserirAluno();
    }
}

function handleInserirAluno() {
    if (turma) {
        const nomeAlunoInput = document.getElementById("nome-aluno__turma");
        if (nomeAlunoInput.value.trim().length > 2) {
            const alunoInserido = turma.insertAluno(nomeAlunoInput.value.trim());
            if (!alunoInserido) {
                return;
            }

            const tabelaCorpo = document.getElementById("tbody");
            const ultimoAluno = turma.alunos[turma.alunos.length - 1];
            renderizarAluno(ultimoAluno, tabelaCorpo);

            atualizarTurmaNoLocalStorage(turma);

            nomeAlunoInput.value = "";
            showMyToast("Aluno inserido com sucesso!");
        } else {
            alert("Nome do aluno deve ter no mínimo 3 caracteres");
        }
    }
}

function handleDeletarAluno(aluno) {
    if (turma) {
        const tabelaCorpo = document.getElementById("tbody");
        if (turma.deleteAluno(aluno.nome)) {
            atualizarTurmaNoLocalStorage(turma);
            renderizarDeleteAluno(aluno.nome, tabelaCorpo);
            showMyToast("Aluno deletado com sucesso!");
        } else {
            alert(`Algo deu errado ao deletar ${aluno.nome} da turma de ${turma.turmaNome}`);
        }
    }
}

function handleEditarAluno(aluno) {
    if (!turma) {
        return;
    }
    if (!aluno) {
        return;
    }
    const tabelaCorpo = document.getElementById("tbody");
    if (turma.updateAluno(aluno)) {
        renderizarEditAluno(aluno, tabelaCorpo);
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
            if (key === "notas" || key === "turmaEntity") {
                continue;
            }

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

        // Coluna adicional para o botão de delete
        tabelaCabecalho.appendChild(document.createElement("th"));

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

            // Cria a celula do botão de delete
            const trashIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 448 512">
                                <path fill="#c5c5c5" d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/>
                               </svg>
                              `;

            const deleteCell = document.createElement("td");
            deleteCell.innerHTML = trashIcon;
            deleteCell.addEventListener("click", () => handleDeletarAluno(aluno));
            row.appendChild(deleteCell);

            tabelaCorpo.appendChild(row);
        });
    }

}

function renderizarTabelaCompleta() {
    const tabelaCorpo = document.getElementById("tbody");
    tabelaCorpo.innerHTML = "";

    turma.alunos.forEach(aluno => renderizarAluno(aluno, tabelaCorpo));
}

function renderizarEditAluno(aluno, tabelaCorpo) {
    const row = Array.from(tabelaCorpo.rows).find(row =>
        Array.from(row.cells).some(cell => cell.textContent.includes(aluno.nome))
    );

    if (row) {
        console.log('------------------ Editando aluno ------------------');
        const cells = Array.from(row.cells);

        cells[0].textContent = aluno.nome;
        cells[1].textContent = aluno.media;
        cells[2].textContent = aluno.aprovado ? "sim" : "não";

        // Renderizar e permitir edição nas células de notas.
        for (let i = 0; i < turma.avaliacoesTotais; i++) {
            const notaCell = cells[i + 3];
            notaCell.textContent = aluno.notas[i] !== undefined ? aluno.notas[i] : "--";
            notaCell.contentEditable = true;

            notaCell.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    cells.forEach(cell => {
                        cell.contentEditable = false;
                    })
                    const novaNota = parseFloat(notaCell.textContent.replace(/\s+/g, '').trim());
                    if (!isNaN(novaNota)) {
                        aluno.notas[i] = novaNota;
                        aluno.calcularMedia();
                        cells[1].textContent = aluno.media;  
                        cells[2].textContent = aluno.aprovado ? "sim" : "não";
                        atualizarTurmaNoLocalStorage(turma);
                        notaCell.blur();
                    } else {
                        notaCell.textContent = !isNaN(aluno.notas[i]) ? aluno.notas[i] : "--";
                    }
                    
                    
                }
            });


            // Adiciona o evento `blur` para salvar a nota ao perder o foco.
            notaCell.addEventListener('blur', () => {
                const novaNota = parseFloat(notaCell.textContent);
                cells.forEach(cell => {
                    cell.contentEditable = false;
                })
                if (!isNaN(novaNota)) {
                    aluno.notas[i] = novaNota; 
                    atualizarTurmaNoLocalStorage(turma);
                } else {
                    // Caso o valor não seja numérico, exibe a nota antiga ou "--".
                    // Isso é necessário pois, caso eu insira uma Palavra ele não deixa o campo preencher e volta ao valor anterior.
                    // Caso eu escreva uma palavra com números no final, ele também não permite, mas caso eu insira um número com palavra no final ele permite.
                    // Mas, caso eu insira um número com palavra no final, ele salva apenas a parte numérica no local storage e não a palavra.
                    const valor = notaCell.textContent.replace(/\s+/g, '').trim();
                    if (isNaN(parseFloat(valor))) {
                        notaCell.textContent = !isNaN(aluno.notas[i]) ? aluno.notas[i] : "--";
                    } else {
                        notaCell.textContent = parseFloat(valor).toString();
                    }
                }
            });
        }

        console.log('Células atualizadas:', cells);
    }
}

function renderizarDeleteAluno(alunoNome, tabelaCorpo) {
    const linhaARemover = Array.from(tabelaCorpo.rows).find(row =>
        Array.from(row.cells).some(cell => cell.textContent.includes(alunoNome))
    );
    
    if (linhaARemover) {
        tabelaCorpo.removeChild(linhaARemover);
    } else {
        console.log('Erro ao remover.');
    }
    
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
    for (let i = 0; i < turma.avaliacoesTotais; i++) {
        const tdNota = document.createElement("td");
        tdNota.textContent = aluno.notas[i] !== undefined ? aluno.notas[i] : "--";
        row.appendChild(tdNota);
        tdNota.addEventListener("dblclick", (event) => {
            handleEditarAluno(aluno)
            if (aluno) {
                handleEditarAluno(aluno);
            }
            event.target.innerText = "";
            event.target.focus();
        });
    }


    // Cria o botão de delete em cada linha da tabela
    const trashIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 448 512">
                        <path fill="#c5c5c5" d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/>
                       </svg>
                       `;

    const deleteCell = document.createElement("td");
    deleteCell.innerHTML = trashIcon;
    deleteCell.addEventListener("click", () => handleDeletarAluno(aluno));
    row.appendChild(deleteCell);

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

function insertAvaliação(turma) {
    turma.avaliacoesTotais += 1;
    atualizarTurmaNoLocalStorage(turma);
}


function showMyToast(message, duration, color) {
    const toast = new Toastify({
        text: `${message ? message : 'mensagem vazia'} `,
        duration: `${duration ? duration : 1200} `,
        gravity: "bottom",
        position: 'right',
        style: {
            background: `${color ? color : "#4caf50"} `,
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
}
