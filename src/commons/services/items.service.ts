import { Injectable } from '@angular/core';

import { Predicate } from 'commons/interface/predicate';

import * as _ from 'lodash';

/**
 * Serviço de funções básicas para trabalhar com listas
 * @export
 * @class ItemsService
 */
@Injectable()
export class ItemsService {

    constructor() { }

    /**
     * Remove um item da lista
     * @template T Tipo da lista
     * @param {Array<T>} array Lista do qual o item sera removido
     * @param {*} item Itemn a ser removido
     * @example
     * removeItemFromArray<Pessoa>(listaPessoa, pessoa);
     * @memberof ItemsService
     */
    removeItemFromArray<T>(array: Array<T>, item: any): void {
        _.remove(array, function (current) {
            // console.log(current);
            return JSON.stringify(current) === JSON.stringify(item);
        });
    }

    /**
     * Remove um item da lista através de um predicado
     * @template T Tipo da lista
     * @param {Array<T>} array Lista do qual o item sera removido
     * @param {Predicate<T>} predicate Predicado via arrow function
     * @example
     * this.removeItemFromArray([], pessoa => pessoa.id === 1);
     * this.removeItemFromArray([], pessoa => { return pessoa.id === 1 });
     * this.removeItemFromArray([], pessoa => {
     *      if (pessoa.documento.length === 11) {
     *          return pessoa;
     *      }
     *  })
     * @memberof ItemsService
     */
    removeItems<T>(array: Array<T>, predicate: Predicate<T>) {
        _.remove(array, predicate);
        this.setItem<any>([], pessoa => pessoa.nome === 'pessoa1', {})
    }

    /**
     * Busca um item na lista, se existe atualiza senão insere
     * @template T Tipo da lista
     * @param {Array<T>} array Lista em que o elemento será inserido/atualizado
     * @param {Predicate<T>} predicate predicado via arrow function
     * @param {T} item Item a ser inserido/atualizado
     * @example
     * const pessoas:Array<Pessoa> = [
     * {nome:'pessoa1', documento:'1'}
     * {nome:'pessoa2', documento:'2'}];
     * setItem<Pessoa>(pessoas, pessoa => pessoa.nome === 'pessoa1', {nome:'pessoa1', documento:'10'} );
     * setItem<Pessoa>(pessoas, pessoa => pessoa.nome === 'pessoa3', {nome:'pessoa3', documento:'3'} );
     * @memberof ItemsService
     */
    setItem<T>(array: Array<T>, predicate: Predicate<T>, item: T) {
        const _oldItem = _.find(array, predicate);
        if (_oldItem) {
          const index = _.indexOf(array, _oldItem);
            array.splice(index, 1, item);
        } else {
            array.push(item);
        }
    }

    /**
     * Insere item na primeira posição da lista
     * @template T Tipo da lista
     * @param {Array<T>} array Lista em que o elemento será inserido
     * @param {*} item Item a ser inserido
     * @example
     * const pessoas:Array<Pessoa> = [
     * {nome:'pessoa1', documento:'1'}
     * {nome:'pessoa2', documento:'2'}];
     * addItemToStart<Pessoa>(pessoas, {nome:'pessoa0', documento:'0'})
     * @memberof ItemsService
     */
    addItemToStart<T>(array: Array<T>, item: any) {
        array.splice(0, 0, item);
    }

    /**
     * Retorna uma lista do tipo R, selecionando todos os valores do tipo R da lista do tipo T
     * @template T Tipo da lista
     * @template R Tipo da propriedade
     * @param {Array<T>} array Lista em que será realizada a consulta
     * @param {string} property Nome da propriedade
     * @example
     *  const pessoas: Array<Pessoa> = [
     *  { id: 1, nome: 'pessoa1', documento: '1' },
     *  { id: 2, nome: 'pessoa2', documento: '2' }];
     *  const ids = this.getPropertyValues<int>(pessoas, id);
     * @returns {R}
     * @memberof ItemsService
     */
    getPropertyValues<T, R>(array: Array<T>, property: string): Array<R> {
        let result = _.map(array, property);
        return <Array<R>><any>result;
    }

    /**
     * Serializa uma string em tipo específico
     * @template T Tipo do item
     * @param {*} obj
     * @example
     * this.getSerialized<IPagination>(resposta.headers.get('Pagination'));
     * @returns {T}
     * @memberof ItemsService
     */
    getSerialized<T>(obj: any): T {
        return <T>JSON.parse(obj);
    }
}
