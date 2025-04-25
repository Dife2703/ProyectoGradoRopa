// pages/SeleccionPrendas.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Papa from "papaparse";


import { db } from "../services/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const SeleccionPrendas = () => {
  const { categoria } = useParams();
  const [prendas, setPrendas] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [genero, setGenero] = useState("");
  const { usuario } = useAuth();
  const normalizarCategoria = (valor) => {
    if (valor === "falda-vestido") return "falda/vestido";
    return valor;
  };

  useEffect(() => {
    console.log("Cargando CSV para categoría:", categoria);
    if (!genero) return;

    fetch("../data/prendas.csv")
      .then((res) => res.text())
      .then((text) => {
        console.log("Texto del CSV cargado:", text.slice(0, 500)); // solo un fragmento
        Papa.parse(text, {
          header: true,
          complete: (results) => {
            const prendasFiltradas = results.data.filter(
              (item) => item.categoria_general?.toLowerCase() === normalizarCategoria(categoria.toLowerCase()) &&
              (
                item.gender?.toLowerCase() === genero ||
                item.gender?.toLowerCase() === "unisex"
              )

            );
            console.log("Categoría URL:", categoria);
            console.log("Prendas filtradas:", prendasFiltradas);

            // Tomamos 12 prendas aleatorias
            const aleatorias = prendasFiltradas
              .sort(() => 0.5 - Math.random())
              .slice(0, 12);

            setPrendas(aleatorias);
          },
        });
      })
      .catch((error) => {
        console.error("Error al cargar el CSV:", error);
      });
  }, [categoria, genero]);

  const toggleSeleccion = (prenda) => {
    const yaSeleccionada = seleccionadas.find((p) => p.id === prenda.id);
    if (yaSeleccionada) {
      setSeleccionadas(seleccionadas.filter((p) => p.id !== prenda.id));
    } else {
      setSeleccionadas([...seleccionadas, prenda]);
    }
  };

  const guardarPreferencias = async () => {
    try {
      const ref = collection(db, "usuarios", usuario.email, "preferencias");
      for (const prenda of seleccionadas) {
        await addDoc(ref, prenda);
      }
      alert("Preferencias guardadas");
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold mb-4 text-center text-red-500">
        Selecciona las prendas que sean de tu agrado
      </h1>
      {!genero && (
        <div className="mb-6 text-center">
          <p className="mb-2 font-semibold text-lg text-gray-800">¿Qué género de prendas deseas ver?</p>
          <button
            onClick={() => setGenero("men")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full mx-2"
          >
            Masculino
          </button>
          <button
            onClick={() => setGenero("women")}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full mx-2"
          >
            Femenino
          </button>
        </div>
      )}



      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {/*prendas.map((prenda) => (
          <div
            key={prenda.id}
            className={`p-2 border rounded-lg cursor-pointer transition-all hover:scale-105 ${
              seleccionadas.find((p) => p.id === prenda.id)
                ? "border-red-500 shadow-md"
                : "border-gray-200"
            }`}
            onClick={() => toggleSeleccion(prenda)}
          >
            <img
              src={prenda.link}
              alt={prenda.productDisplayName}
              className="w-full h-40 object-cover rounded"
            />
            <p className="mt-2 text-sm font-semibold text-center">
              {prenda.productDisplayName}
            </p>
          </div>
        ))*/}
        {prendas.map((prenda) => (
          <div
            key={prenda.id}
            className={`h-[300px] flex flex-col justify-between p-2 border rounded-lg cursor-pointer transition-all hover:scale-105 ${
              seleccionadas.find((p) => p.id === prenda.id)
                ? "border-red-500 shadow-md"
                : "border-gray-200"
            }`}
            onClick={() => toggleSeleccion(prenda)}
          >
            <img
              src={prenda.link}
              alt={prenda.productDisplayName}
              className="w-full h-auto max-h-56 object-contain mx-auto rounded"
            />
            <p className="mt-2 text-sm font-semibold text-center">
              {prenda.productDisplayName}
            </p>
          </div>
        ))}
      </div>

      {seleccionadas.length > 0 && (
        <button
          onClick={guardarPreferencias}
          className="mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-full block mx-auto"
        >
          Guardar Preferencias
        </button>
      )}
    </div>
  );
};

export default SeleccionPrendas;
