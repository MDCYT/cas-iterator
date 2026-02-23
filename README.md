# Function Iterator

> Explora, visualiza y manipula funciones matemáticas de manera simbólica y gráfica en una aplicación web moderna (creo que esta descripción es un poco pretenciosa, pero bueno).

- como funny fact!: este proyecto fue un reto por un maestro de la prepa, que dijo "a que no hay huevos que haces esto" y pues aquí estamos, haciendo esto.
  Entra aqui: https://galleniz.github.io/cas-iterator/
  ![Logo](src/assets/images/logo.gif)

### IMPORTANTE

Para evitar confusiones, _no_, no esta vibecodeado, no fue hecho con "IA" ni nada por el estilo, todo el código fue escrito por mí, a mano, con mucho amor y café. Así que si encuentras algún error o algo raro, no es culpa de una IA, es culpa mía, así que por favor sé amable al reportarlo.

Documente las cosas con ayuda de Copilot, mas no generé el código con él, así que si ves algo que parece ia slop, ten en cuenta que mucha documentacion la trate de escribir yo, pero le pedi ayuda a Copilot para que quitara las cosas redundantes, fallos de escritura (que, siendo honesta, soy pesima escribiendo) y para que me ayudara a organizar un poco las ideas, pero el código en sí lo escribí yo, así que si ves algo raro, probablemente sea culpa mía, no de una IA.

De cualquier manera, esta sutento a cambio, muchos de los estilos estan en el propio `tsx` porque la verdad no me queria pelear con la page de estilos en el tema de moviles... - (en algunos solamente fue por pendeja, tengo malas costumbres srry!!!)

## Descripción

Function Iterator es una herramienta interactiva para estudiantes, docentes y entusiastas de las matemáticas. Permite trabajar con funciones simbólicas, visualizar sus gráficas y realizar operaciones como simplificación, expansión y sustitución. El proyecto está construido con Bun, React, TypeScript y TailwindCSS, ofreciendo velocidad y una interfaz atractiva.
... o al menos eso es lo que quiero que sea, aún está en desarrollo y no tiene ni la mitad de las funcionalidades mencionadas, pero bueno, el proyecto apenas va empezando y tengo muchas ideas para implementarle, así que esperemos que con el tiempo se convierta en algo realmente útil y divertido para aprender matemáticas.

## Características

- Visualización interactiva de funciones matemáticas
- Manipulación simbólica (simplificar, expandir, sustituir)
- Soporte multilenguaje
- Interfaz accesible y moderna
- Despliegue automático a GitHub Pages

### TODO:

- Implementar el worker para cálculos simbólicos pesados y evitar bloquear el hilo principal.
- Agregar más operaciones simbólicas (derivación, integración, factorización, etc).
- Mejorar la visualización gráfica con más opciones de personalización. (aun no hay graficación, pero quiero hacerla con canvas o WebGL para tener más control y rendimiento).
- Añadir soporte para más idiomas y mejorar la traducción.
- Optimizar el rendimiento y la experiencia de usuario en dispositivos móviles.
- Implementar pruebas unitarias y de integración para asegurar la calidad del código.
- Crear una sección de tutoriales o ejemplos para mostrar las capacidades de la aplicación.
- Y muchas cosas más que se me irán ocurriendo en el camino.

## Instalación

Clona el repositorio e instala dependencias:

```bash
git clone https://github.com/galleniz/cas-iterator
cd cas-iterator
bun install
```

## Uso

Para iniciar el entorno de desarrollo:

```bash
bun dev
```

Para construir el proyecto:

```bash
bun run build
```

## Despliegue

El workflow de GitHub Actions construye el proyecto y publica el contenido de la carpeta `dist` en la rama `pages`. El archivo `robots.txt` se preserva para permitir la indexación por buscadores.

## Estructura del proyecto

```
├── src/
│   ├── App.tsx
│   ├── logic/
│   ├── symbolic/
│   ├── components/
│   └── ...
├── styles/
├── test/
├── bunfig.toml
├── package.json
├── README.md
└── ...
```

## Contribución

¡Las contribuciones son bienvenidas! Por favor, abre un issue o pull request para sugerencias o mejoras.

## Licencia

Este proyecto está bajo la licencia MIT.
