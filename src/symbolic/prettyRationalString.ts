// Convierte el diccionario de términos racionales a string bonito
export function prettyRationalString(terms: { [key: string]: number }): string {
  const keys = Object.keys(terms).filter(k => terms[k] !== 0);
  if (keys.length === 0) return '0';
  return keys.map(k => {
    const coef = terms[k];
    if (k === '') return coef.toString();
    // x^-n → 1/x^n
    const match = k.match(/^(\w+)\^(-?\d+)$/);
    if (match) {
      const [_, sym, exp] = match;
      const n = parseInt(exp, 10);
      if (n < 0) {
        const denom = `${sym}^${-n}`;
        if (coef === 1) return `1/${denom}`;
        if (coef === -1) return `-1/${denom}`;
        return `${coef}/${denom}`;
      } else {
        if (coef === 1) return `${sym}^${n}`;
        if (coef === -1) return `-${sym}^${n}`;
        return `${coef}*${sym}^${n}`;
      }
    }
    // x
    if (coef === 1) return k;
    if (coef === -1) return '-' + k;
    return coef + '*' + k;
  }).join(' + ').replace(/\+ -/g, '- ');
}
