import { Component, OnInit } from '@angular/core';
import {
  Router,
  ActivatedRoute,
  NavigationEnd,
  Params,
  PRIMARY_OUTLET
} from '@angular/router';
import 'rxjs/add/operator/filter';
import { IBreadcrumb } from 'commons/interface/iBreadcrumb';


@Component({
  selector: 'nga-caminho-de-pao',
  template: `<ul class="page-breadcrumb">
    <li>
        <a [routerLink]="[home]">Inicio</a>
        <i class="fa fa-circle"></i>
    </li>
    <li *ngFor="let breadcrumb of breadcrumbs">
        <a [routerLink]="[breadcrumb.url, breadcrumb.params]">{{ breadcrumb.label }}</a>
        <i class="fa fa-circle"></i>
    </li>
</ul>`
})
export class CaminhoDePaoComponent implements OnInit {
  home = 'inicio';
  public breadcrumbs: IBreadcrumb[];

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    this.breadcrumbs = [];
  }

  ngOnInit() {
    const ROUTE_DATA_BREADCRUMB = 'breadcrumb';

    // subscribe to the NavigationEnd event
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe(event => {
        // set breadcrumbs
        const root: ActivatedRoute = this.activatedRoute.root;
        this.breadcrumbs = this.getBreadcrumbs(root);
      });
  }
  private getBreadcrumbs(
    route: ActivatedRoute,
    url = '',
    breadcrumbs: IBreadcrumb[] = []
  ): IBreadcrumb[] {
    const ROUTE_DATA_BREADCRUMB = 'breadcrumb';

    // get the child routes
    const children: ActivatedRoute[] = route.children;

    // return if there are no more children
    if (children.length === 0) {
      return breadcrumbs;
    }

    // iterate over each children
    for (const child of children) {
      // verify primary route
      if (child.outlet !== PRIMARY_OUTLET) {
        continue;
      }

      // verify the custom data property "breadcrumb" is specified on the route
      if (!child.snapshot.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB)) {
        return this.getBreadcrumbs(child, url, breadcrumbs);
      }

      // get the route's URL segment
      const routeURL: string = child.snapshot.url
        .map(segment => segment.path)
        .join('/');

      // append route URL to URL
      url += `${routeURL}/`;

      // add breadcrumb
      const breadcrumb: IBreadcrumb = {
        label: child.snapshot.data[ROUTE_DATA_BREADCRUMB],
        params: child.snapshot.params,
        url: url
      };

      let adicionar = true;

      for (let i = 0; i < breadcrumbs.length; i++) {
        breadcrumb.url = breadcrumb.url.replace('//', '/');
        if (breadcrumbs[i].url === breadcrumb.url) {
          adicionar = false;
        }
      }
      if (adicionar) {
        breadcrumbs.push(breadcrumb);
      }

      // recursive
      return this.getBreadcrumbs(child, url, breadcrumbs);
    }
  }
}
