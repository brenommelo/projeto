import {
    AfterViewInit,
    Directive,
    ElementRef,
    Input,
    Renderer
} from '@angular/core';

import { AuthenticationService } from '../services/authentication.service';

export abstract class BaseAuthDirective implements AfterViewInit {

    @Input() remove = true;

    constructor(protected element: ElementRef, protected renderer: Renderer, protected authenticationService: AuthenticationService) {
    }

    abstract ngAfterViewInit();

    protected disabilitaOuRemoveElemento(permitido: boolean): void {
        if (!permitido) {
            if (this.remove) {
                const el: HTMLElement = this.element.nativeElement;
                el.parentNode.removeChild(el);
            }else {
                this.renderer.setElementAttribute(this.element.nativeElement, 'disabled', 'true');
            }
        }
    }
}
