import { ASTNode } from "./ast";

// Serialización simple para comparar si dos nodos son estructuralmente iguales
function serializeForCompare(node: ASTNode): string {
  switch (node.type) {
    case 'number': return `n:${node.value}`;
    case 'symbol': return `s:${node.name}`;
    case 'neg': return `neg(${serializeForCompare(node.arg)})`;
    case 'func': return `${node.name}(${serializeForCompare(node.arg)})`;
    default:
      if ('left' in node && 'right' in node)
        return `${node.type}(${serializeForCompare(node.left)},${serializeForCompare(node.right)})`;
      return node.type;
  }
}

// Obtiene la base canónica de un nodo para agrupar potencias
function getBase(node: ASTNode): string {
  if (node.type === 'symbol') return node.name;
  if (node.type === 'pow' && node.left.type === 'symbol') return node.left.name;
  return JSON.stringify(node); // fallback: usa serialización completa
}

// Obtiene el exponente numérico de un nodo (1 si no es pow)
function getExp(node: ASTNode): number | null {
  if (node.type === 'symbol') return 1;
  if (node.type === 'pow' && node.right.type === 'number') return node.right.value;
  return null; // exponente no numérico, no combinar
}

// Combina x^a * x^b → x^(a+b) en una lista de factores
function combineExpFactors(factors: ASTNode[]): ASTNode[] {
  const expMap = new Map<string, { base: ASTNode; exp: number }>();
  const nonCombinables: ASTNode[] = [];

  for (const f of factors) {
    const base = getBase(f);
    const exp = getExp(f);
    if (exp !== null) {
      const baseNode = f.type === 'pow' ? f.left : f;
      if (expMap.has(base)) {
        expMap.get(base)!.exp += exp;
      } else {
        expMap.set(base, { base: baseNode, exp });
      }
    } else {
      nonCombinables.push(f);
    }
  }

  const result: ASTNode[] = [];
  for (const { base, exp } of expMap.values()) {
    if (exp === 0) continue; // x^0 = 1, omitir
    if (exp === 1) result.push(base);
    else result.push({ type: 'pow', left: base, right: { type: 'number', value: exp } });
  }
  return [...result, ...nonCombinables];
}

// Aplana todos los factores de una cadena de mul
function flattenMul(node: ASTNode): ASTNode[] {
  if (node.type === 'mul') return [...flattenMul(node.left), ...flattenMul(node.right)];
  return [node];
}

export function simplifyAST(node: ASTNode): ASTNode {
  switch (node.type) {
    case 'mul': {
      // Primero simplificar recursivamente
      const factors = flattenMul(node).map(simplifyAST);

      // Colapsar todos los números en un solo coeficiente
      let coef = 1;
      const rest: ASTNode[] = [];
      for (const f of factors) {
        if (f.type === 'number') coef *= f.value;
        else rest.push(f);
      }

      if (coef === 0) return { type: 'number', value: 0 };
      if (rest.length === 0) return { type: 'number', value: coef };

      // Combinar x^a * x^b → x^(a+b) entre los factores simbólicos
      const combined = combineExpFactors(rest);

      // Reconstruir: coef * rest[0] * rest[1] * ...
      if (combined.length === 0) return { type: 'number', value: coef };
      const restNode = combined.reduce((a, b) => ({ type: 'mul', left: a, right: b } as ASTNode));
      if (coef === 1) return restNode;
      return { type: 'mul', left: { type: 'number', value: coef }, right: restNode };
    }
    case 'add': {
      const left = simplifyAST(node.left);
      const right = simplifyAST(node.right);
      if (left.type === 'number' && left.value === 0) return right;
      if (right.type === 'number' && right.value === 0) return left;
      // Colapsar números
      if (left.type === 'number' && right.type === 'number')
        return { type: 'number', value: left.value + right.value };
      return { type: 'add', left, right };
    }
    case 'sub': {
      const left = simplifyAST(node.left);
      const right = simplifyAST(node.right);
      if (right.type === 'number' && right.value === 0) return left;
      if (left.type === 'number' && right.type === 'number')
        return { type: 'number', value: left.value - right.value };
      return { type: 'sub', left, right };
    }
    case 'div': {
      const left = simplifyAST(node.left);
      const right = simplifyAST(node.right);
      // x / 1 = x
      if (right.type === 'number' && right.value === 1) return left;
      // 0 / x = 0
      if (left.type === 'number' && left.value === 0) return { type: 'number', value: 0 };
      // número / número
      if (left.type === 'number' && right.type === 'number' && right.value !== 0)
        return { type: 'number', value: left.value / right.value };
      // x / x = 1 (misma estructura)
      if (serializeForCompare(left) === serializeForCompare(right))
        return { type: 'number', value: 1 };
      // a / (b / c) = (a * c) / b
      if (right.type === 'div') {
        return simplifyAST({
          type: 'div',
          left: { type: 'mul', left, right: right.right },
          right: right.left
        });
      }
      // (a / b) / c = a / (b * c)
      if (left.type === 'div') {
        return simplifyAST({
          type: 'div',
          left: left.left,
          right: { type: 'mul', left: left.right, right }
        });
      }
      return { type: 'div', left, right };
    }
    case 'neg': {
      const arg = simplifyAST(node.arg);
      if (arg.type === 'number') return { type: 'number', value: -arg.value };
      return { type: 'neg', arg };
    }
    case 'pow': {
      const left = simplifyAST(node.left);
      const right = simplifyAST(node.right);
      if (right.type === 'number' && right.value === 1) return left;
      if (right.type === 'number' && right.value === 0) return { type: 'number', value: 1 };
      if (left.type === 'number' && right.type === 'number')
        return { type: 'number', value: Math.pow(left.value, right.value) };
      // (x^a)^b → x^(a*b)
      if (left.type === 'pow') {
        const newExp = simplifyAST({ type: 'mul', left: left.right, right });
        return simplifyAST({ type: 'pow', left: left.left, right: newExp });
      }
      return { type: 'pow', left, right };
    }
    case 'func': {
      const arg = simplifyAST(node.arg);
      return { type: 'func', name: node.name, arg };
    }
    default:
      return node;
  }
}