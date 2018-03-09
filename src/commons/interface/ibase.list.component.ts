export interface IBaseListComponent {
    load();
    New();
    Detail(id: number);
    Edit(id: number);
    Delete(id: number);
    Paginate(event: any);
    ordernate(event: any);
    onChangeFilter(eventValue: any, nameColumn: any, filterMatchMode: any);
}
