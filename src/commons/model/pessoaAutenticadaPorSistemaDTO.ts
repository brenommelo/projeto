import { LotacaoPessoaAutenticadaPorSistemaDTO } from './lotacaoPessoaAutenticadaPorSistemaDTO';
import { MenuDTO } from './menuDTO';
import { InterfaceDTO } from './interfaceDTO';

export class PessoaAutenticadaPorSistemaDTO {
    public cpf: string;
    public matricula: string;
    public nome: string;
    public lotacao: LotacaoPessoaAutenticadaPorSistemaDTO;
    public listaMenu: MenuDTO[];
    public listaInterface:  InterfaceDTO[];
}
