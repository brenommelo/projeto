import {
    Directive,
    ElementRef,
    Renderer,
    AfterViewInit,
} from '@angular/core';

import { AuthenticationService } from '../services/authentication.service';
import { BaseAuthDirective } from 'commons/diretivas/base.auth.directive';


@Directive({ selector: '[menuAuthDirective]' })
export class MenuAuthDirective extends BaseAuthDirective implements AfterViewInit {
    constructor(protected el: ElementRef, protected renderer: Renderer, protected authenticationService: AuthenticationService) {
        super(el, renderer, authenticationService);
    }

    ngAfterViewInit() {
        this.disabilitaOuRemoveElemento(this.authenticationService.checkHoleMenu(this.element.nativeElement.name));
    }
}
