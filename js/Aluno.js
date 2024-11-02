export class Aluno {
    constructor(nome, turmaEntity = null, notas = [], media = 0, aprovado = false) {
        this.nome = nome;
        this.turmaEntity = turmaEntity;
        this.notas = notas;
        this.media = media;
        this.aprovado = aprovado;
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
