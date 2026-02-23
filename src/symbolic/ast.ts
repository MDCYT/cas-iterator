// AST node types for a symbolic math engine
export type ASTNode =
  | { type: 'number'; value: number }
  | { type: 'symbol'; name: string }
  | { type: 'add' | 'sub' | 'mul' | 'div' | 'pow'; left: ASTNode; right: ASTNode }
  | { type: 'neg'; arg: ASTNode }
  | { type: 'func'; name: string; arg: ASTNode };
