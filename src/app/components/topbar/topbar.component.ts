import { Component, HostListener } from '@angular/core';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css']
})
export class TopbarComponent {
  isScrolled = false;

  constructor(private viewportScroller: ViewportScroller) { }

  @HostListener('window:scroll')
  onWindowScroll() {
    const yOffset = this.viewportScroller.getScrollPosition()[1];
    this.isScrolled = yOffset > 0 ? true : false;
  }
}
