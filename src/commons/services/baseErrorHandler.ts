import { ErrorHandler, Injectable, Inject, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { MessageService } from './message.service';
import { ModalLoginService } from './modal.login.service';

/**
 * Serviço de Interceptação e tratamento de erros
 * @export
 * @class BaseErrorHandler
 * @implements {ErrorHandler}
 */
@Injectable()
export class BaseErrorHandler implements ErrorHandler {

    // public get router(): Router {
    //     return this.injector.get(Router);
    //  }

    /**
     * Creates an instance of BaseErrorHandler.
     * @param {Injector} injector Paramentro para injetar serviços sem criar referencia ciclica
     * @param {MessageService} messageService Seriço de exibição de mensagens
     * @param {ModalLoginService} modalLoginService Servico de exibição do Modal de Login/Recaptcha
     * @param {*} environment Classe de configuração do sistema
     * @memberof BaseErrorHandler
     */
    constructor(
        protected injector: Injector,
        protected messageService: MessageService,
        protected modalLoginService: ModalLoginService,
        @Inject('environment') protected environment: any) {
    }

    /**
     * Manipulador de Erro
     * @param {any} error
     * @memberof BaseErrorHandler
     */
    handleError(error): void {
        this.tratarErroPorTipo(error);
    }

    /**
     * Verifica o tipo de erro(http ou erro de lógica no próprio angular) e executa a função de tratamento de erro específica
     * @protected
     * @param {(HttpErrorResponse | any)} error
     * @memberof BaseErrorHandler
     */
    protected tratarErroPorTipo(error: HttpErrorResponse | any) {
        // if (error.rejection instanceof HttpErrorResponse) {
        if (error.rejection) {
            if (error.rejection.status) {
                this.tratarErroApi(error.rejection);
            } else {
                this.tratarErroAngular(error);
            }
        } else {
            this.tratarErroAngular(error);
        }
    }

    /**
     * Trata os erros enviados pela API
     * @protected
     * @param {HttpErrorResponse} error
     * @example
     * 401 - Exibe o modal de Login/Recaptcha
     * 429 - Exibe o modal de Login/Recaptcha
     * @memberof BaseErrorHandler
     */
    protected tratarErroApi(error: HttpErrorResponse): void {
        switch (error.status) {
            case 401: {
                this.exibeLoginRecaptcha();
                break;
            }
            case 429: {
                this.exibeLoginRecaptcha();
                break;
            }
        }
        this.messageService.sendMessage({ summary: error.status.toString(), detail: error.statusText });
    }

    /**
     * Exibe o modal de Login/Recaptcha
     * @protected
     * @memberof BaseErrorHandler
     */
    public exibeLoginRecaptcha(): void {
        if (this.verificarVariaveisDeTratamentoErroApi()) {
            const url = this.isRotaPublica() ?
                this.environment.recaptchaPublicUrl :
                this.environment.recaptchaPrivateUrl
                + this.environment.sistema
                + '/'
                + btoa(this.environment.redirectUrl);
            this.modalLoginService.abrirModalLogin(url);
        }
    }

    /**
     * Verifica se todas as variáveis de ambiente de tratamento de erro estão configuradas
     * @protected
     * @returns {boolean}
     * @memberof BaseErrorHandler
     */
    protected verificarVariaveisDeTratamentoErroApi(): boolean {
        let naoOcorreuErro = true;
        if (!this.environment.sistema) {
            this.tratarErroAngular(Error('O enviroment não contem a variável sistema.'));
            naoOcorreuErro = false;
        }
        if (!this.environment.recaptchaPublicUrl) {
            this.tratarErroAngular(Error('O enviroment não contem a variável recaptchaPublicUrl.'));
            naoOcorreuErro = false;
        }
        if (!this.environment.recaptchaPrivateUrl) {
            this.tratarErroAngular(Error('O enviroment não contem a variável recaptchaPrivateUrl.'));
            naoOcorreuErro = false;
        }
        if (!this.environment.redirectUrl) {
            this.tratarErroAngular(Error('O enviroment não contem a variável redirectUrl.'));
            naoOcorreuErro = false;
        }
        return naoOcorreuErro;
    }

    /**
     * Verifica se a rota onde ocorreu o erro é uma rota pública ou privada
     * @protected
     * @returns {boolean}
     * @memberof BaseErrorHandler
     */
    protected isRotaPublica(): boolean {
        const router = this.injector.get(Router);
        return router.url.split('/').find(x => x === 'private') === undefined;
    }

    /**
     * Trata os erros de lógica
     * @protected
     * @param {*} error
     * @memberof BaseErrorHandler
     */
    protected tratarErroAngular(error: any) {
        console.log(error);
        this.messageService.sendMessage({ summary: 'Erro do Sistema', detail: 'Ocorreu um erro interno no sistema' });
    }
}
