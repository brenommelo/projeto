import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';

import { ItemsService } from './items.service';
import { LoadingService } from './loading.service';

import { IBaseHttpService } from 'commons/interface/ibase.http.service';
import { IPagination } from 'commons/interface/ipagination';
import { IOrdenador } from 'commons/interface/iordenador';
import { IDinamicQueryDto } from 'commons/interface/idinamicQueryDto';
import { IPaginatedResult } from 'commons/interface/ipaginatedResult';

/**
 * Classe base que encapsula métodos de servicos Http
 * @export
 * @abstract
 * @class BaseHttpService
 * @implements {IBaseHttpService<T>}
 * @template T
 */
export abstract class BaseHttpService<T> implements IBaseHttpService<T> {

    /**
     * Usado para exibir/esconder um modal em compentes relacionados
     * @type {boolean}
     * @memberof BaseHttpService
     */
    public displayModal = false;

    /**
     * URI da API principal do sistema
     * @private
     * @type {string}
     * @memberof BaseHttpService
     */
    private _apiURI: string;

    /**
     * @param {string} apiUri URI da API principal do sistema
     * @param {HttpClient} http Instância do cliente de Http do angular
     * @param {string} serviceName Nome do do endpoint da Api
     * @param {ItemsService} itemsService
     * @param {LoadingService} loadService Serviço de exibição da tela de Load
     * @param {string} bearer Token de autorização para acesso à Api
     * @memberof BaseHttpService
     */
    constructor(apiUri: string, protected http: HttpClient,
        protected serviceName: string,
        protected itemsService: ItemsService,
        protected loadService: LoadingService,
        protected bearer: string
    ) {
        this._apiURI = apiUri;
    }

    /**
     * Retorna a URI atual da API
     * @returns {string}
     * @memberof BaseHttpService
     */
    public getApiURI(): string {
        return this._apiURI;
    }

    /**
     * Retorna a URI do Host da API
     * @returns {string}
     * @memberof BaseHttpService
     */
    public getApiHost(): string {
        return this._apiURI.replace('api/', '');
    }

    /**
     * Retorna URI do serviço
     * @returns {string}
     * @memberof BaseHttpService
     */
    public getServiceURI(): string {
        return this._apiURI + this.serviceName;
    }

    /**
     * Retorna os cabeçalhos padrões do TCE (Content-Type, AuthorizationProxy, Authorization, pagination, filtro)
     * @param {IPagination} [pagination] parametro de paginação
     * @param {Array<IDinamicQueryDto>} [filtros] parametro para filtro baseado em nome da propriedade, comparado(ex: ==, >=) e valor
     * @returns {HttpHeaders}
     * @memberof BaseHttpService
     */
    protected getHeaders(pagination?: IPagination, filtros?: Array<IDinamicQueryDto>): HttpHeaders {
        let customHeader = new HttpHeaders();
        customHeader = customHeader.set('Content-Type', 'application/json');
        customHeader = customHeader.set('AuthorizationProxy', 'token ' + localStorage.getItem('tokenAuthorizationProxy'));
        customHeader = customHeader.set('Authorization', 'Bearer ' + this.bearer);
        if (pagination) {
            const headerPagination = this.montaHeaderPaginacao(pagination);
            customHeader = customHeader.set(headerPagination[0], headerPagination[1]);
        }
        if (filtros) {
            const headerFiltros = this.montaHeaderFiltro(filtros);
            customHeader = customHeader.set(headerFiltros[0], headerFiltros[1]);
        }
        return customHeader;
    }

    /**
     * Monta tupla contendo o nome do cabeçalho e o objeto em string
     * @private
     * @param {IPagination} pagination
     * @returns {[string, string]}
     * @memberof BaseHttpService
     */
    private montaHeaderPaginacao(pagination: IPagination): [string, string] {
        return [
            'pagination',
            JSON.stringify(pagination)
        ];
    }

    /**
     * Monta tupla contendo o nome do cabeçalho e o objeto em string
     * @private
     * @param {Array<IDinamicQueryDto>} filtros
     * @returns {[string, string]}
     * @memberof BaseHttpService
     */
    private montaHeaderFiltro(filtros: Array<IDinamicQueryDto>): [string, string] {
        return [
            'filtro',
            JSON.stringify(filtros)
        ];
    }

    /**
     * Monta as Options para os metodos de HTTP terem o retorno HttpResponse
     * @private
     * @param {HttpHeaders} [httpHeaders]
     * @param {HttpParams} [params]
     * @returns {*}
     * @memberof BaseHttpService
     */
    private getOptions(httpHeaders?: HttpHeaders, params?: HttpParams): any {
        let options: any = { observe: 'response' };
        if (httpHeaders && params) {
            options = { observe: 'response', headers: httpHeaders, params: params };
        }
        if (httpHeaders) {
            options = { observe: 'response', headers: httpHeaders };
        }
        if (params) {
            options = { observe: 'response', params: params };
        }
        return options;
    }

