# 🧩 Sudoku Web App

Aplicación web de Sudoku desarrollada con HTML, CSS y JavaScript puro.  
Incluye generador automático, múltiples niveles, temporizador y validación en tiempo real.

---

## 🚀 Características

- ✅ Generador automático de tablero válido
- ✅ 4 niveles de dificultad (Fácil, Normal, Medio, Difícil)
- ✅ Validación en tiempo real (errores en rojo)
- ✅ Temporizador automático
- ✅ Pausa y reanudación
- ✅ Botón para comprobar solución
- ✅ Opción para resolver automáticamente
- ✅ Reinicio de partida con confirmación
- ✅ Interfaz moderna y responsive

---

## 🛠 Tecnologías utilizadas

- HTML5
- CSS3 (Grid + Responsive)
- JavaScript Vanilla (sin librerías)

---

## 📂 Estructura del proyecto

sudoku/
│
├── index.html
├── style.css
└── script.js

---

## ▶️ Cómo usar

1. Clona el repositorio:

git clone https://github.com/TU-USUARIO/sudoku.git

2. Abre el archivo `index.html` en tu navegador

O súbelo a GitHub Pages para jugar online.

---

## 🧠 Cómo funciona

### Generación del tablero
- Se crea primero un tablero completo válido usando backtracking
- Luego se eliminan números según la dificultad seleccionada
- Cada partida es diferente

### Validación
- Se verifica fila, columna y subcuadrícula 3x3
- Los errores se muestran automáticamente en rojo

### Temporizador
- Inicia al comenzar partida
- Se puede pausar sin reiniciar el tiempo
- Se detiene al completar correctamente el Sudoku

---

## 📌 Mejoras futuras

- Sistema de puntuación
- Guardado automático de partida
- Estadísticas por nivel
- Sonidos y animaciones
- Modo oscuro/claro

---

## 👨‍💻 Autor

Desarrollado por Luis Santos  
Proyecto práctico de JavaScript
