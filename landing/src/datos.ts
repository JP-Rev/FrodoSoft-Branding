// Todo el texto que cambia seguido vive aca, no desparramado en el HTML.

// Contacto. Si un campo queda vacio, el boton correspondiente no se muestra.
// ⚠️ Poner un numero o casilla que alguien lea: el CTA de toda la pagina
// termina aca.
export const CONTACTO = {
  // Solo digitos, con codigo de pais y sin el 15: 549XXXXXXXXXX
  whatsapp: '5492346482861',
  email: '', // PENDIENTE: el usuario lo pasa mas adelante
}

export const PRECIO = {
  mensual: 30000,
  diasPrueba: 30,
}

export const formatearPesos = (n: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)
