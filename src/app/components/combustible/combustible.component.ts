import { Component } from '@angular/core';
import { CalificacionService } from 'src/app/services/calificacion.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-combustible',
  templateUrl: './combustible.component.html',
  styleUrls: ['./combustible.component.css']
})
export class CombustibleComponent {
  excelData: any[] = [];
  envio: boolean = false;
  columnNames: string[] = ['tiquete', 'cedula', 'placa', 'fecha', 'ruta', 'km', 'glsEds', 'glsInsite', 'diferencia', 'operacion', 'valor', 'mes', 'año'];

  constructor(private calificacionService: CalificacionService) { }

  ngOnInit(): void {
  }

  onFileChange(evt: any): void {
    this.envio = false;
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) throw new Error('Cannot use multiple files');

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      const data: any[] = XLSX.utils.sheet_to_json(ws, { header: 1 });

      const rows = data.slice(1);

      this.excelData = rows.map((row: any) => {
        // Confirmamos a TypeScript que 'row' es un array de 'any'.
        const arrayRow = row as any[];
        let obj: any = {};
        arrayRow.forEach((value, index) => {
          if (this.columnNames[index] === 'fecha' && typeof value === 'number') {
            // Convertir el serial de Excel a una fecha JS
            obj[this.columnNames[index]] = this.convertExcelDateToJSDate(value);
          } else {
            obj[this.columnNames[index]] = value;
          }
        });
        return obj;
      });
    };

    reader.readAsBinaryString(target.files[0]);
  }

  convertExcelDateToJSDate(serial: number): Date {
    const utc_days  = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    return new Date(utc_value * 1000);
  }

  onSubmit() {
    let c = 0;
    for (let dato of this.excelData) {
      this.calificacionService.setCruces(dato).subscribe(data => {
        c = c + 1;
        console.log(data);
        if (c = this.excelData.length) {
          this.excelData = [];
          this.envio = true;
        }
      })
    }


  }
}
