import { Aluno } from "../js/Aluno.js";

const alunoPage = document.getElementById("aluno-zone");
const turma = localStorage.getItem("turma");

function inserirNota() {
    const nome = document.getElementById("nome-aluno").value;
    const nota = parseFloat(document.getElementById("nota-aluno").value);
    const aluno = turma.findAlunoByName(nome);
    if (aluno) {
        aluno.inserirNovaNota(nota);
        alert(`Nota ${nota} inserida para o aluno ${nome}`);
    } else {
        alert("Aluno não encontrado");
    }
}

function modificarNota() {
    const nome = document.getElementById("nome-aluno").value;
    const indice = parseInt(document.getElementById("indice-nota").value);
    const novaNota = parseFloat(document.getElementById("nova-nota").value);
    const aluno = turma.findAlunoByName(nome);
    if (aluno) {
        aluno.modificarNota(indice, novaNota);
        alert(`Nota modificada para ${novaNota}`);
    } else {
        alert("Aluno não encontrado");
    }
}

function exibirNotas() {
    const nome = document.getElementById("nome-aluno").value;
    const aluno = turma.findAlunoByName(nome);
    if (aluno) {
        aluno.exibirNotas();
    } else {
        alert("Aluno não encontrado");
    }
}

