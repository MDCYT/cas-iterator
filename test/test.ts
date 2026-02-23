import { FunctionIteratorAST } from "../src/symbolic/iterator";

const tests = [
	{ expr: "2*x+3", label: "Lineal simple" },
	{ expr: "1/x", label: "Fracción recíproca" },
	{ expr: "sqrt(4*x+2)", label: "Raíz cuadrada" },
	{ expr: "4*x^4+3", label: "Polinomio grado 4" },
	{ expr: "x^2+2*x+1", label: "Cuadrática completa" },
	{ expr: "sin(x)", label: "Seno" },
	{ expr: "exp(x)", label: "Exponencial" },
	{ expr: "log(x+1)", label: "Logaritmo" },
	{ expr: "abs(x-5)", label: "Valor absoluto" },
	{ expr: "x/(x+1)", label: "Fracción racional" },
];

for (const { expr, label } of tests) {
	const itAST = new FunctionIteratorAST(expr);
	const res = itAST.iterate(3);
	console.log(`--- ${label} (AST) ---`);
	console.log(`f(x) = ${expr}`);
	console.log('Base:', res.base);
	res.iterations.forEach((iter, i) => {
		console.log(`Iteración ${i + 1}:`);
		console.log('  raw_string:', iter.raw_string);
		// console.log('  symbols:', iter.symbols);
		console.log('  pretty_string:', iter.pretty_string);
	});
}