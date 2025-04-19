// src/pages/EstadoAnimo.jsx
import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const EstadoAnimo = () => {
  const { usuario } = useAuth();
  const [estadoAnimo, setEstadoAnimo] = useState("");
  const [energia, setEnergia] = useState("");
  const [colorPreferido, setColorPreferido] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const docRef = doc(db, "usuarios", usuario.email);
    await updateDoc(docRef, {
      estadoAnimo,
      energia,
      colorPreferido,
    });

    navigate("/"); // Luego lo llevamos al Home
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          ¿Cómo te sientes hoy?
        </h2>

        <div className="mb-4">
          <label className="font-semibold">Estado de ánimo:</label>
          <div className="flex flex-col mt-2">
            {["Feliz", "Triste", "Ansioso", "Relajado"].map((op) => (
              <label key={op} className="inline-flex items-center mb-1">
                <input
                  type="radio"
                  name="estado"
                  value={op}
                  checked={estadoAnimo === op}
                  onChange={(e) => setEstadoAnimo(e.target.value)}
                  className="mr-2"
                />
                {op}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="font-semibold">Nivel de energía:</label>
          <div className="flex flex-col mt-2">
            {["Alta", "Media", "Baja"].map((op) => (
              <label key={op} className="inline-flex items-center mb-1">
                <input
                  type="radio"
                  name="energia"
                  value={op}
                  checked={energia === op}
                  onChange={(e) => setEnergia(e.target.value)}
                  className="mr-2"
                />
                {op}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="font-semibold">Color que prefieres hoy:</label>
          <div className="flex flex-col mt-2">
            {["Rojo", "Azul", "Negro", "Amarillo", "Verde"].map((op) => (
              <label key={op} className="inline-flex items-center mb-1">
                <input
                  type="radio"
                  name="color"
                  value={op}
                  checked={colorPreferido === op}
                  onChange={(e) => setColorPreferido(e.target.value)}
                  className="mr-2"
                />
                {op}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={!estadoAnimo || !energia || !colorPreferido}
        >
          Continuar
        </button>
      </form>
    </div>
  );
};

export default EstadoAnimo;