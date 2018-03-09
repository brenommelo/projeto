import { Router, ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';

import { BaseComponent } from './base.component';
import { IBaseListComponent } from 'commons/interface/ibase.list.component';
import { BaseHttpService } from 'commons/services/base.http.service';
import { MessageService } from 'commons/services/message.service';
import { AuthenticationService } from 'commons/services/authentication.service';
import { ConfirmDialogService } from 'commons/services/confirmDialog.Service';
import { LoadingService } from 'commons/services/loading.service';
import { ComparadorDto } from 'commons/model/comparadorDto';
import { DinamicQueryDto } from 'commons/model/dinamicQueryDto';
import { IPagination } from 'commons/interface/ipagination';



export abstract class BaseListComponent<T> extends BaseComponent<T>
  implements OnInit, IBaseListComponent {
  Entities: T[];
  itemsPerPage = 10;
  totalItems = 0;
  currentPage = 1;
  rowsPerPageOptions: number[] = [5, 10, 15, 20, 30];
  order = 'Id';
  sortOrder = 'asc';
  query: DinamicQueryDto[];

  constructor(
    protected service: BaseHttpService<T>,
    protected router: Router,
    protected baseRouteName: string,
    protected messageService: MessageService,
    protected authenticationService: AuthenticationService,
    protected confirmDialogService: ConfirmDialogService,
    protected loadService: LoadingService
  ) {
    super(
      service,
      router,
      baseRouteName,
      messageService,
      authenticationService,
      confirmDialogService
    );
  }

  async load() {
    this.currentPage = 1;
    this.carregarLista();
  }

  async carregarLista(pagination?: IPagination) {
    try {
      const paginatedList = await this.service.getPaginado(
        this.query,
        pagination
      );
      this.Entities = paginatedList.result;
      this.totalItems = paginatedList.pagination.totalItems;
    } catch (ex) {
      this.tratarErrosServidor(ex);
    }
  }

  ngOnInit() {
    this.query = [];
    this.load();
  }

  New() {
    this.router.navigate(['content/' + this.baseRouteName + '/novo']);
  }

  async Detail(id: number) {
    this.router.navigate(['content/' + this.baseRouteName + '/detail', id]);
  }

  async Edit(id: number) {
    this.router.navigate(['content/' + this.baseRouteName + '/editar', id]);
  }

  async Delete(id: number) { }

  async Paginate(event: any) {
    this.currentPage = event.page + 1;
    this.itemsPerPage = event.rows;
    this.carregarLista();
  }

  protected getSortOrder(order: any): string {
    if (order === 1) {
      return 'asc';
    } else {
      return 'desc';
    }
  }

  ordernate(event: any) {
    const novoSortOrder = this.getSortOrder(event.order);
    if (event.field !== this.order || novoSortOrder !== this.sortOrder) {
      this.sortOrder = novoSortOrder;
      this.order = event.field;
      this.carregarLista();
    }
  }

  async onChangeFilter(eventValue: any, nameColumn: any, filterMatchMode: any) {
    const itemQuery = this.query.filter(item => item.campo === nameColumn)[0];
    if (itemQuery != null || eventValue !== '') {
      const comparador = new ComparadorDto(filterMatchMode);
      if (eventValue !== '' && itemQuery == null && eventValue !== undefined) {
        this.query.push({
          campo: nameColumn,
          valor: eventValue,
          comparador: comparador
        });
      } else if (eventValue === '' && itemQuery != null) {
        this.query.splice(this.query.indexOf(itemQuery), 1);
      }else if (eventValue !== '' && itemQuery != null) {
        this.query.splice(this.query.indexOf(itemQuery), 1);
        this.query.push({
          campo: nameColumn,
          valor: eventValue,
          comparador: comparador
        });
      }
    }
  }
}
