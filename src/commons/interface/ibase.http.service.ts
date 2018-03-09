import { HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { IPaginatedResult } from './ipaginatedResult';
import { IDinamicQueryDto } from 'commons/interface/idinamicQueryDto';
import { IPagination } from 'commons/interface/ipagination';
import { IOrdenador } from 'commons/interface/iordenador';

export interface IBaseHttpService<T> {
    displayModal: boolean;
    getApiURI(): string;
    getApiHost(): string;
    getServiceURI(): string;
    montaRetornoPaginado(res: HttpResponse<object>): IPaginatedResult<T[]>;
    genericGet<Z>(uri: string, httpHeaders?: HttpHeaders, params?: HttpParams): Promise<HttpResponse<Z>>;
    genericPost<Z>(uri: string, objeto: any, httpHeaders?: HttpHeaders, params?: HttpParams): Promise<HttpResponse<Z>>;
    genericPut<Z>(uri: string, objeto: any, httpHeaders?: HttpHeaders, params?: HttpParams): Promise<HttpResponse<Z>>;
    genericDelete<Z>(uri: string, httpHeaders?: HttpHeaders, params?: HttpParams): Promise<HttpResponse<Z>>;
    get(id: Number): Promise<T>;
    getAll(ordenador?: IOrdenador): Promise<Array<T>>;
    getPaginado(filtros: Array<IDinamicQueryDto>, pagination?: IPagination): Promise<IPaginatedResult<Array<T>>>;
    post(t: T): Promise<void>;
    put(t: T): Promise<void>;
    delete(id: Number): Promise<void>;
}
