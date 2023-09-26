# Guía Paso a Paso para Replicar el CI de Linting

Esta guía te llevará a través del proceso de replicar nuestro pipeline de CI que realiza un proceso de linting en distintos servicios de nuestro proyecto.

## Prerequisitos
- Tener Node.js 14 instalado.
- Tener npm instalado.
- Tener permisos sobre el repositorio E1-ArquiSis-Front.

## Pasos

### 1. Clonar el Repositorio
Clona el repositorio en el que quieras configurar el CI.

```bash
git clone https://github.com/vicentevegaulloa/E1-ArquiSis-Front.git
cd E1-ArquiSis-Front
```

### 2. Instalar las Dependencias
Navegar al directorio del proyecto e instalar las dependencias.

```bash
cd e1-arquisis
npm install
```

### 3. Ejecutar el Linter
Ejecutar el linter. En el package se ha dejado configurado para que se solucionen automáticamente los problemas que no requieren un arreglo manual.
```bash
npm run lint
```

### 4. Resolver Errores de Lint 
Si el linter encuentra errores, corrígelos y vuelve a ejecutar el linter hasta que no haya errores.

