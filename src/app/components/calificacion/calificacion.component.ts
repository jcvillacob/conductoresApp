import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CalificacionService } from 'src/app/services/calificacion.service';

@Component({
  selector: 'app-calificacion',
  templateUrl: './calificacion.component.html',
  styleUrls: ['./calificacion.component.css'],
})
export class CalificacionComponent implements AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  cruces: any[] = [];
  isModalVisible: boolean = false;
  mesAnterior!: string;
  mesActual!: string;
  cumplimiento = 0;
  limite = 70;
  novedades: any[] = [];
  nombresDeMeses = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  constructor(
    private calificacionService: CalificacionService,
    private cdr: ChangeDetectorRef
  ) {
    // Obtener el mes anterior
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth();
    const año =
      mesActual === 0
        ? fechaActual.getFullYear() - 1
        : fechaActual.getFullYear();
    const mesAnterior = mesActual === 0 ? 11 : mesActual - 1;
    this.mesAnterior = this.nombresDeMeses[mesAnterior];
    this.mesActual = this.nombresDeMeses[mesActual];

    // Para las calificaciones
    this.calificacionService.getCruces().subscribe((data: any) => {
      this.cruces = data.data
        // Opcional: convertir Fecha a Date para no hacerlo en cada comparación
        .map((c: any)=> ({ 
          ...c, 
          Fecha: new Date(c.Fecha) 
        }))
        // Orden descendente: de la más reciente a la más antigua
        .sort((a: any, b: any) => 
          (b.Fecha as Date).getTime() - (a.Fecha as Date).getTime()
        );

      this.calificacionService
        .getNovedades(mesAnterior + 1, año)
        .subscribe((datos: any) => {
          this.novedades = datos.data;
          // Suma de cumplimiento
          this.cumplimiento =
            100 -
            this.novedades.reduce((sum, item) => {
              return sum + item.peso;
            }, 0);

          // Crear el gráfico
          this.createChart();

          this.cdr.detectChanges();
        });
    });

    // Para el gráfico
    Chart.register(...registerables);
  }

  ngAfterViewInit() {}

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
              display: true,
            },
            tooltip: {
              enabled: true,
            },
          },
          animation: {
            animateRotate: true,
            animateScale: true,
          },
        },
      });
    }
  }

  get totalValor(): number {
    const currentYear = new Date().getFullYear();

    // Extraemos los meses disponibles en el año actual
    const mesesDelAño = this.cruces
      .filter((c) => c.Año === currentYear)
      .map((c) => c.Mes);

    if (mesesDelAño.length === 0) {
      // No hay datos del año en curso
      return 0;
    }

    // Determinamos el último mes registrado
    const ultimoMes = Math.max(...mesesDelAño);

    // Sumamos solo los valores del último mes del año actual
    return this.cruces
      .filter((c) => c.Año === currentYear && c.Mes === ultimoMes)
      .reduce((acc, c) => acc + c.Valor, 0);
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
