import { Injectable } from '@angular/core';

import { Subject, Observable } from 'rxjs';

/**
 * Serviço que controla a exibição do modal de Login/Recaptcha
 * @export
 * @class MessageService
 */
@Injectable()
export class ModalLoginService {

    private subjectDisplayModalLogin: Subject<{ exibir: boolean, url: string }>;

    constructor() {
        this.subjectDisplayModalLogin = new Subject<{ exibir: boolean, url: string }>();
    }

    /**
     * Recupera a instância do subject
     * @returns {Observable<{ exibir: boolean, url: string }>}
     * @memberof MessageService
     */
    getModalLogin(): Observable<{ exibir: boolean, url: string }> {
        return this.subjectDisplayModalLogin.asObservable();
    }

    /**
     * Exibe o Modal com o IFrame de Login/Recaptcha
     * @param {string} url Endereço que sera exibido pelo IFrame
     * @memberof MessageService
     */
    abrirModalLogin(url: string) {
        this.subjectDisplayModalLogin.next({ exibir: true, url: url });
    }

    /**
     * Esconde o Modal de Login/Recaptcha
     * @memberof MessageService
     */
    fecharModalLogin() {
        this.subjectDisplayModalLogin.next({ exibir: false, url: '' });
    }
}
