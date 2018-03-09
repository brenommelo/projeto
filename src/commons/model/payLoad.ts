import { PessoaAutenticadaPorSistemaDTO } from './pessoaAutenticadaPorSistemaDTO';

export class PayLoad {
    public exp: number;
    public pessoaAutenticadaPorSistemaDTO: PessoaAutenticadaPorSistemaDTO;
    public token: string;
}
