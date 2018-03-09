import {
    Directive,
    ElementRef,
    Renderer,
    AfterViewInit
} from '@angular/core';

import { AuthenticationService } from '../services/authentication.service';
import { BaseAuthDirective } from 'commons/diretivas/base.auth.directive';

@Directive(
    {
        selector: '[interfaceAuthDirective]'
    })
export class InterfaceAuthDirective extends BaseAuthDirective implements AfterViewInit {

    constructor(protected element: ElementRef, protected renderer: Renderer, protected authenticationService: AuthenticationService) {
        super(element, renderer, authenticationService);
    }

    ngAfterViewInit() {
        this.disabilitaOuRemoveElemento(this.authenticationService.checkHoleInterface(this.element.nativeElement.localName));
    }

}
