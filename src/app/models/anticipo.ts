export interface Anticipo {
    cedula: string,
    manifiesto: string,
    detalleAnticipos: Detalle[];
}

export interface Detalle {
    fecha: string,
    placa: string,
    saldo: number,
    valorAnticipo: number
}