    /**
     * Monta o objeto de retorno de uma lista paginada
     * @param {HttpResponse<object>} resposta
     * @returns {IPaginatedResult<Array<T>>}
     * @memberof BaseHttpService
     */
    public montaRetornoPaginado(resposta: HttpResponse<object>): IPaginatedResult<Array<T>> {
        const peginatedResult: IPaginatedResult<Array<T>> = new IPaginatedResult<Array<T>>();
        peginatedResult.result = resposta.body as Array<T>;
        if (resposta.headers.get('Pagination') != null) {
            const paginationHeader: IPagination =
                this.itemsService.getSerialized<IPagination>(resposta.headers.get('Pagination'));
            peginatedResult.pagination = paginationHeader;
        }
        return peginatedResult;
    }

    /**
     * Metodo que encapsula uma chamada HTTP e exibe a tela de load
     * @template Z
     * @param {string} uri
     * @param {HttpHeaders} [httpHeaders]
     * @param {HttpParams} [params]
     * @returns {Promise<HttpResponse<Z>>}
     * @memberof BaseHttpService
     */
    public async genericGet<Z>(uri: string, httpHeaders?: HttpHeaders, params?: HttpParams): Promise<HttpResponse<Z>> {
        try {
            this.loadService.startLoad();
            const resp = await this.http
                .get<Z>(
                uri,
                this.getOptions(httpHeaders, params)
                )
                .toPromise()
                .then((response: HttpResponse<Z>) => {
                    return response;
                });
            return resp;
        } catch (erro) {
            throw erro;
        } finally {
            this.loadService.stopLoad();
        }
    }

    /**
     * Metodo que encapsula uma chamada HTTP e exibe a tela de load
     * @template Z
     * @param {string} uri
     * @param {*} objeto
     * @param {HttpHeaders} [httpHeaders]
     * @param {HttpParams} [params]
     * @returns {Promise<HttpResponse<Z>>}
     * @memberof BaseHttpService
     */
    public async genericPost<Z>(uri: string, objeto: any, httpHeaders?: HttpHeaders, params?: HttpParams): Promise<HttpResponse<Z>> {
        try {
            this.loadService.startLoad();
            const resp = await this.http
                .post<Z>(
                uri,
                objeto,
                this.getOptions(httpHeaders, params)
                )
                .toPromise()
                .then((response: HttpResponse<Z>) => {
                    return response;
                });
            return resp;
        } catch (erro) {
            throw erro;
        } finally {
            this.loadService.stopLoad();
        }
    }

    public async genericPut<Z>(uri: string, objeto: any, httpHeaders?: HttpHeaders, params?: HttpParams): Promise<HttpResponse<Z>> {
        try {
            this.loadService.startLoad();
            const resp = await this.http
                .put<Z>(
                uri,
                objeto,
                this.getOptions(httpHeaders, params)
                )
                .toPromise()
                .then((response: HttpResponse<Z>) => {
                    return response;
                });
            return resp;
        } catch (erro) {
            throw erro;
        } finally {
            this.loadService.stopLoad();
        }
    }

    public async genericDelete<Z>(uri: string, httpHeaders?: HttpHeaders, params?: HttpParams): Promise<HttpResponse<Z>> {
        try {
            this.loadService.startLoad();
            const resp = await this.http
                .delete<Z>(
                uri,
                this.getOptions(httpHeaders, params)
                )
                .toPromise()
                .then((response: HttpResponse<Z>) => {
                    return response;
                });
            return resp;
        } catch (erro) {
            throw erro;
        } finally {
            this.loadService.stopLoad();
        }
    }

    public async get(id: Number): Promise<T> {
        try {
            const result = await this.genericGet<T>(this.getServiceURI() + '/' + id, this.getHeaders());
            return result.body;
        } catch (erro) {
            throw erro;
        }
    }

    public async getAll(ordenador?: IOrdenador): Promise<Array<T>> {
        try {
            let url = this.getServiceURI() + '/';
            if (ordenador) {
                url = `${this.getServiceURI()}/${ordenador.campo},${ordenador.ordenador}`;
            }
            const result = await this.genericGet<Array<T>>(url, this.getHeaders());
            return result.body;
        } catch (erro) {
            throw erro;
        }
    }

    public async getPaginado(filtros?: Array<IDinamicQueryDto>, pagination?: IPagination): Promise<IPaginatedResult<Array<T>>> {
        try {
            const result = await this.genericGet<object>(this.getServiceURI() + '/', this.getHeaders(pagination, filtros));
            return this.montaRetornoPaginado(result);
        } catch (erro) {
            throw erro;
        }
    }

    public async post(t: T): Promise<void> {
        try {
            await this.genericPost(this.getServiceURI(), t, this.getHeaders());
        } catch (erro) {
            throw erro;
        }
    }

    public async put(t: T): Promise<void> {
        try {
            await this.genericPut(this.getServiceURI(), t, this.getHeaders());
        } catch (erro) {
            throw erro;
        }
    }

    public async delete(id: Number): Promise<void> {
        try {
            await this.genericDelete(this.getServiceURI() + '/' + id, this.getHeaders());
        } catch (erro) {
            throw erro;
        }
    }
}
