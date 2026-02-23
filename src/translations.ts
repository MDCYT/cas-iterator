export const translations = {
  en: {
    credits: "* CREDITS",
    madeWith: "Made with",
    poweredBy: "Powered by",
    createdBy: "Created by a cool transgender girl",
    close: "❯ CLOSE",
    iterations: "ITERATIONS:",
    calculate: "❯ CALCULATE",
    error: "Error",
    formulaPrompt: "f(x) =",
    placeholder: "type here...",
    baseFormula: "f(x) =",
    iterHeader: "* ITERATIONS:",
    iteration: "Iteration",
    method: "Method",
    send: "Send",
    responsePlaceholder: "Response will appear here...",
    toby_credit: "Assets from UT/DR by",
    aboutTitle: "What does this page do?",
    aboutContent: `This page implements a symbolic function iterator.<br /><br />
      Its purpose is to take a mathematical function <b>f(x)</b> and compute its iterations:<br />
      <b>f<sup>(1)</sup>(x), f<sup>(2)</sup>(x), f<sup>(3)</sup>(x), …</b><br /><br />
      where each iteration consists of composing the function with itself:<br />
      <b>f<sup>(2)</sup>(x) = f(f(x))</b><br />
      <b>f<sup>(3)</sup>(x) = f(f(f(x)))</b><br /><br />
      <b>How does it work internally?</b><br />
      The page does not work with plain text. It uses a structure called AST (Abstract Syntax Tree).<br />
      An AST represents a mathematical expression as a structured tree.<br />
      For example: <b>x+1</b> is not stored as the text "x+1", but as:<br />
      <ul style='margin:8px 0 8px 18px'>
        <li>sum node</li>
        <li>left child: symbol <b>x</b></li>
        <li>right child: number <b>1</b></li>
      </ul>
      This allows correct substitution of <b>x</b> by another expression, composing functions without text errors, and handling powers, fractions, roots, and functions like sin, log, exp, etc.<br /><br />
      <b>What happens when iterating?</b><br />
      When an iteration is calculated:<br />
      <ul style='margin:8px 0 8px 18px'>
        <li>The original AST of the function is taken.</li>
        <li>Each occurrence of the symbol <b>x</b> is replaced by the previous full expression.</li>
        <li>A new structured tree is generated.</li>
        <li>The symbolic result is shown.</li>
      </ul>
      For example, if <b>f(x) = 2x+3</b>, then:<br />
      <b>f<sup>(2)</sup>(x) = 2(2x+3)+3</b><br />
      The system builds that result symbolically, not by text replacement.<br /><br />
      <b>What types of functions are supported?</b><br />
      The iterator works with:<br />
      <ul style='margin:8px 0 8px 18px'>
        <li>Linear functions</li>
        <li>Polynomials of any degree</li>
        <li>Rational fractions</li>
        <li>Powers like x<sup>x</sup>, x<sup>n</sup></li>
        <li>Trigonometric functions</li>
        <li>Logarithms</li>
        <li>Exponentials</li>
        <li>Roots</li>
        <li>Absolute value</li>
      </ul>
      <b>What doesn't it do?</b><br />
      <ul style='margin:8px 0 8px 18px'>
        <li>It does not automatically simplify expressions</li>
        <li>It does not evaluate numerically (only works symbolically)</li>
        <li>It does not solve equations</li>
        <li>Its focus is exclusively symbolic iterative composition</li>
      </ul>
      <b>What is it for?</b><br />
      It allows you to visualize how functions grow under iteration, which is useful in topics like:<br />
      <ul style='margin:8px 0 8px 18px'>
        <li>Dynamical systems</li>
        <li>Exponential growth</li>
        <li>Function stability</li>
        <li>Iterative behavior analysis</li>
      </ul>`
  },
  es: {
    credits: "* CRÉDITOS",
    madeWith: "Hecho con",
    poweredBy: "Impulsado por",
    createdBy: "Creado por una chica trans genial",
    close: "❯ CERRAR",
    iterations: "ITERACIONES:",
    calculate: "❯ CALCULAR",
    error: "Error",
    formulaPrompt: "f(x) =",
    placeholder: "escribe aquí...",
    baseFormula: "f(x) =",
    iterHeader: "* ITERACIONES:",
    iteration: "Iteración",
    method: "Método",
    toby_credit: "Assets de UT/DR por",
    send: "Enviar",
    responsePlaceholder: "La respuesta aparecerá aquí...",
    aboutTitle: "¿Qué hace esta página?",
    aboutContent: `Esta página implementa un iterador simbólico de funciones.<br /><br />
      Su propósito es tomar una función matemática <b>f(x)</b> y calcular sus iteraciones:<br />
      <b>f<sup>(1)</sup>(x), f<sup>(2)</sup>(x), f<sup>(3)</sup>(x), …</b><br /><br />
      donde cada iteración consiste en componer la función consigo misma:<br />
      <b>f<sup>(2)</sup>(x) = f(f(x))</b><br />
      <b>f<sup>(3)</sup>(x) = f(f(f(x)))</b><br /><br />
      <b>¿Cómo funciona internamente?</b><br />
      La página no trabaja con texto plano. Utiliza una estructura llamada AST (Abstract Syntax Tree).<br />
      Un AST representa una expresión matemática como un árbol estructurado.<br />
      Por ejemplo: <b>x+1</b> no se guarda como texto "x+1", sino como:<br />
      <ul style='margin:8px 0 8px 18px'>
        <li>nodo suma</li>
        <li>hijo izquierdo: símbolo <b>x</b></li>
        <li>hijo derecho: número <b>1</b></li>
      </ul>
      Esto permite sustituir correctamente <b>x</b> por otra expresión, componer funciones sin errores de texto, y manejar potencias, fracciones, raíces y funciones como sin, log, exp, etc.<br /><br />
      <b>¿Qué hace al iterar?</b><br />
      Cuando se calcula una iteración:<br />
      <ul style='margin:8px 0 8px 18px'>
        <li>Se toma el AST original de la función.</li>
        <li>Se reemplaza cada aparición del símbolo <b>x</b> por la expresión completa anterior.</li>
        <li>Se genera un nuevo árbol estructurado.</li>
        <li>Se muestra el resultado simbólico.</li>
      </ul>
      Por ejemplo, si <b>f(x) = 2x+3</b>, entonces:<br />
      <b>f<sup>(2)</sup>(x) = 2(2x+3)+3</b><br />
      El sistema construye ese resultado simbólicamente, no por reemplazo de texto.<br /><br />
      <b>¿Qué tipo de funciones soporta?</b><br />
      El iterador funciona con:<br />
      <ul style='margin:8px 0 8px 18px'>
        <li>Funciones lineales</li>
        <li>Polinomios de cualquier grado</li>
        <li>Fracciones racionales</li>
        <li>Potencias como x<sup>x</sup>, x<sup>n</sup></li>
        <li>Funciones trigonométricas</li>
        <li>Logaritmos</li>
        <li>Exponenciales</li>
        <li>Raíces</li>
        <li>Valor absoluto</li>
      </ul>
      <b>¿Qué no hace?</b><br />
      <ul style='margin:8px 0 8px 18px'>
        <li>No simplifica automáticamente las expresiones</li>
        <li>No evalúa numéricamente (solo trabaja simbólicamente)</li>
        <li>No resuelve ecuaciones</li>
        <li>Su enfoque es exclusivamente la composición simbólica iterativa</li>
      </ul>
      <b>¿Para qué sirve?</b><br />
      Permite visualizar cómo crecen las funciones bajo iteración, lo cual es útil en temas como:<br />
      <ul style='margin:8px 0 8px 18px'>
        <li>Sistemas dinámicos</li>
        <li>Crecimiento exponencial</li>
        <li>Estabilidad de funciones</li>
        <li>Análisis de comportamiento iterativo</li>
      </ul>`
  },
};
export const FUNC_TOOLTIPS = {
        en: {
          sin: {
            title: "Sine",
            desc: "Returns the sine of x (in radians).",
            context: "Useful for trigonometric calculations.",
            example: "sin(π/2) -> 1"
          },
          cos: {
            title: "Cosine",
            desc: "Returns the cosine of x (in radians).",
            context: "Useful for trigonometric calculations.",
            example: "cos(0) -> 1"
          },
          tan: {
            title: "Tangent",
            desc: "Returns the tangent of x (in radians).",
            context: "Useful for trigonometric calculations.",
            example: "tan(π/4) -> 1"
          },
          log: {
            title: "Logarithm",
            desc: "Returns the base-10 logarithm of x.",
            context: "Useful for scientific notation and scaling.",
            example: "log(100) -> 2"
          },
          ln: {
            title: "Natural log",
            desc: "Returns the natural logarithm (base e) of x.",
            context: "Useful for exponential growth/decay.",
            example: "ln(e) -> 1"
          },
          exp: {
            title: "Exponential",
            desc: "Returns e raised to the power x.",
            context: "Useful for exponential growth/decay.",
            example: "exp(1) -> e"
          },
          abs: {
            title: "Absolute value",
            desc: "Returns the non-negative value of x.",
            context: "Useful for distances and magnitudes.",
            example: "abs(-5) -> 5"
          },
          x: {
            title: "Variable x",
            desc: "The input variable for your function.",
            context: "Represents the value being transformed.",
            example: "f(x) = x + 1"
          },
          ".": {
            title: "Decimal point",
            desc: "The amazing separation between decimals and integers!",
            context: "Use to enter decimal numbers.",
            example: "3.14"
          },
          "√": {
            title: "Square root",
            desc: "Returns the square root of x.",
            context: "Useful for roots and radicals.",
            example: "sqrt(9) -> 3"
          },
          "∛": {
            title: "Cube root",
            desc: "Returns the cube root of x.",
            context: "Useful for roots and radicals.",
            example: "root(3,8) -> 2"
          },
          "^": {
            title: "Exponentiation",
            desc: "Raises a number to a power.",
            context: "Use for powers and roots.",
            example: "x^2"
          }
        },
        es: {
          sin: {
            title: "Seno",
            desc: "Devuelve el seno de x (en radianes).",
            context: "Útil para cálculos trigonométricos.",
            example: "sin(π/2) -> 1"
          },
          cos: {
            title: "Coseno",
            desc: "Devuelve el coseno de x (en radianes).",
            context: "Útil para cálculos trigonométricos.",
            example: "cos(0) -> 1"
          },
          tan: {
            title: "Tangente",
            desc: "Devuelve la tangente de x (en radianes).",
            context: "Útil para cálculos trigonométricos.",
            example: "tan(π/4) -> 1"
          },
          log: {
            title: "Logaritmo",
            desc: "Devuelve el logaritmo en base 10 de x.",
            context: "Útil para notación científica y escalas.",
            example: "log(100) -> 2"
          },
          ln: {
            title: "Logaritmo natural",
            desc: "Devuelve el logaritmo natural (base e) de x.",
            context: "Útil para crecimiento/decadencia exponencial.",
            example: "ln(e) -> 1"
          },
          exp: {
            title: "Exponencial",
            desc: "Devuelve e elevado a la potencia x.",
            context: "Útil para crecimiento/decadencia exponencial.",
            example: "exp(1) -> e"
          },
          abs: {
            title: "Valor absoluto",
            desc: "Devuelve el valor no negativo de x.",
            context: "Útil para distancias y magnitudes.",
            example: "abs(-5) -> 5"
          },
          x: {
            title: "Variable x",
            desc: "La variable de entrada para tu función.",
            context: "Representa el valor que se transforma.",
            example: "f(x) = x + 1"
          },
          ".": {
            title: "Punto decimal",
            desc: "¡La asombrosa separación entre lo decimal y lo entero!",
            context: "Úsalo para ingresar números decimales.",
            example: "3.14"
          },
          "√": {
            title: "Raíz cuadrada",
            desc: "Devuelve la raíz cuadrada de x.",
            context: "Útil para raíces y radicales.",
            example: "sqrt(9) -> 3"
          },
          "∛": {
            title: "Raíz cúbica",
            desc: "Devuelve la raíz cúbica de x.",
            context: "Útil para raíces y radicales.",
            example: "root(3,8) -> 2"
          },
          "^": {
            title: "Potenciación",
            desc: "Eleva un número a una potencia.",
            context: "Úsalo para potencias y raíces.",
            example: "x^2"
          }
        }
};
export const  CONCEPTS: Record<string, Record<string, string>> = {
  en: {
    AST: "Abstract Syntax Tree: a structured representation of mathematical expressions.",
    iteration: "Applying a function repeatedly to its own output.",
    iterate: "To apply a function again and again.",
    symbolic: "Manipulating expressions as symbols, not numbers.",
    "dynamical systems": "Mathematical systems describing how things change over time.",
    "exponential growth": "Growth that increases rapidly, proportional to its current value.",
    "function stability": "Whether repeated application of a function leads to steady behavior.",
    composition: "Combining functions by feeding the output of one into another.",
    polynomial: "An expression made of powers of x with coefficients.",
    "rational fraction": "A ratio of two polynomials.",
    trigonometric: "Functions like sin, cos, tan.",
    logarithm: "The inverse of exponentiation.",
    exponential: "A function where the variable is in the exponent.",
    root: "A function extracting the nth root of a value.",
    "absolute value": "A function returning the magnitude of a number.",
  },
  es: {
    AST: "Árbol de Sintaxis Abstracta: representación estructurada de expresiones matemáticas.",
    "iteración": "Aplicar una función repetidamente a su propio resultado.",
    "iteraciones": "Aplicar una función repetidamente a su propio resultado.",
    "iterar": "Aplicar una función una y otra vez, usando el resultado anterior como entrada.",
    "simbólico": "Manipular expresiones como símbolos, no números.",
    "sistemas dinámicos": "Sistemas que describen cómo cambian las cosas en el tiempo.",
    "crecimiento exponencial": "Crecimiento proporcional a su valor actual. Ejemplo: 2, 4, 8, 16…",
    "estabilidad de funciones": "Si la aplicación repetida de una función lleva a comportamiento estable.",
    "composición": "Combinar funciones: f(g(x)).",
    "polinomios": "Expresión con potencia de x. Ejemplo: 2x² + 3x + 1.",
    "rational fraction": "Razón de dos polinomios. Ejemplo: (x²+1)/(x-3).",
    "trigonométricas": "Funciones como seno, coseno, tangente.",
    "logaritmos": "Inverso de la exponenciación.",
    "exponenciales": "Función donde la variabilidad está en el exponente. Ejemplo: e^x.",
    "Raíces": "Raíz n de un valor. Ejemplo: √x.",
    "valor absoluto": "Magnitud de un número, ignorando el signo. |x|.",
    "funciones lineales": "Función de la forma ax+b.",
    "fracciones": "División de dos valores.",
    "potencias": "Expresión como x^n.",
    sin: "Función seno.",
    cos: "Función coseno.",
    tan: "Función tangente.",
    log: "Logaritmo.",
    exp: "Función exponencial.",
    absolute: "Valor absoluto.",
    substitution: "Reemplazar una variable por una expresión.",
    variable: "Símbolo que representa un valor.",
    coefficient: "Número que multiplica una variable.",
    inverse: "Operación opuesta.",
    output: "Resultado de una función.",
    input: "Valor dado a una función.",
  "estabilidad": "Resistencia al cambio.",
  },
};