import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { LoginService } from 'src/app/services/login.service';
import { Gasto } from 'src/app/models/gasto';

@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.component.html',
  styleUrls: ['./gastos.component.css'],
})
export class GastosComponent implements OnInit {
  datosPersonales: any = {};
  loader: boolean = true;
  gastos: Gasto[] = [];
  gastos_mensual: Gasto[] = [];
  gastosP: Gasto[] = [];
  mes!: string;
  mesActual!: number;
  anoActual!: number;
  modalB: boolean = false;
  paraPDF: number = -1;
  paraPDF2: number = -1;
  mesesEnEspanol = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
    'enero',
    'febrero',
    'marzo',
  ];
  mesEscoger!: number;
  noEncontrado: boolean = false;

  constructor(private dataService: DataService, private loginService: LoginService) {
    const fechaActual = new Date();
    this.mesActual = fechaActual.getMonth();
    console.log(this.mesActual);
    if (this.mesActual <= 2) {
      this.mesEscoger = 12 + this.mesActual;
    } else {
      this.mesEscoger = this.mesActual;
    }
    this.anoActual = fechaActual.getFullYear();
    this.mes = this.mesesEnEspanol[this.mesActual];
  }

  ngOnInit(): void {
    this.datosPersonales = this.loginService.getDatos();
    this.dataService.getGastos().subscribe((data) => {
      this.gastos = data;
      this.gastos_mensual = this.gastos.filter((gasto) => new Date(gasto.fechaLiquidacion).getMonth() === this.mesActual);
      this.loader = false;
      if (this.gastos_mensual.length == 0) {
        this.noEncontrado = true;
      }
    }, error => {
      if (this.gastos_mensual.length == 0) {
        this.noEncontrado = true;
        setTimeout(() => {
          this.loader = false;
        }, 1000)
      }
    });
  }

  modal() {
    this.modalB = !this.modalB;
  }

  selectedMonth() {
    if (this.paraPDF2 != -1) {
      this.paraPDF = Number(this.paraPDF2);
      if (this.paraPDF2 > 11) {
        this.paraPDF = this.paraPDF2 - 12;
      } else {
        const fechaActual = new Date();
        this.anoActual = fechaActual.getFullYear();
        this.anoActual = this.anoActual - 1;
      }
      this.gastosP = this.gastos.filter((gasto) => {
        const fechaGasto = new Date(gasto.fechaLiquidacion);
        const mesGasto = fechaGasto.getMonth();
        return mesGasto === this.paraPDF;
      });
      console.log(this.anoActual);
    } else {
      this.gastosP = [];
    }
  }

  exportPDF() {
    if (this.paraPDF != -1) {
      const doc = new jsPDF('l');
      // Agregar imagen
      doc.addImage('assets/PlantillaPDF/superior_logo.png', 'PNG', 239, 0, 60, 30);
      doc.addImage('assets/PlantillaPDF/inferior_logo.png', 'PNG', 249, 170, 60, 60);
      doc.addImage('assets/PlantillaPDF/nit.png', 'PNG', 1, 110, 7, 42);

      const formatNumber = (num: number) => {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
      };

      const formatDate = (date: Date) => {
        let day = ('0' + date.getDate()).slice(-2);
        let month = ('0' + (date.getMonth() + 1)).slice(-2);
        let year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };

      // Configurar tamaño de fuente
      doc.setFontSize(22);
      doc.text('CERTIFICADO DE LEGALIZACIONES', 25, 45);
      doc.setFontSize(18);
      doc.text(formatDate(new Date()), 225, 45);

      // Divide el texto en líneas
      const textoLargo = `Por medio de la presente hacemos constar que el señor ${this.datosPersonales.nombre} con cédula de Ciudadanía número ${this.datosPersonales.cedula} realizó en el mes de ${this.mesesEnEspanol[this.paraPDF]} de ${this.anoActual} las siguientes legalizaciones de anticipos:`;
      const textoDividido = doc.splitTextToSize(textoLargo, 370);
      // Cambiar tamaño de fuente
      doc.setFontSize(12);
      // Agregar más texto
      doc.text(textoDividido, 30, 60);
      doc.text("Cordialmente,", 30, 200);

      let subTotales = { vrAnticipo: 0, vrGasto: 0, vrBonificacion: 0, vrAlcance: 0, bonI_40: 0, rentA_60: 0 };
      let data = [];

      for (let gasto of this.gastosP) {
        data.push([
          gasto.manifiesto,
          gasto.ruta,
          gasto.placa,
          formatNumber(gasto.vrAnticipo),
          formatNumber(gasto.vrGasto),
          formatNumber(gasto.vrBonificacion),
          formatNumber(gasto.vrAlcance),
          formatNumber(gasto.bonI_40),
          formatNumber(gasto.rentA_60),
          formatDate(new Date(gasto.fechaManifiesto)),
          formatDate(new Date(gasto.fechaLiquidacion)),
        ]);

        subTotales.vrAnticipo += gasto.vrAnticipo;
        subTotales.vrGasto += gasto.vrGasto;
        subTotales.vrBonificacion += gasto.vrBonificacion;
        subTotales.vrAlcance += gasto.vrAlcance;
        subTotales.bonI_40 += gasto.bonI_40;
        subTotales.rentA_60 += gasto.rentA_60;
      }

      // Añadir fila de subtotales al final
      data.push([
        '', '', '', '', '', '', '', '', '', '', ''
      ]);

      // Añadir fila de subtotales al final
      data.push([
        '', '', '',
        formatNumber(subTotales.vrAnticipo),
        formatNumber(subTotales.vrGasto),
        formatNumber(subTotales.vrBonificacion),
        formatNumber(subTotales.vrAlcance),
        formatNumber(subTotales.bonI_40),
        formatNumber(subTotales.rentA_60),
        '', ''
      ]);

      autoTable(doc, {
        startY: 75,
        head: [
          [
            'Manifiesto',
            'Ruta',
            'Placa',
            'Valor Anticipo',
            'Valor Gasto',
            'Valor Bonificación',
            'Valor Alcance',
            'Bonificación (40%)',
            'Renta (60%)',
            'Fecha Manifiesto',
            'Fecha Liquidación',
          ],
        ],
        body: data,
        styles: { fontSize: 9, cellPadding: 1, lineColor: [44, 62, 80], lineWidth: 0.15 },
        columnStyles: {
          0: { cellWidth: 'auto', halign: 'center' },
        },
        headStyles: { fillColor: [0, 41, 48], valign: 'middle' },
        theme: 'grid',
        didDrawCell: (data) => {
          // Cambia el estilo de la última celda de la primera columna
          if (data.section === 'body' && data.column.index <= 2 && data.row.index === data.table.body.length - 1) {
            doc.setFillColor(238, 44, 55); // Color de fondo rojo
            doc.setTextColor(255, 255, 255); // Color de texto blanco
            doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F'); // Dibuja el fondo
            doc.text('', data.cell.x + data.cell.width / 2, data.cell.y + data.cell.height / 2, { align: 'center', baseline: 'middle' }); // Dibuja el texto centrado
          }
          if (data.section === 'body' && data.column.index === 1 && data.row.index === data.table.body.length - 1) {
            doc.text('Subtotales', data.cell.x + data.cell.width / 2, data.cell.y + data.cell.height / 2, { align: 'center', baseline: 'middle' }); // Dibuja el texto centrado
          }
        },
      });

      doc.save('resumenLegalizaciones.pdf');
    }
  }
}
