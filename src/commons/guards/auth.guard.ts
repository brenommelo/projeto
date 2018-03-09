import { CanActivateChild, Route, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

    constructor(private router: Router, private authenticationService: AuthenticationService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        return this.verificarAcesso(route);
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.verificarAcesso(childRoute);
    }

    private verificarAcesso(activatedRouteSnapshot: ActivatedRouteSnapshot): boolean {
        if (this.authenticationService.isAuthenticate()) {
            if (!this.authenticationService.checkHoleGuard(activatedRouteSnapshot.data['referencia'])) {
                this.router.navigate(['/public/nao-autorizado']);
                return false;
            }
            return true;
        }
        this.router.navigate(['/public/login']);
        return false;
    }
}
