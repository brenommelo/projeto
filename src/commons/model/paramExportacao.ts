import { ColunasPlaninha } from './colunasPlanilha';

export class ParamExportacao {

    public servico: string;
    public dadosFiltro: string;
    public colunas: ColunasPlaninha[];
    public tipoArquivo: string;
    public nomeArquivo: string;

    constructor(tipoArquivo: string, servico: string, dadosFiltro: string, nomeArquivo) {
        this.tipoArquivo = tipoArquivo;
        this.servico = servico;
        this.dadosFiltro = dadosFiltro;
        this.colunas = [];
        this.nomeArquivo = nomeArquivo;
    }
}
