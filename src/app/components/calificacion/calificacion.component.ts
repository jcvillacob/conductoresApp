import { Component, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CalificacionService } from 'src/app/services/calificacion.service';


@Component({
  selector: 'app-calificacion',
  templateUrl: './calificacion.component.html',
  styleUrls: ['./calificacion.component.css']
})
export class CalificacionComponent implements AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  cruces: any[] = [];
  isModalVisible: boolean = false;
  mesAnterior!: string;
  cumplimiento = 0;
  limite = 70;
  novedades: any[] = []

  constructor(private calificacionService: CalificacionService, private cdr: ChangeDetectorRef) {
    // Obtener el mes anterior
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth();
    const año = mesActual === 0  ? fechaActual.getFullYear() -1 : fechaActual.getFullYear();
    const mesAnterior = mesActual === 0 ? 11 : mesActual - 1;
    const nombresDeMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    this.mesAnterior = nombresDeMeses[mesAnterior];

    // Para las calificaciones
    this.calificacionService.getCruces().subscribe(data => {
      this.cruces = data;
      this.calificacionService.getNovedades(mesAnterior+1, año).subscribe((datos: any) => {
        this.novedades = datos.data;
        // Suma de cumplimiento
        this.cumplimiento = 100 - this.novedades.reduce((sum, item) => {
          return sum + (item.peso);
        }, 0);

        // Crear el gráfico
        this.createChart();

        this.cdr.detectChanges();
      })

    });

    // Para el gráfico
    Chart.register(...registerables);
  }

  ngAfterViewInit() {
  }

  createChart() {
    const context = this.chartCanvas.nativeElement.getContext('2d');
    if (context) {
      const cumplimiento = this.cumplimiento;
      const limite = this.limite;
      const color = cumplimiento < limite ? '#bf0412' : '#10B981';

      new Chart(context, {
        type: 'doughnut',
        data: {
          datasets: [
            {
              data: [cumplimiento, 100 - cumplimiento],
              backgroundColor: [color, '#D1D5DB'],
              borderWidth: 0,
            },
          ],
        },
        options: {
          circumference: 180,
          rotation: -90,
          cutout: '70%',
          plugins: {
            legend: {
              display: true
            },
            tooltip: {
              enabled: true
            }
          },
          animation: {
            animateRotate: true,
            animateScale: true
          }
        },
      });
    }
  }

  get totalValor() {
    return this.cruces.reduce((acc, cruce) => acc + cruce.Valor, 0);
  }

  descargarComprobante() {
    const Id = this.cruces[0].Comprobante;
    this.calificacionService.getComprobantes(Id).subscribe((data: any) => {
      const byteArray = new Uint8Array(data.Documento.data);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      const blobUrl = URL.createObjectURL(blob);

      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.setAttribute('download', 'comprobante.pdf');
      document.body.appendChild(downloadLink);
      downloadLink.click();

      URL.revokeObjectURL(blobUrl);
      document.body.removeChild(downloadLink);
    });
  }
}
