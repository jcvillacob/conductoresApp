import { Component, OnInit } from '@angular/core';
import { Anticipo } from 'src/app/models/anticipo';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-anticipos',
  templateUrl: './anticipos.component.html',
  styleUrls: ['./anticipos.component.css']
})
export class AnticiposComponent implements OnInit {
  anticipos: Anticipo[] = [];
  anticipos_filtro: Anticipo[] = [];
  filtro: string = '';
  loader: boolean = true;
  noEncontrado: boolean = false;
  c = 0;

  constructor (private dataService: DataService) {}

  ngOnInit(): void {
      this.dataService.getAnticiposGV().subscribe(data => {
        this.anticipos = data;
        this.anticipos_filtro = data;
        setTimeout (() => {
          this.loader = false;
        }, 1000)
      }, error => {
        if(this.anticipos.length == 0) {
          this.noEncontrado = true;
          setTimeout (() => {
            this.loader = false;
          }, 1000)
        }
      })
  }

  cambioFiltro(filtro: string) {
    if (filtro === "Legalizado") {
      this.anticipos_filtro = this.anticipos.filter(anticipo => anticipo.detalleAnticipos[0].saldo == 0);
    } else if (filtro === "Pendiente") {
      this.anticipos_filtro = this.anticipos.filter(anticipo => anticipo.detalleAnticipos[0].saldo != 0 );
    } else {
      this.anticipos_filtro = this.anticipos;
    }
  }
}
