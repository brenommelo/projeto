import { IComparadorDto } from './icomparadorDto';

export class IDinamicQueryDto {
    campo: string;
    comparador: IComparadorDto;
    valor: string;
}
