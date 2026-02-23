import { ASTNode } from "./ast";

export function serializeAST(node: ASTNode): string {
  switch (node.type) {
    case 'number':
      return `{number:${node.value}}`;
    case 'symbol':
      return `{symbol:${node.name}}`;
    case 'add':
      return `{add:${serializeAST(node.left)},${serializeAST(node.right)}}`;
    case 'sub':
      return `{sub:${serializeAST(node.left)},${serializeAST(node.right)}}`;
    case 'mul':
      return `{mul:${serializeAST(node.left)},${serializeAST(node.right)}}`;
    case 'div':
      return `{div:${serializeAST(node.left)},${serializeAST(node.right)}}`;
    case 'pow':
      return `{pow:${serializeAST(node.left)},${serializeAST(node.right)}}`;
    case 'neg':
      return `{neg:${serializeAST(node.arg)}}`;
    case 'func':
      return `{func:${node.name},${serializeAST(node.arg)}}`;
    default:
      return `{unknown}`;
  }
}
