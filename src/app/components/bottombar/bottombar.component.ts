import { Component } from '@angular/core';

@Component({
  selector: 'app-bottombar',
  templateUrl: './bottombar.component.html',
  styleUrls: ['./bottombar.component.css']
})
export class BottombarComponent {
  routes: any[] = [
    {name: 'Ayuda', icon: 'fa-solid fa-circle-info', class: '', routerLink: 'profile'},
    {name: 'Anticipos', icon: 'fa-solid fa-dollar-sign', class: '', routerLink: 'anticipos'},
    {name: '', icon: 'fa-solid fa-truck', class: 'center', routerLink: 'calificacion'},
    {name: 'Gastos', icon: 'fa-solid fa-money-check-dollar', class: '', routerLink: 'gastos'},
    {name: 'Perfil', icon: 'fa-solid fa-user', class: '', routerLink: 'profile'},
  ]
}
