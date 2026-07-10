// Definimos los códigos postales válidos
export const codigosPostalesValidos = {
  'CAPITAL_FEDERAL': {
    inicio: 1000,
    fin: 1499
  },
  'GBA_NORTE': {
    inicio: 1500,
    fin: 1699
  }
};

export const validarCodigoPostal = (cp: number): boolean => {
  // Validar Capital Federal
  if (cp >= codigosPostalesValidos.CAPITAL_FEDERAL.inicio && 
      cp <= codigosPostalesValidos.CAPITAL_FEDERAL.fin) {
    return true;
  }
  
  // Validar GBA Norte
  if (cp >= codigosPostalesValidos.GBA_NORTE.inicio && 
      cp <= codigosPostalesValidos.GBA_NORTE.fin) {
    return true;
  }

  return false;
}; 