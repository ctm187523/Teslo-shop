
//funciones relacionadas a moneda formatea segun pais y moneda
//ademas de ajustar el numero de digitos
export const format = ( value:number) => {

    //crear formateador usando Intl de JavaScript
    const formatter = new Intl.NumberFormat('es', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })

    return formatter.format( value );
}
