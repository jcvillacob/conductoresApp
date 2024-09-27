import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { LoginService } from './services/login.service';
import { filter } from 'rxjs/operators';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'conductores';
  cedula!: string;

  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit() {
    initFlowbite();
    this.router.events.pipe(
      filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.cedula = this.loginService.getCedula();
    });
  }
}
