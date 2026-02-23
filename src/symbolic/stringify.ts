import { ASTNode } from "./ast";

// Notación matemática natural: sin * para multiplicación, mejor uso de paréntesis
export function stringifyMath(node: ASTNode): string {
  function parens(child: ASTNode, parentType: string): string {
    if (parentType === 'mul' || parentType === 'div') {
      if (child.type === 'add' || child.type === 'sub') return `(${stringifyMath(child)})`;
    }
    if (parentType === 'pow') {
      if (child.type !== 'number' && child.type !== 'symbol') return `(${stringifyMath(child)})`;
    }
    return stringifyMath(child);
  }

  function mulStr(left: ASTNode, right: ASTNode): string {
    const l = parens(left, 'mul');
    const r = parens(right, 'mul');
    // Número seguido de símbolo o expresión: "5x", "5(x+1)"
    if (left.type === 'number') return `${l}${r}`;
    // Símbolo seguido de símbolo o potencia: "xy", "xx^2" — pero necesita * para claridad
    // si ambos son símbolos o el derecho es número, separar con *
    if (right.type === 'number') return `${l}*${r}`;
    // símbolo * símbolo → "xy"
    if (left.type === 'symbol' && right.type === 'symbol') return `${l}${r}`;
    // símbolo * mul → "x(5y)" puede ser ambiguo, mejor con separador visual implícito
    if (left.type === 'symbol') return `${l}${r}`;
    // todo lo demás: usar *
    return `${l}*${r}`;
  }

  switch (node.type) {
    case 'number':
      return node.value.toString();
    case 'symbol':
      return node.name;
    case 'add':
      return `(${stringifyMath(node.left)} + ${stringifyMath(node.right)})`;
    case 'sub':
      return `(${stringifyMath(node.left)} - ${stringifyMath(node.right)})`;
    case 'mul':
      return mulStr(node.left, node.right);
    case 'div':
      return `${parens(node.left, 'div')}/${parens(node.right, 'div')}`;
    case 'pow': {
      const base = parens(node.left, 'pow');
      const expStr = parens(node.right, 'pow');
      // Si el exponente tiene más de un carácter, envolver en {} para LaTeX
      const exp = expStr.length === 1 ? expStr : `{${expStr}}`;
      return `${base}^${exp}`;
    }
    case 'neg':
      return `(-${stringifyMath(node.arg)})`;
    case 'func':
      // Soporte para sqrt y root
      if (node.name === 'sqrt') {
        return `\\sqrt{${stringifyMath(node.arg)}}`;
      }
      if (node.name === 'root') {
        // node.arg debe ser { type: 'add', left: índice, right: radicando } o similar
        // Por simplicidad, soportar root(arg, n) como root(n, arg)
        if (node.arg && node.arg.type === 'add' && node.arg.left && node.arg.right) {
          return `\\sqrt[${stringifyMath(node.arg.left)}]{${stringifyMath(node.arg.right)}}`;
        }
        // fallback: root(arg)
        return `\\sqrt{${stringifyMath(node.arg)}}`;
      }
      return `${node.name}(${stringifyMath(node.arg)})`;
    default:
      throw new Error('Unknown node type: ' + (node as any).type);
  }
}