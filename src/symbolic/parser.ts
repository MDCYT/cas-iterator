import type { ASTNode } from "./ast";

// Funciones matemáticas conocidas — se reconocen como token único
const KNOWN_FUNCTIONS = new Set([
  'sqrt', 'sin', 'cos', 'tan', 'log', 'ln', 'exp', 'abs',
  'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh', 'floor', 'ceil', 'round'
]);

// Lexer real: lee carácter a carácter, produce tokens correctos
function tokenize(expr: string): string[] {
  const raw: string[] = [];
  let i = 0;

  while (i < expr.length) {
    const c = expr[i];
    if (c === ' ' || c === '\t') { i++; continue; }

    // Número (entero o decimal)
    if (/\d/.test(c) || (c === '.' && i + 1 < expr.length && /\d/.test(expr[i + 1]))) {
      let num = '';
      while (i < expr.length && (/\d/.test(expr[i]) || expr[i] === '.')) num += expr[i++];
      raw.push(num);
      continue;
    }

    // Palabra: función conocida o variable(s)
    if (/[a-zA-Z_]/.test(c)) {
      let word = '';
      while (i < expr.length && /[a-zA-Z_0-9]/.test(expr[i])) word += expr[i++];
      if (KNOWN_FUNCTIONS.has(word)) {
        // Función conocida → un solo token
        raw.push(word);
      } else {
        // Variables: cada letra es un token separado
        for (const ch of word) raw.push(ch);
      }
      continue;
    }

    // Operador o paréntesis
    raw.push(c);
    i++;
  }

  // Insertar '*' implícito donde corresponde
  const tokens: string[] = [];
  for (let j = 0; j < raw.length; j++) {
    const cur = raw[j];
    const prev = tokens[tokens.length - 1];

    if (prev !== undefined) {
      const prevIsNum   = /^\d/.test(prev);
      const prevIsSym   = /^[a-zA-Z]$/.test(prev); // letra suelta (variable)
      const prevIsFn    = KNOWN_FUNCTIONS.has(prev);
      const prevIsClose = prev === ')';
      const curIsNum    = /^\d/.test(cur);
      const curIsSym    = /^[a-zA-Z]/.test(cur);
      const curIsOpen   = cur === '(';

      // Insertar * entre: (num|sym|)) seguido de (sym|num|()
      // EXCEPTO: función seguida de su '(' de apertura
      const isFnCall = prevIsFn && curIsOpen;
      if (!isFnCall) {
        const needsMul =
          (prevIsNum  && (curIsSym || curIsOpen)) ||
          (prevIsSym  && (curIsSym || curIsOpen || curIsNum)) ||
          (prevIsClose && (curIsSym || curIsOpen || curIsNum));
        if (needsMul) tokens.push('*');
      }
    }

    tokens.push(cur);
  }

  return tokens;
}

// Recursive descent parser for +, -, *, /, ^, functions, parens, numbers, symbols
export function parseExpr(expr: string): ASTNode {
  const tokens = tokenize(expr);
  let pos = 0;

  function peek() { return tokens[pos]; }
  function next() { return tokens[pos++]; }

  function parsePrimary(): ASTNode {
    const t = peek();
    if (!t) throw new Error("Unexpected end");
    if (t === '(') {

      next();
      const node = parseAddSub();
      if (next() !== ')') throw new Error("Expected )");
      return node;
    }
    if (/^-?\d+(\.\d+)?$/.test(t)) {
      next();
      return { type: 'number', value: parseFloat(t) };
    }
    if (/^[a-zA-Z_]\w*$/.test(t)) {
      if (tokens[pos + 1] === '(') {
        const name = next();
        next(); // (
        const first = parseAddSub();
        // Soporte para funciones de 2 argumentos: root(n, x)
        if (peek() === ',') {
          next(); // consume la coma
          const second = parseAddSub();
          if (next() !== ')') throw new Error("Expected ) after function args");
          // Guardamos root(n, x) como func('root', {left: n, right: x})
          // stringify.ts ya lo maneja con node.arg.left y node.arg.right
          return { type: 'func', name, arg: { type: 'add', left: first, right: second } as ASTNode };
        }
        if (next() !== ')') throw new Error("Expected ) after function arg");
        return { type: 'func', name, arg: first };
      } else {
        return { type: 'symbol', name: next() };
      }
    }
    if (t === '-') {
      next();
      return { type: 'neg', arg: parsePrimary() };
    }
    throw new Error("Unexpected token: " + t);
  }

  function parsePow(): ASTNode {
    let node = parsePrimary();
    while (peek() === '^') {
      next();
      node = { type: 'pow', left: node, right: parsePrimary() };
    }
    return node;
  }

  function parseMulDiv(): ASTNode {
    let node = parsePow();
    while (peek() === '*' || peek() === '/') {
      const op = next();
      const right = parsePow();
      node = { type: op === '*' ? 'mul' : 'div', left: node, right };
    }
    return node;
  }

  function parseAddSub(): ASTNode {
    let node = parseMulDiv();
    while (peek() === '+' || peek() === '-') {
      const op = next();
      const right = parseMulDiv();
      node = { type: op === '+' ? 'add' : 'sub', left: node, right };
    }
    return node;
  }

  const ast = parseAddSub();
  if (pos < tokens.length) throw new Error("Unexpected: " + tokens.slice(pos).join(' '));
  return ast;
}