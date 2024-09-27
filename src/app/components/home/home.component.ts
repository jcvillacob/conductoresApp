import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  cedula!: string;

  constructor(private loginService: LoginService) {}

  ngOnInit() {
    this.cedula = this.loginService.getCedula();
    console.log(this.cedula);
  }
}
