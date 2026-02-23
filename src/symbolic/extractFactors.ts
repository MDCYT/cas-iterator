import type { ASTNode } from "./ast";

// Extrae todos los factores y operadores de un AST
export function extractFactors(node: ASTNode): string[] {
  switch (node.type) {
    case 'number':
      return [node.value.toString()];
    case 'symbol':
      return [node.name];
    case 'add':
    case 'sub':
    case 'mul':
    case 'div':
    case 'pow':
      return [node.type, ...extractFactors(node.left), ...extractFactors(node.right)];
    case 'neg':
      return ['neg', ...extractFactors(node.arg)];
    case 'func':
      return [node.name, ...extractFactors(node.arg)];
    default:
      return [];
  }
}
