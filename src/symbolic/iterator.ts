// Compose a rational function: if f(x) = P(x)/Q(x), then f(g(x)) = P(g(x))/Q(g(x))
function composeRational(base: ASTNode, arg: ASTNode): ASTNode {
  if (base.type === 'div') {
    const num = substitute(base.left, 'x', arg);
    const den = substitute(base.right, 'x', arg);
    return { type: 'div', left: num, right: den };
  }
  // If not a division, fallback to normal substitution
  return substitute(base, 'x', arg);
}
// Collapses an AST to a single rational function: { numerator, denominator }
function toRationalForm(node: ASTNode): { numerator: ASTNode, denominator: ASTNode } {
  // Recursively reduce node to numerator/denominator
  switch (node.type) {
    case 'number':
      return { numerator: node, denominator: { type: 'number', value: 1 } };
    case 'symbol':
      return { numerator: node, denominator: { type: 'number', value: 1 } };
    case 'add': {
      const a = toRationalForm(node.left);
      const b = toRationalForm(node.right);
      return {
        numerator: { type: 'add', left: { type: 'mul', left: a.numerator, right: b.denominator }, right: { type: 'mul', left: b.numerator, right: a.denominator } },
        denominator: { type: 'mul', left: a.denominator, right: b.denominator }
      };
    }
    case 'sub': {
      const a = toRationalForm(node.left);
      const b = toRationalForm(node.right);
      return {
        numerator: { type: 'sub', left: { type: 'mul', left: a.numerator, right: b.denominator }, right: { type: 'mul', left: b.numerator, right: a.denominator } },
        denominator: { type: 'mul', left: a.denominator, right: b.denominator }
      };
    }
    case 'mul': {
      const a = toRationalForm(node.left);
      const b = toRationalForm(node.right);
      return {
        numerator: { type: 'mul', left: a.numerator, right: b.numerator },
        denominator: { type: 'mul', left: a.denominator, right: b.denominator }
      };
    }
    case 'div': {
      const a = toRationalForm(node.left);
      const b = toRationalForm(node.right);
      return {
        numerator: { type: 'mul', left: a.numerator, right: b.denominator },
        denominator: { type: 'mul', left: a.denominator, right: b.numerator }
      };
    }
    case 'pow': {
      const a = toRationalForm(node.left);
      // Only support number exponents for now
      if (node.right.type === 'number') {
        return {
          numerator: { type: 'pow', left: a.numerator, right: node.right },
          denominator: { type: 'pow', left: a.denominator, right: node.right }
        };
      }
      // Fallback: treat as non-rational
      return { numerator: node, denominator: { type: 'number', value: 1 } };
    }
    case 'neg': {
      const a = toRationalForm(node.arg);
      return { numerator: { type: 'neg', arg: a.numerator }, denominator: a.denominator };
    }
    case 'func':
      // Fallback: treat as non-rational
      return { numerator: node, denominator: { type: 'number', value: 1 } };
    default:
      return { numerator: node, denominator: { type: 'number', value: 1 } };
  }
}
import { parseExpr } from "./parser";
import { stringifyMath } from "./stringify";
import { collectTerms, prettyPolyString } from "./collectTerms";
import { collectRationalTerms, prettyRationalString, normalizeRationals } from "./collectRationalTerms";
import { simplify } from "./simplify";
import { extractFactors } from "./extractFactors";
import type { ASTNode } from "./ast";
import { serializeAST } from "./serializeAST";
import { simplifyAST } from "./simplifyAST";
import { composeAST } from "./composeAST";

export class FunctionIteratorAST {
  private base: ASTNode;
  private base_raw: string;

  constructor(func: string) {
    this.base_raw = func;
    this.base = parseExpr(func);
  }

  /**
   * Devuelve un array de objetos con:
   * - raw_string: string original de la iteración
   * - symbols: array de factores/operadores del AST
   * - pretty_string: string simplificado y bonito
   */
  iterate(steps: number) {
    let results: any[] = [];
    let current: ASTNode = parseExpr("x");
    for (let i = 0; i < steps; i++) {
      // Composición pura de nodos AST (sin expandir ni normalizar)
      let composed = composeAST(this.base, current);
      // Simplificación mínima (opcional, solo para limpiar mul(1), etc.)
      let simplified = simplifyAST(composed);
      // Pretty y raw
      let pretty = stringifyMath(simplified);
      let raw = serializeAST(simplified);
      let symbols = extractFactors(simplified);
      current = simplified;
      results.push({
        raw_string: raw,
        symbols: symbols,
        pretty_string: pretty
      });
    }
    return {
      base: {
        raw_string: serializeAST(this.base),
        symbols: extractFactors(this.base),
        pretty_string: stringifyMath(simplify(this.base))
      },
      iterations: results
    };
  }
}
