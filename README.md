
# 👕 Sistema de Recomendación de Prendas

Este proyecto es un prototipo de aplicación web que permite recomendar ropa basada en categorías visuales y el bienestar emocional del usuario. Utiliza React para el frontend, Firebase para la autenticación y almacenamiento, y un archivo CSV como dataset principal para mostrar prendas.

## 🚀 Tecnologías Usadas

- ⚛️ React + Vite
- 🔥 Firebase (Auth + Firestore + Storage)
- 📦 PapaParse (para leer CSV)
- 🖼️ TailwindCSS (estilos)
- 📄 CSV como fuente de datos (ubicado en `/public/data/prendas.csv`)

---

## 📁 Estructura del Proyecto

```
ROPA-RECOMENDER-APP/
├── public/
│   └── data/
│       └── prendas.csv     # Dataset de prendas
│
├── models/                 # Modelos de detección facial y emociones
├── src/
│   ├── assets/
│   ├── components/         # Componentes reutilizables (Navbar, Layout, PrivateRoute)
│   ├── context/            # Contexto de autenticación
│   ├── pages/              # Páginas principales (Login, Registro, Home, Shinder, etc.)
│   ├── services/           # Configuración de Firebase
│   ├── styles/             # Estilos CSS
│   └── utils/              # Funciones auxiliares (lectura CSV, categorías)
│
├── App.jsx                 # Punto de entrada principal
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🧠 Funcionalidades Actuales

- ✅ Selección de categoría de prenda (camiseta, camisa, top, pantalones, short, falda/vestido, abrigo)
- ✅ Visualización de imágenes según categoría desde el CSV
- ✅ Filtro por género (masculino/femenino + unisex)
- ✅ Selección de múltiples prendas
- ✅ Guardado de prendas seleccionadas en Firestore
- ✅ Autenticación de usuario con Firebase
- ✅ Responsive y diseño con Tailwind CSS
- ✅ Recomendaciones basadas en el estado emocional (economía conductual)
- ✅ Formulario de captura emocional mediante cámara para generar recomendaciones personalizadas de ropa

## 🔄 Funcionalidades Adicionales

- ✅ Sistema de recomendación estilo Tinder: desliza prendas con animaciones al dar Like ❤️ o Dislike ❌
- ✅ Control de múltiples clics: prevención de conteo duplicado al hacer spam en los botones
- ✅ Indicadores visuales animados: íconos grandes (❤️ y ❌) al dar like/dislike
- ✅ Animaciones suaves entre tarjetas y precarga de imágenes para transición fluida
- ✅ Pantalla final con GIF aleatorio y llamado a llenar un formulario de satisfacción (Google Forms)
- ✅ Registro de usuarios que ya llenaron el formulario para no volver a mostrarlo

---

## 🗂️ CSV

El archivo `prendas.csv` debe estar en la carpeta `/public/data/`.

Columnas esperadas:

- `categoria_general`: Categoría general de la prenda (ej: camiseta, pantalon, etc.)
- `productDisplayName`: Nombre visible del producto
- `link`: URL de imagen de la prenda
- `gender`: Género de la prenda (`men`, `women`, `unisex`, etc.)

---

## 🔐 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto y configura tus claves de Firebase:

```env
VITE_API_KEY=TU_API_KEY
VITE_AUTH_DOMAIN=TU_DOMINIO.firebaseapp.com
VITE_PROJECT_ID=TU_ID_DEL_PROYECTO
VITE_STORAGE_BUCKET=TU_BUCKET.appspot.com
VITE_MESSAGING_SENDER_ID=TU_SENDER_ID
VITE_APP_ID=TU_APP_ID
```

---

## 🧪 Próximas Funcionalidades Pensadas

- 📷 Clasificación automática de ropa por imagen subida
- 💾 Guardado de imágenes en Firebase Storage

---

## 👨‍💻 Desarrollo

Instalación de dependencias:

```bash
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install firebase
npm install firebase@latest
npm install react-router-dom
npm install papaparse
npm install -g firebase-tools
```

Ejecutar el proyecto:

```bash
npm run dev
```

---

## 🧠 Autores

Proyecto desarrollado como parte del trabajo de grado de ingeniería en sistemas:

> **Título**: _Desarrollo de un prototipo de aplicación web para la implementación de un sistema de recomendación de ropa basado en el bienestar emocional del usuario mediante la integración de la economía conductual._

**Desarrolladores**:
- Diego Llanos  ([GitHub](https://github.com/Dife2703/ProyectoGradoRopa))
- Jordi Ledesma ([GitHub](https://github.com/GeordiCode/SmartWear-AI-backend))
---

## 🛡️ Licencia

Este proyecto está bajo una licencia de uso académico.
