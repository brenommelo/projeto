import { Router, ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef, Injectable, Input, OnInit, OnDestroy } from '@angular/core';

import { BaseComponent } from './base.component';
import { Message } from 'primeng/primeng';
import { Subscription } from 'rxjs/Rx';
import { IBaseFormComponent } from 'commons/interface/ibase.form.component';
import { BaseHttpService } from 'commons/services/base.http.service';
import { MessageService } from 'commons/services/message.service';
import { AuthenticationService } from 'commons/services/authentication.service';
import { ConfirmDialogService } from 'commons/services/confirmDialog.Service';
import { I18nService } from 'commons/services/i18n.service';


export abstract class BaseFormComponent<T> extends BaseComponent<T> implements OnInit, OnDestroy, IBaseFormComponent {

  @Input('entity_id') public entityId = 0;
  inscricao: Subscription;
  @Input('entidade') public Entity: T;

  constructor(
    protected service: BaseHttpService<T>,
    protected router: Router,
    protected baseRouteName: string,
    protected route: ActivatedRoute,
    entity: T,
    protected messageService: MessageService,
    protected authenticationService: AuthenticationService,
    protected confirmDialogService: ConfirmDialogService,
    protected i18nService: I18nService,
  ) {
    super(service, router, baseRouteName, messageService, authenticationService, confirmDialogService);
    this.getParams();
    this.Entity = entity;
  }

  getParams() {
    this.inscricao = this.route.params.subscribe(
      (queryParams: any) => {
        if (queryParams['id'] != null) {
          this.entityId = queryParams['id'];
        }
      }
    );
  }
  limpar() {
    window.location.reload();
  }
  fechar() {
    this.router.navigate(['content/' + this.baseRouteName]);
  }
  getMessage() {
    return this.messageService;
  }

  async getEntity() {
    if (this.entityId > 0) {
      const objeto = await this.service.get(this.entityId);
      this.Entity = objeto ? objeto : this.Entity;
    }
  }

  async ngOnInit() {
    this.getEntity();
  }

  private async insert() {
    try {
      const resp = await this.service.post(this.Entity);
      this.messageService.sendMessage({
        severity: 'success', summary: 'Novo',
        detail: await this.i18nService.getTranslate('MENSAGEM.ME022')
      });
      this.router.navigate(['content/' + this.baseRouteName]);
    } catch (ex) {
      this.tratarErrosServidor(ex);
    }
  }

  private async edit() {
    try {
      await this.service.put(this.Entity);
      await this.messageService.sendMessage(
        { severity: 'success', summary: 'Editar', detail: await this.i18nService.getTranslate('MENSAGEM.ME020') });
      this.router.navigate(['content/' + this.baseRouteName]);
    } catch (ex) {
      this.tratarErrosServidor(ex);
    }
  }

  async save() {
    if (this.entityId > 0) {
      this.confirmDialogService.confirmAction('Confirma salvar?', await this.i18nService.getTranslate('MENSAGEM.ME021'),
      () => this.edit());
    } else {
      this.confirmDialogService.confirmAction('Confirma salvar?', await this.i18nService.getTranslate('MENSAGEM.ME021'),
      () => this.insert());
    }
  }

  podeDesativar() {
    throw new Error('Method not implemented.');
  }

  ngOnDestroy() {
    this.inscricao.unsubscribe();
  }

}
