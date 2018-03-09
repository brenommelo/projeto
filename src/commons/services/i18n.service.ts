import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

/**
 * Serviço de tradução
 * @export
 * @class I18nService
 */
@Injectable()
export class I18nService {

  /**
   * Construtor.
   * @param {TranslateService} translate @ngx-translate
   * @memberof I18nService
   */
  constructor(private translate: TranslateService) { }

  /**
   * Recupera a tradução através da chave
   * @param {string} chave
   * @returns {Promise<any>}
   * @memberof I18nService
   */
  public getTranslate(chave: string): Promise<any> {
    return this.translate.get(chave).map((res) => {
      return res;
    }).toPromise();
  }

  public getLanguage(): string {
    return 'pt-BR';
  }

}
