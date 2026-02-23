import { ASTNode } from "./ast";

// Expande distributivamente: a*(b + c) => a*b + a*c
export function expand(node: ASTNode): ASTNode {
  switch (node.type) {
    case 'mul': {
      const l = expand(node.left);
      const r = expand(node.right);
      // a*(b + c) => a*b + a*c
      if (r.type === 'add') {
        return { type: 'add', left: expand({ type: 'mul', left: l, right: r.left }), right: expand({ type: 'mul', left: l, right: r.right }) };
      }
      // (a + b)*c => a*c + b*c
      if (l.type === 'add') {
        return { type: 'add', left: expand({ type: 'mul', left: l.left, right: r }), right: expand({ type: 'mul', left: l.right, right: r }) };
      }
      return { type: 'mul', left: l, right: r };
    }
    case 'add':
    case 'sub':
      return { type: node.type, left: expand(node.left), right: expand(node.right) };
    case 'div':
    case 'pow':
      return { type: node.type, left: expand(node.left), right: expand(node.right) };
    case 'neg':
      return { type: 'neg', arg: expand(node.arg) };
    case 'func':
      return { type: 'func', name: node.name, arg: expand(node.arg) };
    default:
      return node;
  }
}
