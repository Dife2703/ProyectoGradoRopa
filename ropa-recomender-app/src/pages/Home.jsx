/*
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";



export default function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth).then(() => navigate("/login"));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50">
      <h1 className="text-3xl font-bold mb-4">¡Bienvenido a la app!</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
*/


// src/pages/Home.jsx
import { useState } from "react";
import { categories } from "../utils/categories";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleContinue = () => {
    if (selectedCategory || selectedImage) {
      navigate("/next", {
        state: {
          category: selectedCategory,
          image: selectedImage,
        },
      });
    } else {
      alert("Por favor selecciona una categoría o sube una imagen.");
    }
  };

  const handleLogout = () => {
    signOut(auth).then(() => navigate("/login"));
  };

  return (
    <div className="min-h-screen bg-purple-50 p-6 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-red-500">
          ¿Qué tipo de prenda buscas hoy?
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Cerrar sesión
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-4">Categorías</h2>
      
          {/*
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mb-8">
            {categories.map((item) => (
              <button
                key={item.name}
                onClick={() => handleCategorySelect(item.name)}
                className={`p-2 rounded-xl border-2 hover:scale-105 transition-all duration-300 ${
                  selectedCategory === item.name
                    ? "border-red-500"
                    : "border-transparent"
                }`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-32 object-contain"
                />
                <p className="text-sm mt-2">{item.name}</p>
              </button>
            ))}

              
              <label className="flex flex-col items-center justify-center p-4 bg-red-400 text-white rounded-xl cursor-pointer">
                <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                <span className="text-xl">📷</span>
                <p className="text-sm mt-1">Subir Imagen</p>
              </label>
            </div>

          */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 lg:gap-2 mb-8">
          {categories.map((item) => (
            <button
              key={item.name}
              onClick={() => handleCategorySelect(item.name)}
              className={`p-1 rounded-lg border-2 transition-transform duration-300 hover:scale-105 ${
                selectedCategory === item.name
                  ? "border-red-500"
                  : "border-transparent"
              }`}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full aspect-square object-cover rounded-md"
              />
              <p className="text-sm mt-1 text-center">{item.name}</p>
            </button>
          ))}

          {/* Opción para subir imagen */}
          <label className="flex flex-col items-center justify-center p-4 bg-red-400 text-white rounded-xl cursor-pointer aspect-square">
            <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
            <span className="text-xl">📷</span>
            <p className="text-sm mt-1 text-center">Subir Imagen</p>
          </label>
        </div>

      




      {selectedImage && (
        <div className="mb-4">
          <p className="font-semibold mb-2">Imagen seleccionada:</p>
          <img
            src={selectedImage}
            alt="preview"
            className="h-40 rounded-xl border"
          />
        </div>
      )}

      <button
        onClick={handleContinue}
        className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-full self-center"
      >
        Siguiente
      </button>
    </div>
  );
};

export default Home;
