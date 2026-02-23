import { ASTNode } from "./ast";

// Composición pura: sustituye 'x' por arg, sin expandir ni simplificar
export function composeAST(base: ASTNode, arg: ASTNode): ASTNode {
  switch (base.type) {
    case 'symbol':
      if (base.name === 'x') return arg;
      return base;
    case 'number':
      return base;
    case 'add':
      return { type: 'add', left: composeAST(base.left, arg), right: composeAST(base.right, arg) };
    case 'sub':
      return { type: 'sub', left: composeAST(base.left, arg), right: composeAST(base.right, arg) };
    case 'mul':
      return { type: 'mul', left: composeAST(base.left, arg), right: composeAST(base.right, arg) };
    case 'div':
      return { type: 'div', left: composeAST(base.left, arg), right: composeAST(base.right, arg) };
    case 'pow':
      return { type: 'pow', left: composeAST(base.left, arg), right: composeAST(base.right, arg) };
    case 'neg':
      return { type: 'neg', arg: composeAST(base.arg, arg) };
    case 'func':
      return { type: 'func', name: base.name, arg: composeAST(base.arg, arg) };
    default:
      return base;
  }
}
