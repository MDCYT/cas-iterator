import { ASTNode } from "./ast";

// Sustituye todas las ocurrencias de una variable por un subárbol
export function substitute(node: ASTNode, symbol: string, replacement: ASTNode): ASTNode {
  switch (node.type) {
    case 'symbol':
      return node.name === symbol ? replacement : node;
    case 'number':
      return node;
    case 'add':
    case 'sub':
    case 'mul':
    case 'div':
    case 'pow':
      return {
        type: node.type,
        left: substitute(node.left, symbol, replacement),
        right: substitute(node.right, symbol, replacement),
      };
    case 'neg':
      return { type: 'neg', arg: substitute(node.arg, symbol, replacement) };
    case 'func':
      return { type: 'func', name: node.name, arg: substitute(node.arg, symbol, replacement) };
    default:
      throw new Error('Unknown node type: ' + (node as any).type);
  }
}
