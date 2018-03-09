import { Injectable } from '@angular/core';

import { ConfirmationService } from 'primeng/primeng';

/**
 * Serviço de exibição da tela de confirmação
 * @export
 * @class ConfirmDialogService
 */
@Injectable()
export class ConfirmDialogService {
    constructor(private confirmationService: ConfirmationService) {
    }

    /**
     * Encapsula o serviço de mensagens do Prime
     * @param {string} header Cabeçalho a ser exibido
     * @param {string} mensagem Mensagem a ser exibida
     * @param {Function} accept Função que será executada ao confirmar
     * @param {Function} [reject] Função que será executada ao rejeitar
     * @example
     * this.confirmDialogService.confirmAction('Confirmação','Tem certeza que deseja fazer isto?', () => this.editarPessoa());
     * @returns {ConfirmationService}
     * @memberof ConfirmDialogService
     */
    confirmAction(header: string, mensagem: string, accept: Function, reject?: Function): ConfirmationService {
        return this.confirmationService.confirm({
            message: mensagem,
            header: header,
            icon: 'fa fa-question-circle',
            accept: accept,
            reject: reject
        });
    }
}
