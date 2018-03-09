import { ActivatedRoute } from '@angular/router';
import {
    Directive,
    ElementRef,
    Renderer,
    AfterViewInit,
} from '@angular/core';

import { AuthenticationService } from '../services/authentication.service';
import { BaseAuthDirective } from 'commons/diretivas/base.auth.directive';


@Directive(
    {
        selector: '[acaoAuthDirective]'
    })
export class AcaoAuthDirective extends BaseAuthDirective implements AfterViewInit {

    constructor(protected element: ElementRef, protected renderer: Renderer, protected authenticationService: AuthenticationService,
        private activatedRoute: ActivatedRoute) {
        super(element, renderer, authenticationService);
    }

    ngAfterViewInit() {
        this.disabilitaOuRemoveElemento(this.authenticationService.checkHoleAcao(this.element.nativeElement.name,
            this.activatedRoute.snapshot.data['referencia']));
    }
}
