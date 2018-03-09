import {
  Directive,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export const TEST_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CurrencyMaskDirective),
  multi: true
};

@Directive({
  selector: '[CurrencyMask]',
  providers: [TEST_VALUE_ACCESSOR]
})
export class CurrencyMaskDirective implements ControlValueAccessor, OnInit {
  onTouched: any;
  onChange: any;

  separadorDecimal: string;

  separadorMilhar: string;
  prefixo: string;

  @Input('CurrencyMask') CurrencyMask: any;
  @Output() updateValue = new EventEmitter();

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.separadorDecimal = this.CurrencyMask.decimal || ",";
    this.separadorMilhar = this.CurrencyMask.milhar || ".";
    this.prefixo = this.CurrencyMask.prefixo || "";
  }

  writeValue(value: any): void {
    if (value) {
      if (!isNaN(value)) {
        // value = value.toFixed(2);
      }
      this.el.nativeElement.value = this.aplicarMascara(String(value));
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  @HostListener("keyup", ["$event"])
  onKeyup($event: any) {
    let valor: string = this.aplicarMascara($event.target.value);

    if (valor && valor.length > 20) {
      valor = valor.substr(0, 20);
    }
    if (valor === "") {
      this.onChange("");
      $event.target.value = "";
      return;
    }

    // if (this.separadorDecimal === ',') {
    //   this.onChange(valor.replace(/\./g, '').replace('R$', ''));
    // } else {
    //   this.onChange(valor.replace(/\,/g, ''));
    // }

    $event.target.value = valor;
  }

  @Output("custonBlur") custonBlur = new EventEmitter();
  @HostListener("blur", ["$event"])
  onBlur($event: any) {
    var pattern = "0" + this.separadorDecimal + "00";
    // if ($event.target.value.indexOf(pattern) === -1 || $event.target.value.indexOf("R$") === 0) {
    let valor = $event.target.value;
    // REGEX = '/\./g' REMOVE TODOS OS '.' PRESENTES NA STRING
    valor = valor
      .replace("R$", "")
      .replace(/\./g, "")
      .replace(" ", "")
      .replace(",", ".");
    if (valor && valor.length > 15) {
      valor = valor.substring(0, 10);
    }
    this.custonBlur.emit(valor);
    return;
    // }
    // this.onChange('');
    // $event.target.value = 0;
  }

  /**
   * Aplica a máscara a determinado valor.
   *
   * @param string valorConverter
   * @return string
   */
  aplicarMascara(valorConverter: string): string {
    let valorNum = parseInt(valorConverter.replace(/\D/g, ""), 10);
    let valorMask = "";
    let valor: string;

    if (isNaN(valorNum)) {
      return "";
    }

    valor = valorNum.toString();
    switch (valor.length) {
      case 1:
        valorMask = "0" + this.separadorDecimal + "0" + valor;
        break;
      case 2:
        valorMask = "0" + this.separadorDecimal + valor;
        break;
      case 3:
        valorMask =
          valor.substr(0, 1) + this.separadorDecimal + valor.substr(1, 2);
        break;
      default:
        break;
    }

    if (valorMask === "") {
      let sepMilhar = 0;
      for (let i = valor.length - 3; i >= 0; i--) {
        if (sepMilhar === 3) {
          valorMask = this.separadorMilhar + valorMask;
          sepMilhar = 0;
        }
        valorMask = valor.charAt(i) + valorMask;
        sepMilhar++;
      }
      valorMask =
        valorMask + this.separadorDecimal + valor.substr(valor.length - 2, 2);
    }

    if (this.prefixo !== "") {
      valorMask = this.prefixo + " " + valorMask;
    }

    return valorMask;
  }
}
