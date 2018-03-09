/**
 * Interface para paginação no servidor
 */
export interface IPagination {

    /**
     * Pagina atual da paginação
     * @type {number}
     * @memberof IPagination
     */
    page: number;

    /**
     * Número máximo de registros esperados por página
     * @type {number}
     * @memberof IPagination
     */
    pageSize: number;

    /**
     * Total de itens da consulta
     * @type {number}
     * @memberof IPagination
     */
    totalItems?: number;

    /**
     * Total de páginas da consulta
     * @type {number}
     * @memberof IPagination
     */
    totalPages?: number;

    /**
     * Campo para ordenação da consulta
     * @type {string}
     * @memberof IPagination
     */
    order?: string;

    /**
     * Ordem da consulta(asc = ascendente, dsc = descendente)
     * @type {string}
     * @memberof IPagination
     */
    sortOrder?: string;
}
