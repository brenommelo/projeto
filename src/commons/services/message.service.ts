import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

import { Message } from 'primeng/primeng';

/**
 * Serviço de exibição de mensagens na tela
 * @export
 * @class MessageService
 */
@Injectable()
export class MessageService {

    private subject: Subject<Message>;

    constructor() {
        this.subject = new Subject<Message>();
    }

    /**
     * Envia uma mensagem para ser exibida na tela
     * @param {Message} msg
     * @memberof MessageService
     */
    sendMessage(msg: Message): void {
        this.subject.next(msg);
    }

    /**
     * Limpa as mensagens
     * @memberof MessageService
     */
    clearMessage() {
        this.subject.next();
    }

    /**
     * Recupera as mensagens
     * @returns {Observable<Message>}
     * @memberof MessageService
     */
    getMessage(): Observable<Message> {
        return this.subject.asObservable();
    }
}
