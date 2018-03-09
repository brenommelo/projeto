import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

import { tokenNotExpired, JwtHelper, AuthHttp } from 'angular2-jwt';
import { PayLoad } from 'commons/model/payLoad';


@Injectable()
export class AuthenticationService {
    private _payLoad: PayLoad = new PayLoad();

    constructor(private http: Http, private jwtHelper: JwtHelper) {
        this.payLoad();
    }

    public payLoad(): PayLoad {
        let storageToken = localStorage.getItem('token');
        if (storageToken && storageToken !== '{}') {
            if (tokenNotExpired()) {
                let decodedToken = this.jwtHelper.decodeToken(storageToken);
                this._payLoad = this.getSerialized<PayLoad>(decodedToken);
                this._payLoad.token = storageToken;
            }
        }
        return this._payLoad;
    }

    getSerialized<T>(arg: any): T {
        return <T>JSON.parse(JSON.stringify(arg));
    }

    async login(username: string, password: string, sistema: string, uri: string): Promise<boolean> {
        let url = uri + `?usuario=${username}&senha=${password}&sistema=${sistema}`;
        let token = await this.http
            .get(url)
            .toPromise()
            .then((response) => {
                return response.headers.get('access-control-token');
            });
        if (token) {
            localStorage.setItem('token', token);
            this.payLoad();
            return true;
        }
        return false;
    }

    isAuthenticate(): boolean {
        try {
            return tokenNotExpired();
        } catch (ex) {
            return false;
        }
    }

    logout(): void {
        this._payLoad = null;
        localStorage.removeItem('token');
    }

    checkHoleAcao(siglaAcao: string, referencia: string): boolean {
        try {
            let interfaceDTO = this._payLoad.pessoaAutenticadaPorSistemaDTO.listaInterface.find(x => x.referencia === referencia);
            if (interfaceDTO) {
                let acao = interfaceDTO.listaAcao.find(x => x.chave === siglaAcao);
                if (acao) {
                    return true;
                }
            }
        } catch (ex) {
        }
        return false;
    }

    checkHoleGuard(referencia: string): boolean {
        try {
            let interfaceDTO = this._payLoad.pessoaAutenticadaPorSistemaDTO.listaInterface.find(x => x.referencia === referencia);
            if (interfaceDTO) {
                return true;
            }
        } catch (ex) {
        }
        return false;
    }

    checkHoleMenu(siglaMenu: string): boolean {
        try {
            let menu = this._payLoad.pessoaAutenticadaPorSistemaDTO.listaMenu.find(x => x.sigla === siglaMenu);
            if (menu) {
                return true;
            }
        } catch (ex) {
        }
        return false;
    }

    checkHoleInterface(siglaInterface: string) {
        try {
            let menu = this._payLoad.pessoaAutenticadaPorSistemaDTO.listaInterface.find(x => x.sigla === siglaInterface);
            if (menu) {
                return true;
            }
        } catch (ex) {
        }
        return false;
    }
}
