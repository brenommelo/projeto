import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Directive({
  selector: "[porcentagem]",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PorcentagemDirective,
      multi: true
    }
  ]
})
export class PorcentagemDirective implements ControlValueAccessor {
  onTouched: any;
  onChange: any;

  @Input('porcentagem') porcentagem: string;
  @Input('tamanho') tamanho = '4';

  constructor(private el: ElementRef) {}

  writeValue(value: any): void {
     this.el.nativeElement.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  @HostListener("keyup", ["$event"])
  onKeyup($event: any) {}

  @Output('custonBlur') custonBlur = new EventEmitter();
  @HostListener("blur", ["$event"])
  onBlur($event: any) {
    if ($event.target.value) {
      $event.target.value = parseFloat($event.target.value).toFixed(2);
      $event.target.value = $event.target.value.replace(",", ".");
      let tam: number = parseInt(this.tamanho);
      if (
        $event.target.value.match("-") &&
        $event.target.value.match("-").length > 0
      ) {
        tam++;
      }
      if ($event.target.value.length > tam) {
        // let diferenca = $event.target.value.length - tam;
        // $event.target.value = $event.target.value.substring(diferenca-1, $event.target.value.length);
        $event.target.value = "";
      }
      this.custonBlur.emit($event.target.value);
    }
  }
}
