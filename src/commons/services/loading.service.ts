import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

/**
 * Serviço de exibição da animação de Load
 * Usa esquema de fila para que os metodos async nao fechem o load de outros que ainda estejam aguardando
 * @export
 * @class LoadingService
 */
@Injectable()
export class LoadingService {

  private subject: Subject<boolean>;
  private fila = 0;

  constructor() {
    this.subject = new Subject<boolean>()
  }

  /**
   * Exibe a animação de Load e bloqueia a tela
   * @memberof LoadingService
   */
  startLoad() {
    this.fila++;
    if (this.fila === 1) {
      this.subject.next(true);
    }
  }

  /**
   * Remove a animação de Load e desbloqueia a tela
   * @memberof LoadingService
   */
  stopLoad() {
    this.fila--;
    if (this.fila <= 0) {
      this.subject.next(false);
      this.fila = 0;
    }
  }

  /**
   * Recupera o Load atual
   * @returns {Observable<any>}
   * @memberof LoadingService
   */
  getLoad(): Observable<any> {
    return this.subject.asObservable();
  }
}
