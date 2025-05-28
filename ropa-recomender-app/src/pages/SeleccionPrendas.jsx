import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../services/firebase";
import { collection, doc, getDoc, addDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const SeleccionPrendas = () => {
  const { categoria } = useParams();
  const [prendas, setPrendas] = useState([]);
  const [seleccionadas, setSeleccionadas] = useState([]);
  const [genero, setGenero] = useState("");
  const [emocion, setEmocion] = useState("");
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const normalizarCategoria = (valor) => {
    if (valor === "falda-vestido") return "falda/vestido";
    return valor;
  };

  // Obtener emoción desde Firestore
  useEffect(() => {
    const obtenerEmocion = async () => {
      try {
        if (!usuario?.email) return;

        const docRef = doc(db, "usuarios", usuario.email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const datos = docSnap.data();
          const emocionDetectada = datos.emocionDetectada || "neutral"; // fallback por si acaso
          setEmocion(emocionDetectada.toLowerCase());
        } else {
          console.warn("No se encontró el documento del usuario.");
        }
      } catch (error) {
        console.error("Error al obtener emoción de Firestore:", error);
      }
    };

    obtenerEmocion();
  }, [usuario]);

  // Cargar recomendaciones
  useEffect(() => {
    if (!genero || !emocion) return;
    const url = `http://localhost:8000/api/recommendations/${emocion}?categoria=${normalizarCategoria(categoria)}&gender=${genero}`;
  
    console.log("🔎 URL utilizada para fetch:", url); // Ver la URL construida
    console.log("🎭 Emoción detectada:", emocion);
    console.log("🧍 Género:", genero);
    console.log("📦 Categoría:", normalizarCategoria(categoria));

    fetch(`http://localhost:8000/api/recommendations/${emocion}?categoria=${normalizarCategoria(categoria)}&gender=${genero}`)
      .then((res) => res.json())
      .then((recomendaciones) => {
        console.log("recomendaciones recibidas: ", recomendaciones);
        const mezcladas = shuffleArray(recomendaciones);
        setPrendas(mezcladas);
      })
      .catch((error) => {
        console.error("Error al cargar recomendaciones:", error);
      });
  }, [categoria, genero, emocion]);

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
    // 1. Guardar en Firestore
    const ref = collection(db, "usuarios", usuario.email, "preferencias");
    for (const prenda of seleccionadas) {
      await addDoc(ref, prenda);
    }

    // 2. Enviar al backend también
    const response = await fetch("http://localhost:8000/api/tinder-recommendation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emotion: emocion,
        gender: genero,
        category: categoria
      }),
    });

    const data = await response.json();
    console.log(data.recommendations);

    if (response.ok && data.recommendations) {
      alert("Preferencias guardadas localmente y enviadas al backend");
      console.log("Respuesta backend:", data);
      navigate("/shinder", {
        state: {
          recomendaciones: data.recommendations,
          emotion: emocion
        }
      });
    } else {
      console.error("Error del backend:", data);
    }
  } catch (error) {
    console.error("Error al guardar:", error);
    alert("Error al guardar preferencias");
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