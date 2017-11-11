import { Directive, ElementRef, HostListener, Input } from '@angular/core';

import * as $ from 'jquery';

@Directive({
  selector: '[myHighlight]'
})
export class HighLightDirective {

  @Input('myHighlight')
  public highlightColor: string = 'yellow';

  constructor(private element: ElementRef) {
  }

  @HostListener('mouseenter')
  public onMouseEnter() {
    this.highlight(this.highlightColor);
  }

  @HostListener('mouseleave')
  public onMouseLeave() {
    this.highlight('');
  }

  private highlight(color: string) {

    $(this.element.nativeElement)
      .css('background-color', color);
  }

}