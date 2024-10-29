import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { API_CONFIG } from 'src/api.config';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class CalificacionService {
  private apiUrl = `${environment.calificacionUrl}`;
  private cedula!: string;

  constructor(private http: HttpClient, private loginService: LoginService) {
    this.cedula = this.loginService.getCedula();
  }

  getListaNovedades(): Observable<any[]> {
    this.cedula = this.loginService.getCedula();
    return this.http.get<any[]>(`${this.apiUrl}/novedades/lista`);
  }

  getNovedades(mes: number, año: number): Observable<any[]> {
    this.cedula = this.loginService.getCedula();
    return this.http.get<any[]>(`${this.apiUrl}/novedades?cedula=${this.cedula}&mes=${mes}&año=${año}&pageNumber=1&pageSize=10`);
  }

  setNovedades(data: any): Observable<any> {
    return this.http.post<any[]>(`${this.apiUrl}/novedades`, data);
  }

  getCruces(): Observable<any[]> {
    this.cedula = this.loginService.getCedula();
    return this.http.get<any[]>(`${this.apiUrl}/cruces?cedula=${this.cedula}&pageNumber=1&pageSize=30`);
  }

  setCruces(data: any): Observable<any[]> {
    data.tiquete = data.tiquete.toString();
    data.cedula = data.cedula.toString();
    return this.http.post<any[]>(`${this.apiUrl}/cruces?`, data);
  }

  getComprobantes(id: number): Observable<any[]> {
    this.cedula = this.loginService.getCedula();
    return this.http.get<any[]>(`${this.apiUrl}/comprobantes/${id}`);
  }

}
