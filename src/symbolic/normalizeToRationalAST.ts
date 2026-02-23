import type { ASTNode } from "./ast";

// Simplifies a node if both sides are numbers
function simplifyNode(node: ASTNode): ASTNode {
  if (node.type === 'add' || node.type === 'sub' || node.type === 'mul' || node.type === 'div' || node.type === 'pow') {
    const l = simplifyNode(node.left);
    const r = simplifyNode(node.right);
    if (l.type === 'number' && r.type === 'number') {
      switch (node.type) {
        case 'add': return { type: 'number', value: l.value + r.value };
        case 'sub': return { type: 'number', value: l.value - r.value };
        case 'mul': return { type: 'number', value: l.value * r.value };
        case 'div': return { type: 'number', value: l.value / r.value };
        case 'pow': return { type: 'number', value: Math.pow(l.value, r.value) };
      }
    }
    return { ...node, left: l, right: r };
  }
  if (node.type === 'neg') {
    const a = simplifyNode(node.arg);
    if (a.type === 'number') return { type: 'number', value: -a.value };
    return { type: 'neg', arg: a };
  }
  if (node.type === 'func') {
    const a = simplifyNode(node.arg);
    return { ...node, arg: a };
  }
  return node;
}

// Normaliza cualquier AST a la forma div(numerador, denominador)
export function normalizeToRationalAST(ast: ASTNode): ASTNode {
  function helper(node: ASTNode): { num: ASTNode, den: ASTNode } {
    if (node.type === 'div') {
      const l = helper(node.left);
      const r = helper(node.right);
      return {
        num: { type: 'mul', left: l.num, right: r.den },
        den: { type: 'mul', left: l.den, right: r.num }
      };
    }
    if (node.type === 'mul') {
      const l = helper(node.left);
      const r = helper(node.right);
      return {
        num: { type: 'mul', left: l.num, right: r.num },
        den: { type: 'mul', left: l.den, right: r.den }
      };
    }
    if (node.type === 'add' || node.type === 'sub') {
      const l = helper(node.left);
      const r = helper(node.right);
      return {
        num: { type: node.type, left: { type: 'mul', left: l.num, right: r.den }, right: { type: 'mul', left: r.num, right: l.den } },
        den: { type: 'mul', left: l.den, right: r.den }
      };
    }
    if (node.type === 'pow') {
      const l = helper(node.left);
      if (node.right.type === 'number') {
        return {
          num: { type: 'pow', left: l.num, right: node.right },
          den: { type: 'pow', left: l.den, right: node.right }
        };
      }
      // fallback
      return { num: node, den: { type: 'number', value: 1 } };
    }
    if (node.type === 'neg') {
      const a = helper(node.arg);
      return { num: { type: 'neg', arg: a.num }, den: a.den };
    }
    if (node.type === 'func') {
      return { num: node, den: { type: 'number', value: 1 } };
    }
    // number or symbol
    return { num: node, den: { type: 'number', value: 1 } };
  }
  const { num, den } = helper(ast);
  return simplifyNode({ type: 'div', left: num, right: den });
}
