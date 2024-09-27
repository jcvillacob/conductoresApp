import { Component } from '@angular/core';
import { CalificacionService } from 'src/app/services/calificacion.service';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styleUrls: ['./ingreso.component.css']
})
export class IngresoComponent {
  /* Para los select */
  years: number[] = [2023, 2024, 2025, 2026];
  meses: string[] = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  novedades: any[] = [];

  // Para el Formulario
  year: number = 2024;
  month: number = 1;
  cedula: string = '';
  novedad!: number;
  descripcion: string = '';

  constructor (private calificacionService: CalificacionService) {
    this.calificacionService.getListaNovedades().subscribe(data => {
      this.novedades = data;
    });
  }

  onSubmit(): void {
    const usuario = prompt('Ingrese su usuario:');
    const contraseña = prompt('Ingrese su contraseña:');

    if (usuario === 'mtorres' && contraseña === 'mtorres2024') {
      const data = { "año": this.year, "mes": this.month, "cedula": this.cedula, "novedad": this.novedad, "descripcion": this.descripcion };
      this.calificacionService.setNovedades(data).subscribe(dato => {
        console.log(dato);
        console.log('Autenticación exitosa');
      })
    } else {
      console.log('Acceso denegado');
      alert('Usuario o contraseña incorrecta');
    }
  }
}
