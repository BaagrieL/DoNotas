import { Aluno } from "./Aluno.js";

export class Turma {
    constructor(nome) {
        this.turmaNome = nome;
        this.alunos = [];
        this.avaliacoesTotais = Number(3);
    }

    // CREATE
    insertAluno(nome) {
        let alunoExistente = this.alunos.find((aluno) => aluno.nome === nome);
        if (!alunoExistente) {
            let aluno = new Aluno(nome);
            const { turmaNome, avaliacoesTotais } = this; // Adicione outras propriedades necessárias
        
            aluno.turmaEntity = {
                turmaNome,
                avaliacoesTotais
            };
            this.alunos.push(aluno);
            console.log(`aluno ${aluno.nome} inserido na turma ${this.turmaNome}`);
            return aluno;
        }
        alert(`Aluno ${nome} já está na turma ${this.turmaNome}`);
        return null;

    }

    // DELETE
    deleteAluno(nome) {
        let index = this.alunos.findIndex((aluno) => aluno.nome == nome);
        if (index !== -1) {
            this.alunos.splice(index, 1);
            console.log(`aluno ${nome} deletado da turma ${this.turmaNome}`);
            return true;
        }
        alert(`Aluno ${nome} não encontrado na turma ${this.turmaNome}`);
        return false;
    }

    // READ
    getAllAlunos() {
        return this.alunos;
    }

    /**
     * Atualiza a lista de alunos da turma.
     * @param {Aluno[]} alunos - lista de alunos a serem adicionados.
     */
    setAllAlunos(alunos) {
        /**
         * Percorre a lista de alunos e adiciona cada um a lista de alunos
         * da turma.
         */
        alunos.map((aluno) =>{ 
            const novoAluno = new Aluno(aluno.nome);
            this.alunos.push(novoAluno);   
        });
    }

    // CLEAR
    clearAllAlunos() {
        this.alunos = [];
    }

    findAlunoByName(nome) {
        return this.alunos.find((aluno) => aluno.nome === nome);
    }

}