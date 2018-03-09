import { AcaoDTO } from './acaoDTO';
import { MenuDTO } from './menuDTO';

export class InterfaceDTO {
    public codigo: number;
    public nome: string;
    public referencia: string;
    public sigla: string;
    public listaAcao: AcaoDTO[];
}
