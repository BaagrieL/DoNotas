export class Aluno {
    constructor(nome) {
        this.turmaEntity = null;
        this.nome = nome;
        this.notas = [];
        this.media = 0;
        this.aprovado = false;
    }

    inserirNovaNota(nota) {
        this.notas.push(nota);
        this.calcularMedia();
    }

    modificarNota(indice, novaNota) {
        if (indice >= 0 && indice < this.notas.length) {
            this.notas[indice] = novaNota;
        } else {
            console.log("Nota inválida");
        }
    }

    calcularMedia() {
        this.media = 0;
        for (let nota of this.notas) {
            if (nota === undefined) {continue;}
            this.media += nota;
        }
        this.media /= this.turmaEntity.avaliacoesTotais;
        this.media = this.media.toFixed(1);

        this.verificarAprovacao();
    }

    verificarAprovacao() {
        if (this.media >= 7) {
            this.aprovado = true;
        } else {
            this.aprovado = false;
        }
    }

}
