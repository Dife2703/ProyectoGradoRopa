
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
/public
  └── /data
      └── prendas.csv       # Dataset de prendas

/src
  ├── /components
  ├── /context
      └── AuthContext.jsx   # Contexto de usuario autenticado
  ├── /pages
      ├── Home.jsx          # Pantalla principal
      ├── SeleccionPrendas.jsx # Página para elegir prendas por categoría
  ├── /services
      └── firebase.js       # Configuración de Firebase
  ├── /utils
      └── categories.js     # Lista de categorías con imagen y nombre
  └── App.jsx               # Rutas principales
```

---

## 🧠 Funcionalidades Actuales

✅ Selección de categoría de prenda (camiseta, camisa, top, pantalones, short, falda/vestido, abrigo)  
✅ Visualización de imágenes según categoría desde el CSV  
✅ Filtro por género (masculino/femenino + unisex)  
✅ Selección de múltiples prendas  
✅ Guardado de prendas seleccionadas en Firestore  
✅ Autenticación de usuario con Firebase  
✅ Responsive y diseño con Tailwind
✅ Recomendaciones basadas en el estado emocional (economía conductual)

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

## 🧪 Próximas Funcionalidades

- 📷 Clasificación automática de ropa por imagen subida
- 💾 Guardado de imágenes en Firebase Storage
- 📊 Página de perfil con historial de preferencias

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
```

Ejecutar el proyecto:

```bash
npm run dev
```

---

## 🧠 Autores

Proyecto desarrollado como parte del trabajo de grado de ingeniería en sistemas:

> **Título**: _Desarrollo de un prototipo de aplicación web para la implementación de un sistema de recomendación de ropa basado en el bienestar emocional del usuario mediante la integración de la economía conductual._

---

## 🛡️ Licencia

Este proyecto está bajo una licencia de uso académico.
