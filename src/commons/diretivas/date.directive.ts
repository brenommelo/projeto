import {
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
declare var $: any;
import  moment from 'moment-es6';

export const CUSTOM_INPUT_DATE_PICKER_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DateDirective),
  multi: true
};

@Directive({
  selector: '[datePiker]',
  host: { '(blur)': 'onTouched($event)'},
  providers: [CUSTOM_INPUT_DATE_PICKER_CONTROL_VALUE_ACCESSOR]
})
export class DateDirective implements ControlValueAccessor {
  private innerValue: string;

  @Input("changeMonth") changeMonth: boolean = true;
  @Input("changeYear") changeYear: boolean = true;
  @Output() updateValue = new EventEmitter();

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    $(this.el.nativeElement)
      .datepicker({
        dateFormat: "dd/mm/yy",
        dayNames: [
          "Domingo",
          "Segunda",
          "Terça",
          "Quarta",
          "Quinta",
          "Sexta",
          "Sábado"
        ],
        dayNamesMin: ["D", "S", "T", "Q", "Q", "S", "S", "D"],
        dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"],
        monthNames: [
          "Janeiro",
          "Fevereiro",
          "Março",
          "Abril",
          "Maio",
          "Junho",
          "Julho",
          "Agosto",
          "Setembro",
          "Outubro",
          "Novembro",
          "Dezembro"
        ],
        monthNamesShort: [
          "Jan",
          "Fev",
          "Mar",
          "Abr",
          "Mai",
          "Jun",
          "Jul",
          "Ago",
          "Set",
          "Out",
          "Nov",
          "Dez"
        ],
        nextText: "Próximo",
        prevText: "Anterior"
      })
      .on("change", (e: any) => {
        if (!moment(e.target.value, "DD/MM/YYYY", true).isValid()) {
          e.target.value = "";
        } else {
          this.onChange(e.target.value);
        }
        this.updateValue.emit(e.target.value);
      });
    $(this.el.nativeElement).mask("99/99/9999");
  }

  public onChange: any = (_: any) => {
    /*Empty*/
  };
  public onTouched: any = () => {
    /*Empty*/
  };

  get value(): any {
    return this.innerValue;
  }

  //set accessor including call the onchange callback
  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChange(v);
    }
  }

  writeValue(val: string): void {
    this.innerValue = val;
    try {
      $(this.el.nativeElement).datepicker('setDate', this.innerValue);
    } catch (ex) {}
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
