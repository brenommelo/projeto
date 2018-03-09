import { Router } from '@angular/router';



import { Message } from 'primeng/primeng';
import { IBaseComponent } from 'commons/interface/ibase.component';
import { AuthenticationService } from 'commons/services/authentication.service';
import { BaseHttpService } from 'commons/services/base.http.service';
import { MessageService } from 'commons/services/message.service';
import { ConfirmDialogService } from 'commons/services/confirmDialog.Service';
import { ModelState } from 'commons/model/modelState';


export abstract class BaseComponent<T> implements IBaseComponent<T> {

    constructor(protected service: BaseHttpService<T>, protected router: Router, protected baseRouteName: string,
        protected messageService: MessageService, protected authenticationService: AuthenticationService,
        protected confirmDialogService: ConfirmDialogService) {

    }

    fechar() {
        this.router.navigate(['content/' + this.baseRouteName]);
    }

    protected tratarErrosServidor(error) {
        if (error.headers.get('application-error') != null) {
            this.router.navigate(['errorServer']);
        } else if (error.status === 401) {
            this.messageService.sendMessage(
                { severity: 'error', summary: 'Acesso não Autorizado', detail: 'O servidor rejeitou à solicitação.' });
        } else if (error.status === 400) {
            const arr = error.json() as ModelState;
            let messages: Message = {} ;
            arr.errors.forEach(element => {
              messages = { severity: 'error', summary: element.propertyName, detail: element.errorMessage };
            });
            this.messageService.sendMessage(messages);
        } else {
            throw error;
        }
    }

}
