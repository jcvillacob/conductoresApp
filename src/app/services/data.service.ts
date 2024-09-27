import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { API_CONFIG } from 'src/api.config';
import { LoginService } from './login.service';
import { Anticipo } from './../models/anticipo'
import { Gasto } from '../models/gasto';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = `${API_CONFIG.baseUrl}`;
  private token: string = API_CONFIG.token;
  private cedula!: string;

  constructor(private http: HttpClient, private loginService: LoginService) {
    this.cedula = this.loginService.getCedula();
  }

  getAnticiposGV(): Observable<Anticipo[]> {
    this.cedula = this.loginService.getCedula();
    return this.http.get<Anticipo[]>(`${this.apiUrl}/api/AnticiposGV/${this.cedula}?token=${this.token}`)
      .pipe(
        map(data => {
          let newData: Anticipo[] = [];
          data.forEach(anticipo => {
            newData.push(anticipo);
            if (anticipo.detalleAnticipos.length > 1) {
              const datoNuevo = {
                cedula: anticipo.cedula,
                manifiesto: anticipo.manifiesto,
                detalleAnticipos: [anticipo.detalleAnticipos[1]]
              };
              newData.push(datoNuevo);
            }
          });
          console.log(newData);
          return newData;
        }),
        catchError(error => {
          // Manejar el error aquí si es necesario
          return of([]);
        })
      );
  }
  


  getGastos(): Observable<Gasto[]> {
    this.cedula = this.loginService.getCedula();
    return this.http.get<Gasto[]>(`${this.apiUrl}/api/Legalizaciones/Conductor?token=${this.token}&Conductor=${this.cedula}`);
  }
}
