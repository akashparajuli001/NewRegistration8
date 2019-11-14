import { Directive, Input, EventEmitter, Inject, ElementRef, Renderer } from '@angular/core';

@Directive({
  selector: '[focus]'
})
export class FocusDirective {
  // tslint:disable-next-line:no-input-rename
  @Input('focus') focusEvent: EventEmitter<boolean>;
  constructor(@Inject(ElementRef) private element: ElementRef, private renderer: Renderer) {
  }
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.focusEvent.subscribe(event => {
      this.renderer.invokeElementMethod(this.element.nativeElement, 'focus', []);
    });
  }
}
