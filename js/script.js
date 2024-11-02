import { Turma } from "./Turma.js";
import { turmaZone } from "../Pages/turmaZone.js";

let selectedTurma = document.getElementById("select-turma").value;


document.getElementById("btn-selecionar-turma").addEventListener("click", () => {
    selectedTurma = document.getElementById("select-turma").value;
    console.log("turma selecionada: ", selectedTurma);

    if (selectedTurma) {
        if (!selecionarTurma(selectedTurma)) {
            salvarTurmaNoLocalStorage(new Turma(selectedTurma));
            selecionarTurma(selectedTurma);
        }
        carregarTurmaSelecionada();
        goToPage(2);
    }
    
});

document.getElementById("btn-voltar").addEventListener("click", () => {
    
    goToPage(1);
});

export function goToPage(page) {
    switch (page) {
        case 1:
            document.getElementById("select-turma__contatiner").style.display = "flex";
            document.getElementById("turma-zone").style.display = "none";
            document.getElementById("aluno-zone").style.display = "none";
            break;
        case 2:
            document.getElementById("select-turma__contatiner").style.display = "none";
            document.getElementById("turma-zone").style.display = "flex";
            document.getElementById("aluno-zone").style.display = "none";
            turmaZone();
            break;
        case 3:
            document.getElementById("select-turma__contatiner").style.display = "none";
            document.getElementById("turma-zone").style.display = "none";
            document.getElementById("aluno-zone").style.display = "block";
            break;
    }

    setCurrentPage(page);
}

export function getPageName(page) {
    switch (page) {
        case 1:
            return "select-turma__contatiner";
        case 2:
            return "turma-zone";
        case 3:
            return "aluno-zone";
    }
}

export function setCurrentPage(page) {
    localStorage.setItem("currentPage", page);
}

export function getCurrentPage() {
    localStorage.getItem("currentPage");
}

function salvarTurmaNoLocalStorage(turma) {    
    localStorage.setItem(turma.turmaNome, JSON.stringify({
        turmaNome: turma.turmaNome,
        alunos: turma.getAllAlunos(),
        avaliacoesTotais: turma.avaliacoesTotais
    }));
}

export function selecionarTurma(turmaNome) {
    localStorage.setItem("turmaSelecionada", turmaNome);
    const turmaData = localStorage.getItem(turmaNome);
    console.log(`No selecionarTurma | ${turmaData}`);
    
    if (turmaData) {
        const parsedData = JSON.parse(turmaData);
        const turma = new Turma(parsedData.turmaNome);
        turma.setAllAlunos(parsedData.alunos);
        return turma;
    }
    return null;
}

export function carregarTurmaSelecionada() {
    const turmaSelecionada = localStorage.getItem("turmaSelecionada");
    if (turmaSelecionada) {
        return selecionarTurma(turmaSelecionada);
    }
    return null;
}



